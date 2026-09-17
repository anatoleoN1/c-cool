"use client";

import type { Assessment, Chapter, Course, Homework, Subject } from "@/types";
import { FirestoreRepository } from "./base";

export class SubjectRepository extends FirestoreRepository<Subject> {
  constructor(schoolId: string) { super(`schools/${schoolId}/subjects`); }
}
export class ChapterRepository extends FirestoreRepository<Chapter> {
  constructor(schoolId: string) { super(`schools/${schoolId}/chapters`); }
}
export class CourseRepository extends FirestoreRepository<Course> {
  constructor(schoolId: string) { super(`schools/${schoolId}/officialCourses`); }
}
export class HomeworkRepository extends FirestoreRepository<Homework> {
  constructor(schoolId: string) { super(`schools/${schoolId}/officialHomework`); }
}
export class AssessmentRepository extends FirestoreRepository<Assessment> {
  constructor(schoolId: string) { super(`schools/${schoolId}/officialAssessments`); }
}
