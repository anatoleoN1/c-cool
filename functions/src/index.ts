import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { HttpsError, onCall } from "firebase-functions/v2/https";

initializeApp();

type Role = "student" | "moderator" | "admin";
const roles: Role[] = ["student", "moderator", "admin"];

/** Admin-only role assignment. Custom claims and the profile mirror are updated atomically enough for Rules/UI. */
export const setUserRole = onCall(async (request) => {
  if (request.auth?.token.role !== "admin") {
    throw new HttpsError("permission-denied", "Réservé aux administrateurs.");
  }
  const { uid, role } = request.data as { uid?: string; role?: Role };
  if (!uid || !role || !roles.includes(role)) {
    throw new HttpsError("invalid-argument", "uid et rôle valides sont requis.");
  }
  await getAuth().setCustomUserClaims(uid, { role });
  await getFirestore().collection("users").doc(uid).set({
    role,
    updatedAt: FieldValue.serverTimestamp(),
    updatedBy: request.auth.uid,
  }, { merge: true });
  return { uid, role };
});
