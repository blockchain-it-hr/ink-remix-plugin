# ink!-remix-plugin

Welcome to the ink! Remix plugin.
For more info on the ink! join us on chat: <https://riot.im/app/#/room/#ink:matrix.parity.io>

## How to use

Go to <https://remix-alpha.ethereum.org/> then to Plugin manager.

Then in the plugin manager click on Connect to a Local Plugin.

![plugin-manager](static/plugin_manager.png)

You can set Plugin Name and Display Name to any string.
Url is: <https://develop.ink-remix.blockchain-it.hr>
Click ok.

![load_plugin](static/load_plugin.png)

You should have now clean loaded ink.
Accept any permissions that Remix is asking of you.

Next step is to create a project.
Input project/contract name and click on Create project.

![ink_remix_plugin](static/ink_clean.png)

There will be a couple of permission screens, accept them all. :)

![ink_remix_plugin](static/permissions.png)

Next click on Testing. It will open a screen like on the next image.

![ink_remix_plugin](static/building.png)

Click on the build button. As building progresses you will see logs from the backend building logs in real-time.

Congratulations you’ve managed to create and build your first ink! project. :)

Feel free to change the project and update the code and build it again, create a new project or anything else. 

## Technical documentation

### New

* On frontend clicking on Create new project button opens text area where string input is expected

* This triggers the creation of projectName/lib.rs and projectName/Cargo.toml and saves them into Remix file manager

* Next /new endpoint is called on the backend. Project is created with path storage/projectId/projectName

* ProjectId is returned from the backend and saved into local storage. This identifier is used to keep track of which server originally created the project.

### Build

* Content of Cargo.toml, lib.rs, projectId and projectName are send on backend.

* Backend checks if a project with path storage/projectId/projectName exists, if not it creates a new one and sets lib.rs and Cargo.toml to sent values

* Build is then triggered and wasm and abi is returned to the frontend
Frontend saves wasm and abi to state

### Deploy

## Possible upgrades in the future

* Package whole project into tar/zip so it can be extracted and used elsewhere
* Integrating version control into the flow (git add, commit, push)

If you want to propose a feature or request, please open an issue or make a pull request

## Important links

* Code is located on <https://github.com/blockchain-it-hr/ink-remix-plugin>

* Docker images are on Docker Hub:
<https://hub.docker.com/repository/docker/blockchainit/ink-plugin>
<https://hub.docker.com/repository/docker/blockchainit/ink-server>
