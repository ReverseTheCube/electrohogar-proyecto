// =====================================================
// MÓDULO ESPECÍFICO PARA PÁGINA DE PRODUCTOS
// =====================================================

// ARREGLOS BIDIMENSIONALES
const inventarioProductos = [
    ["Aire Acondicionado", 399.99, 15, "LG", "Climatización"],
    ["Alarmas de Seguridad", 199.99, 25, "Hikvision", "Seguridad"],
    ["Refrigeradora", 499.99, 8, "Samsung", "Electrodomésticos"],
    ["Batidora", 89.99, 30, "Oster", "Cocina"],
    ["Cocina", 329.99, 12, "Bosch", "Electrodomésticos"],
    ["Balanza Digital", 259.99, 20, "Tanita", "Medición"],
    ["Amplificador de Guitarra", 679.99, 5, "Marshall", "Audio"]
];

const descuentosPorCantidad = [
    [1, 1, 0],
    [2, 2, 5],
    [3, 4, 10],
    [5, 7, 15],
    [8, 10, 20],
    [11, 999, 25]
];



// ESTRUCTURA WHILE - Aplicar filtros
function aplicarFiltros() {
    const precioMin = parseFloat(document.getElementById('precio-min').value) || 0;
    const precioMax = parseFloat(document.getElementById('precio-max').value) || 9999;
    const stockMin = parseInt(document.getElementById('stock-min').value) || 0;
    const soloDisponibles = document.getElementById('solo-disponibles').checked;
    
    const productos = document.querySelectorAll('#productos-container .col');
    let productosVisibles = 0;
    let i = 0;
    
    while (i < productos.length) {
        const producto = productos[i];
        const precio = parseFloat(producto.dataset.precio);
        const stock = parseInt(producto.dataset.stock || "999");
        const disponible = producto.dataset.disponible === 'true';
        
        let mostrar = true;
        
        // IF-ELSE para aplicar filtros
        if (precio < precioMin || precio > precioMax) {
            mostrar = false;
        } else if (stock < stockMin) {
            mostrar = false;
        } else if (soloDisponibles && !disponible) {
            mostrar = false;
        }
        
        if (mostrar) {
            producto.style.display = 'block';
            productosVisibles++;
        } else {
            producto.style.display = 'none';
        }
        
        i++;
    }
    
    alert(`Se encontraron ${productosVisibles} productos que cumplen los filtros`);
}


// ESTRUCTURA FOR
function verificarStock() {
    for (let i = 0; i < inventarioProductos.length; i++) {
        const producto = inventarioProductos[i];
        const nombre = producto[0];
        const stock = producto[2];
        
        // IF-ELSE ANIDADO
        if (stock <= 5) {
            console.log(`⚠️ Stock crítico: ${nombre} - ${stock} unidades`);
        } else if (stock <= 10) {
            console.log(`⚡ Stock bajo: ${nombre} - ${stock} unidades`);
        } else {
            console.log(`✅ Stock normal: ${nombre} - ${stock} unidades`);
        }
    }
}



// Inicialización
function inicializarProductosPage() {
    // Hacer función disponible globalmente para el HTML
    window.aplicarFiltros = aplicarFiltros;
    
    // Ejecutar verificación de stock
    verificarStock();
    
    console.log("Página de productos inicializada con funcionalidades JavaScript");
}

// Auto-inicializar cuando se carga el módulo
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('#productos-container')) {
        inicializarProductosPage();
    }
});