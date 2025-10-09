import "./css/reset.css";
import "./css/style.css";
import { Todo } from "./js/todo";
import { Project } from "./js/project";
import { appendTodo, setAddTodoDialog, retrieveFormData, editTodo, appendProject } from "./js/dom-manager";
import { DateManager } from "./js/date-manager";

class Application {
    #projects = {};
    #addSampleTodosFlag;
    #defaultProject;

    constructor(defaultProject, addSampleTodosFlag=false) {
        this.#defaultProject = defaultProject;
        appendProject(this.#defaultProject);
        this.#projects[this.#defaultProject.getId()] = this.#defaultProject;
        this.#addSampleTodosFlag = addSampleTodosFlag;
    }

    handleAddTodo(project) {
        const formData = retrieveFormData("form#add-todo-form");
        let title, description, priority, dueDate;

        title = formData.get("title") || "[Empty title]";
        description = formData.get("description") || "[Edit to enter a description]";
        priority = +formData.get("priority") || 1;
        dueDate = formData.get("date") ? 
                DateManager.getDateFromString(formData.get("date")) : 
                DateManager.getCurrentDate();
        
        const todo = new Todo(title, description, priority, dueDate);
        appendTodo(todo);
        project.addTodo(todo);
    }

    handleEditTodo(project, id) {
        const formData = retrieveFormData("#edit-todo-form");
        let title, description, priority, dueDate;
        const todo = project.getTodo(id);

        title = formData.get("title") || "[Empty title]";
        description = formData.get("description") || "[Edit to enter a description]";
        priority = +formData.get("priority") || 1;
        dueDate = formData.get("date") ? 
                DateManager.getDateFromString(formData.get("date")) : 
                DateManager.getCurrentDate();

        todo.title = title;
        todo.description = description;
        todo.setDueDate(dueDate);
        todo.setPriority(priority);
        editTodo(todo);
    }

    handleAddProject() {
        const formData = retrieveFormData("form#add-project-form");
        let name = formData.get("name");
        const project = new Project(name);
        appendProject(project);
        this.#projects[project.getId()] = project;
    }

    addSampleTodos(project) {
        let sampleTodos = [];

        sampleTodos.push(new Todo("Dentist appointment", "Address: 12 Surrey Street - next to the shopping mall.", 3, DateManager.getCurrentDate()));
        sampleTodos.push(new Todo("Water the houseplants", "Garden and backyard!", 2, DateManager.getCurrentDate()));
        sampleTodos.push(new Todo("Research vacation destinations", "Countries: France, Italy or England.", 1, DateManager.getCurrentDate()));

        sampleTodos.forEach((todo) => {
            appendTodo(todo);
            project.addTodo(todo);
        });
    }

    initializeEventListeners() {
        const addTodoButton = document.querySelector("#add-todo");
        const addProjectButton = document.querySelector("#add-project");
        const addTodoDialog = document.querySelector("#add-todo-dialog");
        const editTodoDialog = document.querySelector("#edit-todo-dialog");
        const addProjectDialog = document.querySelector("#add-project-dialog");
        
        addTodoButton.addEventListener("click", () => {
            addTodoDialog.showModal();
        });

        addProjectButton.addEventListener("click", () => {
            addProjectDialog.showModal();
        });

        addTodoDialog.addEventListener("close", () => {
            if (addTodoDialog.returnValue === "confirm") {
                this.handleAddTodo(defaultProject);
            }
        });

        addProjectDialog.addEventListener("close", () => {
            if (addProjectDialog.returnValue === "confirm") {
                this.handleAddProject();
            }
        });

        editTodoDialog.addEventListener("close", () => {
            if (editTodoDialog.returnValue === "confirm") {
                this.handleEditTodo(defaultProject, editTodoDialog.triggerElement.dataset.id);
            }
        });
    }

    initializePage() {
        this.initializeEventListeners();

        if (this.#addSampleTodosFlag) {
            this.addSampleTodos(this.#defaultProject);
        }
    }
}

const defaultProject = new Project("My Tasks");
const application = new Application(defaultProject, true);
application.initializePage();