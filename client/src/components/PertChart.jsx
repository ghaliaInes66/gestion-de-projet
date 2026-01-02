import { calculatePERT, getProjectDuration, getCriticalPath } from "../utils/pertCalculations";

const PertChart = ({ tasks }) => {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🕸️</div>
        <h2 className="text-3xl font-bold text-gray-700 mb-2">No tasks to display</h2>
        <p className="text-gray-600">Add tasks to see the PERT chart</p>
      </div>
    );
  }

  const pertData = calculatePERT(tasks);
  const projectDuration = getProjectDuration(pertData);
  const criticalPath = getCriticalPath(pertData);

  const getTaskNameById = (id) => {
    const task = tasks.find(t => t.id === id);
    return task ? task.name : `Task ${id}`;
  };

  // Filter out metadata
  const taskData = Object.values(pertData).filter(t => t.id !== undefined);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-black text-gray-900 mb-2">PERT Chart & Calculations</h2>
        <div className="flex items-center gap-6 text-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gradient-to-r from-blue-300 to-blue-400 rounded-full border-2 border-blue-600"></div>
            <span className="font-medium">Normal Task</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-red-600 rounded-full border-2 border-red-800"></div>
            <span className="font-medium">Critical Path</span>
          </div>
          <div className="ml-auto">
            <span className="text-lg font-bold text-amber-900">
              Project Duration: <span className="text-2xl">{projectDuration} days</span>
            </span>
          </div>
        </div>
      </div>

      {/* PERT Network Diagram */}
      <div className="mb-8 p-6 bg-white/50 rounded-2xl border border-amber-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Network Diagram</h3>
        <div className="overflow-x-auto">
          <div className="flex items-center gap-4 min-w-max p-4">
            {taskData.map((task, index) => {
              const isCritical = task.isCritical || false;
              const hasPredecessors = task.predecessors && task.predecessors.length > 0;

              return (
                <div key={task.id} className="flex items-center">
                  {/* Predecessor arrows */}
                  {hasPredecessors && (
                    <div className="flex items-center gap-2 mr-4">
                      {task.predecessors.map((predId, predIndex) => {
                        const predIsCritical = criticalPath.includes(predId) && isCritical;
                        return (
                          <div key={predId} className="relative">
                            <div
                              className={`h-0.5 w-12 ${
                                predIsCritical ? "bg-red-600" : "bg-gray-400"
                              }`}
                            />
                            <div
                              className={`absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-t-2 border-b-2 border-transparent ${
                                predIsCritical ? "border-l-red-600" : "border-l-gray-400"
                              }`}
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Task Node */}
                  <div className="relative">
                    <div
                      className={`w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-lg border-4 ${
                        isCritical
                          ? "bg-gradient-to-br from-red-500 to-red-600 border-red-800"
                          : "bg-gradient-to-br from-blue-300 to-blue-400 border-blue-600"
                      }`}
                    >
                      <div
                        className={`text-xs font-bold text-center px-2 ${
                          isCritical ? "text-white" : "text-blue-900"
                        }`}
                      >
                        {task.name}
                      </div>
                      <div
                        className={`text-xs font-bold mt-1 ${
                          isCritical ? "text-white" : "text-blue-900"
                        }`}
                      >
                        {task.duration}d
                      </div>
                    </div>
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-700 whitespace-nowrap">
                      ES:{task.earlyStart} EF:{task.earlyFinish}
                    </div>
                  </div>

                  {/* Arrow to next */}
                  {index < taskData.length - 1 && (
                    <div className="mx-4">
                      <div className="h-0.5 w-12 bg-gray-400" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detailed Calculations Table */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Detailed Calculations</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-amber-200 bg-white/50">
                <th className="text-left py-3 px-4 text-gray-700 font-bold">Task</th>
                <th className="text-center py-3 px-4 text-gray-700 font-bold">Duration</th>
                <th className="text-center py-3 px-4 text-gray-700 font-bold">Early Start</th>
                <th className="text-center py-3 px-4 text-gray-700 font-bold">Early Finish</th>
                <th className="text-center py-3 px-4 text-gray-700 font-bold">Late Start</th>
                <th className="text-center py-3 px-4 text-gray-700 font-bold">Late Finish</th>
                <th className="text-center py-3 px-4 text-gray-700 font-bold">Slack</th>
                <th className="text-center py-3 px-4 text-gray-700 font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {taskData.map((task, index) => (
                <tr
                  key={task.id}
                  className={`border-b border-amber-100/50 ${
                    task.isCritical ? "bg-red-50/50" : index % 2 === 0 ? "bg-white/30" : "bg-white/10"
                  }`}
                >
                  <td className="py-3 px-4">
                    <div className="font-bold text-gray-900">{task.name}</div>
                    {task.predecessors && task.predecessors.length > 0 && (
                      <div className="text-xs text-gray-500 mt-1">
                        Depends on: {task.predecessors.map(id => getTaskNameById(id)).join(", ")}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold">
                      {task.duration}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-gray-700">{task.earlyStart}</td>
                  <td className="py-3 px-4 text-center font-bold text-gray-700">{task.earlyFinish}</td>
                  <td className="py-3 px-4 text-center font-bold text-gray-700">{task.lateStart}</td>
                  <td className="py-3 px-4 text-center font-bold text-gray-700">{task.lateFinish}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full font-bold ${
                        task.slack === 0
                          ? "bg-red-100 text-red-900"
                          : "bg-green-100 text-green-900"
                      }`}
                    >
                      {task.slack}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {task.isCritical ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-500 text-white font-bold text-sm">
                        Critical
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-200 text-gray-700 font-bold text-sm">
                        Normal
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Critical Path Summary */}
      {criticalPath.length > 0 && (
        <div className="p-6 bg-gradient-to-r from-red-100 to-red-200 rounded-2xl border-2 border-red-300">
          <h3 className="text-xl font-bold text-red-900 mb-3">Critical Path</h3>
          <div className="flex items-center gap-2 flex-wrap">
            {criticalPath.map((taskId, index) => {
              const task = tasks.find(t => t.id === taskId);
              return (
                <div key={taskId} className="flex items-center">
                  <span className="px-4 py-2 bg-red-500 text-white font-bold rounded-lg">
                    {task ? task.name : `Task ${taskId}`}
                  </span>
                  {index < criticalPath.length - 1 && (
                    <span className="mx-2 text-red-700 font-bold">→</span>
                  )}
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-red-800 font-medium">
            The critical path determines the minimum project duration. Any delay in these tasks will delay the entire project.
          </p>
        </div>
      )}

      {/* Summary Statistics */}
      <div className="mt-6 p-6 bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl border border-amber-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Summary Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-sm text-gray-600 font-medium">Total Tasks</div>
            <div className="text-2xl font-black text-amber-900">{tasks.length}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 font-medium">Project Duration</div>
            <div className="text-2xl font-black text-amber-900">{projectDuration} days</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 font-medium">Critical Tasks</div>
            <div className="text-2xl font-black text-red-600">{criticalPath.length}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 font-medium">Total Work</div>
            <div className="text-2xl font-black text-amber-900">
              {tasks.reduce((sum, t) => sum + t.duration, 0)} days
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PertChart;
