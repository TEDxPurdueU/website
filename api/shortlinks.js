// The one piece of the site that is not static: a Vercel Function behind the
// "New short link" form on /links. It adds a line to src/lib/shortlinks.json
// through GitHub, and the push makes Vercel rebuild the site. The repo is the
// database, so there is nothing else to run. On any other host the form simply
// reports that it cannot be reached; the rest of the site is unaffected.
//
// Needs one environment variable in Vercel: GITHUB_TOKEN, a fine-grained token
// for this repository with "Contents: Read and write". It is never sent to the
// browser or written to a response.
import { createHash, timingSafeEqual } from 'node:crypto';
import { PASSWORD_SHA256 } from '../src/lib/linkspassword.js';

const REPO = 'TEDxPurdueU/website';
const FILE = 'src/lib/shortlinks.json';
const SITE = 'tedxpurdueu.org';
const GITHUB = process.env.GITHUB_API_URL || 'https://api.github.com';

// Addresses that already mean something. A short link on one of these would
// never be reached (the real page wins) or would shadow a file.
const RESERVED = new Set([
	'apply', 'nominate', 'speak',
	'links', 'team', 'salons', 'speakers', 'vision', 'sponsors', 'sponsor', '2027-event', 'coming-soon',
	'api', 'img', 'headshots', 'illustrations', 'index', '404'
]);

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** @param {import('node:http').ServerResponse} res @param {number} status @param {object} body */
function send(res, status, body) {
	res.statusCode = status;
	res.setHeader('content-type', 'application/json');
	res.setHeader('cache-control', 'no-store');
	res.end(JSON.stringify(body));
}

/** @param {unknown} candidate */
function passwordOk(candidate) {
	if (typeof candidate !== 'string') return false;
	const given = createHash('sha256').update(candidate).digest();
	return timingSafeEqual(given, Buffer.from(PASSWORD_SHA256, 'hex'));
}

/**
 * The destination as a clean absolute https URL, or null. Plain http, other
 * schemes, addresses with a login in them, hosts with no dot (`https:///x`
 * parses as the host "x") and our own domain (a loop) are out.
 *
 * @param {unknown} value
 */
function cleanUrl(value) {
	if (typeof value !== 'string' || value.length > 2000) return null;
	let url;
	try {
		url = new URL(value.trim());
	} catch {
		return null;
	}
	if (url.protocol !== 'https:' || url.username || url.password || !url.hostname.includes('.')) return null;
	if (url.hostname === SITE || url.hostname.endsWith(`.${SITE}`)) return null;
	return url.toString();
}

/** @param {string} token @param {string} path @param {RequestInit} [init] */
const github = (token, path, init) =>
	fetch(`${GITHUB}/repos/${REPO}/contents/${FILE}${path}`, {
		...init,
		headers: {
			authorization: `Bearer ${token}`,
			accept: 'application/vnd.github+json',
			'user-agent': 'tedxpurdueu-shortlinks'
		}
	});

/**
 * Append the link to the file on `branch`. Read, add, write back with the
 * file's version (sha); if someone else changed it in between, GitHub answers
 * 409 and we go round once more from the fresh copy.
 *
 * @returns {Promise<'added' | 'taken'>}
 */
async function addLink(token, branch, slug, url) {
	for (let attempt = 0; attempt < 2; attempt++) {
		const read = await github(token, `?ref=${encodeURIComponent(branch)}`);
		if (!read.ok) throw new Error(`GitHub read failed: ${read.status}`);
		const file = await read.json();
		const links = JSON.parse(Buffer.from(file.content, 'base64').toString('utf8'));
		if (links.some((/** @type {{ slug: string }} */ link) => link.slug === slug)) return 'taken';
		links.push({ slug, url });
		const write = await github(token, '', {
			method: 'PUT',
			body: JSON.stringify({
				message: `Add short link /${slug}`,
				content: Buffer.from(`${JSON.stringify(links, null, '\t')}\n`).toString('base64'),
				sha: file.sha,
				branch
			})
		});
		if (write.ok) return 'added';
		if (write.status !== 409) throw new Error(`GitHub write failed: ${write.status}`);
	}
	throw new Error('GitHub write kept conflicting');
}

/** @param {import('node:http').IncomingMessage & { body?: unknown }} req @param {import('node:http').ServerResponse} res */
export default async function handler(req, res) {
	if (req.method !== 'POST') {
		res.setHeader('allow', 'POST');
		return send(res, 405, { error: 'Use POST.' });
	}
	if (!passwordOk(req.headers['x-links-password'])) {
		return send(res, 401, { error: 'That password is not right.' });
	}
	const token = process.env.GITHUB_TOKEN;
	if (!token) {
		return send(res, 503, { error: 'Short link creation is not set up yet (GITHUB_TOKEN is missing in Vercel).' });
	}

	const { slug, url: destination } = req.body ?? {};
	const url = cleanUrl(destination);
	if (typeof slug !== 'string' || !SLUG.test(slug) || slug.length > 40) {
		return send(res, 400, { error: 'The short name can only use lowercase letters, numbers and single dashes (up to 40 characters).' });
	}
	if (RESERVED.has(slug)) return send(res, 400, { error: `/${slug} is already a page on the site. Pick another name.` });
	if (!url) return send(res, 400, { error: 'The destination must be a full https:// address (not tedxpurdueu.org itself).' });

	// Production builds main; a preview builds its own branch, so a test on a
	// preview never touches the live list.
	const branch = process.env.VERCEL_GIT_COMMIT_REF || 'main';
	try {
		if ((await addLink(token, branch, slug, url)) === 'taken') {
			return send(res, 409, { error: `/${slug} is already taken. Pick another name.` });
		}
	} catch (error) {
		console.error('shortlinks:', error instanceof Error ? error.message : error);
		return send(res, 502, { error: 'GitHub did not accept the change. Try again in a moment.' });
	}
	send(res, 201, { slug, url });
}
