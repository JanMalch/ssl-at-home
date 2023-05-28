<script lang="ts">
	import { afterSubmit, ariaValidation, setBusy } from '$lib/form.directives';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>New Server &middot; SSL at Home</title>
	<meta name="description" content="Create a files for a new server." />
</svelte:head>

<main>
	<article>
		<hgroup>
			<h1>New Server</h1>
			<h2>Generate key and certificate for a new server.</h2>
		</hgroup>

		<form method="POST">
			<label for="name"> Name </label>
			<input type="text" id="name" name="name" required use:ariaValidation />

			<label for="root_ca"> Root CA </label>
			<select id="root_ca" name="root_ca" required>
				{#each data.rootCas as rootCa (rootCa.name)}
					<option value={rootCa.name}>{rootCa.name}</option>
				{/each}
			</select>

			<label for="passphrase"> Root CA: Passphrase </label>
			<input type="password" id="passphrase" name="passphrase" required use:ariaValidation />

			<label for="dns_names"> DNS names </label>
			<input
				type="text"
				id="dns_names"
				name="dns_names"
				placeholder="*.example.home, foo.bar.home"
				use:ariaValidation
			/>

			<label for="ip_addresses"> IP addresses </label>
			<input
				type="text"
				id="ip_addresses"
				name="ip_addresses"
				placeholder="192.168.1.100, 192.168.1.101"
				use:ariaValidation
			/>

			<label for="cn"> Common Name </label>
			<input type="text" id="cn" name="cn" required use:ariaValidation />

			<label for="days"> Validity in days </label>
			<input type="number" id="days" name="days" required value="365" use:ariaValidation />

			<button type="submit" use:afterSubmit={setBusy}>Create</button>
		</form>
	</article>
</main>
