import { Edit, Trash2, ArrowRight } from "lucide-react";

const ProjectCard = ({ project, onOpen, onEdit, onDelete }) => {
  return (
    <div className="group bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all hover:border-amber-300 hover:translate-y-[-2px] flex flex-col h-full">
      <div className="flex items-start justify-between mb-3">
        <h2 className="text-xl font-bold text-gray-800 flex-1 line-clamp-1">{project.name}</h2>
        <div className="flex gap-1 -mr-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit && onEdit();
            }}
            className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete && onDelete();
            }}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <p className="text-gray-500 text-sm mb-6 flex-1 line-clamp-2 leading-relaxed">
        {project.description || "No description available."}
      </p>

      <button
        onClick={onOpen}
        className="w-full flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 text-amber-950 py-2.5 rounded-lg font-bold text-sm shadow-sm transition-all active:scale-95 group-hover:shadow-amber-100"
      >
        Open project
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ProjectCard;
