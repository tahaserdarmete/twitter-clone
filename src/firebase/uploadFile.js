import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {storage} from "./index";
import {v4} from "uuid";

const uploadFile = async (file) => {
  // Dosya yoksa durdur
  if (!file) return null;

  // Dosya formatı resim değilse izin verme
  if (!file.type.startsWith("image")) {
    throw new Error("Medya tipi desteklenmiyor");
  }

  //   Dosya botuyu 3mb üzerinde ise yükleme
  if (file.size > 3000000) {
    throw new Error("Medya boyutunu sınırı aşıyor (3mb)");
  }

  //   resmi yükleneceğini konumun referansını al
  const imageRef = ref(storage, `post-images/${v4()}${file.name}`);

  //   Resmi storage'a yükle
  await uploadBytes(imageRef, file);

  //   Yüklenen fotonun url i al
  const url = await getDownloadURL(imageRef);

  return url;
};

export default uploadFile;
