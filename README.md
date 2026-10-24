# Encore prototype · Member app and Partner app (24.10.2026)

Built from `Encore___Consumer_and_Partner_Prototype_24Oct2026_v12.html`, which is unchanged.

## URLs

Upload this whole folder to one web host and keep the structure as it is.

| URL | Opens |
|---|---|
| `…/member.html` (or `…/`, which redirects) | **Member app**. Lands on the Encore welcome screen. |
| `…/partner.html` | **Partner app**. Always opens on **Cue**. |

Both pages adapt to the device. On a phone each app fills the screen (bottom tab bar, safe areas). On a computer the member app gets a sidebar and a wider clip grid. The partner app becomes a console: Cue and the live event sheet sit side by side on wide screens.

## How the two apps stay in sync

The two pages share state through the browser's local storage on the same host. Open both **in the same browser** (two tabs or two windows side by side), and changes show up within a moment:

- Publishing in Cue puts the Formula E event at the top of Discover in the member app.
- Any later change in Cue appears live in the member app: price, seats, title, copy, pause and resume, timeline.
- A booking made in the member app appears in Cue, Stats and Payouts.
- **Reset partner view** (sidebar on desktop, `•••` menu on a phone, or type "start over") removes the Formula E event from the member app, refunds Maya's booking and restarts Cue.

Sync does not cross devices or browsers. That would need a small shared backend.

## The demo timeline

After publishing, the partner app shows a timeline control (in the event sheet, Stats and Payouts, or ask Cue "jump to 1 week before"):

| Point | Seats booked (40 a race day, 55 credits) | To Formula E |
|---|---|---|
| Today (publish day, 3 weeks out) | 0 | £0 |
| 2 weeks before | 22 / 80 | £1,089 forecast |
| 1 week before | 36 / 80 | £1,782 forecast |
| After the race | 56 / 80, 51 scanned, 5 no-shows | £2,648 next payout |

The numbers come from one deterministic model, so Stats, Payouts, Cue and the member app's "seats left" always agree. Each later point contains every booking of the earlier one. Changing the price, seats or audience in Cue moves the curve. Bookings made in the member app are added on top.

## Suggested demo

1. Open `partner.html` and `member.html` side by side.
2. In Cue, tap through the suggestion chips (about two minutes) and **Publish**.
3. In the member app, sign up, pick a plan and open the London E-Prix tile at the top of Discover. Book it.
4. Back in the partner app, the booking arrives in Cue and Stats. Step the timeline: 2 weeks → 1 week → After the race. Then open Payouts.
5. **Reset partner view** to run it again.

## Files

- `member.html`, `partner.html`, `index.html`: the pages
- `assets/core.js`: shared data, demo timeline, booking model and sync
- `assets/member.js`, `assets/partner.js`: the two apps
- `assets/encore.css`, `member.css`, `partner.css`: design system and layouts
- `media/*.mp4`: event clips (17.8 MB in total)

Fonts load from Google Fonts. Without internet the apps fall back to Arial and Georgia.

## Notes for the deck (removed from the UI)

- Events are the Wave 1 and Wave 2 partner list. Credits, days and times are illustrative, except Knock2Bag with Ivo Graham at MOTH Club on 18 Nov. Amapianoland (Boxpark Croydon) is based on a real DICE listing.
- Clips are Pexels stock footage (free licence), standing in for partner footage.
- Partner demo: Formula E onboards the next London E-Prix. The real race calendar is not confirmed, so the app shows only relative race timing ("in 3 weeks"). Grandstand names, capacity, sales, audience sizes, bookings and payouts are illustrative.
- The Ops lens (Encore margin) is for internal review only and is off by default.
