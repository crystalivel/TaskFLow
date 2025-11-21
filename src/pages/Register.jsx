import React, { useState, useContext, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react'

const registerSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string().min(6, { message: "Confirm password must be at least 6 characters" }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

export default function Register() {
    const { state, dispatch } = useContext(AuthContext)
    const navigate = useNavigate()

    useEffect(() => {
        if (state.isAuthenticated) {
            navigate('/dashboard')
        }
    }, [state.isAuthenticated, navigate])

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [errors, setErrors] = useState({})
    const [touched, setTouched] = useState({})
    const [generalError, setGeneralError] = useState('')

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: undefined })
        }
        setGeneralError('')
        setTouched({ ...touched, [e.target.name]: true })
    }

    const isFieldValid = (fieldName) => {
        if (!touched[fieldName] || !form[fieldName]) return null
        try {
            switch (fieldName) {
                case 'name':
                    return form.name.length >= 1 && !errors.name
                case 'email':
                    return z.string().email().safeParse(form.email).success && !errors.email
                case 'password':
                    return form.password.length >= 6 && !errors.password
                case 'confirmPassword':
                    return form.confirmPassword.length >= 6 && form.confirmPassword === form.password && !errors.confirmPassword
                default:
                    return null
            }
        } catch {
            return false
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const result = registerSchema.safeParse(form)

        if (!result.success) {
            const fieldErrors = {}
            let errorCount = 0
            result.error?.errors?.forEach((error) => {
                const fieldName = error.path?.[0]
                if (fieldName) {
                    fieldErrors[fieldName] = error.message
                    errorCount++
                }
            })
            setErrors(fieldErrors)
            if (errorCount > 0) {
                setGeneralError(`Please fix ${errorCount} error${errorCount > 1 ? 's' : ''} before submitting.`)
            } else {
                setGeneralError('')
            }
            setTouched({ name: true, email: true, password: true, confirmPassword: true })
            return
        }

        // Check if user already exists
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || []
        const userExists = registeredUsers.some(u => u.email === form.email)

        if (userExists) {
            setGeneralError('An account with this email already exists.')
            return
        }

        // Register new user
        const newUser = { name: form.name, email: form.email, password: form.password }
        localStorage.setItem('registeredUsers', JSON.stringify([...registeredUsers, newUser]))

        setErrors({})
        setGeneralError('')
        dispatch({ type: 'register', payload: { name: form.name, email: form.email } })
    }

    const renderFieldIcon = (fieldName) => {
        const valid = isFieldValid(fieldName)
        if (valid === null) return null

        if (valid) {
            return <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
        } else if (errors[fieldName]) {
            return <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />
        }
        return null
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <Card className="w-full max-w-md bg-card border-primary">
                <CardHeader>
                    <CardTitle className="text-2xl text-foreground">Register</CardTitle>
                    <CardDescription className="text-muted-foreground">Create a new account to get started.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {generalError && (
                            <Alert variant="destructive" className="bg-red-500/10 border-red-500">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription className="text-red-500">
                                    {generalError}
                                </AlertDescription>
                            </Alert>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-foreground">Name</Label>
                            <div className="relative">
                                <Input
                                    id="name"
                                    type="text"
                                    name="name"
                                    placeholder="John Doe"
                                    value={form.name}
                                    onChange={handleChange}
                                    className={`bg-muted border-border text-foreground placeholder:text-muted-foreground pr-10 ${errors.name ? 'border-red-500 focus:border-red-500' : isFieldValid('name') ? 'border-green-500' : ''}`}
                                />
                                {renderFieldIcon('name')}
                            </div>
                            {errors.name && <p className="text-sm text-red-500 flex items-center gap-1"><XCircle className="h-4 w-4" />{errors.name}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-foreground">Email</Label>
                            <div className="relative">
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="m@example.com"
                                    value={form.email}
                                    onChange={handleChange}
                                    className={`bg-muted border-border text-foreground placeholder:text-muted-foreground pr-10 ${errors.email ? 'border-red-500 focus:border-red-500' : isFieldValid('email') ? 'border-green-500' : ''}`}
                                />
                                {renderFieldIcon('email')}
                            </div>
                            {errors.email && <p className="text-sm text-red-500 flex items-center gap-1"><XCircle className="h-4 w-4" />{errors.email}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-foreground">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    className={`bg-muted border-border text-foreground placeholder:text-muted-foreground pr-10 ${errors.password ? 'border-red-500 focus:border-red-500' : isFieldValid('password') ? 'border-green-500' : ''}`}
                                />
                                {renderFieldIcon('password')}
                            </div>
                            {errors.password && <p className="text-sm text-red-500 flex items-center gap-1"><XCircle className="h-4 w-4" />{errors.password}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-foreground">Confirm Password</Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    name="confirmPassword"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    className={`bg-muted border-border text-foreground placeholder:text-muted-foreground pr-10 ${errors.confirmPassword ? 'border-red-500 focus:border-red-500' : isFieldValid('confirmPassword') ? 'border-green-500' : ''}`}
                                />
                                {renderFieldIcon('confirmPassword')}
                            </div>
                            {errors.confirmPassword && <p className="text-sm text-red-500 flex items-center gap-1"><XCircle className="h-4 w-4" />{errors.confirmPassword}</p>}
                        </div>
                        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Register</Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button variant="link" onClick={() => navigate('/login')} className="text-primary">
                        Already have an account? Login
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
