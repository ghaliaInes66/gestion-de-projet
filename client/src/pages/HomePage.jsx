import { useEffect, useState } from "react";
import { getProjects, createProject, updateProject, deleteProject } from "../api/fakeApi";
import ProjectCard from "../components/ProjectCard";
import ProjectForm from "../components/ProjectForm";
import { Plus, LogOut } from "lucide-react";

const HomePage = ({ setSelectedProject, onLogout }) => {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error("Error loading projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreate = async (projectData) => {
    try {
      await createProject(projectData);
      await loadProjects();
      setShowForm(false);
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Failed to create project");
    }
  };

  const handleUpdate = async (id, projectData) => {
    try {
      await updateProject(id, projectData);
      await loadProjects();
      setEditingProject(null);
    } catch (error) {
      console.error("Error updating project:", error);
      alert("Failed to update project");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this project? All tasks will also be deleted.")) {
      return;
    }
    try {
      await deleteProject(id);
      await loadProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Failed to delete project");
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
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-2xl font-bold text-amber-900">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-5xl font-black text-gray-900 mb-2">My Projects</h1>
            <p className="text-gray-600 text-lg">Manage your projects and tasks</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setShowForm(true)}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full blur opacity-50 group-hover:opacity-75 transition"></div>
              <div className="relative bg-gradient-to-r from-yellow-300 to-orange-300 text-amber-900 px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add Project
              </div>
            </button>
            {onLogout && (
              <button
                onClick={onLogout}
                className="bg-white/80 backdrop-blur-sm border-2 border-amber-200 text-amber-900 px-6 py-3 rounded-full font-bold hover:bg-white hover:border-amber-300 transition-all shadow-lg flex items-center gap-2"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            )}
          </div>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-3xl font-bold text-gray-700 mb-2">No projects yet</h2>
            <p className="text-gray-600 mb-6">Create your first project to get started</p>
            <button
              onClick={() => setShowForm(true)}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full blur opacity-50 group-hover:opacity-75 transition"></div>
              <div className="relative bg-gradient-to-r from-yellow-300 to-orange-300 text-amber-900 px-8 py-4 rounded-full font-bold shadow-xl hover:shadow-2xl transition-all transform hover:scale-105">
                Create Project
              </div>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                onOpen={() => setSelectedProject(project)}
                onEdit={() => handleEdit(project)}
                onDelete={() => handleDelete(project.id)}
              />
            ))}
          </div>
        )}

        {/* Project Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-200/40 to-orange-200/40 rounded-[2.5rem] blur-2xl"></div>
              <div className="relative bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-8 border border-amber-100/50">
                <ProjectForm
                  project={editingProject}
                  onSubmit={editingProject ? (data) => handleUpdate(editingProject.id, data) : handleCreate}
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

export default HomePage;
