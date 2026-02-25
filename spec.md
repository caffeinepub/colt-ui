# Specification

## Summary
**Goal:** Remove the Secret tab from the application and fix the "Click Me" button in the Music tab so that clicking it properly adds C Coins and updates the Store tab balance in real time.

**Planned changes:**
- Delete `SecretTab.tsx` and remove all references to the Secret tab from `Header.tsx` and `App.tsx` so it no longer appears in navigation
- Fix the `useAddCCoins` mutation hook wiring in `MusicTab.tsx` to correctly call the backend `addCCoins` function with `999999999`
- Ensure that on a successful mutation, the `getCCoins` query cache is invalidated/refetched so the Store tab balance updates immediately without a page refresh
- Display the neon success message in the Music tab after a successful "Click Me" action

**User-visible outcome:** The Secret tab is gone from navigation. Clicking the "Click Me" button in the Music tab adds a massive amount of C Coins and the updated balance is instantly visible in the Store tab.
