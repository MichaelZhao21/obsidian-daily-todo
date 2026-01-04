import { App, Modal, Setting } from "obsidian";

export class QuickNoteModal extends Modal {
	result: string | null = null;
	onSubmit: (value: string) => void;

	constructor(app: App, onSubmit: (value: string) => void) {
		super(app);
		this.onSubmit = onSubmit;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.createEl("h3", { text: "Quick Note" });

		let value = "";

        const textarea = contentEl.createEl("textarea", {
            cls: "quick-note-textarea",
            attr: {
                placeholder: "Note content (first line is title)",
            }
        });
        textarea.rows = 5;
        textarea.style.width = "100%";
        textarea.style.marginBottom = "1em";
        textarea.addEventListener("input", (e) => {
            value = (e.target as HTMLTextAreaElement).value;
        });
        textarea.addEventListener("keydown", (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                console.log(value);
                e.preventDefault();
                this.close();
                this.onSubmit(value);
            }
        });

		new Setting(contentEl)
			.addButton((btn) =>
				btn
					.setButtonText("Add")
					.setCta()
					.onClick(() => {
						this.close();
						this.onSubmit(value);
					})
			);
	}

    onClose() {
		this.contentEl.empty();
	}
}
