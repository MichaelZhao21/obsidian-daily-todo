import {MarkdownView, Notice, Plugin, TFile} from 'obsidian';
import {DEFAULT_SETTINGS, TodoPluginSettings, TodoSettingTab} from "./settings";
import dayjs from 'dayjs';

const DAILY_HEADER = "**Daily**";
const WEEKLY_HEADER = "**Weekly**";
const MONTHLY_HEADER = "**Monthly**";

export default class DailyTodoPlugin extends Plugin {
	settings: TodoPluginSettings;

	async onload() {
		await this.loadSettings();

		this.addCommand({
			id: 'insert-daily-todo',
			name: 'Insert Daily Todo',
			callback: this.insertDailyTodo.bind(this),
		});
		this.addCommand({
			id: 'insert-weekly-tasks',
			name: 'Insert Weekly Tasks',
			callback: this.insertWeeklyTasks.bind(this),
		})

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new TodoSettingTab(this.app, this));
	}

	onunload() {
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData() as Partial<TodoPluginSettings>);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async insertDailyTodo() {
		const date = dayjs().format('dddd M/D');
		const template = await this.getTemplateContents();

		// Find daily tasks
		const dailyIndex = template.indexOf(DAILY_HEADER);
		const weeklyIndex = template.indexOf(WEEKLY_HEADER);
		const dailyTasks = template.substring(dailyIndex, weeklyIndex);

		const formatted = `## ${date}\n- [ ] \n\n${dailyTasks}`;
		this.insertAtCursor(formatted);
	}

	async insertWeeklyTasks() {
		const template = await this.getTemplateContents();

		// Find weekly tasks
		const weeklyIndex = template.indexOf(WEEKLY_HEADER);
		const monthlyIndex = template.indexOf(MONTHLY_HEADER);
		const weeklyTasks = template.substring(weeklyIndex, monthlyIndex);

		this.insertAtCursor(weeklyTasks);
	}

	async getTemplateContents(): Promise<string> {
		const file = this.app.vault.getAbstractFileByPath(this.settings.templateName + ".md");
		if (!(file instanceof TFile)) {
			const err = `Error: Template file not found: ${this.settings.templateName}`;
			new Notice(err);
			throw new Error(err);
		}

		const contents = await this.app.vault.read(file);
		return contents.substring(contents.indexOf(this.settings.sectionHeader));
	}

	insertAtCursor(text: string) {
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!view) return;

		const editor = view.editor;
		editor.replaceSelection(text);
	}
}
