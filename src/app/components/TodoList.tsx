'use client'

import * as React from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { useTodoContext } from "../context/TodolistContext"
import { TodoItem } from "../types/Tdolist"

interface TodoListProps {
  topicId: string
}

export default function TodoList({ topicId }: TodoListProps) {
  const { todoLists, addTodoList, fetchTodoLists } = useTodoContext()

  const [listTitle, setListTitle] = React.useState("")
  const [items, setItems] = React.useState<TodoItem[]>([
    { title: "", isCompleted: false }
  ])

  React.useEffect(() => {
    fetchTodoLists(topicId)
  }, [topicId, fetchTodoLists])

  const handleAddTodoList = async () => {
    if (!listTitle.trim()) {
      alert("Please enter a list title")
      return
    }

    const validItems = items.filter(item => item.title.trim())
    await addTodoList(topicId, listTitle, "", validItems)

    setListTitle("")
    setItems([{ title: "", isCompleted: false }])
  }

  const updateItem = (index: number, updates: Partial<TodoItem>) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], ...updates }
    setItems(newItems)
  }

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (index === items.length - 1) {
        setItems([...items, { title: "", isCompleted: false }])
      }
      setTimeout(() => {
        const nextInput = document.getElementById(`todo-${index + 1}`)
        if (nextInput) nextInput.focus()
      }, 0)
    } else if (e.key === 'Backspace' && items[index].title === '' && items.length > 1) {
      e.preventDefault()
      removeItem(index)
      setTimeout(() => {
        const prevInput = document.getElementById(`todo-${index - 1}`)
        if (prevInput) prevInput.focus()
      }, 0)
    }
  }

  return (
    <div className="w-72 p-4 bg-zinc-900 rounded-lg">
      <input
        type="text"
        value={listTitle}
        onChange={(e) => setListTitle(e.target.value)}
        placeholder="Title"
        className="text-2xl font-semibold text-white mb-4 bg-transparent w-full focus:outline-none placeholder:text-zinc-500"
      />
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Checkbox
              id={`checkbox-${index}`}
              checked={item.isCompleted}
              onCheckedChange={(checked) => updateItem(index, { isCompleted: checked as boolean })}
              className="border-zinc-700 data-[state=checked]:bg-zinc-700 data-[state=checked]:border-zinc-700"
            />
            <input
              id={`todo-${index}`}
              type="text"
              value={item.title}
              onChange={(e) => updateItem(index, { title: e.target.value })}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`text-sm bg-transparent w-full focus:outline-none ${
                item.isCompleted
                  ? 'line-through text-zinc-500'
                  : 'text-zinc-200'
              }`}
              placeholder={index === items.length - 1 ? "Add a task..." : ""}
            />
          </div>
        ))}
      </div>
      <Button 
        onClick={handleAddTodoList}
        className="mt-4 w-full bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
      >
        Save List
      </Button>
      {todoLists.map((list, idx) => (
        <div key={idx} className="mt-4 border-t border-zinc-800 pt-4">
          <h3 className="text-lg font-semibold text-zinc-200">{list.title}</h3>
          <ul className="mt-2 space-y-2">
            {list.items.map((item, index) => (
              <li key={index} className="flex items-center space-x-2">
                <Checkbox
                  checked={item.isCompleted}
                  className="border-zinc-700 data-[state=checked]:bg-zinc-700 data-[state=checked]:border-zinc-700"
                />
                <span className={`text-sm ${item.isCompleted ? 'line-through text-zinc-500' : 'text-zinc-200'}`}>
                  {item.title}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
