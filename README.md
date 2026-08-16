# TEDx Purdue U

The club website — five pages, static, built with SvelteKit.

| Page                        | Route       | Source                            |
| --------------------------- | ----------- | --------------------------------- |
| About                       | `/`         | `src/routes/+page.svelte`         |
| Unseen 2027                 | `/unseen`   | `src/routes/unseen/+page.svelte`  |
| Salons                      | `/salons`   | `src/routes/salons/+page.svelte`  |
| Student Speaker Competition | `/speakers` | `src/routes/speakers/+page.svelte`|
| Team                        | `/team`     | `src/routes/team/+page.svelte`    |

## Running it

```sh
npm install
npm run dev      # local dev server
npm run build    # static site → build/
npm run preview  # serve the built site
npm run check    # type + a11y check
```

Every route is prerendered by `@sveltejs/adapter-static`, so `build/` is plain
HTML/CSS/JS. Drop it on GitHub Pages, Netlify, Vercel, or any static host — no
server needed.

## How it's put together

- `src/app.css` — the palette and shared type/button styles. Colors live as CSS
  variables on `:root`: `--bg` (`#0d0d0d`), `--red` (`#ff2b06`, the logo red),
  and the grey ramp. Change a color once here and it changes everywhere.
- `src/lib/nav.js` — the page list, social links, and contact email. The header
  and footer both read from it, so adding or renaming a page is a one-line edit.
- `src/lib/components/` — `Header`, `Footer`, and `Placeholder` (the hatched box
  standing in for photos that haven't been shot yet).
- Page content lives in arrays at the top of each `+page.svelte`, so copy edits
  don't mean touching markup.

## Content still to fill in

The design shipped with placeholders. Each one is marked with a `TODO` comment
in the source:

| What                    | Where                                                    |
| ----------------------- | -------------------------------------------------------- |
| Conference date         | `src/routes/unseen/+page.svelte` — `facts`                |
| Speaker portraits/names | `src/routes/unseen/+page.svelte` — `speakerSlots`         |
| Application link        | `src/routes/speakers/+page.svelte` — the status badge     |
| Salon dates             | `src/routes/salons/+page.svelte` — `upcoming`             |
| Real names and roles    | `src/routes/team/+page.svelte` — `team`                   |
| Headshots               | `src/routes/team/+page.svelte` — `<Placeholder>` elements |
| Social URLs             | `src/lib/nav.js` — `socials`                              |
| Contact email           | `src/lib/nav.js` — `contactEmail`                         |
| Audience photo          | `src/routes/+page.svelte` — `<Placeholder>`               |

To swap a placeholder for a real photo, drop the image in `static/` and replace
the `<Placeholder … />` with an `<img>` at the same aspect ratio.

## Design source

The approved design prototype and the conversation behind it are kept in
`project/` and `chats/` for reference. `project/HANDOFF.md` explains that bundle.
