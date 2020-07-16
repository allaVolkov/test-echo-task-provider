import * as vscode from 'vscode';

const outputChannel = vscode.window.createOutputChannel("echo-channel");

class EchoTaskProvider implements vscode.TaskProvider {

	async provideTasks(): Promise<vscode.Task[]> {
		const taskA = this.createTask("aaa", "text aaa");
		const taskB = this.createTask("bbb", "text bbb");
		if (taskA === undefined || taskB === undefined){
			return [];
		}
		return [taskA, taskB];
	}

	async resolveTask(task: vscode.Task): Promise<vscode.Task | undefined>{
		if (vscode.workspace.workspaceFolders === undefined || 
			(task.definition.type !== "echo" && task.definition.taskType != "echo")) {
			return undefined;
		}
		return new vscode.Task( 
			task.definition, 
            vscode.workspace.workspaceFolders[0], 
            task.name,
            "echo",
		new vscode.ShellExecution("sleep 2; echo "+task.definition.text, {cwd: vscode.workspace.workspaceFolders[0].uri.path}));
	}

	private createTask(label: string, text: string): vscode.Task | undefined {
		if (vscode.workspace.workspaceFolders === undefined) {
			return undefined;
		}
        return new vscode.Task( 
			{type: "echo", label: label, text: text}, 
            vscode.workspace.workspaceFolders[0], 
            label,
            "echo",
		new vscode.ShellExecution("sleep 2; echo "+text, {cwd: vscode.workspace.workspaceFolders[0].uri.path}));
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
	context.subscriptions.push(allTasksCommand);

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
		outputChannel.appendLine(task.definition.type+": "+task.name+" ["+JSON.stringify(task.definition)+"]");
	}
}
