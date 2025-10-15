import calendarIcon from "../assets/icons/calendar-icon.svg";
import calendarIconComplete from "../assets/icons/calendar-icon-complete.svg";
import expandIcon from "../assets/icons/expand-icon.svg";
import collapseIcon from "../assets/icons/collapse-icon.svg";
import editIcon from "../assets/icons/edit-icon.svg";
import deleteIcon from "../assets/icons/delete-icon.svg";
import { formatDate } from "./date-manager";
import Todo from "./todo";

/* DOM Elements Getters */

// Dialogs and respective buttons elements
export const getAddTodoDialog = () => document.querySelector("#add-todo-dialog");
export const getAddTodoButton = () => document.querySelector("#add-todo");
export const getEditTodoDialog = () => document.querySelector("#edit-todo-dialog");
export const getAddProjectDialog = () => document.querySelector("#add-project-dialog");
export const getAddProjectButton = () => document.querySelector("#add-project");
export const getEditProjectDialog = () => document.querySelector("#edit-project-dialog");
export const getEditProjectButton = () => document.querySelector("#edit-project");
// Forms elements
export const getAddTodoForm = () => document.querySelector("#add-todo-form");
export const getEditTodoForm = () => document.querySelector("#edit-todo-form");
export const getAddProjectForm = () => document.querySelector("#add-project-form");
export const getEditProjectForm = () => document.querySelector("#edit-project-form");

/* Forms */

export function retrieveFormData(form) {
    const formData = new FormData(form);
    form.reset();
    return formData;
}

export function clearForm(form) {
    form.reset();
}

/* Todos */

export function toggleTodoDetails(todoCard) {
    const detailsDiv = todoCard.querySelector(".details");
    const togglerIcon = todoCard.querySelector(".expand-collapse-icon");

    switch (detailsDiv.style.display) {
        case "none":
            togglerIcon.src = collapseIcon;
            togglerIcon.alt = "Collpase";
            detailsDiv.style.display = "inherit";
            break;

        case "inherit":
            togglerIcon.src = expandIcon;
            togglerIcon.alt = "Expand";
            detailsDiv.style.display = "none";
            break;
    }
}

function updateTodoCardInfo(todoCard, todo) {
    todoCard.querySelector(".title").innerText = todo.title || "[Empty title]";
    Array.from(todoCard.querySelectorAll(".tag")).forEach((tag) => {
        tag.style.backgroundColor = Todo.getPriorityColor(todo.getPriority());
    });
    todoCard.querySelector(".priority span").innerText = todo.getPriority();
    todoCard.querySelector(".description").innerText = todo.description || "[Edit to enter a description]";
    todoCard.querySelector(".date span").innerText = formatDate(todo.getDueDate(), "MM/dd/yyyy");
}

function setTodoCardEventListeners(todoCard, todo, {onDeleteTodo, onCheckTodo}) {
    todoCard.querySelector(".expand-collapse-icon").addEventListener("click", () => {
        toggleTodoDetails(todoCard);
    });
    
    todoCard.querySelector(".delete-icon").addEventListener("click", () => {
        onDeleteTodo();
        todoCard.remove();
    });

    todoCard.querySelector(".edit-icon").addEventListener("click", () => {
        const form = getEditTodoForm();
        const editTodoDialog = getEditTodoDialog();

        form.elements.title.value = todo.title;
        form.elements.description.value = todo.description;
        form.elements.priority[todo.getPriority() - 1].checked = true;
        form.elements.date.value = formatDate(todo.getDueDate(), "yyyy-MM-dd");

        editTodoDialog.triggerElement = todoCard;
        editTodoDialog.showModal();
    });

    todoCard.querySelector('input[type="checkbox"]').addEventListener("click", () => {
        onCheckTodo();
        todoCard.classList.toggle("complete");
        todoCard.querySelector(".calendar-icon").src = todo.isComplete() ? calendarIconComplete : calendarIcon;
    });
}

export function addTodo(todo, {onDeleteTodo, onCheckTodo}) {
    const todoListDiv = document.querySelector("#todo-list");
    const todoTemplate = document.querySelector("#todo-template");
    const todoCard = todoTemplate.content.cloneNode(true).querySelector(".todo");

    // Set icons
    todoCard.querySelector(".expand-collapse-icon").src = expandIcon;
    todoCard.querySelector(".edit-icon").src = editIcon;
    todoCard.querySelector(".delete-icon").src = deleteIcon;
    todoCard.querySelector(".calendar-icon").src = todo.isComplete() ? calendarIconComplete : calendarIcon;

    // Set todo card info
    updateTodoCardInfo(todoCard, todo);
    todoCard.setAttribute("data-id", todo.getId());
    if (todo.isComplete()) {
        todoCard.querySelector('input[type="checkbox"]').checked = true;
        todoCard.classList.add("complete");
    }

    // Todos are initialized with hidden details
    todoCard.querySelector(".details").style.display = "none";

    // Set event listeners
    setTodoCardEventListeners(todoCard, todo, {onDeleteTodo, onCheckTodo});

    // Append todo to the page
    todoListDiv.appendChild(todoCard);

    return todoCard;
}

export function updateTodo(todo) {
    const todoCard = document.querySelector(`.todo[data-id="${todo.getId()}"]`);
    updateTodoCardInfo(todoCard, todo);
}

/* Projects */

export function addProject(project, {onClick}) {
    const projectsSection = document.querySelector("#projects");
    const projectCard = document.createElement("div");
    
    projectCard.classList.add("project", "card");
    projectCard.setAttribute("data-id", project.getId());
    projectCard.innerHTML = `<span>${project.name}</span>`;

    projectCard.addEventListener("click", onClick);

    projectsSection.appendChild(projectCard);
}

export function displayProject(project, displayTodos) {
    const projectNameHeader = document.querySelector("#project-name");
    const todoListDiv = document.querySelector("#todo-list");

    projectNameHeader.querySelector("span").innerText = project.name || "[Empty name]";
    todoListDiv.innerHTML = "";

    displayTodos();
}

export function updateProject(project) {
    const projectCard = document.querySelector(`.project[data-id="${project.getId()}"]`);
    const projectNameHeader = document.querySelector("#project-name");

    projectCard.querySelector("span").innerText = project.name || "[Empty name]";
    projectNameHeader.querySelector("span").innerText = project.name || "[Empty name]";
}

export function removeProject(project) {
    const projectCard = document.querySelector(`.project[data-id="${project.getId()}"]`);
    projectCard.remove();
}
