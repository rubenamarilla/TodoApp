'use strict';

let tasks = [];

const form = document.querySelector('form');
const tasksTable = document.querySelector('#tasksTable tbody');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  addTask();
});

function addTask() {
  const taskDescription = document.querySelector('#taskDescription').value;
  const deadlineDate = document.querySelector('#deadlineDate').value;
  const priorityLabel = document.querySelector('#priorityLabel').value;

  const today = new Date();
  const inputDate = new Date(deadlineDate);
  if (inputDate < today) {
    alert('Please enter a valid deadline date.');
    return;
  }

  const task = {
    description: taskDescription,
    deadline: deadlineDate || '',
    priority: priorityLabel,
    completed: false
  };
  tasks.push(task);

  updateTable();

  form.reset();
}

function updateTable(filteredTasks = tasks) {
  tasksTable.innerHTML = '';

  filteredTasks.forEach((task, index) => {
    const row = document.createElement('tr');

    const descriptionCell = document.createElement('td');
    descriptionCell.textContent = task.description;
    const deadlineCell = document.createElement('td');
    deadlineCell.textContent = task.deadline;
    const priorityCell = document.createElement('td');
    priorityCell.textContent = task.priority;
    const statusCell = document.createElement('td');
    const statusCheckbox = document.createElement('input');
    statusCheckbox.type = 'checkbox';
    statusCheckbox.checked = task.completed;
    statusCheckbox.addEventListener('change', () => {
      task.completed = statusCheckbox.checked;
      updateTable(filteredTasks);
    });
    statusCell.appendChild(statusCheckbox);

    const deleteCell = document.createElement('td');
    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'btn btn-danger btn-sm'; deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
      tasks.splice(index, 1);
      updateTable(filteredTasks);
    });
    deleteCell.appendChild(deleteButton);
    const editCell = document.createElement('td');
    const editButton = document.createElement('button');
    editButton.type = 'button';
    editButton.className = 'btn btn-sm btn-warning';
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => {
      const newTaskDescription = prompt('Enter the new description', task.description);
      if (newTaskDescription !== null) {
        task.description = newTaskDescription;
        updateTable(filteredTasks);
      }
    });
    editCell.appendChild(editButton);

    row.appendChild(statusCell);
    row.appendChild(descriptionCell);
    row.appendChild(priorityCell);
    row.appendChild(deadlineCell);
    row.appendChild(editCell);
    row.appendChild(deleteCell);

    tasksTable.appendChild(row);
  });
}

function loadTasks() {
  const tasksString = localStorage.getItem('tasks');

  if (tasksString) {
    tasks = JSON.parse(tasksString);
    updateTable();
  }
}

window.addEventListener('load', loadTasks);

const sortSelect = document.getElementById('sortTasks');
const filterSelect = document.getElementById('filterTasks');

filterSelect.addEventListener('change', () => {
  const filter = filterSelect.value;

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') {
      return true;
    } else if (filter === 'completed') {
      return task.completed;
    } else if (filter === 'notCompleted') {
      return !task.completed;
    } else if (filter === 'lowPriority') {
      return task.priority === 'low';
    } else if (filter === 'mediumPriority') {
      return task.priority === 'medium';
    } else if (filter === 'highPriority') {
      return task.priority === 'high';
    }
  });

  updateTable(filteredTasks);
});

sortSelect.addEventListener("change", () => {
  if (sortSelect.value === "descriptionAsc") {
    sortTasksByDescription(tasks, "asc")
  } else if (sortSelect.value === "descriptionDesc") {
    sortTasksByDescription(tasks, "desc")
  } else if (sortSelect.value === "dateAsc") {
    sortTasksByDeadline(tasks, "asc")
  } else if (sortSelect.value === "dateDesc") {
    sortTasksByDeadline(tasks, "desc")
  } else if (sortSelect.value === "priorityAsc") {
    sortTasksByPriority(tasks, "asc")
  } else if (sortSelect.value === "priorityDesc") {
    sortTasksByPriority(tasks, "desc")
  }
})

function sortTasksByDescription(tasks, order) {
  tasks.sort(function (a, b) {
    let descriptionA = a.description.toUpperCase();
    let descriptionB = b.description.toUpperCase();
    if (order === "asc") {
      if (descriptionA < descriptionB) {
        return -1;
      }
      if (descriptionA > descriptionB) {
        return 1;
      }
    } else if (order === "desc") {
      if (descriptionA > descriptionB) {
        return -1;
      }
      if (descriptionA < descriptionB) {
        return 1;
      }
    }
    return 0;
  });
  updateTable()
  return tasks;
}

function sortTasksByDeadline(tasks, order) {
  tasks.sort(function (a, b) {
    let deadlineA = new Date(a.deadline);
    let deadlineB = new Date(b.deadline);
    if (order === "asc") {
      if (deadlineA < deadlineB) {
        return -1;
      }
      if (deadlineA > deadlineB) {
        return 1;
      }
    } else if (order === "desc") {
      if (deadlineA > deadlineB) {
        return -1;
      }
      if (deadlineA < deadlineB) {
        return 1;
      }
    }
    return 0;
  });
  updateTable()
  return tasks;
}

function sortTasksByPriority(tasks, order) {
  tasks.sort(function (a, b) {
    let priorityA = a.priority.toLowerCase();
    let priorityB = b.priority.toLowerCase();
    if (order === "asc") {
      if (priorityA === priorityB) {
        return 0;
      }
      if (priorityA === 'low') {
        return -1;
      }
      if (priorityB === 'low') {
        return 1;
      }
      if (priorityA === 'medium') {
        return -1;
      }
      if (priorityB === 'medium') {
        return 1;
      }
    } else if (order === "desc") {
      if (priorityA === priorityB) {
        return 0;
      }
      if (priorityA === 'high') {
        return -1;
      }
      if (priorityB === 'high') {
        return 1;
      }
      if (priorityA === 'medium') {
        return -1;
      }
      if (priorityB === 'medium') {
        return 1;
      }
    }
    return 0;
  });
  updateTable()
  return tasks;
}