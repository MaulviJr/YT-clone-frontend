import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import authService from "../api/auth.service";
import { login } from "../store/authSlice";
import { GalleryVerticalEnd, Camera, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignUp({ className, ...props }) {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const create = async (data) => {
        setError("");
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("fullName", data.fullName);
            formData.append("username", data.username);
            formData.append("email", data.email);
            formData.append("password", data.password);
            
            if (data.avatar && data.avatar[0]) {
                formData.append("avatar", data.avatar[0]);
            }
            if (data.coverImage && data.coverImage[0]) {
                formData.append("coverImage", data.coverImage[0]);
            }

            const userData = await authService.createAccount(formData);
            if (userData) {
                dispatch(login(userData));
            }
        } catch (err) {
            setError(err.message || "An error occurred during signup");
        } finally {
            setLoading(false);
        }
    };

    return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>
            Enter your details below to create your TubeClone account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(create)}>
            <div className="grid gap-6">
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-lg text-sm text-center">
                  {error}
                </div>
              )}
              
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="John Doe"
                      className={errors.fullName ? "border-destructive" : ""}
                      {...register("fullName", { required: "Full name is required" })}
                    />
                    {errors.fullName && <p className="text-[10px] text-destructive">{errors.fullName.message}</p>}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="johndoe"
                      className={errors.username ? "border-destructive" : ""}
                      {...register("username", { required: "Username is required" })}
                    />
                    {errors.username && <p className="text-[10px] text-destructive">{errors.username.message}</p>}
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    className={errors.email ? "border-destructive" : ""}
                    {...register("email", { 
                      required: "Email is required",
                      pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                    })}
                  />
                  {errors.email && <p className="text-[10px] text-destructive">{errors.email.message}</p>}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    className={errors.password ? "border-destructive" : ""}
                    {...register("password", { 
                      required: "Password is required", 
                      minLength: { value: 6, message: "Must be at least 6 characters" } 
                    })}
                  />
                  {errors.password && <p className="text-[10px] text-destructive">{errors.password.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="avatar">Avatar</Label>
                    <Input
                      id="avatar"
                      type="file"
                      accept="image/*"
                      className={cn("cursor-pointer", errors.avatar && "border-destructive")}
                      {...register("avatar", { required: "Avatar is required" })}
                    />
                    {errors.avatar && <p className="text-[10px] text-destructive">{errors.avatar.message}</p>}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="coverImage">Cover Image</Label>
                    <Input
                      id="coverImage"
                      type="file"
                      accept="image/*"
                      className="cursor-pointer"
                      {...register("coverImage")}
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
              
              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="underline underline-offset-4 hover:text-primary">
                  Sign in
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <p className="px-6 text-center text-xs text-muted-foreground">
        By clicking continue, you agree to our <a href="#" className="underline underline-offset-4">Terms of Service</a>{" "}
        and <a href="#" className="underline underline-offset-4">Privacy Policy</a>.
      </p>
    </div>
  );
}