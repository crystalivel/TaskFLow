import React, { createContext, useReducer, useEffect, useContext, useMemo } from 'react'
import { AuthContext } from './AuthContext'

const TaskContext = createContext()

const initialState = {
    tasks: JSON.parse(localStorage.getItem('tasks')) || [],
}

const taskReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TASK':
            return { ...state, tasks: [...state.tasks, action.payload] }
        case 'EDIT_TASK':
            return {
                ...state,
                tasks: state.tasks.map((task) =>
                    task.id === action.payload.id ? action.payload : task
                ),
            }
        case 'DELETE_TASK':
            return {
                ...state,
                tasks: state.tasks.filter((task) => task.id !== action.payload),
            }
        case 'TOGGLE_TASK':
            return {
                ...state,
                tasks: state.tasks.map((task) =>
                    task.id === action.payload ? { ...task, completed: !task.completed } : task
                ),
            }
        default:
            return state
    }
}

export const TaskProvider = ({ children }) => {
    const [state, dispatch] = useReducer(taskReducer, initialState)
    const { state: authState } = useContext(AuthContext)
    const userEmail = authState.user?.email

    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(state.tasks))
    }, [state.tasks])

    const addTask = (task) => {
        if (!userEmail) return
        dispatch({ type: 'ADD_TASK', payload: { ...task, id: Date.now().toString(), completed: false, userEmail } })
    }

    const editTask = (task) => {
        dispatch({ type: 'EDIT_TASK', payload: task })
    }

    const deleteTask = (id) => {
        dispatch({ type: 'DELETE_TASK', payload: id })
    }

    const toggleTask = (id) => {
        dispatch({ type: 'TOGGLE_TASK', payload: id })
    }

    const markComplete = (id) => {
        const task = state.tasks.find(t => t.id === id)
        if (task && !task.completed) {
            dispatch({ type: 'TOGGLE_TASK', payload: id })
        }
    }

    const markIncomplete = (id) => {
        const task = state.tasks.find(t => t.id === id)
        if (task && task.completed) {
            dispatch({ type: 'TOGGLE_TASK', payload: id })
        }
    }

    // Filter tasks for the current user
    const userTasks = useMemo(() => {
        if (!userEmail) return []
        return state.tasks.filter(task => task.userEmail === userEmail)
    }, [state.tasks, userEmail])

    return (
        <TaskContext.Provider value={{
            tasks: userTasks,
            addTask,
            editTask,
            deleteTask,
            toggleTask,
            markComplete,
            markIncomplete
        }}>
            {children}
        </TaskContext.Provider>
    )
}

export const useTask = () => useContext(TaskContext)
