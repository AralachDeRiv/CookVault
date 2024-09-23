import { storage } from "./config";
import { ID } from "appwrite";

const uploadPicture = async (file) => {
  try {
    const promise = await storage.createFile(
      import.meta.env.VITE_BUCKET_ID_PICTURES,
      ID.unique(),
      file
    );
    return promise;
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};

const deletePicture = async (fileID) => {
  try {
    const result = await storage.deleteFile(
      import.meta.env.VITE_BUCKET_ID_PICTURES,
      fileID
    );
    return result;
  } catch (err) {
    console.error(err);
  }
};

const getPictureUrl = async (fileId) => {
  try {
    const url = await storage.getFileView(
      import.meta.env.VITE_BUCKET_ID_PICTURES,
      fileId
    );
    return url.href;
  } catch (err) {
    console.error(err);
  }
};

export { uploadPicture, deletePicture, getPictureUrl };
