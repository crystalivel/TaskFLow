import React, { useState, useEffect } from 'react'
import { useForm } from "react-hook-form"
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

const formSchema = z.object({
    title: z.string().min(2, {
        message: "Title must be at least 2 characters.",
    }),
    description: z.string().optional(),
    priority: z.enum(["low", "medium", "high"]).optional(),
    deadlineDate: z.string().optional(),
    deadlineHour: z.string().optional(),
    deadlineMinute: z.string().optional(),
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
            return new Date(defaultValues.deadline).toISOString().split('T')[0]
        }
        return getTodayDate()
    }

    const getDefaultHour = () => {
        if (defaultValues?.deadline) {
            const date = new Date(defaultValues.deadline)
            return String(date.getHours()).padStart(2, '0')
        }
        return ''
    }

    const getDefaultMinute = () => {
        if (defaultValues?.deadline) {
            const date = new Date(defaultValues.deadline)
            const minutes = date.getMinutes()
            // Round to nearest 5 minutes
            return String(Math.round(minutes / 5) * 5).padStart(2, '0')
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
        },
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

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
                {/* Title and Priority on Same Row */}
                <div className="flex gap-4">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel className="text-[#EEEEEE]">Title</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Task title"
                                        {...field}
                                        className="bg-[#222831] border-[#393E46] text-[#EEEEEE] placeholder:text-[#EEEEEE]/50 focus:border-[#00ADB5]"
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
                                <FormLabel className="text-[#EEEEEE]">Priority</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="bg-[#222831] border-[#393E46] text-[#EEEEEE] focus:border-[#00ADB5]">
                                            <SelectValue placeholder="Priority" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-[#393E46] border-[#00ADB5]">
                                        <SelectItem value="low" className="text-[#EEEEEE] focus:bg-[#222831] focus:text-[#00ADB5]">
                                            Low
                                        </SelectItem>
                                        <SelectItem value="medium" className="text-[#EEEEEE] focus:bg-[#222831] focus:text-[#00ADB5]">
                                            Medium
                                        </SelectItem>
                                        <SelectItem value="high" className="text-[#EEEEEE] focus:bg-[#222831] focus:text-[#00ADB5]">
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
                            <FormLabel className="text-[#EEEEEE]">Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Task description"
                                    {...field}
                                    className="bg-[#222831] border-[#393E46] text-[#EEEEEE] placeholder:text-[#EEEEEE]/50 focus:border-[#00ADB5] min-h-[100px]"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Deadline Section */}
                <div className="space-y-3">
                    <FormLabel className="text-[#EEEEEE]">Deadline</FormLabel>

                    {/* Date and Time - Date separate, Hour/Minute grouped */}
                    <div className="flex gap-4">
                        <FormField
                            control={form.control}
                            name="deadlineDate"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel className="text-[#EEEEEE]/70 text-sm">Date</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="date"
                                            {...field}
                                            className="bg-[#222831] border-[#393E46] text-[#EEEEEE] focus:border-[#00ADB5]"
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
                                        <FormLabel className="text-[#EEEEEE]/70 text-sm">Hour</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-[#222831] border-[#393E46] text-[#EEEEEE] focus:border-[#00ADB5]">
                                                    <SelectValue placeholder="HH" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="bg-[#393E46] border-[#00ADB5] max-h-[200px]">
                                                {hours.map((hour) => (
                                                    <SelectItem
                                                        key={hour}
                                                        value={hour}
                                                        className="text-[#EEEEEE] focus:bg-[#222831] focus:text-[#00ADB5]"
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
                                        <FormLabel className="text-[#EEEEEE]/70 text-sm">Minute</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-[#222831] border-[#393E46] text-[#EEEEEE] focus:border-[#00ADB5]">
                                                    <SelectValue placeholder="MM" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="bg-[#393E46] border-[#00ADB5]">
                                                {minutes.map((minute) => (
                                                    <SelectItem
                                                        key={minute}
                                                        value={minute}
                                                        className="text-[#EEEEEE] focus:bg-[#222831] focus:text-[#00ADB5]"
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

                    <FormDescription className="text-[#EEEEEE]/50">
                        Date defaults to today. Select hour and minute (5-min intervals) for the deadline time.
                    </FormDescription>
                </div>

                <Button type="submit" className="bg-[#00ADB5] hover:bg-[#00ADB5]/90 text-[#222831] w-full">
                    {isEditing ? 'Update Task' : 'Add Task'}
                </Button>
            </form>
        </Form>
    )
}
