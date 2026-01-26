import { useState, useEffect } from "react";
import { X } from "lucide-react";

const TaskForm = ({ task, projectTasks, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    duration: 1,
    predecessors: []
  });

  useEffect(() => {
    if (task) {
      setFormData({
        name: task.name || "",
        duration: task.duration || 1,
        predecessors: task.predecessors || []
      });
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Please enter task title");
      return;
    }
    if (formData.duration < 1) {
      alert("Duration must be at least 1 day");
      return;
    }
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "number") {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value) || 1
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePredecessorChange = (taskId, checked) => {
    setFormData(prev => {
      const predecessors = checked
        ? [...prev.predecessors, taskId]
        : prev.predecessors.filter(id => id !== taskId);
      return {
        ...prev,
        predecessors
      };
    });
  };

  // Function to check if adding a predecessor would create a cycle
  const wouldCreateCycle = (candidateId, currentTaskId, currentPredecessors) => {
    // Build a dependency graph
    const graph = {};
    
    // Add all existing task dependencies
    projectTasks.forEach(t => {
      graph[t.id] = t.predecessors || [];
    });
    
    // Simulate adding the new dependency
    graph[currentTaskId] = [...currentPredecessors, candidateId];
    
    // DFS to detect cycle starting from candidateId
    const visited = new Set();
    const recStack = new Set();
    
    const hasCycle = (nodeId) => {
      if (!graph[nodeId]) return false;
      
      visited.add(nodeId);
      recStack.add(nodeId);
      
      for (const predId of graph[nodeId]) {
        if (!visited.has(predId)) {
          if (hasCycle(predId)) return true;
        } else if (recStack.has(predId)) {
          return true; // Cycle detected
        }
      }
      
      recStack.delete(nodeId);
      return false;
    };
    
    // Check if adding this dependency creates a cycle
    return hasCycle(currentTaskId);
  };

  // Get available tasks for predecessors (exclude current task and tasks that would create cycles)
  const currentTaskId = task?.id || 'new-task';
  const availableTasks = projectTasks.filter(t => {
    // Exclude current task
    if (task && t.id === task.id) return false;
    
    // Check if this task would create a cycle
    return !wouldCreateCycle(t.id, currentTaskId, formData.predecessors);
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
        <h2 className="text-xl font-bold text-gray-800">
          {task ? "Edit Task" : "New Task"}
        </h2>
        <button
          onClick={onCancel}
          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-md transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-gray-700 font-medium mb-1.5 text-sm">
            Task name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ex: Database design"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none transition-all text-gray-900 placeholder-gray-400 text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1.5 text-sm">
            Duration (days) *
          </label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            min="1"
            placeholder="Ex: 5"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none transition-all text-gray-900 placeholder-gray-400 text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1.5 text-sm">
            Predecessors
          </label>
          {availableTasks.length === 0 ? (
            <div className="text-gray-400 text-sm py-3 px-4 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-center">
                No tasks available
            </div>
          ) : (
            <div className="space-y-1 max-h-48 overflow-y-auto p-2 bg-gray-50 rounded-lg border border-gray-200">
              {availableTasks.map(t => (
                <label
                  key={t.id}
                  className="flex items-center cursor-pointer p-2 hover:bg-white rounded-md transition border border-transparent hover:border-gray-100"
                >
                  <input
                    type="checkbox"
                    checked={formData.predecessors.includes(t.id)}
                    onChange={(e) => handlePredecessorChange(t.id, e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 border-gray-300"
                  />
                  <span className="ml-2.5 text-gray-700 text-sm">
                    {t.name} <span className="text-gray-400 text-xs">({t.duration}j)</span>
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-100 mt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-lg text-gray-700 bg-white border border-gray-300 font-medium hover:bg-gray-50 transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2.5 rounded-lg text-white bg-amber-500 hover:bg-amber-600 font-medium shadow-sm transition-colors text-sm"
          >
            {task ? "Save" : "Save Task"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;


