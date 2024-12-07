import { ID, ImageGravity, Query } from "appwrite";

import { INewPost, INewPatient, IUpdatePost, INewDoctor } from "@/types";
import { appwriteConfig, account, avatars, databases, storage } from "./config";

export async function createPatientAccount(patient: INewPatient) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      patient.email,
      patient.password,
      patient.name
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(patient.name);

    const newUser = await savePatientToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      phone: patient.phone,
      imageUrl: new URL(avatarUrl),
      allergies: patient.allergies,
      conditions: patient.conditions,
      medications: patient.medications,
    });

    return newUser;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function savePatientToDB(patient: {
  accountId: string;
  email: string;
  name: string;
  imageUrl: URL;
  phone: string;
  allergies?: string[];
  conditions?: string[];
  medications?: string[];
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.patientCollectionId,
      ID.unique(),
      patient
    );

    return newUser;
  } catch (error) {
    console.log(error);
  }
}

export async function createDoctorAccount(doctor: INewDoctor) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      doctor.email,
      doctor.password,
      doctor.name
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(doctor.name);

    const newUser = await saveDoctorToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      phone: doctor.phone,
      imageUrl: new URL(avatarUrl),
      specialization: doctor.specialization,
    });

    return newUser;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function saveDoctorToDB(doctor: {
  accountId: string;
  email: string;
  name: string;
  imageUrl: URL;
  phone: string;
  specialization: string;
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.doctorCollectionId,
      ID.unique(),
      doctor
    );

    return newUser;
  } catch (error) {
    console.log(error);
  }
}

export async function signInAccount(user: { email: string; password: string }) {
  try {
    const session = await account.createEmailPasswordSession(
      user.email,
      user.password
    );

    return session;
  } catch (error) {
    console.log(error);
    return null;
  }
}

// export async function getAccount() {
//   try {
//     const currentAccount = await account.get();

//     return currentAccount;
//   } catch (error) {
//     console.log(error);
//   }
// }

export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentPatient = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.patientCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    const currentDoctor = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.doctorCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (currentPatient.documents.length > 0) {
      return currentPatient.documents[0];
    }

    if (currentDoctor.documents.length > 0) {
      return currentDoctor.documents[0];
    }

    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function signOutAccount() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    console.log(error);
  }
}

// export async function uploadFile(file: File) {
//   try {
//     const uploadedFile = await storage.createFile(
//       appwriteConfig.storageId,
//       ID.unique(),
//       file
//     );

//     return uploadedFile;
//   } catch (error) {
//     console.log(error);
//   }
// }

// export function getFilePreview(fileId: string) {
//   try {
//     const fileUrl = storage.getFilePreview(
//       appwriteConfig.storageId,
//       fileId,
//       2000,
//       2000,
//       ImageGravity.Top,
//       100
//     );

//     return fileUrl;
//   } catch (error) {
//     console.log(error);
//   }
// }

// export async function deleteFile(fileId: string) {
//   try {
//     await storage.deleteFile(appwriteConfig.storageId, fileId);

//     return { status: "ok" };
//   } catch (error) {
//     console.log(error);
//   }
// }
