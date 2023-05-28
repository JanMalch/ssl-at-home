<script lang="ts">
	import { afterSubmit, ariaValidation, setBusy } from '$lib/form.directives';
</script>

<svelte:head>
	<title>Setup &middot; SSL at Home</title>
	<meta name="description" content="Initial setup for SSL at Home." />
</svelte:head>

<article>
	<hgroup>
		<h1>Setup</h1>
		<h2>Set an admin password before getting started.</h2>
	</hgroup>

	<form method="POST">
		<label for="password"> Admin Password </label>
		<input type="password" id="password" name="password" required use:ariaValidation />

		<label for="password_repeat"> Repeat Admin Password </label>
		<input
			type="password"
			id="password_repeat"
			name="password_repeat"
			required
			use:ariaValidation
		/>

		<button type="submit" use:afterSubmit={setBusy}>Finish setup</button>
	</form>
</article>
