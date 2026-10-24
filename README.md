# Encore · Partner app (prototype, 24.10.2026)

The partner console: Formula E onboards the next London E-Prix through **Cue**, the chat agent, then follows bookings, stats and payouts. It always opens on Cue and works on phones and computers.

The Member app lives in the **Encore** repo.

## URLs

| URL | Opens |
|---|---|
| `…/` (`index.html`) | Partner app, starting on Cue |

## Sync with the Member app

The two apps share state through the browser's local storage, which works only when both are served from **the same origin**. For example, GitHub Pages for this repo and Encore under the same account: `https://<account>.github.io/EncorePartner/` and `https://<account>.github.io/Encore/`. Open both in **the same browser**:

- Publishing in Cue puts the Formula E event at the top of the member app's Discover.
- Later changes in Cue (price, seats, copy, pause, timeline) appear there live.
- A booking made in the member app arrives in Cue, Stats and Payouts.
- **Reset partner view** (sidebar on desktop, `•••` menu on a phone, or type "start over") removes the event from the member app, refunds the booking and restarts Cue.

Sync does not cross devices or browsers.

**"Open the member app"** goes to `../Encore/`, set by `window.ENCORE_MEMBER_URL` in `index.html`. Change that line if the member app is hosted somewhere else.

## The demo timeline

After publishing, a timeline control appears (in the event sheet, Stats and Payouts, or ask Cue "jump to 1 week before"):

| Point | Seats booked (40 a race day, 55 credits) | To Formula E |
|---|---|---|
| Today (publish day, 3 weeks out) | 0 | £0 |
| 2 weeks before | 22 / 80 | £1,089 forecast |
| 1 week before | 36 / 80 | £1,782 forecast |
| After the race | 56 / 80, 51 scanned, 5 no-shows | £2,648 next payout |

One deterministic model drives Stats, Payouts, Cue and the member app's "seats left", so they always agree. Changing the price, seats or audience in Cue moves the curve. Bookings made in the member app are added on top.

## Suggested demo

1. Open this app and the member app side by side.
2. In Cue, tap through the suggestion chips (about two minutes) and **Publish**.
3. In the member app, sign up, pick a plan and book the London E-Prix tile at the top of Discover.
4. Back here, the booking arrives in Cue and Stats. Step the timeline: 2 weeks → 1 week → After the race. Then open Payouts.
5. **Reset partner view** to run it again.

## Files

- `index.html`: the app
- `assets/core.js`: shared data, demo timeline, booking model and sync (same file as in Encore)
- `assets/partner.js`, `assets/partner.css`: the partner app
- `assets/encore.css`: design system (same file as in Encore)
- `media/formulae.mp4`: the race clip on the event tile

Fonts load from Google Fonts. Without internet the app falls back to Arial and Georgia.

## Notes (not shown in the app)

- Formula E onboards the next London E-Prix. The real race calendar is not confirmed, so the app shows only relative race timing ("in 3 weeks"). Grandstand names, capacity, sales, audience sizes, bookings and payouts are illustrative.
- The Ops lens (Encore margin) is for internal review only and is off by default.
- The clip is Pexels stock footage (free licence), standing in for partner footage.
