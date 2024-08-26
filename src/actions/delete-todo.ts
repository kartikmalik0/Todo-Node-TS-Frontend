"use server";

import { revalidatePath } from "next/cache";

interface DeleteTodoParams {
    id: string;
    userid: string;
}

export async function deleteTodo({ id, userid }: DeleteTodoParams) {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    if (!backendUrl) {
        throw new Error("BACKEND_URL is not defined in environment variables");
    }

    if (!id) {
        throw new Error("Todo ID is required");
    }

    try {
        const response = await fetch(`${backendUrl}/api/todos/delete-todo`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id, userid }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to delete todo");
        }

        const result = await response.json();

        // Revalidate the todos list page to reflect the changes
        revalidatePath("/");

        return result;
    } catch (error) {
        console.error("Error deleting todo:", error);
        throw error;
    } finally {
        revalidatePath("/");
    }
}
