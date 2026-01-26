// utils/pertCalculations.js

// -------- Forward pass (ES, EF) --------
const forwardPass = (tasks) => {
  const result = {};
  const visited = new Set();

  const getTask = (id) => tasks.find(t => t.id === id);

  const dfs = (taskId) => {
    if (visited.has(taskId)) return;
    const task = getTask(taskId);

    let ES = 0;
    if (task.predecessors && task.predecessors.length > 0) {
      task.predecessors.forEach(p => {
        if (!visited.has(p)) dfs(p);
        ES = Math.max(ES, result[p].EF);
      });
    }

    const EF = ES + task.duration;
    result[taskId] = { ...task, ES, EF };
    visited.add(taskId);
  };

  tasks.forEach(t => dfs(t.id));
  return result;
};

// -------- Backward pass (LS, LF) --------
const backwardPass = (tasks, forwardData, projectDuration) => {
  const result = { ...forwardData };

  const getSuccessors = (id) =>
    tasks.filter(t => t.predecessors && t.predecessors.includes(id));

  const visited = new Set();

  const dfs = (taskId) => {
    if (visited.has(taskId)) return;
    const successors = getSuccessors(taskId);

    let LF;
    if (successors.length === 0) {
      LF = projectDuration;
    } else {
      LF = Math.min(...successors.map(s => {
        if (!visited.has(s.id)) dfs(s.id);
        return result[s.id].LS;
      }));
    }

    const LS = LF - result[taskId].duration;
    result[taskId].LF = LF;
    result[taskId].LS = LS;
    visited.add(taskId);
  };

  tasks.forEach(t => dfs(t.id));
  return result;
};

// -------- Slacks --------
const calculateMargins = (tasks, data) => {
  const getSuccessors = (id) =>
    tasks.filter(t => t.predecessors && t.predecessors.includes(id));

  tasks.forEach(task => {
    const d = data[task.id];

    const MT = d.LS - d.ES; // Total Slack

    const successors = getSuccessors(task.id);
    let ML;
    if (successors.length === 0) {
      ML = MT;
    } else {
      const minES = Math.min(...successors.map(s => data[s.id].ES));
      ML = minES - d.EF;
    }

    d.MT = MT;
    d.ML = ML;
    d.isCritical = MT === 0;
  });

  return data;
};

// -------- Main --------
export const calculatePERT = (tasks) => {
  if (!tasks || tasks.length === 0) return {};

  const forward = forwardPass(tasks);
  const projectDuration = Math.max(...Object.values(forward).map(t => t.EF));
  const backward = backwardPass(tasks, forward, projectDuration);
  const finalData = calculateMargins(tasks, backward);

  return {
    tasks: finalData,
    projectDuration
  };
};

export const getProjectDuration = (pert) => pert.projectDuration;

export const getCriticalPath = (pert) => {
  if (!pert || !pert.tasks) return [];
  const tasks = Object.values(pert.tasks);
  
  // Find all critical tasks (MT = 0)
  const criticalTasks = tasks.filter(t => t.isCritical);
  if (criticalTasks.length === 0) return [];

  // Build adjacency graph for critical tasks only
  const criticalIds = new Set(criticalTasks.map(t => t.id));
  const adjList = {};
  
  criticalTasks.forEach(t => {
    adjList[t.id] = [];
    // Find successors that are also critical
    const criticalSuccessors = tasks.filter(succ => 
      succ.predecessors?.includes(t.id) && criticalIds.has(succ.id)
    );
    adjList[t.id] = criticalSuccessors.map(s => s.id);
  });

  // Find start nodes (critical tasks with no critical predecessors)
  const startNodes = criticalTasks.filter(t => {
    const critPreds = t.predecessors?.filter(p => criticalIds.has(p)) || [];
    return critPreds.length === 0;
  });

  // DFS to find all complete paths from start to end
  const allPaths = [];
  
  const dfs = (currentId, path) => {
    const nextNodes = adjList[currentId];
    if (!nextNodes || nextNodes.length === 0) {
      // End node - save path
      allPaths.push([...path]);
      return;
    }
    nextNodes.forEach(nextId => {
      dfs(nextId, [...path, nextId]);
    });
  };

  startNodes.forEach(node => {
    dfs(node.id, [node.id]);
  });

  return allPaths; // Returns array of paths (each path is array of task IDs)
};
