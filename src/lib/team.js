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
	{ name: 'Sophia Smith', role: 'Marketing Chair', photo: '/headshots/sophia-smith.webp' },
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
	{ name: 'Koree Arndt', photo: '/headshots/koree-arndt.webp' },
	{ name: 'Aryan Bansal', photo: '/headshots/aryan-bansal.webp' },
	{ name: 'Riley Chapla', photo: '/headshots/riley-chapla.webp' },
	{ name: 'Connor Johnson', photo: '/headshots/connor-johnson.webp' },
	{ name: 'Shauryeh Raj Kapur', photo: '/headshots/shauryeh-raj-kapur.webp' },
	{ name: 'Fatimah Khan', photo: '/headshots/fatimah-khan.webp' },
	{ name: 'Matthew Krunnfusz', photo: '/headshots/matthew-krunnfusz.webp' },
	{ name: 'Kylyne Kuo', photo: '/headshots/kylyne-kuo.webp' },
	{ name: 'Maguire Mosby', photo: '/headshots/maguire-mosby.webp' },
	{ name: 'Linda Ontiveros', photo: '/headshots/linda-ontiveros.webp' },
	{ name: 'Mahi Ramteke', photo: '/headshots/mahi-ramteke.webp' },
	{ name: 'Anjali Ranasinghe', photo: '/headshots/anjali-ranasinghe.webp' },
	{ name: 'Sarah Robinovitz', photo: '/headshots/sarah-robinovitz.webp' },
	{ name: 'Anthony John Rossini', photo: '/headshots/anthony-john-rossini.webp' },
	{ name: 'Maya Seong', photo: '/headshots/maya-seong.webp' },
	{ name: 'Newson Shen', photo: '/headshots/newson-shen.webp' },
	{ name: 'Ajitesh Veeramachaneni', photo: '/headshots/ajitesh-veeramachaneni.webp' },
	{ name: 'Lillian Whitson', photo: '/headshots/lillian-whitson.webp' }
];
