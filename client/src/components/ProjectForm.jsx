import { useState, useEffect } from "react";
import { X } from "lucide-react";

const ProjectForm = ({ project, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || "",
        description: project.description || ""
      });
    }
  }, [project]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Project name is required");
      return;
    }
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-black text-gray-900">
          {project ? "Edit Project" : "New Project"}
        </h2>
        <button
          onClick={onCancel}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-bold mb-3 text-sm">
            PROJECT NAME *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter project name"
            className="w-full px-5 py-4 rounded-2xl border-2 border-amber-200/50 bg-white/50 focus:border-amber-300 focus:bg-white focus:outline-none transition-all text-gray-900 placeholder-gray-400"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-3 text-sm">
            DESCRIPTION
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter project description"
            rows="4"
            className="w-full px-5 py-4 rounded-2xl border-2 border-amber-200/50 bg-white/50 focus:border-amber-300 focus:bg-white focus:outline-none transition-all text-gray-900 placeholder-gray-400 resize-none"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="relative flex-1 group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl blur opacity-50 group-hover:opacity-75 transition"></div>
            <div className="relative bg-gradient-to-r from-yellow-300 to-orange-300 text-amber-900 py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all transform hover:scale-[1.02]">
              {project ? "Update" : "Create"}
            </div>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;


