import { useEffect, useState } from "react";
import { getTasks, createTask, updateTask, deleteTask } from "../api/taskApi";
import { updateProject, deleteProject } from "../api/projectApi";
import TaskTable from "../components/TaskTable";
import TaskForm from "../components/TaskForm";
import GanttChart from "../components/GanttChart";
import PertChart from "../components/PertChart";
import DataTable from "../components/DataTable";
import Spinner from "../components/Spinner";
import { ArrowLeft, Plus, List, BarChart3, Network, Table, Edit, Trash2 } from "lucide-react";

const ProjectPage = ({ project, goBack }) => {
  const [tasks, setTasks] = useState([]);
  const [view, setView] = useState("tasks");
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProjectActions, setShowProjectActions] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (showForm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showForm]);

  const loadTasks = async () => {
    if (!project) {
      setLoading(false);
      return;
    }

    // Use _id if available (MongoDB), otherwise use id
    const projectId = project._id || project.id;
    
    if (!projectId) {
      console.error("No project ID available");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await getTasks(projectId);
      // Map backend fields to frontend format
      const tasksData = Array.isArray(response) ? response : (response.tasks || []);
      const mappedTasks = tasksData.map(task => ({
        id: task._id || task.id,
        projectId: task.project || task.projectId,
        name: task.title,
        duration: task.duree || task.duration,
        status: task.status || 'pending',
        priority: task.priority || 'medium',
        predecessors: task.predeceseur || task.dependencies || []
      }));
      setTasks(mappedTasks);
    } catch (error) {
      console.error("Error loading tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (project) {
      loadTasks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project?._id || project?.id]);

  const handleCreate = async (taskData) => {
    if (!project) {
      setMessage("No project selected");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    if (!taskData.name || taskData.name.trim() === "") {
      setMessage("Please enter task title");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    const projectId = project._id || project.id;
    
    try {
      setLoading(true);
      await createTask({
        projectId: projectId,
        title: taskData.name,
        duree: taskData.duration,
        status: taskData.status || 'pending',
        priority: taskData.priority || 'medium',
        predeceseur: taskData.predecessors || []
      });
      await loadTasks();
      setShowForm(false);
      setMessage("Task added successfully");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error creating task:", error);
      setMessage(error.message || "Failed to create task");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id, taskData) => {
    try {
      setLoading(true);
      await updateTask(id, {
        title: taskData.name,
        duree: taskData.duration,
        status: taskData.status || 'pending',
        priority: taskData.priority || 'medium',
        predeceseur: taskData.predecessors || []
      });
      await loadTasks();
      setEditingTask(null);
      setShowForm(false);
      setMessage("Task updated successfully");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error updating task:", error);
      setMessage(error.message || "Failed to update task");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this task?")) {
      return;
    }
    try {
      setLoading(true);
      await deleteTask(id);
      await loadTasks();
      setMessage("Task deleted successfully");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error deleting task:", error);
      setMessage("Failed to delete task");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setLoading(false);
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
        <Spinner size="32" />
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
              {message && (
                <div className="mt-3 p-3 bg-green-100 border border-green-300 text-green-800 rounded-lg text-sm font-medium">
                  {message}
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              {/* Project Action Buttons */}
              <button
                onClick={() => alert('Edit project functionality - redirecting to edit form')}
                className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-bold hover:bg-gray-50 transition-all shadow-sm text-sm"
                title="Edit Project"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={async () => {
                  if (confirm('Are you sure you want to delete this project? All tasks will also be deleted.')) {
                    try {
                      await deleteProject(project.id || project._id);
                      alert('Project deleted successfully');
                      goBack();
                    } catch (error) {
                      console.error('Error deleting project:', error);
                      alert('Failed to delete project');
                    }
                  }
                }}
                className="flex items-center gap-2 bg-white border border-red-300 text-red-600 px-4 py-2 rounded-lg font-bold hover:bg-red-50 transition-all shadow-sm text-sm"
                title="Delete Project"
              >
                <Trash2 className="w-4 h-4" />
                Delete Project
              </button>
              {view === "tasks" && (
                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-amber-950 px-4 py-2 rounded-lg font-bold shadow-sm transition-all hover:shadow-md active:scale-95 border border-amber-400/50 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add New Task
                </button>
              )}
            </div>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex gap-2 mb-8 bg-amber-50/50 p-1.5 rounded-xl border border-amber-100 shadow-inner">
          <button
            onClick={() => setView("tasks")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-bold transition-all duration-200 ${
              view === "tasks"
                ? "bg-white text-amber-900 shadow-sm ring-1 ring-amber-100/50"
                : "text-amber-700/60 hover:text-amber-800 hover:bg-amber-100/50"
            }`}
          >
            <List className="w-4 h-4" />
            Task List
          </button>
          <button
            onClick={() => setView("gantt")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-bold transition-all duration-200 ${
              view === "gantt"
                ? "bg-white text-amber-900 shadow-sm ring-1 ring-amber-100/50"
                : "text-amber-700/60 hover:text-amber-800 hover:bg-amber-100/50"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Gantt Chart
          </button>
          <button
            onClick={() => setView("pert")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-bold transition-all duration-200 ${
              view === "pert"
                ? "bg-white text-amber-900 shadow-sm ring-1 ring-amber-100/50"
                : "text-amber-700/60 hover:text-amber-800 hover:bg-amber-100/50"
            }`}
          >
            <Network className="w-4 h-4" />
            PERT Chart
          </button>
          <button
            onClick={() => setView("data")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-bold transition-all duration-200 ${
              view === "data"
                ? "bg-white text-amber-900 shadow-sm ring-1 ring-amber-100/50"
                : "text-amber-700/60 hover:text-amber-800 hover:bg-amber-100/50"
            }`}
          >
            <Table className="w-4 h-4" />
            Data
          </button>
        </div>

        {/* Content */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-amber-100/50 shadow-xl">
          {view === "tasks" && (
            tasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-3 opacity-20">📝</div>
                <p className="text-xl font-semibold text-gray-700 mb-3">No tasks in this project</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-amber-950 px-6 py-3 rounded-lg font-bold shadow-sm transition-all hover:shadow-md active:scale-95 border border-amber-400/50"
                >
                  <Plus className="w-5 h-5" />
                  Add New Task
                </button>
              </div>
            ) : (
              <TaskTable
                tasks={tasks}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )
          )}
          {view === "gantt" && <GanttChart tasks={tasks} />}
          {view === "pert" && <PertChart tasks={tasks} />}
          {view === "data" && <DataTable tasks={tasks} />}
        </div>

        {/* Task Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-gray-100 overflow-hidden transform transition-all scale-95">
                <div className="p-6">
                  <TaskForm
                    task={editingTask}
                    projectTasks={tasks}
                    onSubmit={editingTask ? (data) => handleUpdate(editingTask.id || editingTask._id, data) : handleCreate}
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
