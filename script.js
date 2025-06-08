const tableBody = document.getElementById("clients-table");
const addBtn = document.getElementById("addClientBtn");
const clientForm = document.getElementById("clientForm");
const submitBtn = document.getElementById("submitClient");
const searchInput = document.getElementById("searchInput");

let clients = JSON.parse(localStorage.getItem("clients")) || [];
const serverCounters = JSON.parse(localStorage.getItem("serverCounters")) || {
  "FiveM": 0,
  "Gmod": 0,
  "Nova-Life": 0,
  "Minecraft": 0
};


function saveData() {
  localStorage.setItem("clients", JSON.stringify(clients));
  localStorage.setItem("serverCounters", JSON.stringify(serverCounters));
}

function formatServerName(type) {
  serverCounters[type]++;
  return `${type}-#${String(serverCounters[type]).padStart(3, '0')}`;
}

function renderClients(filteredClients = clients) {
  tableBody.innerHTML = "";

  filteredClients.forEach((client, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${client.nom}</td>
      <td>${client.email}</td>
      <td>${client.serveur}</td>
      <td class="status-cell">${client.statut}</td>
      <td>
        <button class="edit-btn" data-index="${index}" title="Modifier le statut">
          <i data-feather="settings"></i>
        </button>
        <button class="delete-btn" onclick="deleteClient(${index})" title="Supprimer">
          <i data-feather="trash-2"></i>
        </button>
      </td>
    `;

    tableBody.appendChild(row);
  });

  feather.replace();

  document.querySelectorAll(".edit-btn").forEach(button => {
    button.addEventListener("click", () => {
      const idx = button.getAttribute("data-index");
      const statusCell = tableBody.children[idx].querySelector(".status-cell");
      const currentStatus = clients[idx].statut;

      if (statusCell.querySelector("select")) return;

      const select = document.createElement("select");
      select.innerHTML = `
        <option value="Client">Client</option>
        <option value="Test">Test</option>
        <option value="Expiré">Expiré</option>
      `;
      select.value = currentStatus;

      statusCell.textContent = "";
      statusCell.appendChild(select);
      select.focus();

      function saveStatus() {
        const newStatus = select.value;
        clients[idx].statut = newStatus;
        saveData();
        renderClients();
      }

      select.addEventListener("change", saveStatus);
      select.addEventListener("blur", saveStatus);
    });
  });
}

function deleteClient(index) {
  clients.splice(index, 1);
  saveData();
  renderClients();
}

addBtn.addEventListener("click", () => {
  clientForm.classList.toggle("show");
});

submitBtn.addEventListener("click", () => {
  const name = document.getElementById("nameInput").value.trim();
  const email = document.getElementById("emailInput").value.trim();
  const serverType = document.getElementById("serverInput").value;
  const statut = document.getElementById("statusInput").value;

  if (name && email && serverType && statut) {
    const serverName = formatServerName(serverType);

    clients.push({
      nom: name,
      email: email,
      serveur: serverName,
      statut: statut
    });

    saveData();
    renderClients();
    clientForm.classList.remove("show");

    document.getElementById("nameInput").value = "";
    document.getElementById("emailInput").value = "";
    document.getElementById("serverInput").selectedIndex = 0;
    document.getElementById("statusInput").value = "Client";
  } else {
    alert("Merci de remplir tous les champs.");
  }
});

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  const filtered = clients.filter(client =>
    client.nom.toLowerCase().includes(query) ||
    client.email.toLowerCase().includes(query) ||
    client.serveur.toLowerCase().includes(query)
  );
  renderClients(filtered);
});

document.getElementById("resetBtn").addEventListener("click", () => {
  if (confirm("Voulez-vous vraiment réinitialiser toutes les données ?")) {
    localStorage.removeItem("clients");
    localStorage.removeItem("serverCounters");
    location.reload();
  }
});

document.querySelectorAll("#sidebarMenu li").forEach(item => {
  item.addEventListener("click", () => {
    document.querySelectorAll("#sidebarMenu li").forEach(i => i.classList.remove("active"));
    item.classList.add("active");

    const selectedPage = item.dataset.page;
    console.log("Page sélectionnée :", selectedPage);
    if (selectedPage === "clients") {
        document.querySelector("main").style.display = "block";
        document.getElementById("fonctionnalites").style.display = "none";
    } else if (selectedPage === "fonctionnalites") {
        document.querySelector("main").style.display = "none";
        document.getElementById("fonctionnalites").style.display = "block";
    }
  });
});

// Gestion de la connexion
const USERNAME = "admin";
const PASSWORD = "hostara123";

function checkLogin() {
  const isLoggedIn = localStorage.getItem("loggedIn");

  if (isLoggedIn === "true") {
    document.getElementById("loginContainer").style.display = "none";
    document.getElementById("mainContainer").style.display = "block";
  } else {
    document.getElementById("loginContainer").style.display = "block";
    document.getElementById("mainContainer").style.display = "none";
  }
}

document.getElementById("loginBtn").addEventListener("click", () => {
  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  const loginError = document.getElementById("loginError");

  if (username === USERNAME && password === PASSWORD) {
    localStorage.setItem("loggedIn", "true");
    checkLogin();
  } else {
    loginError.style.display = "block";
    loginError.textContent = "Identifiant ou mot de passe incorrect.";

    loginError.classList.remove("shake");
    void loginError.offsetWidth; 
    loginError.classList.add("shake");
  }
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("loggedIn");
  location.reload();
});

checkLogin(); // Appelle au chargement de la page

renderClients();