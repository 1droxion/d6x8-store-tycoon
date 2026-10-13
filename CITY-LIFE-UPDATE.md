# D6X8 city life update

## Play the new features

- Checkout: scan the basket, accept cash, then select **Return exact change**. The receipt records the correct amount and duplicate clicks cannot pay twice.
- Phone → **Go home**: arrive outside your starter home, walk through the doorway, then use **My home** or look at the bed, sofa or TV and interact.
- Sleep restores energy after six seconds. **Stand up** or Space returns to walking. TV has three animated in-game channels; change channels with the TV button.
- Phone → **City guide**: cafes/restaurants and the vehicle depot are listed. Restaurant interactions open a menu of burgers, pizza, salad and coffee. Meals cost fictional game money and replenish needs.
- Look at a nearby person and interact, or use **Talk nearby** on the phone. Four conversational topics have random built-in replies. Nearby people occasionally greet you automatically. No paid AI calls are used.
- Run with R, Shift or the Run button. The gamepad left-stick button toggles running; B stands up at home.
- The depot supplies a bicycle, scooter, motorbike, truck and bus. Walk close and press F / Enter vehicle. Use movement buttons or WASD to drive, stop, then exit. The original owner car remains available at the store.

## City activity

Fifteen additional routes cover seven horizontal and eight vertical city roads, with cars, scooters, motorbikes, trucks and buses. Thirty additional pedestrians walk those routes. Existing district traffic, cyclists, civic staff and streamed-neighborhood citizens remain present. Far-away models are hidden by the selected graphics profile to bound rendering work; these are simulated NPCs, not real online users.

## Validation

Economy/business, food/rest/save, multiplayer-request and simulated-scene regression tests are included. New tests check exact-change receipts and duplicate prevention, starter home and sleep/TV interactions, traffic route coverage, five vehicle classes' entry/movement/exit, and run toggling. These simulated-scene checks do not establish physical-device frame rate or visual quality. Real iPhone/Android checks and live multi-user multiplayer testing remain pending.

This remains a browser game with local economy saves and limited shared player presence. Real ads and purchases, Android/iOS store packages, public sharing and app-store submission are separate launch steps.

## Visible stocker

Hire a Stocker through Phone → Staff roles and keep the store open. They reserve a delivery box, walk outside, pick it up, carry it along the store aisles, place its contents on the matching shelf, and return for another box. Inventory updates when shelving finishes. The entrance opens automatically as the worker approaches.

The general manager performs the same task when no dedicated stocker is available. Stockers pause when closed or unpaid. Firing them, pausing work, or reloading returns unstocked cargo safely; full shelves return any excess items to the delivery area. Tests cover task timing, manual-pickup reservations, partial stock capacity, interruption recovery, visible carrying and duplicate prevention.
