// =====================================================
// MÓDULO DOM LIMPIO - NAVEGACIÓN Y ATRIBUTOS HTML
// =====================================================

// 1. MODELO DE OBJETOS DE DOCUMENTO (DOM)
// ========================================

// Función para manipular el DOM - Crear elementos dinámicamente
function crearTarjetaProducto(nombre, precio, imagen, descripcion) {
    // Crear elemento principal usando DOM
    const col = document.createElement('div');
    col.className = 'col';
    col.setAttribute('data-precio', precio);
    col.setAttribute('data-producto', nombre);
    
    // Crear estructura completa del producto
    col.innerHTML = `
        <div class="card h-100">
            <img src="${imagen}" class="card-img-top" alt="${nombre}">
            <div class="card-body d-flex flex-column">
                <h5 class="card-title">${nombre}</h5>
                <p class="card-text">${descripcion}</p>
                <p class="text-success fw-bold">$${precio}</p>
                <div class="input-group mb-2">
                    <label class="input-group-text">Cantidad</label>
                    <input type="number" class="form-control cantidad" min="1" value="1">
                </div>
                <button class="btn btn-success w-100 agregar-carrito" data-producto="${nombre}" data-precio="${precio}">
                    <i class="fas fa-cart-plus me-2"></i>Agregar al carrito
                </button>
            </div>
        </div>
    `;
    
    return col;
}

// Función para agregar producto al DOM
function agregarProductoAlDOM(producto) {
    const contenedor = document.getElementById('productos-container');
    if (!contenedor) return;
    
    const nuevaTarjeta = crearTarjetaProducto(
        producto.nombre,
        producto.precio,
        producto.imagen,
        producto.descripcion
    );
    
    // Agregar al DOM usando appendChild
    contenedor.appendChild(nuevaTarjeta);
    
    console.log(`✅ Producto "${producto.nombre}" agregado al DOM`);
}

// 2. PROPIEDADES DE NAVEGACIÓN ENTRE NODOS
// =========================================

