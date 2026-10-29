# M10.2 — Category-wise data expansion audit

**Base version:** M10.1 (map cache/UT compatibility fix preserved).  
**Data source supplied by Mr DK:** `state-info-bank.json`, schema 3.0.0, 36 State/UT records, 709 listed items.  
**Structure:** The source JSON is not loaded in the app. Existing separate data files remain: `js/data/cards.js` (verified) and `js/data/cards-dk.js` (Review).

## Data handling rules

- Existing M10 verified facts are left unchanged; new verified facts are appended in the relevant category.  
- If a source URL was already attached to an item in the supplied JSON, it was retained without another search, as requested. The audit explicitly distinguishes these from claims checked online in this pass.  
- Source-less items are only promoted when a matching official/NCERT source was found. Remaining items stay tagged Review.  
- State-animal candidates that conflict with an existing M10 entry are displayed as Review-only candidates and are not scored in quizzes.

## Additions by category

| Original category | Newly added to verified data | Newly added to Review |
|---|---:|---:|
| `classicalDance` | 0 | 8 |
| `folkArts` | 48 | 19 |
| `festivals` | 52 | 10 |
| `foods` | 34 | 13 |
| `stateAnimal` | 2 | 10 |
| `notableWildlife` | 11 | 65 |
| `famousThings` | 30 | 22 |

## Official sources used for newly checked claims

| Source | URL | Used for |
|---|---|---|
| NCERT — India: Unity in Cultural Diversity | https://www.ncert.nic.in/pdf/publication/otherpublications/Unity_cultural.pdf | Selected source-less culture, food and festival claims including regional cuisine/festivals; only items matched to a claim are tagged online-verified. |
| Sangeet Natak Akademi — Intangible Cultural Heritage | https://www.sangeetnatak.gov.in/sections/ICH | Folk arts, folk theatre, ritual/cultural traditions in its published state-wise list. |
| NCERT — Teachers’ Handbook | https://www.ncert.nic.in/desm/pdf/teacher%27shandbook.pdf | Regional food examples, including Odisha Pakhala. |
| Government of Assam Tourism — Culinary Treasures | https://assamtourism.gov.in/cuisine.php | Khar as a traditional Assamese dish. |
| Government of Assam Tourism — Bihu Festival | https://assamtourism.gov.in/bihu-festival.php | Bihu traditions and Ambubachi Mela. |
| Goa Tourism — Sao Joao | https://goa-tourism.com/festival/sao-joao/ | Sao Joao festival. |
| Government of Himachal Pradesh Tourism — Ethnic dances | https://himachaltourism.gov.in/destination/ethnic/ | Nati dance. |
| Government of Jharkhand Tourism — Cultural/folk dance page | https://tourism.jharkhand.gov.in/historic-jharkhand | Paika, Jhumar and local traditions listed by Jharkhand Tourism. |
| Karnataka Tourism — Kambala Festival | https://karnatakatourism.org/en/events/kambala-festival/ | Kambala in coastal Karnataka. |
| Bihar Tourism — Sonepur Mela | https://tourism.bihar.gov.in/en/experiences/festivals-and-fairs/fairs/sonepur-mela | Sonepur Mela. |
| Madhya Pradesh Tourism — Events and Festivals | https://www.mptourism.com/eventslisting.php | Tansen Samaroh and Khajuraho Dance Festival. |
| Tourism Nagaland — Tribes and Festivals | https://tourism.nagaland.gov.in/tribes/ | Sekrenyi/Moatsu and their community association. |
| Odisha Tourism — Events and Festivals | https://odishatourism.gov.in/en/events | Nuakhai. |
| Meghalaya Tourism — Indigenous Cuisines | https://www.meghalayatourism.in/experiences/culture-%26-lifestyle/indigenous-cuisines/ | Tungrymbai, Jadoh, Dohneiiong. |
| IP India — Geographical Indications register | https://search.ipindia.gov.in/GIRPublicSearch | Items specifically listed as registered GI such as Channapatna Toys & Dolls, Blue Pottery of Jaipur and Phulkari. |
| National Portal of India — Chamba Rumal | https://www.india.gov.in/explore-india/odop/details/chamba-rumal | Chamba Rumal craft / GI tag. |
| Delhi Forest Department — Delhi’s Forest at a Glance | https://forest.delhi.gov.in/sites/default/files/generic_multiple_files/delhi_s_forest_at_a_glance.pdf | Nilgai as the state animal of NCT Delhi. |
| UT Ladakh — International Snow Leopard Day | https://ladakh.gov.in/international-snow-leopard-day-2025/ | Snow leopard as the state animal of Ladakh. |
| Telangana Government — State Symbols | https://www.telangana.gov.in/About/State-Symbols/ | Deer/Jinka as Telangana state animal; retained only as a Review candidate because it conflicts with existing M10 entry. |
| UT Government-hosted fact sheet | https://cdnbbsr.s3waas.gov.in/s32d2ca7eedf739ef4c3800713ec482e1a/uploads/2023/09/2023092156.pdf | Alpine musk deer; retained as a Review candidate because the existing M10 state-animal record is not overwritten. |

## State-animal safety note

M10 active state-animal values were preserved. Verified empty slots were filled only for Delhi (Nilgai) and Ladakh (Snow leopard). Conflicting or source-uncertain candidates such as Arunachal Pradesh–Mithun, Telangana–Deer/Jinka and Uttarakhand–Alpine musk deer are kept in a Review-only candidate list rather than silently replacing the old record. Karnataka–Indian elephant and other source-less candidates remain Review-only.

## Audit result counts

```json
{
  "already-in-M10-verified": 116,
  "verified-added-from-json": 119,
  "already-review-or-duplicate": 276,
  "verified-added-from-online": 48,
  "added-to-review": 129,
  "animal-conflict-kept-for-review": 8,
  "regional-classical-added-to-review": 8,
  "duplicate-in-new-data": 3,
  "state-animal-candidate-review-only": 2,
  "existing-M10-review-promoted-to-verified": 10
}
```

## Full audit

Every item in the source JSON is represented in `M10_2_DATA_AUDIT.json` with a result such as already in M10, source-URL retained, online source found, added to Review, or animal conflict. The audit file is documentation, not a runtime database.
