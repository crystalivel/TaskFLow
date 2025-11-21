import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTask } from '../context/TaskContext'
import TaskForm from '../components/Tasks/TaskForm'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TaskDetail() {
    const { id } = useParams()
    const { tasks, editTask } = useTask()
    const navigate = useNavigate()
    const [task, setTask] = useState(null)

    useEffect(() => {
        const foundTask = tasks.find(t => t.id === id)
        if (foundTask) {
            setTask(foundTask)
        } else {
            navigate('/dashboard')
        }
    }, [id, tasks, navigate])

    const handleSubmit = (data) => {
        editTask({ ...task, ...data })
        navigate('/dashboard')
    }

    if (!task) return null

    return (
        <div className="min-h-screen bg-[#222831] flex flex-col items-center py-10 px-4">
            <div className="w-full max-w-xl">
                <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-4 text-[#00ADB5] hover:bg-[#393E46]">
                    ← Back to Dashboard
                </Button>
                <Card className="bg-[#393E46] border-[#00ADB5]">
                    <CardHeader>
                        <CardTitle className="text-[#EEEEEE]">Edit Task</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <TaskForm
                            defaultValues={{
                                title: task.title,
                                description: task.description,
                                priority: task.priority || '',
                                deadline: task.deadline || ''
                            }}
                            onSubmit={handleSubmit}
                            isEditing={true}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
