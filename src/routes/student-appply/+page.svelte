<script>
	import Redirect from '$lib/components/Redirect.svelte';
	import { studentApplyUrl } from '$lib/nav.js';
</script>

<!-- Typo of /student-apply that went out in an outreach email; keep it working. -->
<Redirect
	url={studentApplyUrl}
	title="Apply to the TEDxPurdueU Student Speaker Competition"
	heading="Taking you to the application"
	what="application form"
/>
