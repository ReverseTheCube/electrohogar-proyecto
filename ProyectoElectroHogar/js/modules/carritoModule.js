// =====================================================
// MÓDULO DEL CARRITO - ELECTROHOGAR (Versión Corregida)
// =====================================================

// Constantes
const IVA = 0.18;
const MAX_PRODUCTOS = 10;
let carrito = [];

// ARREGLOS BIDIMENSIONALES
let historialCompras = [
    ["2025-01-15", "Aire Acondicionado", 1, 399.99, "Completada"],
    ["2025-01-14", "Batidora", 2, 89.99, "Completada"],
    ["2025-01-13", "Refrigeradora", 1, 499.99, "Pendiente"],
    ["2025-01-12", "Cocina", 1, 329.99, "Completada"],
    ["2025-01-11", "Balanza Digital", 3, 259.99, "Completada"]
];

const descuentosPorCantidad = [
    [1, 1, 0],      // [cantidad_min, cantidad_max, descuento_porcentaje]
    [2, 2, 5],
    [3, 4, 10],
    [5, 7, 15],
    [8, 10, 20],
    [11, 999, 25]
];

// Inicializar carrito desde localStorage
export function inicializarCarrito() {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        actualizarContadorGlobal();
    }
}

// OPERADORES MATEMÁTICOS - Calcular descuento por cantidad
function calcularDescuentoPorCantidad(totalProductos) {
    let descuentoPorcentaje = 0;
    
    // ESTRUCTURA FOR para buscar el descuento correspondiente
    for (let i = 0; i < descuentosPorCantidad.length; i++) {
        const rangoMin = descuentosPorCantidad[i][0];
        const rangoMax = descuentosPorCantidad[i][1];
        const descuento = descuentosPorCantidad[i][2];
        
        if (totalProductos >= rangoMin && totalProductos <= rangoMax) {
            descuentoPorcentaje = descuento;
            break;
        }
    }
    
    return descuentoPorcentaje;
}

// IF-ELSE - Validar y agregar producto con lógica avanzada
export function agregarProductoAlCarrito(nombre, precio, cantidad) {
    // IF-ELSE SIMPLE - Validación básica
    if (cantidad < 1) {
        alert('La cantidad debe ser al menos 1');
        return false;
    }
    
    // IF-ELSE DOBLE - Verificar límites
    if (carrito.length >= MAX_PRODUCTOS) {
        alert(`Máximo ${MAX_PRODUCTOS} productos permitidos`);
        return false;
    }
    
    // Buscar si el producto ya está en el carrito
    const productoExistente = carrito.find(p => p.nombre === nombre);
    
    // IF-ELSE para manejar producto existente vs nuevo
    if (productoExistente) {
        const nuevaCantidad = productoExistente.cantidad + cantidad;
        
        // IF-ELSE anidado para validar stock máximo
        if (nuevaCantidad > 20) {
            alert(`No puedes agregar más de 20 unidades del mismo producto. Actualmente tienes ${productoExistente.cantidad}`);
            return false;
        } else {
            productoExistente.cantidad = nuevaCantidad;
            productoExistente.subtotal = productoExistente.precio * nuevaCantidad;
        }
    } else {
        // Producto nuevo - agregar al carrito
        const nuevoProducto = {
            nombre,
            precio,
            cantidad,
            subtotal: precio * cantidad,
            fechaAgregado: new Date().toLocaleDateString()
        };
        carrito.push(nuevoProducto);
    }
    
    guardarCarrito();
    return true;
}

// WHILE - Limpiar productos con cantidad 0
function limpiarProductosVacios() {
    let i = 0;
    let productosEliminados = 0;
    
    while (i < carrito.length) {
        if (carrito[i].cantidad <= 0) {
            carrito.splice(i, 1);
            productosEliminados++;
        } else {
            i++;
        }
    }
    
    return productosEliminados;
}

