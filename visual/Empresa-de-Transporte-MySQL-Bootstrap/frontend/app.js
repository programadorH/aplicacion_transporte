const API = "http://localhost:3000/api";

const authView = document.getElementById("authView");
const appView = document.getElementById("appView");

function showMessage(id, message, type) {
  document.getElementById(id).innerHTML = `<div class="alert alert-${type} py-2">${message}</div>`;
}

function saveSession(user) {
  localStorage.setItem("empresa_transporte_user", JSON.stringify(user));
}

function currentUser() {
  return JSON.parse(localStorage.getItem("empresa_transporte_user") || "null");
}

async function api(path, options = {}) {
  const response = await fetch(API + path, {
    headers: {"Content-Type":"application/json", ...(options.headers || {})},
    ...options
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Error en la API");
  return data;
}

document.getElementById("showLogin").onclick = () => {
  loginForm.classList.remove("d-none"); registerForm.classList.add("d-none");
};
document.getElementById("showRegister").onclick = () => {
  loginForm.classList.add("d-none"); registerForm.classList.remove("d-none");
};

document.getElementById("registerForm").addEventListener("submit", async e => {
  e.preventDefault();
  try {
    const data = await api("/auth/register", {method:"POST", body:JSON.stringify({
      nombre: registerName.value.trim(),
      email: registerEmail.value.trim(),
      rol: registerRole.value,
      password: registerPassword.value
    })});
    showMessage("registerMessage", data.message, "success");
    e.target.reset();
  } catch (error) {
    showMessage("registerMessage", error.message, "danger");
  }
});

document.getElementById("loginForm").addEventListener("submit", async e => {
  e.preventDefault();
  try {
    const data = await api("/auth/login", {method:"POST", body:JSON.stringify({
      email: loginEmail.value.trim(),
      password: loginPassword.value
    })});
    saveSession(data.user);
    startApp();
  } catch (error) {
    showMessage("loginMessage", error.message, "danger");
  }
});

function startApp() {
  const user = currentUser();
  if (!user) return;
  authView.classList.add("d-none");
  appView.classList.remove("d-none");
  welcomeName.textContent = user.nombre.split(" ")[0];
  profileName.textContent = user.nombre;
  profileRole.textContent = user.rol;
  profileNameInput.value = user.nombre;
  profileEmail.value = user.email;
  profileRoleInput.value = user.rol;
  whatsappBtn.href = `https://wa.me/?text=${encodeURIComponent("Hola, necesito asesoría sobre un servicio de la empresa.")}`;
  loadDashboard();
}

async function loadDashboard() {
  try {
    const [clientes, envios, asesores] = await Promise.all([
      api("/clientes"), api("/envios"), api("/asesores")
    ]);
    statClientes.textContent = clientes.length;
    statEnvios.textContent = envios.length;
    statAsesores.textContent = asesores.length;
    dbStatus.textContent = "OK";
    renderTables(clientes, envios, asesores);
    renderEnvios(envios);
  } catch (error) {
    dbStatus.textContent = "Error";
    apiMessage.innerHTML = `<div class="alert alert-danger">${error.message}. Verifica que el backend y MySQL estén ejecutándose.</div>`;
  }
}

function renderTables(clientes, envios, asesores) {
  clientesTable.innerHTML = clientes.map(c => `
    <tr><td>${c.id_cliente}</td><td>${esc(c.nombre)}</td><td>${esc(c.documento)}</td><td>${esc(c.direccion)}</td><td>${esc(c.telefono)}</td></tr>
  `).join("") || `<tr><td colspan="5" class="text-center text-secondary">Sin registros</td></tr>`;

  enviosTable.innerHTML = envios.map(e => `
    <tr><td>${e.id_envio}</td><td>${esc(e.remision)}</td><td>${esc(e.ciudad_despacho)}</td><td>${esc(e.ciudad_destino)}</td><td><span class="badge bg-primary-subtle text-primary">${esc(e.estado)}</span></td></tr>
  `).join("") || `<tr><td colspan="5" class="text-center text-secondary">Sin registros</td></tr>`;

  asesoresTable.innerHTML = asesores.map(a => `
    <tr><td>${a.id_asesor}</td><td>${esc(a.nombre)}</td><td>${esc(a.documento)}</td><td>${esc(a.empresa)}</td><td>${esc(a.cargo)}</td></tr>
  `).join("") || `<tr><td colspan="5" class="text-center text-secondary">Sin registros</td></tr>`;
}

function renderEnvios(envios) {
  enviosList.innerHTML = envios.map(e => `
    <div class="col-md-6">
      <div class="card service-card h-100">
        <div class="card-body">
          <div class="d-flex justify-content-between">
            <div><div class="service-icon mb-2"><i class="bi bi-box-seam"></i></div><h5 class="fw-bold">Envío #${e.id_envio}</h5></div>
            <span class="badge bg-primary-subtle text-primary">${esc(e.estado)}</span>
          </div>
          <hr>
          <p class="mb-2"><i class="bi bi-receipt me-2"></i>Remisión: ${esc(e.remision)}</p>
          <p class="mb-0"><i class="bi bi-geo-alt me-2"></i>${esc(e.ciudad_despacho)} → ${esc(e.ciudad_destino)}</p>
        </div>
      </div>
    </div>
  `).join("") || `<div class="col-12"><div class="empty-state"><i class="bi bi-box-seam"></i><p class="mt-3">No hay envíos registrados.</p></div></div>`;
}

document.getElementById("clienteForm").addEventListener("submit", async e => {
  e.preventDefault();
  try {
    await api("/clientes", {method:"POST", body:JSON.stringify({
      nombre: clienteNombre.value.trim(),
      documento: clienteDocumento.value.trim(),
      direccion: clienteDireccion.value.trim(),
      telefono: clienteTelefono.value.trim()
    })});
    bootstrap.Modal.getInstance(document.getElementById("clienteModal")).hide();
    e.target.reset();
    await loadDashboard();
    showView("gestion");
  } catch (error) {
    alert(error.message);
  }
});

document.getElementById("envioForm").addEventListener("submit", async e => {
  e.preventDefault();
  try {
    await api("/envios", {method:"POST", body:JSON.stringify({
      remision: envioRemision.value.trim(),
      ciudad_despacho: envioOrigen.value.trim(),
      ciudad_destino: envioDestino.value.trim(),
      estado: envioEstado.value
    })});
    bootstrap.Modal.getInstance(document.getElementById("envioModal")).hide();
    e.target.reset();
    await loadDashboard();
    showView("gestion");
  } catch (error) {
    alert(error.message);
  }
});

document.addEventListener("click", e => {
  const target = e.target.closest("[data-view]");
  if (!target) return;
  e.preventDefault();
  showView(target.dataset.view);
  if (target.dataset.view === "gestion") loadDashboard();
  document.querySelectorAll(".navbar .nav-link").forEach(x => x.classList.toggle("active", x.dataset.view === target.dataset.view));
});

function showView(view) {
  document.querySelectorAll(".app-section").forEach(x => x.classList.add("d-none"));
  document.getElementById(`view-${view}`)?.classList.remove("d-none");
}

document.getElementById("logoutBtn").onclick = () => {
  localStorage.removeItem("empresa_transporte_user");
  location.reload();
};

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("empresa_transporte_theme", theme);
  themeIcon.className = theme === "dark" ? "bi bi-sun" : "bi bi-moon-stars";
}
applyTheme(localStorage.getItem("empresa_transporte_theme") || "light");
themeToggle.onclick = () => applyTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark");

function esc(value) {
  return String(value ?? "").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");
}

if (currentUser()) startApp();
