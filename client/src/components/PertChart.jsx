import { calculatePERT } from "../utils/pertCalculations";
import { useRef, useEffect, useState } from "react";

const PertChart = ({ tasks }) => {
  const [positions, setPositions] = useState({});
  const containerRef = useRef(null);

  if (!tasks || tasks.length === 0) return <p>No tasks</p>;

  const pert = calculatePERT(tasks);
  const data = pert.tasks;

  // -------- Construction par niveaux --------
  const levels = [];
  const remaining = new Set(tasks.map(t => t.id));

  while (remaining.size > 0) {
    const level = [];
    for (let id of remaining) {
      const task = tasks.find(t => t.id === id);
      const preds = task.predecessors || [];
      const allPredsDone = preds.every(p => levels.flat().includes(p));
      if (allPredsDone) level.push(id);
    }
    levels.push(level);
    level.forEach(id => remaining.delete(id));
  }

  // After render, get positions of each circle
  useEffect(() => {
    if (!containerRef.current) return;
    const newPositions = {};
    tasks.forEach(t => {
      const el = document.getElementById(`task-${t.id}`);
      if (el) {
        const rect = el.getBoundingClientRect();
        const parentRect = containerRef.current.getBoundingClientRect();
        newPositions[t.id] = {
          x: rect.left + rect.width / 2 - parentRect.left,
          y: rect.top + rect.height / 2 - parentRect.top,
          r: rect.width / 2, // radius
        };
      }
    });
    setPositions(newPositions);
  }, [tasks, levels]);

  // Helper: calculate point on circle edge
  const getEdgePoint = (from, to) => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const ratioFrom = from.r / dist;
    const ratioTo = to.r / dist;
    return {
      startX: from.x + dx * ratioFrom,
      startY: from.y + dy * ratioFrom,
      endX: to.x - dx * ratioTo,
      endY: to.y - dy * ratioTo,
    };
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">PERT </h2>

      {/* ===== DIAGRAMME ===== */}
      <div ref={containerRef} className="mb-8 p-6 bg-white rounded-xl border relative">

        {/* SVG Arrows */}
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="10"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="black" />
            </marker>
          </defs>

          {tasks.map(t =>
            (t.predecessors || []).map(pred => {
              const from = positions[pred];
              const to = positions[t.id];
              if (!from || !to) return null;
              const { startX, startY, endX, endY } = getEdgePoint(from, to);
              return (
                <line
                  key={`${pred}-${t.id}`}
                  x1={startX}
                  y1={startY}
                  x2={endX}
                  y2={endY}
                  stroke="black"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                />
              );
            })
          )}
        </svg>

        {/* DP */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center font-bold">
            DP
          </div>
        </div>

        {/* Niveaux */}
        {levels.map((level, idx) => (
          <div key={idx} className="flex justify-center gap-8 mb-6">
            {level.map(id => {
              const t = data[id];
              const isCritical = t.MT === 0;
              return (
                <div
                  key={id}
                  id={`task-${id}`}
                  className="flex flex-col items-center"
                >
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center font-bold border-4 ${
                      isCritical
                        ? "bg-red-500 text-white border-red-800"
                        : "bg-blue-200 text-blue-900 border-blue-600"
                    }`}
                  >
                    {t.name}
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {/* FP */}
        <div className="flex justify-center mt-6">
          <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center font-bold">
            FP
          </div>
        </div>
      </div>

      {/* ===== TABLEAU COMME TD ===== */}
      <h3 className="text-xl font-bold mb-3">Tableau des calculs</h3>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th>Tâche</th>
            <th>ES</th>
            <th>EF</th>
            <th>LS</th>
            <th>LF</th>
            <th>ML</th>
            <th>MT</th>
            <th>État</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(data).map(t => (
            <tr key={t.id} className={t.MT === 0 ? "bg-red-100" : ""}>
              <td>{t.name}</td>
              <td>{t.ES}</td>
              <td>{t.EF}</td>
              <td>{t.LS}</td>
              <td>{t.LF}</td>
              <td>{t.ML}</td>
              <td>{t.MT}</td>
              <td>{t.MT === 0 ? "Critique" : "Normale"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PertChart;

