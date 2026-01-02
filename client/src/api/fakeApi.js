// Import initial data from JSON files
import projectsJson from "../data/projects.json";
import tasksJson from "../data/tasks.json";

// In-memory storage (simulating database)
// This will be populated from JSON files or use defaults
let projectsData = projectsJson && projectsJson.length > 0 
  ? [...projectsJson] 
  : [
      {
        id: 1,
        name: "PERT & GANTT Project",
        description: "Task scheduling and planning"
      }
    ];

let tasksData = tasksJson && tasksJson.length > 0
  ? [...tasksJson]
  : [
      {
        id: 1,
        projectId: 1,
        name: "Requirements",
        duration: 5,
        predecessors: []
      },
      {
        id: 2,
        projectId: 1,
        name: "Design",
        duration: 3,
        predecessors: [1]
      },
      {
        id: 3,
        projectId: 1,
        name: "Development",
        duration: 7,
        predecessors: [2]
      }
    ];

// Projects API
export const getProjects = async () => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return [...projectsData];
};

export const getProject = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return projectsData.find(p => p.id === id);
};

export const createProject = async (project) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  const newProject = {
    id: Math.max(...projectsData.map(p => p.id), 0) + 1,
    ...project
  };
  projectsData.push(newProject);
  return newProject;
};

export const updateProject = async (id, updates) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  const index = projectsData.findIndex(p => p.id === id);
  if (index !== -1) {
    projectsData[index] = { ...projectsData[index], ...updates };
    return projectsData[index];
  }
  throw new Error("Project not found");
};

export const deleteProject = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  projectsData = projectsData.filter(p => p.id !== id);
  // Also delete all tasks for this project
  tasksData = tasksData.filter(t => t.projectId !== id);
  return true;
};

// Tasks API
export const getTasksByProject = async (projectId) => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return tasksData.filter(t => t.projectId === projectId);
};

export const getTask = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return tasksData.find(t => t.id === id);
};

export const createTask = async (task) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  const newTask = {
    id: Math.max(...tasksData.map(t => t.id), 0) + 1,
    ...task,
    predecessors: task.predecessors || []
  };
  tasksData.push(newTask);
  return newTask;
};

export const updateTask = async (id, updates) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  const index = tasksData.findIndex(t => t.id === id);
  if (index !== -1) {
    tasksData[index] = { ...tasksData[index], ...updates };
    return tasksData[index];
  }
  throw new Error("Task not found");
};

export const deleteTask = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  tasksData = tasksData.filter(t => t.id !== id);
  // Remove this task from other tasks' predecessors
  tasksData.forEach(task => {
    task.predecessors = task.predecessors.filter(predId => predId !== id);
  });
  return true;
};