// SWITCH-CASE - Aplicar descuentos especiales por tipo de producto
function aplicarDescuentoEspecial(nombreProducto, precio) {
    let descuentoEspecial = 0;
    let razonDescuento = "";
    
    switch (nombreProducto.toLowerCase()) {
        case "aire acondicionado":
            descuentoEspecial = precio * 0.15;
            razonDescuento = "Descuento de temporada de verano";
            break;
        case "refrigeradora":
            descuentoEspecial = precio * 0.20;
            razonDescuento = "Liquidación de modelos anteriores";
            break;
        case "batidora":
        case "balanza digital":
            descuentoEspecial = precio * 0.08;
            razonDescuento = "Descuento en electrodomésticos de cocina";
            break;
        case "cocina":
            descuentoEspecial = precio * 0.12;
            razonDescuento = "Promoción especial en cocinas";
            break;
        case "alarmas de seguridad":
            descuentoEspecial = precio * 0.10;
            razonDescuento = "Descuento por seguridad del hogar";
            break;
        case "amplificador de guitarra":
            descuentoEspecial = precio * 0.18;
            razonDescuento = "Descuento especial en equipos de audio";
            break;
        default:
            descuentoEspecial = precio * 0.05;
            razonDescuento = "Descuento general de la tienda";
    }
    
    return {
        descuento: descuentoEspecial,
        razon: razonDescuento
    };
}

// FOR - Mostrar carrito con cálculos avanzados
export function mostrarCarrito() {
    const tbody = document.getElementById('carrito-body');
    const totalElement = document.getElementById('total');
    
    if (!tbody || !totalElement) return;
    
    limpiarProductosVacios();
    
    // Limpiar tabla
    tbody.innerHTML = '';
    
    // Variables para cálculos con operadores matemáticos
    let subtotalGeneral = 0;
    let descuentoTotalPorCantidad = 0;
    let descuentoTotalEspecial = 0;
    let totalProductos = 0;
    
    // FOR principal para recorrer carrito
    for (let i = 0; i < carrito.length; i++) {
        const producto = carrito[i];
        
        const descuentoInfo = aplicarDescuentoEspecial(producto.nombre, producto.precio);
        const precioConDescuentoEspecial = producto.precio - descuentoInfo.descuento;
        const subtotalConDescuento = precioConDescuentoEspecial * producto.cantidad;
        
        subtotalGeneral += subtotalConDescuento;
        descuentoTotalEspecial += descuentoInfo.descuento * producto.cantidad;
        totalProductos += producto.cantidad;
        
        // Crear fila
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>
                <strong>${producto.nombre}</strong>
                <br><small class="text-muted">Agregado: ${producto.fechaAgregado || 'N/A'}</small>
                <br><small class="text-success">${descuentoInfo.razon}</small>
            </td>
            <td>
                <span class="text-decoration-line-through text-muted">$${producto.precio.toFixed(2)}</span>
                <br><strong class="text-success">$${precioConDescuentoEspecial.toFixed(2)}</strong>
                <br><small class="text-success">Ahorro: $${descuentoInfo.descuento.toFixed(2)}</small>
            </td>
            <td>
                <input type="number" min="1" max="20" value="${producto.cantidad}" 
                       class="form-control cantidad-producto" data-index="${i}" style="width: 80px;">
            </td>
            <td>
                <strong>$${subtotalConDescuento.toFixed(2)}</strong>
            </td>
            <td>
                <button class="btn btn-danger btn-sm btn-eliminar" data-index="${i}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(fila);
    }
    
    // Calcular descuento por cantidad total
    const descuentoPorCantidadPorcentaje = calcularDescuentoPorCantidad(totalProductos);
    descuentoTotalPorCantidad = subtotalGeneral * (descuentoPorCantidadPorcentaje / 100);
    
    const subtotalConDescuentos = subtotalGeneral - descuentoTotalPorCantidad;
    const impuestos = subtotalConDescuentos * IVA;
    const totalFinal = subtotalConDescuentos + impuestos;
    
    // Mostrar total
    totalElement.innerHTML = `
        <div class="bg-light p-3 rounded">
            <h6>💰 Resumen de Compra:</h6>
            <div class="row">
                <div class="col-6">
                    <small>Subtotal original:</small><br>
                    <small>Descuentos especiales:</small><br>
                    <small>Descuento por cantidad (${descuentoPorCantidadPorcentaje}%):</small><br>
                    <small>Subtotal con descuentos:</small><br>
                    <small>IVA (18%):</small><br>
                </div>
                <div class="col-6 text-end">
                    <small>$${(subtotalGeneral + descuentoTotalEspecial).toFixed(2)}</small><br>
                    <small class="text-success">-$${descuentoTotalEspecial.toFixed(2)}</small><br>
                    <small class="text-success">-$${descuentoTotalPorCantidad.toFixed(2)}</small><br>
                    <small>$${subtotalConDescuentos.toFixed(2)}</small><br>
                    <small>+$${impuestos.toFixed(2)}</small><br>
                </div>
            </div>
            <hr>
            <div class="d-flex justify-content-between">
                <strong>TOTAL FINAL:</strong>
                <strong class="text-primary">$${totalFinal.toFixed(2)}</strong>
            </div>
        </div>
    `;
}

