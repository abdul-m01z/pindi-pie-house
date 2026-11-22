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
| `/` | Home: scroll-driven pizza hero, four popular dishes, hours, delivery fee, minimum, limits, served areas |
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
| Lengthy content | Menu: "Double Cheese Chicken Fajita Supreme Overload" has a long name and description | Text wraps, the card description is cut at 3 lines, full text on the details page, no horizontal scroll |
| Invalid form input | Checkout: submit empty, then enter phone `0300 123` | Specific message next to the field and in a summary, other fields keep their values |
| Restored or unavailable selection | Add a dish, open the cart, then "Sell out a dish…" for that dish (or "Leave only 2" with 4 in the cart) | The cart is saved and restored on reload; conflicts are explained and "Fix my cart automatically" repairs them. Checkout stays blocked until fixed |
| Kitchen hours | "Pretend the time is" 11:31 PM | Checkout blocked with a message. 11:30 PM is accepted |
| Cart kept on change | Cart with one dish, switch Delivery to Pickup | "Cart kept" notice with Undo |
| Missing images | Tick "Hide dish photos" | Every card shows the "Photo coming soon" fallback and the layout stays intact |

## Assets

- **Dish photos:** free stock photos from Unsplash (Unsplash License, free to use). They are illustrative and may not show the exact dish. Resized to 900 px WebP.

| Dish | File | Source page |
| --- | --- | --- |
| Pindi Tikka Pizza | `public/images/dishes/pindi-tikka.webp` | <https://unsplash.com/photos/pizza-on-brown-wooden-round-tray-Nq9KlQTTEbQ> |
| Blue Area BBQ Chicken | `public/images/dishes/blue-area-bbq.webp` | <https://unsplash.com/photos/a-pizza-being-cut-m8RCK_aYZNY> |
| Garden Veggie Delight | `public/images/dishes/garden-veggie.webp` | <https://unsplash.com/photos/pizza-with-green-bell-pepper-and-green-bell-pepper-BAxltdUdVsc> |
| Peshawari Pepperoni | `public/images/dishes/chicken-pepperoni.webp` | <https://unsplash.com/photos/a-whole-pepperoni-pizza-on-a-dark-background-fHX9cScxh4o> |
| Double Cheese Chicken Fajita Supreme Overload | `public/images/dishes/double-cheese-fajita.webp` | <https://unsplash.com/photos/a-pizza-sitting-on-top-of-a-wooden-cutting-board-WQrzWvG-k3M> |
| Garlic Bread | `public/images/dishes/garlic-bread.webp` | <https://unsplash.com/photos/brown-and-white-bread-on-brown-wooden-tray-nMWrV29cg6c> |
| Peri Peri Wings | `public/images/dishes/peri-peri-wings.webp` | <https://unsplash.com/photos/a-plate-of-food-that-is-sitting-on-a-table-CgXEzyC2fNA> |
| Crispy Fries | `public/images/dishes/crispy-fries.webp` | <https://unsplash.com/photos/a-basket-of-french-fries-sitting-on-top-of-a-wooden-table-ChXHveqrb28> |
| Cola | `public/images/dishes/cola.webp` | <https://unsplash.com/photos/clear-drinking-glass-with-ice-and-black-liquid-i597Mg_WSPw> |
| Lemon Mint Margarita | `public/images/dishes/lemon-mint.webp` | <https://unsplash.com/photos/a-glass-of-ice-water-with-a-lime-and-mint-garnish-aM3LR10BeAc> |
| Mango Lassi | `public/images/dishes/mango-lassi.webp` | <https://unsplash.com/photos/a-glass-filled-with-a-smoothie-next-to-a-mango-KlVIYmGVRQ8> |
| Giant Chocolate Cookie | `public/images/dishes/giant-cookie.webp` | <https://unsplash.com/photos/delicious-chocolate-chip-cookies-on-parchment-paper-UrvxNspQhCc> |
| Gulab Jamun Cheesecake Cups | `public/images/dishes/gulab-jamun-cups.webp` | <https://unsplash.com/photos/red-round-fruits-in-black-cooking-pan-uwu2ZLDmX8k> |
| Margalla Margherita | `public/images/dishes/margalla-margherita.webp` | <https://unsplash.com/photos/pizza-with-green-leaf-vegetable-JspLKUauwSI> |

- **Home hero:** a short pizza video generated by the student with an AI video tool, split into 100 WebP frames in `public/frames/` and drawn on a canvas according to scroll position (`src/components/ScrollHero.jsx`). With "reduce motion" turned on in the operating system, it shows one still frame.
- **Icons:** small inline SVG icons drawn by hand (`src/components/Icons.jsx`). Theme: black and red, defined as CSS variables at the top of `src/styles/base.css`.

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
| Effects with cleanup | `src/App.jsx`, `src/lib/useMinutesNow.js`, `src/components/ScrollHero.jsx` | menu loading `useEffect`, clock interval, scroll listener |
| Refs | `src/components/ScrollHero.jsx` | `useRef` for the section and canvas |
| Async mock loader | `src/lib/mockApi.js` | `loadMenu` (Promise, rejection) |
| Local storage | `src/lib/useLocalStorageState.js` | `useLocalStorageState` |
| Conditional rendering | `src/components/StatusMessage.jsx`, pages | loading, error, empty, sold-out, closed states |
| Business rules and test | `src/rules/*.js`, `tests/minimumOrder.test.js` | `checkItemQuantity`, `checkOrderHours`, `checkMinimumOrder` |
| Lists with stable keys | `src/pages/MenuPage.jsx` | `results.map` with `item.id` |
