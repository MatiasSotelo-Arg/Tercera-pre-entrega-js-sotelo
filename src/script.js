// VARIABLES
const productos = [];
const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

let ultimoId = parseInt(localStorage.getItem('ultimoId')) || -1;

mostrarCarrito();

class Producto {
    constructor(imagen,marca,nombre,costo,precio,stock) {
        this.id = this.calcularId();
        this.imagen = imagen;
        this.marca = marca;
        this.nombre = nombre;
        this.costo = parseFloat(costo).toFixed(2);;
        this.precio = parseFloat(precio).toFixed(2);;
        this.ganancia = this.calcularGanancia(this.precio,this.costo).toFixed(2);;
        this.margenBeneficio = this.calcularMargenBeneficio(this.ganancia,this.precio);
        this.stock = stock;
        this.disponibilidad = this.calcularDisponibilidad(stock);
    }

    calcularId = () => ++ultimoId;

    calcularGanancia = (precio,costo) => precio - costo;

    calcularMargenBeneficio = (ganancia,precio) => ganancia / precio * 100;

    calcularDisponibilidad = (stock) => stock >= 1;
}

productos.push(new Producto("T-GRAZ-03.jpg","tressa","T01",300,500,5));
productos.push(new Producto("T-HANNA-07.jpg","tressa","T02",400,900,10));
productos.push(new Producto("T-MAGGIE-01.jpg","tressa","T03",100,900,3));
productos.push(new Producto("t-punta.jpg","tressa","T04",200,900,5));
productos.push(new Producto("TRESSA-MICHELE.jpg","tressa","T05",460,900,4));
productos.push(new Producto("TRESSA-PAMELA.jpg","tressa","T06",230,900,3));

// IMPLEMENTACION
function mostrarProductosDom () {
    const contenedorProductos = document.getElementById("contenedor-productos");

    productos.forEach(prod => {
        const infoProductos = document.createElement("div");
        infoProductos.classList.add("card-producto");
        infoProductos.innerHTML = `
            <div class="card-img">
                <img src="assets//${prod.imagen}">
            </div>
            <div class="card-indo">
                <p>${prod.marca} - ${prod.nombre}</p>
                <p>$${prod.precio}</p>
                <input id="producto-${prod.id}" class="agregar" type="submit" value="agregar al carrito">
            </div>
        `

        contenedorProductos.appendChild(infoProductos);
    })
    

}

function mostrarCarrito () {
    const carrito = document.querySelector('.carrito');
    const carritoContenido = document.querySelector('.carrito-contenido');

    carrito.addEventListener('click', () => {
        carritoContenido.style.display = 'block';
    });
    cerrarCarrito(carritoContenido);

}

function cerrarCarrito (carritoCard) {
    const btnX = document.querySelector('.cerrar');
    
    btnX.addEventListener('click', () => {
        carritoCard.style.display = 'none';
    });
}

function funcionalidadBtnCarrito () {
    productos.forEach(prod => {
        document.getElementById(`producto-${prod.id}`).addEventListener('click', () => {
            agregarProductoAlCarrito(prod);
            mostrarProductoCarrito();
            calcularTotalCarrito();    
        })
    });
   
}

function agregarProductoAlCarrito(prod) {
    let index = carrito.findIndex((element) => element.id == prod.id);
  
    if (index === -1) {
      prod.cantidad = 1;
      prod.total = prod.precio;
      carrito.push(prod);
    } else {
      carrito[index].cantidad++;
      carrito[index].total = carrito[index].precio * carrito[index].cantidad;
    }
  
    localStorage.setItem('carrito', JSON.stringify(carrito));
    console.log(carrito);
  }
  

function mostrarProductoCarrito() {
    const carritoCard = document.getElementById('carrito-card');
    if(carrito.length == 0 ) {
        carritoCard.innerHTML = '<p class="carritoVacio"> Carrito Vacio </p>'
    } else {
        carritoCard.innerHTML = '';
    
        carrito.forEach((prod) => {
            carritoCard.innerHTML += `<div class="producto-carrito">
            <img class="img-carrito" src="assets//${prod.imagen}"> ${prod.marca} - ${prod.nombre} ${prod.cantidad}u. x $${prod.precio} - $${prod.total}
            <input id="btn-${prod.id}" type="submit" value="X"> 
            </div>
            `
        })
        eliminarProductoCarrito();
    }
    
}

function calcularTotalCarrito() {
    const totalCarrito = document.getElementById('carrito-total');
    let total = carrito.reduce((acc,ite)=>acc + ite.precio * ite.cantidad, 0);

    totalCarrito.innerHTML = `Total: $${total}`
    console.log(total);
}

function eliminarProductoCarrito() {
    carrito.forEach(prod => {
        document.getElementById(`btn-${prod.id}`).addEventListener('click', () => {
            const eliminar = prod.id;
            const index = carrito.findIndex(item => item.id === eliminar);
            carrito.splice(index, 1);
            mostrarProductoCarrito();
            calcularTotalCarrito();
            localStorage.setItem('carrito', JSON.stringify(carrito));
        });
    });
}

mostrarProductoCarrito();
mostrarProductosDom();
funcionalidadBtnCarrito();

