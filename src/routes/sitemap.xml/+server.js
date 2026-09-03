import { indexablePages, absoluteUrl } from '$lib/seo.js';

export const prerender = true;

/** @param {string} value */
const escapeXml = (value) =>
	value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

export function GET() {
	const urls = indexablePages
		.map(
			({ path, changeFrequency, priority }) => `
	<url>
		<loc>${escapeXml(absoluteUrl(path))}</loc>
		<changefreq>${changeFrequency}</changefreq>
		<priority>${priority}</priority>
	</url>`
		)
		.join('');

	return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`, {
		headers: { 'Content-Type': 'application/xml; charset=utf-8' }
	});
}
