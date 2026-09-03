export const site = {
	name: 'TEDxPurdueU',
	url: 'https://tedxpurdueu.org',
	description:
		'TEDxPurdueU is Purdue University’s student-run TEDx organization, producing an annual conference, community salons, and a student speaker competition.',
	image: '/img/conference-group.webp',
	imageAlt: 'The TEDxPurdueU team on stage at Loeb Playhouse',
	locale: 'en_US',
	twitterHandle: '@tedxpurdueu'
};

export const indexablePages = [
	{ path: '/', changeFrequency: 'weekly', priority: '1.0' },
	{ path: '/2027-event', changeFrequency: 'weekly', priority: '0.9' },
	{ path: '/speakers', changeFrequency: 'monthly', priority: '0.8' },
	{ path: '/salons', changeFrequency: 'weekly', priority: '0.7' },
	{ path: '/team', changeFrequency: 'monthly', priority: '0.6' }
];

/** @param {string} path */
export function absoluteUrl(path) {
	return new URL(path, `${site.url}/`).toString();
}
