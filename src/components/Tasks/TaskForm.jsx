import React, { useState, useEffect } from 'react'
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2 } from "lucide-react"

const formSchema = z.object({
    title: z.string().min(2, {
        message: "Title must be at least 2 characters.",
    }),
    description: z.string().optional(),
    priority: z.enum(["low", "medium", "high"]).optional(),
    deadlineDate: z.string().optional(),
    deadlineHour: z.string().optional(),
    deadlineMinute: z.string().optional(),
    steps: z.array(z.object({
        text: z.string().min(1, "Step cannot be empty"),
        completed: z.boolean().default(false)
    })).optional()
})

export default function TaskForm({ defaultValues, onSubmit, isEditing = false }) {
    // Get today's date in YYYY-MM-DD format
    const getTodayDate = () => {
        const today = new Date()
        return today.toISOString().split('T')[0]
    }

    // Split existing deadline into date and time if editing
    const getDefaultDate = () => {
        if (defaultValues?.deadline) {
            const date = new Date(defaultValues.deadline)
            if (!isNaN(date.getTime())) {
                return date.toISOString().split('T')[0]
            }
        }
        return getTodayDate()
    }

    const getDefaultHour = () => {
        if (defaultValues?.deadline) {
            const date = new Date(defaultValues.deadline)
            if (!isNaN(date.getTime())) {
                return String(date.getHours()).padStart(2, '0')
            }
        }
        return ''
    }

    const getDefaultMinute = () => {
        if (defaultValues?.deadline) {
            const date = new Date(defaultValues.deadline)
            if (!isNaN(date.getTime())) {
                const minutes = date.getMinutes()
                // Round to nearest 5 minutes
                return String(Math.round(minutes / 5) * 5).padStart(2, '0')
            }
        }
        return ''
    }

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: defaultValues?.title || "",
            description: defaultValues?.description || "",
            priority: defaultValues?.priority || "",
            deadlineDate: getDefaultDate(),
            deadlineHour: getDefaultHour(),
            deadlineMinute: getDefaultMinute(),
            steps: defaultValues?.steps || []
        },
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "steps"
    })

    const handleFormSubmit = (data) => {
        // Combine date and time into ISO datetime string
        let deadline = ''
        if (data.deadlineDate) {
            const hour = data.deadlineHour || '23'
            const minute = data.deadlineMinute || '59'
            deadline = `${data.deadlineDate}T${hour}:${minute}`
        }

        // Remove the separate date/time fields and add combined deadline
        const { deadlineDate, deadlineHour, deadlineMinute, ...rest } = data
        const taskData = {
            ...rest,
            deadline: deadline || undefined
        }

        onSubmit(taskData)
    }

    // Generate hour options (00-23)
    const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))

    // Generate minute options (every 5 minutes: 00, 05, 10, ..., 55)
    const minutes = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'))

    const steps = form.watch('steps') || []
    const completedSteps = steps.filter(s => s.completed).length
    const totalSteps = steps.length
    const progress = totalSteps === 0 ? 0 : Math.round((completedSteps / totalSteps) * 100)

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
                {/* Progress Bar */}
                {totalSteps > 0 && (
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Progress</span>
                            <span>{progress}%</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all duration-300 ease-in-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Title and Priority on Same Row */}
                <div className="flex gap-4">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel className="text-foreground">Title</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Task title"
                                        {...field}
                                        className="bg-background border-input text-foreground placeholder:text-muted-foreground focus:border-primary"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="priority"
                        render={({ field }) => (
                            <FormItem className="w-48">
                                <FormLabel className="text-foreground">Priority</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="bg-background border-input text-foreground focus:border-primary">
                                            <SelectValue placeholder="Priority" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-popover border-border">
                                        <SelectItem value="low" className="text-popover-foreground focus:bg-accent focus:text-accent-foreground">
                                            Low
                                        </SelectItem>
                                        <SelectItem value="medium" className="text-popover-foreground focus:bg-accent focus:text-accent-foreground">
                                            Medium
                                        </SelectItem>
                                        <SelectItem value="high" className="text-popover-foreground focus:bg-accent focus:text-accent-foreground">
                                            High
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-foreground">Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Task description"
                                    {...field}
                                    className="bg-background border-input text-foreground placeholder:text-muted-foreground focus:border-primary min-h-[100px]"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Steps Section */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <FormLabel className="text-foreground">Steps (Optional)</FormLabel>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => append({ text: "", completed: false })}
                            className="text-primary border-primary hover:bg-primary/10"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Step
                        </Button>
                    </div>
                    <div className="space-y-2">
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex items-center gap-2">
                                <FormField
                                    control={form.control}
                                    name={`steps.${index}.completed`}
                                    render={({ field }) => (
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                                        />
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`steps.${index}.text`}
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder={`Step ${index + 1}`}
                                                    className="bg-background border-input text-foreground focus:border-primary"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => remove(index)}
                                    className="text-destructive hover:bg-destructive/10"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Deadline Section */}
                <div className="space-y-3">
                    <FormLabel className="text-foreground">Deadline</FormLabel>

                    {/* Date and Time - Date separate, Hour/Minute grouped */}
                    <div className="flex gap-4">
                        <FormField
                            control={form.control}
                            name="deadlineDate"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel className="text-muted-foreground text-sm">Date</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="date"
                                            {...field}
                                            className="bg-background border-input text-foreground focus:border-primary"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex gap-2">
                            <FormField
                                control={form.control}
                                name="deadlineHour"
                                render={({ field }) => (
                                    <FormItem className="w-24">
                                        <FormLabel className="text-muted-foreground text-sm">Hour</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-background border-input text-foreground focus:border-primary">
                                                    <SelectValue placeholder="HH" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="bg-popover border-border max-h-[200px]">
                                                {hours.map((hour) => (
                                                    <SelectItem
                                                        key={hour}
                                                        value={hour}
                                                        className="text-popover-foreground focus:bg-accent focus:text-accent-foreground"
                                                    >
                                                        {hour}:00
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="deadlineMinute"
                                render={({ field }) => (
                                    <FormItem className="w-24">
                                        <FormLabel className="text-muted-foreground text-sm">Minute</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-background border-input text-foreground focus:border-primary">
                                                    <SelectValue placeholder="MM" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="bg-popover border-border">
                                                {minutes.map((minute) => (
                                                    <SelectItem
                                                        key={minute}
                                                        value={minute}
                                                        className="text-popover-foreground focus:bg-accent focus:text-accent-foreground"
                                                    >
                                                        :{minute}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <FormDescription className="text-muted-foreground">
                        Date defaults to today. Select hour and minute (5-min intervals) for the deadline time.
                    </FormDescription>
                </div>

                <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground w-full">
                    {isEditing ? 'Update Task' : 'Add Task'}
                </Button>
            </form>
        </Form>
    )
}
