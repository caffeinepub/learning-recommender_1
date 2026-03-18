import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  BookOpen,
  CheckCircle,
  Edit2,
  GraduationCap,
  Plus,
  Save,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { StudentProfile } from "../backend.d";
import { mockProfile } from "../data/mockData";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetCallerProfile, useSaveProfile } from "../hooks/useQueries";

export default function StudentProfilePage() {
  const { data: backendProfile, isLoading } = useGetCallerProfile();
  const { mutate: saveProfile, isPending: saving } = useSaveProfile();
  const { identity, login } = useInternetIdentity();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<StudentProfile>(mockProfile);
  const [newCourse, setNewCourse] = useState("");
  const [newInterest, setNewInterest] = useState("");

  useEffect(() => {
    setForm(backendProfile || mockProfile);
  }, [backendProfile]);

  const handleSave = () => {
    if (!identity) {
      toast.error("Please sign in to save your profile");
      return;
    }
    saveProfile(form, {
      onSuccess: () => {
        toast.success("Profile saved successfully!");
        setEditing(false);
      },
      onError: (e) => toast.error(e.message),
    });
  };

  const handleCancel = () => {
    setForm(backendProfile || mockProfile);
    setEditing(false);
  };

  const addCourse = () => {
    if (newCourse.trim() && !form.currentCourses.includes(newCourse.trim())) {
      setForm((prev) => ({
        ...prev,
        currentCourses: [...prev.currentCourses, newCourse.trim()],
      }));
      setNewCourse("");
    }
  };

  const removeCourse = (course: string) => {
    setForm((prev) => ({
      ...prev,
      currentCourses: prev.currentCourses.filter((c) => c !== course),
    }));
  };

  const addInterest = () => {
    if (newInterest.trim() && !form.interests.includes(newInterest.trim())) {
      setForm((prev) => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()],
      }));
      setNewInterest("");
    }
  };

  const removeInterest = (interest: string) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.filter((i) => i !== interest),
    }));
  };

  const learningStyles = [
    {
      key: "visual" as const,
      label: "Visual",
      desc: "Learn through diagrams and charts",
    },
    {
      key: "auditory" as const,
      label: "Auditory",
      desc: "Learn through listening",
    },
    {
      key: "readingWriting" as const,
      label: "Reading/Writing",
      desc: "Learn through text",
    },
    {
      key: "kinesthetic" as const,
      label: "Kinesthetic",
      desc: "Learn by doing",
    },
  ];

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <Skeleton
          className="h-10 w-64 mb-8"
          data-ocid="profile.loading_state"
        />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Student Profile
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your learning preferences and academic journey
            </p>
          </div>
          {!editing ? (
            <Button
              onClick={() => setEditing(true)}
              data-ocid="profile.edit.button"
              className="gap-2"
            >
              <Edit2 className="w-4 h-4" /> Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleCancel}
                data-ocid="profile.cancel.button"
                disabled={saving}
              >
                <X className="w-4 h-4 mr-1" /> Cancel
              </Button>
              <Button
                onClick={handleSave}
                data-ocid="profile.save.button"
                disabled={saving}
              >
                <Save className="w-4 h-4 mr-1" />
                {saving ? "Saving\u2026" : "Save Changes"}
              </Button>
            </div>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-2xl shadow-card p-6">
            <h2 className="font-bold text-foreground mb-5 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-primary" /> Personal Info
            </h2>
            <div>
              <Label
                htmlFor="name"
                className="text-sm font-medium mb-1.5 block"
              >
                Full Name
              </Label>
              {editing ? (
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  data-ocid="profile.name.input"
                  className="rounded-lg"
                />
              ) : (
                <p className="text-foreground font-semibold text-lg">
                  {form.name}
                </p>
              )}
            </div>
          </div>

          <div className="bg-card rounded-2xl shadow-card p-6">
            <h2 className="font-bold text-foreground mb-5 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" /> Current Courses
            </h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {form.currentCourses.map((course) => (
                <Badge
                  key={course}
                  variant="secondary"
                  className="text-sm px-3 py-1.5 gap-1.5"
                >
                  {course}
                  {editing && (
                    <button
                      onClick={() => removeCourse(course)}
                      className="ml-1 text-muted-foreground hover:text-destructive"
                      type="button"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>
            {editing && (
              <div className="flex gap-2">
                <Input
                  placeholder="Add a course\u2026"
                  value={newCourse}
                  onChange={(e) => setNewCourse(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addCourse()}
                  data-ocid="profile.add_course.input"
                  className="rounded-lg"
                />
                <Button
                  onClick={addCourse}
                  size="sm"
                  data-ocid="profile.add_course.button"
                  variant="outline"
                  type="button"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="bg-card rounded-2xl shadow-card p-6">
            <h2 className="font-bold text-foreground mb-5">
              Interests &amp; Topics
            </h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {form.interests.map((interest) => (
                <Badge
                  key={interest}
                  className="bg-primary/10 text-primary border-0 text-sm px-3 py-1.5 gap-1.5"
                >
                  {interest}
                  {editing && (
                    <button
                      onClick={() => removeInterest(interest)}
                      className="ml-1 text-primary/50 hover:text-destructive"
                      type="button"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>
            {editing && (
              <div className="flex gap-2">
                <Input
                  placeholder="Add an interest\u2026"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addInterest()}
                  data-ocid="profile.add_interest.input"
                  className="rounded-lg"
                />
                <Button
                  onClick={addInterest}
                  size="sm"
                  data-ocid="profile.add_interest.button"
                  variant="outline"
                  type="button"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card rounded-2xl shadow-card p-6">
            <h2 className="font-bold text-foreground mb-5">Learning Style</h2>
            <div className="space-y-4">
              {learningStyles.map((style) => (
                <div
                  key={style.key}
                  className="flex items-center justify-between"
                  data-ocid={`profile.${style.key}.switch`}
                >
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      {style.label}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {style.desc}
                    </div>
                  </div>
                  <Switch
                    checked={form.learningStyle[style.key]}
                    disabled={!editing}
                    onCheckedChange={(checked) =>
                      setForm((prev) => ({
                        ...prev,
                        learningStyle: {
                          ...prev.learningStyle,
                          [style.key]: checked,
                        },
                      }))
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-2xl shadow-card p-6">
            <h2 className="font-bold text-foreground mb-5 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" /> Completed Courses
            </h2>
            <div className="space-y-2">
              {form.completedCourses.map((course) => (
                <div key={course} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                  <span className="text-foreground">{course}</span>
                </div>
              ))}
            </div>
          </div>

          {!identity && (
            <div className="bg-primary/5 rounded-2xl p-5 text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Sign in to save your profile permanently
              </p>
              <Button
                onClick={login}
                size="sm"
                data-ocid="profile.signin.button"
                className="w-full"
              >
                Sign In
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
