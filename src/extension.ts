// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

const outputChannel = vscode.window.createOutputChannel("echo-channel");

class EchoTaskProvider implements vscode.TaskProvider {

	provideTasks(): vscode.Task[] {
		const taskA = this.createTask("aaa", "text aaa");
		const taskB = this.createTask("bbb", "text bbb");
		if (taskA === undefined || taskB === undefined){
			return [];
		}
		return [taskA, taskB];
	}

	resolveTask(task: vscode.Task): vscode.ProviderResult<vscode.Task> {
		throw new Error("Method not implemented.");
	}

	private createTask(label: string, text: string): vscode.Task | undefined {
		if (vscode.workspace.workspaceFolders === undefined) {
			return undefined;
		}
        return new vscode.Task( 
			{type: "echo", label: label, text: text}, 
			label,
			vscode.workspace.workspaceFolders[0].uri.path, 
		new vscode.ShellExecution("echo "+text, {cwd: vscode.workspace.workspaceFolders[0].uri.path}));
	}
}

export function activate(context: vscode.ExtensionContext) {

	let echoTasksCommand = vscode.commands.registerCommand('fetch-echo-tasks', async () => {
		const tasks = await vscode.tasks.fetchTasks({type:"echo"});
		showTasks(tasks, "echo tasks");
	});
	context.subscriptions.push(echoTasksCommand);

	let allTasksCommand = vscode.commands.registerCommand('fetch-all-tasks', async () => {
		const tasks = await vscode.tasks.fetchTasks();
		showTasks(tasks, "all tasks");
	});
	context.subscriptions.push(echoTasksCommand);

	vscode.tasks.registerTaskProvider(
		"echo",
		new EchoTaskProvider()
	  );

}

// this method is called when your extension is deactivated
export function deactivate() {}

function showTasks(tasks: vscode.Task[], title: string){
	outputChannel.appendLine("========================================");
	outputChannel.appendLine(title);
	outputChannel.appendLine("========================================");
	for (const i in tasks){
		const task = tasks[i];
		outputChannel.appendLine(task.definition.type+": "+task.name);
	}
}
