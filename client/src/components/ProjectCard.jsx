import { Edit, Trash2, ArrowRight } from "lucide-react";

const ProjectCard = ({ project, onOpen, onEdit, onDelete }) => {
  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-200/30 to-orange-200/30 rounded-3xl blur-xl group-hover:blur-2xl transition"></div>
      <div className="relative bg-white/80 backdrop-blur-sm p-6 rounded-3xl border border-amber-100/50 hover:border-amber-200/80 transition-all shadow-lg hover:shadow-2xl">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 flex-1">{project.name}</h2>
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit && onEdit();
              }}
              className="p-2 text-amber-700 hover:bg-amber-100 rounded-lg transition"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete && onDelete();
              }}
              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <p className="text-gray-600 mb-6 min-h-[3rem]">{project.description || "No description"}</p>

        <button
          onClick={onOpen}
          className="relative w-full group/btn"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl blur opacity-50 group-hover/btn:opacity-75 transition"></div>
          <div className="relative bg-gradient-to-r from-yellow-300 to-orange-300 text-amber-900 px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2">
            Open Project
            <ArrowRight className="w-5 h-5" />
          </div>
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;
