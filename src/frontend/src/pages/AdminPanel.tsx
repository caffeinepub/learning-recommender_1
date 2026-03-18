import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Edit2, Plus, Save, Search, Shield, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { LearningResource } from "../backend.d";
import { mockResources, mockStudents } from "../data/mockData";
import {
  useAddResource,
  useDeleteResource,
  useEditResource,
  useGetAllResources,
} from "../hooks/useQueries";

const emptyResource: LearningResource = {
  title: "",
  description: "",
  resourceType: "video",
  category: "Mathematics",
  difficulty: BigInt(1),
  duration: BigInt(30),
  tags: [],
};

export default function AdminPanel() {
  const { data: backendResources, isLoading } = useGetAllResources();
  const { mutate: addResource, isPending: adding } = useAddResource();
  const { mutate: editResource, isPending: editing } = useEditResource();
  const { mutate: deleteResource, isPending: deleting } = useDeleteResource();

  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState<LearningResource>(emptyResource);
  const [tagsInput, setTagsInput] = useState("");

  const allResources =
    backendResources && backendResources.length > 0
      ? backendResources.map((r, i) => ({ ...r, id: `br-${i}` }))
      : mockResources;

  const filteredResources = allResources.filter(
    (r) =>
      !search ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase()),
  );

  const openAdd = () => {
    setForm(emptyResource);
    setTagsInput("");
    setAddOpen(true);
  };
  const openEdit = (id: string, resource: LearningResource) => {
    setEditingId(id);
    setForm({ ...resource });
    setTagsInput(resource.tags.join(", "));
    setEditOpen(true);
  };
  const openDelete = (id: string) => {
    setDeletingId(id);
    setDeleteOpen(true);
  };

  const handleAdd = () => {
    const id = `res-${Date.now()}`;
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    addResource(
      { id, resource: { ...form, tags } },
      {
        onSuccess: () => {
          toast.success("Resource added!");
          setAddOpen(false);
        },
        onError: (e) => toast.error(e.message),
      },
    );
  };

  const handleEdit = () => {
    if (!editingId) return;
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    editResource(
      { id: editingId, resource: { ...form, tags } },
      {
        onSuccess: () => {
          toast.success("Resource updated!");
          setEditOpen(false);
        },
        onError: (e) => toast.error(e.message),
      },
    );
  };

  const handleDelete = () => {
    if (!deletingId) return;
    deleteResource(deletingId, {
      onSuccess: () => {
        toast.success("Resource deleted");
        setDeleteOpen(false);
        setDeletingId(null);
      },
      onError: (e) => toast.error(e.message),
    });
  };

  const resourceFormFields = (
    <div className="space-y-4 py-2">
      <div>
        <Label htmlFor="form-title">Title</Label>
        <Input
          id="form-title"
          value={form.title}
          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          data-ocid="resource_form.title.input"
          className="mt-1"
          placeholder="Resource title"
        />
      </div>
      <div>
        <Label htmlFor="form-desc">Description</Label>
        <Textarea
          id="form-desc"
          value={form.description}
          onChange={(e) =>
            setForm((p) => ({ ...p, description: e.target.value }))
          }
          data-ocid="resource_form.description.textarea"
          className="mt-1"
          rows={3}
          placeholder="Brief description\u2026"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Type</Label>
          <Select
            value={form.resourceType}
            onValueChange={(v) => setForm((p) => ({ ...p, resourceType: v }))}
          >
            <SelectTrigger
              className="mt-1"
              data-ocid="resource_form.type.select"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["video", "course", "article", "reading", "interactive"].map(
                (t) => (
                  <SelectItem key={t} value={t} className="capitalize">
                    {t}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Category</Label>
          <Select
            value={form.category}
            onValueChange={(v) => setForm((p) => ({ ...p, category: v }))}
          >
            <SelectTrigger
              className="mt-1"
              data-ocid="resource_form.category.select"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[
                "Mathematics",
                "Computer Science",
                "Physics",
                "Chemistry",
                "History",
              ].map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Difficulty (1-4)</Label>
          <Input
            type="number"
            min={1}
            max={4}
            value={Number(form.difficulty)}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                difficulty: BigInt(e.target.value || 1),
              }))
            }
            data-ocid="resource_form.difficulty.input"
            className="mt-1"
          />
        </div>
        <div>
          <Label>Duration (minutes)</Label>
          <Input
            type="number"
            min={1}
            value={Number(form.duration)}
            onChange={(e) =>
              setForm((p) => ({ ...p, duration: BigInt(e.target.value || 1) }))
            }
            data-ocid="resource_form.duration.input"
            className="mt-1"
          />
        </div>
      </div>
      <div>
        <Label>Tags (comma separated)</Label>
        <Input
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          data-ocid="resource_form.tags.input"
          className="mt-1"
          placeholder="calculus, math, integration"
        />
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-7 h-7 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">
            Admin Management
          </h1>
        </div>
        <p className="text-muted-foreground">
          Manage learning resources and student accounts
        </p>
      </motion.div>

      <Tabs defaultValue="resources">
        <TabsList className="mb-6">
          <TabsTrigger value="resources" data-ocid="admin.resources.tab">
            Resources
          </TabsTrigger>
          <TabsTrigger value="students" data-ocid="admin.students.tab">
            Students
          </TabsTrigger>
        </TabsList>

        <TabsContent value="resources">
          <div className="bg-card rounded-2xl shadow-card overflow-hidden">
            <div className="p-5 flex items-center justify-between gap-4 border-b border-border">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search resources\u2026"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  data-ocid="admin.search_input"
                  className="pl-9"
                />
              </div>
              <Dialog open={addOpen} onOpenChange={setAddOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={openAdd}
                    data-ocid="admin.add_resource.open_modal_button"
                    className="gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add Resource
                  </Button>
                </DialogTrigger>
                <DialogContent
                  className="max-w-lg"
                  data-ocid="admin.add_resource.dialog"
                >
                  <DialogHeader>
                    <DialogTitle>Add New Resource</DialogTitle>
                    <DialogDescription>
                      Fill in the details to add a new learning resource.
                    </DialogDescription>
                  </DialogHeader>
                  {resourceFormFields}
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setAddOpen(false)}
                      data-ocid="admin.add_resource.cancel.button"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAdd}
                      disabled={adding}
                      data-ocid="admin.add_resource.submit.button"
                    >
                      {adding ? "Adding\u2026" : "Add Resource"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {isLoading ? (
              <div
                className="p-6 space-y-3"
                data-ocid="admin.resources.loading_state"
              >
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12" />
                ))}
              </div>
            ) : (
              <Table data-ocid="admin.resources.table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResources.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-10 text-muted-foreground"
                        data-ocid="admin.resources.empty_state"
                      >
                        No resources found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredResources.map((res, i) => (
                      <TableRow
                        key={res.id}
                        data-ocid={`admin.resources.row.${i + 1}`}
                      >
                        <TableCell className="font-medium max-w-xs">
                          <div className="truncate">{res.title}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{res.category}</Badge>
                        </TableCell>
                        <TableCell className="capitalize text-sm text-muted-foreground">
                          {res.resourceType}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {["Beginner", "Intermediate", "Advanced", "Expert"][
                              Number(res.difficulty) - 1
                            ] || "\u2014"}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {Number(res.duration)}m
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Dialog
                              open={editOpen && editingId === res.id}
                              onOpenChange={(open) => {
                                if (!open) setEditOpen(false);
                              }}
                            >
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openEdit(res.id, res)}
                                  data-ocid={`admin.resources.edit.button.${i + 1}`}
                                >
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent
                                className="max-w-lg"
                                data-ocid="admin.edit_resource.dialog"
                              >
                                <DialogHeader>
                                  <DialogTitle>Edit Resource</DialogTitle>
                                  <DialogDescription>
                                    Update the details of this learning
                                    resource.
                                  </DialogDescription>
                                </DialogHeader>
                                {resourceFormFields}
                                <DialogFooter>
                                  <Button
                                    variant="outline"
                                    onClick={() => setEditOpen(false)}
                                    data-ocid="admin.edit_resource.cancel.button"
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    onClick={handleEdit}
                                    disabled={editing}
                                    data-ocid="admin.edit_resource.save.button"
                                  >
                                    <Save className="w-4 h-4 mr-1" />
                                    {editing ? "Saving\u2026" : "Save Changes"}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            <Dialog
                              open={deleteOpen && deletingId === res.id}
                              onOpenChange={(open) => {
                                if (!open) setDeleteOpen(false);
                              }}
                            >
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openDelete(res.id)}
                                  data-ocid={`admin.resources.delete.button.${i + 1}`}
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent data-ocid="admin.delete_resource.dialog">
                                <DialogHeader>
                                  <DialogTitle>Delete Resource</DialogTitle>
                                  <DialogDescription>
                                    Are you sure you want to delete{" "}
                                    <strong>{res.title}</strong>? This action
                                    cannot be undone.
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                  <Button
                                    variant="outline"
                                    onClick={() => setDeleteOpen(false)}
                                    data-ocid="admin.delete_resource.cancel.button"
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    onClick={handleDelete}
                                    disabled={deleting}
                                    data-ocid="admin.delete_resource.confirm.button"
                                  >
                                    {deleting ? "Deleting\u2026" : "Delete"}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </TabsContent>

        <TabsContent value="students">
          <div className="bg-card rounded-2xl shadow-card overflow-hidden">
            <div className="p-5 border-b border-border">
              <h2 className="font-semibold text-foreground">
                Enrolled Students
              </h2>
              <p className="text-sm text-muted-foreground">
                {mockStudents.length} students registered
              </p>
            </div>
            <Table data-ocid="admin.students.table">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Active Courses</TableHead>
                  <TableHead>Learning Style</TableHead>
                  <TableHead>Avg Score</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockStudents.map((student, i) => (
                  <TableRow
                    key={student.name}
                    data-ocid={`admin.students.row.${i + 1}`}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                          {student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <span className="font-medium">{student.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{student.courses}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{student.style}</Badge>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`font-bold ${
                          student.score >= 90
                            ? "text-success"
                            : student.score >= 75
                              ? "text-primary"
                              : "text-star"
                        }`}
                      >
                        {student.score}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-success/15 text-success border-0">
                        Active
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
