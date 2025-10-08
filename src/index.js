import "./css/reset.css";
import "./css/style.css";
import { Todo } from "./js/todo";
import { Project } from "./js/project";
import { appendTodo } from "./js/dom-manager";
import { DateManager } from "./js/date-manager";

function retrieveFormData(formSelector) {
    const form = document.querySelector(formSelector);
    const formData = new FormData(form);
    form.reset();
    return formData;
}

function addNewTodo() {
    const formData = retrieveFormData("#new-todo form");
    let title, description, priority, dueDate;

    title = formData.get("title") || "[Empty title]";
    description = formData.get("description") || "[Edit to enter a description]";
    priority = +formData.get("priority") || 1;
    dueDate = formData.get("date") ? 
              DateManager.getDateFromString(formData.get("date")) : 
              DateManager.getCurrentDate();
    
    const todo = new Todo(title, description, priority, dueDate);
    appendTodo(todo);
}

function initializePage() {
    const addButton = document.querySelector("#add-button");
    addButton.addEventListener("click", addNewTodo);
}

initializePage();