import Map "mo:core/Map";
import Text "mo:core/Text";
import List "mo:core/List";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Custom Types
  type LearningPreferences = {
    visual : Bool;
    auditory : Bool;
    kinesthetic : Bool;
    readingWriting : Bool;
  };

  type StudentProfile = {
    name : Text;
    learningStyle : LearningPreferences;
    currentCourses : [Text];
    completedCourses : [Text];
    interests : [Text];
  };

  type LearningResource = {
    title : Text;
    description : Text;
    category : Text;
    difficulty : Nat; // 1-5 scale
    resourceType : Text;
    duration : Nat; // in minutes
    tags : [Text];
  };

  type PerformanceRecord = {
    course : Text;
    studyTime : Nat; // in minutes
    score : Nat; // 0-100
    completedResources : [Text];
  };

  // State
  let studentProfiles = Map.empty<Principal, StudentProfile>();
  let learningResources = Map.empty<Text, LearningResource>();
  let performanceRecords = Map.empty<Principal, Map.Map<Text, PerformanceRecord>>();
  let accessControlState = AccessControl.initState();

  include MixinAuthorization(accessControlState);

  // Student Profile Methods
  public query ({ caller }) func getCallerUserProfile() : async ?StudentProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    studentProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?StudentProfile {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can view other profiles");
    };
    studentProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : StudentProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    studentProfiles.add(caller, profile);
  };

  // Learning Resources Management
  public shared ({ caller }) func addResource(id : Text, resource : LearningResource) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can add resources");
    };
    learningResources.add(id, resource);
  };

  public shared ({ caller }) func editResource(id : Text, resource : LearningResource) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can edit resources");
    };
    if (not learningResources.containsKey(id)) {
      Runtime.trap("Resource does not exist");
    };
    learningResources.add(id, resource);
  };

  public shared ({ caller }) func deleteResource(id : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can delete resources");
    };
    if (not learningResources.containsKey(id)) {
      Runtime.trap("Resource does not exist");
    };
    learningResources.remove(id);
  };

  public query ({ caller }) func getAllResources() : async [LearningResource] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view resources");
    };
    learningResources.values().toArray();
  };

  // Performance Tracking
  public shared ({ caller }) func updatePerformance(course : Text, studyTime : Nat, score : Nat, completedResources : [Text]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update performance");
    };

    let userPerf = switch (performanceRecords.get(caller)) {
      case (null) { Map.empty<Text, PerformanceRecord>() };
      case (?perf) { perf };
    };

    let record : PerformanceRecord = {
      course;
      studyTime;
      score;
      completedResources;
    };

    userPerf.add(course, record);
    performanceRecords.add(caller, userPerf);
  };

  public query ({ caller }) func getPerformance(user : Principal) : async [PerformanceRecord] {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own performance or be an admin");
    };
    switch (performanceRecords.get(user)) {
      case (null) { Runtime.trap("No performance records found") };
      case (?records) { records.values().toArray() };
    };
  };

  // Recommendations
  public query ({ caller }) func getRecommendations() : async [LearningResource] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get recommendations");
    };

    switch (studentProfiles.get(caller)) {
      case (null) { Runtime.trap("User profile not found") };
      case (?profile) {
        let courseSet = List.fromArray(profile.currentCourses);
        let filteredResources = List.empty<LearningResource>();

        for ((_, resource) in learningResources.entries()) {
          if (courseSet.any(func(course) { Text.equal(resource.category, course) })) {
            filteredResources.add(resource);
          };
        };
        filteredResources.toArray();
      };
    };
  };
};
