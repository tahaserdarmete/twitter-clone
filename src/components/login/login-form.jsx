import {useState} from "react";
import AuthToggle from "./auth-toggle";
import EmailInput from "./email-input";
import ForgotPassword from "./forgot-password";
import PasswordInput from "./password-input";
import SubmitButton from "./submit-bottom";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {auth} from "../../firebase";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";

const LoginForm = () => {
  const navigate = useNavigate();
  const [isLoginMode, setIsLoginMode] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Formdaki verilere eriş
    const formData = new FormData(e.target);
    const {email, password} = Object.fromEntries(formData.entries());

    try {
      if (isLoginMode) {
        // Giriş yapma modundaysak
        const res = await signInWithEmailAndPassword(auth, email, password);

        // email doğrulanmamış ise bildirim
        if (!res.user.emailVerified) {
          return toast.warning("Lüften mailinizi doğrulayınız");
        }

        // Mailini doğrulamış ise anasayfaya yönlendir
        navigate("/feed");
        toast.success("Hesaba giriş yapıldı");
      } else {
        // Kayıt ol modundaysak
        const res = await createUserWithEmailAndPassword(auth, email, password);

        // doğrulama email i gönder
        await sendEmailVerification(res.user);

        // Giriş yapma moduna geç
        setIsLoginMode(true);

        // bildirim gönder
        toast.info("Mailinize doğrulama e postası gönderildi");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <EmailInput />

      <PasswordInput />

      <ForgotPassword isLoginMode={isLoginMode} />

      <SubmitButton isLoginMode={isLoginMode} />

      <AuthToggle isLoginMode={isLoginMode} setIsLoginMode={setIsLoginMode} />
    </form>
  );
};

export default LoginForm;
