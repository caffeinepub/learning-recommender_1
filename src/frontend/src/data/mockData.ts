import type {
  LearningResource,
  PerformanceRecord,
  StudentProfile,
} from "../backend.d";

export const mockResources: (LearningResource & {
  id: string;
  image: string;
  rating: number;
})[] = [
  {
    id: "r1",
    title: "Calculus II: Integration Techniques",
    description:
      "Master advanced integration methods including integration by parts, trigonometric substitution, and partial fractions with step-by-step examples.",
    resourceType: "video",
    category: "Mathematics",
    difficulty: BigInt(3),
    duration: BigInt(85),
    tags: ["calculus", "integration", "mathematics"],
    image: "/assets/generated/resource-calculus.dim_400x250.jpg",
    rating: 4.8,
  },
  {
    id: "r2",
    title: "Python for Data Science: Complete Guide",
    description:
      "Comprehensive Python programming course covering NumPy, Pandas, Matplotlib, and scikit-learn for real-world data analysis projects.",
    resourceType: "course",
    category: "Computer Science",
    difficulty: BigInt(2),
    duration: BigInt(240),
    tags: ["python", "data science", "programming"],
    image: "/assets/generated/resource-python.dim_400x250.jpg",
    rating: 4.9,
  },
  {
    id: "r3",
    title: "Linear Algebra Fundamentals",
    description:
      "A clear and thorough introduction to vectors, matrices, eigenvalues, and linear transformations with visual intuition.",
    resourceType: "article",
    category: "Mathematics",
    difficulty: BigInt(2),
    duration: BigInt(45),
    tags: ["linear algebra", "matrices", "mathematics"],
    image: "/assets/generated/resource-algebra.dim_400x250.jpg",
    rating: 4.7,
  },
  {
    id: "r4",
    title: "World History: Ancient Civilizations",
    description:
      "Explore the rise and fall of ancient empires from Mesopotamia and Egypt to Greece and Rome, with primary source analysis.",
    resourceType: "reading",
    category: "History",
    difficulty: BigInt(1),
    duration: BigInt(60),
    tags: ["history", "civilizations", "ancient"],
    image: "/assets/generated/resource-history.dim_400x250.jpg",
    rating: 4.5,
  },
  {
    id: "r5",
    title: "Physics: Electromagnetism Explained",
    description:
      "In-depth coverage of Maxwell's equations, electromagnetic waves, and their applications in modern technology.",
    resourceType: "video",
    category: "Physics",
    difficulty: BigInt(3),
    duration: BigInt(110),
    tags: ["physics", "electromagnetism", "waves"],
    image: "/assets/generated/resource-physics.dim_400x250.jpg",
    rating: 4.6,
  },
  {
    id: "r6",
    title: "Organic Chemistry: Reaction Mechanisms",
    description:
      "Learn nucleophilic substitution, elimination reactions, and aromatic chemistry through interactive 3D molecule visualization.",
    resourceType: "interactive",
    category: "Chemistry",
    difficulty: BigInt(4),
    duration: BigInt(120),
    tags: ["chemistry", "organic", "reactions"],
    image: "/assets/generated/resource-calculus.dim_400x250.jpg",
    rating: 4.4,
  },
];

export const mockProfile: StudentProfile = {
  name: "Alex Thompson",
  currentCourses: ["Calculus II", "Python Programming", "World History"],
  completedCourses: [
    "Calculus I",
    "Introduction to Programming",
    "Ancient History",
  ],
  interests: ["Mathematics", "Computer Science", "Physics"],
  learningStyle: {
    visual: true,
    auditory: false,
    readingWriting: true,
    kinesthetic: false,
  },
};

export const mockPerformance: PerformanceRecord[] = [
  {
    course: "Calculus II",
    studyTime: BigInt(1240),
    score: BigInt(88),
    completedResources: ["r1", "r3"],
  },
  {
    course: "Python Programming",
    studyTime: BigInt(980),
    score: BigInt(94),
    completedResources: ["r2"],
  },
  {
    course: "World History",
    studyTime: BigInt(640),
    score: BigInt(79),
    completedResources: ["r4"],
  },
];

export const mockStudents = [
  { name: "Alex Thompson", courses: 3, score: 88, style: "Visual" },
  { name: "Maria Garcia", courses: 4, score: 92, style: "Auditory" },
  { name: "James Wilson", courses: 2, score: 75, style: "Kinesthetic" },
  { name: "Sophie Chen", courses: 5, score: 96, style: "Reading/Writing" },
  { name: "Daniel Park", courses: 3, score: 82, style: "Visual" },
];
