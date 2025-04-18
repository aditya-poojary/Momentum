import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  Timestamp,
  query,
  orderBy,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";

/**
 * Create or fetch a user document in the Firestore database.
 * @param {(string|Object)} user - Either an email string or user object containing email
 * @returns {Promise<void>} - A promise that resolves when the operation is complete.
 */
export const createOrFetchUserDocument = async (user) => {
  let email;

  // Handle different types of input
  if (typeof user === "string") {
    email = user;
  } else if (typeof user === "object" && user !== null) {
    email = user.email;
  }

  if (!email) {
    throw new Error("Email is required to create or fetch user document.");
  }

  try {
    const userDocRef = doc(db, "users", email);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      // Create a new document with basic user info
      await setDoc(userDocRef, {
        email: email,
        createdAt: Timestamp.now(),
        ...(user.displayName && { displayName: user.displayName }),
        ...(user.photoURL && { photoURL: user.photoURL }),
        ...(user.uid && { uid: user.uid }),
      });
      console.log("New user document created for:", email);
    } else {
      console.log("Existing user document found for:", email);
    }
  } catch (error) {
    console.error("Error creating or fetching user document:", error);
    throw error; // Re-throw to handle in the calling function
  }
};

/**
 * Adds a project to the user's "Projects" collection with an auto-generated ID.
 * @param {string} email - The email of the logged-in user.
 * @param {Object} projectData - The data of the project to be added.
 * @returns {Promise<boolean>} - Returns `true` if a project with the same data exists, otherwise `false`.
 */
export const addProjectToUserCollection = async (email, projectData) => {
  if (!email) throw new Error("Email is required to add a project.");
  if (!projectData || !projectData.projectName)
    throw new Error("Invalid project data.");

  try {
    const userDocRef = doc(db, "users", email); // Reference to the user document
    const projectCollectionRef = collection(userDocRef, "Projects"); // Reference to the "Projects" collection

    // Fetch all existing projects
    const snapshot = await getDocs(projectCollectionRef);
    const allProjects = snapshot.docs.map((doc) => doc.data());

    // Check if a project with the same name already exists
    const existingProject = allProjects.find(
      (project) => project.projectName === projectData.projectName
    );

    if (existingProject) {
      return true; // Project already exists
    } else {
      // Add new project with auto-generated ID
      await addDoc(projectCollectionRef, projectData);
      console.log("New project added to the Projects collection.");
      return false;
    }
  } catch (error) {
    console.error("Error adding project to Projects collection:", error);
  }
};

export const handleDeleteProject = async (project) => {
  try {
    const projectRef = doc(db, "users", userEmail, "Projects", project.id);
    const trashBinRef = collection(db, "users", userEmail, "Trash Bin");

    // Add the deleted project's data to the Trash Bin collection
    await setDoc(doc(trashBinRef, project.id), project);

    // Delete the project from the Projects collection
    await deleteDoc(projectRef);

    // Update state to reflect changes
    setProjects(projects.filter((p) => p.id !== project.id));
    setFilteredProjects(filteredProjects.filter((p) => p.id !== project.id));

    console.log("Project moved to Trash Bin successfully.");
  } catch (error) {
    console.error("Error moving project to Trash Bin:", error);
  }
};

/**
 * Moves a project to the TrashBin collection.
 * @param {string} email - The email of the logged-in user.
 * @param {Object} project - The project data to move to TrashBin.
 * @returns {Promise<void>}
 */
export const moveToTrashBin = async (email, project, onSuccess) => {
  if (!email) throw new Error("Email is required to move project to TrashBin.");
  if (!project || !project.id)
    throw new Error("Invalid project data for TrashBin.");

  try {
    const projectRef = doc(db, "users", email, "Projects", project.id); // Reference to the project in Projects
    const trashBinRef = doc(db, "users", email, "TrashBin", project.id); // Reference to the project in TrashBin

    // Add project data to TrashBin with a deletedAt field
    await setDoc(trashBinRef, {
      ...project,
      deletedAt: Timestamp.now(), // Add timestamp to track deletion
    });

    // Delete the project from Projects collection
    await deleteDoc(projectRef);

    console.log("Project successfully moved to TrashBin.");

    // Call the onSuccess callback if provided
    if (typeof onSuccess === "function") {
      onSuccess();
    }
  } catch (error) {
    console.error("Error moving project to TrashBin:", error);
  }
};

/**
 * Deletes projects older than 30 days from the TrashBin collection.
 * @param {string} email - The email of the logged-in user.
 * @returns {Promise<void>}
 */
