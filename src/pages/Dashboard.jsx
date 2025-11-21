import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useTask } from '../context/TaskContext'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import TaskCard from '../components/Tasks/TaskCard'
import ThemeToggle from '../components/ThemeToggle'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Home, Plus, CheckCircle2, Circle, User, LogOut, ListTodo } from 'lucide-react'

export default function Dashboard() {
  const { state, dispatch } = useContext(AuthContext)
  const { tasks } = useTask()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch({ type: 'logout' })
    navigate('/')
  }

  const completedTasks = tasks.filter(t => t.completed).length
  const pendingTasks = tasks.filter(t => !t.completed).length

  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen bg-background">
        {/* Sidebar */}
        <Sidebar className="border-r border-border">
          <SidebarHeader className="border-b border-border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                  <ListTodo className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">Task Manager</h2>
                  <p className="text-xs text-muted-foreground">Stay Organized</p>
                </div>
              </div>
              <ThemeToggle />
            </div>
          </SidebarHeader>

          <SidebarContent>
            {/* User Info */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-primary text-xs uppercase tracking-wider">
                User
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-4 py-3 bg-muted rounded-lg mx-2">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                      <User className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">
                        {state?.user?.name || state?.user?.email || 'User'}
                      </p>
                      {state?.user?.email && state?.user?.name && (
                        <p className="text-xs text-muted-foreground truncate">{state.user.email}</p>
                      )}
                    </div>
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Navigation */}
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => navigate('/add-task')}
                      className="hover:bg-muted hover:text-primary"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Task</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Task Statistics */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-primary text-xs uppercase tracking-wider">
                Statistics
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="space-y-2 px-2">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <Circle className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm text-foreground">Pending</span>
                    </div>
                    <span className="font-bold text-yellow-500">{pendingTasks}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-foreground">Completed</span>
                    </div>
                    <span className="font-bold text-green-500">{completedTasks}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-primary/20 border border-primary rounded-lg">
                    <div className="flex items-center gap-2">
                      <ListTodo className="h-4 w-4 text-primary" />
                      <span className="text-sm text-foreground">Total</span>
                    </div>
                    <span className="font-bold text-primary">{tasks.length}</span>
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-border p-4">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-6 overflow-auto">
            <div className="max-w-5xl mx-auto space-y-4">
              {tasks.length === 0 ? (
                <div className="text-center py-20 bg-card rounded-lg border-2 border-dashed border-primary/30">
                  <ListTodo className="h-16 w-16 text-primary/30 mx-auto mb-4" />
                  <p className="text-lg text-muted-foreground mb-2">No tasks yet</p>
                  <p className="text-sm text-muted-foreground/70 mb-4">Create your first task to get started</p>
                  <Button
                    onClick={() => navigate('/add-task')}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Task
                  </Button>
                </div>
              ) : (
                tasks.map(task => <TaskCard key={task.id} task={task} />)
              )}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
