# Android preview and release

App: D6X8 Store Tycoon. Package: `com.d6x8.storetycoon`.

The native shell packages `public/game` locally with Capacitor 8.5.3. It does
not load the hosted site. Progress stays in the Android WebView storage.
The Android release has no online login or billing SDK. Optional rewarded
ads use Google Mobile Ads and UMP consent. Debug uses Google test IDs; release
uses the owner's AdMob IDs. Existing browser saves do not transfer.
See store-assets/RELEASE-STATUS.md for remaining release prerequisites.

## Build

Use Node 24, Java 21, Android SDK 36 and current Android build tools.

```
cd mobile
npm ci --ignore-scripts
npm run sync
cd android
./gradlew assembleDebug bundleRelease lintDebug
```

The GitHub **Android preview** workflow produces an installable debug APK,
an **unsigned** release AAB and an Android lint report. A successful build is
not a Google Play submission. Do not upload an unsigned bundle to Play.

## Before submission

1. Test the APK on real Android hardware: first run, controls, WebGL rendering,
   rotation, resume after backgrounding, long sessions, save/reload and upgrades.
2. Replace the generated Capacitor placeholder launcher/splash assets with the
   approved game branding; use actual gameplay for store screenshots.
3. Connect and test monetization before describing ads or purchases as available.
4. Provide a public privacy policy matching the actual release, support contact,
   store graphics, content rating, target audience and Data safety declarations.
5. Create/import an upload signing key in Android Studio or the trusted build
   provider. Keep the key/passwords out of Git. Enable Play App Signing in the
   Play Console flow and retain the upload key securely for future updates.
6. Generate a signed release bundle, upload to internal testing, review results,
   then complete the Play production release and submit for review.

Increase versionCode for every subsequent uploaded bundle. This initial
release is versionCode 2 / versionName 1.0.1. Generated storefront branding replaces the default launcher art.
