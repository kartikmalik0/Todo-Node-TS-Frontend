"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
    useToast,
} from '@chakra-ui/react';
import Link from 'next/link';
import { FormData } from '../register/page';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/actions/login-user';
import { useAuth } from '@/providers/AuthProvider';

// Define the validation schema
const schema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const Login = () => {

    const router = useRouter()

    const userId = localStorage.getItem('userId');
    if (userId) {
        router.push("/")
    }
    const toast = useToast()
    const formBackground = useColorModeValue('gray.100', 'gray.700');

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: FormData) => {

        try {
            const res = await loginUser(data);
            toast({
                title: "Login successful",
                description: "You have successfully Login.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            localStorage.setItem('userId', res.userId);
            router.push("/")
        } catch (error) {
            toast({
                title: "Invalid Email and Password",
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
                <Heading mb={6}>Log In</Heading>
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
                    Log In
                </Button>
                <Box>
                    Don&#39;t have an account?{' '}
                    <Link href="/register" className='text-blue-500'>Register</Link>
                </Box>
            </Flex>
        </Flex>
    );
};

export default Login;
