"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUserRole = void 0;
const app_1 = require("firebase-admin/app");
const auth_1 = require("firebase-admin/auth");
const firestore_1 = require("firebase-admin/firestore");
const https_1 = require("firebase-functions/v2/https");
(0, app_1.initializeApp)();
const roles = ["student", "moderator", "admin"];
/** Admin-only role assignment. Custom claims and the profile mirror are updated atomically enough for Rules/UI. */
exports.setUserRole = (0, https_1.onCall)(async (request) => {
    if (request.auth?.token.role !== "admin") {
        throw new https_1.HttpsError("permission-denied", "Réservé aux administrateurs.");
    }
    const { uid, role } = request.data;
    if (!uid || !role || !roles.includes(role)) {
        throw new https_1.HttpsError("invalid-argument", "uid et rôle valides sont requis.");
    }
    await (0, auth_1.getAuth)().setCustomUserClaims(uid, { role });
    await (0, firestore_1.getFirestore)().collection("users").doc(uid).set({
        role,
        updatedAt: firestore_1.FieldValue.serverTimestamp(),
        updatedBy: request.auth.uid,
    }, { merge: true });
    return { uid, role };
});
