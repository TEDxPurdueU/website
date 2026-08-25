# Hidden routes

Routes parked out of `src/routes` so they are not built or reachable.

- `team/` — the team roster. Names and roles are real (see `src/lib/team.js`),
  but five of the six headshots are still outstanding, so it stays parked here
  rather than shipping a page of placeholders. To restore:
  move it back to `src/routes/team` and re-add
  `{ href: '/team', label: 'Team', footerLabel: 'Team' }` to `pages` in
  `src/lib/nav.js`.
