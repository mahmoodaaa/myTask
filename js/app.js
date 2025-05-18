// Initialize tasks from localStorage or empty array
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let taskIdCounter = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;

// Get DOM elements
const taskInput = document.getElementById("new-task");
const addTaskBtn = document.getElementById("add-task");
const taskList = document.getElementById("tasks");

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Create: Add new task
function addTask() {
    const taskName = taskInput.value.trim();
    if (taskName === "") {
        showNotification("Please enter a task name.", "error");
        return;
    }

    const task = {
        id: taskIdCounter++,
        name: taskName,
        status: "Pending",
        createdAt: new Date().toISOString()
    };

    tasks.push(task);
    saveTasks();
    renderTasks();
    taskInput.value = "";
    showNotification("Task added successfully!", "success");
}

// Read: Display tasks
function renderTasks() {
    taskList.innerHTML = "";

    tasks.forEach((task) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${task.name}</td>
            <td><span class="status ${task.status.toLowerCase()}">${task.status}</span></td>
            <td class="actions">
                <button onclick="editTask(${task.id})" class="edit-btn">Edit</button>
                <button onclick="toggleStatus(${task.id})" class="toggle-btn">
                    ${task.status === "Pending" ? "Complete" : "Reopen"}
                </button>
                <button onclick="deleteTask(${task.id})" class="delete-btn">Delete</button>
            </td>
        `;
        taskList.appendChild(row);
    });
}

// Update: Edit task
function editTask(id) {
    const task = tasks.find((t) => t.id === id);
    if (!task) {
        showNotification("Task not found!", "error");
        return;
    }

    const newName = prompt("Edit task name:", task.name);
    if (newName !== null && newName.trim() !== "") {
        task.name = newName.trim();
        task.updatedAt = new Date().toISOString();
        saveTasks();
        renderTasks();
        showNotification("Task updated successfully!", "success");
    }
}

// Update: Toggle task status
function toggleStatus(id) {
    const task = tasks.find((t) => t.id === id);
    if (!task) {
        showNotification("Task not found!", "error");
        return;
    }

    task.status = task.status === "Pending" ? "Completed" : "Pending";
    task.updatedAt = new Date().toISOString();
    saveTasks();
    renderTasks();
    showNotification(`Task marked as ${task.status}!`, "success");
}

// Delete: Remove task
function deleteTask(id) {
    if (!confirm("Are you sure you want to delete this task?")) {
        return;
    }

    const initialLength = tasks.length;
    tasks = tasks.filter((t) => t.id !== id);
    
    if (tasks.length === initialLength) {
        showNotification("Task not found!", "error");
        return;
    }

    saveTasks();
    renderTasks();
    showNotification("Task deleted successfully!", "success");
}

// Show notification
function showNotification(message, type) {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Event Listeners
addTaskBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        addTask();
    }
});

// Initial render
renderTasks();
