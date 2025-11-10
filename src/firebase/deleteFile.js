import {deleteObject, ref} from "firebase/storage";
import {storage} from ".";

// Firebase storage url'den dosya ref alacak ve silecek
const deleteFromStorage = async (imageUrl) => {
  // 1) Url yoksa durdur
  if (!imageUrl) return null;

  try {
    // Firebase URL formatı
    //   https://firebasestorage.googleapis.com/v0/b/twitter-clone-ebff4.firebasestorage.app/o/post-images%2Fcc6e9c9d-f19b-4653-bbe9-6d358f51a3ebx-logo.webp?alt=media&token=b193e1fa-58a4-4800-bd2b-ef26958da49a

    // 2) url'deki karakter kodlarını normale çevir
    // decodeURIComponent => Url deki özel karakter kodlarını normale çevirir
    const normalUrl = decodeURIComponent(imageUrl);

    // 3) url'den dosya yolunu alma

    const startIndex = normalUrl.indexOf("/o/") + 3;
    const endIndex = normalUrl.indexOf("?");
    const imagePath = normalUrl.substring(startIndex, endIndex);

    // 4) Silinecek dosyasının referansını al
    const fileRef = ref(storage, imagePath);

    // 5) Dosyayı sil
    await deleteObject(fileRef);

    return true;
  } catch (error) {
    console.error("Resim silinirken bir hata oluştu", error);
    return false;
  }
};

export default deleteFromStorage;
