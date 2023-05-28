<script lang="ts">
	import { afterSubmit, ariaValidation, setBusy } from '$lib/form.directives';
</script>

<svelte:head>
	<title>New root CA &middot; SSL at Home</title>
	<meta name="description" content="Create a new root CA." />
</svelte:head>

<main>
	<article>
		<hgroup>
			<h1>New root CA</h1>
			<h2>Generate a new root CA .</h2>
		</hgroup>

		<form method="POST">
			<label for="name"> Name </label>
			<input type="text" id="name" name="name" required use:ariaValidation />

			<label for="passphrase"> Passphrase </label>
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
				>You will have to enter the passphrase again, when creating server certificates with this
				new root CA.</small
			>

			<label for="cn"> Common Name </label>
			<input type="text" id="cn" name="cn" required use:ariaValidation />

			<label for="days"> Validity in days </label>
			<input type="number" id="days" name="days" required value="365" use:ariaValidation />

			<button type="submit" use:afterSubmit={setBusy}>Create</button>
		</form>
	</article>
</main>
