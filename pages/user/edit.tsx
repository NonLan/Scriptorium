import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  accountType: string;
};

export default function EditProfile() {
  const router = useRouter();
  const [avatar, setAvatar] = useState<File | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data: User = await res.json();
        setUser(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : String(error));
      }
    };
    fetchUserData();
  }, []);

  if (!user) {
    return <div id="error">Loading...</div>;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAvatar(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword && !currentPassword) {
      alert("Please enter your current password to change it.");
      return;
    }

    try {
        const formData = new FormData();
        if (avatar) {
          formData.append("avatar", avatar);
        }
        formData.append("firstName", user.firstName);
        formData.append("lastName", user.lastName);
        formData.append("currentPassword", currentPassword);
        formData.append("newPassword", newPassword);

        const response = await fetch("/api/user/edit", {
          method: "PUT",
          body: formData,
          credentials: "include", // Ensure cookies are sent
        });

        if (response.ok) {
          const updatedUser = await response.json();
          setUser(updatedUser.updatedUser);
          setSuccess("Profile updated successfully!");
          setError(null);
          alert("Profile updated successfully!");
          router.push("/user");
        } else {
          const errorResponse = await response.json();
          setError(errorResponse.error || "Failed to update profile");
          setSuccess(null);
          alert(`Failed to update profile: ${errorResponse.error}`);
        }

    } catch (error) {
        setError("An unexpected error occurred.");
        setSuccess(null);
    }
};


  return (
    <>
      <Head>
        <title>Scriptorium - Edit Profile</title>
      </Head>
      <main>
        <section className="flex flex-col gap-4">
          <h2 className="text-left">
            Edit Profile
          </h2>
          <div className="form-container">
            <form onSubmit={handleSubmit} className="flex flex-col p-4 md:px-24 md:py-16 gap-2">

            {/* Avatar */}
            <div id="avatar-container" className="flex flex-col items-center">
              {user.avatar && (
              <div className="current-avatar mb-4">
                <img
                src={user.avatar}
                alt="Current Avatar"
                className="w-32 h-32 object-cover rounded-full"
                />
              </div>
              )}
              {avatar && (
              <div className="avatar-preview mb-6">
                <img
                src={URL.createObjectURL(avatar)}
                alt="Avatar Preview"
                className="w-32 h-32 object-cover rounded-full"
                />
              </div>
              )}
              <label htmlFor="avatar" className="mb-4">Avatar</label>
              <input className="mb-6"
              type="file"
              id="avatar"
              accept="image/*"
              onChange={handleFileChange}
              />
            </div>

              {/* Name */}
              <label htmlFor="firstName">First Name</label>
              <input className="mb-6"
                type="text"
                id="firstName"
                value={user.firstName}
                onChange={(e) =>
                  setUser((prevUser) =>
                    prevUser ? { ...prevUser, firstName: e.target.value } : null
                  )
                }
              />
              <label htmlFor="lastName">Last Name</label>
              <input className="mb-6"
                type="text"
                id="lastName"
                value={user.lastName}
                onChange={(e) =>
                  setUser((prevUser) =>
                    prevUser ? { ...prevUser, lastName: e.target.value } : null
                  )
                }
              />

              {/* Password */}
              <p>To change your password, please enter your current one as well.</p>
              <label>Current Password</label>
              <input className="mb-6" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}></input>
              <label>New Password</label>
              <input className="mb-6" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}></input>

              <button type="submit" id="internal-link">Save</button>

            </form>
          </div>
        </section>
      </main>
    </>
  );
}
