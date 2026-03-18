import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  GraduationCap,
  Star,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import ResourceCard from "../components/ResourceCard";
import {
  mockPerformance,
  mockProfile,
  mockResources,
  mockStudents,
} from "../data/mockData";
import {
  useGetCallerProfile,
  useGetRecommendations,
} from "../hooks/useQueries";

type Page = "dashboard" | "resources" | "profile" | "performance" | "admin";

interface DashboardProps {
  onNavigate: (page: Page) => void;
}

function LibraryIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <title>Library</title>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { data: recommendations, isLoading: recLoading } =
    useGetRecommendations();
  const { data: profile } = useGetCallerProfile();

  const displayProfile = profile || mockProfile;
  const displayRecs =
    recommendations && recommendations.length > 0
      ? recommendations.slice(0, 3).map((r, i) => ({
          ...mockResources[i % mockResources.length],
          ...r,
          id: `rec-${i}`,
        }))
      : mockResources.slice(0, 3);

  const totalStudyTime = mockPerformance.reduce(
    (a, p) => a + Number(p.studyTime),
    0,
  );
  const avgScore = Math.round(
    mockPerformance.reduce((a, p) => a + Number(p.score), 0) /
      mockPerformance.length,
  );

  const statItems = [
    {
      icon: BookOpen,
      label: "Active Courses",
      value: displayProfile.currentCourses.length,
      color: "text-primary",
    },
    {
      icon: Target,
      label: "Avg Score",
      value: `${avgScore}%`,
      color: "text-success",
    },
    {
      icon: TrendingUp,
      label: "Study Hours",
      value: `${Math.round(totalStudyTime / 60)}h`,
      color: "text-star",
    },
    {
      icon: GraduationCap,
      label: "Completed",
      value: displayProfile.completedCourses.length,
      color: "text-primary",
    },
  ];

  const summaryItems = [
    {
      label: "Resources Completed",
      value: mockPerformance.reduce(
        (a, p) => a + p.completedResources.length,
        0,
      ),
      className: "bg-primary/10 text-primary",
    },
    {
      label: "Total Study Time",
      value: `${Math.round(totalStudyTime / 60)}h`,
      className: "bg-success/10 text-success",
    },
    {
      label: "Average Score",
      value: `${avgScore}%`,
      className: "bg-star/10 text-star",
    },
    {
      label: "Active Courses",
      value: displayProfile.currentCourses.length,
      className: "bg-primary/10 text-primary",
    },
  ];

  const libTabs = ["new", "trending", "saved"] as const;

  return (
    <div className="pb-8">
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.93 0.04 240), oklch(0.87 0.07 250))",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex items-center gap-8">
          <div className="flex-1 z-10">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <Badge className="bg-primary/15 text-primary border-0 mb-4 text-sm px-3 py-1">
                <Zap className="w-3.5 h-3.5 mr-1.5" />
                Personalized for You
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3 leading-tight">
                Welcome back,
                <br />
                <span className="text-primary">
                  {displayProfile.name.split(" ")[0]}!
                </span>
              </h1>
              <p className="text-muted-foreground text-lg mb-6 max-w-lg">
                Continue your learning journey. You&apos;re making great
                progress across {displayProfile.currentCourses.length} courses.
              </p>
              <div className="flex gap-3 flex-wrap">
                <Button
                  onClick={() => onNavigate("resources")}
                  data-ocid="hero.browse_resources.button"
                  className="bg-primary text-white hover:bg-primary/90 rounded-full px-6"
                >
                  Browse Resources <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onNavigate("performance")}
                  data-ocid="hero.view_progress.button"
                  className="rounded-full px-6 border-foreground/20"
                >
                  View Progress
                </Button>
              </div>
            </motion.div>
          </div>
          <div className="hidden lg:block flex-shrink-0 w-96 h-64 rounded-2xl overflow-hidden shadow-xl">
            <img
              src="/assets/generated/hero-students.dim_800x500.jpg"
              alt="Students learning"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-sm border-t border-white/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {statItems.map((stat) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-white shadow-xs flex items-center justify-center">
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div>
                    <div className="font-bold text-xl text-foreground">
                      {stat.value}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-10">
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-foreground">
                Today&apos;s Recommendations
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Curated for:{" "}
                {displayProfile.currentCourses.slice(0, 2).join(" \u00b7 ")}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate("resources")}
              data-ocid="recommendations.view_all.button"
              className="text-primary hover:text-primary/80"
            >
              View all <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          {recLoading ? (
            <div
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              data-ocid="recommendations.loading_state"
            >
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-72 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {displayRecs.map((res, i) => (
                <motion.div
                  key={res.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <ResourceCard
                    resource={res}
                    image={res.image}
                    rating={res.rating}
                    index={i + 1}
                    onClick={() => onNavigate("resources")}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">
              Performance Overview
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate("performance")}
              data-ocid="performance.view_details.button"
              className="text-sm"
            >
              Detailed View
            </Button>
          </div>
          <div className="bg-card rounded-2xl shadow-card p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-5">
                <h3 className="font-semibold text-foreground">
                  Course Progress
                </h3>
                {mockPerformance.map((perf, i) => (
                  <div
                    key={perf.course}
                    data-ocid={`performance.course.item.${i + 1}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">
                        {perf.course}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground">
                          {Math.round(Number(perf.studyTime) / 60)}h studied
                        </span>
                        <span className="text-sm font-bold text-primary">
                          {Number(perf.score)}%
                        </span>
                      </div>
                    </div>
                    <Progress value={Number(perf.score)} className="h-2.5" />
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Summary</h3>
                {summaryItems.map((item) => (
                  <div
                    key={item.label}
                    className={`rounded-xl p-4 ${item.className}`}
                  >
                    <div className="text-2xl font-bold">{item.value}</div>
                    <div className="text-xs font-medium mt-0.5 opacity-80">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="bg-card rounded-2xl shadow-card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" /> Student Profiles
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate("profile")}
                data-ocid="students.view_all.button"
                className="text-primary text-xs"
              >
                View all
              </Button>
            </div>
            <div className="space-y-3" data-ocid="students.list">
              {mockStudents.map((student, i) => (
                <div
                  key={student.name}
                  data-ocid={`students.item.${i + 1}`}
                  className="flex items-center justify-between py-2.5 border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                      {student.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">
                        {student.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {student.style} &middot; {student.courses} courses
                      </div>
                    </div>
                  </div>
                  <div
                    className={`text-sm font-bold ${
                      student.score >= 90
                        ? "text-success"
                        : student.score >= 75
                          ? "text-primary"
                          : "text-star"
                    }`}
                  >
                    {student.score}%
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-card rounded-2xl shadow-card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <LibraryIcon className="w-5 h-5 text-primary" /> Resource
                Library
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate("resources")}
                data-ocid="library.view_all.button"
                className="text-primary text-xs"
              >
                View all
              </Button>
            </div>
            <Tabs defaultValue="new">
              <TabsList className="mb-4 w-full">
                <TabsTrigger
                  value="new"
                  className="flex-1"
                  data-ocid="library.new.tab"
                >
                  New
                </TabsTrigger>
                <TabsTrigger
                  value="trending"
                  className="flex-1"
                  data-ocid="library.trending.tab"
                >
                  Trending
                </TabsTrigger>
                <TabsTrigger
                  value="saved"
                  className="flex-1"
                  data-ocid="library.saved.tab"
                >
                  Saved
                </TabsTrigger>
              </TabsList>
              {libTabs.map((tab, ti) => (
                <TabsContent key={tab} value={tab} className="space-y-2">
                  {mockResources.slice(ti, ti + 3).map((res) => (
                    <button
                      key={res.id}
                      type="button"
                      data-ocid={`library.${tab}.item.1`}
                      onClick={() => onNavigate("resources")}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted cursor-pointer transition-colors group w-full text-left"
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                        <img
                          src={res.image}
                          alt={res.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                          {res.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {res.category}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-star flex-shrink-0">
                        <Star className="w-3 h-3 fill-star" />
                        {res.rating.toFixed(1)}
                      </div>
                    </button>
                  ))}
                </TabsContent>
              ))}
            </Tabs>
          </section>
        </div>
      </div>
    </div>
  );
}
