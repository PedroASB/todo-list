import { Todo } from "./todo";

export class Project {
    #todoList = {};
    #size = 0;
    #id = crypto.randomUUID();

    constructor(name) {
        this.name = name;
    }

    getId() {
        return this.#id;
    }
    
    getTodoList() {
        return this.#todoList;
    }
    
    getSize() {
        return this.#size;
    }

    addTodo(todo) {
        if (!(todo instanceof Todo)) {
            return; // Error
        }
        if (todo.getId() in this.#todoList) {
            return; // Already has this todo
        }
        this.#todoList[todo.getId()] = todo;
        this.#size++;
    }

    getTodo(id) {
        return id in this.#todoList ? this.#todoList[id] : null;
    }

    deleteTodo(id) {
        delete this.#todoList[id];
        this.#size--;
    }
}