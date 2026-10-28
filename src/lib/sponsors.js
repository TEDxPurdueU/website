/**
 * Current sponsors, in the order the sponsors page lists them.
 *
 * `logo` is a path under `static/sponsors`, or `null` until a sponsor sends
 * one — those tiles render the name as a wordmark instead, so a missing logo
 * never leaves a blank slot. `url` is optional; tiles without one are not links.
 *
 * @type {{ name: string, url: string | null, logo: string | null }[]}
 */
export const sponsors = [
	{
		name: 'SFAB',
		url: 'https://www.purdue.edu/sao/fundraising/soga-sfab.php',
		logo: '/sponsors/sfab.webp'
	},
	{
		name: 'Department of Computer Science',
		url: 'https://www.cs.purdue.edu',
		logo: '/sponsors/purdue-cs.webp'
	},
	{
		name: 'Department of English',
		url: 'https://cla.purdue.edu/academic/english/',
		logo: '/sponsors/purdue-english.webp'
	},
	{
		name: 'School of Languages and Cultures',
		url: 'https://cla.purdue.edu/academic/slc/',
		logo: null
	},
	{
		name: 'School of Interdisciplinary Studies',
		url: 'https://cla.purdue.edu/academic/sis/',
		logo: null
	}
];
