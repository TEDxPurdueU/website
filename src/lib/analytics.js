/**
 * Visit analytics (PostHog). The library is imported on demand, in the
 * browser only, so it adds nothing to first paint.
 */
import { currentUtm } from '$lib/utm.js';

// A PostHog project key is public by design (it ships in every page), so it is
// committed here and a build on any host tracks without extra configuration.
// The env vars point a build at a different project or region.
const KEY =
	import.meta.env.VITE_POSTHOG_KEY || 'phc_kWaPb2wk2E7gdmV2BQavvJCQWWUcUX4fGMGqFfThxyAH';
const HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com';

/** @type {(value?: unknown) => void} */
let open = () => {};
/** Held shut until the browser is idle, or until something urgent opens it. */
const gate = new Promise((resolve) => (open = resolve));

/**
 * Resolves once PostHog is running, or to undefined if it could not load
 * (offline, blocked): analytics must never be able to break the site.
 */
const posthog = KEY
	? gate
			.then(() => import('posthog-js'))
			.then(({ default: ph }) => {
				ph.init(KEY, {
					api_host: HOST,
					// Nobody signs in, so there are no people to profile.
					person_profiles: 'identified_only',
					autocapture: false,
					// We send $pageview ourselves, on SvelteKit navigations.
					capture_pageview: false,
					disable_session_recording: true,
					// No feature flags or surveys here, so skip their requests.
					advanced_disable_flags: true,
					disable_surveys: true,
					respect_dnt: true,
					// No cookies, so no consent banner.
					persistence: 'localStorage'
				});
				return ph;
			})
			.catch(() => undefined)
	: undefined;

/** Start loading PostHog once the main thread has nothing better to do. */
export function startAnalytics() {
	if (!posthog) return;
	if ('requestIdleCallback' in window) requestIdleCallback(() => open(), { timeout: 2000 });
	else setTimeout(open, 500);
}

/**
 * Record an event. It waits for PostHog to load, then goes out with the
 * visit's UTM tags. The tags are added here as well as read from the URL by the
 * library itself: it only sees the URL at the moment it sends, which may be a
 * page later than the event, and the names (`utm_source` ...) are the ones it
 * uses, so Web Analytics reads both the same way.
 *
 * `instant` is for events sent as the page is being left: it skips the
 * waiting for idle, and uses a beacon, which the browser delivers even after
 * the page is gone. The promise resolves once the event is handed over.
 *
 * @param {string} event
 * @param {Record<string, unknown>} [props]
 * @param {boolean} [instant]
 * @returns {Promise<void>}
 */
export function track(event, props = {}, instant = false) {
	if (!posthog) return Promise.resolve();
	const tags = currentUtm();
	if (instant) open();
	return posthog.then((ph) => {
		ph?.capture(
			event,
			{ ...tags, ...props },
			instant ? { send_instantly: true, transport: 'sendBeacon' } : undefined
		);
	});
}

/** Longest a visitor is held for analytics before being sent on anyway. */
const MAX_WAIT_MS = 1200;

/**
 * Wait for an event to be recorded, but only up to MAX_WAIT_MS: a slow or
 * blocked PostHog must never trap the visitor on a page they are leaving.
 *
 * @param {Promise<void>} recorded
 */
export function boundedWait(recorded) {
	return Promise.race([recorded, new Promise((resolve) => setTimeout(resolve, MAX_WAIT_MS))]);
}

/**
 * A page view. The URL is read now rather than when PostHog gets to it, which
 * can be after the visitor has already moved on.
 */
export function pageview() {
	return track('$pageview', { $current_url: location.href, $pathname: location.pathname });
}
