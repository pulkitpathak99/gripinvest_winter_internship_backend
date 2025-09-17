// frontend/components/profile/ProfileDetailsCard.tsx
"use client";
import { useState } from "react";
import { User, Edit3, Save } from "lucide-react";

export default function ProfileDetailsCard({ profile, onUpdate }: any) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: profile.firstName,
    lastName: profile.lastName || "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  return (
    <div className="bg-slate-800/50 border border-slate-800 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-white">Profile Details</h3>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-2"
        >
          {isEditing ? (
            "Cancel"
          ) : (
            <>
              <Edit3 size={14} /> Edit
            </>
          )}
        </button>
      </div>
      <div className="space-y-4">
        <div>
          <label className="text-xs text-gray-400">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 mt-1 text-white disabled:bg-slate-800/50 disabled:border-slate-800/50"
          />
        </div>
        <div>
          <label className="text-xs text-gray-400">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 mt-1 text-white disabled:bg-slate-800/50 disabled:border-slate-800/50"
          />
        </div>
        <div>
          <label className="text-xs text-gray-400">Email Address</label>
          <input
            type="email"
            value={profile.email}
            disabled
            className="w-full bg-slate-800/50 border-slate-800/50 rounded-lg p-2 mt-1 text-gray-400 cursor-not-allowed"
          />
        </div>
        {isEditing && (
          <button
            onClick={handleSave}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            <Save size={16} /> Save Changes
          </button>
        )}
      </div>
    </div>
  );
}
