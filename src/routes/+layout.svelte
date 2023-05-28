<script>
	import './styles.scss';
</script>

<div class="container">
	<nav>
		<h1>
			<a href="/">
				<img src="/favicon.png" width="128" height="128" alt="Logo" />
				ssl<sub>@</sub>home
			</a>
		</h1>
	</nav>
	<slot />
</div>

<style lang="scss">
	nav {
		padding: 24px 0;
	}
	img {
		width: 48px;
		height: 48px;
		margin-right: 0.5rem;
	}

	h1 {
		letter-spacing: 2px;
		margin: 0;
	}
</style>
