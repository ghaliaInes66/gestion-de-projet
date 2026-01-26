import { useState } from "react";
import { Edit, Trash2, Clock, ArrowRight, Layers, List } from "lucide-react";

const TaskTable = ({ tasks, onEdit, onDelete }) => {
  const [statusFilter, setStatusFilter] = useState("all");
  
  const getTaskNameById = (id) => {
    const task = tasks.find(t => t.id === id);
    return task ? task.name : `ID: ${id}`;
  };

  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
        <div className="flex justify-center mb-4 text-gray-300">
            <List className="w-16 h-16 grayscale opacity-50" />
        </div>
        <h2 className="text-2xl font-bold text-gray-500 mb-2">No tasks in this project</h2>
        <p className="text-gray-400">Start by adding a new task to your project.</p>
      </div>
    );
  }

  // Filter tasks based on status
  const filteredTasks = statusFilter === "all" 
    ? tasks 
    : tasks.filter(task => task.status === statusFilter);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Filter Bar */}
      <div className="bg-slate-50/80 border-b border-slate-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <label htmlFor="status-filter" className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            Filter:
          </label>
          <select
            id="status-filter"
            name="filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent bg-white shadow-sm"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <span className="text-xs text-slate-500 font-medium">
          Showing {filteredTasks.length} of {tasks.length} tasks
        </span>
      </div>
      
      {/* Table Header */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/80 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider w-20 text-center">#</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Task Name</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider w-32 text-center">Duration</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Predecessors</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider w-28 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredTasks.map((task, index) => (
              <tr 
                key={task.id} 
                className="group hover:bg-slate-50 transition-colors"
              >
                {/* Index / ID */}
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-white border border-slate-200 text-xs font-bold text-slate-500 shadow-sm">
                    {index + 1}
                  </span>
                </td>

                {/* Task Name */}
                <td className="px-6 py-4">
                  <button
                    onClick={() => onEdit && onEdit(task)}
                    className="text-sm font-bold text-slate-700 hover:text-amber-600 transition-colors text-left"
                  >
                    {task.name}
                  </button>
                </td>

                {/* Duration */}
                <td className="px-6 py-4 text-center">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-semibold shadow-sm">
                    <Clock className="w-3.5 h-3.5" />
                    {task.duration} j
                  </div>
                </td>

                {/* Predecessors */}
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {task.predecessors && task.predecessors.length > 0 ? (
                      task.predecessors.map((predId) => (
                        <span key={predId} className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-100 text-xs font-medium">
                             {getTaskNameById(predId)}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-300 text-xs italic">None</span>
                    )}
                  </div>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit && onEdit(task)}
                      className="p-2 text-slate-500 bg-white border border-slate-200 rounded-lg hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete && onDelete(task.id)}
                      className="p-2 text-slate-500 bg-white border border-slate-200 rounded-lg hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all shadow-sm"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
          
      {/* Footer / Summary */}
      <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex justify-between items-center text-xs text-slate-500 font-medium">
        <span>Total tasks</span>
        <span className="bg-white px-2.5 py-0.5 rounded border border-slate-200 text-slate-700 font-bold shadow-sm">{filteredTasks.length}</span>
      </div>
    </div>
  );
};

export default TaskTable;
