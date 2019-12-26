# ink!-remix-plugin

Welcome to the ink! Remix plugin.
For more info on the ink! join us on [chat](https://riot.im/app/#/room/#ink:matrix.parity.io)

## How to use

Go to [Remix alpha](https://remix-alpha.ethereum.org/), or [Remix](https://remix.ethereum.org/) and then to *Plugin manager*.

Then in the plugin manager click on *Connect to a Local Plugin*.

![plugin-manager](static/plugin_manager.png)

You can set *Plugin Name* and *Display Name* to any string.  
Url is: 
* <https://develop.ink-remix.blockchain-it.hr> for development
* <https://develop.ink-remix.blockchain-it.hr> for staging  
Click ok.

![load_plugin](static/load_plugin.png)

You should have now clean loaded ink.  
Accept any permissions that Remix is asking of you.

![ink_clean](static/ink_clean.png)

Next step is to create a project.  
Input *project/contract name* and click on *Create project*.

![project_created](static/project_created.png)

There will be a couple of permission screens, accept them all. :)

![permissions](static/permissions.png)

Next click on *Testing*. It will open a screen like on the next image.

![ink_remix_plugin](static/building.png)

Click on the build button. As building progresses you will see logs from the backend building logs in real-time.  

Your log should look something like this after a successful build.  

![finished_output](static/finished_output.png)

Congratulations you’ve managed to create and build your first ink! project. :)  
Now, you can select tab *ARTIFACTS* above output window which will give you the option to download generated *testing.wasm* and *metadata.json* files using buttons on the right side.

![artifacts](static/artifacts.png)

Feel free to change the project and update the code and build it again, create a new project or anything else.

## Possible upgrades in the future

* Package whole project into tar/zip so it can be extracted and used elsewhere
* Integrating version control into the flow (git add, commit, push)

If you want to propose a feature or request, please open an issue or make a pull request

## Important links

* Code is located on [link](https://github.com/blockchain-it-hr/ink-remix-plugin)

* Docker images are on Docker Hub:
  * [ink-plugin](https://hub.docker.com/repository/docker/blockchainit/ink-plugin)
  * [ink-server](https://hub.docker.com/repository/docker/blockchainit/ink-server)