// Función para navegar entre tarjetas de productos (hermanos)
function navegarEntreProductos(direccion) {
    const productos = document.querySelectorAll('#productos-container .col');
    let productoActual = document.querySelector('.col.producto-seleccionado');
    
    // Si no hay producto seleccionado, seleccionar el primero
    if (!productoActual && productos.length > 0) {
        productoActual = productos[0];
        productoActual.classList.add('producto-seleccionado');
        resaltarProducto(productoActual);
        return;
    }
    
    let siguienteProducto = null;
    
    // Navegación usando propiedades de nodos
    if (direccion === 'siguiente') {
        // Usar nextElementSibling para navegar al siguiente
        siguienteProducto = productoActual.nextElementSibling;
        if (!siguienteProducto) {
            // Si no hay siguiente, ir al primero (circular)
            siguienteProducto = productoActual.parentElement.firstElementChild;
        }
    } else if (direccion === 'anterior') {
        // Usar previousElementSibling para navegar al anterior
        siguienteProducto = productoActual.previousElementSibling;
        if (!siguienteProducto) {
            // Si no hay anterior, ir al último (circular)
            siguienteProducto = productoActual.parentElement.lastElementChild;
        }
    }
    
    if (siguienteProducto) {
        // Quitar selección actual
        productoActual.classList.remove('producto-seleccionado');
        quitarResaltado(productoActual);
        
        // Seleccionar nuevo producto
        siguienteProducto.classList.add('producto-seleccionado');
        resaltarProducto(siguienteProducto);
        
        // Scroll suave al producto
        siguienteProducto.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Función para navegar por jerarquía (padre -> hijos)
function explorarJerarquiaDOM(elemento) {
    console.log('🔍 EXPLORACIÓN DE JERARQUÍA DOM:');
    
    // Navegación hacia arriba (padres)
    console.log('👆 Navegando hacia arriba:');
    let padre = elemento.parentElement;
    let nivel = 1;
    while (padre && nivel <= 5) {
        console.log(`  Nivel ${nivel}: ${padre.tagName} - clases: ${padre.className}`);
        padre = padre.parentElement;
        nivel++;
    }
    
    // Navegación hacia abajo (hijos)
    console.log('👇 Navegando hacia abajo:');
    const hijos = elemento.children;
    for (let i = 0; i < hijos.length; i++) {
        console.log(`  Hijo ${i + 1}: ${hijos[i].tagName} - clases: ${hijos[i].className}`);
        
        // Explorar nietos
        const nietos = hijos[i].children;
        for (let j = 0; j < nietos.length; j++) {
            console.log(`    Nieto ${j + 1}: ${nietos[j].tagName}`);
        }
    }
    
    // Navegación lateral (hermanos)
    console.log('↔️ Navegando lateralmente:');
    if (elemento.previousElementSibling) {
        console.log(`  Hermano anterior: ${elemento.previousElementSibling.tagName}`);
    }
    if (elemento.nextElementSibling) {
        console.log(`  Hermano siguiente: ${elemento.nextElementSibling.tagName}`);
    }
}

// 3. ATRIBUTOS ESTÁNDAR DE ETIQUETAS HTML
// ========================================

// Función para manipular atributos HTML estándar
function manipularAtributosHTML(elemento) {
    // Obtener atributos existentes
    const atributosOriginales = {
        id: elemento.getAttribute('id'),
        className: elemento.getAttribute('class'),
        dataProducto: elemento.getAttribute('data-producto'),
        dataPrecio: elemento.getAttribute('data-precio')
    };
    
    console.log('📋 Atributos originales:', atributosOriginales);
    
    // Modificar atributos estándar
    elemento.setAttribute('id', `producto-${Date.now()}`);
    elemento.setAttribute('title', 'Producto destacado - Haz clic para más detalles');
    elemento.setAttribute('data-estado', 'modificado');
    elemento.setAttribute('data-timestamp', new Date().toISOString());
    
    // Agregar nuevas clases
    elemento.classList.add('producto-modificado');
    elemento.classList.add('highlight');
    
    // Modificar estilos usando atributos
    elemento.style.border = '3px solid #007bff';
    elemento.style.borderRadius = '10px';
    elemento.style.transition = 'all 0.3s ease';
    
    console.log('✅ Atributos modificados');
    
    return atributosOriginales;
}

// Función para cambiar atributos de imagen
function cambiarAtributosImagen(tarjetaProducto) {
    const imagen = tarjetaProducto.querySelector('img');
    
    if (imagen) {
        // Guardar atributos originales
        const srcOriginal = imagen.getAttribute('src');
        const altOriginal = imagen.getAttribute('alt');
        
        // Modificar atributos de imagen
        imagen.setAttribute('loading', 'lazy');
        imagen.setAttribute('data-src-original', srcOriginal);
        imagen.setAttribute('data-modificado', 'true');
        
        // Cambiar título y alt
        imagen.setAttribute('alt', `${altOriginal} - Imagen optimizada`);
        imagen.setAttribute('title', 'Imagen cargada dinámicamente');
        
        // Agregar clases CSS
        imagen.classList.add('imagen-dinamica');
        
        console.log('🖼️ Atributos de imagen modificados');
        
        return { srcOriginal, altOriginal };
    }
}

// Función para modificar atributos de botones
function modificarAtributosBotones(tarjetaProducto) {
    const boton = tarjetaProducto.querySelector('.agregar-carrito');
    
    if (boton) {
        // Modificar atributos del botón
        boton.setAttribute('data-original-text', boton.textContent);
        boton.setAttribute('data-clicks', '0');
        boton.setAttribute('title', 'Agregar producto al carrito de compras');
        boton.setAttribute('aria-label', 'Botón para agregar producto al carrito');
        
        // Agregar evento para contar clicks
        boton.addEventListener('click', function() {
            let clicks = parseInt(this.getAttribute('data-clicks')) + 1;
            this.setAttribute('data-clicks', clicks);
            console.log(`🖱️ Botón clickeado ${clicks} veces`);
        });
        
        console.log('🔘 Atributos de botón modificados');
    }
}

// 4. FUNCIONES DE EFECTOS VISUALES
// =================================

function resaltarProducto(elemento) {
    elemento.style.transform = 'scale(1.05)';
    elemento.style.boxShadow = '0 10px 25px rgba(0,123,255,0.3)';
    elemento.style.border = '3px solid #007bff';
    elemento.style.zIndex = '10';
}

function quitarResaltado(elemento) {
    elemento.style.transform = 'scale(1)';
    elemento.style.boxShadow = '';
    elemento.style.border = '';
    elemento.style.zIndex = '';
}

// 5. FUNCIONES PRINCIPALES PARA DEMOSTRAR FUNCIONALIDADES
// ========================================================

function aplicarManipulacionDOMSilenciosa() {
    console.log('🚀 Aplicando funcionalidades DOM en segundo plano');
    
    // Verificar si estamos en la página correcta
    if (!document.querySelector('#productos-container')) {
        console.log('ℹ️ Funcionalidades DOM no aplicables en esta página');
        return;
    }
    
    // 1. Seleccionar primera tarjeta de producto para demostración silenciosa
    const primeraTargeta = document.querySelector('#productos-container .col');
    
    if (!primeraTargeta) {
        console.log('❌ No se encontraron productos para aplicar funcionalidades');
        return;
    }
    
    console.log('📦 Aplicando funcionalidades a producto:', primeraTargeta);
    
    // 2. Aplicar navegación entre nodos silenciosamente
    explorarJerarquiaDOM(primeraTargeta);
    
    // 3. Aplicar manipulación de atributos silenciosamente  
    const atributosOriginales = manipularAtributosHTML(primeraTargeta);
    cambiarAtributosImagen(primeraTargeta);
    modificarAtributosBotones(primeraTargeta);
    
    // 4. Agregar navegación con teclado
    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowRight') {
            navegarEntreProductos('siguiente');
        } else if (event.key === 'ArrowLeft') {
            navegarEntreProductos('anterior');
        }
    });
    
    console.log('⌨️ Navegación con teclado habilitada (← →)');
    console.log('✅ Funcionalidades DOM aplicadas correctamente');
}

// Función para inicializar funcionalidades DOM (sin alertas ni productos automáticos)
function inicializarFuncionalidadesDOM() {
    // Verificar que estamos en la página correcta
    if (!document.querySelector('#productos-container')) {
        console.log('ℹ️ Funcionalidades DOM no aplicables en esta página');
        return;
    }
    
    console.log('🔧 Inicializando funcionalidades DOM silenciosamente...');
    
    // Ejecutar funcionalidades sin interferir con el usuario
    setTimeout(() => {
        aplicarManipulacionDOMSilenciosa();
    }, 1000);
}

// Auto-inicializar cuando se carga el módulo (sin interferencias)
document.addEventListener('DOMContentLoaded', function() {
    inicializarFuncionalidadesDOM();
});

// Exportar funciones principales
export {
    crearTarjetaProducto,
    agregarProductoAlDOM,
    navegarEntreProductos,
    explorarJerarquiaDOM,
    manipularAtributosHTML,
    cambiarAtributosImagen,
    modificarAtributosBotones,
    aplicarManipulacionDOMSilenciosa,
    inicializarFuncionalidadesDOM
};