# Developer notes (for Mr DK only; not shown to teachers)

## Teacher login
Username `KV2KGP`, password `1261` are in `js/tq.js` (`CFG.auth`). This is a convenience gate, not security: anyone who reads the public JavaScript can see it. Nothing confidential should depend on it. The login state is kept in `sessionStorage` only.

## Review button (replaces "reviewed by DK")
- Items in `js/data/cards-dk.js` have no official source yet. They show a **Review** button that opens WhatsApp (+91 81269 56997) with a prefilled message (state, item, "attach a screenshot").
- After a teacher reviews an item (and you change it if needed), add it to `js/data/reviewed.js`: `'item name in lower case without brackets':'Teacher Name'`. The item then shows "(reviewed by Teacher Name)". If the facts are fully verified, move the item to `js/data/cards.js` and delete it from `cards-dk.js`; its Review button disappears.
- The Home page note explaining this is `homeNote` in `js/i18n.js` (English and Hindi).

## Panel layout
`.xsplit` in `css/style.css` puts the map beside the details (Explore, Learn) when the screen is at least 900 px wide and 560 px high; smaller screens stack. The height rule `calc(100vh - 322px)` keeps the whole page inside the screen; change the number if you change the header or footer height.

## Offline map
The map shapes load from the internet the first time. For a fully offline panel save `js/map/india-data.js` (see `js/map/README.txt`).

## Footer
The credit links to https://thedarkgeekdc2.github.io. The map credit (CC BY 4.0) must stay.
