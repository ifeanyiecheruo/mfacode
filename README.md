MFACODE
=======

Authentication code generator for multi factor Authentication

Installing
----------

`npm install -g mfacode`

Usage
------

`mfacode [command] [<parameter>...]`

eg `mfacode get github`

Commands:

* `add <accountName> [clockSkew]`
  adds an account to your secret store.
  Optionally specifying an amount, in seconds, to offset your devices clock (clock skew). This is useful if your local device's clock is not in sync with the remote authenticating server and the device clock cannot be adjusted.
  You will be prompted interactively for the account secret
* `get  <accountName>`
  gets the authentication code for an account
* `rm <accountName>`
  removes the authentication secret for an account from your secret store
* `ls`
  lists the accounts that have authentication secrets stored
* `help`
  displays usage syntax for mfacode

Accounts and authentication secrets
-----------------------------------

Accounts are the services that require an authentication code as a second factor to sign in. e.g. AWS, GitHub, AWS

When you enable multi-factor authentication on those services and add an device, you will usually be presented with a QR code to scan. There should also be an option to display the secret encoded in the QR code. This secret should be a Base32 encoded string and is the secret you enter when prompted by the `add` command.

mfacode stores the secret in whatever secret store is provided by the operating system (DPAPI for windows, Keychain for OSX)
