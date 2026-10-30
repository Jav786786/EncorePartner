# Encore prototype · Member app and Partner app (30.10.2026)

Built from the 24 Oct 2026 build, with the changes in *Prototype Updates 30Oct2026.docx* applied (see `Encore_Prototype_Changes_30Oct2026.docx`).

## URLs

Upload this whole folder to one web host and keep the structure as it is.

| URL | Opens |
|---|---|
| `…/member.html` (or `…/`, which redirects) | **Member app**. Lands on the Encore welcome screen. |
| `…/partner.html` | **Partner app**. Always opens on **Cue**. |

Both pages adapt to the device. On a phone each app fills the screen (bottom tab bar, safe areas). On a computer the member app gets a sidebar and a wider clip grid. The partner app becomes a console: Cue and the live event sheet sit side by side on wide screens.

## How the two apps stay in sync

The two pages share state through the browser's local storage on the same host. Open both **in the same browser** (two tabs or two windows side by side), and changes show up within a moment:

- Publishing in Cue puts the Formula E event at the top of Discover in the member app (and hides the static "fan village day" Formula E tile so it is not listed twice).
- Any later change in Cue appears live in the member app: price, seats, title, copy, pause and resume, timeline.
- A booking made in the member app appears in Cue, Stats and Payouts.
- **Reset partner view** (sidebar on desktop, `•••` menu on a phone, or type "start over") removes the Formula E event from the member app, refunds Mike's booking and restarts Cue.

Sync does not cross devices or browsers. That would need a small shared backend.

## The demo timeline

After publishing, the partner app shows a timeline control (in the event sheet, Stats and Payouts, or ask Cue "jump to 1 week before"):

| Point | Seats booked (40 a race day, 55 credits) | To Formula E |
|---|---|---|
| Today (publish day, 3 weeks out) | 0 | £0 |
| 2 weeks before | 22 / 80 | £1,089 forecast |
| 1 week before | 36 / 80 | £1,782 forecast |
| After the race | 56 / 80, 51 scanned, 5 no-shows | £2,648 next payout |

Before anything is published, Stats and Payouts show an illustrative "last season" view (six past Formula E events on Encore) so the pages are never empty in a demo. They switch to live data the moment Cue publishes.

## Plans and credits

| Plan | Price a month | Credits included |
|---|---|---|
| Explorer | Free | None. Personalised weekly edit; credits bought in packs at £2.50 a credit |
| Rising Star | £9.99 | 5 |
| Headliner | £39.99 | 25 |
| Rock Star | £89.99 | 70 |
| Icon | £119.99 | 110 |

Credit packs are priced at £2.50 a credit on every pack: 10 for £25, 25 for £62.50, 60 for £150 and 150 for £375. If a booking needs more credits than the member has, checkout buys the cheapest mix of packs that covers the gap, on any plan, and any spare credits stay in the balance. The plus-one is free from Headliner up. On Explorer and Rising Star it costs the member price.

## The map

Discover → Map draws its own simplified London: parks, the Thames, docks and main roads. It needs no map service and works offline. Drag to move, pinch or scroll to zoom, and double-tap to zoom in. The buttons show where you are, show every event and (on desktop) zoom. On a phone, swiping the cards moves the map to each event, and tapping a pin brings its card forward. Where pins overlap they shrink to dots until you zoom in. Venue positions are approximate.

## Suggested demo

1. Open `partner.html` and `member.html` side by side.
2. In Cue, tap through the suggestion chips (about two minutes) and **Publish**.
3. In the member app, sign up, pick a plan and open the London E-Prix tile at the top of Discover. Book it.
4. Back in the partner app, the booking arrives in Cue and Stats. Step the timeline: 2 weeks → 1 week → After the race. Then open Payouts.
5. **Reset partner view** to run it again.

## Files

- `member.html`, `partner.html`, `index.html`: the pages
- `assets/core.js`: shared data, demo timeline, booking model, logo and sync
- `assets/member.js`, `assets/partner.js`: the two apps
- `assets/encore.css`, `member.css`, `partner.css`: design system and layouts
- `media/*.mp4`: event clips with `media/posters/*.jpg` poster frames. `football.mp4` (every football tile in both apps) comes from the v24 exec deck; the 30 Oct additions are Mixkit stock clips, one per event so nothing repeats within an app. See `media/CREDITS.md`.

Fonts load from Google Fonts. Without internet the apps fall back to Arial and Georgia.

## Notes for the deck (removed from the UI)

- Events are the Wave 1 and Wave 2 partner list. Credits, days and times are illustrative, except Knock2Bag with Ivo Graham at MOTH Club on 18 Nov. Amapianoland (Boxpark Croydon) is based on a real DICE listing.
- Clips are stock footage (Pexels and Mixkit, free licences) standing in for partner footage, except the football clip which comes from the exec deck. The Benson Boone, Radiohead, Anish Kapoor, Cirque du Soleil, Disney on Ice, Kevin Bridges, Formula 1 and Premier League tiles show comparable-event stock, not the named artists or competitions.
- Partner demo: Formula E onboards the next London E-Prix. The real race calendar is not confirmed, so the app shows only relative race timing ("in 3 weeks"). Grandstand names, capacity, sales, audience sizes, bookings, payouts and the "last season" figures are illustrative.
- The Ops lens (Encore margin) is for internal review only and is off by default.
