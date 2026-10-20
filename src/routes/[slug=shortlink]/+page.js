import { shortLinks } from '$lib/shortlinks.js';

// One route serves every short link. They are named here because nothing on
// the site links to them (they live on posters, slides and QR codes), so the
// build's crawler would never find them.
export const entries = () => shortLinks.map(({ slug }) => ({ slug }));

/** @param {{ params: { slug: string } }} event */
export const load = ({ params }) => ({
	link: /** @type {(typeof shortLinks)[number]} */ (shortLinks.find(({ slug }) => slug === params.slug))
});
