import React, { createContext, useReducer, useEffect, useContext } from 'react'

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

    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(state.tasks))
    }, [state.tasks])

    const addTask = (task) => {
        dispatch({ type: 'ADD_TASK', payload: { ...task, id: Date.now().toString(), completed: false } })
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

    return (
        <TaskContext.Provider value={{
            tasks: state.tasks,
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
