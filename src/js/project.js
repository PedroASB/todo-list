import Todo from "./todo";

export default class Project {
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
            console.error("Error: invalid todo at addTodo function");
            return;
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