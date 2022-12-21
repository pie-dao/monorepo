# auxo-dao-e2e

This package contains the e2e test suite logic for the auxo-dao app.

## Setup

1. Make sure you have a `.env` file set in the root of the auxo-dao-e2e directory. You can see an example of the file in `.env.example`

_At the time of writing, tests are written with an explicit test account in mind, grab the private key of the account from knxpwr or jordaniza_

2. Serve the auxo-dao application on port 4200 with `Nx serve auxo-dao`

3. Start forks of the blockchain networks you wish to test. We will likely be migrating all config into this repo in the future, but for now:

- 3a. Clone [dapp-workstation](https://github.com/pie-dao/dapp-workstation) and follow setup instructions
- 3b. Run the following commands inside the dapp-workstation to start forks and initialise the state:

```sh
# Terminal 1
yarn fork:mainnet

# Terminal 2
yarn fork:ftm

# Terminal 3
yarn run:fork scripts/auxo-dao/init.ts
yarn run:fork:ftm scripts/auxo-dao/auxo.ts

```

## Run test suite:

e2e tests use [Synpress](https://github.com/Synthetixio/synpress) under the hood. This is a wrapper around Cypress that handles downloading, connecting to and authenticating with metamask.

Run it using the below command from the root directory:

```sh
$ nx synpress auxo-dao-e2e
```

> Remember to configure your .env file with the correct network informations (local RPC for instance) to test the target chain interactions.

## Troubleshooting

---

### Tests not working

- Ensure the auxo-dao app is running and on port 4200
- Ensure all env vars are set correctly, in both the auxo-dao and auxo-dao e2e package
- Ensure the forks are running and the initialisation scripts have completed successfully
- Ensure you are not running niche operating systems for nerds

### Cannot connect to browser

By default, synpress uses chrome as the browser, and will expect it to be installed on your system.

See the Synpress docs if you want to switch to another browser.

### Missing style-jsx

Run into on some computers that you are missing style-jsx package. If you do find this, just npm install the library and restart the app.

### Metamask issues

Cypress extensions require a certain set of dependencies to be installed, depending on your OS. See the [Cypress Docs](https://docs.cypress.io/guides/getting-started/installing-cypress#System-requirements) for Windows, MacOS, and installation instructions for most Linux distros.

For Arch Linux based distros, ensure the following packages are installed:

Arch Core:

```sh
sudo pacman -S gtk2 gtk3 libnotify dconf nss alsa-lib libxtst xorg-xauth unzip
```

AUR (we are using Paru here as an example):

```
paru -S xscreensaver
```

Please see [this issue](https://github.com/cypress-io/cypress-docker-images/issues/378) for a full reference Manjaro docker image.
