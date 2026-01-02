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
      alert("Task name is required");
      return;
    }
    if (formData.duration < 1) {
      alert("Duration must be at least 1");
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

  // Get available tasks for predecessors (exclude current task)
  const availableTasks = projectTasks.filter(t => !task || t.id !== task.id);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-black text-gray-900">
          {task ? "Edit Task" : "New Task"}
        </h2>
        <button
          onClick={onCancel}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-bold mb-3 text-sm">
            TASK NAME *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter task name"
            className="w-full px-5 py-4 rounded-2xl border-2 border-amber-200/50 bg-white/50 focus:border-amber-300 focus:bg-white focus:outline-none transition-all text-gray-900 placeholder-gray-400"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-3 text-sm">
            DURATION (days) *
          </label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            min="1"
            placeholder="Enter duration in days"
            className="w-full px-5 py-4 rounded-2xl border-2 border-amber-200/50 bg-white/50 focus:border-amber-300 focus:bg-white focus:outline-none transition-all text-gray-900 placeholder-gray-400"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-3 text-sm">
            PREDECESSORS
          </label>
          {availableTasks.length === 0 ? (
            <p className="text-gray-500 text-sm py-4">No other tasks available</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto p-4 bg-gray-50 rounded-2xl border-2 border-amber-200/50">
              {availableTasks.map(t => (
                <label
                  key={t.id}
                  className="flex items-center group cursor-pointer p-3 hover:bg-white rounded-xl transition"
                >
                  <input
                    type="checkbox"
                    checked={formData.predecessors.includes(t.id)}
                    onChange={(e) => handlePredecessorChange(t.id, e.target.checked)}
                    className="w-5 h-5 rounded-lg border-2 border-amber-300 text-amber-500 focus:ring-amber-300"
                  />
                  <span className="ml-3 text-gray-700 font-medium group-hover:text-amber-900 transition">
                    {t.name} ({t.duration} days)
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="relative flex-1 group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl blur opacity-50 group-hover:opacity-75 transition"></div>
            <div className="relative bg-gradient-to-r from-yellow-300 to-orange-300 text-amber-900 py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all transform hover:scale-[1.02]">
              {task ? "Update" : "Create"}
            </div>
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;


