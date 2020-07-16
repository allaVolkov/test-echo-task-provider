# Readme.md

## Problem

Function `vscode.tasks.fetchTasks` in Theia works different than in VSCode. Task provided by Task Provider are fetched correcly, but if this task saved in tasks configuration (`tasks.json`) it's fetched in VSCode and not fetched in Theia.

## How to reproduce in VSCode

1. Clone this project.
2. Open this project in VSCode (I used v1.46.1).
3. Run `npm install` and `npm run compile`.
4. Run Extension from the Run View.
5. In the `Extension Development Host` window open folder `testdata` of this project.
6. Open Output view
7. From the command palette select command `fetch echo tasks`.
8. Select output channel named `echo-channel`.
9. Ensure that 3 tasks are provided:
`Detected task 1
Detected task 2
Configured task 3`
10. This is expected behavior
11. For further reprodicing in Theia package this project with command: `vsce package`. File `echotaskprovider-0.0.1.vsix` will be created in the root of the project.

## How to reproduce in Theia

1. Open [https://gitpod.io/#https://github.com/eclipse-theia/theia](https://gitpod.io/#https://github.com/eclipse-theia/theia) to start development with the master branch.
2. Gitpod will start a properly configured for Theia development workspace, clone and build the Theia repository.
3. After the build is finished,, upload `echotaskprovider-0.0.1.vsix` extension into folder `plugin`.
4. Run from the terminal in Gitpod:
`cd examples/browser && yarn run start ../.. --hostname 0.0.0.0`.
5. Open `localhost:3000`.
6. In the `Extension Development Host` window open folder `testdata` of this project.
7. From the command palette select command `fetch echo tasks`.
8. Select output channel named `echo-channel`.
9 Ensure that only 2 tasks are provided:
`Detected task 1
Detected task 2`

## Workaround

1. Change the `Configured task 3` task in `tasks.json` file adding property "taskType": "". 
2. Save the file.
3. Run command `fetch echo tasks`.
4. All 3 tasks are fetched now.
