import { calculatePERT, getProjectDuration, getCriticalPath } from "../utils/pertCalculations";
import { useState } from "react";
import { BarChart3 } from "lucide-react";

const GanttChart = ({ tasks }) => {
  const [hoveredTask, setHoveredTask] = useState(null);

  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
        <div className="flex justify-center mb-4 text-gray-300">
            <BarChart3 className="w-16 h-16 grayscale opacity-50" />
        </div>
        <h2 className="text-2xl font-bold text-gray-500 mb-2">No tasks to display</h2>
        <p className="text-gray-400">Add tasks to generate the Gantt chart</p>
      </div>
    );
  }

  const pert = calculatePERT(tasks);
  const pertData = pert.tasks;
  const projectDuration = getProjectDuration(pert);
  const criticalPath = getCriticalPath(pert);

  // Scale configuration
  const dayWidth = 50; // Wider for readability
  const headerHeight = 50;
  const rowHeight = 60;
  const chartWidth = Math.max((projectDuration + 2) * dayWidth, 800);
  const totalHeight = tasks.length * rowHeight + headerHeight;

  // Sort tasks by ES (Early Start) for logical visual cascade, then by ID
  const sortedTasks = [...tasks].sort((a, b) => {
    const dataA = pertData[a.id];
    const dataB = pertData[b.id];
    if (dataA.ES !== dataB.ES) return dataA.ES - dataB.ES;
    return a.id - b.id;
  });

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Diagramme de Gantt</h2>
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

      {/* ===== ZONE GANTT ===== */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden mb-8 relative">
        <div className="overflow-x-auto custom-scrollbar">
            <div className="relative" style={{ width: chartWidth, minHeight: totalHeight }}>
                
                {/* GRID DE FOND (Lignes verticales) */}
                <div className="absolute inset-0 pointer-events-none flex">
                    {Array.from({ length: projectDuration + 2 }).map((_, i) => (
                        <div 
                            key={i} 
                            className="h-full border-r border-gray-100" 
                            style={{ width: dayWidth, minWidth: dayWidth }}
                        ></div>
                    ))}
                </div>

                {/* HEADER (Days) */}
                <div className="sticky top-0 z-20 flex bg-gray-50 border-b border-gray-200 font-bold text-xs text-gray-500 uppercase tracking-wider" style={{ height: headerHeight }}>
                    {Array.from({ length: projectDuration + 2 }).map((_, i) => (
                        <div 
                            key={i} 
                            className="flex items-center justify-center border-r border-gray-200 bg-gray-50"
                            style={{ width: dayWidth, minWidth: dayWidth }}
                        >
                            J{i + 1}
                        </div>
                    ))}
                </div>

                {/* ROWS (Tasks) */}
                <div className="relative z-10">
                    {sortedTasks.map((task, index) => {
                        const data = pertData[task.id];
                        const isCritical = data?.MT === 0;
                        const barLeft = data.ES * dayWidth;
                        const barWidth = task.duration * dayWidth;
                        
                        // Total Slack (Total Float) bar logic (optional visualization)
                        // Shows how much the task can be delayed.
                        // Starts at EF, length is MT.
                        const floatLeft = data.EF * dayWidth;
                        const floatWidth = data.MT * dayWidth;

                        return (
                            <div 
                                key={task.id} 
                                className={`border-b border-gray-100 hover:bg-gray-50 transition-colors flex items-center relative group/row ${hoveredTask === task.id ? 'z-50' : 'z-0'}`}
                                style={{ height: rowHeight }}
                                onMouseEnter={() => setHoveredTask(task.id)}
                                onMouseLeave={() => setHoveredTask(null)}
                            >
                                {/* Task name on the left (Sticky position if we want to scroll horizontally while keeping names - complex here, we put it in absolute or simple div) */}
                                {/* For simplicity, we display the name ON the bar or next to it if too small */}
                                
                                {/* TASK BAR */}
                                <div 
                                    className={`absolute h-8 rounded-md shadow-sm border transition-all duration-300 hover:shadow-md hover:brightness-110 flex items-center px-3 text-xs font-bold text-white overflow-visible whitespace-nowrap z-10
                                        ${isCritical 
                                            ? "bg-red-500 from-red-500 to-red-600 border-red-600" 
                                            : "bg-blue-500 from-blue-500 to-blue-600 border-blue-600"
                                        } bg-gradient-to-r`}
                                    style={{ 
                                        left: barLeft, 
                                        width: Math.max(barWidth, 4), // Min width visual
                                        marginLeft: 2 // Tiny offset from grid line
                                    }}
                                >
                                    <span className="drop-shadow-md">{task.name}</span>
                                </div>
                                
                                {/* INFO NEXT TO BAR */}
                                <div 
                                    className="absolute text-[10px] font-mono text-gray-700 flex gap-3 items-center whitespace-nowrap z-[100]"
                                    style={{ 
                                        left: barLeft + Math.max(barWidth, 4) + 8,
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        marginLeft: 2
                                    }}
                                >
                                    <span className="font-bold">Duration: <span className="text-gray-800">{task.duration}d</span></span>
                                    <span className="font-bold">ES: <span className="text-blue-600">{data.ES}</span></span>
                                    <span className="font-bold">EF: <span className="text-blue-600">{data.EF}</span></span>
                                    <span className="font-bold">ML: <span className="text-green-600">{data.ML}</span></span>
                                    <span className="font-bold">MT: <span className={isCritical ? "text-red-600" : "text-blue-600"}>{data.MT}</span></span>
                                </div>

                                {/* SLACK BAR (Float) - Optional but instructive */}
                                {data.MT > 0 && (
                                    <div 
                                        className="absolute h-4 bg-[#C4D8FF] rounded-r-md opacity-60 pattern-diagonal-lines border border-dashed border-[#0066FF]"
                                        style={{
                                            left: floatLeft,
                                            width: floatWidth,
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            marginLeft: 2
                                        }}
                                    ></div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
      </div>

    </div>
  );
};

export default GanttChart;
