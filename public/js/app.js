    //Leer JSON con API fetch
    const url = '../public/data/productos.json'

 // Llamada a funciones localStorage cuando carga la página
 window.addEventListener('DOMContentLoaded', e => {loadJSON()
    .then(()=>(cargarLocalStorage()))
    .then(()=> pintarLocalStorage(carrito))})

async function  loadJSON() {

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        templateProductos(data);
        carrito.getData(data); 
      })
      .catch((err) => {
        console.log('error: ' + err)
      });
  }




function templateProductos (datos) {
    // Template productos
    const containerTarjetas = document.getElementById("contenedorTarjetas")
    const templateTarjetas = document.getElementById("templateTarjetas").content
    const fragmentTarjetas = document.createDocumentFragment()
    
    datos.forEach(item => {
    // Tarjetas
        let nombre = templateTarjetas.querySelector(".card-title.nombre")
        let precio = templateTarjetas.querySelector(".card-title.precio")
        let img = templateTarjetas.querySelector(".card-img-top.object-fit-contain.p-3.img")
        let button = templateTarjetas.querySelector(".btn.btn-primary.botonAgregar")
        let btnVerMas = templateTarjetas.querySelector(".btn.btn-secondary.btnVerMas")
        nombre.textContent = item.nombre
        precio.textContent = item.precio
        img.src = './public'+item.imagen
        button.dataset.id = item.id
        button.id = "botonAgregar"+item.id
        btnVerMas.href = "#modalFicha"+item.id
        // Almacenar en arreglo productos valor "true" si producto ya está agregado al carrito
        for (prod of carrito.productos) {
            if (prod.id === item.id) {
                prod["botonAgregar"] = true
            }
        }
    // Modals
        let modal = templateTarjetas.querySelector('.modal.fade')
        let nombreModal = templateTarjetas.querySelector(".card-title.nombreModal")
        let precioModal = templateTarjetas.querySelector(".card-title.precioModal")
        let descripcionModal = templateTarjetas.querySelector(".card-text.descripcionModal")
        let imgModal = templateTarjetas.querySelector(".img-fluid.w-100.p-3.imgModal")
        let stockModal = templateTarjetas.querySelector(".card-header.stockModal")
        modal.id = 'modalFicha'+item.id
        nombreModal.textContent = item.nombre
        precioModal.textContent = item.precio
        descripcionModal.textContent = item.descripcion
        imgModal.src = './public'+item.imagen
        stockModal.textContent = `Stock: Quedan ${item.stock} disponibles.`

        const clonTarjeta = templateTarjetas.cloneNode(true)
        fragmentTarjetas.appendChild(clonTarjeta)

    })

    containerTarjetas.appendChild(fragmentTarjetas)

    // Código para desactivar botón de productos almacenados en localStorage
    carrito.productos.forEach( item => {
        if (item.botonAgregar === true) {
            document.getElementById("botonAgregar"+item.id).disabled = true
        }})

}

// Arreglo productos carrito y métodos para manipularlo
let carrito = {
    productos: [],
    dataProductos: [],
    getData: function (datos) { datos.forEach(item => this.dataProductos.push(item)) },
    botonAgregar: function (e) {
       if (e.target.className === 'btn btn-primary botonAgregar') {
            this.dataProductos.forEach(item => {
                if (item.id == e.target.dataset.id) {
                    let producto = {}
                    producto["id"] = item.id
                    producto["nombre"] = item.nombre
                    producto["precio"] = item.precio
                    producto["cantidad"] = 1
                    producto["imagen"] = item.imagen
                    this.productos.push(producto)
                    e.target.disabled = true
                    localStorage.getItem("carrito")
                    localStorage.setItem("carrito", JSON.stringify(this.productos))
                }
            })
        }
    },
    botonSumar: function (e) {
        if (e.target.className === 'btn btn-info p-1 botonSumar') {
            for (item of this.productos) {
                if (item.id == e.target.id.slice(1)) {
                    item.cantidad++
                    localStorage.getItem("carrito")
                    localStorage.setItem("carrito", JSON.stringify(this.productos))
                }
            }
        }
    },
    botonQuitar: function (e) {
        if (e.target.className === 'btn btn-danger botonQuitar p-1') {
            for (item of this.productos) {
                if (item.id == e.target.id.slice(1)) {
                    item.cantidad--
                    localStorage.getItem("carrito")
                    localStorage.setItem("carrito", JSON.stringify(this.productos))
                    if (item.cantidad === 0) {
                        break
                    }
                }
            }
        }
    },
    botonEliminar: function (e) {
        if (e.target.className === 'btn btn-link botonEliminar') {
            for (item of this.productos) {
                if (item.id == e.target.id.slice(1)) {
                        this.productos = this.productos.filter(prod => prod.id != e.target.id.slice(1))
                        localStorage.getItem("carrito")
                        localStorage.setItem("carrito", JSON.stringify(this.productos))
                }
            }
        }
    },
    sumaCantidades: function () {
        let arrCantidades = []
        this.productos.forEach(item => {
            arrCantidades.push(item.cantidad)
        })
        let cantidadTotal = arrCantidades.reduce((a,b) => a+b, 0)
        return cantidadTotal
    },
    sumaTotal: function () {
        let subtotalProductos = []
        this.productos.forEach(item =>
            subtotalProductos.push(item.cantidad*item.precio))
        let totalProductos = subtotalProductos.reduce((a,b) => a+b, 0)
        return totalProductos
    }
}



