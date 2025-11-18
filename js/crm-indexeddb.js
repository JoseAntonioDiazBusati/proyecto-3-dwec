let db;
let editId = null;
// Abrir base de datos IndexedDB y crear object store si es necesario
// --- ELIMINADO para que alumnos implementen ---
const request = indexedDB.open("CRM_Database", 1);

request.onerror = function(event) {
    console.error("Error abriendo IndexedDB", event);
};

request.onsuccess = function(event) {
    db = event.target.result;
    fetchClients();
};

request.onupgradeneeded = function(event) {
    db = event.target.result;
    if(!db.objectStoreNames.contains('clients')) {
        const objectStore = db.createObjectStore('clients', { keyPath: 'id', autoIncrement: true });
        objectStore.createIndex('name', 'name', { unique: false });
        objectStore.createIndex('email', 'email', { unique: true });
        objectStore.createIndex('phone', 'phone', { unique: false });
     }
};

// --- VALIDACIONES ---
// TODO: Implementad validaciones usando expresiones regulares y eventos 'onblur'
// Elimina el código de validación y manejo de clases visuales para que ellos lo desarrollen
const form = document.getElementById('client-form');
const addBtn = document.getElementById('add-btn');
const inputs = form.querySelectorAll('input');

const patterns = {
  name: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,40}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
  phone: /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/  
};

// --- Validaciones y activación botón ---
// Dejar el botón siempre deshabilitado. Que alumnos lo activen cuando validen campos
// addBtn.disabled = true; 

function validar(input) {
  const pattern = patterns[input.name];
  if (pattern && pattern.test(input.value.trim())) {
    input.classList.add('valid');
    input.classList.remove('invalid');
    return true;
  } else {
    input.classList.add('invalid');
    input.classList.remove('valid');
    return false;
  }
}

inputs.forEach(input => {
    // Quitar manejo de eventos 'blur' para validación (alumnos deben hacerlo)
    // input.addEventListener('blur', e => { ... });
    input.addEventListener('blur', () => {
    validar(input);
    comprobarValidacion();
  });
});

function comprobarValidacion() {
    const allValid = Array.from(inputs).every(input =>
        patterns[input.name].test(input.value.trim())
    );
    addBtn.disabled = !allValid;
    return allValid;
}

// --- AGREGAR CLIENTE ---
// TODO: Implementar la función que capture los datos y los agregue a IndexedDB
form.addEventListener('submit', e => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();

    if (!validar(form.name) || !validar(form.email) || !validar(form.phone)) {
        alert('Por favor corrige los campos inválidos antes de continuar.');
        return;
    }

    const transaction = db.transaction(['clients'], 'readwrite');
    const store = transaction.objectStore('clients');

    if (editId) {
        const updatedClient = { id: editId, name, email, phone };
        const requestUpdate = store.put(updatedClient); // ⚠️ guardar la request
        requestUpdate.onsuccess = () => {
            editId = null;
            addBtn.textContent = 'Agregar Cliente';
            form.reset();
            inputs.forEach(i => i.classList.remove('valid'));
            addBtn.disabled = true;
            fetchClients();
        };
        requestUpdate.onerror = (e) => {
            alert("Error al actualizar cliente (¿Email duplicado?)");
            console.error(e);
        };
    } else {
        const newClient = { name, email, phone };
        const requestAdd = store.add(newClient);
        requestAdd.onsuccess = () => {
            form.reset();
            inputs.forEach(i => i.classList.remove('valid'));
            addBtn.disabled = true;
            fetchClients();
        };
        requestAdd.onerror = (e) => {
            alert("Error al agregar cliente (¿Email duplicado?)");
            console.error(e);
        };
    }
});

// --- LISTADO DINÁMICO ---
// TODO: Implementar función para mostrar clientes guardados en IndexedDB
function fetchClients() {
    // Código eliminado para que alumnos implementen mecanismo de lectura
    const clientList = document.getElementById('client-list');
    clientList.innerHTML = '';
    const transaction = db.transaction(['clients'], 'readonly');
    const store = transaction.objectStore('clients');
    const request = store.openCursor();
    request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
            const { id, name, email, phone } = cursor.value;
            const li = document.createElement('li');
            li.innerHTML =`
            <span><strong>${name}</strong> - ${email} - ${phone}</span>
            <div class="actions">
               <button onclick="editClient(${id})">Editar</button>
                <button onclick="deleteClient(${id})">Eliminar</button>
            </div>`;
            clientList.appendChild(li); cursor.continue(); }
            else if (!clientList.hasChildNodes()) { clientList.innerHTML = '<li>No hay clientes registrados.</li>'; } };
}

// --- EDITAR CLIENTE ---
window.editClient = function(id) {
    // Código eliminado para implementación del alumno
    const transaction = db.transaction(['clients'], 'readonly');
    const store = transaction.objectStore('clients');
    const request = store.get(id);

    request.onsuccess = (event) => {
        const client = event.target.result;
        if (client) {
            form.name.value = client.name;
            form.email.value = client.email;
            form.phone.value = client.phone;
            editId = client.id;
            addBtn.textContent = 'Guardar Cambios';
            addBtn.disabled = false;
            inputs.forEach(i => validar(i));
        }
    };
};

// --- ELIMINAR CLIENTE ---
window.deleteClient = function(id) {
    // Código eliminado para implementación del alumno
    if (confirm('¿Seguro que deseas eliminar este cliente?')) {
        const transaction = db.transaction(['clients'], 'readwrite');
        const store = transaction.objectStore('clients');
        store.delete(id);
        transaction.oncomplete = () => {
            fetchClients();
        };
        transaction.onerror = (e) => console.error('Error al eliminar:', e);
    }
};

