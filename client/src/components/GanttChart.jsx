import { calculatePERT, getProjectDuration, getCriticalPath } from "../utils/pertCalculations";

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

  // === Calculs PERT comme l’enseignant ===
  const pert = calculatePERT(tasks);
  const pertData = pert.tasks;
  const projectDuration = getProjectDuration(pert);
  const criticalPath = getCriticalPath(pert);

  const dayWidth = 40;
  const chartWidth = Math.max(projectDuration * dayWidth, 800);

  const getTaskPosition = (task) => {
    const data = pertData[task.id];
    if (!data) return { left: 0, width: task.duration * dayWidth };

    return {
      left: data.ES * dayWidth,   // début = ES (date au plus tôt)
      width: task.duration * dayWidth
    };
  };

  return (
    <div>
      

      {/* ===== GANTT (DESIGN CONSERVÉ) ===== */}
      <div className="overflow-x-auto">
        <div className="relative" style={{ minWidth: chartWidth }}>
          
          {/* Timeline */}
          <div className="sticky top-0 bg-white/90 z-10 border-b-2 border-amber-200 mb-4 pb-2">
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
              const isCritical = data?.MT === 0; // ← logique professeur

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
                        {task.duration}j
                      </div>

                      {data && (
                        <div
                          className="absolute text-xs text-gray-500 mt-12"
                          style={{ left: `${position.left}px` }}
                        >
                          ES: {data.ES} | EF: {data.EF}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ===== INFOS COMME CHEZ L’ENSEIGNANT ===== */}
      <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
        <div className="text-lg font-bold text-red-800">
          Durée totale du projet : {projectDuration} jours
        </div>
        <div className="mt-2 text-red-700 font-semibold">
          Chemin critique :{" "}
          {criticalPath.length > 0
            ? criticalPath.join(" → ")
            : "Aucun"}
        </div>
        <div className="text-sm text-gray-600 mt-1">
          (Tâches critiques ⇔ MT = 0)
        </div>
      </div>
    </div>
  );
};

export default GanttChart;
