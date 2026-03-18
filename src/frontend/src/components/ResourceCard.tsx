import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, FileText, Star, Video, Zap } from "lucide-react";
import type { LearningResource } from "../backend.d";

const difficultyLabel = (d: bigint) => {
  const n = Number(d);
  if (n === 1)
    return { label: "Beginner", className: "bg-success/15 text-success" };
  if (n === 2)
    return { label: "Intermediate", className: "bg-primary/15 text-primary" };
  if (n === 3) return { label: "Advanced", className: "bg-star/15 text-star" };
  return { label: "Expert", className: "bg-destructive/15 text-destructive" };
};

const typeIcon = (type: string) => {
  if (type === "video") return Video;
  if (type === "article" || type === "reading") return FileText;
  if (type === "interactive") return Zap;
  return BookOpen;
};

interface ResourceCardProps {
  resource: LearningResource;
  image?: string;
  rating?: number;
  onClick?: () => void;
  index: number;
}

export default function ResourceCard({
  resource,
  image,
  rating = 4.5,
  onClick,
  index,
}: ResourceCardProps) {
  const diff = difficultyLabel(resource.difficulty);
  const TypeIcon = typeIcon(resource.resourceType);
  const durationMin = Number(resource.duration);

  return (
    <button
      type="button"
      data-ocid={`resources.item.${index}`}
      onClick={onClick}
      className="bg-card rounded-xl overflow-hidden shadow-card hover:shadow-lg transition-all duration-200 cursor-pointer group hover:-translate-y-1 text-left w-full"
    >
      <div className="relative h-40 overflow-hidden bg-muted">
        {image ? (
          <img
            src={image}
            alt={resource.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <TypeIcon className="w-12 h-12 text-primary/40" />
          </div>
        )}
        <div className="absolute top-3 left-3">
          <Badge className={`text-xs font-medium ${diff.className} border-0`}>
            {diff.label}
          </Badge>
        </div>
        <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {durationMin >= 60
            ? `${Math.floor(durationMin / 60)}h ${durationMin % 60}m`
            : `${durationMin}m`}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-1.5 mb-2">
          <TypeIcon className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground capitalize">
            {resource.resourceType}
          </span>
          <span className="text-muted-foreground/50 mx-1">·</span>
          <span className="text-xs text-muted-foreground">
            {resource.category}
          </span>
        </div>
        <h3 className="font-semibold text-foreground text-sm leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {resource.title}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
          {resource.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-star text-star" />
            <span className="text-xs font-semibold text-foreground">
              {rating.toFixed(1)}
            </span>
          </div>
          <div className="flex gap-1 flex-wrap">
            {resource.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </button>
  );
}
