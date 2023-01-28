
const infoProductos = []

//Leer JSON con API fetch

fetch("../data/productos.json")
.then(res => res.json())
.then(data => {
    return data.forEach((i)=>{
        infoProductos.push(i)
    })
    
})

function tarjetasDOM (arr) {
    const temp = document.getElementsByTagName("template")[0]
    const clon = temp.content.cloneNode(true)
    document.getElementById("contenedorTarjetas").appendChild(clon)
}

tarjetasDOM(infoProductos)

 //Tarjetas productos

        /*document.getElementsByClassName("tarjetaProducto").textContent = i
        const clone = tarjeta.cloneNode(true)
        fragment.appendChild(clone);*/





       // tarjeta.setAttribute("class", "col d-flex align-items-lg-stretch")

 /*       document.getElementById("contenedorTarjetas").appendChild(tarjeta);
        //Modal productos
        let modal = document.createElement('div');
        modal.setAttribute("class", "modal");
        modal.innerHTML = `
                <div class="modal fade" id="modalFicha${i.id}" aria-hidden="true" aria-labelledby="modalFicha${i.id}" tabindex="-1">
        <div class="modal-dialog modal-fullscreen">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Tiendita de Música</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">

                <div class="row  pt-5 pb-5 px-5">
                <div class="col-8 d-flex align-items-lg-stretch">
                    <div class="card">
                    <div class="row g-0">
                        <div class="col-4 col-sm-4">
                        <img src="${i.imagen}" class="img-fluid w-100 p-3" alt="card-horizontal-image">
                        </div>
                        <div class="col-8 col-sm-8">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${i.nombre}</h5>
                            <h4 class="card-title">${i.precio}</h4>
                            <p class="card-text">${i.descripcion}</p>
                                    </div>
                        </div>
                    </div>
                    </div>
                </div>
                <div class="col-4">
                    <div class="card">
                    <div class="card-header">
                        Stock: Quedan ${i.stock} disponibles.
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">Despacho a todo el país</h5>
                        <p class="card-text">Paga en hasta 12 cuotas sin interés.</p>
                    </div>
                    <div class="card-footer text-muted">
                        Devolución gratis. Tienes hasta 30 días desde que lo recibes.
                    </div>
                    </div>
                </div>
                </div>


            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Volver</button>
            </div>
            </div>
        </div>
        </div>
        `
        document.body.appendChild(modal);*/











//Recuperar botones Agregar Carrito en el DOM
const botonAgregar = document.getElementsByClassName("botonAgregar");

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


