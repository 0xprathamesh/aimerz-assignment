"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Palette, Save, Loader2 } from "lucide-react";
import { useUiStore } from "@/lib/stores/ui-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

type DashboardBg = "none" | "slate" | "zinc" | "gradient" | "dots";

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export default function SettingsPage() {
  const { status } = useSession();
  const { dashboardBackground, setDashboardBackground } = useUiStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (status === "authenticated") {
        try {
          setIsLoading(true);
          const response = await fetch("/api/user/profile");
          if (response.ok) {
            const userData = await response.json();
            setProfile(userData);
            setFormData({
              firstName: userData.firstName,
              lastName: userData.lastName,
            });
          } else {
            toast.error("Failed to load profile");
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
          toast.error("Failed to load profile");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchProfile();
  }, [status]);

  const handleSaveProfile = async () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast.error("First name and last name are required");
      return;
    }

    try {
      setIsSaving(true);
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        toast.success("Profile updated successfully");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Please sign in to view settings</p>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                disabled={isSaving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                disabled={isSaving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile?.email || ""}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed. Contact support if you need to update
                your email.
              </p>
            </div>
            <Button
              onClick={handleSaveProfile}
              disabled={
                isSaving ||
                !formData.firstName.trim() ||
                !formData.lastName.trim()
              }
              className="w-full sm:w-auto"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Update Profile
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>
              Customize your todo app experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Theme</Label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Light
                </Button>
                <Button variant="outline" size="sm">
                  Dark
                </Button>
                <Button variant="outline" size="sm">
                  System
                </Button>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Notifications (Coming Soon)</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="email-notifications" />
                  <Label htmlFor="email-notifications" className="text-sm">
                    Email notifications
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="reminder-notifications" />
                  <Label htmlFor="reminder-notifications" className="text-sm">
                    Reminder notifications
                  </Label>
                </div>
              </div>
            </div>
            <Button>Save Preferences</Button>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Dashboard Background Customization */}
      <Card className="lg:hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Dashboard Background
          </CardTitle>
          <CardDescription>
            Customize your dashboard background (Mobile only)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label>Background Style</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {[
                    { id: "none", label: "Default" },
                    { id: "slate", label: "Slate" },
                    { id: "zinc", label: "Zinc" },
                    { id: "gradient", label: "Gradient" },
                    { id: "dots", label: "Dots" },
                  ].find((opt) => opt.id === dashboardBackground)?.label ||
                    "Default"}
                  <Palette className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-full">
                {[
                  { id: "none", label: "Default" },
                  { id: "slate", label: "Slate" },
                  { id: "zinc", label: "Zinc" },
                  { id: "gradient", label: "Gradient" },
                  { id: "dots", label: "Dots" },
                ].map((opt) => (
                  <DropdownMenuItem
                    key={opt.id}
                    onClick={() =>
                      setDashboardBackground(opt.id as DashboardBg)
                    }
                    className="cursor-pointer"
                  >
                    {opt.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
