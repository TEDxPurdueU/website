# Hidden routes

Routes parked out of `src/routes` so they are not built or reachable.

- `team/` — the team roster, hidden until real headshots exist. To restore:
  move it back to `src/routes/team` and re-add
  `{ href: '/team', label: 'Team', footerLabel: 'Team' }` to `pages` in
  `src/lib/nav.js`.
