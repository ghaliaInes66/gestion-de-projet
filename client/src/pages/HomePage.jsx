import { useEffect, useState } from "react";
import { getProjects, createProject, updateProject, deleteProject } from "../api/projectApi";
import ProjectCard from "../components/ProjectCard";
import ProjectForm from "../components/ProjectForm";
import Spinner from "../components/Spinner";
import { Plus, LogOut, User } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const HomePage = ({ userId, setSelectedProject, onLogout }) => {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
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

  const loadProjects = async () => {
    if (!userId) {
      console.error("No user ID available");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await getProjects(userId);
      // Map backend fields to frontend format
      const projectsData = Array.isArray(response) ? response : (response.projects || []);
      const mappedProjects = projectsData.map(project => ({
        id: project._id || project.id,
        name: project.title,
        description: project.description
      }));
      setProjects(mappedProjects);
    } catch (error) {
      console.error("Error loading projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [userId]);

  const handleCreate = async (projectData) => {
    if (!userId) {
      alert("User not logged in");
      return;
    }

    if (!projectData.name || projectData.name.trim() === "") {
      setMessage("Please enter project name");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    try {
      setLoading(true);
      await createProject({
        userId: userId,
        title: projectData.name,
        description: projectData.description || "",
        startDate: projectData.startDate,
        endDate: projectData.endDate
      });
      await loadProjects();
      setShowForm(false);
      setMessage("Project created successfully");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error creating project:", error);
      setMessage(error.message || "Failed to create project");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id, projectData) => {
    try {
      setLoading(true);
      await updateProject(id, {
        title: projectData.name,
        description: projectData.description || "",
        startDate: projectData.startDate,
        endDate: projectData.endDate
      });
      await loadProjects();
      setEditingProject(null);
      setShowForm(false);
      setMessage("Project updated successfully");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error updating project:", error);
      setMessage(error.message || "Failed to update project");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this project? All tasks will also be deleted.")) {
      return;
    }
    try {
      setLoading(true);
      await deleteProject(id);
      await loadProjects();
      setMessage("Project deleted successfully");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error deleting project:", error);
      setMessage("Failed to delete project");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProject(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner size="32" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-lg text-amber-600 font-semibold mb-1">Welcome</p>
            <h1 className="text-4xl font-black text-gray-900 mb-2">My Projects</h1>
            <p className="text-gray-600 text-lg">Manage your projects and tasks efficiently</p>
            {message && (
              <div className="mt-3 p-3 bg-green-100 border border-green-300 text-green-800 rounded-lg text-sm font-medium">
                {message}
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            {/* User Profile */}
            {currentUser && (
              <div className="flex items-center gap-2 bg-white/50 border border-gray-200 rounded-full pl-1 pr-3 py-1 shadow-sm hover:bg-white transition-colors cursor-default">
                <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center border border-amber-200">
                  <span className="text-amber-700 font-bold text-xs">{currentUser.name ? currentUser.name[0].toUpperCase() : "U"}</span>
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  {currentUser.name || "User"}
                </span>
              </div>
            )}
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-amber-950 px-4 py-2 rounded-lg font-bold shadow-sm transition-all hover:shadow-md active:scale-95 border border-amber-400/50 text-sm"
            >
              <Plus className="w-4 h-4" />
              Create New Project
            </button>
            {onLogout && (
              <button
                onClick={onLogout}
                className="bg-white border border-amber-200 text-amber-900 px-4 py-2 rounded-lg font-bold hover:bg-amber-50 transition-all shadow-sm flex items-center gap-2 text-sm"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            )}
          </div>
        </div>

        {/* Search Field */}
        {projects.length > 0 && (
          <div className="mb-6">
            <input
              type="search"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-md px-4 py-2.5 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none transition-all text-gray-900 placeholder-gray-400 text-sm"
            />
          </div>
        )}

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <div className="text-6xl mb-4 grayscale opacity-20">📋</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No projects currently</h2>
            <p className="text-gray-500 mb-6">Create your first project to get started</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-amber-950 px-6 py-3 rounded-lg font-bold shadow-sm transition-all hover:shadow-md active:scale-95"
            >
                <Plus className="w-5 h-5" />
                Create a project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects
              .filter(project => 
                searchQuery === "" || 
                project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase()))
              )
              .map(project => (
              <ProjectCard
                key={project.id || project._id}
                project={project}
                onOpen={() => setSelectedProject(project)}
                onEdit={() => handleEdit(project)}
                onDelete={() => handleDelete(project.id || project._id)}
              />
            ))}
          </div>
        )}

        {/* Project Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-gray-100 overflow-hidden transform transition-all scale-95 p-6">
                 <ProjectForm
                  project={editingProject}
                  onSubmit={editingProject ? (data) => handleUpdate(editingProject.id || editingProject._id, data) : handleCreate}
                  onCancel={handleFormClose}
                />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
