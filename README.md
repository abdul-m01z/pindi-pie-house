# Pindi Pie House

Student: **Abdul Moiz** · Roll number: **24I2006** · Section: **C** · Course: CS4032 Web Programming, Assignment 02 (Fall 2026)

Pindi Pie House is a fictional pizza and sides business for students in Islamabad and Rawalpindi. Customers browse the menu,
search and filter, open a dish, build a cart, choose delivery or pickup, fill in a checkout form, review a calculated
summary and reach a simulated confirmation. It is built with React and plain JavaScript, `react-router-dom` and
hand-written CSS. It fixes three problems found on <https://www.pizzahutpakistan.com/> (see `DECISIONS.md`).

- GitHub: <https://github.com/abdul-m01z/pindi-pie-house>
- Deployment: <https://pindi-pie-house.vercel.app>
- Final commit: see `git log -1` and the PDF report.

## Commands

```bash
npm install        # install dependencies
npm run dev        # development server at http://localhost:5173
npm run build      # production build into dist/
npm run preview    # serve the production build
npm test           # runs: node --test (business-rule test)
```

Requires Node.js 22 or newer.

## Routes and features

| Route | Purpose |
| --- | --- |
| `/` | Home: hours, delivery fee, minimum, limits, served areas |
| `/menu` | 14 dishes. Search, category, vegetarian filter and sort, kept in the URL query |
| `/menu/:id` | Details: sizes, ingredients, stock, price with GST, quantity, add to cart. Unknown ids show a message |
| `/cart` | Edit quantities, remove, choose delivery/pickup and area, full price breakdown, blocking messages |
| `/checkout` | Controlled form (name, phone, address, notes, payment), validation, simulated order |
| `/confirmation` | Final summary of the simulated order |

## Operating rules

1. **Availability:** at most 6 of any one dish per order, and never more than today's stock. The limit is written next to
   the quantity control. Seven is refused with a message. (`src/rules/maxPerItem.js`)
2. **Time:** orders are accepted from 12:00 PM to 11:30 PM inclusive. Outside that, checkout is blocked with a message.
   11:30 PM is accepted, 11:31 PM is refused. (`src/rules/orderHours.js`)
3. **Fulfilment:** delivery needs at least PKR 800 of food (before GST and fee). Exactly PKR 800 is accepted, PKR 799 is
   refused. Pickup has no minimum. (`src/rules/minimumOrder.js`)

## Automated test

`tests/minimumOrder.test.js` tests `checkMinimumOrder` (the function used by the cart and checkout) with
Node's built-in runner and `node:assert/strict`: PKR 1,200 accepted, exactly PKR 800 accepted, PKR 799 rejected, and pickup.

```bash
npm test
```

## Reproducing the edge cases

Open "Demonstration controls (for testing the edge cases)" in the page footer. It is a clearly labelled testing aid.

| Case | Steps | Expected |
| --- | --- | --- |
| Loading failure | Tick "Make menu loading fail" | Menu pages show an error with "Try again". Untick, press "Try again": the menu loads |
| Empty menu | Tick "Load an empty menu", open `/menu` | "The menu is empty right now" with Reload, different from a search with no matches |
| No search results | `/menu?q=sushi` | "No dishes match your search" with "Show the full menu" |
| Invalid URL | `/menu/nope` or `/anything` | Clear "could not find" page with a way back |
| Missing image / long content | Menu: "Crispy Fries" has no image, "Double Cheese Chicken Fajita Supreme Overload" has a long name | Fallback "Photo coming soon", text wraps, no horizontal scroll |
| Invalid form input | Checkout: submit empty, then enter phone `0300 123` | Specific message next to the field and in a summary, other fields keep their values |
| Restored or unavailable selection | Add a dish, open the cart, then "Sell out a dish…" for that dish (or "Leave only 2" with 4 in the cart) | The cart is saved and restored on reload; conflicts are explained and "Fix my cart automatically" repairs them. Checkout stays blocked until fixed |
| Kitchen hours | "Pretend the time is" 11:31 PM | Checkout blocked with a message. 11:30 PM is accepted |
| Cart kept on change | Cart with one dish, switch Delivery to Pickup | "Cart kept" notice with Undo |

## Simulated operations and known limitations

- Orders, payment, delivery and the menu "network" are simulated. No data leaves the browser. Do not enter real details.
- The cart, delivery/pickup choice and demonstration settings are saved in `localStorage`. Names, phone numbers and addresses are not stored.
- The confirmation page is not saved: refreshing it shows "No recent order".
- The clock uses the browser time unless the demonstration control overrides it. There is no payment form.
- Delivery areas are a fixed list. There is no map or exact-address check.

## Concept map

| Concept | File | Component / function |
| --- | --- | --- |
| Routing, URL params | `src/App.jsx`, `src/pages/DetailsPage.jsx` | `Routes`, `useParams` |
| Query-string state | `src/pages/MenuPage.jsx` | `useSearchParams`, `update` |
| Props and callbacks | `src/App.jsx` to pages | `handleAdd`, `handleSetQuantity`, `onFulfilmentChange` |
| State and functional updates | `src/App.jsx` | `setCart((prev) => addToCart(prev, ...))` |
| Immutable arrays and objects | `src/lib/cart.js` | `addToCart`, `setQuantity`, `removeLine`, `fixCart` |
| Controlled form | `src/pages/CheckoutPage.jsx`, `src/components/MenuControls.jsx` | `renderField`, `setField` |
| Validation | `src/lib/validation.js` | `validateCheckout` |
| Derived values | `src/App.jsx`, `src/lib/pricing.js` | `resolveCart`, `calculateSummary` |
| Effects with cleanup | `src/App.jsx`, `src/lib/useMinutesNow.js` | menu loading `useEffect`, clock interval |
| Async mock loader | `src/lib/mockApi.js` | `loadMenu` (Promise, rejection) |
| Local storage | `src/lib/useLocalStorageState.js` | `useLocalStorageState` |
| Conditional rendering | `src/components/StatusMessage.jsx`, pages | loading, error, empty, sold-out, closed states |
| Business rules and test | `src/rules/*.js`, `tests/minimumOrder.test.js` | `checkItemQuantity`, `checkOrderHours`, `checkMinimumOrder` |
| Lists with stable keys | `src/pages/MenuPage.jsx` | `results.map` with `item.id` |
