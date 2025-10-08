export class Todo {
    #priority;
    #dueDate;
    #complete = false;
    #id = crypto.randomUUID();

    constructor(title, description, priority, dueDate) {
        this.title = title;
        this.description = description;
        this.setPriority(priority);
        this.setDueDate(dueDate);
    }

    static getPriorityColor(priority) {
        /* Open-closed principle: the following switch-case can be extended
        to support other/more/less priorities. Modules from outside don't need to 
        know how many priorities are there; thus, they won't need to be modified. */
        switch (priority) {
            case 1: return "#67c96cff";
            case 2: return "#e2c062ff";
            case 3: return "#f07b7bff";
            default: return null;
        }
    }

    toggleComplete() {
        this.#complete = !this.#complete;
    }

    getId() {
        return this.#id;
    }

    getPriority() {
        return this.#priority;
    }

    setPriority(value) {
        if (!Number.isInteger(value) || value < 1 || value > 3) {
            return; // Error
        }
        this.#priority = value;
    }

    getDueDate() {
        return new Date(this.#dueDate);
    }

    setDueDate(date) {
        if (!(date instanceof Date)) {
            return; // Error
        }
        this.#dueDate = date.toISOString();
    }
}