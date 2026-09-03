<script>
	import { absoluteUrl, site } from '$lib/seo.js';

	/**
	 * @type {{
	 *   title: string,
	 *   description: string,
	 *   path: string,
	 *   image?: string,
	 *   imageAlt?: string,
	 *   type?: 'website' | 'article',
	 *   structuredData?: Record<string, unknown> | Record<string, unknown>[]
	 * }}
	 */
	let {
		title,
		description,
		path,
		image = site.image,
		imageAlt = site.imageAlt,
		type = 'website',
		structuredData = []
	} = $props();

	const canonical = $derived(absoluteUrl(path));
	const imageUrl = $derived(absoluteUrl(image));
	const pageSchema = $derived({
		'@type': 'WebPage',
		'@id': `${canonical}#webpage`,
		url: canonical,
		name: title,
		description,
		isPartOf: { '@id': `${site.url}/#website` },
		about: { '@id': `${site.url}/#organization` },
		primaryImageOfPage: {
			'@type': 'ImageObject',
			url: imageUrl
		}
	});
	const breadcrumbSchema = $derived(
		path === '/'
			? null
			: {
					'@type': 'BreadcrumbList',
					itemListElement: [
						{
							'@type': 'ListItem',
							position: 1,
							name: 'Home',
							item: `${site.url}/`
						},
						{
							'@type': 'ListItem',
							position: 2,
							name: title,
							item: canonical
						}
					]
				}
	);
	const jsonLd = $derived(
		JSON.stringify({
			'@context': 'https://schema.org',
			'@graph': [
				pageSchema,
				...(breadcrumbSchema ? [breadcrumbSchema] : []),
				...(Array.isArray(structuredData) ? structuredData : [structuredData])
			]
		}).replace(/</g, '\\u003c')
	);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="author" content={site.name} />
	<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
	<link rel="canonical" href={canonical} />

	<meta property="og:type" content={type} />
	<meta property="og:site_name" content={site.name} />
	<meta property="og:locale" content={site.locale} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={imageUrl} />
	<meta property="og:image:width" content="1600" />
	<meta property="og:image:height" content="1067" />
	<meta property="og:image:alt" content={imageAlt} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content={site.twitterHandle} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={imageUrl} />
	<meta name="twitter:image:alt" content={imageAlt} />

	{@html `<script type="application/ld+json">${jsonLd}</script>`}
</svelte:head>
