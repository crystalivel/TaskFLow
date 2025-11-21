import React, { useState, useEffect } from 'react'
import { useTask } from '../../context/TaskContext'
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Circle, Edit2, Trash2, Calendar, Clock, AlertCircle } from 'lucide-react'

// Helper function to calculate time remaining
const getTimeRemaining = (deadline) => {
    if (!deadline) return null

    const now = new Date()
    const deadlineDate = new Date(deadline)
    const diffMs = deadlineDate - now

    if (diffMs < 0) return { status: 'overdue', text: 'Overdue', color: 'red' }

    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffMinutes < 60) {
        // Less than 1 hour - Show minutes and seconds countdown
        const minutes = Math.floor(diffMinutes)
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000)
        return {
            status: 'critical',
            text: `${minutes}m ${seconds}s`,
            color: 'red',
            minutes,
            seconds,
            needsUpdate: true // Flag to indicate this needs live updates
        }
    } else if (diffHours < 24) {
        // Less than 24 hours - URGENT
        return {
            status: 'urgent',
            text: `${diffHours}h remaining`,
            color: 'red',
            hours: diffHours
        }
    } else if (diffDays <= 3) {
        // 1-3 days - SOON
        return {
            status: 'soon',
            text: `${diffDays} day${diffDays > 1 ? 's' : ''} remaining`,
            color: 'yellow',
            days: diffDays
        }
    } else if (diffDays <= 7) {
        // 4-7 days - OK
        return {
            status: 'ok',
            text: `${diffDays} days remaining`,
            color: 'blue',
            days: diffDays
        }
    } else {
        // More than 7 days - PLENTY OF TIME
        return {
            status: 'plenty',
            text: `${diffDays} days remaining`,
            color: 'green',
            days: diffDays
        }
    }
}

export default function TaskCard({ task }) {
    const { toggleTask, deleteTask } = useTask()
    const navigate = useNavigate()

    // State for live countdown updates
    const [currentTime, setCurrentTime] = useState(new Date())

    const timeRemaining = getTimeRemaining(task.deadline)

    // Update countdown every second if deadline is less than 1 hour
    useEffect(() => {
        if (timeRemaining?.needsUpdate && !task.completed) {
            const interval = setInterval(() => {
                setCurrentTime(new Date())
            }, 1000) // Update every second

            return () => clearInterval(interval)
        }
    }, [timeRemaining?.needsUpdate, task.completed])

    const handleToggle = () => {
        toggleTask(task.id)
    }

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            deleteTask(task.id)
        }
    }

    const handleEdit = () => {
        navigate(`/task/${task.id}`)
    }

    // Define colors based on time remaining status
    const getDeadlineColors = () => {
        if (!timeRemaining) return {}

        switch (timeRemaining.status) {
            case 'critical':
                return {
                    bg: 'bg-red-600/30',
                    border: 'border-red-500',
                    text: 'text-red-500',
                    icon: AlertCircle
                }
            case 'overdue':
                return {
                    bg: 'bg-red-500/20',
                    border: 'border-red-500',
                    text: 'text-red-500',
                    icon: AlertCircle
                }
            case 'urgent':
                return {
                    bg: 'bg-red-500/20',
                    border: 'border-red-500',
                    text: 'text-red-500',
                    icon: AlertCircle
                }
            case 'soon':
                return {
                    bg: 'bg-yellow-500/20',
                    border: 'border-yellow-500',
                    text: 'text-yellow-500',
                    icon: Clock
                }
            case 'ok':
                return {
                    bg: 'bg-blue-500/20',
                    border: 'border-blue-500',
                    text: 'text-blue-500',
                    icon: Calendar
                }
            case 'plenty':
                return {
                    bg: 'bg-green-500/20',
                    border: 'border-green-500',
                    text: 'text-green-500',
                    icon: Calendar
                }
            default:
                return {
                    bg: 'bg-primary/20',
                    border: 'border-primary',
                    text: 'text-primary',
                    icon: Calendar
                }
        }
    }

    const deadlineColors = getDeadlineColors()
    const DeadlineIcon = deadlineColors.icon || Calendar

    return (
        <Card className="bg-card border border-border hover:border-primary transition-all duration-300 shadow-lg hover:shadow-primary/20">
            <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                        <CardTitle className={`text-2xl font-bold transition-all ${task.completed
                            ? 'line-through text-muted-foreground'
                            : 'text-foreground'
                            }`}>
                            {task.title}
                        </CardTitle>
                        <div className="flex items-center gap-2 flex-wrap">
                            {task.completed && (
                                <Badge className="bg-green-500/20 text-green-500 border border-green-500 hover:bg-green-500/30">
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    Completed
                                </Badge>
                            )}
                            {task.priority && (
                                <Badge
                                    variant="secondary"
                                    className={`border ${task.priority === 'high'
                                        ? 'bg-red-500/20 text-red-500 border-red-500'
                                        : task.priority === 'medium'
                                            ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500'
                                            : 'bg-blue-500/20 text-blue-500 border-blue-500'
                                        }`}
                                >
                                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                                </Badge>
                            )}
                            {timeRemaining && !task.completed && (
                                <Badge
                                    className={`${deadlineColors.bg} ${deadlineColors.text} border ${deadlineColors.border} hover:${deadlineColors.bg} font-semibold ${timeRemaining.status === 'overdue' || timeRemaining.status === 'urgent' || timeRemaining.status === 'critical' ? 'animate-pulse' : ''
                                        }`}
                                >
                                    <DeadlineIcon className="w-3 h-3 mr-1" />
                                    {timeRemaining.text}
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                        {!task.completed ? (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleToggle}
                                className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white hover:border-green-500 transition-all"
                            >
                                <CheckCircle2 className="w-4 h-4 sm:mr-2" />
                                <span className="hidden sm:inline">Complete</span>
                            </Button>
                        ) : (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleToggle}
                                className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white hover:border-yellow-500 transition-all"
                            >
                                <Circle className="w-4 h-4 sm:mr-2" />
                                <span className="hidden sm:inline">Reopen</span>
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleEdit}
                            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                        >
                            <Edit2 className="w-4 h-4 sm:mr-2" />
                            <span className="hidden sm:inline">Edit</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDelete}
                            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
                        >
                            <Trash2 className="w-4 h-4 sm:mr-2" />
                            <span className="hidden sm:inline">Delete</span>
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-0 space-y-3">
                <p className={`text-base leading-relaxed ${task.completed ? 'text-muted-foreground' : 'text-foreground/80'
                    }`}>
                    {task.description || 'No description provided'}
                </p>
                {task.deadline && (
                    <div className={`flex items-center gap-2 text-sm p-3 rounded-lg border ${task.completed
                        ? 'bg-muted/50 border-border text-muted-foreground'
                        : `${deadlineColors.bg} ${deadlineColors.border} ${deadlineColors.text}`
                        }`}>
                        <Calendar className="w-4 h-4" />
                        <span className="font-medium">
                            Deadline: {new Date(task.deadline).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </span>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
