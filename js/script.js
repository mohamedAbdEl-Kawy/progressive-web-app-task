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

