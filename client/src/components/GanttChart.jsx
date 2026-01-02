import { calculatePERT, getProjectDuration } from "../utils/pertCalculations";

const GanttChart = ({ tasks }) => {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">📊</div>
        <h2 className="text-3xl font-bold text-gray-700 mb-2">No tasks to display</h2>
        <p className="text-gray-600">Add tasks to see the Gantt chart</p>
      </div>
    );
  }

  const pertData = calculatePERT(tasks);
  const projectDuration = getProjectDuration(pertData);
  const dayWidth = 40; // pixels per day
  const chartWidth = Math.max(projectDuration * dayWidth, 800);

  const getTaskPosition = (task) => {
    const data = pertData[task.id];
    if (!data) return { left: 0, width: task.duration * dayWidth };
    
    return {
      left: data.earlyStart * dayWidth,
      width: task.duration * dayWidth
    };
  };

  const getTaskNameById = (id) => {
    const task = tasks.find(t => t.id === id);
    return task ? task.name : `Task ${id}`;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-black text-gray-900 mb-2">Gantt Chart</h2>
        <div className="flex items-center gap-6 text-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gradient-to-r from-yellow-300 to-orange-300 rounded"></div>
            <span className="font-medium">Task Duration</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="font-medium">Critical Path</span>
          </div>
          <div className="ml-auto">
            <span className="text-lg font-bold text-amber-900">
              Total Duration: <span className="text-2xl">{projectDuration} days</span>
            </span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="relative" style={{ minWidth: chartWidth }}>
          {/* Timeline Header */}
          <div className="sticky top-0 bg-white/90 backdrop-blur-sm z-10 border-b-2 border-amber-200 mb-4 pb-2">
            <div className="flex" style={{ width: chartWidth }}>
              {Array.from({ length: projectDuration + 1 }, (_, i) => (
                <div
                  key={i}
                  className="border-r border-amber-200 text-center text-sm font-bold text-gray-600"
                  style={{ width: dayWidth }}
                >
                  Day {i}
                </div>
              ))}
            </div>
          </div>

          {/* Tasks */}
          <div className="space-y-4">
            {tasks.map((task) => {
              const position = getTaskPosition(task);
              const data = pertData[task.id];
              const isCritical = data?.isCritical || false;

              return (
                <div key={task.id} className="relative">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-48 font-bold text-gray-900 text-right pr-4">
                      {task.name}
                    </div>
                    <div className="flex-1 relative" style={{ height: "50px" }}>
                      <div
                        className={`absolute h-10 rounded-xl shadow-lg flex items-center justify-center font-bold text-sm transition-all ${
                          isCritical
                            ? "bg-gradient-to-r from-red-500 to-red-600 text-white"
                            : "bg-gradient-to-r from-yellow-300 to-orange-300 text-amber-900"
                        }`}
                        style={{
                          left: `${position.left}px`,
                          width: `${position.width}px`,
                          top: "5px"
                        }}
                      >
                        {task.duration}d
                      </div>
                      {data && (
                        <div className="absolute text-xs text-gray-500 mt-12" style={{ left: `${position.left}px` }}>
                          ES: {data.earlyStart} | EF: {data.earlyFinish}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="mt-8 p-6 bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl border border-amber-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Project Summary</h3>
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
                <div className="text-2xl font-black text-red-600">
                  {tasks.filter(t => pertData[t.id]?.isCritical).length}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 font-medium">Total Work Days</div>
                <div className="text-2xl font-black text-amber-900">
                  {tasks.reduce((sum, t) => sum + t.duration, 0)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GanttChart;
