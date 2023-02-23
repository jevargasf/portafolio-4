//Leer JSON con API fetch

fetch("../data/productos.json")
.then(res => res.json())
.then(data => {
    templateProductos(data);
    carrito.getData(data);
    })
.catch(function (err) {
    console.log('error: ' + err)
})

function templateProductos (datos) {
    // Template productos
    const containerTarjetas = document.getElementById("contenedorTarjetas")
    const templateTarjetas = document.getElementById("templateTarjetas").content
    const fragmentTarjetas = document.createDocumentFragment()
    
    datos.forEach(item => {
    // Tarjetas
        let nombre = templateTarjetas.getElementById("nombre")
        let precio = templateTarjetas.getElementById("precio")
        let img = templateTarjetas.getElementById("img")
        let button = templateTarjetas.getElementById("button")
        let btnVerMas = templateTarjetas.getElementById("btnVerMas")
        nombre.textContent = item.nombre
        precio.textContent = item.precio
        img.src = item.imagen
        button.dataset.id = item.id
        btnVerMas.href = "#modalFicha"+item.id

    // Modals
        let modal = templateTarjetas.querySelector('.modal.fade')
        let nombreModal = templateTarjetas.getElementById("nombreModal")
        let precioModal = templateTarjetas.getElementById("precioModal")
        let descripcionModal = templateTarjetas.getElementById("descripcionModal")
        let imgModal = templateTarjetas.getElementById("imgModal")
        let stockModal = templateTarjetas.getElementById("stockModal")
        modal.id = 'modalFicha'+item.id
        nombreModal.textContent = item.nombre
        precioModal.textContent = item.precio
        descripcionModal.textContent = item.descripcion
        imgModal.src = item.imagen
        stockModal.textContent = `Stock: Quedan ${item.stock} disponibles.`

        const clonTarjeta = templateTarjetas.cloneNode(true)
        fragmentTarjetas.appendChild(clonTarjeta)
    })

    containerTarjetas.appendChild(fragmentTarjetas)

}

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
                    this.productos.push(producto)
                    e.target.disabled = true
                }
            })
        }
    },
    botonSumar: function (e) {
        if (e.target.className === 'btn btn-info p-1 botonAgregar') {
            for (item of this.productos) {
                if (item.id == e.target.id.slice(1)) {
                    item.cantidad++
                }
            }
        }
    },
    botonQuitar: function (e) {
        if (e.target.className === 'btn btn-danger botonQuitar p-1') {
            for (item of this.productos) {
                if (item.id == e.target.id.slice(1)) {
                    item.cantidad--
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
                <button type="button" class="btn btn-info p-1 botonAgregar" id="A${item.id}" value="1">+</button></td>
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
            medalla.innerHTML = `
                <span class="material-symbols-outlined">shopping_cart</span>${arr.sumaCantidades()}
                `;
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
                footerTotal.innerHTML = `
                <td>Tot al</td>
                <td>${arr.sumaCantidades()}</td>
                <td></td>
                <td id="sumaTotal">${arr.sumaTotal()}</td>
                `;
                medalla.innerHTML = `
                <span class="material-symbols-outlined">shopping_cart</span>${arr.sumaCantidades()}
                `;
                //console.log(item.cantidad)
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
                    // deshabilitar botón quitar cuando cantidad producto = 0
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
                }
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