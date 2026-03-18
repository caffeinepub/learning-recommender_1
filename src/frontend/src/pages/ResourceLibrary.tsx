import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import type { LearningResource } from "../backend.d";
import ResourceCard from "../components/ResourceCard";
import { mockResources } from "../data/mockData";
import { useGetAllResources } from "../hooks/useQueries";

type EnrichedResource = LearningResource & {
  id: string;
  image: string;
  rating: number;
};

const CATEGORIES = [
  "All",
  "Mathematics",
  "Computer Science",
  "Physics",
  "Chemistry",
  "History",
];
const TYPES = ["All", "video", "course", "article", "reading", "interactive"];

export default function ResourceLibrary() {
  const { data: backendResources, isLoading } = useGetAllResources();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [type, setType] = useState("All");
  const [difficulty, setDifficulty] = useState("All");

  const allResources: EnrichedResource[] = useMemo(() => {
    if (backendResources && backendResources.length > 0) {
      return backendResources.map((r, i) => ({
        ...mockResources[i % mockResources.length],
        ...r,
        id: `br-${i}`,
      }));
    }
    return mockResources;
  }, [backendResources]);

  const filtered = useMemo(() => {
    return allResources.filter((r) => {
      const matchSearch =
        !search ||
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.description.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "All" || r.category === category;
      const matchType = type === "All" || r.resourceType === type;
      const matchDiff =
        difficulty === "All" || Number(r.difficulty) === Number(difficulty);
      return matchSearch && matchCat && matchType && matchDiff;
    });
  }, [allResources, search, category, type, difficulty]);

  const hasFilters = !!(
    search ||
    category !== "All" ||
    type !== "All" ||
    difficulty !== "All"
  );

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setType("All");
    setDifficulty("All");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-foreground mb-1">
          Resource Library
        </h1>
        <p className="text-muted-foreground">
          Explore {allResources.length} curated learning materials across all
          subjects
        </p>
      </motion.div>

      <div className="bg-card rounded-2xl shadow-card p-4 mb-8 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search resources\u2026"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-ocid="library.search_input"
            className="pl-9 rounded-lg"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-36" data-ocid="library.category.select">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-32" data-ocid="library.type.select">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              {TYPES.map((t) => (
                <SelectItem key={t} value={t} className="capitalize">
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger
              className="w-36"
              data-ocid="library.difficulty.select"
            >
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Levels</SelectItem>
              <SelectItem value="1">Beginner</SelectItem>
              <SelectItem value="2">Intermediate</SelectItem>
              <SelectItem value="3">Advanced</SelectItem>
              <SelectItem value="4">Expert</SelectItem>
            </SelectContent>
          </Select>
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              data-ocid="library.clear_filters.button"
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4 mr-1" /> Clear
            </Button>
          )}
        </div>
      </div>

      {hasFilters && (
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Filters:</span>
          {search && <Badge variant="secondary">{search}</Badge>}
          {category !== "All" && <Badge variant="secondary">{category}</Badge>}
          {type !== "All" && (
            <Badge variant="secondary" className="capitalize">
              {type}
            </Badge>
          )}
          {difficulty !== "All" && (
            <Badge variant="secondary">Level {difficulty}</Badge>
          )}
          <span className="text-sm text-muted-foreground ml-2">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {isLoading ? (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          data-ocid="library.loading_state"
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-72 rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20" data-ocid="library.empty_state">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">
            No resources found
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            Try adjusting your search or filter criteria
          </p>
          <Button
            variant="outline"
            onClick={clearFilters}
            data-ocid="library.empty_state.clear.button"
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {filtered.map((res, i) => (
            <motion.div
              key={res.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <ResourceCard
                resource={res}
                image={res.image}
                rating={res.rating}
                index={i + 1}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
