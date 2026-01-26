import { useState, useEffect } from "react";
import { X } from "lucide-react";

const ProjectForm = ({ project, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: ""
  });

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || "",
        description: project.description || "",
        startDate: project.startDate || "",
        endDate: project.endDate || ""
      });
    }
  }, [project]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Please enter project name");
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
      <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
        <h2 className="text-xl font-bold text-gray-800">
          {project ? "Edit Project" : "New Project"}
        </h2>
        <button
          onClick={onCancel}
          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-md transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-gray-700 font-medium mb-1.5 text-sm">
            PROJECT NAME *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ex: Refonte du site web"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none transition-all text-gray-900 placeholder-gray-400 text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1.5 text-sm">
            DESCRIPTION
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Optional project description..."
            rows="4"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none transition-all text-gray-900 placeholder-gray-400 text-sm resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1.5 text-sm">
              START DATE
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none transition-all text-gray-900 text-sm"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1.5 text-sm">
              END DATE
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none transition-all text-gray-900 text-sm"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-100 mt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-lg text-gray-700 bg-white border border-gray-300 font-medium hover:bg-gray-50 transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2.5 rounded-lg text-white bg-amber-500 hover:bg-amber-600 font-medium shadow-sm transition-colors text-sm"
          >
            {project ? "Save Changes" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;


