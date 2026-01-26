import { calculatePERT, getProjectDuration, getCriticalPath } from "../utils/pertCalculations";
import { Table } from "lucide-react";

const DataTable = ({ tasks }) => {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
        <div className="flex justify-center mb-4 text-gray-300">
            <Table className="w-16 h-16 grayscale opacity-50" />
        </div>
        <h2 className="text-2xl font-bold text-gray-500 mb-2">No data to display</h2>
        <p className="text-gray-400">Add tasks to see temporal data</p>
      </div>
    );
  }

  const pert = calculatePERT(tasks);
  const pertData = pert.tasks;
  const projectDuration = getProjectDuration(pert);
  const criticalPath = getCriticalPath(pert);

  // Sort tasks by ID
  const sortedTasks = [...tasks].sort((a, b) => a.id - b.id);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Temporal Data</h2>
        <div className="flex gap-4">
          <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-bold border border-blue-200 shadow-sm flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            Duration: {projectDuration} days
          </div>
          <div className="px-4 py-2 bg-gray-50 text-gray-700 rounded-lg font-bold border border-gray-200 shadow-sm">
            {tasks.length} {tasks.length > 1 ? 'Tasks' : 'Task'}
          </div>
        </div>
      </div>

      {/* Critical Paths */}
      <div className="bg-red-50 border border-red-100 rounded-xl p-6 mb-6">
        <h3 className="text-red-800 font-bold text-lg mb-3 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
          {criticalPath.length > 1 ? `Critical Paths (${criticalPath.length})` : 'Critical Path'}
        </h3>
        <div className="space-y-3">
          {criticalPath.length > 0 ? (
            criticalPath.map((path, pIdx) => (
              <div key={pIdx} className="flex flex-wrap items-center gap-2 p-3 bg-white/60 rounded-lg border border-red-200">
                {criticalPath.length > 1 && (
                  <span className="text-xs font-bold text-red-600 bg-red-100 px-2.5 py-1 rounded-full mr-2">
                    Path {pIdx + 1}
                  </span>
                )}
                {path.map((id, idx) => (
                  <span key={`${pIdx}-${id}`} className="flex items-center">
                    <span className="font-mono font-bold bg-white px-3 py-1.5 rounded-md border border-red-300 shadow-sm text-sm text-red-700">
                      {tasks.find(t => t.id === id)?.name || `T${id}`}
                    </span>
                    {idx < path.length - 1 && <span className="mx-2 text-red-400 font-bold">→</span>}
                  </span>
                ))}
              </div>
            ))
          ) : (
            <span className="italic opacity-70 text-red-700">No critical path detected</span>
          )}
        </div>
      </div>

      {/* Tableau Principal */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b-2 border-gray-300">
              <tr>
                <th className="px-6 py-3 bg-gray-100">Task</th>
                <th className="px-6 py-3 text-center bg-gray-100">Duration</th>
                <th className="px-6 py-3 text-center bg-blue-100 border-l-2 border-blue-200">ES</th>
                <th className="px-6 py-3 text-center bg-blue-100">EF</th>
                <th className="px-6 py-3 text-center bg-orange-100 border-l-2 border-orange-200">LS</th>
                <th className="px-6 py-3 text-center bg-orange-100">LF</th>
                <th className="px-6 py-3 text-center bg-green-100 border-l-2 border-green-200 font-bold text-green-700">ML</th>
                <th className="px-6 py-3 text-center bg-purple-100 border-l-2 border-purple-200 font-bold text-purple-700">MT</th>
                <th className="px-6 py-3 text-center bg-gray-100 border-l-2 border-gray-300">Status</th>
              </tr>
            </thead>
            <tbody>
              {sortedTasks.map((t, idx) => {
                const data = pertData[t.id];
                const isCritical = data.MT === 0;
                return (
                  <tr
                    key={t.id}
                    className={`border-b transition-colors ${
                      isCritical
                        ? "bg-red-50/50 hover:bg-red-100/50"
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {t.name}
                    </td>
                    <td className="px-6 py-4 text-center font-mono text-gray-700">
                      {t.duration}
                    </td>
                    <td className="px-6 py-4 text-center text-blue-700 font-mono font-bold border-l-2 border-blue-100">
                      {data.ES}
                    </td>
                    <td className="px-6 py-4 text-center text-blue-700 font-mono font-bold">
                      {data.EF}
                    </td>
                    <td className="px-6 py-4 text-center text-orange-700 font-mono font-bold border-l-2 border-orange-100">
                      {data.LS}
                    </td>
                    <td className="px-6 py-4 text-center text-orange-700 font-mono font-bold">
                      {data.LF}
                    </td>
                    <td className="px-6 py-4 text-center font-mono font-bold text-green-700 border-l-2 border-green-100">
                      {data.ML}
                    </td>
                    <td className="px-6 py-4 text-center font-mono font-bold text-purple-700 border-l-2 border-purple-100">
                      {data.MT}
                    </td>
                    <td className="px-6 py-4 text-center border-l-2 border-gray-200">
                      {isCritical ? (
                        <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-bold shadow-sm">
                          Critique
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-xs font-bold shadow-sm">
                          Normal
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <h3 className="text-blue-800 font-bold text-sm mb-2">Earliest Dates</h3>
          <ul className="text-xs text-blue-700 space-y-1">
            <li><span className="font-bold">ES:</span> Earliest Start date</li>
            <li><span className="font-bold">EF:</span> Earliest Finish date</li>
          </ul>
        </div>
        <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
          <h3 className="text-orange-800 font-bold text-sm mb-2">Latest Dates</h3>
          <ul className="text-xs text-orange-700 space-y-1">
            <li><span className="font-bold">LS:</span> Latest Start date</li>
            <li><span className="font-bold">LF:</span> Latest Finish date</li>
          </ul>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-xl p-4">
          <h3 className="text-green-800 font-bold text-sm mb-2">Free Slack (ML)</h3>
          <p className="text-xs text-green-700">
            Possible delay without impacting following tasks
          </p>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-xl p-4">
          <h3 className="text-red-800 font-bold text-sm mb-2">Total Slack (MT)</h3>
          <p className="text-xs text-red-700">
            Possible delay without delaying the project. <span className="font-bold">MT = 0</span> = Critical task
          </p>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
