import { useNavigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import LoginForm from "../components/auth/LoginForm";

export default function Login() {
  const navigate = useNavigate();

  return (
    <AuthLayout>
      <div className="w-full px-4 absolute top-6 left-0 ">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="text-sm back hover:underline underline-offset-2 block"
        >
          ← Back
        </button>
      </div>

      {/* Heading */}
      <div className="w-full max-w-md mx-auto  p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center">Login</h2>

        {/* Form */}
        <LoginForm />
      </div>
    </AuthLayout>
  );
}
