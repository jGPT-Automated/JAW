# HOME-01 — selected direction, October 18 v2

Status: owner-selected direction recorded in index.html and data/decisions.json. Mobile implementation NOT started. The HTML prototype is an arrangement/scroll demonstration, not a new visual authority over the chosen screenshots.

## Explicit target
Home has exactly Overview and Activity. This supersedes Feed/Upcoming. Overview closely follows original expanded drawer screenshot09-explore-drawer-expanded.jpg: header/metrics, top check-in/out and Court, Here Now, Up Next, daily chart, compact Recent Activity. Remove bottom Games/Players/Feed/Week pills from Home. Keep main app navigation. Do not introduce a Home Plan button or bottom action stack. Keep full-size h separated from numeral. Quiet feed markers remain selected.

Activity uses upcoming-timeline.png (owner Ref99) row composition at full width. Descending chronological order; at5PM read8PM,7PM,6PM,5PMNow,4PM,3PM...6AM; preceding date then continues below with latest hours. Scroll UP toward future and DOWN toward past. Condensed rows and full-width game rows. Preserve distinction between actual past/live presence and future plans/games; no fake check-ins. Do not copy +Game creation controls to Home.

Court button goes to SAME existing Court page. Court design/tabs/actions/paywall unchanged in this card. Do not bundle prior Court action-removal proposals. Schedule destination is for adding future availability and scheduling games, using selected heatmap composition and FULL-WIDTH selected-slot detail; preserve corrected axes daysX/time6AM–midnightY. No FAB collision or horizontal game carousel.

Activity is the working selected tab label. Pulse was a suggested name only; do not reopen design for naming. Favorites one-free/multiple-LocalPlus decision preserved separately. Marker, switch gesture, aggregate feeds and entitlement/geofence semantics not silently settled here.

## Before implementation
Recheck mobile repository/head (last reviewed PR77d018a57). Identify real data sources/timezone, bounded initial history/future range, date pagination, empty/loading/error handling and stable Now anchoring. These engineering details do not change owner-selected direction. Show any necessary unresolved behavior in the work card; do not infer a new product layout.

## Acceptance
Compare Overview to H-REF-01 and Activity to H-REF-02. Test two tabs/keyboard/safe areas/small devices; top controls never duplicated at bottom; Court same route and screen; Schedule adds availability/creates games; Activity can scroll both directions across dates without jumping; real past versus planned state labeling; no missing game date; full-width rows. Validate no shared drawer/court regression. No new build or OTA without separate release scope.
