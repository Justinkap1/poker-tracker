"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Location, Stakes, GameTypes } from "@/lib/interfaces";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required",
    );
  }

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (signUpError) {
    console.error(signUpError.code + " " + signUpError.message);
    return encodedRedirect("error", "/sign-up", signUpError.message);
  } 
  
  const userId = signUpData.user?.id;

  if (!userId) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Something went wrong. Please try again."
    );
  }

  try {
    const { error: stakesError } = await supabase.from("stakes").insert([
      { user_id: userId, stake: "1/2" },
      { user_id: userId, stake: "2/5" },
    ]);

    const { error: gameTypesError } = await supabase.from("game_types").insert([
      { user_id: userId, game_type: "No-Limit Hold'em" },
      { user_id: userId, game_type: "Pot-Limit Omaha" },
    ]);

    const { error: locationsError } = await supabase.from("locations").insert([
      { user_id: userId, location: "Home Game" },
      { user_id: userId, location: "MGM National" },
    ]);

    if (stakesError || gameTypesError || locationsError) {
      console.error("Error inserting default data", {
        stakesError,
        gameTypesError,
        locationsError,
      });
      return encodedRedirect(
        "error",
        "/sign-up",
        "Sign-up successful, but there was an issue setting up your account. Please contact support."
      );
    }
  } catch (error) {
    console.error("Error inserting default data:", error);
    return encodedRedirect(
      "error",
      "/sign-up",
      "Sign-up successful, but there was an issue setting up your account. Please contact support."
    );
  }

  // Redirect on success
  return encodedRedirect(
    "success",
    "/sign-up",
    "Thanks for signing up! Please check your email for a verification link."
  );
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/protected");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export const getUserLocations = async (userId: string): Promise<Location[]> => {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase.from("locations").select("location").eq("user_id", userId)
    if (error) {
        console.error("Error fetching locations:", error.message);
        return []
    } else {
        return data
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    return []
  }
}

export const getUserStakes = async (userId: string): Promise<Stakes[]> => {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase.from("stakes").select("stake").eq("user_id", userId)
    if (error) {
        console.error("Error fetching stakes:", error.message);
        return []
    } else {
        return data
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    return []
  }
}

export const getUserGameTypes = async (userId: string): Promise<GameTypes[]> => {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase.from("game_types").select("game_type").eq("user_id", userId)
    if (error) {
        console.error("Error fetching game types:", error.message);
        return []
    } else {
        return data
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    return []
  }
}