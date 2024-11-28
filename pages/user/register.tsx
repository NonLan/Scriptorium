import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

export default function Register() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        const formData = new FormData(e.currentTarget);

        // Client-side validation
        if (formData.get("password") !== formData.get("confirmPassword")) {
            setError("Passwords do not match.");
            return;
        }

        const password = formData.get("password")?.toString() || "";
        if (password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await fetch("/api/user/register", {
                method: "POST",
                body: formData,
            });

            const result = await res.json();
            if (res.ok) {
                setSuccess("Registration successful! You can now log in.");
                alert("Registration successful! Redirecting to login...");
                router.push("/user/login");
            } else {
                setError(result.error || "Failed to register.");
                alert("Failed to register:" + result.error);
            }
        } catch (err) {
            console.error("An error occurred during registration:", err);
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarPreview(URL.createObjectURL(file));
        } else {
            setAvatarPreview(null);
        }
    };

    return (
        <>
        <Head>
            <title>Scriptorium - Register</title>
        </Head>
        <main>
            <section className="flex flex-col gap-4">
                <h2>Create an Account</h2>
                <div className="form-container">
                    {error && <p className="text-red-500">{error}</p>}
                    {success && <p className="text-green-500">{success}</p>}

                    <form className="flex flex-col p-4 md:px-24 md:py-16 gap-2" onSubmit={handleSubmit}>
                        {/* Full Name */}
                        <label htmlFor="firstName">Full Name</label>
                        <div className="fullName mb-6 flex flex-col md:flex-row gap-4 md:gap-0">
                            <input className="md:border-r-0 md:rounded-r-none flex-1" type="text" name="firstName" id="firstName" placeholder="First Name" required/>
                            <input className="md:rounded-l-none flex-1" type="text" name="lastName" id="lastName" placeholder="Last Name" required />
                        </div>

                        {/* Email */}
                        <label htmlFor="email">Email</label>
                        <input className="mb-6" type="email" name="email" id="email" placeholder="Email" required />

                        {/* Phone Number */}
                        <label htmlFor="phoneNumber">Phone Number</label>
                        <input className="mb-6" type="tel" name="phoneNumber" id="phoneNumber" placeholder="Phone Number" required />

                        {/* Password */}
                        <label htmlFor="password">Password</label>
                        <input className="mb-6" type="password" name="password" id="password" placeholder="Password" required />

                        {/* Confirm Password */}
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input className="mb-6" type="password" name="confirmPassword" id="confirmPassword" placeholder="Confirm Password" required />

                        {/* Avatar */}
                        <div className="flex flex-col items-center my-4">
                            {avatarPreview && (
                                <div className="avatar-preview mb-6">
                                    <img src={avatarPreview} alt="Avatar Preview" className="w-32 h-32 object-cover rounded-full" />
                                </div>
                            )}
                            <label className="avatar-upload mb-2" htmlFor="avatar">
                                Avatar (Optional)
                            </label>
                            <input className="mb-6" type="file" name="avatar" id="avatar" accept="image/*" onChange={handleAvatarChange} />
                        </div>

                        {/* Submit */}
                        <button type="submit" id="internal-link" disabled={isSubmitting} className={`${ isSubmitting ? "opacity-50 cursor-not-allowed" : "" }`}>
                            {isSubmitting ? "Submitting..." : "Sign Up!"}
                        </button>
                    </form>
                </div>

                <div className="redirect flex flex-row gap-2 align-baseline">
                    <p>Already have an account?</p>
                    <Link href="./sign-in" className="hover:underline">
                        Sign in here.
                    </Link>
                </div>
            </section>
        </main>
        </>
    );
}
