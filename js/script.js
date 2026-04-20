if (navigator.serviceWorker) {
    navigator.serviceWorker
        .register("../sw.js")
        .then((reg) => {
            console.log("Service Worker registered successfully", reg);
        })
        .catch((err) => {
            console.log(err);
        });
}

//--------------------------------------------------------

let deferredPrompt;

window.addEventListener("beforeinstallprompt", (event) => {
    console.log("📱 Install prompt triggered");
    event.preventDefault();
    deferredPrompt = event;
    const installBtn = document.getElementById("installBtn");
    if (installBtn) {
        installBtn.style.display = "block";
    }
});

const installBtn = document.getElementById("installBtn");
const modal = document.getElementById("installModal");
const closeBtn = document.querySelector(".close");
const confirmInstallBtn = document.getElementById("confirmInstall");
const cancelInstallBtn = document.getElementById("cancelInstall");

if (installBtn) {
    installBtn.addEventListener("click", () => {
        if (modal) {
            modal.style.display = "block";
        }
    });
}

if (closeBtn) {
    closeBtn.addEventListener("click", () => {
        if (modal) {
            modal.style.display = "none";
        }
    });
}

if (cancelInstallBtn) {
    cancelInstallBtn.addEventListener("click", () => {
        if (modal) {
            modal.style.display = "none";
        }
    });
}
if (confirmInstallBtn) {
    confirmInstallBtn.addEventListener("click", async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;

            if (outcome === "accepted") {
                console.log("✅ App installed successfully!");
                deferredPrompt = null;
            } else {
                console.log("❌ Installation cancelled");
            }

            if (modal) {
                modal.style.display = "none";
            }
        }
    });
}

if (modal) {
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
}

window.addEventListener("appinstalled", () => {
    console.log("App was installed successfully");
    deferredPrompt = null;

    const installBtn = document.getElementById("installBtn");
    if (installBtn) {
        installBtn.style.display = "none";
    }
});

//--------------------------------------------------------

const contactForm = document.getElementById("contactForm");
if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(contactForm);
        const data = {
            name: formData.get("name"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            subject: formData.get("subject"),
            message: formData.get("message"),
            timestamp: new Date().toISOString(),
        };

        try {
            console.log("Form submitted:", data);

            const formMessage = document.getElementById("formMessage");
            if (formMessage) {
                formMessage.textContent =
                    "✅ Message sent successfully! We'll get back to you soon.";
                formMessage.classList.add("success");
                formMessage.style.display = "block";
            }

            contactForm.reset();
            setTimeout(() => {
                if (formMessage) {
                    formMessage.style.display = "none";
                    formMessage.classList.remove("success");
                }
            }, 5000);
        } catch (err) {
            console.error(err);
            const formMessage = document.getElementById("formMessage");
            if (formMessage) {
                formMessage.textContent =
                    "❌ Error sending message. Please try again.";
                formMessage.classList.add("error");
                formMessage.style.display = "block";
            }
        }
    });
}

//--------------------------------------------------------

window.addEventListener("online", () => {
    showStatusNotification("You are back online!", "success");
});

window.addEventListener("offline", () => {
    showStatusNotification("You are now offline", "warning");
});

function showStatusNotification(message, type) {
    const notification = document.createElement("div");
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === "success" ? "#16a34a" : "#ea580c"};
        color: white;
        border-radius: 4px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 1000;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

if (Notification.permission === "default") {
    Notification.requestPermission().then((permission) => {
        console.log("Notification permission:", permission);
    });
}

let dbPromise = idb.open("taskDB", 1, (db) => {
    if (!db.objectStoreNames.contains("tasks")) {
        db.createObjectStore("tasks", { keyPath: "id", autoIncrement: true });
    }
});

let tasks = [];

document.getElementById("taskForm").addEventListener("submit", (e) => {
    e.preventDefault();
    addTask();
});

async function addTask() {
    const name = document.getElementById("tname").value.trim();
    const date = new Date(document.getElementById("tdate").value);

    if (!name) {
        alert("Please enter a task name");
        return;
    }

    const db = await dbPromise;
    const tx = db.transaction("tasks", "readwrite");
    await tx.objectStore("tasks").add({
        name,
        date: date.getTime(),
        notifiedApproaching: false,
        notifiedOverdue: false,
    });

    document.getElementById("tname").value = "";
    document.getElementById("tdate").value = "";

    loadTasks();
}

async function loadTasks() {
    const db = await dbPromise;
    const tx = db.transaction("tasks", "readonly");
    tasks = await tx.objectStore("tasks").getAll();
    renderTasks();
}

