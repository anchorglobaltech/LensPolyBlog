import { Button } from "flowbite-react";
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess, signInFailure } from "../Redux/user/userSlice";
import { useNavigate } from "react-router-dom";

const OAuth = () => {
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (!user) {
        throw new Error("Google authentication failed");
      }

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.displayName,
          email: user.email,
          googlePhotoUrl: user.photoURL,
        }),
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to authenticate with server");
      }

      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      console.error("Google Auth Error:", error.message);
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <Button
      type="button"
      gradientDuoTone="greenToBlue"
      outline
      onClick={handleGoogleClick}
    >
      <FcGoogle className="w-6 h-6 mr-2" />
      Continue with Google
    </Button>
  );
};

export default OAuth;
