import { calculatePERT } from "../utils/pertCalculations";
import { useRef, useEffect, useState } from "react";
import { Network } from "lucide-react";

// Component for visualizing PERT network
const PertChart = ({ tasks }) => {
  const [positions, setPositions] = useState({});
  const containerRef = useRef(null);

  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
        <div className="flex justify-center mb-4 text-gray-300">
            <Network className="w-16 h-16 grayscale opacity-50" />
        </div>
        <h2 className="text-2xl font-bold text-gray-500 mb-2">No tasks to display</h2>
        <p className="text-gray-400">Add tasks to generate the PERT diagram</p>
      </div>
    );
  }

  const pert = calculatePERT(tasks);
  const data = pert.tasks;
  const projectDuration = pert.projectDuration;

  // -------- Construction par niveaux --------
  const levels = [];
  const remaining = new Set(tasks.map((t) => t.id));

  while (remaining.size > 0) {
    const level = [];
    for (let id of remaining) {
      const task = tasks.find((t) => t.id === id);
      const preds = task.predecessors || [];
      const allPredsDone = preds.every((p) => levels.flat().includes(p));
      if (allPredsDone) level.push(id);
    }
    levels.push(level);
    level.forEach((id) => remaining.delete(id));
  }

  // After render, get positions of each circle
  useEffect(() => {
    if (!containerRef.current) return;
    const newPositions = {};
    tasks.forEach((t) => {
      const el = document.getElementById(`task-${t.id}`);
      if (el) {
        const rect = el.getBoundingClientRect();
        const parentRect = containerRef.current.getBoundingClientRect();
        newPositions[t.id] = {
          x: rect.left + rect.width / 2 - parentRect.left,
          y: rect.top + rect.height / 2 - parentRect.top,
          w: rect.width,
          h: rect.height,
        };
      }
    });
    setPositions(newPositions);
  }, [tasks, levels]);

  // Helper: calculate point on circle edge
  const getEdgePoint = (from, to) => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;

    const rFrom = from.w / 2;
    const rTo = to.w / 2;

    return {
      startX: from.x + (dx * rFrom) / dist,
      startY: from.y + (dy * rFrom) / dist,
      endX: to.x - (dx * rTo) / dist,
      endY: to.y - (dy * rTo) / dist,
    };
  };

  // Helper: Create curved path (Quadratic Bezier) depending on inclination
  const getCurvedPath = (sx, sy, ex, ey) => {
    const dx = ex - sx;
    const dy = ey - sy;

    // If nearly vertical, straight line
    if (Math.abs(dx) < 10) {
      return `M ${sx} ${sy} L ${ex} ${ey}`;
    }

    const mx = (sx + ex) / 2;
    const my = (sy + ey) / 2;

    // Pull the control point horizontally based on direction
    // If going right (dx > 0), pull right. If left (dx < 0), pull left.
    const cx = mx + dx * 0.2;
    const cy = my;

    return `M ${sx} ${sy} Q ${cx} ${cy} ${ex} ${ey}`;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">PERT</h2>
                <div className="flex gap-4">
            <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-bold border border-blue-200 shadow-sm flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                Duration: {projectDuration} days
            </div>
            <div className="px-4 py-2 bg-red-50 text-red-700 rounded-lg font-bold border border-red-200 shadow-sm flex items-center gap-2">
                 <span className="w-3 h-3 rounded-full bg-red-500"></span>
                Critical Path
            </div>
        </div>
      </div>

      {/* ===== DIAGRAMME ===== */}
      <div
        ref={containerRef}
        className="mb-8 p-6 bg-white rounded-xl border relative min-h-[400px]"
      >
        {/* DP */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gray-200 border-2 border-gray-400 font-bold flex items-center justify-center shadow-sm z-10 relative">
            Start
          </div>
        </div>

        {/* Niveaux */}
        {levels.map((level, idx) => (
          <div key={idx} className="flex justify-center gap-12 mb-12">
            {level.map((id) => {
              const t = data[id];
              const isCritical = t.MT === 0;
              return (
                <div
                  key={id}
                  id={`task-${id}`}
                  className="group relative z-10 hover:z-50"
                >
                  {/* Circular Node */}
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center font-bold border-4 shadow-lg cursor-pointer transition-transform transform group-hover:scale-110 ${isCritical
                        ? "bg-red-500 text-white border-red-800"
                        : "bg-blue-200 text-blue-900 border-blue-600"
                      }`}
                  >
                    {t.name}
                  </div>

                  {/* Tooltip on Hover */}
                  <div className="absolute left-1/2 -top-2 transform -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 mb-2">
                    <div className="bg-gray-800 text-white text-xs rounded p-3 shadow-xl whitespace-nowrap min-w-[140px] border border-gray-600">
                      <div className="text-center font-bold mb-2 border-b border-gray-600 pb-1 text-yellow-400 text-sm">
                        {t.name}
                      </div>
                      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-left">
                        <span className="font-bold text-gray-400">ES:</span>
                        <span className="text-right">{t.ES}</span>
                        <span className="font-bold text-gray-400">EF:</span>
                        <span className="text-right">{t.EF}</span>
                        <span className="font-bold text-gray-400">LS:</span>
                        <span className="text-right">{t.LS}</span>
                        <span className="font-bold text-gray-400">LF:</span>
                        <span className="text-right">{t.LF}</span>
                        <span className="col-span-2 border-t border-gray-700 my-1"></span>
                        <span className="font-bold text-green-400">
                          Free Slack:
                        </span>
                        <span className="text-right font-mono">{t.ML}</span>
                        <span className="font-bold text-blue-400">
                          Total Slack:
                        </span>
                        <span className="text-right font-mono">{t.MT}</span>
                        <span className="font-bold text-gray-300">Duration:</span>
                        <span className="text-right">{t.duration}</span>
                      </div>
                      {/* Little triangle pointer */}
                      <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-gray-800"></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {/* FP */}
        <div className="flex justify-center mt-6">
          <div className="w-16 h-16 rounded-full bg-gray-200 border-2 border-gray-400 font-bold flex items-center justify-center shadow-sm z-10 relative">
            End
          </div>
        </div>

        {/* SVG Arrows (Positioned last to be visually on top, acts as overlay) */}
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-20 overflow-visible">
          {tasks.map((t) =>
            (t.predecessors || []).map((pred) => {
              const from = positions[pred];
              const to = positions[t.id];
              if (!from || !to) return null;

              const { startX, startY, endX, endY } = getEdgePoint(from, to);
              const pathD = getCurvedPath(startX, startY, endX, endY);

              const tData = data[t.id];
              const pData = data[pred];
              // Critical path condition: both nodes critical AND strictly connected in time
              const isCriticalEdge =
                tData.MT === 0 &&
                pData.MT === 0 &&
                Math.abs(pData.EF - tData.ES) < 0.001;

              return (
                <path
                  key={`${pred}-${t.id}`}
                  d={pathD}
                  fill="none"
                  stroke={isCriticalEdge ? "#EF4444" : "#555"}
                  strokeWidth={isCriticalEdge ? "3" : "2"}
                  strokeLinecap="round"
                  className={`transition-all ${isCriticalEdge
                      ? "opacity-100 z-20"
                      : "opacity-60 hover:opacity-100"
                    } hover:stroke-black hover:stroke-[3px]`}
                />
              );
            })
          )}
        </svg>
      </div>
    </div>
  );
};

export default PertChart;