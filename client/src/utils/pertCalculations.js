// Forward pass: Calculate Early Start and Early Finish
const forwardPass = (tasks) => {
  const result = {};
  const taskMap = {};
  
  // Create a map for quick lookup
  tasks.forEach(task => {
    taskMap[task.id] = { ...task };
  });

  // Topological sort to process tasks in order
  const processed = new Set();
  const processTask = (taskId) => {
    if (processed.has(taskId)) return;
    
    const task = taskMap[taskId];
    if (!task) return;

    // Process all predecessors first
    if (task.predecessors && task.predecessors.length > 0) {
      task.predecessors.forEach(predId => {
        if (!processed.has(predId)) {
          processTask(predId);
        }
      });
    }

    // Calculate Early Start and Early Finish
    const predEarlyFinishes = (task.predecessors || [])
      .map(predId => result[predId]?.earlyFinish || 0);
    
    const earlyStart = predEarlyFinishes.length > 0 
      ? Math.max(...predEarlyFinishes) 
      : 0;
    const earlyFinish = earlyStart + task.duration;

    result[taskId] = {
      ...task,
      earlyStart,
      earlyFinish
    };

    processed.add(taskId);
  };

  // Process all tasks
  tasks.forEach(task => processTask(task.id));

  return { result, taskMap };
};

// Backward pass: Calculate Late Start and Late Finish
const backwardPass = (tasks, forwardResult, projectDuration) => {
  const result = { ...forwardResult };
  const taskMap = {};
  
  tasks.forEach(task => {
    taskMap[task.id] = task;
  });

  // Find tasks that have no successors (end tasks)
  const endTasks = tasks.filter(task => {
    return !tasks.some(t => 
      t.predecessors && t.predecessors.includes(task.id)
    );
  });

  // Process tasks in reverse order
  const processed = new Set();
  const processTask = (taskId) => {
    if (processed.has(taskId)) return;
    
    const task = taskMap[taskId];
    if (!task || !result[taskId]) return;

    // Find all tasks that have this task as a predecessor
    const successors = tasks.filter(t => 
      t.predecessors && t.predecessors.includes(taskId)
    );

    if (successors.length === 0) {
      // End task: Late Finish = Project Duration
      result[taskId].lateFinish = projectDuration;
      result[taskId].lateStart = projectDuration - task.duration;
    } else {
      // Late Finish = min of successors' Late Start
      const successorLateStarts = successors
        .map(succId => {
          if (!processed.has(succId)) {
            processTask(succId);
          }
          return result[succId]?.lateStart;
        })
        .filter(val => val !== undefined);
      
      const lateFinish = successorLateStarts.length > 0
        ? Math.min(...successorLateStarts)
        : projectDuration;
      
      result[taskId].lateFinish = lateFinish;
      result[taskId].lateStart = lateFinish - task.duration;
    }

    processed.add(taskId);
  };

  // Process all tasks starting from end tasks
  endTasks.forEach(task => processTask(task.id));
  
  // Process remaining tasks
  tasks.forEach(task => processTask(task.id));

  return result;
};

// Calculate critical path
const calculateCriticalPath = (tasks, pertData) => {
  const criticalTasks = [];
  
  tasks.forEach(task => {
    const data = pertData[task.id];
    if (data) {
      const slack = data.lateStart - data.earlyStart;
      const isCritical = slack === 0;
      
      pertData[task.id] = {
        ...data,
        slack,
        isCritical
      };

      if (isCritical) {
        criticalTasks.push(task.id);
      }
    }
  });

  return criticalTasks;
};

export const calculatePERT = (tasks) => {
  if (!tasks || tasks.length === 0) {
    return {};
  }

  // Forward pass
  const { result: forwardResult } = forwardPass(tasks);
  
  // Calculate project duration (max Early Finish)
  const projectDuration = Math.max(
    ...Object.values(forwardResult).map(t => t.earlyFinish || 0)
  );

  // Backward pass
  const pertData = backwardPass(tasks, forwardResult, projectDuration);

  // Calculate critical path
  const criticalPath = calculateCriticalPath(tasks, pertData);

  // Add project duration and critical path info
  pertData._projectDuration = projectDuration;
  pertData._criticalPath = criticalPath;

  return pertData;
};

// Get total project duration
export const getProjectDuration = (pertData) => {
  return pertData._projectDuration || 0;
};

// Get critical path tasks
export const getCriticalPath = (pertData) => {
  return pertData._criticalPath || [];
};
