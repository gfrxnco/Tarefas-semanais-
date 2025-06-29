let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = 'todas';

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

function addTask() {
  const input = document.getElementById("task-input");
  const day = document.getElementById("day-select").value;
  if (input.value.trim() === "") return;

  tasks.push({
    text: input.value.trim(),
    day,
    done: false,
    id: Date.now()
  });

  input.value = "";
  saveTasks();
}

function toggleDone(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
  saveTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
}

function editTask(id) {
  const task = tasks.find(t => t.id === id);
  const newText = prompt("Editar tarefa:", task.text);
  if (newText !== null && newText.trim() !== "") {
    task.text = newText.trim();
    saveTasks();
  }
}

function filterTasks(type) {
  currentFilter = type;
  document.querySelectorAll('.filters button').forEach(btn => btn.classList.remove('active'));
  const index = type === 'todas' ? 0 : type === 'pendentes' ? 1 : 2;
  document.querySelectorAll('.filters button')[index].classList.add('active');
  renderTasks();
}

function renderTasks() {
  const day = document.getElementById("day-select").value;
  const list = document.getElementById("task-list");
  list.innerHTML = "";

  let filtered = tasks.filter(t => t.day === day);

  if (currentFilter === 'pendentes') filtered = filtered.filter(t => !t.done);
  else if (currentFilter === 'concluidas') filtered = filtered.filter(t => t.done);

  filtered.forEach(task => {
    const div = document.createElement("div");
    div.className = "task" + (task.done ? " done" : "");
    div.innerHTML = `
      <span>${task.text}</span>
      <div>
        <button onclick="toggleDone(${task.id})" title="Concluir">✔️</button>
        <button onclick="editTask(${task.id})" title="Editar">✏️</button>
        <button onclick="deleteTask(${task.id})" title="Excluir">🗑️</button>
      </div>
    `;
    list.appendChild(div);
  });
}

document.getElementById("day-select").addEventListener("change", renderTasks);

window.onload = () => {
  renderTasks();
  filterTasks('todas');
};
