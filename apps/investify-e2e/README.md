# Investify-e2e

Run test suite:

e2e tests use [Synpress](https://github.com/Synthetixio/synpress) under the hood. This is a wrapper around Cypress that handles downloading, connecting to and authenticating with metamask.

Run it using the below command from the root directory:

```sh
$ nx synpress investify-e2e
```

> Remember to configure your .env file with the correct network informations (local RPC for instance) to test the target chain interactions.

## Troubleshooting

---

### Cannot connect to browser

By default, synpress uses chrome as the browser, and will expect it to be installed on your system.

See the Synpress docs if you want to switch to another browser.

### Metamask issues

Cypress extensions require a certain set of dependencies to be installed, depending on your OS. See the [Cypress Docs](https://docs.cypress.io/guides/getting-started/installing-cypress#System-requirements) for Windows, MacOS, and installation instructions for most Linux distros.

For Arch Linux based distros, ensure the following packages are installed:

Arch Core:

```sh
sudo pacman -s gtk2 gtk3 libnotify dconf nss alsa-lib libxtst xorg-xauth unzip
```

AUR (we are using Paru here as an example):

```
paru -S xscreensaver
```

Please see [this issue](https://github.com/cypress-io/cypress-docker-images/issues/378) for a full reference Manjaro docker image.
