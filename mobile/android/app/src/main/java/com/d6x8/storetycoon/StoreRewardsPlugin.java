package com.d6x8.storetycoon;

import android.content.SharedPreferences;
import androidx.annotation.NonNull;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.android.gms.ads.AdError;
import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.FullScreenContentCallback;
import com.google.android.gms.ads.LoadAdError;
import com.google.android.gms.ads.MobileAds;
import com.google.android.gms.ads.RequestConfiguration;
import com.google.android.gms.ads.rewarded.RewardedAd;
import com.google.android.gms.ads.rewarded.RewardedAdLoadCallback;
import com.google.android.ump.ConsentInformation;
import com.google.android.ump.ConsentRequestParameters;
import com.google.android.ump.UserMessagingPlatform;

@CapacitorPlugin(name = "StoreRewards")
public class StoreRewardsPlugin extends Plugin {
    private static final String TEST_UNIT = "ca-app-pub-3940256099942544/5224354917";
    private static final String LIVE_UNIT = "ca-app-pub-5910990392461459/2393917901";
    private static final long COOLDOWN_MS = 300000;
    private ConsentInformation consent;
    private RewardedAd rewarded;
    private boolean initializing, initialized, loading, showing, adult;
    private long loadedAt;
    private SharedPreferences prefs() { return getContext().getSharedPreferences("store_rewards", 0); }
    private long remaining() { return Math.max(0, COOLDOWN_MS - (System.currentTimeMillis() - prefs().getLong("last_reward", 0))); }
    private JSObject state() {
        JSObject out = new JSObject();
        out.put("ready", rewarded != null && System.currentTimeMillis() - loadedAt < 3500000);
        out.put("loading", loading);
        out.put("cooldownMs", remaining());
        out.put("testMode", BuildConfig.DEBUG);
        out.put("privacyRequired", consent != null && consent.getPrivacyOptionsRequirementStatus() == ConsentInformation.PrivacyOptionsRequirementStatus.REQUIRED);
        return out;
    }
    @Override public void load() {
        consent = UserMessagingPlatform.getConsentInformation(getContext());
    }
    @PluginMethod public void status(PluginCall call) { getActivity().runOnUiThread(() -> call.resolve(state())); }
    @PluginMethod public void prepare(PluginCall call) {
        getActivity().runOnUiThread(() -> {
            adult = Boolean.TRUE.equals(call.getBoolean("adult", false));
            if (!adult) { rewarded = null; call.reject("Optional ads are available only to players who confirm they are 18 or older."); return; }
            if (initializing || loading || showing) { call.resolve(state()); return; }
            if (initialized && consent.canRequestAds()) { loadAd(); call.resolve(state()); return; }
            initializing = true;
            ConsentRequestParameters params = new ConsentRequestParameters.Builder().build();
            consent.requestConsentInfoUpdate(getActivity(), params,
                () -> UserMessagingPlatform.loadAndShowConsentFormIfRequired(getActivity(), error -> initializeAfterConsent(call)),
                error -> initializeAfterConsent(call));
        });
    }
    private void initializeAfterConsent(PluginCall call) {
        initializing = false;
        if (!adult || !consent.canRequestAds()) { call.reject("Ads are unavailable. You can keep playing without ads."); return; }
        if (initialized) { loadAd(); call.resolve(state()); return; }
        initializing = true;
        MobileAds.setRequestConfiguration(new RequestConfiguration.Builder()
            .setMaxAdContentRating(RequestConfiguration.MAX_AD_CONTENT_RATING_T).build());
        new Thread(() -> MobileAds.initialize(getContext(), status -> getActivity().runOnUiThread(() -> {
            initialized = true; initializing = false; loadAd(); call.resolve(state());
        }))).start();
    }
    private void loadAd() {
        if (!adult || !initialized || !consent.canRequestAds() || loading || showing) return;
        if (rewarded != null && System.currentTimeMillis() - loadedAt < 3500000) return;
        rewarded = null; loading = true;
        RewardedAd.load(getContext(), BuildConfig.DEBUG ? TEST_UNIT : LIVE_UNIT, new AdRequest.Builder().build(), new RewardedAdLoadCallback() {
            @Override public void onAdLoaded(@NonNull RewardedAd ad) { loading = false; rewarded = adult ? ad : null; loadedAt = System.currentTimeMillis(); }
            @Override public void onAdFailedToLoad(@NonNull LoadAdError error) { loading = false; rewarded = null; }
        });
    }
    @PluginMethod public void show(PluginCall call) {
        getActivity().runOnUiThread(() -> {
            if (!adult || !consent.canRequestAds()) { call.reject("Ads are unavailable."); return; }
            if (remaining() > 0) { call.reject("Your next optional reward will be available in a few minutes."); return; }
            if (showing || rewarded == null || System.currentTimeMillis() - loadedAt >= 3500000) {
                rewarded = null; loadAd(); call.reject("No ad is ready. Please try again later."); return;
            }
            RewardedAd ad = rewarded; rewarded = null; showing = true;
            final boolean[] earned = {false};
            ad.setFullScreenContentCallback(new FullScreenContentCallback() {
                @Override public void onAdDismissedFullScreenContent() {
                    showing = false;
                    JSObject out = new JSObject(); out.put("earned", earned[0]); out.put("cashCents", earned[0] ? 10000 : 0);
                    call.resolve(out); loadAd();
                }
                @Override public void onAdFailedToShowFullScreenContent(@NonNull AdError error) {
                    showing = false; call.reject("Ad could not be shown. No reward was granted."); loadAd();
                }
            });
            ad.show(getActivity(), reward -> {
                if (!earned[0]) { earned[0] = true; prefs().edit().putLong("last_reward", System.currentTimeMillis()).apply(); }
            });
        });
    }
    @PluginMethod public void disable(PluginCall call) {
        getActivity().runOnUiThread(() -> { adult = false; rewarded = null; call.resolve(state()); });
    }
    @PluginMethod public void privacy(PluginCall call) {
        getActivity().runOnUiThread(() -> {
            if (consent.getPrivacyOptionsRequirementStatus() != ConsentInformation.PrivacyOptionsRequirementStatus.REQUIRED) { call.resolve(state()); return; }
            rewarded = null;
            UserMessagingPlatform.showPrivacyOptionsForm(getActivity(), error -> {
                if (error != null) call.reject("Privacy options are temporarily unavailable.");
                else call.resolve(state());
            });
        });
    }
    @Override protected void handleOnDestroy() { rewarded = null; }
}
