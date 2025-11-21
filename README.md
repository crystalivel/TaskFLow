# TaskFlow

TaskFlow is a modern, responsive task management application designed to help users organize their daily activities efficiently. Built with React and Vite, it offers a seamless user experience with features like authentication, task tracking, and theme customization.

## Features

- **User Authentication**: Secure Login and Registration pages.
- **Dashboard**: Centralized view of all tasks.
- **Task Management**:
  - **Add Task**: Create new tasks with detailed information.
  - **Task Details**: View specific details of a task.
  - **Protected Routes**: Ensures only authenticated users can access task management features.
- **Theme Support**: Built-in Dark and Light mode toggle.
- **Responsive Design**: Optimized for various screen sizes.

## Tech Stack

- **Frontend Framework**: [React](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**:
  - [Tailwind CSS](https://tailwindcss.com/) (v4)
  - [Radix UI](https://www.radix-ui.com/) (Primitives for accessible components)
  - [Lucide React](https://lucide.dev/) (Icons)
  - `class-variance-authority` & `clsx` for conditional styling
- **State Management**: React Context API (`TaskContext`, `ThemeContext`)
- **Form Handling**:
  - [React Hook Form](https://react-hook-form.com/)
  - [Zod](https://zod.dev/) (Schema validation)
- **Routing**: [React Router](https://reactrouter.com/)

## Getting Started

### Prerequisites

Ensure you have Node.js installed on your machine.

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    ```
2.  Navigate to the project directory:
    ```bash
    cd TaskFLow
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```

### Running the Application

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port shown in your terminal).

### Building for Production

To create a production build:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## Project Structure

```
src/
├── components/     # Reusable UI components (Auth, Tasks, UI primitives)
├── context/        # React Context providers (Task, Theme)
├── pages/          # Application pages (Login, Register, Dashboard, etc.)
├── routes/         # Routing configuration (ProtectedRoutes)
├── validation/     # Zod schemas for form validation
├── App.jsx         # Main application component with routing setup
└── main.jsx        # Entry point
```
