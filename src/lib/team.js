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
