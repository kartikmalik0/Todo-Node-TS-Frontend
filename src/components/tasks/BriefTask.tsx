"use client"

import { deleteTodo } from "@/actions/delete-todo"
import { useTask } from "@/providers/TaskProvider"
import { DeleteIcon } from "@chakra-ui/icons"
import { Button, useToast } from "@chakra-ui/react"
import { Pencil } from "lucide-react"
import EditTask from "../task-actions/EditTodo"
import { title } from "process"

const BriefTask = () => {

    const userId = localStorage.getItem('userId');
    const { task, setTasks, setTask } = useTask()
    const toast = useToast()
    return (
        <div className="w-full p-2">
            <div className="flex gap-2 justify-end border-b border-gray-400 h-16 ">
                <Button colorScheme="red" onClick={async () => {
                    await deleteTodo({ id: task.id, userid: userId || "" })
                    setTasks((prevTasks) => prevTasks.filter((t) => t.id !== task.id));
                    setTask({ id: "", description: "", title: "" })
                    toast({
                        title: "Task Deleted",
                        // description: "Your task has been  successfully.",
                        status: "success",
                        duration: 3000,
                        isClosable: true,
                    });
                }
                }>
                    <DeleteIcon />
                </Button>
                <EditTask />
            </div>
            <div className="p-4 overflow-hidden break-words">
                <h1 className="text-3xl font-bold underline my-2">{task.title}</h1>
                <p className="text-gray-500">{task.description}</p>
            </div>
        </div>
    )
}

export default BriefTask
