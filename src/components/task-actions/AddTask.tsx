"use client"

import { useState } from 'react'
import { AddIcon } from "@chakra-ui/icons"
import { Button, useDisclosure, FormControl, FormLabel, Input, Textarea, VStack } from "@chakra-ui/react"
import { useToast } from "@chakra-ui/react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { createTodo } from '@/actions/create-todo'
import { useTask } from '@/providers/TaskProvider'

// Zod schema
const todoSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
})

export type TodoFormData = z.infer<typeof todoSchema>

// Server action


const AddTask = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const userId = localStorage.getItem('userId');
    const { setTasks } = useTask()
    const toast = useToast()
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<TodoFormData>({
        resolver: zodResolver(todoSchema),
    })

    const onSubmit = async (data: TodoFormData) => {
        setIsSubmitting(true)
        try {
            const newTask = await createTodo(data, userId || "")
            setTasks((prevTasks) => [...prevTasks, newTask]);
            toast({
                title: "Task Created",
                description: "Your task has been created successfully.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            onClose()
            reset()
        } catch (error) {
            toast({
                title: "Error",
                description: "There was an error creating your task.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <Button onClick={onOpen}><AddIcon /></Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add New Task</ModalHeader>
                    <ModalCloseButton />
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <ModalBody>
                            <VStack spacing={4}>
                                <FormControl isInvalid={!!errors.title}>
                                    <FormLabel htmlFor="title">Title</FormLabel>
                                    <Input id="title" {...register('title')} />
                                    {errors.title && <span>{errors.title.message}</span>}
                                </FormControl>
                                <FormControl>
                                    <FormLabel htmlFor="description">Description</FormLabel>
                                    <Textarea id="description" {...register('description')} />
                                </FormControl>
                            </VStack>
                        </ModalBody>

                        <ModalFooter>
                            <Button colorScheme='teal' mr={3} type="submit" isLoading={isSubmitting}>
                                Add Task
                            </Button>
                            <Button variant='ghost' onClick={onClose}>Cancel</Button>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>
        </>
    )
}

export default AddTask