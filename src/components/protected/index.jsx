import {onAuthStateChanged} from "firebase/auth";
import {useEffect, useState} from "react";
import {Navigate, Outlet} from "react-router-dom";
import {auth} from "../../firebase";
import PageLoader from "../loader/page-loader";
import {toast} from "react-toastify";

const Protected = () => {
  // Oturumu açık olan kullanıcının state i
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    // Oturum verisine abone ol
    const unsub = onAuthStateChanged(auth, (activeUser) => setUser(activeUser));

    // kullanıcı sayfadan ayrılınca aboneliği sonlandır
    return () => unsub();
  }, []);

  //  Oturum verisi gelene kadar laoder bas
  if (user === undefined) return <PageLoader />;

  // Kullanıcı oturumu kapalıysa veya email li doğrulamadıysa login e yönlendir
  if (user === null || user.emailVerified === false) {
    if (user?.emailVerified === false)
      toast.info("Email adresinizi doğrulayınız");
    // Ana sayfaya yönlendir
    return <Navigate to="/" replace />;
  }

  //   Kullanıcının oturumu açıksa sayfayı göster
  return <Outlet context={user} />;
};

export default Protected;
