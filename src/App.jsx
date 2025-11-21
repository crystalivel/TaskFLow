import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import AddTask from './pages/AddTask'
import TaskDetail from './pages/TaskDetail'
import Landing from './pages/Landing'
import Protectedroutes from './routes/protectedroutes'
import { TaskProvider } from './context/TaskContext'
import { ThemeProvider } from './context/ThemeContext'

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <TaskProvider>
          <Routes>
            <Route path='/' element={<Landing />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/dashboard' element={
              <Protectedroutes>
                <Dashboard />
              </Protectedroutes>} />
            <Route path='/add-task' element={
              <Protectedroutes>
                <AddTask />
              </Protectedroutes>} />
            <Route path='/task/:id' element={
              <Protectedroutes>
                <TaskDetail />
              </Protectedroutes>} />
          </Routes>
        </TaskProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}