function renderTasks() {
    const container = document.getElementById("tasks");
    container.innerHTML = "";

    if (tasks.length === 0) {
        container.innerHTML =
            '<p class="no-tasks">No tasks yet. Add one to get started!</p>';
        return;
    }

    tasks.forEach((task) => {
        const el = document.createElement("div");
        const isOverdue = new Date(task.date).getTime() < Date.now();
        const isDone = task.notifiedApproaching && task.notifiedOverdue;
        el.className = `task ${isDone ? "done" : ""} ${isOverdue && !isDone ? "overdue" : ""}`;

        const formattedDate = new Date(task.date).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

        el.innerHTML = `
      <div class="task-content">
        <div>
          <strong class="task-name">${escapeHtml(task.name)}</strong>
          <small class="task-date">${formattedDate}</small>
        </div>
        <div class="task-actions">
          <button class="btn-complete" onclick="completeTask(${task.id})" title="Mark as done">✓</button>
          <button class="btn-delete" onclick="deleteTask(${task.id})" title="Delete task">✕</button>
        </div>
      </div>
    `;

        container.appendChild(el);
    });
}

async function completeTask(id) {
    const db = await dbPromise;
    const tx = db.transaction("tasks", "readwrite");
    const store = tx.objectStore("tasks");
    const task = await store.get(id);
    if (task) {
        task.notifiedApproaching = true;
        task.notifiedOverdue = true;
        await store.put(task);
        loadTasks();
    }
}

async function deleteTask(id) {
    if (confirm("Are you sure you want to delete this task?")) {
        const db = await dbPromise;
        const tx = db.transaction("tasks", "readwrite");
        await tx.objectStore("tasks").delete(id);
        loadTasks();
    }
}

async function showNotification(taskName, taskId, type = "overdue") {
    if (Notification.permission !== "granted") {
        console.log("Notification permission not granted");
        return false;
    }

    let body = "";
    let tag = "";

    if (type === "approaching") {
        body = `Task "${taskName}" is due in 1 hour!`;
        tag = `approaching-${taskName}`;
    } else if (type === "overdue") {
        body = `Task "${taskName}" is overdue!`;
        tag = `overdue-${taskName}`;
    }

    const reg = await navigator.serviceWorker.getRegistration();
    if (!reg) {
        console.log("Service Worker not registered");
        return false;
    }

    try {
        await reg.showNotification(taskName, {
            body: body,
            icon: "../img/logo.jpg",
            badge: "../img/logo.jpg",
            tag: tag,
            requireInteraction: true,
            data: { taskName, taskId, type },
            actions: [
                { action: "complete", title: "✓ Mark Done" },
                { action: "close", title: "Close" },
            ],
        });
        return true;
    } catch (err) {
        console.log("Error showing notification:", err);
        return false;
    }
}

async function markNotified(id, type = "overdue") {
    const db = await dbPromise;
    const tx = db.transaction("tasks", "readwrite");
    const store = tx.objectStore("tasks");
    const task = await store.get(id);

    if (task) {
        if (type === "approaching") {
            task.notifiedApproaching = true;
        } else if (type === "overdue") {
            task.notifiedOverdue = true;
        }
        await store.put(task);

        const inMemoryTask = tasks.find((t) => t.id === id);
        if (inMemoryTask) {
            if (type === "approaching") {
                inMemoryTask.notifiedApproaching = true;
            } else if (type === "overdue") {
                inMemoryTask.notifiedOverdue = true;
            }
        }
    }
}

async function checkTasks() {
    const now = Date.now();
    const oneHourMs = 60 * 60 * 1000;

    for (const task of tasks) {
        const taskTime = new Date(task.date).getTime();
        const timeUntilDeadline = taskTime - now;

        if (
            !task.notifiedApproaching &&
            timeUntilDeadline > 0 &&
            timeUntilDeadline <= oneHourMs
        ) {
            const sent = await showNotification(
                task.name,
                task.id,
                "approaching",
            );
            if (sent) await markNotified(task.id, "approaching");
        }

        if (!task.notifiedOverdue && taskTime <= now) {
            const sent = await showNotification(task.name, task.id, "overdue");
            if (sent) await markNotified(task.id, "overdue");
        }
    }
}

navigator.serviceWorker.addEventListener("message", (event) => {
    if (event.data.type === "completeTask") {
        completeTask(event.data.taskId);
    } else if (event.data.type === "deleteTask") {
        deleteTask(event.data.taskId);
    }
});

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

setTimeout(() => {
    checkTasks();
}, 1000);

loadTasks();
setInterval(checkTasks, 5000);
