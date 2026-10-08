# Login & Security

The first administrator account comes from installation. After database initialization, the initial password is cleared from the config file. Manage subsequent account changes under **Login & Security** in admin.

## Account Changes

New passwords must contain 8–128 characters and be entered twice; leave the field empty to keep the current password. Sensitive actions open a verification dialog requesting the current password or TOTP as appropriate. Never share agent tokens, notification credentials or backups in troubleshooting screenshots.

## TOTP Two-Factor Authentication

1. Generate a secret under **Login & Security** and save its QR code or key in your authenticator.
2. Enable two-factor authentication using the current six-digit code.
3. Admin sign-in then requires a code, and every remote execution must supply a valid code too.

Keep authenticator recovery information safe and synchronize the clocks on the backend and your phone. **Signed-in devices** lists sessions and lets you sign other devices out immediately.

## Turnstile

**Protect admin sign-in** and **Protect public dashboard** are separate switches. Enter the matching Site Key and Secret Key for the site's domain, save, and check both entry points. Leaving previously saved key fields empty keeps their stored values.

A successful browser challenge does not by itself complete sign-in: the backend still verifies the challenge, credentials and any enabled TOTP. When troubleshooting, check backend connectivity, hostname, key pairing and logs rather than relying only on the browser's success indicator.

## Networking and Local Permission

Script installations listen on `127.0.0.1:2206` by default. Use an HTTPS [reverse proxy](/en/guide/proxy) for public access and limit trusted proxy ranges.

Remote execution requires backend TOTP verification and is also restricted by the agent's local `--disable-remote` flag. The panel cannot override that flag. See [Remote Execution](/en/guide/nodes#remote-execution) for enable/disable steps.
