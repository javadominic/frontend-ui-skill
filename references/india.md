# India defaults

Apply when the audience, client or product is in India, which is the default for this project owner's work unless the brief says otherwise. These defaults fix things that generic design skills get wrong for Indian users.

Contents: Numbers and currency · Dates and phone · Scripts and line height · Contact and payment actions · Mock data · Devices and network · Trust content

## Numbers and currency

Indian digit grouping puts the first comma after three digits, then every two: 1,00,000 (one lakh) and 1,00,00,000 (one crore). Use the browser's locale support, not string tricks.

```js
const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
inr.format(125000);          // "₹1,25,000"

const compact = new Intl.NumberFormat("en-IN", { notation: "compact", maximumFractionDigits: 1 });
compact.format(1250000);     // "12.5L" or similar; check the output in your target browsers
```

- Use the rupee sign (₹). Do not write Rs. or INR in running UI unless the brief says so.
- Use one format on the whole screen. Do not mix 1,25,000 and 125,000, or ₹1.25L and ₹125000.
- Decide once whether the product speaks in lakh and crore (common for Indian audiences) or in thousands and millions, and keep it consistent.
- Figures use `tabular-nums` and the mono face from `fonts.md`, right-aligned in columns.
- If prices include GST, say so once, near the price: "Including GST" or "Excluding GST".

## Dates and phone

- `new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" })` gives "8 Nov 2026". Day first is the norm.
- Time: 12-hour with am/pm is common in consumer UI, 24-hour in operations tools. Pick one.
- Phone: `+91 98765 43210`. Make phone numbers tappable with `tel:+919876543210`.
- Address: building, area, city, state, six-digit PIN code. Make the PIN code field numeric (`inputmode="numeric"`, `autocomplete="postal-code"`).

## Scripts and line height

- Check script coverage before choosing a font (see `fonts.md`). Many Latin display fonts have no Devanagari.
- Indic scripts have taller marks above and below the line. Use a line height of at least 1.6 for body text in Devanagari (compared with 1.5 for Latin), and avoid clipping with `overflow: hidden` on tight boxes.
- Headings in Devanagari at display sizes need more space, not tighter tracking. Do not apply negative letter spacing to Indic text, it breaks joined letters.
- Do not uppercase or force text transforms on Indic text, they do nothing and can confuse mixed strings.
- Set `lang="hi"` (or the right code) on the content so browsers select the right font, hyphenation and screen reader voice. Mixed pages mark each span.
- Test with the real translated copy. Hindi strings are often longer than English ones and break fixed-width buttons.

## Contact and payment actions

Small business sites in India often win or lose on how quickly a customer can reach the owner.

- **WhatsApp as a first-class action.** `https://wa.me/919876543210?text=Hi%2C%20I%27d%20like%20a%20quote` opens a chat with a prefilled message. Use the real number, without `+` or spaces.
- **Call button** with `tel:` on mobile, visible without scrolling.
- Show the owner's name, a real address with PIN code, and opening hours where the business has a location.
- **UPI** QR or pay link where the business takes payments. Do not invent a UPI ID.
- Do not put an email form as the only contact route for a local shop.
- Pin the primary contact action in a bottom bar on mobile if the page is long.

## Mock data

Use realistic Indian data in placeholders and test fixtures, in the language and region of the client.

- Names from the client's region and community mix. Not "John Doe".
- Prices at the right scale for the market (an average order of ₹450, not $45).
- Cities and areas that exist, PIN codes that match them.
- Never use real people's names or photos as testimonials. Placeholders must be visibly placeholders, and the report lists them for replacement with real ones.

## Devices and network

Plan for a mid-range Android phone on mobile data as the typical case.

- Design and test at 375px first.
- Budget: first screen usable fast. Hero image under about 150 KB in AVIF or WebP, other images lazy-loaded, no auto-playing video above the fold. See `quality.md`.
- Keep JavaScript small. Heavy animation libraries and 3D scenes are loaded only when needed.
- Dark mode saves battery on OLED screens, offer it where the product is used for long sessions.
- Support low-memory behaviour: do not run particle effects or several large canvases.

## Trust content

For small businesses, proof is what converts: real photos of the shop and team, real reviews with a source (Google reviews link), real certifications such as GST registration or FSSAI where relevant, a real address on a map. If the client does not have these yet, leave a clearly marked gap and tell them what to supply. Never fabricate.