export const deleteOldTrashBinProjects = async (email) => {
  if (!email)
    throw new Error("Email is required to delete old TrashBin projects.");

  try {
    const trashBinCollectionRef = collection(db, "users", email, "TrashBin"); // Reference to the TrashBin collection
    const snapshot = await getDocs(trashBinCollectionRef);

    const now = Timestamp.now();
    const thirtyDaysInSeconds = 30 * 24 * 60 * 60; // 30 days in seconds

    snapshot.forEach(async (doc) => {
      const project = doc.data();
      const deletedAt = project.deletedAt;

      if (deletedAt && now.seconds - deletedAt.seconds > thirtyDaysInSeconds) {
        // Delete project if older than 30 days
        await deleteDoc(doc.ref);
        console.log(`Deleted old project from TrashBin: ${project.id}`);
      }
    });
  } catch (error) {
    console.error("Error deleting old projects from TrashBin:", error);
  }
};
/**
 * Restores a project from the TrashBin to the Projects collection.
 * The "deletedAt" field is removed while restoring.
 * @param {string} email - The user's email address.
 * @param {string} projectId - The ID of the project to restore.
 * @returns {Promise<void>}
 */
export const restoreProjectToProjects = async (email, projectId) => {
  if (!email || !projectId)
    throw new Error("Email and projectId are required to restore the project.");

  try {
    // Reference to the TrashBin document
    const trashBinRef = doc(db, "users", email, "TrashBin", projectId);
    const projectsRef = doc(db, "users", email, "Projects", projectId); // Reference to the Projects collection

    // Fetch the document from TrashBin
    const trashDocSnap = await getDoc(trashBinRef);

    if (trashDocSnap.exists()) {
      const projectData = trashDocSnap.data();

      // Remove the "deletedAt" field
      const { deletedAt, ...restoredProjectData } = projectData;

      // Write the restored project data to the Projects collection
      await setDoc(projectsRef, restoredProjectData);

      console.log(
        `Project ${projectId} successfully restored to Projects collection.`
      );
    } else {
      throw new Error("Project not found in TrashBin.");
    }
  } catch (error) {
    console.error("Error restoring project to Projects collection:", error);
  }
};

/**
 * Deletes a project from the TrashBin collection after restoration.
 * @param {string} email - The user's email address.
 * @param {string} projectId - The ID of the project to delete.
 * @returns {Promise<void>}
 */
export const deleteProjectFromTrashBin = async (email, projectId) => {
  if (!email || !projectId)
    throw new Error("Email and projectId are required to delete the project.");

  try {
    // Reference to the project in the TrashBin collection
    const trashBinRef = doc(db, "users", email, "TrashBin", projectId);

    // Delete the document from the TrashBin
    await deleteDoc(trashBinRef);

    console.log(`Project ${projectId} successfully deleted from TrashBin.`);
  } catch (error) {
    console.error("Error deleting project from TrashBin:", error);
  }
};

/**
 * Combines the restoration process: add to Projects and delete from TrashBin.
 * @param {string} email - The user's email address.
 * @param {string} projectId - The ID of the project to restore.
 * @returns {Promise<void>}
 */
export const restoreAndCleanupProject = async (email, projectId) => {
  try {
    await restoreProjectToProjects(email, projectId); // Restore project
    await deleteProjectFromTrashBin(email, projectId); // Delete from TrashBin
    console.log("Project successfully restored and cleaned up.");
  } catch (error) {
    console.error("Error during restore and cleanup process:", error);
  }
};

export async function saveContactForm(data) {
  try {
    const docRef = await addDoc(collection(db, "ContactUs"), data);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

/**
 * Updates the daily progress for a user and maintains a 7-day queue
 * @param {string} email - User's email
 * @param {number} oldProgress - Previous completion value
 * @param {number} newProgress - New completion value
 */
export const updateDailyProgress = async (email, oldProgress, newProgress) => {
  if (!email) throw new Error("Email is required to update daily progress.");

  try {
    const today = new Date().toISOString().split("T")[0];
    const dailyProgressRef = collection(db, "users", email, "DailyProgress");

    // Get all documents sorted by date
    const q = query(dailyProgressRef, orderBy("date", "asc"));
    const snapshot = await getDocs(q);
    const documents = snapshot.docs;

    // Find today's document
    const todayDoc = documents.find((doc) => doc.data().date === today);
    const progressDiff = newProgress - oldProgress;

    if (todayDoc) {
      // Update today's progress
      const currentTotal = todayDoc.data().totalProgress || 0;
      await updateDoc(doc(dailyProgressRef, todayDoc.id), {
        totalProgress: currentTotal + progressDiff,
        lastUpdated: Timestamp.now(),
      });
    } else {
      // Create new document for today
      if (documents.length >= 7) {
        // Remove oldest document if we already have 7 days
        await deleteDoc(doc(dailyProgressRef, documents[0].id));
      }

      // Add new document for today
      await setDoc(doc(dailyProgressRef, today), {
        date: today,
        totalProgress: progressDiff,
        lastUpdated: Timestamp.now(),
      });
    }
  } catch (error) {
    console.error("Error updating daily progress:", error);
  }
};
