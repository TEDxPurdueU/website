/**
 * SHA-256 of the team password for /links. Shared by the page (which unlocks
 * the builder) and api/shortlinks.js (which checks it again before creating a
 * link), so the two cannot drift. A hash is not secret: the password is long
 * and random, so it cannot be worked back from this. If you ever pick a weaker
 * one, move the check to a Vercel environment variable instead.
 * To change it: printf '%s' 'new password' | shasum -a 256
 */
export const PASSWORD_SHA256 = '0894012affbb630bb196cdee6a5c1d7fcf4510720800f20e65180a94a5735c54';
