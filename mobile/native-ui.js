(() => {
  'use strict';
  const plugin = () => window.Capacitor?.Plugins?.StoreRewards;
  const AGE_KEY = 'd6x8-ad-adult-choice';
  let busy = false;
  function ageChoice() { try { return localStorage.getItem(AGE_KEY); } catch { return null; } }
  function remember(value) { try { localStorage.setItem(AGE_KEY, value); } catch {} }
  function button(text, action) {
    const b = document.createElement('button'); b.textContent = text; b.onclick = action; return b;
  }
  function paragraph(text) { const p = document.createElement('p'); p.textContent = text; return p; }
  function policy() {
    const a = document.createElement('a'); a.textContent = 'Privacy policy';
    a.href = 'https://github.com/1droxion/d6x8-store-tycoon/blob/main/store-assets/PRIVACY.md';
    a.target = '_blank'; a.rel = 'noopener noreferrer'; return a;
  }
  async function rewardsScreen() {
    const wrap = document.createElement('div');
    if (window.Capacitor?.getPlatform?.() === 'ios') {
      wrap.append(paragraph('Your city and store progress are saved on this device. This iPhone and iPad release is single-player and includes no ads or in-app purchases.'), policy());
      show('Privacy & game info', wrap, 'phone'); return;
    }
    wrap.append(paragraph('Your city and store progress are saved on this device. Online multiplayer is not available in this Android release.'));
    wrap.append(paragraph('OPTIONAL REWARD · Watch an ad to earn 100 store cash. This is fictional in-game currency, cannot be withdrawn, and has no real-money value. You can play the entire core game without watching ads.'));
    if (!plugin()) { wrap.append(paragraph('Rewarded ads are available only in the Android app.')); }
    else if (ageChoice() !== 'adult') {
      wrap.append(paragraph('Optional ads are offered only to players who confirm they are 18 or older. Choose your age group; your answer stays on this device.'));
      wrap.append(button('I am 18 or older · Enable optional ads', async () => { remember('adult'); await prepare(); }),
        button('Under 18 / Prefer not to say · Continue without ads', () => { remember('no-ads'); show('Play without ads', '<p>You can continue playing without ads. No ad reward was granted.</p>', 'phone'); }));
    } else {
      wrap.append(button('Prepare optional reward ad', prepare));
      const watch = button('Watch ad · +100 store cash', async () => {
        if (busy) return;
        busy = true; watch.disabled = true;
        try {
          const result = await plugin().show();
          if (result.earned === true && result.cashCents === 10000) {
            s.cash += 10000; save(); updateHUD(); toast('+100 store cash added.');
          } else { toast('Ad closed without a reward.'); }
        } catch (error) { toast(error.message || 'No ad is available. Keep playing and try later.'); }
        finally { busy = false; await rewardsScreen(); }
      });
      watch.disabled = true;
      wrap.append(watch);
      try {
        const status = await plugin().status();
        watch.disabled = busy || !status.ready || status.cooldownMs > 0;
        wrap.append(paragraph(status.cooldownMs > 0 ? 'Next optional reward in ' + Math.ceil(status.cooldownMs / 60000) + ' minute(s).' : status.ready ? 'An optional ad is ready. The reward is granted only after completion.' : 'No ad is ready. Tap Prepare, then Refresh. Ads may be unavailable in your region or while offline.'));
        if (status.testMode) wrap.append(paragraph('TEST BUILD · Test ads do not generate revenue.'));
      } catch { wrap.append(paragraph('Ads are temporarily unavailable. You can keep playing.')); }
      wrap.append(button('Refresh ad availability', rewardsScreen), button('Ad privacy choices', async () => {
        try { await plugin().privacy(); await rewardsScreen(); } catch (error) { toast(error.message || 'Privacy options unavailable.'); }
      }), button('Disable optional ads on this device', async () => { remember('no-ads'); try { await plugin().disable(); } catch {} rewardsScreen(); }));
    }
    wrap.append(policy()); show('Rewards & privacy', wrap, 'phone');
  }
  async function prepare() {
    if (busy || !plugin() || ageChoice() !== 'adult') return;
    busy = true;
    try { await plugin().prepare({ adult: true }); toast('Checking optional ad availability…'); }
    catch (error) { toast(error.message || 'Ads unavailable. You can continue playing.'); }
    finally { busy = false; await rewardsScreen(); }
  }
  window.addEventListener('DOMContentLoaded', () => { window.onlineScreen = rewardsScreen; });
})();
