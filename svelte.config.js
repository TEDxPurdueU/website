import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// Every page is prerendered to static HTML — the whole site is a handful
		// of documents plus assets, so it can be hosted anywhere (Vercel,
		// Netlify, Cloudflare Pages, S3) with no server. Staying host-agnostic
		// is deliberate: moving hosts should not mean changing the build.
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			// Emitted for unknown paths so +error.svelte renders as the 404 rather
			// than whatever generic page the host would show.
			fallback: '404.html',
			precompress: false,
			strict: true
		})
	}
};

export default config;
