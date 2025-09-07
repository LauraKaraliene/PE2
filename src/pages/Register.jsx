/**
 * Register page component.
 *
 * - Renders the registration page with a back button, heading, and registration form.
 * - Uses the `AuthLayout` to provide a consistent layout for authentication pages.
 *
 * @returns {JSX.Element} The rendered registration page component.
 */

import { useNavigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import RegisterForm from "../components/auth/RegisterForm";

export default function Register() {
  const navigate = useNavigate();

  return (
    <AuthLayout>
      {/* Back Button */}
      <div className="w-full absolute top-6 left-6 cursor-pointer">
        <a
          onClick={() => navigate(-1)}
          className="text-sm font-medium hover:underline underline-offset-2 block cursor-pointer"
        >
          ← Back
        </a>
      </div>

      {/* Heading & Form */}
      <div className="w-full max-w-md mx-auto p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center">Register</h2>
        <RegisterForm />
      </div>
    </AuthLayout>
  );
}
