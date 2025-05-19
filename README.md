# Todo-Daily

🌐 Live Site

[https://todo-daily.onrender.com](https://todo-daily.onrender.com)

##
Todo-Daily is a task management application that allows users to create, edit, delete, and organize tasks across three statuses: **Todo**, **In Progress**, and **Done**. The application features a drag-and-drop interface for moving tasks between columns, built with React and `react-beautiful-dnd` on the frontend and FastAPI with SQLite and JWT authentication on the backend.

## Features
- **User Authentication**: Register and log in with JWT-based authentication.
- **Task Management**:
  - Create tasks with a title, description, and status.
  - Edit task details (title, description, status).
  - Delete tasks.
  - Drag and drop tasks between Todo, In Progress, and Done columns.
- **Persistent Storage**: Tasks are stored in a SQLite database and linked to authenticated users.
- **Responsive UI**: Built with Tailwind CSS and Ant Design for a modern, user-friendly interface.
- **Error Handling**: Handles authentication errors, network issues, and task operation failures gracefully.

## Tech Stack
- **Frontend**:
  - React 18
  - `react-beautiful-dnd` for drag-and-drop functionality
  - Ant Design for UI components
  - Tailwind CSS for styling
  - Axios for API requests
  - React Router for navigation
- **Backend**:
  - FastAPI
  - SQLAlchemy with SQLite
  - JWT for authentication
  - Passlib for password hashing
- **Environment**: Node.js, Python 3.8+, SQLite

## Prerequisites
- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **npm** or **yarn**
- **pip** for Python package management
- A modern web browser (Chrome, Firefox, etc.)

## Installation

### Backend Setup
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Dushyant98474839/Todo-Daily
   cd todo-daily
   ```

2. **Set Up a Virtual Environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Backend Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Environment Variables**:
   Create a `.env` file in the backend directory with the following:
   ```
   SECRET_KEY=your-secret-key
   DATABASE_URL=sqlite:///./todo.db
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ALGORITHM=HS256
   ```
   - Generate a secure `SECRET_KEY` (e.g., using `openssl rand -hex 32`).
   - Ensure `DATABASE_URL` points to your SQLite database file.

5. **Run the Backend**:
   ```bash
   uvicorn main:app --reload
   ```
   The API will be available at `http://localhost:8000`.

### Frontend Setup
1. **Navigate to the Frontend Directory**:
   ```bash
   cd frontend
   ```

2. **Install Frontend Dependencies**:
   ```bash
   npm install
   ```
   Key dependencies include:
   - `react-beautiful-dnd`
   - `antd`
   - `axios`
   - `react-router-dom`

3. **Configure Environment Variables**:
   Create a `.env` file in the frontend directory:
   ```
   VITE_API_BASE_URL=http://localhost:8000
   ```

4. **Run the Frontend**:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`.



## Usage
1. **Sign Up or Log In**:
   - Navigate to `http://localhost:5173/signup` to create an account.
   - Log in at `http://localhost:5173/login` to access the task board.

2. **Manage Tasks**:
   - Click the **Add New** button to create a task.
   - Fill in the title, description (optional), and select a status (Todo, In Progress, Done).
   - Edit or delete tasks using the icons on each card.
   - Drag tasks between columns to update their status.

3. **Drag and Drop**:
   - Drag a task card from one column (e.g., Todo) to another (e.g., In Progress).
   - The task’s status updates automatically and persists to the backend.

## API Endpoints
- **POST /signup**: Register a new user.
- **POST /login**: Log in and receive a JWT token.
- **GET /tasks**: Fetch all tasks for the authenticated user.
- **POST /tasks**: Create a new task.
- **PUT /tasks/{task_uuid}**: Update a task’s details.
- **DELETE /tasks/{task_uuid}**: Delete a task.

## Project Structure
```
todo-daily/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Card.jsx        # Task card component
│   │   │   ├── AddNew.jsx      # Add new task button and form
│   │   │   ├── TodoForm.jsx    # Task creation/edit form
│   │   ├── App.jsx             # Main app with drag-and-drop
│   │   ├── Login.jsx           # Login page
│   │   ├── Signup.jsx          # Signup page
│   ├── .env                    # Frontend environment variables
├── main.py                     # FastAPI backend
├── .env                        # Backend environment variables
├── todo.db                     # SQLite database
```

## Troubleshooting
- **Cards Not Draggable**:
  - Ensure `react-beautiful-dnd` is installed (`npm install react-beautiful-dnd`).
  - Disable React Strict Mode.
  - Check for CSS conflicts.
- **Authentication Issues**:
  - Ensure a valid JWT token is stored in `localStorage` after login.
  - Test API endpoints with tools like Postman to confirm functionality.
- **Backend Errors**:
  - Check that the SQLite database (`todo.db`) is created and accessible.
  - Verify environment variables in `.env` are correctly set.
 
## LLMs Assistance
https://grok.com/share/bGVnYWN5_3e3f9d88-2502-4323-9036-6045e537c617

