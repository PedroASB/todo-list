import calendarIcon from "../assets/icons/calendar-icon.svg";
import expandIcon from "../assets/icons/expand-icon.svg";
import collapseIcon from "../assets/icons/collapse-icon.svg";
import editIcon from "../assets/icons/edit-icon.svg";
import deleteIcon from "../assets/icons/delete-icon.svg";
import { Todo } from "./todo";
import { DateManager } from "./date-manager";

export function retrieveFormData(formSelector) {
    const form = document.querySelector(formSelector);
    const formData = new FormData(form);
    form.reset();
    return formData;
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

    todoElement.querySelector(".title").innerText = todo.title;
    todoElement.querySelector(".tag").style.backgroundColor = Todo.getPriorityColor(todo.getPriority());
    todoElement.querySelector(".description").innerText = todo.description;
    todoElement.querySelector(".date span").innerText = DateManager.formatDate(todo.getDueDate(), "MM/dd/yyyy");
}

export function appendTodo(todo) {
    const todoList = document.querySelector("#todo-list");
    const todoTemplate = document.querySelector("#todo-template");
    const todoElement = todoTemplate.content.cloneNode(true).querySelector(".todo");

    // Icons
    todoElement.querySelector(".expand-collapse-icon").src = expandIcon;
    todoElement.querySelector(".edit-icon").src = editIcon;
    todoElement.querySelector(".delete-icon").src = deleteIcon;
    todoElement.querySelector(".calendar-icon").src = calendarIcon;

    // Fields and attributes
    todoElement.setAttribute("data-id", todo.getId());
    todoElement.querySelector(".title").innerText = todo.title;
    todoElement.querySelector(".tag").style.backgroundColor = Todo.getPriorityColor(todo.getPriority());
    todoElement.querySelector(".description").innerText = todo.description;
    todoElement.querySelector(".date span").innerText = DateManager.formatDate(todo.getDueDate(), "MM/dd/yyyy");
    todoElement.querySelector(".details").style.display = "none";

    // Event Listeners
    todoElement.querySelector(".expand-collapse-icon").addEventListener("click", 
        () => { toggleDetails(todoElement); }
    );
    
    todoElement.querySelector(".delete-icon").addEventListener("click", 
        () => { todoElement.remove(); }
    );

    todoElement.querySelector(".edit-icon").addEventListener("click", () => {
        const form = document.querySelector("#edit-todo-form");
        const editTodoDialog = document.querySelector("#edit-todo-dialog");

        form.elements.title.value = todo.title;
        form.elements.description.value = todo.description;
        form.elements.priority[todo.getPriority() - 1].checked = true;
        form.elements.date.value = DateManager.formatDate(todo.getDueDate(), "yyyy-MM-dd");

        editTodoDialog.triggerElement = todoElement;
        editTodoDialog.showModal();
    });

    todoList.appendChild(todoElement);
}
