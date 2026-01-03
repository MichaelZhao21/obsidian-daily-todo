import {App, PluginSettingTab, Setting} from "obsidian";
import DailyTodoPlugin from "./main";

export interface TodoPluginSettings {
	templateName: string;
	sectionHeader: string;
}

export const DEFAULT_SETTINGS: TodoPluginSettings = {
	templateName: 'Task Backlog',
	sectionHeader: 'Recurring Tasks'
}

export class TodoSettingTab extends PluginSettingTab {
	plugin: DailyTodoPlugin;

	constructor(app: App, plugin: DailyTodoPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Template File Name')
			.setDesc('Enter the full name/path of the template file to use.')
			.addText(text => text
				.setPlaceholder('File name (full vault path)')
				.setValue(this.plugin.settings.templateName)
				.onChange(async (value) => {
					this.plugin.settings.templateName = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Template Section Header')
			.setDesc('Within the template section, enter the name of the header to start looking for tasks at.')
			.addText(text => text
				.setPlaceholder('Header name')
				.setValue(this.plugin.settings.sectionHeader)
				.onChange(async (value) => {
					this.plugin.settings.sectionHeader = value;
					await this.plugin.saveSettings();
				}));
	}
}
