"use server";

import { FormData } from "@/app/(auth)/register/page";

export async function registerUser(data: FormData) {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
        throw new Error("BACKEND_URL is not defined in environment variables");
    }

    const response = await fetch(`${backendUrl}/api/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Registration failed");
    }

    return response.json();
}
