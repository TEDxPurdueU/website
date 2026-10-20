import { shortLinks } from '$lib/shortlinks.js';

/**
 * Only the slugs in the list reach the redirect page; any other one-segment
 * path falls through to the site's 404.
 *
 * @param {string} param
 */
export const match = (param) => shortLinks.some(({ slug }) => slug === param);
