import { applicationUrl, nominationUrl } from '$lib/nav.js';

/**
 * Short links: tedxpurdueu.org/<slug> sends the visitor on to `url`. To add one,
 * add a line here and merge; Vercel rebuilds and it is live in about a minute.
 * `what` names the destination for the redirect page ("Taking you to the ...")
 * and for the link builder. Slugs are lowercase (the host treats /YC-event and
 * /yc-event as different paths) and must not reuse the name of a real page
 * (team, sponsors ...), because the page would win.
 */
export const shortLinks = [
	{ slug: 'apply', url: applicationUrl, what: 'application form' },
	{ slug: 'nominate', url: nominationUrl, what: 'nomination form' },
	{ slug: 'speak', url: nominationUrl, what: 'nomination form' },
	{ slug: 'yc-event', url: 'https://events.ycombinator.com/yc-purdue-2026', what: 'YC at Purdue event page' }
];
