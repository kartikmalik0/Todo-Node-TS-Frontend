"use server";

import { TodoFormData } from "@/components/task-actions/AddTask";
import { revalidatePath } from "next/cache";

export async function createTodo(data: TodoFormData, userId: string) {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
        throw new Error("BACKEND_URL is not defined in environment variables");
    }

    try {
        const response = await fetch(`${backendUrl}/api/todos/create-todo`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userid: userId,
                ...data,
            }),
        });

        if (!response.ok) {
            // You can further process the response to get more details
            const errorData = await response.json();
            throw new Error(
                `Failed to create todo: ${errorData.error || "Unknown error"}`
            );
        }

        return await response.json();
    } catch (error) {
        console.error("Error creating todo:", error);
        throw error;
    } finally {
        revalidatePath("/");
    }
}
