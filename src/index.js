import "./css/reset.css";
import "./css/style.css";
import { Todo } from "./js/todo";
import { Project } from "./js/project";
import { appendTodo, setAddTodoDialog, retrieveFormData, editTodo } from "./js/dom-manager";
import { DateManager } from "./js/date-manager";

function handleAddTodo(project) {
    const formData = retrieveFormData("#add-todo-form");
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

function handleEditTodo(project, id) {
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

function addSampleTodos(project) {
    let sampleTodos = [];

    sampleTodos.push(new Todo("Dentist appointment", "Address: 12 Surrey Street - next to the shopping mall.", 3, DateManager.getCurrentDate()));
    sampleTodos.push(new Todo("Water the houseplants", "Garden and backyard!", 2, DateManager.getCurrentDate()));
    sampleTodos.push(new Todo("Research vacation destinations", "Countries: France, Italy or England.", 1, DateManager.getCurrentDate()));

    sampleTodos.forEach((todo) => {
        appendTodo(todo);
        project.addTodo(todo);
    });
}

function initializePage() {
    const addTodoButton = document.querySelector("#add-todo");
    const addTodoDialog = document.querySelector("#add-todo-dialog");
    const editTodoDialog = document.querySelector("#edit-todo-dialog");
    const defaultProject = new Project("My Tasks");
    
    addTodoButton.addEventListener("click", () => {
        addTodoDialog.showModal();
    });

    addTodoDialog.addEventListener("close", () => {
        if (addTodoDialog.returnValue === "confirm") {
            handleAddTodo(defaultProject);
        }
    });

    editTodoDialog.addEventListener("close", (event) => {
        if (editTodoDialog.returnValue === "confirm") {
            handleEditTodo(defaultProject, editTodoDialog.triggerElement.dataset.id);
        }
    });

    addSampleTodos(defaultProject);
}

initializePage();