// Vaciando el carrito

//  *** Variables *** 
const carrito = document.querySelector('#carrito')
const contenedorCarrito = document.querySelector('#lista-carrito tbody')
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito')
const listaCursos = document.querySelector('#lista-cursos')
let articulosCarrito = []

document.addEventListener('DOMContentLoaded', () => {
    articulosCarrito = JSON.parse(localStorage.getItem('articulosCarrito')) || [];
    carritoHTML();
});

function guardarArticulos() {
    localStorage.setItem('articulosCarrito', JSON.stringify(articulosCarrito))
}

//  *** Listeners *** 
cargarEventListeners()
function cargarEventListeners () {
    listaCursos.addEventListener('click', añadirCurso)
    carrito.addEventListener('click', eliminarCurso)

    // Vaciar el carrito
    vaciarCarritoBtn.addEventListener('click', () => {
        articulosCarrito = []   // Vaciamos el array
        limpiarHTML()           // Limpiamos el HTML
    })
}

//  *** Funciones *** 

// Función para añadir cursos al carrito
function añadirCurso(e) {
    e.preventDefault()  
    if (e.target.classList.contains('agregar-carrito')) {  
        const curso = e.target.parentElement.parentElement 
        leerDatosCurso(curso)
        guardarArticulos()
    }
 }

 // Elimina cursos del carrito
 function eliminarCurso(e) {
    if (e.target.classList.contains('borrar-curso')){
        const cursoId = e.target.getAttribute('data-id')
        articulosCarrito = articulosCarrito.filter((curso) => curso.id !== cursoId)
        carritoHTML(articulosCarrito)
        guardarArticulos()
    }
 }

 // Lee la información del curso seleccionado.
 function leerDatosCurso(curso) {
    const infoCurso = {
        imagen:curso.querySelector('img').src,
        titulo:curso.querySelector('h4').textContent,
        precio:curso.querySelector('.precio span').textContent,
        id: curso.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    }
    const existe = articulosCarrito.some(curso => curso.id === infoCurso.id)
    if (existe) {
        const cursos = articulosCarrito.map((curso) => {
            if (curso.id === infoCurso.id) {
                curso.cantidad ++
                return curso 
            } else {
                return curso
            }
        })
        articulosCarrito = [...cursos]
    } else {
        articulosCarrito = [...articulosCarrito, infoCurso]
    }
    carritoHTML(articulosCarrito)
 }

 // Muestra el carrito de compras en el HTML
 function carritoHTML() {
    limpiarHTML()
    articulosCarrito.forEach((curso) => {
        const {imagen, titulo, precio, cantidad, id} = curso
        const row = document.createElement('tr')
        row.innerHTML = `
            <td> 
                <img src="${curso.imagen}" width="100">
            </td>
            <td>${titulo}</td>
            <td>${precio}</td>
            <td>${cantidad}</td>
            <td>
                <a href="#" class="borrar-curso" data-id="${id}">X</a>
            </td>
            `
        contenedorCarrito.appendChild(row)
    })
 }

 // Función para limpiar el HTML (elimina los cursos del tbody)
 function limpiarHTML() {
    while (contenedorCarrito.firstChild) {
        contenedorCarrito.firstChild.remove()
    }
 }
// CONFIRMAR COMPRA
document.addEventListener("DOMContentLoaded", () => {
     const comprarBtn = document.getElementById("comprar-carrito");
     const vaciarBtn = document.getElementById("vaciar-carrito");
     const tbody = document.querySelector("#lista-carrito tbody");

     if (comprarBtn) {
         comprarBtn.addEventListener("click", (e) => {
             e.preventDefault();

             const items = tbody.querySelectorAll("tr");

             if (items.length === 0) {
                 alert("El carrito está vacío. Añade productos antes de comprar.");
                 return;
             }

             const confirmar = confirm("¿Deseas confirmar la compra?");
             if (!confirmar) return;

             alert("🎉 ¡Compra realizada con éxito!");

             // Usamos tu botón existente para limpiar el carrito
             vaciarBtn.click();
         });
     }
 });

//MODO OSCURO
document.addEventListener("DOMContentLoaded", () => {
     const root = document.documentElement;
     const toggleBtn = document.getElementById("toggle-theme");

     if (toggleBtn) {
         const savedTheme = localStorage.getItem("theme");

         // Cargar tema guardado
         if (savedTheme === "dark") {
             root.classList.add("dark");
             toggleBtn.textContent = "☀️";
         } else {
             toggleBtn.textContent = "🌙";
         }

         // Alternar tema
         toggleBtn.addEventListener("click", () => {
             const isDark = root.classList.toggle("dark");
             localStorage.setItem("theme", isDark ? "dark" : "light");
             toggleBtn.textContent = isDark ? "☀️" : "🌙";
         });
     }
 });

