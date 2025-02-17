# PendantReader

![Screenshot](documentation/pictures/ScreenCap.png "Example of Usage")

In this day and age, almost everything has gone digital, including documentation. This has been done in an effort to reduce the use of paper and hopefully save a tree or two.

This URCap gives you access to the documentation right at your fingertips while you are working with the robot.

As long as it is a UR robot from the e-series or a UR20, with Polyscope X installed, that is.

Note:

PolyScope X is, at the time of writing, only available in a beta version.

For further details, please see PolyScope X Open Beta. (https://forum.universal-robots.com/t/polyscope-x-open-beta-announcement/36988)

## How to Scroll
Currently it can be needed to "double tap" to scroll through the pdf.
You can "double tap" on the PDF itself and swipe, but also on the scrollbar thumb followed by a drag.

## Features
- File selections.
- Word Search with highlighting.
- Varius way to transverse the PDF including Scrolling, page turning, and go to a page number.

## Looks great, I want to use it (Installation the easy way)

Go to the "[Releases](https://github.com/DasGruene/pend-read/releases)", here on GitHub and download the latest URCap.

If using a real robot, transfer it to a USB, insert the USB into the robot, and press the so-called "hamburger menu" button in the top left corner. Press "System Manager -> URCaps" and install it by unlocking, using your password, and pressing the "+ URCap" button.

The URCap should now be visible to you after exiting "System Manager" and pressing "Application".

For the simulator, just skip the USB part; otherwise, the rest should be the same.

## I want to modify it (installation for further modification and/or development in VS Code)

NOTE: I am using Linux, so this might be different on Windows, but I suspect a lot of the steps to be the same as most are done directly within VS Code.


For this guide to work, you will first need to have installed [VS Code](https://code.visualstudio.com/), [Docker](https://code.visualstudio.com/docs/devcontainers/tutorial#_install-docker) and the [Docker Extension for VS Code](https://code.visualstudio.com/docs/devcontainers/tutorial#_install-the-extension).


First, go to the official [Polyscope X SDK GitHub](https://github.com/UniversalRobots/PolyScopeX_URCap_SDK) and clone or download a copy of it.

Now open the folder in VS Code, and in the lower left corner, the "Docker Extension" should have added a blue button, ![Docker Extension](documentation/pictures/DockerExtension.png "Docker Extension Button"), Press it.

Now choose the option "Open Folder in Container."  ![Docker Extension](documentation/pictures/OpenInContainer.png "Docker Extension Drop Down").

Now please wait for the Docker container to setup, as this will take some time the first time around.

(To stop working inside the devcontainer, just press the blue button once more and press "Reopen Folder Locally," but please wait to do so until the end of this guide.)

When it's done, it will have created a bunch of new files and folders.

(This paragraph might not be relevant on Windows.)  As part of this process, permission to the main folder and its content is given to the Docker container. We therefore now have two options. One, using chmod to change the permission of the folder back to something where we also can access it all or do the rest of the necessary steps directly inside VS Code and the open Docker container.

As I'm sure there is a good reason for these permission changes? Let's better proceed to do everything from VS Code.

###### With GIT:

Inside VS Code with the project opened inside the container. Open a new terminal and git clone this project such that it lies beside the "samples", "images", and "urcap-generator" folders.

###### Without GIT:

With the Polyscope X SDK open within the devcontainer in VS Code. Simply drag and drop the top folder of a downloaded version of this code base into VS Code.

<br>

Your file tree should then look like the structure below.

![Docker Extension](documentation/pictures/FolderStrucktur.png "Docker Extension Drop Down").

Now inside the terminal, move to the URCap folder:

```bash

cd ./pend-read

```

and call the install script

```bash

./install.sh

```

Then go back and start the URSim.

```bash

cd ..

./run-simulator

```

After some time, the simulator should be up and running as a local web server on your PC at [http://localhost/](http://localhost/), Be sure to open the simulator in a Chrome-based browser (Chrome, Chromium, Edge, and others), as it will only work 100% here.

Open a new terminal again.

Go back to the URCap and run the build script to build the URCap and "push" it to the simulator.


```bash

cd ./pend-read

./build-urcap.sh

```

This is also the script you will want to run when you have made any changes to the code.

Now go to the simulator in your browser and refresh the page. The Urcap should now be visible to you after you have pressed "Application".

### Further help needed?

Get more help directly from the source: [Polyscope X SDK documentation](https://docs.universal-robots.com/PolyScopeX_SDK_Documentation/build/PSX-SDK-v0.13/index.html), [Universal Robots Discord,](https://discord.com/invite/sEjRgEf6fp) or [Universal Robots Forum](https://forum.universal-robots.com)


## I've found a bug. What now?

Please do report it, but know that Polyscope X is also just in a beta version, and because of that there might be bugs that simply are not the fault of this URCap.

## Credit Where Credit is Due

Like this project?

This project was only made possible because of the free

and the open-source repository [ng2-pdf-viewer](https://github.com/VadimDez/ng2-pdf-viewer) by Vadym Yatsyuk,. So if this project made you feel the need to donate a cup of joe to a hardworking software developer, do look his way instead of mine; you'll find a link at the bottom of his GitHub page!

## What Does the Future Hold?

While I do think that the current version is doing its job, it is really only doing the minimum you would expect from a PDF reader.

The first step is getting it in the hands of people and running on some real robots. Thereafter, there is a lot of room for continued development.

###### Framework Related

While I have previously created URCaps and programmed in JavaScript, this is my first URCap for PolyScope X and my first time ever working in TypeScript and Angular.

I would therefore love to get to know the ins and outs of it all by:

1. Creating a backend or DB to temporary store copies of an open file, such the open file can be automatically reopened after a restart (and after a refresh in the URsim). As simply reloading it from a path isn't an option in a web framework.

2. Creating support for multiple languages.

3. Learning how unit tests are supported in this framework and adding them.


###### Robot Related

I would also love to find a way to bind a robot program to a certain PDF.

This would allow a welder or machinist to bind a drawing of a part to its program, making it easy to identify what part the program is related to when it's opened at a later date.

I do think this is the most important category, as it's here where this tool becomes distinct from your everyday normal PDF reader, and I hope that through continued development there will come new ideas and ways to use this tool that make sense and only make sense in the context of robotics.

###### General PDF Reader Related

There is, in general, a lot of features missing that you would expect from a modern PDF reader, like zoom, bookmarks, "fit to width," "fit to height," and the list continues.

All of which could be nice to implement at some point.

###### Other

Well a good official Icon/Logo would be nice
