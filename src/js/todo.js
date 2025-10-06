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
        return this.#dueDate;
    }

    setDueDate(date) {
        if (!(date instanceof Date)) {
            return; // Error
        }
        this.#dueDate = date;
    }
}