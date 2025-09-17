// frontend/app/dashboard/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { toast } from "react-toastify";

import ProfileDetailsCard from "@/components/profile/ProfileDetailsCard";
import RiskAppetiteCard from "@/components/profile/RiskAppetiteCard";
import AiRecommendationsCard from "@/components/profile/AiRecommendationsCard";
import SecuritySettingsCard from "@/components/profile/SecuritySettingsCard"; // <-- Import new component

// Define types for our data
interface Profile {
  firstName: string;
  lastName: string;
  email: string;
  riskAppetite: "low" | "moderate" | "high";
}
interface Recommendations {
  summary: string;
  products: string[];
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [recommendations, setRecommendations] =
    useState<Recommendations | null>(null);
  const [loading, setLoading] = useState(true);

  // This data fetching logic is perfect as is.
  const fetchProfileData = async () => {
    try {
      const [profileRes, recRes] = await Promise.all([
        api.get("/profile"),
        api.get("/profile/recommendations"),
      ]);
      setProfile(profileRes.data);
      setRecommendations(recRes.data);
    } catch (error) {
      console.error("Failed to fetch profile data:", error);
      toast.error("Could not load your profile data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  // This update logic is also perfect.
  const handleProfileUpdate = async (data: any) => {
    try {
      const response = await api.put("/profile", data);
      setProfile(response.data);
      toast.success("Profile updated successfully!");

      if (data.riskAppetite) {
        const recRes = await api.get("/profile/recommendations");
        setRecommendations(recRes.data);
      }
    } catch (error) {
      toast.error("Failed to update profile.");
    }
  };

  if (loading || !profile || !recommendations) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-center text-gray-300">Loading Your Profile...</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      {/* --- LEFT COLUMN --- */}
      <div className="lg:col-span-1 flex flex-col gap-6">
        <ProfileDetailsCard profile={profile} onUpdate={handleProfileUpdate} />
        <SecuritySettingsCard /> {/* <-- Add the new component here */}
      </div>

      {/* --- RIGHT COLUMN --- */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        <RiskAppetiteCard
          currentRisk={profile.riskAppetite}
          onUpdate={handleProfileUpdate}
        />
        <AiRecommendationsCard recommendations={recommendations} />
      </div>
    </div>
  );
}
