import {arrayRemove, arrayUnion, doc, updateDoc} from "firebase/firestore";
import {FaHeart, FaRegComment, FaRegHeart, FaRetweet} from "react-icons/fa";
import {FaShareNodes} from "react-icons/fa6";
import {auth, db} from "../../firebase";

const Buttons = ({tweet}) => {
  // aktif kullanıcı tweet'i like'ladı mı
  const isLiked = tweet.likes.includes(auth.currentUser.uid);

  // Like atma fonksiyonu
  const toggleLike = async () => {
    // güncellenecek dökümanın referansını al
    const docRef = doc(db, "tweets", tweet.id);

    // like varsa kullanıcının ıd sini kaldır
    // like yoksa kullanıcının id sini ekle
    await updateDoc(docRef, {
      likes: isLiked
        ? // Like varsa kaldır
          arrayRemove(auth.currentUser.uid)
        : // Like yoksa ekle
          arrayUnion(auth.currentUser.uid),
    });
  };

  return (
    <div className="flex justify-between items-center">
      <button className="post-icon hover:text-blue-400 hover:bg-blue-400/20">
        <FaRegComment />
      </button>

      <button className="post-icon hover:text-green-400 hover:bg-blue-400/20">
        <FaRetweet />
      </button>

      <button
        onClick={toggleLike}
        className={`post-icon hover:text-pink-400 hover:bg-blue-400/20 flex gap-1 items-center relative ${
          isLiked && "text-pink-500"
        }`}
      >
        {isLiked ? <FaHeart /> : <FaRegHeart />}
        <span className="absolute -end-1 w-3">
          {/* {tweet.likes.length} */}
          {tweet.likes.length === 0 ? "" : tweet.likes.length}
        </span>
      </button>

      <button className="post-icon hover:text-blue-400 hover:bg-blue-400/20">
        <FaShareNodes />
      </button>
    </div>
  );
};

export default Buttons;
