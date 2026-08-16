/**
 * The five pages of the site, in the order they appear in the header.
 * `label` is the compact header wording; `footerLabel` is the longer form
 * the footer column uses.
 */
export const pages = [
	{ href: '/', label: 'About', footerLabel: 'About' },
	{ href: '/unseen', label: 'Unseen 2027', footerLabel: 'Unseen 2027' },
	{ href: '/salons', label: 'Salons', footerLabel: 'Salons' },
	{ href: '/speakers', label: 'Speaker Comp', footerLabel: 'Speaker Competition' },
	{ href: '/team', label: 'Team', footerLabel: 'Team' }
];

/** Social links shown in the footer. TODO: swap in the club's real handles. */
export const socials = [
	{ name: 'Instagram', href: 'https://instagram.com/tedxpurdueu' },
	{ name: 'Twitter', href: 'https://twitter.com/tedxpurdueu' },
	{ name: 'Facebook', href: 'https://facebook.com/tedxpurdueu' }
];

/** TODO: replace with the club's real contact address. */
export const contactEmail = 'hello@tedxpurdueu.org';
