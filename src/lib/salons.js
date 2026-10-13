import events from './events.json';

/**
 * Salons, from `events.json` (kept up to date by the events portal; see portal/README.md).
 * Every salon, in any order. The salons page splits them into Upcoming and Past
 * by `end`, so nothing here needs moving once a salon is over.
 *
 * `image` is a portrait (4:5) path under `static/`, or `null` until we have one
 * — those render the hatched placeholder. `collab` and `rsvp` are optional.
 * Times are Purdue local time (America/Indiana/Indianapolis).
 *
 * @type {{
 *   slug: string,
 *   title: string,
 *   blurb: string,
 *   start: string,
 *   end: string,
 *   collab: string | null,
 *   image: string | null,
 *   imageAlt: string,
 *   rsvp: string | null
 * }[]}
 */
export const salons = events.filter((e) => e.type === 'salon');
