"use client"
import {
    Box,
    Flex,
    Text,
    IconButton,
    Button,
    Stack,
    useColorModeValue,
    useBreakpointValue,
    useDisclosure,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { useEffect, useState } from 'react';

export default function Navbar() {
    const { isOpen, onToggle } = useDisclosure();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check localStorage for userid key
        const userId = localStorage.getItem('userid');
        setIsLoggedIn(!!userId);
    }, []);

    const handleSignOut = () => {
        // Remove userid from localStorage and update state
        localStorage.removeItem('userid');
        setIsLoggedIn(false);
    };

    return (
        <Box>
            <Flex
                bg={useColorModeValue('white', 'gray.800')}
                color={useColorModeValue('gray.600', 'white')}
                minH={'60px'}
                py={{ base: 2 }}
                px={{ base: 4 }}
                borderBottom={1}
                borderStyle={'solid'}
                borderColor={useColorModeValue('gray.200', 'gray.900')}
                align={'center'}>
                <Flex
                    flex={{ base: 1, md: 'auto' }}
                    ml={{ base: -2 }}
                    display={{ base: 'flex', md: 'none' }}>
                    <IconButton
                        onClick={onToggle}
                        icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
                        variant={'ghost'}
                        aria-label={'Toggle Navigation'}
                    />
                </Flex>
                <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
                    <Text
                        textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
                        fontFamily={'heading'}
                        color={useColorModeValue('gray.800', 'white')}>
                        Tasks
                    </Text>
                </Flex>

                <Stack
                    flex={{ base: 1, md: 0 }}
                    justify={'flex-end'}
                    direction={'row'}
                    spacing={6}>
                    {isLoggedIn ? (
                        <Button
                            fontSize={'sm'}
                            fontWeight={600}
                            color={'white'}
                            bg={'teal.400'}
                            onClick={handleSignOut}
                            _hover={{
                                bg: 'teal.300',
                            }}>
                            Sign Out
                        </Button>
                    ) : (
                        <Button
                            fontSize={'sm'}
                            fontWeight={600}
                            color={'white'}
                            bg={'teal.400'}
                            // href={'#'}
                            _hover={{
                                bg: 'teal.300',
                            }}>
                            Sign In
                        </Button>
                    )}
                </Stack>
            </Flex>
        </Box>
    );
}
