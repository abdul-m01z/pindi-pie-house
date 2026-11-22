# Frontend decisions

One decision for each problem found on the reference site, <https://www.pizzahutpakistan.com/>.
Screenshots are in `docs/screenshots/`.

## 1. Changing delivery/pickup or area must not cost the customer their cart (interaction / state)

| Field | Content |
| --- | --- |
| Problem | On the reference site, choosing a different pickup store while the cart has items shows "If you change the store, the cart will reset. Do you want to continue" (Yes / No). After Yes the cart is empty ("Oops! Your cart is empty"). The customer must rebuild the order. |
| Decision | The cart is a separate piece of state and is never cleared by a delivery/pickup or area change. After the change a "Cart kept" notice lists what changed (items kept, fee added or removed, old and new total, any minimum-order shortfall) and offers **Undo this change**. |
| Alternative | Keep the reference behaviour but add a confirmation dialog ("Your cart will be emptied"). Rejected: it warns about losing work instead of preventing the loss. |
| Reason | The customer's task is to get the food they chose to a place they choose. Our prices are the same for delivery and pickup, so nothing in the cart becomes invalid. Keeping it avoids repeated work and abandoned orders. |
| Tradeoff | If prices or availability differed per area, the cart would need extra checks. The notice and undo add state (`notice`) and one more component to maintain. |
| Code location | `src/App.jsx` (`handleFulfilmentChange`, `handleUndo`), `src/lib/fulfilmentChange.js` (`describeFulfilmentChange`), `src/components/ChangeNotice.jsx`. |
| Evidence | `docs/screenshots/05-cart-delivery-summary-desktop.png` then `06-cart-kept-pickup-desktop.png`. Steps: add a dish, open the cart, choose area I-8, switch to Pickup. The item stays and the notice shows the fee removed and the new total. |

## 2. Show fees, minimum, tax and an exact total before the cart (information hierarchy)

| Field | Content |
| --- | --- |
| Problem | In the captured screens, the item dialog shows only "Add to Cart PKR 599.00"; the delivery fee and GST appear in the cart ("Delivery Fee PKR 120"). The summary shows "GST (15 %) PKR 89.85" and "Total PKR 809.00" with no rounding line, so the rows do not add up to the total (599 + 120 + 89.85 = 808.85). Amounts mix formats ("PKR 120", "PKR 599.00", "PKR 0"). |
| Decision | An order bar on the menu and details pages states the fee, the food minimum, and that prices exclude 15% GST, and shows the running total once the cart has items. The details page shows price, GST and price with GST. The summary lists every row, including a signed "Rounding to whole rupees" line, in one money format. |
| Alternative | Show GST-inclusive prices on every card and leave the summary short. Rejected: it hides the delivery fee and rounding, which are the surprises. |
| Reason | Customers decide what to order while looking at the menu. Seeing every charge there, and being able to add up the summary themselves, avoids unexpected costs at the end. |
| Tradeoff | The menu page is busier. The order bar needs the cart summary, so `App` passes more props to the pages. All money maths is in integer paisa to keep rows exact. |
| Code location | `src/components/OrderBar.jsx`, `src/lib/pricing.js` (`calculateSummary`, `formatMoney`, `formatSigned`), `src/components/OrderSummary.jsx`, `src/pages/DetailsPage.jsx` (price box). |
| Evidence | `01-menu-desktop.png` (order bar), `02-details-limit-desktop.png` (price with GST and fee note), `05-cart-delivery-summary-desktop.png` (summary: 1,349.00 + 120.00 + 220.35 −0.35 = 1,689.00). On mobile: `m01-menu-mobile.png`. |

## 3. Delivery area picker that never dead-ends (information hierarchy / mobile layout)

| Field | Content |
| --- | --- |
| Problem | The reference delivery modal is a map. The address suggestions clear the search box ("Enter your address" is shown again), an unsupported place only says "We do not deliver here. You can choose PickUp. Click Here" with no nearby served area, the "Start Your Order" button overlaps the "Reorder / Already a user? Login" text, and a required apartment field appears only after scrolling, with "Confirm Location" and "Start Your Order" shown together. |
| Decision | A plain searchable list of areas with one action per screen. A served area applies immediately. An unserved area shows a message above the list with the nearest served areas (about 6 or 7 km away) and a "Pick up instead" button. No area matching the search says what we do serve. All tap targets are at least 44 px high. No map is used. |
| Alternative | Keep a map and add a "nearest area" overlay. Rejected: it needs a map library, is hard to use with a keyboard and on small screens, and the list answers the same question. |
| Reason | The customer's task is to find out whether we deliver to them and what to do next. A list can be scanned, searched and operated by keyboard, and every state offers a way forward. |
| Tradeoff | Area names must be maintained as data and there is no exact-address check. Customers who do not know the area name must scroll the short list. |
| Code location | `src/components/FulfilmentPanel.jsx` (`chooseArea`, `chooseMode`, unserved and no-match branches), `src/data/areas.js`. |
| Evidence | `04-area-not-served-desktop.png`, mobile `m03-cart-area-picker-mobile.png` and `m04-area-not-served-mobile.png` (390 px wide). |
