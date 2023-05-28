<details>
	<summary>Android</summary>
	<p>The exact steps vary device-to-device, but here is a generalised guide:</p>
	<ol>
		<li>Open Phone Settings</li>
		<li>
			Locate <code>Encryption and Credentials</code> section. It is generally found under
			<code>Settings &gt; Security &gt; Encryption and Credentials</code>
		</li>
		<li>Choose <code>Install a certificate</code></li>
		<li>Choose <code>CA Certificate</code></li>
		<li>
			Locate the certificate file <code>ca.pem</code> on your SD Card/Internal Storage using the file
			manager.
		</li>
		<li>Select to load it.</li>
		<li>Done!</li>
	</ol>
</details>

<details>
	<summary>Windows</summary>
	<p>Assuming the path to your generated CA certificate as <code>C:\ca.pem</code>, run:</p>
	<pre>Import-Certificate -FilePath "C:\ca.pem" -CertStoreLocation Cert:\LocalMachine\Root</pre>

	<ul>
		<li>
			Set <code>-CertStoreLocation</code> to <code>Cert:\CurrentUser\Root</code> in case you want to
			trust certificates only for the logged in user.
		</li>
	</ul>

	<strong>OR</strong>
	In Command Prompt, run:

	<pre>certutil.exe -addstore root C:\ca.pem</pre>
	<ul>
		<li>
			<code>certutil.exe</code> is a built-in tool (classic <code>System32</code> one) and adds a system-wide
			trust anchor.
		</li>
	</ul>
</details>

<details>
	<summary>Debian & Derivatives</summary>
	<ul>
		<li>
			Move the CA certificate (<code>ca.pem</code>) into
			<code>/usr/local/share/ca-certificates/ca.crt</code>.
		</li>
		<li>Update the Cert Store with:</li>
	</ul>
	<pre>sudo update-ca-certificates</pre>
	<p>
		Refer the documentation <a href="https://wiki.debian.org/Self-Signed_Certificate" rel="nofollow"
			>here</a
		>
		and
		<a
			href="https://manpages.debian.org/buster/ca-certificates/update-ca-certificates.8.en.html"
			rel="nofollow">here.</a
		>
	</p>
</details>

<details>
	<summary>Fedora</summary>
	<ul>
		<li>
			Move the CA certificate (<code>ca.pem</code>) to
			<code>/etc/pki/ca-trust/source/anchors/ca.pem</code>
			or <code>/usr/share/pki/ca-trust-source/anchors/ca.pem</code>
		</li>
		<li>Now run (with sudo if necessary):</li>
	</ul>
	<pre>update-ca-trust</pre>
	<p>
		Refer the documentation <a
			href="https://docs.fedoraproject.org/en-US/quick-docs/using-shared-system-certificates/"
			rel="nofollow">here.</a
		>
	</p>
</details>

<details>
	<summary>Arch</summary>
	<p>System-wide – Arch(p11-kit) (From arch wiki)</p>
	<ul>
		<li>Run (As root)</li>
	</ul>
	<pre>trust anchor --store myCA.crt</pre>
	<ul>
		<li>
			The certificate will be written to /etc/ca-certificates/trust-source/myCA.p11-kit and the
			"legacy" directories automatically updated.
		</li>
		<li>
			If you get "no configured writable location" or a similar error, import the CA manually:
		</li>
		<li>Copy the certificate to the /etc/ca-certificates/trust-source/anchors directory.</li>
		<li>and then</li>
	</ul>
	<pre>update-ca-trust</pre>
	<p>
		wiki page <a
			href="https://wiki.archlinux.org/title/User:Grawity/Adding_a_trusted_CA_certificate"
			rel="nofollow">here</a
		>
	</p>
</details>

<cite>
	<small>
		&ndash;&nbsp; <a
			href="https://github.com/ChristianLempa/cheat-sheets/blob/d0305c26e5e595176cf04bc8943de06a1bf719ae/misc/ssl-certs.md#install-the-ca-cert-as-a-trusted-root-ca"
		>
			ChristianLempa / cheat-sheets
		</a>
	</small>
</cite>

<style lang="scss">
	pre {
		font-size: 1em;
		border-radius: 3px;
		padding: 0.5em;
		overflow-x: auto;
	}
</style>
