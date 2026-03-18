import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface PerformanceRecord {
    completedResources: Array<string>;
    score: bigint;
    studyTime: bigint;
    course: string;
}
export interface StudentProfile {
    learningStyle: LearningPreferences;
    currentCourses: Array<string>;
    interests: Array<string>;
    completedCourses: Array<string>;
    name: string;
}
export interface LearningPreferences {
    kinesthetic: boolean;
    auditory: boolean;
    readingWriting: boolean;
    visual: boolean;
}
export interface LearningResource {
    title: string;
    duration: bigint;
    difficulty: bigint;
    tags: Array<string>;
    description: string;
    resourceType: string;
    category: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addResource(id: string, resource: LearningResource): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteResource(id: string): Promise<void>;
    editResource(id: string, resource: LearningResource): Promise<void>;
    getAllResources(): Promise<Array<LearningResource>>;
    getCallerUserProfile(): Promise<StudentProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getPerformance(user: Principal): Promise<Array<PerformanceRecord>>;
    getRecommendations(): Promise<Array<LearningResource>>;
    getUserProfile(user: Principal): Promise<StudentProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: StudentProfile): Promise<void>;
    updatePerformance(course: string, studyTime: bigint, score: bigint, completedResources: Array<string>): Promise<void>;
}
