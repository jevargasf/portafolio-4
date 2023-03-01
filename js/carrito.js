
 // Llamada a funciones localStorage cuando carga la página
 window.addEventListener('DOMContentLoaded', e => {cargarLocalStorage(); pintarLocalStorage(carrito)})


 const cuerpoCarrito = document.getElementById("cuerpoCarrito"); 
 const footerTotal = document.getElementById("totalCarrito");
 const inputDcto = document.getElementById("inputDcto")
console.log()

    // Recuperar data almacenada en localStorage
    function cargarLocalStorage () {
        carrito.productos = JSON.parse(localStorage.getItem("carrito"))
    }


    function pintarLocalStorage (arr) {
        if (arr.productos.length === 0) {
            cuerpoCarrito.innerHTML = `
            <tr>
                <td colspan="5">
                    <div class="card-body text-center">
                        <h4 class="card-title">Tu carrito está vacío.</h4>
                        <div class="col-12 text-center">    
                            <div class="text">
                                <p class="card-text"> Presiona abajo para seguir comprando.</p>                
                            </div>
                        </div>
                    </div> 
                </td>
            </tr>          
            `
        } else {
            arr.productos.forEach(item => {                
                const filaNuevoProducto = document.createElement("tr");
                filaNuevoProducto.setAttribute("id", "filaProducto"+item.id)
                    filaNuevoProducto.innerHTML += `
                            <td colspan=""><img src=".${item.imagen}" class="img-fluid" width="100" alt="img-alt"></td>
                            <td class="">${item.nombre}<button type="button" class="btn btn-link botonEliminar" id="E${item.id}">Eliminar</button></td>   
                            <td class="cantidades" id="cantidadProducto${item.id}">${item.cantidad}</td>
                            <td class=""><button type="button" class="btn btn-danger botonQuitar p-auto" id="Q${item.id}">-</button>
                                <button type="button" class="btn btn-info p-auto botonSumar" id="A${item.id}" value="1">+</button>
                            </td>
                            <td id="totalProducto${item.id}">${item.precio}</td>
                            `;   
                    
                            filaNuevoProducto.setAttribute("id", "filaProducto"+item.id)
                            console.log(footerTotal)
                    if (footerTotal.innerHTML == "") {                     
                        footerTotal.innerHTML = 
                                `
                                <td colspan="2">Total</td>
                                <td colspan="1">${arr.sumaCantidades()}</td>
                                <td></td>
                                <td colspan="1" id="sumaTotal">${arr.sumaTotal()}</td>
                                `            
                                ;
                        
                    }        

                        
                    if (inputDcto.innerHTML === "") {
                        inputDcto.innerHTML =
                            `
                            <td colspan="5">
                                <div class="input-group">
                                    <input type="text" class="form-control" placeholder="Ingresa código descuento" aria-label="Username" aria-describedby="input-group-button-right" id="textoDescuento">
                                    <button type="button" class="btn btn-outline-secondary" id="input-group-button-right">Aplicar</button>
                                </div>
                            </td>
                            `
                        }
                        
                        cuerpoCarrito.appendChild(filaNuevoProducto);
                       //

                        // Desactivar botón quitar si cantidad = 1
                        if (item.cantidad === 1) {
                            document.getElementById("Q"+item.id).disabled = true
                            }
            })

        }
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
        if (e.target.className === 'btn btn-info p-auto botonSumar') {
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
        if (e.target.className === 'btn btn-danger botonQuitar p-auto') {
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

    // Botón Sumar Cantidad Producto

    document.getElementById("tablaCarrito").addEventListener('click', e => {
        carrito.botonSumar(e); 
        sumarProductoDOM(carrito, e);
        })

   
        function sumarProductoDOM (arr, e) {
            arr.productos.forEach(item => {
                if (item.id == e.target.id.slice(1)) {
                    document.getElementById("cantidadProducto"+item.id).innerHTML = item.cantidad;
                    document.getElementById("totalProducto"+item.id).innerHTML = item.cantidad*item.precio;
                    footerTotal.innerHTML += `
                    <td colspan="2">Total</td>
                    <td>${arr.sumaCantidades()}</td>
                    <td></td>
                    <td id="sumaTotal">${arr.sumaTotal()}</td>
                    `;
                    // Habilitar botón quitar cuando cantidad > 1
                    if (item.cantidad > 1) {
                        document.getElementById("Q"+e.target.id.slice(1)).disabled = false
                    }
                } 
    
            })        
        }    
    
        
        // Botón Quitar Cantidad Producto
    
    document.getElementById("tablaCarrito").addEventListener('click', e => {
        carrito.botonQuitar(e);
        quitarProductoDOM(carrito, e)
        })
    
        function quitarProductoDOM (arr, e) {
            arr.productos.forEach(item => {
                if (item.id == e.target.id.slice(1)) {
                    document.getElementById("cantidadProducto"+item.id).innerHTML = item.cantidad
                    document.getElementById("totalProducto"+item.id).innerHTML = item.cantidad*item.precio
                    footerTotal.innerHTML = `
                        <td colspan="2">Total</td>
                        <td>${arr.sumaCantidades()}</td>
                        <td></td>
                        <td id="sumaTotal">${arr.sumaTotal()}</td>
                        `;
                        // Deshabilitar botón quitar cuando cantidad producto = 0
                        if (item.cantidad === 1) {
                            document.getElementById("Q"+e.target.id.slice(1)).disabled = true
                        }
                    } 
                })
            }
    
        //  Botón Eliminar Producto
    
    document.getElementById("tablaCarrito").addEventListener('click', e => {
        carrito.botonEliminar(e);
        eliminarProductoDOM(carrito, e)
        })
    
        function eliminarProductoDOM (arr, e) {
            if (e.target.className === 'btn btn-link botonEliminar') {
                let padreFilaProducto = document.getElementById("cuerpoCarrito")
                let filaProducto = document.getElementById("filaProducto"+e.target.id.slice(1))
                padreFilaProducto.removeChild(filaProducto)
                footerTotal.innerHTML = `
                    <td colspan="2">Total</td>
                    <td>${arr.sumaCantidades()}</td>
                    <td></td>
                    <td id="sumaTotal">${arr.sumaTotal()}</td>
                    `;
                if (arr.productos.length === 0) {
                    cuerpoCarrito.innerHTML = `
                    <tr>
                        <td colspan="5">
                            <div class="card-body text-center">
                                <h4 class="card-title">Tu carrito está vacío.</h4>
                                <div class="col-12 text-center">    
                                    <div class="text">
                                        <p class="card-text"> Presiona abajo para seguir comprando.</p>                
                                    </div>
                                </div>
                            </div> 
                        </td>
                    </tr>           
                    `
                    footerTotal.innerHTML = ``;
                    inputDcto.innerHTML = ``;
                    }

            }
    
        }
    
        //Botón aplica descuento 
    
    document.getElementById("tablaCarrito")?.addEventListener('click', e => {
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
