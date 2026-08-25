# TEDxPurdueU website

Static SvelteKit site, fully prerendered via `@sveltejs/adapter-static`. No
server runtime. Staying host-agnostic is deliberate — this project has already
been moved once, and the build should not need changing to move again.

## Commands
- `npm run dev` — dev server
- `npm run build` — prerender to `build/`
- `npm run check` — svelte-check; must be 0 errors, 0 warnings
- `npm run images` — regenerate `static/img/` and `src/lib/gallery.js` from `_originals/`
- `npm run headshots` — regenerate `static/team/` from `_originals/team/`

## Photos
Raw camera files live in `_originals/` (gitignored, ~400MB). `npm run images`
resizes each to a 1600px full and a 600px thumbnail, converts to WebP, bakes in
EXIF rotation and strips metadata. It also generates `src/lib/gallery.js`, so
adding a photo is: drop it in `_originals/`, run the script, commit. Never hand-edit
`gallery.js`.

Team headshots are separate: originals go in `_originals/team/<slug>.jpg` and
`npm run headshots` writes one 600px square WebP per person to `static/team/`.
They are not part of `npm run images` because that script wipes `static/img/`
on every run. After adding one, point the matching row in `src/lib/team.js` at
`/team/<slug>.webp`; rows left at `photo: null` render the hatched placeholder.

## Deploy Configuration (configured by /setup-deploy)
- Platform: Vercel
- Production URL: https://tedxpurdueu.org
- Vercel project: tedx-website (scope `ion05s-projects`, id `prj_wC7GShhNISpgq1qPLcNySNlqKW3o`)
- Deploy workflow: auto-deploy on push to main (Vercel git integration)
- Deploy status command: `npx vercel ls tedx-website --scope ion05s-projects`
- Merge method: squash
- Project type: static web app
- Post-deploy health check: `curl -sf https://tedxpurdueu.org -o /dev/null -w '%{http_code}'` → expect 200

### Custom deploy hooks
- Pre-merge: `npm run check && npm run build`
- Deploy trigger: automatic on push to main
- Deploy status: poll production URL
- Health check: https://tedxpurdueu.org (also verify https://www.tedxpurdueu.org)

### DNS
Registrar and DNS are GoDaddy; nameservers stay at GoDaddy (not delegated to Vercel).
Apex is a single `A @ → 76.76.21.21`; `www` is a CNAME to the apex. If parked or
forwarding records reappear, they round-robin traffic away from Vercel and break
certificate issuance.

### Notes
- `vercel.json` sets `framework: null` on purpose. Vercel's SvelteKit preset expects
  `.vercel/output` from `adapter-vercel`; this build emits `build/`, so the preset is off.
- The dashboard still shows "SvelteKit" as the detected preset — `vercel.json` overrides it at build time.

## Skill routing

When the user's request matches an available skill, invoke it via the Skill tool. When in doubt, invoke the skill.

Key routing rules:
- Product ideas/brainstorming → invoke /office-hours
- Strategy/scope → invoke /plan-ceo-review
- Architecture → invoke /plan-eng-review
- Design system/plan review → invoke /design-consultation or /plan-design-review
- Full review pipeline → invoke /autoplan
- Bugs/errors → invoke /investigate
- QA/testing site behavior → invoke /qa or /qa-only
- Code review/diff check → invoke /review
- Visual polish → invoke /design-review
- Ship/deploy/PR → invoke /ship or /land-and-deploy
- Save progress → invoke /context-save
- Resume context → invoke /context-restore
- Author a backlog-ready spec/issue → invoke /spec
