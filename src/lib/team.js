/**
 * The organizing team, in the order the roster renders them: president, vice
 * president, then directors and chairs.
 *
 * `photo` is the path to a headshot under `static/headshots`, or `null` while one
 * is still outstanding — those tiles fall back to the hatched placeholder, so
 * a missing photo costs a slot on the page rather than a broken image. Add
 * one by dropping the original into `_originals/team/<slug>.jpg`, running
 * `npm run headshots`, and filling in the path here.
 *
 * @type {{ name: string, role: string, photo: string | null }[]}
 */
export const team = [
	{ name: 'Aayan Agarwal', role: 'President', photo: '/headshots/aayan-agarwal.webp' },
	{ name: 'Ben Packer', role: 'Vice President', photo: '/headshots/ben-packer.webp' },
	{ name: 'Sophia Smith', role: 'Marketing Director', photo: '/headshots/sophia-smith.webp' },
	{ name: 'Laiba Farooqi', role: 'Curations Chair', photo: '/headshots/laiba-farooqi.webp' },
	{ name: 'Alaina Salsaa', role: 'Salons Chair', photo: '/headshots/alaina-salsaa.webp' },
	{ name: 'Gia Sareen', role: 'Operations Chair', photo: '/headshots/gia-sareen.webp' }
];

/**
 * General members, alphabetical by last name. Same shape as `team`; every
 * row renders with the role "Member".
 *
 * @type {{ name: string, photo: string | null }[]}
 */
export const members = [
	{ name: 'Koree Arndt', photo: null },
	{ name: 'Aryan Bansal', photo: null },
	{ name: 'Riley Chapla', photo: null },
	{ name: 'Elina Dawoodani', photo: null },
	{ name: 'Connor Johnson', photo: null },
	{ name: 'Shauryeh Raj Kapur', photo: null },
	{ name: 'Fatimah Khan', photo: null },
	{ name: 'Matthew Krunnfusz', photo: null },
	{ name: 'Kylyne Kuo', photo: null },
	{ name: 'Maguire Mosby', photo: null },
	{ name: 'Linda Ontiveros', photo: null },
	{ name: 'Mahi Ramteke', photo: null },
	{ name: 'Anjali Ranasinghe', photo: null },
	{ name: 'Sarah Robinovitz', photo: null },
	{ name: 'Anthony John Rossini', photo: null },
	{ name: 'Maya Seong', photo: null },
	{ name: 'Newson Shen', photo: null },
	{ name: 'Ajitesh Veeramachaneni', photo: null },
	{ name: 'Lillian Whitson', photo: null }
];
