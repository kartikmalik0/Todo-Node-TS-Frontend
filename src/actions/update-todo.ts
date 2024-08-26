// actions/update-todo.ts
"use server";

import { TodoFormData } from "@/components/task-actions/EditTodo";
import { revalidatePath } from "next/cache";

export async function updateTodo(
    id: string,
    data: TodoFormData,
    userid: string
) {
    if (!userid) {
        throw new Error("User ID is required");
    }
    if (!id) {
        throw new Error("Todo ID is required");
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
        throw new Error("BACKEND_URL is not defined in environment variables");
    }
    try {
        const response = await fetch(`${backendUrl}/api/todos/update-todo`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userid, id, ...data }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to update todo");
        }

        const result = await response.json();

        // Revalidate the todos list page to reflect the changes
        revalidatePath("/");

        return result;
    } catch (error) {
        console.error("Error updating todo:", error);
        throw error;
    }
}
