"use client"

import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

interface Task {
    id: string;
    description?: string;
    title: string;
    isCompleted?: boolean;
}

interface TaskContextType {
    task: Task;
    setTask: Dispatch<SetStateAction<Task>>;
    tasks: Task[];
    setTasks: Dispatch<SetStateAction<Task[]>>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTask = (): TaskContextType => {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error('useTask must be used within a TaskProvider');
    }
    return context;
};

export const TaskProvider = ({ children }: { children: ReactNode }) => {
    const [task, setTask] = useState<Task>({ id: "", description: "", title: "" });
    const [tasks, setTasks] = useState<Task[]>([]);

    return (
        <TaskContext.Provider value={{ task, setTask, tasks, setTasks }}>
            {children}
        </TaskContext.Provider>
    );
};