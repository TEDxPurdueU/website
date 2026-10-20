import { applicationUrl, nominationUrl } from '$lib/nav.js';
import created from './shortlinks.json';

/**
 * Short links: tedxpurdueu.org/<slug> sends the visitor on to `url`. `what`
 * names the destination for the redirect page ("Taking you to the ...") and
 * for the link builder.
 *
 * These three share a URL with a page of the site, so they are written here.
 * Every other short link lives in shortlinks.json, which the "New short link"
 * form on /links edits through api/shortlinks.js (it commits to GitHub and
 * Vercel redeploys). Edit that file by hand if you prefer; `what` is optional
 * there and defaults to the slug.
 *
 * Slugs are lowercase (the host treats /YC-event and /yc-event as different
 * paths) and must not reuse the name of a real page (team, sponsors ...),
 * because the page would win. The form refuses those; api/shortlinks.js holds
 * the list.
 */
export const shortLinks = [
	{ slug: 'apply', url: applicationUrl, what: 'application form' },
	{ slug: 'nominate', url: nominationUrl, what: 'nomination form' },
	{ slug: 'speak', url: nominationUrl, what: 'nomination form' },
	...created.map(({ slug, url, what }) => ({ slug, url, what: what ?? slug.replaceAll('-', ' ') }))
];
