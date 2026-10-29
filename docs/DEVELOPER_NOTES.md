# Developer notes (for Mr DK only; not shown to teachers)

## Teacher login
Username `KV2KGP`, password `1261` are in `js/tq.js` (`CFG.auth`). This is a convenience gate, not security: anyone who reads the public JavaScript can see it. Nothing confidential should depend on it. The login state is kept in `sessionStorage` only.

## Review button (replaces "reviewed by DK")
- Items in `js/data/cards-dk.js` have no official source yet. They show a **Review** button that opens WhatsApp (+91 81269 56997) with a prefilled message (state, item, "attach a screenshot").
- After a teacher reviews an item (and you change it if needed), add it to `js/data/reviewed.js`: `'item name in lower case without brackets':'Teacher Name'`. The item then shows "(reviewed by Teacher Name)". If the facts are fully verified, move the item to `js/data/cards.js` and delete it from `cards-dk.js`; its Review button disappears.
- The Home page note explaining this is `homeNote` in `js/i18n.js` (English and Hindi).

## Panel layout
`.xsplit` puts the map beside the details (Explore, Learn) on screens at least 900 px wide and 560 px high; smaller screens stack. On **big screens** (1200 px wide, 640 px high or more: interactive panels) `body.fill` (set in `js/app.js` for Explore and Learn) makes the page use the whole screen: full width, map about one third, details box about two thirds with balanced columns and larger text; the state picker stays pinned and only the details list scrolls inside its box when a state has a lot of content. Tune it at the end of `css/style.css` (search "Interactive Panel").

## Offline map
The map shapes load from the internet the first time. For a fully offline panel save `js/map/india-data.js` (see `js/map/README.txt`).

## Footer
The credit links to https://thedarkgeekdc2.github.io. The map credit (CC BY 4.0) must stay.
