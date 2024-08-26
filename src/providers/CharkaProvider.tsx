'use client'

import { ChakraProvider } from "@chakra-ui/react"


export function ChkraProvider({ children }: { children: React.ReactNode }) {
  return <ChakraProvider>{children}</ChakraProvider>
}