import Project from "./project";
import Todo from "./todo";

export function storeCurrentProjectId(projectId) {
    const key = "current-project";
    const value = JSON.stringify(projectId);
    localStorage.setItem(key, value);
}

export function storeProject(project) {
    const key = `project:${project.getId()}`;
    const value = JSON.stringify(project);
    localStorage.setItem(key, value);

    const projects = JSON.parse(localStorage.getItem("projects")) || [];
    projects.push(project.getId());
    localStorage.setItem("projects", JSON.stringify(projects));
}

export function updateProject(project) {
    const key = `project:${project.getId()}`;
    const value = JSON.stringify(project);
    localStorage.setItem(key, value);
}

export function deleteProject(project) {
    
    for (const todo of Object.values(project.getTodoList())) {
        // deleteTodo(todo, project);
        const key = `todo:${todo.getId()}`;
        localStorage.removeItem(key);
    }
    
    const key = `project:${project.getId()}`;
    localStorage.removeItem(key);
    
    let projects = JSON.parse(localStorage.getItem("projects"));
    projects = projects.filter((id) => id !== project.getId());
    localStorage.setItem("projects", JSON.stringify(projects));
}

export function storeTodo(todo, project) {
    const key = `todo:${todo.getId()}`;
    const value = JSON.stringify(todo);
    localStorage.setItem(key, value);

    const projectStorage = JSON.parse(localStorage.getItem(`project:${project.getId()}`));
    projectStorage.todoIds.push(todo.getId());
    localStorage.setItem(`project:${project.getId()}`, JSON.stringify(projectStorage));
}

export function updateTodo(todo) {
    const key = `todo:${todo.getId()}`;
    const value = JSON.stringify(todo);
    localStorage.setItem(key, value);
}

export function deleteTodo(todo, project) {
    const key = `todo:${todo.getId()}`;
    localStorage.removeItem(key);

    const projectStorage = JSON.parse(localStorage.getItem(`project:${project.getId()}`));
    projectStorage.todoIds = projectStorage.todoIds.filter((id) => id !== todo.getId());
    localStorage.setItem(`project:${project.getId()}`, JSON.stringify(projectStorage));
}

export function retrieveTodo(todoId) {
    return Todo.fromJSON(localStorage.getItem(`todo:${todoId}`))
}

export function retrieveProject(projectId) {
    const project = Project.fromJSON(localStorage.getItem(`project:${projectId}`));
    const todoIds = Object.keys(project.getTodoList());

    todoIds.forEach((id) => {
        const todo = retrieveTodo(id);
        project.addTodo(todo);
    });

    return project;
}

export function retrieveCurrentProjectId() {
    return JSON.parse(localStorage.getItem("current-project"));
}

export function retrieveProjects() {
    const projectsStored = JSON.parse(localStorage.getItem("projects"));
    
    if (!projectsStored) {
        return null;
    }
    
    const projects = {};

    projectsStored.forEach((id) => {
        projects[id] = retrieveProject(id);
    });

    return projects;
}

export function clearStorage() {
    localStorage.clear();
}
