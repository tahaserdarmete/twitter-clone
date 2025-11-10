import {toast} from "react-toastify";
import FormActions from "./form-actions";
import TextArea from "./text-area";
import UserAvatar from "./user-avatar";
import {addDoc, collection, serverTimestamp} from "firebase/firestore";
import {db} from "../../firebase";
import {useRef, useState} from "react";
import uploadFile from "../../firebase/uploadFile";
import Preview from "./preview";

const PostForm = ({user}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  // Form gönderildiğinde çalışacak
  const handleSubmit = async (e) => {
    e.preventDefault();

    // İnputlardaki veriyi al
    const text = e.target.text.value.trim();
    const file = e.target.image.files[0];

    // Girdi yoksa bildirim gönder
    if (!text && !file) return toast.warning("Lütfen içeriği belirleyiniz");

    //  Tweet'i koleksiyona kaydet
    try {
      setIsLoading(true);

      // Resmi storage'a kaydet
      const fileUrl = await uploadFile(file);

      // Koleksiyonun referansını al
      const collectionRef = collection(db, "tweets");

      // Belgeyi koleksiyona kaydet
      await addDoc(collectionRef, {
        content: {text, image: fileUrl},
        likes: [],
        isEdited: false,
        user: {
          id: user.uid,
          name: user.displayName,
          photo: user.photoURL,
        },

        createdAt: serverTimestamp(),
      });

      // Bildirim gönder
      toast.success("Tweet gönderildi");
      e.target.reset();
      setPreview(null);
    } catch (error) {
      toast.error("Hata!" + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // resim değişince çalışır
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  // önizleme resmini iptal et
  const cancelPreview = () => {
    // önizlemeyi kaldır
    setPreview(null);

    // file inputunda seçilen resmi kaldır
    fileInputRef.current.value = null;
  };

  return (
    <div className="border-b border-tw-gray p-4 flex gap-5">
      <UserAvatar name={user.displayName} photo={user.photoURL} />

      <form onSubmit={handleSubmit} className="w-full pt-1">
        <TextArea />

        <Preview url={preview} cancelPreview={cancelPreview} />

        <FormActions
          isLoading={isLoading}
          handleImageChange={handleImageChange}
          fileInputRef={fileInputRef}
        />
      </form>
    </div>
  );
};

export default PostForm;
