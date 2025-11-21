import React from 'react'
import TaskForm from '../components/Tasks/TaskForm'
import { useTask } from '../context/TaskContext'
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AddTask() {
    const { addTask } = useTask()
    const navigate = useNavigate()

    const handleSubmit = (data) => {
        addTask(data)
        navigate('/dashboard')
    }

    return (
        <div className="min-h-screen bg-background flex flex-col items-center py-10 px-4">
            <div className="w-full max-w-xl">
                <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-4 text-primary hover:bg-muted">
                    ← Back to Dashboard
                </Button>
                <Card className="bg-card border-primary">
                    <CardHeader>
                        <CardTitle className="text-foreground">Create New Task</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <TaskForm onSubmit={handleSubmit} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
