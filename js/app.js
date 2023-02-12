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
    }
}

// Boton agregar producto
//Recuperar botones Agregar Carrito en el DOM

    const contenedorBotones = document.getElementById("contenedorTarjetas")
    contenedorBotones.addEventListener('click', e => {carrito.botonAgregar(e); carritoDOM(carrito.productos, e)})

// DOM carrito

const footerTotal = document.getElementById("totalCarrito");
const medalla = document.getElementById("medalla"); 
const inputDcto = document.getElementById("inputDescuento");


function carritoDOM (arr, e) {
    const cuerpoCarrito = document.getElementById("cuerpoCarrito"); 
    const filaNuevoProducto = document.createElement("tr");
    cuerpoCarrito.appendChild(filaNuevoProducto);
    // Nueva fila en carrito
    arr.forEach(item => {
        if (item.id == e.target.dataset.id && item.cantidad === 1) {
            filaNuevoProducto.innerHTML += `
                <td>${item.nombre}</td>
                <td class="cantidades p-auto" id="cantidadProducto${item.id}">${item.cantidad}</td>
                <td><button type="button" class="btn btn-danger botonQuitar p-1" id="Q${item.id}">-</button>
                <button type="button" class="btn btn-info p-1 botonAgregar" id="A${item.id}" value="1">+</button></td>
                <td id="totalProducto${item.id}">${item.precio}</td>
                `;   

            footerTotal.innerHTML = 
                `
                <tr>
                <td>Total</td>
                <td>sumaCantidades(arr)</td>
                <td></td>
                <td id="sumaTotal">sumaTotal(arr)</td>
                </tr>
                `            
                ;
            medalla.innerHTML = `
                <span class="material-symbols-outlined">shopping_cart</span>sumaCantidades(arr)
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


/*


//Contador de lista productos
let contador = 0;

//Variables iniciales
let totalProducto = 0;
let total = 0;
let cantidadTotal = 0;
let arrMonto = [];

//Objeto con cantidades iniciales de cada producto en el carrito
let selecCantidades = {
    1:0,
    2:0,
    3:0,
    4:0,
};


for (const boton of botonAgregar) {
       //Acceder info productos y objetos DOM
       let a = boton.id;       
       const descripcion = document.querySelector("#producto"+a).innerHTML;
       const precio = document.querySelector("#precio"+a).innerHTML;
       const precioSumable = Number(precio.replace(/[^\d,]/g,""));
       const footerTotal = document.getElementById("totalCarrito");
       const medalla = document.getElementById("medalla"); 
       const inputDcto = document.getElementById("inputDescuento");

//Evento click botón Agregar Carrito
       boton.addEventListener('click', () => {
   //Suma producto en lista
           contador++;
           selecCantidades[a] += 1;
   // Nueva fila en carrito
           const cuerpoCarrito = document.getElementById("cuerpoCarrito"); 
           const filaNuevoProducto = document.createElement("tr");
           cuerpoCarrito.appendChild(filaNuevoProducto);

   //Agrega producto a offcanvas
           if (selecCantidades[a] === 1) {
            agregaProducto(selecCantidades[a], precioSumable);
               filaNuevoProducto.innerHTML += ` 
               <td>${descripcion}</td>
               <td class="cantidades p-auto" id="cantidadProducto${a}">${selecCantidades[a]}</td>
               <td><button type="button" class="btn btn-danger botonQuitar p-1" id="Q${a}">-</button>
               <button type="button" class="btn btn-info p-1 botonAgregar" id="A${a}" value="1">+</button></td>
               <td id="totalProducto${a}">${precioSumable}</td>
               `;   
                
                boton.disabled = true;

                footerTotal.innerHTML = 
                `
                <tr>
                <td>Total</td>
                <td>${sumaCantidades(arrMonto)}</td>
                <td></td>
                <td id="sumaTotal">${sumaTotal(arrMonto)}</td>
                </tr>
                `            
                ;
                medalla.innerHTML = `
                <span class="material-symbols-outlined">shopping_cart</span>${sumaCantidades(arrMonto)}
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
    //Botón aplica descuento 
        document.getElementById("input-group-button-right")?.addEventListener('click', () => {
            aplicaDescuento(arrMonto);
            });

    //Botón restar cantidad y quitar producto en offcanvas
    document.getElementById("Q"+a).addEventListener('click', () => {
        selecCantidades[a]--;
        quitaProducto(selecCantidades[a], precioSumable);
        document.getElementById("cantidadProducto"+a).innerHTML = selecCantidades[a];
        document.getElementById("totalProducto"+a).innerHTML = selecCantidades[a]*precioSumable;
        footerTotal.innerHTML = `
        <td>Total</td>
        <td>${sumaCantidades(arrMonto)}</td>
        <td></td>
        <td id="sumaTotal">${sumaTotal(arrMonto)}</td>
        `;
        medalla.innerHTML = `
        <span class="material-symbols-outlined">shopping_cart</span>${sumaCantidades(arrMonto)}
        `;

            if (selecCantidades[a] === 0) {
                filaNuevoProducto.remove()
                boton.disabled = false
                }
            if (arrMonto.length === 0) {
                    footerTotal.innerHTML = `
                    <td colspan="4">Tu carrito está vacío.</td>
                    `;
                    medalla.innerHTML = `
                    <span class="material-symbols-outlined">shopping_cart</span>
                    `;
                    inputDcto.innerHTML = ``;
                }    }
    );
       
    // Boton sumar +1 cantidad offcanvas

        document.getElementById("A"+a).addEventListener('click', () => {
            selecCantidades[a]++;  
            sumaProducto(selecCantidades[a], precioSumable);
            document.getElementById("cantidadProducto"+a).innerHTML = selecCantidades[a];
            document.getElementById("totalProducto"+a).innerHTML = selecCantidades[a]*precioSumable;
            footerTotal.innerHTML = `
            <td>Total</td>
            <td>${sumaCantidades(arrMonto)}</td>
            <td></td>
            <td id="sumaTotal">${sumaTotal(arrMonto)}</td>
            `;
            medalla.innerHTML = `
            <span class="material-symbols-outlined">shopping_cart</span>${sumaCantidades(arrMonto)}
            `;
        });

    //Operaciones de manipulación arreglo carrito
    function agregaProducto (cantidad, precio) {
        if (arrMonto.some(fila => fila.includes(precio)) === false) {  
            let arrProducto = [];
            arrProducto.push(cantidad, precio);
            arrMonto.push(arrProducto);
        }
    };
    function quitaProducto (cantidad, precio) {
        for(i=0; i < arrMonto.length; i++) {
            if (arrMonto[i][1] === precio ) {
                arrMonto[i][0] = cantidad;
                if (arrMonto[i][0] === 0) {
                    arrMonto.splice(i, 1);
                }
            }
        }
    }
    function sumaProducto (cantidad, precio) {
        for(i=0; i < arrMonto.length; i++) {
            if (arrMonto[i][1] === precio ) {
                arrMonto[i][0] = cantidad;
            }
        }
    };


//Suma cantidad de productos total
    function sumaCantidades (arr) {
        let cantidades = [];
        for (i=0; i < arr.length; i++) {
            cantidades.push(arr[i][0]);
        }
        let sumaCantidades = cantidades.reduce((a,b) => a+b, 0);
        return sumaCantidades;
    }
    
    function sumaTotal (arr) {
        let sumaParcial = [];
        for (i=0; i < arr.length; i++) {
            let parcialProducto = arr[i][0]*arr[i][1];
            sumaParcial.push(parcialProducto);
        }
        let sumaProductos = sumaParcial.reduce((a,b) => a+b, 0);
        return sumaProductos;
    }

//Función aplica descuento
function aplicaDescuento (arr) {
    let codigoDescuento = document.getElementById("textoDescuento").value;
    let descuento = parseInt(codigoDescuento.slice(8, 10));
    let precioDescuento = sumaTotal(arr)-(sumaTotal(arr)*descuento/100);
    return document.getElementById("sumaTotal").innerHTML = precioDescuento
    }
    });
};

*/
