# Portfolio & Quotes · WebLuxe website template

A multi-page website for businesses that win customers by showing their work and collecting quote requests: kitchens and furniture, aluminium and glass, solar, painting, waterproofing, landscaping, dental and aesthetic clinics, wedding decorators and venues, real estate agents.

**Live demo:** https://webluxe.github.io/MidTier_PortfolioQuotes/

Plain HTML, CSS and JavaScript. No build step, no framework, nothing to install. Upload the folder to any host (GitHub Pages, Netlify, Vercel, cPanel) and it works.

## Files

| File | What it is |
|---|---|
| `index.html` | Home: hero, services, recent work, before/after, process, reviews, FAQ. |
| `services.html` | Each service in detail with a "starting from" price and a quote button. |
| `portfolio.html` | All projects with category filters, full-screen photos and before/after sliders. |
| `about.html` | Story, numbers, team and certifications. |
| `contact.html` | The 3-step quote form, contact details, hours and map. |
| `config.js` | **Everything about the client.** The only file you edit for a new client. |
| `css/style.css` | All the styles. Colours and fonts come from `config.js`. |
| `js/main.js` | Builds the pages from `config.js`. Do not edit. |
| `assets/` | Logo, favicon and the client's own photos. |

## How to rebrand for a new client (about 30 minutes)

1. **Copy the whole folder** and rename it for the client.
2. Open **`config.js`** and work down it from the top. Each block has a comment explaining it.
   - **The business:** `name`, `legalName`, `tagline`, `logo` (put a logo file in `assets/` and write its path in `logo.image`, or leave it empty to use the letter mark).
   - **Brand:** `colors.primary`, `colors.accent`, `colors.dark`, `colors.light`. The text colour on buttons is chosen automatically so it stays readable. `fonts.heading` and `fonts.body` take any Google Fonts name.
   - **Contact:** `phone`, `whatsapp` (country code + number, digits only, e.g. `23057001234`), `whatsappMessage`, `email`, the address lines, `lat`/`lng`, and `mapEmbed` (Google Maps → Share → Embed a map → copy the link inside `src="…"`).
   - **Hours:** `"08:00-17:00"` per day, `""` when closed. Days with the same hours are grouped automatically, and the "Open now" badge uses `timeZone`.
   - **Social:** paste the links you have. Empty ones are hidden.
   - **SEO:** `seo.title`, `seo.description`, `seo.image` (the picture shown when the link is shared), `seo.schemaType` and `seo.siteUrl` (the final web address).
   - **Form:** create a free form at formspree.io and paste its link into `form.endpoint`. With no link, the form opens the visitor's email app instead.
   - **Services** (`sections.services.items`): each one needs a short `id` (used in links), an icon name, an image, `from` (a price in rupees, or remove it) and its text.
   - **Portfolio:** `categories` become the filter buttons, and each item in `items` names its `category`. `beforeAfter.items` take a `before` and an `after` photo of the same room.
   - **Quote form** (`quote`): `sendVia` is `"both"`, `"endpoint"` or `"whatsapp"`; also `budgets` and `photoUpload` (photo uploads need a Formspree plan that accepts files).
   - **Process, testimonials, FAQ, team, badges:** plain lists. Delete what you do not need.
   - **Wording:** every piece of text has an English and a French version: `{ en: "...", fr: "..." }`. For an English-only site, set `languages: ["en"]` and the FR button disappears.
3. **Turn off demo mode:** set `demo.enabled` to `false`. In demo mode WhatsApp, calls, emails and forms only show a pop-up, and Google is told not to index the site.
4. **Update the head of each `.html` file:** `<title>`, the description and the three `og:` lines. WhatsApp, Facebook and LinkedIn read these when someone shares a link. Also update the Google Fonts link if you changed fonts.
5. **Replace `assets/favicon.svg`** with the client's icon (any square SVG or PNG; update the `<link rel="icon">` path if it's a PNG).
6. **Check it:** open `index.html` on a phone at 360px wide, switch to French, try dark mode, send the form, and tap WhatsApp.

### Hiding things

- A whole section: add `enabled: false` to it in `config.sections`.
- One item: delete it from its list.
- One line of text: set it to `""`.

Empty sections and items are removed from the page cleanly. They never leave a gap.

### Photos

Unsplash links get sized automatically for each screen. For the client's own photos, put them in `assets/` (JPEG or WebP, about 2000px wide, under 400 KB each) and write the path, e.g. `"assets/photos/office.jpg"`. Write photos as `{ src: "...", alt: { en: "...", fr: "..." } }` so blind visitors and Google know what they show.

## Built in

- Phone first: designed at 360px, then tablet and desktop. 44px+ tap targets, with no sideways scrolling.
- Sticky header that slims as you scroll, animated mobile menu, scroll-in animations, and respect for "reduce motion" settings.
- English / French switch (remembered), and light / dark mode (remembered).
- Floating WhatsApp button with a pre-filled message, click-to-call and email links.
- Footer year updates itself.
- Google: title, description, Open Graph tags, and schema.org data built from `config.js`.
- No trackers and no cookies. Works over HTTPS.
- Filterable gallery with a swipeable full-screen view (arrow keys on computers), and a drag-to-compare before/after slider.
- 3-step quote form (service → details and photos → contact and preferred date) that sends to Formspree or as a pre-filled WhatsApp message.
- Auto-playing, swipeable testimonials with star ratings, a FAQ, and a sticky "Get a free quote" bar on phones.

---
Template by [WebLuxe](https://webluxe.github.io/WebLuxe/), Mauritius. Sample photos from [Unsplash](https://unsplash.com). The businesses, people, prices and reviews in the demo are invented.
