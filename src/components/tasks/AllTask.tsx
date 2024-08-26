"use client"
import { AddIcon } from "@chakra-ui/icons";
import { Button, Card, CardFooter, CardHeader, Divider } from "@chakra-ui/react";
import AddTask from "../task-actions/AddTask";
import { useQuery } from "@tanstack/react-query";
import { fetchTodos } from "@/actions/fetch-todos";
import { useTask } from "@/providers/TaskProvider";
import { useEffect } from "react";
import { Loader } from "lucide-react";

const AllTask = () => {
    const userId = localStorage.getItem('userId');
    const { setTask, task, setTasks, tasks } = useTask();

    const { data, isLoading } = useQuery({
        queryKey: ["fetch-Todos"],
        queryFn: async () => {
            return await fetchTodos(userId || "");
        },
        staleTime: 0
    });

    useEffect(() => {
        if (data && data.length > 0) {
            setTask(data[0]);
        }
        setTasks(data)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);


    const handleCardClick = (todo: any) => {
        setTask(todo);
    };

    return (
        <div className="w-[30%] p-2 h-full border-r border-gray-400">
            <div className="w-full flex   justify-between p-3 items-center">
                <h2 className="text-2xl font-medium">
                    Tasks
                </h2>
                <AddTask />
            </div>
            <Divider />
            <div className="my-2 gap-2 h-[33.75rem] flex flex-col overflow-hidden overflow-y-scroll no-scrollbar">
                {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loader className="animate-spin" size={32} />
                    </div>
                ) : tasks && tasks.length > 0 ? (
                    tasks.map((todo: any) => (
                        <Card
                            key={todo.id}
                            onClick={() => handleCardClick(todo)}
                            background={task?.id === todo.id ? 'gray.300' : 'white'}
                            className="cursor-pointer transition-all"
                        >
                            <CardHeader padding={"0.3rem"} className="text-2xl font-bold  overflow-hidden line-clamp-1">{todo.title}</CardHeader>
                            <p className=" px-2 my-2 break-words line-clamp-1">{todo.description}</p>
                        </Card>
                    ))
                ) : (
                    <div className="flex justify-center items-center h-full text-gray-500">
                        No tasks available.
                    </div>
                )}
            </div>
        </div>
    );
}

export default AllTask;
