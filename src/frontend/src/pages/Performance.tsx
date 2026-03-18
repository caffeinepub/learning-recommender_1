import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Award, BookOpen, Clock, Target, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { mockPerformance, mockProfile } from "../data/mockData";

const weeklyData = [
  { week: "Week 1", score: 72, hours: 8 },
  { week: "Week 2", score: 78, hours: 10 },
  { week: "Week 3", score: 81, hours: 9 },
  { week: "Week 4", score: 85, hours: 12 },
  { week: "Week 5", score: 83, hours: 11 },
  { week: "Week 6", score: 88, hours: 14 },
];

const CHART_COLORS = ["#3b82f6", "#22c55e", "#f59e0b"];

const statItems = [
  {
    key: "avg-score",
    icon: Target,
    label: "Average Score",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    key: "study-time",
    icon: Clock,
    label: "Total Study Time",
    color: "text-success",
    bg: "bg-success/10",
  },
  {
    key: "resources",
    icon: BookOpen,
    label: "Resources Done",
    color: "text-star",
    bg: "bg-star/10",
  },
  {
    key: "courses",
    icon: TrendingUp,
    label: "Active Courses",
    color: "text-primary",
    bg: "bg-primary/10",
  },
];

export default function Performance() {
  const totalStudyTime = mockPerformance.reduce(
    (a, p) => a + Number(p.studyTime),
    0,
  );
  const avgScore = Math.round(
    mockPerformance.reduce((a, p) => a + Number(p.score), 0) /
      mockPerformance.length,
  );
  const totalCompleted = mockPerformance.reduce(
    (a, p) => a + p.completedResources.length,
    0,
  );

  const statValues = [
    `${avgScore}%`,
    `${Math.round(totalStudyTime / 60)}h`,
    totalCompleted,
    mockProfile.currentCourses.length,
  ];

  const statSubs = [
    "Across all courses",
    `${totalStudyTime} minutes`,
    "Completed resources",
    "Currently enrolled",
  ];

  const pieData = mockPerformance.map((p) => ({
    name: p.course,
    value: Number(p.studyTime),
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-foreground">
          Performance Tracking
        </h1>
        <p className="text-muted-foreground mt-1">
          Monitor your academic progress and study patterns
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statItems.map((stat, i) => (
          <motion.div
            key={stat.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            data-ocid={`performance.stat.item.${i + 1}`}
            className="bg-card rounded-2xl shadow-card p-5"
          >
            <div
              className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}
            >
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className="text-2xl font-bold text-foreground">
              {statValues[i]}
            </div>
            <div className="text-sm font-medium text-foreground mt-0.5">
              {stat.label}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {statSubs[i]}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-card rounded-2xl shadow-card p-6">
          <h2 className="font-bold text-foreground mb-1">Score Progression</h2>
          <p className="text-sm text-muted-foreground mb-5">
            Weekly score trend over the last 6 weeks
          </p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                <YAxis domain={[60, 100]} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  dot={{ fill: "#3b82f6", r: 4 }}
                  name="Score (%)"
                />
                <Line
                  type="monotone"
                  dataKey="hours"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ fill: "#22c55e", r: 3 }}
                  name="Study Hours"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card rounded-2xl shadow-card p-6">
          <h2 className="font-bold text-foreground mb-1">
            Study Time Distribution
          </h2>
          <p className="text-sm text-muted-foreground mb-4">Time per course</p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  dataKey="value"
                >
                  {pieData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={
                        CHART_COLORS[
                          pieData.indexOf(entry) % CHART_COLORS.length
                        ]
                      }
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [
                    `${Math.round(Number(value) / 60)}h`,
                    "Study Time",
                  ]}
                />
                <Legend iconType="circle" iconSize={8} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-2xl shadow-card p-6">
        <h2 className="font-bold text-foreground mb-6">Course Breakdown</h2>
        <div className="space-y-6">
          {mockPerformance.map((perf, i) => (
            <div
              key={perf.course}
              data-ocid={`performance.course.item.${i + 1}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div>
                  <h3 className="font-semibold text-foreground">
                    {perf.course}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />{" "}
                      {Math.round(Number(perf.studyTime) / 60)}h studied
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />{" "}
                      {perf.completedResources.length} resources
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    className={`${
                      Number(perf.score) >= 90
                        ? "bg-success/15 text-success"
                        : Number(perf.score) >= 75
                          ? "bg-primary/15 text-primary"
                          : "bg-star/15 text-star"
                    } border-0 font-bold text-base px-3 py-1`}
                  >
                    {Number(perf.score)}%
                  </Badge>
                  {Number(perf.score) >= 90 && (
                    <Award className="w-5 h-5 text-star" />
                  )}
                </div>
              </div>
              <Progress value={Number(perf.score)} className="h-3" />
              {i < mockPerformance.length - 1 && <Separator className="mt-6" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
