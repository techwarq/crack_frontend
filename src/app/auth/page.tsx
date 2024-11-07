'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Mail, Lock, User } from 'lucide-react'

export default function AuthPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('login')

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const form = event.target as HTMLFormElement
    const formData = new FormData(form)
    const body = {
      email: formData.get('email'),
      password: formData.get('password'),
      ...(activeTab === 'signup' && { name: formData.get('name') }),
    }

    const endpoint = activeTab === 'login' ? '/api/auth/login' : '/api/auth/signup'

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        router.push('/') // Redirect to homepage or dashboard
      } else {
        const errorData = await response.json()
        console.error('Error:', errorData.message)
      }
    } catch (error) {
      console.error('An error occurred:', error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <div className="mt-8 bg-white rounded-lg shadow-xl p-6">
            <TabsContent value="login">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Input name="email" type="email" placeholder="Enter your email" required />
                    <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input name="password" type="password" placeholder="Enter your password" required />
                    <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  Login <ArrowRight className="ml-2" size={16} />
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <Input name="name" type="text" placeholder="Enter your full name" required />
                    <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Input name="email" type="email" placeholder="Enter your email" required />
                    <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input name="password" type="password" placeholder="Create a password" required />
                    <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  Sign Up <ArrowRight className="ml-2" size={16} />
                </Button>
              </form>
            </TabsContent>
          </div>
        </Tabs>
      </motion.div>
    </div>
  )
}