// Función pintar carrito y DOM botón agregar producto

const contenedorBotones = document.getElementById("contenedorTarjetas")
contenedorBotones.addEventListener('click', e => {
    carrito.botonAgregar(e); 
    carritoDOM(carrito, e);
})

const footerTotal = document.getElementById("totalCarrito");
const medalla = document.getElementById("medalla"); 
const inputDcto = document.getElementById("inputDescuento");
const irCarrito = document.getElementById("irCarrito")

function carritoDOM (arr, e) {
    const cuerpoCarrito = document.getElementById("cuerpoCarrito"); 
    const filaNuevoProducto = document.createElement("tr");
    cuerpoCarrito.appendChild(filaNuevoProducto);
    filaNuevoProducto.setAttribute("id", "filaProducto"+e.target.dataset.id)
    // Nueva fila en carrito
    arr.productos.forEach(item => {
        if (item.id == e.target.dataset.id && item.cantidad === 1) {
            filaNuevoProducto.innerHTML += `
                <td>${item.nombre} <button type="button" class="btn btn-link botonEliminar" id="E${item.id}">Eliminar</button></td>
                <td class="cantidades p-auto" id="cantidadProducto${item.id}">${item.cantidad}</td>
                <td><button type="button" class="btn btn-danger botonQuitar p-1" id="Q${item.id}">-</button>
                <button type="button" class="btn btn-info p-1 botonSumar" id="A${item.id}" value="1">+</button></td>
                <td id="totalProducto${item.id}">${item.precio}</td>
                `;   

            footerTotal.innerHTML = 
                `
                <tr>
                <td>Total</td>
                <td>${arr.sumaCantidades()}</td>
                <td></td>
                <td id="sumaTotal">${arr.sumaTotal()}</td>
                </tr>

                `            
                ;
            irCarrito.innerHTML = `
                <tr>
                <td colspan="4">
                <a href="./public/pages/carrito.html" class="btn btn-primary active d-block" role="button">Ver carrito</a>
                </td>
                </tr>
            `
            medalla.innerHTML = `
                <span class="material-symbols-outlined">shopping_cart</span>${arr.sumaCantidades()}
                `;
                // Desactivar botón quitar en offcanvas para cantidad = 1
                document.getElementById("Q"+e.target.dataset.id).disabled = true

            }
        if (inputDcto.innerHTML === "") {
            inputDcto.innerHTML =
                `
                <td colspan="4">
                <div class="input-group">
                <input type="text" class="form-control" placeholder="Ingresa código descuento" aria-label="Username" aria-describedby="input-group-button-right" id="textoDescuento">
                <button type="button" class="btn btn-outline-secondary" id="input-group-button-right">Aplicar</button>
                </div>
                </td>
                `
            }
        })
    }

    // Botón Sumar Cantidad Producto

document.getElementById("offcanvas").addEventListener('click', e => {
    carrito.botonSumar(e); 
    sumarProductoDOM(carrito, e);
    })
    
    function sumarProductoDOM (arr, e) {
        arr.productos.forEach(item => {
            if (item.id == e.target.id.slice(1)) {
                document.getElementById("cantidadProducto"+item.id).innerHTML = item.cantidad;
                document.getElementById("totalProducto"+item.id).innerHTML = item.cantidad*item.precio;
                footerTotal.innerHTML += `
                <td>Tot al</td>
                <td>${arr.sumaCantidades()}</td>
                <td></td>
                <td id="sumaTotal">${arr.sumaTotal()}</td>
                `;
                medalla.innerHTML = `
                <span class="material-symbols-outlined">shopping_cart</span>${arr.sumaCantidades()}
                `;
                // Habilitar botón quitar cuando cantidad > 1
                if (item.cantidad > 1) {
                    document.getElementById("Q"+e.target.id.slice(1)).disabled = false
                }
            } 

        })        
    }    

    
    // Botón Quitar Cantidad Producto

document.getElementById("offcanvas").addEventListener('click', e => {
    carrito.botonQuitar(e);
    quitarProductoDOM(carrito, e)
    })

    function quitarProductoDOM (arr, e) {
        arr.productos.forEach(item => {
            if (item.id == e.target.id.slice(1)) {
                document.getElementById("cantidadProducto"+item.id).innerHTML = item.cantidad
                document.getElementById("totalProducto"+item.id).innerHTML = item.cantidad*item.precio
                footerTotal.innerHTML = `
                    <td>Total</td>
                    <td>${arr.sumaCantidades()}</td>
                    <td></td>
                    <td id="sumaTotal">${arr.sumaTotal()}</td>
                    `;
                    medalla.innerHTML = `
                    <span class="material-symbols-outlined">shopping_cart</span>${arr.sumaCantidades()}
                    `;
                    // Deshabilitar botón quitar cuando cantidad producto = 0
                    if (item.cantidad === 1) {
                        document.getElementById("Q"+e.target.id.slice(1)).disabled = true
                    }
                } 
            })
        }

    //  Botón Eliminar Producto

