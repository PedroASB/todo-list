import "./css/reset.css";
import "./css/style.css";
import { Todo } from "./js/todo";
import { Project } from "./js/project";
import { appendTodo, retrieveFormData, editTodo, appendProject, displayProject, editProject, deleteProjectFromDOM, clearForm } from "./js/dom-manager";
import { DateManager } from "./js/date-manager";
import { storeProject, storeTodo, retrieveProjects, storeCurrentProjectId, retrieveCurrentProjectId, updateTodo, updateProject, deleteProject } from "./js/storage-manager";

class Application {
    #projects;
    #defaultProject;
    #sampleTodos;
    #currentProject;

    constructor(defaultProject, sampleTodos=null) {
        this.#defaultProject = defaultProject;
        this.#currentProject = defaultProject;
        this.#sampleTodos = sampleTodos;
    }

    addSampleTodos(project) {
        if (!this.#sampleTodos) {
            return;
        }

        this.#sampleTodos.forEach((todo) => {
            project.addTodo(todo);
            storeTodo(todo, project);
        });
    }

    handleAddTodo(project) {
        const formData = retrieveFormData("form#add-todo-form");
        let title, description, priority, dueDate;

        title = formData.get("title") || "";
        description = formData.get("description") || "";
        priority = +formData.get("priority") || 1;
        dueDate = formData.get("date") ? 
                DateManager.getDateFromString(formData.get("date")) : 
                DateManager.getCurrentDate();
        
        const todo = new Todo(title, description, priority, dueDate);
        project.addTodo(todo);
        appendTodo(todo, project);
        storeTodo(todo, project);
    }

    handleEditTodo(project, id) {
        const formData = retrieveFormData("#edit-todo-form");
        let title, description, priority, dueDate;
        const todo = project.getTodo(id);

        title = formData.get("title") || "";
        description = formData.get("description") || "";
        priority = +formData.get("priority") || 1;
        dueDate = formData.get("date") ? 
                DateManager.getDateFromString(formData.get("date")) : 
                DateManager.getCurrentDate();

        todo.title = title;
        todo.description = description;
        todo.setDueDate(dueDate);
        todo.setPriority(priority);
        updateTodo(todo);
        editTodo(todo);
    }

    handleAddProject(project=null) {
        if (project === null) {
            const formData = retrieveFormData("form#add-project-form");
            let name = formData.get("name") || "";
            project = new Project(name);
        }

        const projectElement = appendProject(project);

        this.#projects[project.getId()] = project;

        projectElement.addEventListener("click", () => {
            this.#currentProject = project;
            storeCurrentProjectId(this.#currentProject.getId());
            displayProject(project);
        });

        storeProject(project);
    }

    handleEditProject(project) {
        const formData = retrieveFormData("#edit-project-form");
        let name = formData.get("name") || "";
        project.name = name;
        updateProject(project);
        editProject(project);
        displayProject(project);
    }

    handleDeleteProject(project) {
        deleteProject(project);
        deleteProjectFromDOM(project);
        delete this.#projects[project.getId()];

        // Switch to some other project if exists
        this.#currentProject = Object.values(this.#projects)[0];
        if (this.#currentProject) { 
            storeCurrentProjectId(this.#currentProject.getId());
            displayProject(this.#currentProject);
        } else {
            storeCurrentProjectId(null);
        }
    }

    configureEventListeners() {
        const addTodoButton = document.querySelector("#add-todo");
        const addTodoDialog = document.querySelector("#add-todo-dialog");
        const addProjectButton = document.querySelector("#add-project");
        const addProjectDialog = document.querySelector("#add-project-dialog");
        const editTodoDialog = document.querySelector("#edit-todo-dialog");
        const editProjectButton = document.querySelector("#edit-project");
        const editProjectDialog = document.querySelector("#edit-project-dialog");
        
        addTodoButton.addEventListener("click", () => {
            addTodoDialog.showModal();
        });
        
        addTodoDialog.addEventListener("close", () => {
            if (addTodoDialog.returnValue === "confirm") {
                this.handleAddTodo(this.#currentProject);
            }
            clearForm("form#add-todo-form");
        });
    
        addProjectButton.addEventListener("click", () => {
            addProjectDialog.showModal();
        });

        addProjectDialog.addEventListener("close", () => {
            if (addProjectDialog.returnValue === "confirm") {
                this.handleAddProject();
            }
            clearForm("form#add-project-form");
        });

        editTodoDialog.addEventListener("close", () => {
            if (editTodoDialog.returnValue === "confirm") {
                this.handleEditTodo(this.#currentProject, editTodoDialog.triggerElement.dataset.id);
            }
        });

        editProjectButton.addEventListener("click", () => {
            const form = document.querySelector("#edit-project-form");
            form.elements.name.value = this.#currentProject.name;
            editProjectDialog.showModal();
        });

        editProjectDialog.addEventListener("close", () => {
            if (editProjectDialog.returnValue === "confirm") {
                this.handleEditProject(this.#currentProject);
            }
            if (editProjectDialog.returnValue === "delete") {
                if (Object.keys(this.#projects).length > 1) {
                    this.handleDeleteProject(this.#currentProject);
                } else {
                    window.alert("You must keep at least one project.");
                }
            }
        });
    }

    initialize() {
        this.#projects = retrieveProjects();

        if (this.#projects === null) {
            this.#projects = {};
            this.handleAddProject(this.#defaultProject);

            if (this.#sampleTodos) {
                this.addSampleTodos(this.#defaultProject);
            }

            storeCurrentProjectId(this.#defaultProject.getId());
            displayProject(this.#defaultProject);
        }
        else {            
            for (const project of Object.values(this.#projects)) {
                const todoList = project.getTodoList();
                const projectElement = appendProject(project);
                this.#currentProject = project;
                
                projectElement.addEventListener("click", () => {
                    this.#currentProject = project;
                    storeCurrentProjectId(this.#currentProject.getId());
                    displayProject(project);
                });
                
                for (const todo of Object.values(todoList)) {
                    appendTodo(todo, project);
                }
            }
            this.#currentProject = this.#projects[retrieveCurrentProjectId()];
            displayProject(this.#currentProject);
        }

        this.configureEventListeners();
    }
}


// Start application
const defaultProject = new Project("My Tasks");
let sampleTodos = [];

sampleTodos.push(new Todo("Dentist appointment", "Address: 12 Surrey Street - next to the shopping mall.", 3, DateManager.getCurrentDate()));
sampleTodos.push(new Todo("Water the houseplants", "Garden and backyard!", 2, DateManager.getCurrentDate()));
sampleTodos.push(new Todo("Research vacation destinations", "Countries: France, Italy or England.", 1, DateManager.getCurrentDate()));

const application = new Application(defaultProject, sampleTodos);
application.initialize();