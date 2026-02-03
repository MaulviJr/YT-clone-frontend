import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import authService from "../api/auth.service";
import { login } from "../store/authSlice";

export default function SignUp() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    // const navigate = useNavigate();
    const dispatch = useDispatch();

    const create = async (data) => {
        setError("");
        setLoading(true);
        try {
            // 1. Prepare FormData for multipart/form-data request
            const formData = new FormData();
            formData.append("fullName", data.fullName);
            formData.append("username", data.username);
            formData.append("email", data.email);
            formData.append("password", data.password);
            
            console.log(data.avatar[0]);
            // Accessing the file from the FileList object
            if (data.avatar && data.avatar[0]) {
                formData.append("avatar", data.avatar[0]);
            }
            if (data.coverImage && data.coverImage[0]) {
                formData.append("coverImage", data.coverImage[0]);
            }

            // 2. Call service to create account
            const userData = await authService.createAccount(formData);

            if (userData) {
                // 3. Update Redux store and redirect
                dispatch(login(userData));
                // navigate("/");
            }
        } catch (err) {
            setError(err.message || "An error occurred during signup");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-container">
            <h2>Create Account</h2>
            {error && <p className="error-msg">{error}</p>}

            <form onSubmit={handleSubmit(create)}>
                {/* Full Name */}
                <div>
                    <input
                        type="text"
                        placeholder="Full Name"
                        {...register("fullName", { required: "Full name is required" })}
                    />
                    {errors.fullName && <span>{errors.fullName.message}</span>}
                </div>

                {/* Username */}
                <div>
                    <input
                        type="text"
                        placeholder="Username"
                        {...register("username", { required: "Username is required" })}
                    />
                    {errors.username && <span>{errors.username.message}</span>}
                </div>

                {/* Email */}
                <div>
                    <input
                        type="email"
                        placeholder="Email"
                        {...register("email", { 
                            required: "Email is required",
                            pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                        })}
                    />
                    {errors.email && <span>{errors.email.message}</span>}
                </div>

                {/* Password */}
                <div>
                    <input
                        type="password"
                        placeholder="Password"
                        {...register("password", { required: "Password is required" })}
                    />
                    {errors.password && <span>{errors.password.message}</span>}
                </div>

                {/* Avatar */}
                <div>
                    <label>Avatar:</label>
                    <input
                        type="file"
                        accept="image/*"
                        {...register("avatar", { required: "Avatar is required" })}
                    />
                    {errors.avatar && <span>{errors.avatar.message}</span>}
                </div>

                {/* Cover Image */}
                <div>
                    <label>Cover Image (Optional):</label>
                    <input
                        type="file"
                        accept="image/*"
                        {...register("coverImage")}
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? "Registering..." : "Sign Up"}
                </button>
            </form>
        </div>
    );
}