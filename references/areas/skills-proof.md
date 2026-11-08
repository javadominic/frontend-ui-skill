# Area: skills and project proof

Use when the scope is a skills, tech stack, projects, case studies, portfolio or "work" section, on a personal portfolio or an agency site. The job of this area is to make claims believable. A claim with evidence beats a claim with decoration.

## Principle

Every skill points to something that proves it. Every project shows what was real: the problem, the role, the stack, the result. If a number is not known, it stays out. Invented metrics, fake logos and made-up client names are the fastest way to lose a serious reader.

## Skills

Slop to remove:

- Percentage bars and sliders ("React 90%"). They are invented and mean nothing.
- A wall of logos or icons with no grouping.
- Star ratings, "expert / intermediate" badges, or gauges.
- Every technology listed, including ones used once.

Do this instead:

- **Group by what you build with it**, not by alphabet: for example "Interfaces", "Backends and data", "Security", "Delivery". Use names that fit the person's real work.
- **Show depth with evidence.** Next to each skill or group, link the project that used it. A plain line of text such as "Next.js, Firebase: UniOS, donation widget" is stronger than an icon.
- **Order by relevance to the reader.** Lead with what the visitor hires or evaluates for.
- Use text or small monochrome icons from one set. No brand-colour logos in a rainbow.
- Keep it to what you would be happy to be interviewed on.

## Project proof

Each project card or case study has, in this order, only what is true:

1. **Name and one-line outcome** in plain words: what it is and who it is for.
2. **Role**: what you did, especially when it was a team or hackathon project.
3. **Stack**: a short line.
4. **A real visual**: an actual screenshot or a short recording at its true proportions, not a mockup of a different design. If the app is private, show a faithful crop with the data replaced.
5. **Evidence**: one of a live link, a repository, a demo video, a result with a source (a hackathon placement, a user count you can verify, a client who agreed to be named, load time you measured).
6. **What was hard or what you learned**: one honest sentence. It reads as proof of real work.

Rules:

- No metrics you cannot defend. "Reduced load time from 4.2 s to 1.6 s on a mid-range Android" with your measurement is good. "Increased conversions 300%" with no source is not.
- No logos, testimonials or client names without permission. Placeholders are visibly marked in the design and listed in the report.
- Tell the truth about scope: a hackathon prototype is labelled as one.
- Link to the live thing or the code whenever possible.

## Layout

- Vary the size by importance. Lead with one or two flagship projects at large size with real screenshots. The rest are a compact list (name, one line, stack, link), not equal cards with generated cover art.
- Alternating text and image rows work for case studies. Keep image proportions consistent across projects.
- Filters or tags only when there are enough projects (more than about eight) to need them.
- Avoid a carousel that hides work behind arrows. Reading order should be visible.

## Moments

The moment is one project shown beautifully: a high-quality screenshot or a short loop of the real product with a calm treatment, or a single diagram of how a hard thing works. Everything else stays quiet.

## Copy

- Say what you built, in plain verbs: "Built", "Designed", "Shipped".
- No "passionate", "crafting digital experiences", "innovative solutions". If the sentence could appear on any developer's page, rewrite it with a fact only this person has.
- For an agency: speak in outcomes for named kinds of clients ("billing pages for small shops") rather than generic service lists.

## Technical and security portfolios

Security, networking, hardware and developer-tool sections are the most likely to arrive wearing a costume: terminal green, SNAKE_CASE labels, `//` prefixes, everything monospace, status badges. The costume says "hacker" and proves nothing. Keep the feel in one place and put the proof everywhere else.

- **Plain section names.** "Security work", "Projects", "Tools". Not "Security_Protocols" or "Discipline Dossier".
- **Mono for data only:** tool names, commands, payloads, ports, file paths, figures. Headings and paragraphs are sans.
- **One accent**, used for the selected item, one status dot and the links. Chrome stays neutral.
- **One theme signature at most:** a static prompt glyph by the logo, a thin cursor-style underline on the active item, or real command output as the featured visual. Not all of them.
- **The proof is the bright element:** a real tool screenshot or terminal capture, a redacted report, a CVE or write-up link, a repository. No made-up output.
- **Honest distinctions.** If some work was on production systems and some in a lab, say it once per item in plain words ("Production", "Lab"). Do not stack VERIFIED, ACTIVE and AUTHENTICATED badges.
- **Claims need evidence next to them.** "80+ payload injections" is fine beside the tool and a link or screenshot. "Zero synthetic metrics" with nothing shown is a slogan.
- **Ethics line.** A short, plain statement about authorised testing only, once, in the footer or the relevant item.
- **Layout.** Master-detail (`references/layouts.md`) with a sliding marker and a panel that changes with a short fade and rise (`references/motion.md`, component recipes).
- **Gaps stay visible.** If an item has no scope, tools or evidence yet, say so in plain words and list it in the report. Do not fill it with invented detail.

## Checks for this area

- No percentage bars, gauges or star ratings.
- Each skill group points to at least one project that proves it.
- Each project has a real screenshot, a role, a stack, and a link or a clear reason there is none.
- Every number and name in the section can be defended. Unverified ones are removed or marked and listed in the report.
- The section passes the template test: swap the person's name and projects and it no longer fits.
- No SNAKE_CASE, `//` prefixes or all-mono text. Mono appears only on tool names, commands and figures.
