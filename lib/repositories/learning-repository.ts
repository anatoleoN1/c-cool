"use client";

import { collection, getDocs, query, where } from "firebase/firestore";
import type { Assessment, Chapter, Course, Homework, Subject } from "@/types";
import { getFirebaseClient } from "@/lib/firebase/client";
import { FirestoreRepository } from "./base";

async function published<T>(path: string): Promise<T[]> {
  const services = getFirebaseClient();
  if (!services) throw new Error("Firebase n'est pas configuré.");
  const snapshot = await getDocs(
    query(collection(services.db, path), where("published", "==", true)),
  );
  return snapshot.docs.map((item) => item.data() as T);
}

export class SubjectRepository extends FirestoreRepository<Subject> {
  constructor(schoolId: string) { super(`schools/${schoolId}/subjects`); }

  listPublished(): Promise<Subject[]> {
    return published<Subject>(this.path);
  }
}

export class ChapterRepository extends FirestoreRepository<Chapter> {
  constructor(schoolId: string) { super(`schools/${schoolId}/chapters`); }

  listPublished(): Promise<Chapter[]> {
    return published<Chapter>(this.path).then((items) =>
      items.sort((a, b) => a.order - b.order),
    );
  }

  listPublishedForSubject(subjectId: string): Promise<Chapter[]> {
    return published<Chapter>(this.path).then((items) =>
      items.filter((item) => item.subjectId === subjectId).sort((a, b) => a.order - b.order),
    );
  }
}

export class CourseRepository extends FirestoreRepository<Course> {
  constructor(schoolId: string) { super(`schools/${schoolId}/officialCourses`); }

  listPublished(): Promise<Course[]> {
    return published<Course>(this.path);
  }
}

export class HomeworkRepository extends FirestoreRepository<Homework> {
  constructor(schoolId: string) { super(`schools/${schoolId}/officialHomework`); }
}

export class AssessmentRepository extends FirestoreRepository<Assessment> {
  constructor(schoolId: string) { super(`schools/${schoolId}/officialAssessments`); }

  listPublished(): Promise<Assessment[]> {
    return published<Assessment>(this.path).then((items) =>
      items.sort((a, b) => a.date.localeCompare(b.date)),
    );
  }
}

export class ExerciseRepository extends FirestoreRepository<import("@/types").Exercise> {
  constructor(schoolId: string) { super(`schools/${schoolId}/officialExercises`); }

  listPublished(): Promise<import("@/types").Exercise[]> {
    return published<import("@/types").Exercise>(this.path);
  }
}
