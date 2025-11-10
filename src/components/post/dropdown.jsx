import {FaEdit, FaTrash} from "react-icons/fa";
import {auth, db} from "../../firebase";
import {deleteDoc, doc} from "firebase/firestore";
import {toast} from "react-toastify";
import {useRef, useState} from "react";
import EditModal from "../modal/edit-modal";
import deleteFromStorage from "../../firebase/deleteFile";

const DropDown = ({tweet}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Tweet'i. gönderen kişi ile aktif kullanıcı aynı mı
  const isOwn = tweet.user.id === auth.currentUser.uid;

  // Sil butonuna tıklanıldığında çalışır
  const handleDelete = async () => {
    if (!confirm("Silmek istediğinizden emin misiniz?")) return;

    try {
      // Eğer tweet'de resim varsa resmi sil
      if (tweet.content.image) {
        await deleteFromStorage(tweet.content.image);
      }

      // Silinecek dökümanın referansını al
      const docRef = doc(db, "tweets", tweet.id);

      // dökümanı koleksiyondan kaldır
      await deleteDoc(docRef);

      toast.info("Tweet kaldırıldı");
    } catch (error) {
      toast.error("işlem başarısız");
    }
  };

  // tweet aktif kullanıcının değilse gösterme
  if (!isOwn) return;

  return (
    <>
      <label className="popup z-99">
        <input type="checkbox" />
        <div className="burger" tabIndex="0">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <nav className="popup-window">
          <legend>Eylemler</legend>
          <ul>
            <li>
              <button onClick={() => setIsOpen(true)}>
                <FaEdit />
                <span>Düzenle</span>
              </button>
            </li>
            <hr />
            <li>
              <button onClick={handleDelete}>
                <FaTrash />
                <span>Sil</span>
              </button>
            </li>
          </ul>
        </nav>
      </label>

      <EditModal isOpen={isOpen} close={() => setIsOpen(false)} tweet={tweet} />
    </>
  );
};

export default DropDown;
