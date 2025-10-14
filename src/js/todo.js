export default class Todo {
    #priority;
    #dueDate;
    #complete;
    #id;

    constructor(title, description, priority, dueDate, complete=false, id=crypto.randomUUID()) {
        this.title = title;
        this.description = description;
        this.setPriority(priority);
        this.setDueDate(dueDate);
        this.#complete = complete;
        this.#id = id;
    }

    static getPriorityColor(priority) {
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

    isComplete() {
        return this.#complete;
    }

    getId() {
        return this.#id;
    }

    getPriority() {
        return this.#priority;
    }

    setPriority(value) {
        if (!Number.isInteger(value) || value < 1 || value > 3) {
            console.error("Error: invalid value at setPriority function");
            return;
        }
        this.#priority = value;
    }

    getDueDate() {
        return new Date(this.#dueDate);
    }

    setDueDate(date) {
        if (!(date instanceof Date)) {
            console.error("Error: invalid date at setDueDate");
            return;
        }
        this.#dueDate = date.toISOString();
    }

    toJSON() {
        return {
            "title": this.title, 
            "description": this.description,
            "complete": this.#complete,
            "priority": this.#priority,
            "dueDate": this.#dueDate,
            "id": this.#id
        };
    }

    static fromJSON(json) {
        const todoStoraged = JSON.parse(json);
        const {title, description, priority, dueDate, complete, id} = todoStoraged;
        return new Todo(title, description, priority, new Date(dueDate), complete, id);
    }
}