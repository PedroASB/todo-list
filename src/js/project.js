import { Todo } from "./todo";

export class Project {
    #todoList = {};
    #size = 0;

    constructor(name) {
        this.name = name;
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

    removeTodo(id) {
        delete this.#todoList[id];
        this.#size--;
    }
}