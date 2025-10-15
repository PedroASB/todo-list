import Project from "./project";
import Todo from "./todo";

const todoKey = id => `todo:${id}`;
const projectKey = id => `project:${id}`;
const currentProjectKey = "current-project";
const projectsDataKey = "projects";

/* Get (Serialized Data) */

function getProjectsData() {
    return JSON.parse(localStorage.getItem(projectsDataKey));
}

function getProjectData(projectId) {
    return JSON.parse(localStorage.getItem(projectKey(projectId)));
}

/* Update */

export function updateTodo(todo) {
    localStorage.setItem(todoKey(todo.getId()), JSON.stringify(todo));
}

export function updateProject(project) {
    localStorage.setItem(projectKey(project.getId()), JSON.stringify(project));
}

function updateProjectsData(projectsData) {
    localStorage.setItem(projectsDataKey, JSON.stringify(projectsData));
}

function updateProjectData(projectId, projectData) {
    localStorage.setItem(projectKey(projectId), JSON.stringify(projectData));
}

/* Store */

export function storeTodo(todo, project) {
    const projectData = getProjectData(project.getId());
    projectData.todoIds.push(todo.getId());
    updateProjectData(project.getId(), projectData);
    updateTodo(todo);
}

export function storeProject(project) {
    const projectsData = getProjectsData() || [];
    projectsData.push(project.getId());
    updateProjectsData(projectsData);
    updateProject(project);
}

export function storeCurrentProjectId(projectId) {
    localStorage.setItem(currentProjectKey, JSON.stringify(projectId));
}

/* Delete */

export function deleteTodo(todo, project) {
    localStorage.removeItem(todoKey(todo.getId()));
    const projectData = getProjectData(project.getId());
    projectData.todoIds = projectData.todoIds.filter((id) => id !== todo.getId());
    updateProjectData(project.getId(), projectData);
}

export function deleteProject(project) {
    for (const todo of Object.values(project.getTodoList())) {
        localStorage.removeItem(todoKey(todo.getId()));
    }
    localStorage.removeItem(projectKey(project.getId()));
    let projectsData = getProjectsData();   
    projectsData = projectsData.filter((id) => id !== project.getId());
    updateProjectsData(projectsData);
}

/* Retrieve (Objects & Application Data) */

export function retrieveTodo(todoId) {
    return Todo.fromJSON(localStorage.getItem(todoKey(todoId)));
}

export function retrieveProject(projectId) {
    const project = Project.fromJSON(localStorage.getItem(projectKey(projectId)));
    const todoIds = Object.keys(project.getTodoList());

    todoIds.forEach((id) => {
        const todo = retrieveTodo(id);
        project.addTodo(todo);
    });

    return project;
}

export function retrieveCurrentProjectId() {
    return JSON.parse(localStorage.getItem(currentProjectKey));
}

export function retrieveProjects() {
    const projectsData = JSON.parse(localStorage.getItem(projectsDataKey));

    if (!projectsData) {
        return null;
    }

    const projects = {};
    projectsData.forEach((id) => {
        projects[id] = retrieveProject(id);
    });

    return projects;
}

/* Extra */

export function clearStorage() {
    localStorage.clear();
}