document.getElementById("offcanvas").addEventListener('click', e => {
    carrito.botonEliminar(e);
    eliminarProductoDOM(carrito, e)
    })

    function eliminarProductoDOM (arr, e) {
        if (e.target.className === 'btn btn-link botonEliminar') {
            let padreFilaProducto = document.getElementById("cuerpoCarrito")
            let filaProducto = document.getElementById("filaProducto"+e.target.id.slice(1))
            padreFilaProducto.removeChild(filaProducto)
            footerTotal.innerHTML = `
                <td>Tot al</td>
                <td>${arr.sumaCantidades()}</td>
                <td></td>
                <td id="sumaTotal">${arr.sumaTotal()}</td>
                `;
                medalla.innerHTML = `
                <span class="material-symbols-outlined">shopping_cart</span>${arr.sumaCantidades()}
                `;
            if (arr.productos.length === 0) {
                footerTotal.innerHTML = `
                <td colspan="4">Tu carrito está vacío.</td>
                `;
                medalla.innerHTML = `
                <span class="material-symbols-outlined">shopping_cart</span>
                `;
                inputDcto.innerHTML = ``;
                irCarrito.innerHTML = ``;
                }

            // Reactivar botón agregar cuando producto es eliminado del carrito
            document.getElementsByClassName("btn btn-primary botonAgregar")[e.target.id.slice(1) - 1].disabled = false
        }

    }

    //Botón aplica descuento 

document.getElementById("offcanvas")?.addEventListener('click', e => {
    aplicaDescuento(carrito, e)
    });

    // Función aplica descuento
function aplicaDescuento (arr, e) {
    if (e.target.id === 'input-group-button-right') {
        let codigoDescuento = document.getElementById("textoDescuento").value;
        if (codigoDescuento !== 'tiendita10') {
            alert("Código de descuento incorrecto. Ingrese nuevamente.")
        } else {
            let descuento = parseInt(codigoDescuento.slice(8, 10));
            let precioDescuento = arr.sumaTotal()-(arr.sumaTotal()*descuento/100);
            return document.getElementById("sumaTotal").innerHTML = precioDescuento
        }
        
    }
}

// Manipulación de localStorage

    // Recuperar data almacenada en localStorage
function cargarLocalStorage () {
    carrito.productos = JSON.parse(localStorage.getItem("carrito")) || []
}

    // Función para pintar en el carrito la data almacenada en localStorage
function pintarLocalStorage (arr) {
    const cuerpoCarrito = document.getElementById("cuerpoCarrito"); 


    arr.productos.forEach(item => {
        const filaNuevoProducto = document.createElement("tr");
    filaNuevoProducto.setAttribute("id", "filaProducto"+item.id)
        filaNuevoProducto.innerHTML += `
                <td>${item.nombre} <button type="button" class="btn btn-link botonEliminar" id="E${item.id}">Eliminar</button></td>
                <td class="cantidades p-auto" id="cantidadProducto${item.id}">${item.cantidad}</td>
                <td><button type="button" class="btn btn-danger botonQuitar p-1" id="Q${item.id}">-</button>
                <button type="button" class="btn btn-info p-1 botonSumar" id="A${item.id}" value="1">+</button></td>
                <td id="totalProducto${item.id}">${item.precio}</td>
                `;   
        filaNuevoProducto.setAttribute("id", "filaProducto"+item.id)
            footerTotal.innerHTML = 
                `
                <tr>
                <td>Total</td>
                <td>${arr.sumaCantidades()}</td>
                <td></td>
                <td id="sumaTotal">${arr.sumaTotal()}</td>
                </tr>
                `            
                ;
            medalla.innerHTML = `
                <span class="material-symbols-outlined">shopping_cart</span>${arr.sumaCantidades()}
                `;
            irCarrito.innerHTML = `
                <tr>
                <td colspan="4">
                <a href="./assets/carrito.html" class="btn btn-primary active d-block" role="button">Ver carrito</a>
                </td>
                </tr>
            `   
        if (inputDcto.innerHTML === "") {
            inputDcto.innerHTML =
                `
                <td colspan="4">
                <div class="input-group">
                <input type="text" class="form-control" placeholder="Ingresa código descuento" aria-label="Username" aria-describedby="input-group-button-right" id="textoDescuento">
                <button type="button" class="btn btn-outline-secondary" id="input-group-button-right">Aplicar</button>
                </div>
                </td>
                `
            }
            
            cuerpoCarrito.appendChild(filaNuevoProducto);
            // Desactivar botón quitar si cantidad = 1
            if (item.cantidad === 1) {
                document.getElementById("Q"+item.id).disabled = true
                }
        })
}


