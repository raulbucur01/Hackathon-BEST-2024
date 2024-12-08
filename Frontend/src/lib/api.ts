import { ID, Query } from "appwrite";

import { INewPatient, INewDoctor } from "@/types";
import { appwriteConfig, account, avatars, databases, storage } from "./config";
import axios from "axios";

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

export async function createAppointment({
  patientId,
  doctorId,
  date,
  report,
}: {
  patientId: string;
  doctorId: string;
  date: string;
  report: { symptoms: string[]; diagnosis: string }; // Add report parameter
}) {
  try {
    // Add the appointment to the `appointments` table
    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.appointmentsCollectionId,
      ID.unique(),
      {
        patient: patientId,
        doctor: doctorId,
        date,
      }
    );

    // Fetch the doctor details to update their reports
    const doctor = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.doctorCollectionId,
      doctorId
    );

    // Convert the report object to a string
    const reportString = JSON.stringify(report);

    // Append the new report string to the existing reports array
    const updatedReports = [...(doctor.reports || []), reportString];

    // Update the doctor's reports field
    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.doctorCollectionId,
      doctorId,
      {
        reports: updatedReports,
      }
    );

    // Update availableDates (remove the selected date)
    const updatedDates = (doctor.availableDates || []).filter(
      (availableDate: string) => availableDate !== date
    );

    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.doctorCollectionId,
      doctorId,
      {
        availableDates: updatedDates,
      }
    );

    return true;
  } catch (error) {
    console.error("Error creating appointment or updating report:", error);
    throw error;
  }
}



export async function getAppointmentsForUser(patientId: string) {
  try {
    console.log("Fetching appointments for user ID:", patientId);

    const appointments = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.appointmentsCollectionId,
      [Query.equal("patient", patientId)]
    );

    console.log("Fetched appointments from database:", appointments.documents);

    const appointmentDetails = await Promise.all(
      appointments.documents.map(async (appointment: any) => {
        if (typeof appointment.doctor !== "string") {
          console.error(
            "Invalid doctor ID in appointment:",
            appointment.doctor
          );
          return appointment; // Skip invalid entries
        }

        const doctor = await databases.getDocument(
          appwriteConfig.databaseId,
          appwriteConfig.doctorCollectionId,
          appointment.doctor
        );
        return { ...appointment, doctor };
      })
    );

    console.log(
      "Appointments enriched with doctor details:",
      appointmentDetails
    );
    return appointmentDetails;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw error;
  }
}

export async function getDiagnosis(message: string) {
  try {
    const response = await axios.post(
      "https://ai-backend-611700556817.us-central1.run.app/analyze",
      {
        user_input: message,
      }
    );

    return response.data;
  } catch (err) {
    console.log(err);
  }
}
export async function getDoctorsBySpecialization(specializations: string[]) {
  try {
    // Use Query.equal to filter by specializations
    const doctors = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.doctorCollectionId,
      [Query.equal("specialization", specializations)] // Filters documents with any specialization in the array
    );

    if (!doctors.documents) {
      throw new Error("No doctors found with the specified specializations.");
    }

    return doctors.documents;
  } catch (error) {
    console.error("Error fetching doctors:", error);
    throw error;
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

export async function getDoctorDetails(doctorId: string) {
  try {
    if (!doctorId) {
      throw new Error("Doctor ID is required");
    }

    const doctor = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.doctorCollectionId,
      doctorId
    );

    return doctor;
  } catch (error) {
    console.error("Error fetching doctor details:", error);
    throw error;
  }
}
