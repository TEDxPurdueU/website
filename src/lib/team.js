/**
 * The organizing team, in the order the roster renders them: president, vice
 * president, then directors and chairs.
 *
 * `photo` is the path to a headshot under `static/team`, or `null` while one
 * is still outstanding — those tiles fall back to the hatched placeholder, so
 * a missing photo costs a slot on the page rather than a broken image. Add
 * one by dropping the original into `_originals/team/<slug>.jpg`, running
 * `npm run headshots`, and filling in the path here.
 *
 * @type {{ name: string, role: string, photo: string | null }[]}
 */
export const team = [
	{ name: 'Aayan Agarwal', role: 'President', photo: '/team/aayan-agarwal.webp' },
	{ name: 'Ben Packer', role: 'Vice President', photo: null },
	{ name: 'Sophia Smith', role: 'Marketing Director', photo: null },
	{ name: 'Laiba Farooqi', role: 'Curations Chair', photo: null },
	{ name: 'Alaina Salsaa', role: 'Salons Chair', photo: null },
	{ name: 'Gia Sareen', role: 'Operations Chair', photo: null }
];
