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
        <div className="min-h-screen bg-background flex flex-col items-center py-10 px-4">
            <div className="w-full max-w-xl">
                <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-4 text-primary hover:bg-muted">
                    ← Back to Dashboard
                </Button>
                <Card className="bg-card border-primary">
                    <CardHeader>
                        <CardTitle className="text-foreground">Edit Task</CardTitle>
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
