"use client"
import AllTask from "@/components/tasks/AllTask";
import BriefTask from "@/components/tasks/BriefTask";
import { useAuth } from "@/providers/AuthProvider";
import { TaskProvider } from "@/providers/TaskProvider";
import { Box, Card, CardBody, Divider, HStack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter()
  const userId = localStorage.getItem('userId');
  if (!userId) {
    router.push("/login")
  }
  return (
    <Box w={"100wh"} h={"100dvh"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
      <Card w={"60%"} h={"80%"}>
        <CardBody>
          <Box padding={"2rem"} className=" h-full w-full flex" >
            <TaskProvider>
              <AllTask />
              <BriefTask />
            </TaskProvider>
          </Box>
        </CardBody>
      </Card>
    </Box>
  );
}