// COMPARACIÓN DE ARREGLOS BIDIMENSIONALES
export function compararDosCarritos() {
    const carritoActual = [...carrito];
    const carritoGuardado = JSON.parse(localStorage.getItem('carritoComparacion') || '[]');
    
    const matriz1 = carritoActual.map(item => [item.nombre, item.precio, item.cantidad, item.subtotal]);
    const matriz2 = carritoGuardado.map(item => [item.nombre, item.precio, item.cantidad, item.subtotal]);
    
    if (matriz1.length !== matriz2.length) {
        return {
            sonIguales: false,
            tipo: "Diferente cantidad de productos",
            detalle: `Carrito actual: ${matriz1.length} productos, Carrito guardado: ${matriz2.length} productos`
        };
    }
    
    // FOR ANIDADO para comparar elemento por elemento
    for (let i = 0; i < matriz1.length; i++) {
        for (let j = 0; j < matriz1[i].length; j++) {
            if (matriz1[i][j] !== matriz2[i][j]) {
                const campos = ["nombre", "precio", "cantidad", "subtotal"];
                return {
                    sonIguales: false,
                    tipo: `Diferencia en ${campos[j]} del producto ${i + 1}`,
                    detalle: `Actual: ${matriz1[i][j]}, Guardado: ${matriz2[i][j]}`
                };
            }
        }
    }
    
    return {
        sonIguales: true,
        tipo: "Los carritos son idénticos",
        detalle: `Ambos carritos tienen ${matriz1.length} productos iguales`
    };
}

// Funciones auxiliares
export function actualizarCantidad(index, nuevaCantidad) {
    if (index >= 0 && index < carrito.length && nuevaCantidad > 0) {
        if (nuevaCantidad > 20) {
            alert('Máximo 20 unidades por producto');
            return false;
        } else {
            carrito[index].cantidad = nuevaCantidad;
            carrito[index].subtotal = carrito[index].precio * nuevaCantidad;
            guardarCarrito();
            mostrarCarrito();
            return true;
        }
    }
    return false;
}

export function eliminarProducto(index) {
    if (index >= 0 && index < carrito.length) {
        const nombreProducto = carrito[index].nombre;
        carrito.splice(index, 1);
        guardarCarrito();
        mostrarCarrito();
        actualizarContadorGlobal();
        return true;
    }
    return false;
}

export function vaciarCarrito() {
    const cantidadProductos = carrito.length;
    carrito = [];
    guardarCarrito();
    actualizarContadorGlobal();
    alert(`Carrito vaciado. Se eliminaron ${cantidadProductos} productos.`);
}

function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorGlobal();
}

// FOR para actualizar contador
export function actualizarContadorGlobal() {
    let totalProductos = 0;
    
    for (let i = 0; i < carrito.length; i++) {
        totalProductos += carrito[i].cantidad;
    }
    
    const contadorGlobal = document.getElementById('contador-carrito');
    
    if (contadorGlobal) {
        contadorGlobal.textContent = totalProductos;
        
        // IF-ELSE para cambiar color según cantidad
        if (totalProductos === 0) {
            contadorGlobal.className = 'position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary';
        } else if (totalProductos <= 3) {
            contadorGlobal.className = 'position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success';
        } else if (totalProductos <= 7) {
            contadorGlobal.className = 'position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning';
        } else {
            contadorGlobal.className = 'position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger';
        }
    }
}