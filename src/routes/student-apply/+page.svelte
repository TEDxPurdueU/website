<script>
	import Redirect from '$lib/components/Redirect.svelte';
	import { studentApplyUrl } from '$lib/nav.js';
</script>

<Redirect
	url={studentApplyUrl}
	what="application form"
/>
