import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthForm from "../../features/auth/components/AuthForm";
import Input from "../../components/ui/Input";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { routes } from "../../lib/constants/routes";

const initialForm = {
  email: "",
  password: "",
};

function resolvePostLoginRoute(sessionUser, fromPathname) {
  const isAdmin = sessionUser.accountType === "admin";
  const isAdminPath = typeof fromPathname === "string" && fromPathname.startsWith("/admin");

  if (isAdmin) {
    return isAdminPath ? fromPathname : routes.admin;
  }

  if (isAdminPath) {
    return routes.dashboard;
  }

  return fromPathname || routes.dashboard;
}

export default function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      const sessionUser = await login(form);
      const redirectTo = resolvePostLoginRoute(
        sessionUser,
        location.state?.from?.pathname,
      );

      navigate(redirectTo, { replace: true });
    } catch (submissionError) {
      setError(submissionError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex justify-center">
      <AuthForm
        title="Login"
        description="Use your existing account to get back into ComptiHub."
        onSubmit={handleSubmit}
        submitLabel="Login"
        isSubmitting={isSubmitting}
        error={error}
        align="center"
        footer={
          <>
            New here?{" "}
            <Link
              className="text-(--landing-gold) hover:text-(--landing-gold-soft)"
              to={routes.signup}
            >
              Create an account
            </Link>
            .
          </>
        }
      >
        <label className="block space-y-2">
          <span className="landing-ui-text text-[0.74rem] text-(--landing-text)">
            Email
          </span>
          <Input
            name="email"
            type="email"
            autoComplete="email"
            placeholder="student@university.edu"
            value={form.email}
            onChange={updateField}
            required
          />
        </label>

        <label className="block space-y-2">
          <span className="landing-ui-text text-[0.74rem] text-(--landing-text)">
            Password
          </span>
          <Input
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={form.password}
            onChange={updateField}
            required
          />
        </label>
      </AuthForm>
    </div>
  );
}
