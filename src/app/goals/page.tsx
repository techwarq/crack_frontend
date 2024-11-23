"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getGoals, postGoals } from "../action/backend";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
}

type Goal = {
  id: string;
  title: string;
  description: string;
  topics?: []; // Adjusted to use any[] type
};

export default function Goals() {
  const [user, setUser] = useState<User | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newTitle, setNewTitle] = useState<string>("");
  const [newDescription, setNewDescription] = useState<string>("");
  const router = useRouter(); 


  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("An error occurred while fetching user data:", error);
      }
    }
    async function fetchGoals() {
      const fetchedGoals = await getGoals();
      setGoals(fetchedGoals);
    }
   

    fetchGoals();
    fetchUser();
  }, []);

  const handleSubmit = async() =>{
    try {
      const newGoal = await postGoals(newTitle, newDescription);
      if(newGoal){
        setGoals((prevGoals) => [...prevGoals, newGoal]);
        setNewTitle("");
        setNewDescription("")
      }
    } catch (error) {
      
    }
    
  }

  const handleGoalClick = (id: string) => {
    // Navigate to the topics page for the selected goal
    router.push(`/goals/${id}/topics`);
  };
  

  
  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

      {user ? (
        <>
          <header className="relative z-20 container mx-auto py-4 flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold"
            >
              {user.name}s Goals

              <div className="mt-2"> {/* Add margin to bring button below */}
              <Dialog >
      <DialogTrigger asChild>
        <Button variant="default">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-purple-500">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when youre done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Title
            </Label>
            <Input
              id="name"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Description
            </Label>
            <Input
              id="username"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

      </div>
            </motion.div>
            
          </header>

          <div className="container  cursor-pointer mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10 px-4">
            {goals.length > 0 ? (
              goals.map((goal) => (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-4 bg-purple-800/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-purple-600/20 transition-all" onClick={() => handleGoalClick(goal.id)}
                >
                  <h3 className="text-2xl font-semibold">{goal.title}</h3>
                  <p className="text-gray-300">{goal.description}</p>
                </motion.div>
              ))
            ) : (
              <div className="text-center text-lg text-gray-400 col-span-full">
                <p>No goals found.</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="text-center text-2xl font-semibold pt-10">Loading...</div>
      )}
    </div>
  );
}