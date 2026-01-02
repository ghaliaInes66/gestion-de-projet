import { Edit, Trash2 } from "lucide-react";

const TaskTable = ({ tasks, onEdit, onDelete }) => {
  const getTaskNameById = (id) => {
    const task = tasks.find(t => t.id === id);
    return task ? task.name : `Task ${id}`;
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">📝</div>
        <h2 className="text-3xl font-bold text-gray-700 mb-2">No tasks yet</h2>
        <p className="text-gray-600">Add your first task to get started</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-amber-200">
            <th className="text-left py-4 px-6 text-gray-700 font-bold">Task Name</th>
            <th className="text-left py-4 px-6 text-gray-700 font-bold">Duration (days)</th>
            <th className="text-left py-4 px-6 text-gray-700 font-bold">Predecessors</th>
            <th className="text-right py-4 px-6 text-gray-700 font-bold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => (
            <tr
              key={task.id}
              className={`border-b border-amber-100/50 hover:bg-amber-50/50 transition ${
                index % 2 === 0 ? "bg-white/30" : "bg-white/10"
              }`}
            >
              <td className="py-4 px-6">
                <div className="font-bold text-gray-900">{task.name}</div>
              </td>
              <td className="py-4 px-6">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold">
                  {task.duration} {task.duration === 1 ? "day" : "days"}
                </span>
              </td>
              <td className="py-4 px-6">
                {task.predecessors && task.predecessors.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {task.predecessors.map(predId => (
                      <span
                        key={predId}
                        className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-sm font-medium"
                      >
                        {getTaskNameById(predId)}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-400 italic">None</span>
                )}
              </td>
              <td className="py-4 px-6">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onEdit && onEdit(task)}
                    className="p-2 text-amber-700 hover:bg-amber-100 rounded-lg transition"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete && onDelete(task.id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
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
  );
};

export default TaskTable;
