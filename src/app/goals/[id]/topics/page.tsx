'use client';

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getTopics, postTopics } from "../../../action/backend";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";


interface User {
  id: string;
  name: string;
  email: string;
}

type Topic = {
  id: string;
  title: string;
  description?: string;
  goalId: string;
};

export default function Topics({ params }: { params: Promise<{ id: string }> }) {
  const [goalId, setGoalId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newDescription, setNewDescription] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);


  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch user data
        const userResponse = await fetch('/api/auth/me');
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData);
        } else {
          console.error('Failed to fetch user data');
        }

        // Fetch goalId from params (unwrap the Promise)
        const paramsData = await params;
        setGoalId(paramsData.id);

        // Fetch topics data using goalId
        if (paramsData.id) {
          const fetchedTopics = await getTopics(paramsData.id);
          setTopics(fetchedTopics);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, [params]);

  const resetForm = () => {
    setNewTitle('');
    setNewDescription('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      if (goalId && newTitle && newDescription) {
        const newTopic = await postTopics(goalId, newTitle, newDescription);

        if (newTopic) {
          setTopics((prevTopics) => [...prevTopics, newTopic]);
          resetForm();
          setIsDialogOpen(false);
        }
      }
    } catch (error) {
      console.error('Failed to post new topic:', error);
    } finally {
      setIsSubmitting(false);
    }
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
              {user.name} Topics
              <div className="mt-2">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="default">Add New Topic</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] bg-purple-500">
                    <form onSubmit={handleSubmit}>
                      <DialogHeader>
                        <DialogTitle>Add Topic</DialogTitle>
                        <DialogDescription>
                          Enter details for the new topic. Click save when done.
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
                            required
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="description" className="text-right">
                            Description
                          </Label>
                          <Input
                            id="description"
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                            className="col-span-3"
                            required
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button 
                          type="submit" 
                          disabled={isSubmitting || !newTitle || !newDescription}
                        >
                          {isSubmitting ? 'Saving...' : 'Save changes'}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </motion.div>
          </header>

          <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10 px-4">
            {topics.length > 0 ? (
              topics.map((topic) => (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-4 bg-purple-800/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-purple-600/20 transition-all"
                >
                  <Link href={`/${topic.id}`}>
                   
                      <h3 className="text-2xl font-semibold">{topic.title}</h3>
                      <p className="text-gray-300">{topic.description}</p>
                    
                  </Link>
                </motion.div>
              ))
            ) : (
              <div className="text-center text-lg text-gray-400 col-span-full">
                <p>No topics found.</p>
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