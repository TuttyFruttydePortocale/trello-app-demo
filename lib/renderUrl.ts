import { storage } from "@/appwrite";

const renderUrl = async (image: Image) => {
  const url = storage.getFilePreview(image.bucketId, image.fileId);
  return url;
};
export default renderUrl;
