MFACODE
=======

Authentication code generator for multi factor Authentication

Usage
------

`mfacode [command] [<parameter>...]`

eg `mfacode get github`

Commands:

* `add <accountName> <secret>`
  adds the authentication secret for an account to your secret store
* `get  <accountName> [clockSkew]`
  gets the authentication code for an account optionally adjusting the time read from the system clock by clockSkew seconds
* `rm <accountName>`
  removes the authentication secret for an account from your secret store
* `ls`
  lists the accounts that have authentication secrets stored
* `help`
  displays usage syntax for mfacode

Accounts and authentication secrets
-----------------------------------

Accounts are the services that require an authentication code as a second factor to sign in. e.g. AWS, GitHub, AWS

When you enable multi-factor authentication on those services and add an device, you will usually be presented with a QR code to scan. There should also be an option to display the secret encoded in the QR code. This secret should be a Base32 encoded string and is the secret you pass to the `add` command.
