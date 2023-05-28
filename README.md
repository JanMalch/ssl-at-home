# SSL at Home <img src="/static/favicon.png?raw=true" width="90" height="90" align="right">

_A simple web app to create and host your own self-signed certificates, intended for your home network._

> Use at your own risk!

## Installation

Run the `janmalch/ssl-at-home:latest` Docker image.

**Make sure you set the `ORIGIN` environment variable to the address [where the app will be served](https://kit.svelte.dev/docs/adapter-node#environment-variables-origin-protocol-header-and-host-header).**

All generated files will be saved in `/app/files`. So you might want to create a Docker volume for that directory.

## Credits

- https://youtu.be/VH4gXcvkmOY
- https://github.com/ChristianLempa/cheat-sheets/blob/d0305c26e5e595176cf04bc8943de06a1bf719ae/misc/ssl-certs.md
