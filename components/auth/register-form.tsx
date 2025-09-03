"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FieldErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function RegisterForm() {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const router = useRouter();

  const validateField = (name: keyof FormData, value: string): FieldErrors => {
    const errors: FieldErrors = {};

    switch (name) {
      case "firstName":
        if (!value.trim()) {
          errors.firstName = "First name is required";
        } else if (value.trim().length < 2) {
          errors.firstName = "First name must be at least 2 characters";
        }
        break;
      case "lastName":
        if (!value.trim()) {
          errors.lastName = "Last name is required";
        } else if (value.trim().length < 2) {
          errors.lastName = "Last name must be at least 2 characters";
        }
        break;
      case "email":
        if (!value.trim()) {
          errors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          errors.email = "Please enter a valid email address";
        }
        break;
      case "password":
        if (!value) {
          errors.password = "Password is required";
        } else if (value.length < 6) {
          errors.password = "Password must be at least 6 characters";
        }
        break;
      case "confirmPassword":
        if (!value) {
          errors.confirmPassword = "Please confirm your password";
        } else if (value !== formData.password) {
          errors.confirmPassword = "Passwords do not match";
        }
        break;
    }

    return errors;
  };

  const handleInputChange = (name: keyof FormData, value: string): void => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (fieldErrors[name as keyof FieldErrors]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleSubmit = async (
    e:
      | React.FormEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLInputElement>
  ): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    const firstNameErrors = validateField("firstName", formData.firstName);
    const lastNameErrors = validateField("lastName", formData.lastName);
    const emailErrors = validateField("email", formData.email);
    const passwordErrors = validateField("password", formData.password);
    const confirmPasswordErrors = validateField(
      "confirmPassword",
      formData.confirmPassword
    );

    const allErrors: FieldErrors = {
      ...firstNameErrors,
      ...lastNameErrors,
      ...emailErrors,
      ...passwordErrors,
      ...confirmPasswordErrors,
    };

    if (Object.keys(allErrors).length > 0) {
      setFieldErrors(allErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Registration failed");
      } else {
        setSuccess("Account created successfully! Redirecting to login...");
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-xl">
          <CardHeader className="space-y-2 text-center pb-6">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
              <div className="w-6 h-6 bg-primary rounded-full"></div>
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">
              Create Account
            </CardTitle>
            <CardDescription className="text-base">
              Sign up for your account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  className={`h-11 ${
                    fieldErrors.firstName
                      ? "border-destructive focus:border-destructive"
                      : ""
                  }`}
                  disabled={isLoading}
                />
                {fieldErrors.firstName && (
                  <p className="text-sm text-destructive mt-1">
                    {fieldErrors.firstName}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  className={`h-11 ${
                    fieldErrors.lastName
                      ? "border-destructive focus:border-destructive"
                      : ""
                  }`}
                  disabled={isLoading}
                />
                {fieldErrors.lastName && (
                  <p className="text-sm text-destructive mt-1">
                    {fieldErrors.lastName}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`h-11 ${
                  fieldErrors.email
                    ? "border-destructive focus:border-destructive"
                    : ""
                }`}
                disabled={isLoading}
              />
              {fieldErrors.email && (
                <p className="text-sm text-destructive mt-1">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className={`h-11 pr-10 ${
                    fieldErrors.password
                      ? "border-destructive focus:border-destructive"
                      : ""
                  }`}
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {fieldErrors.password && (
                <p className="text-sm text-destructive mt-1">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  className={`h-11 pr-10 ${
                    fieldErrors.confirmPassword
                      ? "border-destructive focus:border-destructive"
                      : ""
                  }`}
                  disabled={isLoading}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {fieldErrors.confirmPassword && (
                <p className="text-sm text-destructive mt-1">
                  {fieldErrors.confirmPassword}
                </p>
              )}
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-200 bg-green-50 text-green-800">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleSubmit}
              className="w-full h-11 text-base font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </CardContent>

          <CardFooter className="justify-center pt-2">
            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="font-medium text-primary hover:underline underline-offset-4"
              >
                Sign in here
              </Link>
            </div>
          </CardFooter>
        </Card>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          <Link href={"/"}>
            By creating an account, you agree to our Terms of Service and
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
