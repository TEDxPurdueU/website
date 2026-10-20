/**
 * The one tag we use: where a visit came from. Medium, campaign and the rest
 * are deliberately left out so links stay short and sources stay easy to read.
 */
export const UTM_KEYS = ['utm_source'];

const STORE = 'tedx_utm';

/** Fallback for when storage is blocked: lasts until the page is reloaded. @type {Record<string, string>} */
let memory = {};

/**
 * The UTM tags present in a query string.
 *
 * @param {string} search e.g. `location.search`
 * @returns {Record<string, string>}
 */
export function parseUtm(search) {
	const params = new URLSearchParams(search);
	/** @type {Record<string, string>} */
	const found = {};
	for (const key of UTM_KEYS) {
		const value = params.get(key);
		if (value) found[key] = value;
	}
	return found;
}

/**
 * Keep this visit's tags for the rest of the tab session, so later pages and
 * outbound links still know where the visitor came from. A new tagged URL
 * replaces the old tags; an untagged page leaves them alone.
 */
export function rememberUtm() {
	const found = parseUtm(location.search);
	if (!Object.keys(found).length) return;
	memory = found;
	try {
		sessionStorage.setItem(STORE, JSON.stringify(found));
	} catch {
		// Storage can be blocked (private mode); the tags then live in `memory`.
	}
}

/** @returns {Record<string, string>} the tags remembered for this visit. */
export function currentUtm() {
	try {
		return JSON.parse(sessionStorage.getItem(STORE) ?? 'null') ?? memory;
	} catch {
		return memory;
	}
}

/**
 * Add this visit's UTM tags to an absolute destination link, leaving any tags
 * already on it alone.
 *
 * @param {string} url
 */
export function withUtm(url) {
	const out = new URL(url);
	for (const [key, value] of Object.entries(currentUtm())) {
		if (!out.searchParams.has(key)) out.searchParams.set(key, value);
	}
	return out.toString();
}

/**
 * Where tagged links lead: the application and nomination forms and the YC
 * event page. Matched on host + path so only Google *Forms* qualify, not any
 * Google Doc someone links later.
 */
const OUTBOUND = ['docs.google.com/forms', 'forms.gle/', 'events.ycombinator.com/'];

/** Each tagged link's destination as it was first found, and the URL we tagged it to. */
const tagged = new WeakMap();

/**
 * Tag a link to one of the OUTBOUND destinations just before the browser
 * follows it. Done on click, not at render: the pages are prerendered, so the
 * visitor's tags are only known in the browser, and one listener covers every
 * such link (header, team page, salons) without each having to opt in.
 *
 * @param {MouseEvent} event
 * @returns {{ link: HTMLAnchorElement, destination: string } | undefined} the link and its
 *   untagged destination, when it was one
 */
export function tagOutbound(event) {
	const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
	if (!(link instanceof HTMLAnchorElement)) return;
	if (!OUTBOUND.some((prefix) => (link.host + link.pathname).startsWith(prefix))) return;
	// A repeat click finds the URL we tagged last time; go back to the original so the
	// event reports the same destination every time and fresh tags replace old ones.
	const before = tagged.get(link);
	const destination = before?.tagged === link.href ? before.destination : link.href;
	link.href = withUtm(destination);
	tagged.set(link, { destination, tagged: link.href });
	return { link, destination };
}
