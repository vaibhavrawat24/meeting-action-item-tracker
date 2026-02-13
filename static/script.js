let currentFilter = "all";

async function processTranscript() {
  const text = document.getElementById("transcript").value;
  if (!text.trim()) return;

  const button = document.getElementById("processBtn");
  const spinner = document.getElementById("processingSpinner");
  const success = document.getElementById("successMessage");

  spinner.classList.remove("hidden");
  success.classList.add("hidden");

  button.disabled = true;
  button.classList.add("opacity-50", "cursor-not-allowed");

  try {
    await fetch("/process_transcript", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    document.getElementById("transcript").value = "";
    loadItems();
    loadHistory();

    success.classList.remove("hidden");

    setTimeout(() => {
      success.classList.add("hidden");
    }, 3000);
  } catch (error) {
    alert("Something went wrong while processing.");
  }

  spinner.classList.add("hidden");

  button.disabled = false;
  button.classList.remove("opacity-50", "cursor-not-allowed");
}

async function loadItems() {
  const res = await fetch("/items", { cache: "no-store" });
  const items = await res.json();

  const container = document.getElementById("items");
  container.innerHTML = "";

  const filteredItems = items.filter((item) => {
    if (currentFilter === "open") return !item.done;
    if (currentFilter === "done") return item.done;
    return true;
  });

  filteredItems.forEach((item) => {
    const card = document.createElement("div");
    card.className =
      "bg-white p-4 rounded-lg shadow border flex justify-between items-center";

    card.innerHTML = `
      <div>
        <div class="font-medium text-slate-700 ${
          item.done ? "line-through text-gray-400" : ""
        }">
          ${item.task}
        </div>
        <div class="text-sm text-gray-500">
          ${item.owner || "No owner"} | ${item.due_date || "No due date"}
        </div>
      </div>

      <div class="flex gap-2">
        <button onclick="toggle(${item.id})"
          class="px-3 py-1 text-sm rounded ${
            item.done
              ? "border border-yellow-500 text-yellow-600 bg-white hover:bg-yellow-50"
              : "border border-green-500 text-green-600 bg-white hover:bg-green-50"
          }">
          ${item.done ? "Undo" : "Done"}
        </button>

       <button onclick="openEditModal(${item.id})"
          class="px-3 py-1 text-sm border border-gray-500 text-gray-600 bg-white hover:bg-gray-50 rounded">
          Edit
        </button>


        <button onclick="deleteItem(${item.id})"
          class="px-3 py-1 text-sm border border-red-500 text-red-600 bg-white hover:bg-red-50 rounded">
          Delete
        </button>
      </div>
    `;

    container.appendChild(card);
  });
}

async function toggle(id) {
  await fetch(`/item/${id}/toggle`, { method: "POST" });
  loadItems();
}

async function loadHistory() {
  const res = await fetch("/transcripts");
  const transcripts = await res.json();

  const history = document.getElementById("history");
  history.innerHTML = "";

  transcripts.forEach((t) => {
    const li = document.createElement("li");

    li.className =
      "p-3 bg-white rounded shadow-sm text-sm text-slate-600 whitespace-pre-wrap break-words max-h-64 overflow-y-auto";

    li.textContent = t.text;

    history.appendChild(li);
  });
}

async function deleteItem(id) {
  await fetch(`/item/${id}`, { method: "DELETE" });
  loadItems();
}

function addNewItem() {
  document.getElementById("modalTitle").innerText = "Add Action Item";

  document.getElementById("editId").value = "";
  document.getElementById("editTask").value = "";
  document.getElementById("editOwner").value = "";
  document.getElementById("editDue").value = "";
  document.getElementById("editTags").value = "";

  document.getElementById("editModal").classList.remove("hidden");
  document.getElementById("editModal").classList.add("flex");
}

async function editItem(id, task, owner, due_date, tags) {
  const newTask = prompt("Edit task:", task);
  if (!newTask) return;

  const newOwner = prompt("Edit owner:", owner);
  const newDue = prompt("Edit due date:", due_date);
  const newTags = prompt("Edit tags:", tags);

  await fetch(`/item/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      task: newTask,
      owner: newOwner,
      due_date: newDue,
      tags: newTags,
    }),
  });

  loadItems();
}

function filterStatus(status) {
  currentFilter = status;

  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.classList.remove("bg-blue-600", "text-white", "shadow-sm");
    btn.classList.add("bg-gray-200", "text-gray-700");
  });

  const activeBtn = document.querySelector(
    `.filter-btn[data-status="${status}"]`,
  );

  if (activeBtn) {
    activeBtn.classList.remove("bg-gray-200", "text-gray-700");
    activeBtn.classList.add("bg-blue-600", "text-white", "shadow-sm");
  }

  loadItems();
}

window.onload = function () {
  loadItems();
  loadHistory();
  filterStatus("all");
};

async function openEditModal(id) {
  const res = await fetch("/items");
  const items = await res.json();
  const item = items.find((i) => i.id === id);
  if (!item) return;

  document.getElementById("modalTitle").innerText = "Edit Action Item";

  document.getElementById("editId").value = item.id;
  document.getElementById("editTask").value = item.task || "";
  document.getElementById("editOwner").value = item.owner || "";
  document.getElementById("editDue").value = item.due_date || "";
  document.getElementById("editTags").value = item.tags || "";

  document.getElementById("editModal").classList.remove("hidden");
  document.getElementById("editModal").classList.add("flex");
}

function closeModal() {
  document.getElementById("editModal").classList.add("hidden");
  document.getElementById("editModal").classList.remove("flex");
}

async function saveEdit() {
  const id = document.getElementById("editId").value;

  const task = document.getElementById("editTask").value;
  const owner = document.getElementById("editOwner").value;
  const due_date = document.getElementById("editDue").value;
  const tags = document.getElementById("editTags").value;

  if (!task.trim()) return;

  if (id) {
    await fetch(`/item/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task, owner, due_date, tags }),
    });
  } else {
    await fetch(`/item`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task, owner, due_date, tags }),
    });
  }

  closeModal();
  loadItems();
}
