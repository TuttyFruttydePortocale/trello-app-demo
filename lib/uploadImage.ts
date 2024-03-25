import { ID, storage} from "@/appwrite"

const uploadImage = async(file: File) => {
    if(!file) return
    const fileUploaded = await storage.createFile(
        "65deead03ddffa950381",
        ID.unique(),
        file
    )
    return fileUploaded
} 
export default uploadImage