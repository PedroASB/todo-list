import calendarIcon from "../assets/icons/calendar-icon.svg";
import expandIcon from "../assets/icons/expand-icon.svg";
import collapseIcon from "../assets/icons/collapse-icon.svg";
import editIcon from "../assets/icons/edit-icon.svg";
import deleteIcon from "../assets/icons/delete-icon.svg";
import { Todo } from "./todo";

export function toggleDetails(dataId) {
    const todo = document.querySelector(`.todo[data-id="${dataId}"]`);
    const detailsDiv = todo.querySelector(".details");
    const togglerIcon = todo.querySelector(".expand-collapse-icon");

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

export function appendTodo(title, description, priority, dueDate, dataId) {
    const todoList = document.querySelector("#todo-list");
    const todoTemplate = document.querySelector("#todo-template");
    const todoDiv = todoTemplate.content.cloneNode(true).querySelector(".todo");

    // Icons
    todoDiv.querySelector(".expand-collapse-icon").src = expandIcon;
    todoDiv.querySelector(".edit-icon").src = editIcon;
    todoDiv.querySelector(".delete-icon").src = deleteIcon;
    todoDiv.querySelector(".calendar-icon").src = calendarIcon;

    // Fields and attributes
    todoDiv.setAttribute("data-id", dataId);
    todoDiv.querySelector(".title").innerText = title;
    todoDiv.querySelector(".tag").style.backgroundColor = Todo.getPriorityColor(priority);
    todoDiv.querySelector(".description").innerText = description;
    todoDiv.querySelector(".date span").innerText = dueDate;
    todoDiv.querySelector(".details").style.display = "none";

    // Event Listeners
    todoDiv.querySelector(".expand-collapse-icon").addEventListener("click", 
        () => toggleDetails(dataId)
    );

    todoList.appendChild(todoDiv);
}

