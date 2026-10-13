/**
 * Every salon, in any order. The salons page splits them into Upcoming and Past
 * by `end`, so nothing here needs moving once a salon is over.
 *
 * `image` is a portrait (4:5) path under `static/`, or `null` until we have one
 * — those render the hatched placeholder. `collab` and `rsvp` are optional.
 * Times are Purdue local time (America/Indiana/Indianapolis).
 *
 * @type {{
 *   slug: string,
 *   title: string,
 *   blurb: string,
 *   start: string,
 *   end: string,
 *   collab: string | null,
 *   image: string | null,
 *   imageAlt: string,
 *   rsvp: string | null
 * }[]}
 */
export const salons = [
	{
		slug: 'daniel-stenberg-ama',
		title: 'AMA with Daniel Stenberg',
		blurb:
			'Ask the inventor of cURL anything. cURL powers HTTP requests on billions of devices, and Daniel was recently awarded the Gold Medal by the Royal Swedish Academy of Engineering Sciences.',
		start: '2026-10-17T12:00',
		end: '2026-10-17T13:00',
		collab: 'Purdue Hackers',
		image: '/img/salon-daniel-stenberg.webp',
		imageAlt: 'Flyer for the AMA with Daniel Stenberg, Sat Oct 17 at 12:00 PM',
		rsvp: 'https://luma.com/ovmbfrtu'
	}
];
