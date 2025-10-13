import { Todo } from "./todo";

export class Project {
    #todoList;
    #id;

    constructor(name, todoList={}, id=crypto.randomUUID()) {
        this.name = name;
        this.#todoList = todoList;
        this.#id = id;
    }

    getId() {
        return this.#id;
    }
    
    getTodoList() {
        return this.#todoList;
    }
    
    getSize() {
        return Object.keys(this.#todoList).length;
    }

    addTodo(todo) {
        if (!(todo instanceof Todo)) {
            return; // Error
        }
        this.#todoList[todo.getId()] = todo;
    }

    getTodo(id) {
        return id in this.#todoList ? this.#todoList[id] : null;
    }

    deleteTodo(id) {
        delete this.#todoList[id];
    }

    toJSON() {
        return {
            "name": this.name,
            "id": this.#id,
            "todoIds": Object.keys(this.#todoList)
        };
    }

    static fromJSON(json) {
        const projectStoraged = JSON.parse(json);
        const {name, id, todoIds} = projectStoraged;
        const todoList = {};

        todoIds.forEach((id) => {
            todoList[id] = null;
        });

        return new Project(name, todoList, id);
    }
}