import calendarIcon from "../assets/icons/calendar-icon.svg";
import calendarIconComplete from "../assets/icons/calendar-icon-complete.svg";
import expandIcon from "../assets/icons/expand-icon.svg";
import collapseIcon from "../assets/icons/collapse-icon.svg";
import editIcon from "../assets/icons/edit-icon.svg";
import deleteIcon from "../assets/icons/delete-icon.svg";
import Todo from "./todo";
import { formatDate } from "./date-manager";
import { deleteTodo, updateTodo } from "./storage-manager";

export function retrieveFormData(formSelector) {
    const form = document.querySelector(formSelector);
    const formData = new FormData(form);
    form.reset();
    return formData;
}

export function clearForm(formSelector) {
    const form = document.querySelector(formSelector);
    form.reset();
}

export function toggleDetails(todoElement) {
    const detailsDiv = todoElement.querySelector(".details");
    const togglerIcon = todoElement.querySelector(".expand-collapse-icon");

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

export function editTodo(todo) {
    const todoElement = document.querySelector(`.todo[data-id="${todo.getId()}"]`);

    todoElement.querySelector(".title").innerText = todo.title || "[Empty title]";
    Array.from(todoElement.querySelectorAll(".tag")).forEach((tag) => {
        tag.style.backgroundColor = Todo.getPriorityColor(todo.getPriority());
    });
    todoElement.querySelector(".priority span").innerText = todo.getPriority();
    todoElement.querySelector(".description").innerText = todo.description || "[Edit to enter a description]";
    todoElement.querySelector(".date span").innerText = formatDate(todo.getDueDate(), "MM/dd/yyyy");
}

export function editProject(project) {
    const projectElementSpan = document.querySelector(`.project[data-id="${project.getId()}"] span`);
    projectElementSpan.innerText = project.name || "[Empty name]";
}

export function deleteProjectFromDOM(project) {
    const projectElement = document.querySelector(`.project[data-id="${project.getId()}"]`);
    projectElement.remove();
}

export function appendTodo(todo, project) {
    const todoListDiv = document.querySelector("#todo-list");
    const todoTemplate = document.querySelector("#todo-template");
    const todoElement = todoTemplate.content.cloneNode(true).querySelector(".todo");

    // Icons
    todoElement.querySelector(".expand-collapse-icon").src = expandIcon;
    todoElement.querySelector(".edit-icon").src = editIcon;
    todoElement.querySelector(".delete-icon").src = deleteIcon;
    todoElement.querySelector(".calendar-icon").src = todo.isComplete() ? calendarIconComplete : calendarIcon;

    todoElement.setAttribute("data-id", todo.getId());
    todoElement.querySelector(".title").innerText = todo.title || "[Empty title]";
    Array.from(todoElement.querySelectorAll(".tag")).forEach((tag) => {
        tag.style.backgroundColor = Todo.getPriorityColor(todo.getPriority());
    });
    todoElement.querySelector(".priority span").innerText = todo.getPriority();
    todoElement.querySelector(".description").innerText = todo.description || "[Edit to enter a description]";
    todoElement.querySelector(".date span").innerText = formatDate(todo.getDueDate(), "MM/dd/yyyy");
    todoElement.querySelector(".details").style.display = "none";
    if (todo.isComplete()) {
        todoElement.querySelector('input[type="checkbox"]').checked = true;
        todoElement.classList.add("complete");
    }

    // Event Listeners
    todoElement.querySelector(".expand-collapse-icon").addEventListener("click", () => {
        toggleDetails(todoElement);
    });
    
    todoElement.querySelector(".delete-icon").addEventListener("click", () => {
        project.deleteTodo(todo.getId());

        deleteTodo(todo, project);
        todoElement.remove();
    });

    todoElement.querySelector(".edit-icon").addEventListener("click", () => {
        const form = document.querySelector("#edit-todo-form");
        const editTodoDialog = document.querySelector("#edit-todo-dialog");

        form.elements.title.value = todo.title;
        form.elements.description.value = todo.description;
        form.elements.priority[todo.getPriority() - 1].checked = true;
        form.elements.date.value = formatDate(todo.getDueDate(), "yyyy-MM-dd");

        editTodoDialog.triggerElement = todoElement;
        editTodoDialog.showModal();
    });

    todoElement.querySelector('input[type="checkbox"]').addEventListener("click", () => {
        todo.toggleComplete();
        updateTodo(todo);
        todoElement.classList.toggle("complete");
        todoElement.querySelector(".calendar-icon").src = todo.isComplete() ? calendarIconComplete : calendarIcon;
    });

    todoListDiv.appendChild(todoElement);

    return todoElement;
}

export function removeFromDOM(element) {
    element.remove();
}

export function displayProject(project) {
    const projectNameSpan = document.querySelector("#project-name span");
    const todoListDiv = document.querySelector("#todo-list");
    const todoList = project.getTodoList();

    projectNameSpan.innerText = project.name || "[Empty name]";
    todoListDiv.innerHTML = "";

    for (const [_, todo] of Object.entries(todoList)) {
        appendTodo(todo, project);
    }   
}

export function appendProject(project) {
    const projectsSection = document.querySelector("#projects");
    const projectElement = document.createElement("div");
    projectElement.classList.add("project", "card");

    projectElement.innerHTML = `<span>${project.name}</span>`;
    projectElement.setAttribute("data-id", project.getId());

    projectsSection.appendChild(projectElement);

    return projectElement;
}