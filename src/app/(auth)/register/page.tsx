"use client";

import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@chakra-ui/react'
import {
    Flex,
    Heading,
    Input,
    Button,
    FormControl,
    FormLabel,
    FormErrorMessage,
    useColorModeValue,
    Box,
} from '@chakra-ui/react';
import Link from 'next/link';
import { registerUser } from '@/actions/register-user';
import { useRouter } from 'next/navigation';

// Define the validation schema
const schema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export type FormData = z.infer<typeof schema>;

const Register = () => {

    const router = useRouter()

    const formBackground = useColorModeValue('gray.100', 'gray.700');
    const toast = useToast()
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        try {
            await registerUser(data);
            toast({
                title: "Registration successful",
                description: "You have successfully registered.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            router.push("/login")
        } catch (error) {
            toast({
                title: "Registration failed",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <Flex h="100vh" w="100wh" alignItems="center" justifyContent="center">
            <Flex
                as="form"
                onSubmit={handleSubmit(onSubmit)}
                flexDirection="column"
                bg={formBackground}
                p={12}
                borderRadius={8}
                boxShadow="lg"
            >
                <Heading mb={6}>Register</Heading>
                <FormControl isInvalid={!!errors.email} mb={3}>
                    <FormLabel>Email</FormLabel>
                    <Input
                        {...register('email')}
                        placeholder="johndoe@gmail.com"
                        type="email"
                        variant="filled"
                    />
                    <FormErrorMessage>
                        {errors.email?.message?.toString() || 'Invalid email'}
                    </FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!errors.password} mb={6}>
                    <FormLabel>Password</FormLabel>
                    <Input
                        {...register('password')}
                        placeholder="**********"
                        type="password"
                        variant="filled"
                    />
                    <FormErrorMessage>
                        {errors.password?.message?.toString() || 'Invalid password'}
                    </FormErrorMessage>
                </FormControl>
                <Button colorScheme="teal" mb={8} isLoading={isSubmitting} type="submit">
                    Register
                </Button>
                <Box>
                    Don&#39;t have an account?{' '}
                    <Link href="/login" className='text-blue-500'>Login</Link>
                </Box>
            </Flex>
        </Flex>
    );
};

export default Register;
