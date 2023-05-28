<script lang="ts">
	import { afterSubmit, setBusy } from '$lib/form.directives';
	import type { PageData } from './$types';
	import RootCaInstallGuide from './RootCaInstallGuide.svelte';

	export let data: PageData;
</script>

<svelte:head>
	<title>SSL at Home</title>
	<meta
		name="description"
		content="Host and generator for self-signed root CAs and server certificates."
	/>
</svelte:head>

<main>
	<div class="grid">
		<article>
			<h1>Root CAs</h1>

			<p>
				Root certificates must be <a href="#instructions">installed on each device</a>, so that
				server certificates are fully trusted.
			</p>

			<table role="grid">
				<tbody>
					{#each data.rootCas as rootCa (rootCa.name)}
						<tr>
							<td>{rootCa.name}</td>
							<td>
								<a href={rootCa.certificate_url}>Certificate</a>
							</td>
							{#if data.isAuthenticated}
								<td>
									<form method="POST" action="/delete?root_ca={rootCa.name}">
										<button type="submit" class="contrast outline icon-button">
											<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
												><title>delete</title>
												<path
													d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"
												/>
											</svg>
										</button>
									</form>
								</td>
							{/if}
						</tr>
					{:else}
						<tr>
							<td><i>No root CAs found.</i></td>
						</tr>
					{/each}
				</tbody>
			</table>
			{#if data.isAuthenticated}
				<div class="actions">
					<a href="/quickstart" role="button" class="secondary">Quickstart</a>
					<a href="/new-root-ca" role="button">New Root CA</a>
				</div>
			{/if}
		</article>
		<article>
			{#if data.isAuthenticated}
				<h1>Servers</h1>
				<p>These files must be placed on the individual backends.</p>

				<table role="grid">
					<tbody>
						{#each data.servers as server (server.name)}
							<tr>
								<td>{server.name}</td>
								<td>
									<a href={server.certificate_url}>Certificate</a>
								</td>
								{#if data.isAuthenticated}
									<td>
										<a href={server.key_url}>Key</a>
									</td>
									<td>
										<form method="POST" action="/delete?server={server.name}">
											<button type="submit" class="contrast outline icon-button">
												<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
													><title>delete</title>
													<path
														d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"
													/>
												</svg>
											</button>
										</form>
									</td>
								{/if}
							</tr>
						{:else}
							<tr>
								<td><i>No servers found.</i></td>
							</tr>
						{/each}
					</tbody>
				</table>

				<div class="actions">
					<a href="/new-server" role="button">New Server</a>
				</div>
			{:else}
				<h1>Login</h1>
				<form method="POST" action="?/login">
					<label for="password">Password</label>
					<input type="password" name="password" id="password" required />
					<button type="submit" use:afterSubmit={setBusy}>Login</button>
				</form>
			{/if}
		</article>
	</div>
	<article id="instructions">
		<h1>Root CAs: Installation</h1>
		<RootCaInstallGuide />
	</article>
</main>

<style lang="scss">
	article:not(#instructions) h1 {
		margin-bottom: 0.5rem;
	}

	td:last-child {
		width: 42px;
		--typography-spacing-vertical: 0;
	}

	button.icon-button {
		--form-element-spacing-vertical: 6px;
		--form-element-spacing-horizontal: 6px;
		--border-radius: 50%;
		--spacing: 0;
		height: 42px;
		width: 42px;
		display: grid;
		place-items: center;
	}

	.actions {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 1rem;
		margin-top: 3rem;
	}

	@media only screen and (max-width: 991px) {
		main article {
			margin: 0.5rem 0;

			&#instructions {
				margin-bottom: var(--block-spacing-vertical);
			}
		}
	}
</style>
