<script lang="ts">
	import { afterSubmit, ariaValidation, setBusy } from '$lib/form.directives';
</script>

<svelte:head>
	<title>Quickstart &middot; SSL at Home</title>
	<meta name="description" content="Quickstart to create a root CA and wildcard certificate." />
</svelte:head>

<main>
	<article>
		<hgroup>
			<h1>Quickstart</h1>
			<h2>Generate a root CA and a wildcard certificate, that are valid for the next 100 years.</h2>
		</hgroup>

		<form method="POST">
			<label for="domain"> Domain </label>
			<input
				type="text"
				id="domain"
				name="domain"
				required
				pattern="[\w\-]+\.\w+"
				placeholder="example.home"
				use:ariaValidation
			/>
			<small>
				<code>.home</code> is the recommended top-level-domain. The domain will also be used for the
				name of the root CA.</small
			>

			<label for="passphrase"> Root CA: Passphrase </label>
			<input
				type="password"
				id="passphrase"
				name="passphrase"
				minlength="4"
				maxlength="1023"
				required
				use:ariaValidation
			/>
			<small
				>You will only have to enter the passphrase again, if you want to issue new certificates
				with this new root CA in the future.</small
			>

			<button type="submit" use:afterSubmit={setBusy}>Create</button>
		</form>
	</article>

	<p>
		You may <a href="/">skip the quickstart</a>, if you want more control over the individual
		values.
	</p>
</main>
