import data from './team.json';

/**
 * The organizing team, in the order the roster renders them: president, vice
 * president, then directors and chairs.
 *
 * Data comes from `team.json`, which `npm run build` refreshes from the events portal's
 * Google Sheet (see portal/README.md); the committed copy is the fallback.
 *
 * `photo` is the path to a headshot under `static/headshots`, or `null` while one
 * is still outstanding — those tiles fall back to the hatched placeholder, so
 * a missing photo costs a slot on the page rather than a broken image. Add
 * one by dropping the original into `_originals/team/<slug>.jpg`, running
 * `npm run headshots`, and filling in the path here.
 *
 * @type {{ name: string, role: string, photo: string | null }[]}
 */
export const team = data.team;

/**
 * General members, alphabetical by last name. Same shape as `team`; every
 * row renders with the role "Member".
 *
 * @type {{ name: string, photo: string | null }[]}
 */
export const members = data.members;
