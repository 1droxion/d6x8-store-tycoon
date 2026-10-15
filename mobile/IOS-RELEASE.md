# Store Tycoon: City Life — iOS release

Bundle ID: `com.d6x8.storetycoon`. Version: `1.0.1`. Devices: iPhone and iPad, iOS 15+.

This is a separate app from Droxion Live. Do not replace Droxion Live's app record or bundle ID.

The first iOS version includes the local single-player game. No native advertising SDK, tracking, multiplayer, account creation, or purchases are enabled. Android rewarded ads remain Android-only. iOS monetization requires a future native integration and corresponding App Store privacy disclosures.

## Build validation

`npm ci --ignore-scripts && npm run sync:ios` in `mobile` prepares the Xcode project.
The GitHub iOS workflow builds an unsigned simulator app on macOS. A passing simulator build does not establish on-device performance, App Store approval, or signed distribution readiness.

## App Store setup

1. Register an explicit Apple bundle ID `com.d6x8.storetycoon` in the existing Apple Developer team.
2. Create a new iOS app record in App Store Connect: name `Store Tycoon: City Life`, primary language English (US), bundle ID above, SKU `d6x8-storetycoon-ios`.
3. In Codemagic, add repository `1droxion/d6x8-store-tycoon`, branch `main`. Select the `ios-app-store` workflow from the root `codemagic.yaml`.
4. Configure the existing App Store Connect integration with reference name `codemagic`, or change that reference to the actual integration name. Supply a matching distribution certificate and provisioning profile through Codemagic's secure code signing settings. Never place certificates, API keys, or passwords in Git or chat.
5. Start the workflow. It signs the IPA and uploads it for TestFlight. It does not submit the public listing automatically.
6. Test on real iPhone/iPad hardware: launch, touch controls, store transactions, stocker, save/relaunch, city view, orientation, safe areas, and performance. Capture real iPhone and iPad screenshots at App Store accepted sizes.
7. Add the build, screenshots, description, privacy policy, support details, age rating, availability, and App Privacy answers to the new App Store app record. The Android ads paragraph must not be included in the iOS listing. Review the final app's dependencies before declaring Data Not Collected.
8. Submit this new game for Apple review after checks pass. Public availability follows Apple's approval and the selected release setting.

The included app icon is an opaque 1024×1024 PNG. The launch screen uses the same artwork. No tracking permission prompt is included because this iOS version has no ad/tracking integration.
