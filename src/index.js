import "./css/reset.css";
import "./css/style.css";
import Todo from "./js/todo";
import Project from "./js/project";
import * as DOMTreeManager from "./js/dom-manager";
import * as StorageManager from "./js/storage-manager";
import { getDateFromString, getCurrentDate } from "./js/date-manager";

class Application {
    #projects;
    #defaultProject;
    #sampleTodos;
    #currentProject;

    constructor(defaultProjectName, sampleTodos=null) {
        this.#defaultProject = new Project(defaultProjectName);
        this.#sampleTodos = sampleTodos;
    }

    /* Todos */

    #addSampleTodos(project) {
        if (!this.#sampleTodos) return;
        this.#sampleTodos.forEach((todo) => {
            project.addTodo(todo);
            StorageManager.storeTodo(todo, project);
        });
    }

    #readTodoForm(form) {
        const formData = DOMTreeManager.retrieveFormData(form);
        const title = formData.get("title") || "";
        const description = formData.get("description") || "";
        const priority = +formData.get("priority") || 1;
        const dueDate = formData.get("date") ? getDateFromString(formData.get("date")) : getCurrentDate();

        return {title, description, priority, dueDate};
    }

    #addTodoToDOM(todo, project) {
        DOMTreeManager.addTodo(
            todo, 
            {
                onDeleteTodo: () => { this.#handleDeleteTodo(todo, project); },
                onCheckTodo: () => { this.#handleCheckboxClick(todo); }
            }
        );
    }

    #handleAddTodo(project) {
        const form = DOMTreeManager.getAddTodoForm();
        const {title, description, priority, dueDate} = this.#readTodoForm(form);
        const todo = new Todo(title, description, priority, dueDate);

        project.addTodo(todo);
        StorageManager.storeTodo(todo, project);
        this.#addTodoToDOM(todo, project);
    }

    #handleEditTodo(project, id) {
        const todo = project.getTodo(id);
        const form = DOMTreeManager.getEditTodoForm();
        const {title, description, priority, dueDate} = this.#readTodoForm(form);

        todo.title = title;
        todo.description = description;
        todo.setDueDate(dueDate);
        todo.setPriority(priority);

        StorageManager.updateTodo(todo);
        DOMTreeManager.updateTodo(todo);
    }

    #handleDeleteTodo(todo, project) {
        project.deleteTodo(todo.getId());
        StorageManager.deleteTodo(todo, project);
    }

    #handleCheckboxClick(todo) {
        todo.toggleComplete();
        StorageManager.updateTodo(todo);
    }

    /* Projects */

    #storeCurrentProjectId() {
        StorageManager.storeCurrentProjectId(this.#currentProject.getId());
    }

    #readProjectForm(form) {
        const formData = DOMTreeManager.retrieveFormData(form);
        const name = formData.get("name") || "";
        return {name};
    }

    #addProjectToDOM(project) {
        DOMTreeManager.addProject(
            project,
            {
                onClick: () => { this.#handleProjectCardClick(project); }
            }
        );
    }

    #displayTodosFromTodoList(project) {
        for (const [_, todo] of Object.entries(project.getTodoList())) {
            this.#addTodoToDOM(todo, project);
        } 
    }

    #displayCurrentProject() {
        DOMTreeManager.displayProject(
            this.#currentProject,
            () => { this.#displayTodosFromTodoList(this.#currentProject); }
        );
    }

    #handleAddProject(project=null) {
        if (project === null) {
            const form = DOMTreeManager.getAddProjectForm();
            const {name} = this.#readProjectForm(form);
            project = new Project(name);
        }

        this.#projects[project.getId()] = project;
        StorageManager.storeProject(project);
        this.#addProjectToDOM(project);
    }

    #handleEditProject(project) {
        const form = DOMTreeManager.getEditProjectForm();
        const {name} = this.#readProjectForm(form);
        project.name = name;
    
        StorageManager.updateProject(project);
        DOMTreeManager.updateProject(project);
    }

    #handleDeleteProject(project) {
        delete this.#projects[project.getId()];
        StorageManager.deleteProject(project);
        DOMTreeManager.removeProject(project);

        // Switch to some other project if exists
        this.#currentProject = Object.values(this.#projects)[0];
        if (this.#currentProject) { 
            this.#storeCurrentProjectId();
            this.#displayCurrentProject();
        } else {
            StorageManager.storeCurrentProjectId(null);
        }
    }

    #handleProjectCardClick(project) {
        this.#currentProject = project;
        this.#storeCurrentProjectId();
        DOMTreeManager.displayProject(
            project,
            () => { this.#displayTodosFromTodoList(project); }
        );
    }

    /* Initialization */

    #configureEventListeners() {
        const addTodoButton = DOMTreeManager.getAddTodoButton();
        const addTodoDialog = DOMTreeManager.getAddTodoDialog();
        const editTodoDialog = DOMTreeManager.getEditTodoDialog();
        const addProjectButton = DOMTreeManager.getAddProjectButton();
        const addProjectDialog = DOMTreeManager.getAddProjectDialog();
        const editProjectButton = DOMTreeManager.getEditProjectButton();
        const editProjectDialog = DOMTreeManager.getEditProjectDialog();

        // Todo
        
        addTodoButton.addEventListener("click", () => {
            addTodoDialog.showModal();
        });
        
        addTodoDialog.addEventListener("close", () => {
            if (addTodoDialog.returnValue === "confirm") {
                this.#handleAddTodo(this.#currentProject);
            }
            DOMTreeManager.clearForm(DOMTreeManager.getAddTodoForm());
        });
    
        editTodoDialog.addEventListener("close", () => {
            if (editTodoDialog.returnValue === "confirm") {
                this.#handleEditTodo(this.#currentProject, editTodoDialog.triggerElement.dataset.id);
            }
        });

        // Project

        addProjectButton.addEventListener("click", () => {
            addProjectDialog.showModal();
        });

        addProjectDialog.addEventListener("close", () => {
            if (addProjectDialog.returnValue === "confirm") {
                this.#handleAddProject();
            }
            DOMTreeManager.clearForm(DOMTreeManager.getAddProjectForm());
        });

        editProjectButton.addEventListener("click", () => {
            const form = DOMTreeManager.getEditProjectForm();
            form.elements.name.value = this.#currentProject.name;
            editProjectDialog.showModal();
        });

        editProjectDialog.addEventListener("close", () => {
            if (editProjectDialog.returnValue === "confirm") {
                this.#handleEditProject(this.#currentProject);
            }
            if (editProjectDialog.returnValue === "delete") {
                if (Object.keys(this.#projects).length > 1) {
                    this.#handleDeleteProject(this.#currentProject);
                } else {
                    window.alert("You must keep at least one project.");
                }
            }
        });
    }

    #performFirstInitialization() {
        this.#projects = {};
        this.#handleAddProject(this.#defaultProject);

        // Add initial sample todos, if they have been declared
        if (this.#sampleTodos) {
            this.#addSampleTodos(this.#defaultProject);
        }

        this.#currentProject = this.#defaultProject;
        this.#storeCurrentProjectId();
        this.#displayCurrentProject();
        this.#configureEventListeners();
    }

    initialize() {
        this.#projects = StorageManager.retrieveProjects();

        // Check if it's the first initialization of the application
        if (this.#projects === null) {
            this.#performFirstInitialization();
            return;
        }

        for (const project of Object.values(this.#projects)) {
            const todoList = project.getTodoList();
            this.#addProjectToDOM(project);

            for (const todo of Object.values(todoList)) {
                this.#addTodoToDOM(todo, project);
            }
        }

        this.#currentProject = this.#projects[StorageManager.retrieveCurrentProjectId()];
        this.#displayCurrentProject();
        this.#configureEventListeners();
    }
}


/* Start application */
const sampleTodos = [
    new Todo("Buy groceries for the week", "Milk, eggs, bread, rice, chicken and vegetables.", 3, getDateFromString("2025-10-15")),
    new Todo("Clean up the workspace", "Organize desk, delete unused files, and back up important documents.", 1, getDateFromString("2025-10-22")),
    new Todo("Finish project presentation", "Prepare slides and practice for next week's meeting.", 2, getDateFromString("2025-10-18")),
    new Todo("Call the dentist", "Schedule a cleaning appointment for next week.", 1, getDateFromString("2025-10-20")),
];
const defaultProjectName = "My Tasks";
const application = new Application(defaultProjectName, sampleTodos);

application.initialize();