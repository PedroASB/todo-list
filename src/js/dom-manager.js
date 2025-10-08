import calendarIcon from "../assets/icons/calendar-icon.svg";
import expandIcon from "../assets/icons/expand-icon.svg";
import collapseIcon from "../assets/icons/collapse-icon.svg";
import editIcon from "../assets/icons/edit-icon.svg";
import deleteIcon from "../assets/icons/delete-icon.svg";
import { Todo } from "./todo";

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
    todoElement.querySelector(".date span").innerText = todo.getDueDate();
    todoElement.querySelector(".details").style.display = "none";

    // Event Listeners
    todoElement.querySelector(".expand-collapse-icon").addEventListener("click", 
        () => { toggleDetails(todoElement); }
    );
    todoElement.querySelector(".delete-icon").addEventListener("click", 
        () => { todoElement.remove() }
    );

    todoList.appendChild(todoElement);
}
