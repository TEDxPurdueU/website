<script>
	import Redirect from '$lib/components/Redirect.svelte';

	let { data } = $props();
</script>

<Redirect url={data.link.url} what={data.link.what} />
