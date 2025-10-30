const SubmitButton = ({isLoginMode}) => {
  return (
    <button
      type="submit"
      className="mt-10 bg-white text-black rounded-full p-1 font-bold transition hover:bg-gray-300 cursor-pointer"
    >
      {isLoginMode ? "Giriş Yap" : "Kayıt Ol"}
    </button>
  );
};

export default SubmitButton;
