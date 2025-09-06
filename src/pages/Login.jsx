import { useNavigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import LoginForm from "../components/auth/LoginForm";

export default function Login() {
  const navigate = useNavigate();

  return (
    <AuthLayout>
      <div className="w-full absolute top-6 left-0 ">
        {/* Back Button */}
        <a
          onClick={() => navigate(-1)}
          className="text-sm font-medium hover:underline underline-offset-2 block"
        >
          ← Back
        </a>
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
