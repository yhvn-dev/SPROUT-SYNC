


export function showToast(title, body) {
  const container = document.getElementById("notification-container");
  if (!container) return;

  const notif = document.createElement("div");
  notif.className = "notification bg-white p-4 rounded-xl shadow mb-2";
  notif.innerHTML = `<strong>${title}</strong><p>${body}</p>`;
  container.appendChild(notif);

  setTimeout(() => {
    notif.remove();
    if (container.children.length === 0) {
      container.classList.add("hidden");
    }
  }, 5000);
}
