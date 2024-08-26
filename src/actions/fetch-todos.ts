"use server";

import { revalidatePath } from "next/cache";

export async function fetchTodos(userId: string) {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
        throw new Error("BACKEND_URL is not defined in environment variables");
    }

    try {
        const response = await fetch(`${backendUrl}/api/todos/fetch-todos/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            // credentials: "include"
        });

        if (!response.ok) {
            // You can further process the response to get more details
            const errorData = await response.json();
            throw new Error(`Failed to fetch todos: ${errorData.error || 'Unknown error'}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching todos:", error);
        // Re-throw the error to be handled by the calling function if necessary
        throw error;
    }finally{
        revalidatePath("/")
    }
}
