document.addEventListener('DOMContentLoaded', () => {
  const taskForm = document.getElementById('task-form');
  const taskInput = document.getElementById('task-input');
  const descriptionInput = document.getElementById('description-input');
  const taskList = document.getElementById('task-list');

  let editingTaskId = null; // Track the task being edited

  // Fetch and display tasks
  fetchTasks();

  // Handle form submission for add or update
  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const task = taskInput.value.trim();
    const description = descriptionInput.value.trim();
    if (task && description) {
      if (editingTaskId) {
        updateTask(editingTaskId, task, description);
      } else {
        addTask(task, description);
      }
      taskInput.value = '';
      descriptionInput.value = '';
      editingTaskId = null; // Reset editing mode
    }
  });

  // Handle task actions (Edit and Delete)
  taskList.addEventListener('click', (e) => {
    const taskId = e.target.parentElement.dataset.id;
    if (e.target.classList.contains('edit-button')) {
      editTask(taskId); // Call editTask when "Edit" is clicked
    } else if (e.target.classList.contains('delete-button')) {
      deleteTask(taskId); // Call deleteTask when "Delete" is clicked
    }
  });

  // Fetch all tasks and display them
  function fetchTasks() {
    fetch('http://localhost:3000/api/tasks')
      .then(response => response.json())
      .then(tasks => {
        taskList.innerHTML = '';
        tasks.forEach(task => {
          const li = document.createElement('li');
          li.dataset.id = task.id;
          li.innerHTML = `
            <strong>${task.name}</strong>: ${task.description}
            <button class="edit-button">Edit</button>
            <button class="delete-button">Delete</button>
          `;
          taskList.appendChild(li);
        });
      })
      .catch(error => console.error('Error fetching tasks:', error));
  }

  // Add a new task
  function addTask(task, description) {
    fetch('http://localhost:3000/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: task, description })
    })
    .then(() => fetchTasks())
    .catch(error => console.error('Error adding task:', error));
  }

  // Edit task (populate form with task details)
  function editTask(taskId) {
    fetch(`http://localhost:3000/api/tasks/${taskId}`)
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch task');
        return response.json();
      })
      .then(task => {
        taskInput.value = task.name;
        descriptionInput.value = task.description;
        editingTaskId = taskId; // Set the ID for the task being edited
      })
      .catch(error => console.error('Error editing task:', error));
  }

  // Update a task
  function updateTask(taskId, task, description) {
    fetch(`http://localhost:3000/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: task, description })
    })
    .then(() => fetchTasks())
    .catch(error => console.error('Error updating task:', error));
  }

  // Delete a task
  function deleteTask(taskId) {
    fetch(`http://localhost:3000/api/tasks/${taskId}`, {
      method: 'DELETE'
    })
    .then(() => fetchTasks())
    .catch(error => console.error('Error deleting task:', error));
  }
});
