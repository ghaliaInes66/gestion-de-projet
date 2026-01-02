import { useEffect, useState } from "react";
import { getTasksByProject, createTask, updateTask, deleteTask } from "../api/fakeApi";
import TaskTable from "../components/TaskTable";
import TaskForm from "../components/TaskForm";
import GanttChart from "../components/GanttChart";
import PertChart from "../components/PertChart";
import { ArrowLeft, Plus, List, BarChart3, Network } from "lucide-react";

const ProjectPage = ({ project, goBack }) => {
  const [tasks, setTasks] = useState([]);
  const [view, setView] = useState("tasks");
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await getTasksByProject(project.id);
      setTasks(data);
    } catch (error) {
      console.error("Error loading tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [project]);

  const handleCreate = async (taskData) => {
    try {
      await createTask({ ...taskData, projectId: project.id });
      await loadTasks();
      setShowForm(false);
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Failed to create task");
    }
  };

  const handleUpdate = async (id, taskData) => {
    try {
      await updateTask(id, taskData);
      await loadTasks();
      setEditingTask(null);
      setShowForm(false);
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Failed to update task");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this task?")) {
      return;
    }
    try {
      await deleteTask(id);
      await loadTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Failed to delete task");
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-2xl font-bold text-amber-900">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-amber-900 hover:text-amber-700 font-bold mb-4 transition group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Projects
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-black text-gray-900 mb-2">{project.name}</h1>
              <p className="text-gray-600 text-lg">{project.description || "No description"}</p>
            </div>
            {view === "tasks" && (
              <button
                onClick={() => setShowForm(true)}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full blur opacity-50 group-hover:opacity-75 transition"></div>
                <div className="relative bg-gradient-to-r from-yellow-300 to-orange-300 text-amber-900 px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add Task
                </div>
              </button>
            )}
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex gap-4 mb-8 bg-white/60 backdrop-blur-sm rounded-2xl p-2 border border-amber-100/50 shadow-lg">
          <button
            onClick={() => setView("tasks")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold transition-all ${
              view === "tasks"
                ? "bg-gradient-to-r from-yellow-300 to-orange-300 text-amber-900 shadow-lg"
                : "text-gray-600 hover:text-amber-900 hover:bg-white/80"
            }`}
          >
            <List className="w-5 h-5" />
            Tasks
          </button>
          <button
            onClick={() => setView("gantt")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold transition-all ${
              view === "gantt"
                ? "bg-gradient-to-r from-yellow-300 to-orange-300 text-amber-900 shadow-lg"
                : "text-gray-600 hover:text-amber-900 hover:bg-white/80"
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            Gantt Chart
          </button>
          <button
            onClick={() => setView("pert")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold transition-all ${
              view === "pert"
                ? "bg-gradient-to-r from-yellow-300 to-orange-300 text-amber-900 shadow-lg"
                : "text-gray-600 hover:text-amber-900 hover:bg-white/80"
            }`}
          >
            <Network className="w-5 h-5" />
            PERT Chart
          </button>
        </div>

        {/* Content */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-amber-100/50 shadow-xl">
          {view === "tasks" && (
            <TaskTable
              tasks={tasks}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
          {view === "gantt" && <GanttChart tasks={tasks} />}
          {view === "pert" && <PertChart tasks={tasks} />}
        </div>

        {/* Task Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-200/40 to-orange-200/40 rounded-[2.5rem] blur-2xl"></div>
              <div className="relative bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-8 border border-amber-100/50">
                <TaskForm
                  task={editingTask}
                  projectTasks={tasks}
                  onSubmit={editingTask ? (data) => handleUpdate(editingTask.id, data) : handleCreate}
                  onCancel={handleFormClose}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectPage;
