import { getStorage, ref, uploadBytesResumable, getDownloadURL, UploadResult } from "firebase/storage";
import { initializeApp, FirebaseApp } from "firebase/app";
import { config as dotenvConfig } from "dotenv";
interface MulterFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
}
dotenvConfig();
const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID
};

// Initialize Firebase and the Cloud Storage service
const app: FirebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(app);

export const uploadToFirebaseStorage = async (file: MulterFile): Promise<string> => {
    try {
        // Create a storage reference for the file
        const storageRef = ref(storage, `files/${file.originalname}`);

        // Upload the file to Firebase Storage
        const snapshot: UploadResult = await uploadBytesResumable(storageRef, file.buffer);

        // Get the public download URL of the uploaded file
        const downloadURL: string = await getDownloadURL(snapshot.ref);

        // Return the download URL
        return downloadURL;
    } catch (error) {
        throw new Error("Failed to upload file to Firebase Storage");
    }
};
