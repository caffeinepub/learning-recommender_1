import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  LearningResource,
  PerformanceRecord,
  StudentProfile,
  UserRole,
} from "../backend.d";
import { useActor } from "./useActor";

export function useGetAllResources() {
  const { actor, isFetching } = useActor();
  return useQuery<LearningResource[]>({
    queryKey: ["resources"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllResources();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetRecommendations() {
  const { actor, isFetching } = useActor();
  return useQuery<LearningResource[]>({
    queryKey: ["recommendations"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRecommendations();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCallerProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<StudentProfile | null>({
    queryKey: ["callerProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCallerRole() {
  const { actor, isFetching } = useActor();
  return useQuery<UserRole>({
    queryKey: ["callerRole"],
    queryFn: async () => {
      if (!actor) return "guest" as UserRole;
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: StudentProfile) => {
      if (!actor) throw new Error("Not connected");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["callerProfile"] });
    },
  });
}

export function useAddResource() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      resource,
    }: { id: string; resource: LearningResource }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addResource(id, resource);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["resources"] });
    },
  });
}

export function useEditResource() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      resource,
    }: { id: string; resource: LearningResource }) => {
      if (!actor) throw new Error("Not connected");
      return actor.editResource(id, resource);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["resources"] });
      qc.invalidateQueries({ queryKey: ["recommendations"] });
    },
  });
}

export function useDeleteResource() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteResource(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["resources"] });
    },
  });
}

export function useUpdatePerformance() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      course,
      studyTime,
      score,
      completedResources,
    }: PerformanceRecord) => {
      if (!actor) throw new Error("Not connected");
      return actor.updatePerformance(
        course,
        studyTime,
        score,
        completedResources,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["performance"] });
    },
  });
}
