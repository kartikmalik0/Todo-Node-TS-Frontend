"use client"

import { useState, useEffect } from 'react'
import { EditIcon } from "@chakra-ui/icons"
import { Button, useDisclosure, FormControl, FormLabel, Input, Textarea, VStack, useToast } from "@chakra-ui/react"
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
import { updateTodo } from '@/actions/update-todo'
import { useTask } from '@/providers/TaskProvider'
import { fetchTodos } from '@/actions/fetch-todos'

// Zod schema
const todoSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
})

export type TodoFormData = z.infer<typeof todoSchema>

const EditTask: React.FC = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const userId = localStorage.getItem('userId');
    const { task, setTasks, setTask } = useTask()
    const toast = useToast()
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm<TodoFormData>({
        resolver: zodResolver(todoSchema),
        defaultValues: {
            title: '',
            description: '',
        },
    })

    useEffect(() => {
        if (task) {
            setValue('title', task.title)
            setValue('description', task.description || '')
            // setValue('completed', task.completed || false)
        }
    }, [task, setValue])

    const onSubmit = async (data: TodoFormData) => {
        setIsSubmitting(true)
        try {
            if (task && task.id) {
                await updateTodo(task.id, data, userId || "")
                setTasks((prevTasks) =>
                    prevTasks.map((t) =>
                        t.id === task.id ? { ...t, ...data } : t
                    )
                );
                setTask({ id: task.id, ...data })
                toast({
                    title: "Task Edited",
                    description: "Your task has been Edited successfully.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                onClose()
                reset(data)
            } else {
                console.error('No task id available')
                toast({
                    title: "Error",
                    description: "There was an error Editing your task.",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }
        } catch (error) {
            console.error('Error updating todo:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <Button onClick={onOpen}><EditIcon /></Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Edit Task</ModalHeader>
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
                                Update Task
                            </Button>
                            <Button variant='ghost' onClick={onClose}>Cancel</Button>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>
        </>
    )
}

export default EditTask