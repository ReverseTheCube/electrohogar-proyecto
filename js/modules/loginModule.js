// ==================== DECLARACIÓN DE VARIABLES Y ESTRUCTURAS DE DATOS ====================

// CONSTANTES - Datos del sistema
const SISTEMA_CONFIG = {
    nombre: 'ElectroHogar Admin',
    version: '3.0.1',
    desarrollador: 'Equipo ElectroHogar',
    año: 2025
};

const TIPOS_USUARIO = ['admin', 'gerente', 'empleado', 'cliente'];
const MAX_INTENTOS_LOGIN = 3;
const TIEMPO_BLOQUEO = 30000; // 30 segundos

// ARREGLOS BIDIMENSIONALES - Base de datos de usuarios predefinidos
const USUARIOS_DB = [
    ['admin', '123', 'Administrador General', 'admin@electrohogar.com', 'admin'],
    ['gerente', '456', 'Gerente General', 'gerente@electrohogar.com', 'gerente'],
    ['empleado1', '789', 'Juan Pérez', 'juan.perez@electrohogar.com', 'empleado'],
    ['empleado2', '321', 'María García', 'maria.garcia@electrohogar.com', 'empleado'],
    ['supervisor1', 'spv2025', 'Carlos Mendoza', 'carlos.mendoza@electrohogar.com', 'gerente']
];

// ARREGLOS DE CONFIGURACIÓN
const COLORES_TEMA = ['#007bff', '#28a745', '#dc3545', '#ffc107', '#6f42c1'];
const FUENTES_DISPONIBLES = ['Poppins', 'Arial', 'Roboto', 'Open Sans', 'Montserrat'];

// VARIABLES GLOBALES
let intentosLogin = 0;
let usuarioActual = null;
let temaOscuro = false;
let sistemaBloqueo = false;
let sessionTimer = null;

// ==================== INICIALIZACIÓN DEL SISTEMA ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Iniciando Sistema de Login ElectroHogar');
    
    // Aplicar personalización inicial
    personalizarSitio();
    
    // Generar partículas flotantes
    generarParticulas();
    
    // Configurar eventos del formulario
    configurarEventos();
    
    // Verificar sesión existente
    verificarSesionExistente();
    
    // Hacer funciones disponibles globalmente para onclick en HTML
    window.toggleTheme = toggleTheme;
    window.togglePassword = togglePassword;
    window.mostrarRecuperarPassword = mostrarRecuperarPassword;
    window.mostrarRegistro = mostrarRegistro; // ✅ NUEVA FUNCIÓN
    
    console.log('✅ Sistema inicializado correctamente');
});

// ==================== PERSONALIZACIÓN JAVASCRIPT ====================
function personalizarSitio() {
    console.log('🎨 Aplicando personalización del sitio...');
    
    // Personalizar tipografía dinámicamente
    const fuenteAleatoria = FUENTES_DISPONIBLES[Math.floor(Math.random() * FUENTES_DISPONIBLES.length)];
    document.body.style.fontFamily = fuenteAleatoria + ', sans-serif';
    
    // Personalizar colores
    const colorPrimario = COLORES_TEMA[Math.floor(Math.random() * COLORES_TEMA.length)];
    document.documentElement.style.setProperty('--primary-color', colorPrimario);
    
    // Agregar iconos vectoriales dinámicamente
    agregarIconosVectoriales();
    
    console.log(`✅ Tipografía: ${fuenteAleatoria}, Color: ${colorPrimario}`);
}

function agregarIconosVectoriales() {
    // Crear iconos SVG dinámicos
    const iconContainer = document.createElement('div');
    iconContainer.innerHTML = `
        <svg style="display: none;">
            <defs>
                <symbol id="icon-security" viewBox="0 0 24 24">
                    <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,7.6 15.9,8.7L9.3,15.3C8.2,14.2 7.6,12.8 7.6,11.4C7.6,9 9.6,7 12,7Z"/>
                </symbol>
            </defs>
        </svg>
    `;
    document.body.appendChild(iconContainer);
}

// ==================== GENERACIÓN DE PARTÍCULAS ====================
function generarParticulas() {
    const particlesContainer = document.getElementById('particles');
    const numeroParticulas = 20;
    
    // ESTRUCTURA FOR - Crear partículas
    for (let i = 0; i < numeroParticulas; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Propiedades aleatorias
        const size = Math.random() * 5 + 2;
        const posX = Math.random() * 100;
        const delay = Math.random() * 15;
        
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = posX + '%';
        particle.style.animationDelay = delay + 's';
        
        particlesContainer.appendChild(particle);
    }
    
    console.log(`✨ ${numeroParticulas} partículas generadas`);
}

// ==================== CONFIGURACIÓN DE EVENTOS ====================
function configurarEventos() {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    
    // Evento submit del formulario
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        procesarLogin();
    });
    
    // Eventos de validación en tiempo real
    usernameInput.addEventListener('input', validarCampoUsuario);
    passwordInput.addEventListener('input', validarCampoPassword);
    
    // Eventos de teclado
    document.addEventListener('keydown', function(e) {
        // ESTRUCTURA SWITCH-CASE para atajos de teclado
        switch(e.key) {
            case 'F1':
                e.preventDefault();
                mostrarAyuda();
                break;
            case 'F2':
                e.preventDefault();
                mostrarAyuda();
                break;
            case 'Escape':
                cerrarModales();
                break;
        }
    });
    
    console.log('⚙️ Eventos configurados');
}

// ==================== SISTEMA DE REGISTRO ==================== ✅ NUEVO

function mostrarRegistro() {
    console.log('📝 Mostrando formulario de registro...');
    
    const registroHTML = `
        <div class="registro-container">
            <div class="text-center mb-4">
                <i class="fas fa-user-plus fa-3x text-success mb-3"></i>
                <h4 class="text-success">Crear Cuenta Nueva</h4>
                <p class="text-muted">Únete a ElectroHogar y disfruta de nuestros productos</p>
            </div>
            
            <form id="registroForm" onsubmit="procesarRegistro(event)">
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Nombre Completo *</label>
                        <input type="text" class="form-control" id="regNombre" required 
                               placeholder="Ej: Juan Pérez">
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Email *</label>
                        <input type="email" class="form-control" id="regEmail" required 
                               placeholder="ejemplo@correo.com">
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Usuario *</label>
                        <input type="text" class="form-control" id="regUsuario" required 
                               placeholder="Nombre de usuario" minlength="3">
                        <small class="text-muted">Mínimo 3 caracteres</small>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Contraseña *</label>
                        <input type="password" class="form-control" id="regPassword" required 
                               placeholder="Contraseña segura" minlength="3">
                        <small class="text-muted">Mínimo 3 caracteres</small>
                    </div>
                </div>
                
                <div class="mb-3">
                    <label class="form-label">Teléfono (opcional)</label>
                    <input type="tel" class="form-control" id="regTelefono" 
                           placeholder="Ej: 987654321">
                </div>
                
                <div class="form-check mb-3">
                    <input class="form-check-input" type="checkbox" id="regTerminos" required>
                    <label class="form-check-label" for="regTerminos">
                        Acepto los <a href="politicas.html" target="_blank">términos y condiciones</a> *
                    </label>
                </div>
                
                <div id="registroAlerta"></div>
                
                <button type="submit" class="btn btn-success w-100" id="btnRegistro">
                    <i class="fas fa-user-check me-2"></i>
                    <span id="registroTexto">Crear Cuenta</span>
                </button>
            </form>
        </div>
    `;
    
    // Configurar modal
    document.getElementById('modalTitle').innerHTML = '<i class="fas fa-user-plus me-2"></i>Registro de Usuario';
    document.getElementById('modalBody').innerHTML = registroHTML;
    
    // Configurar footer del modal
    const modalFooter = document.getElementById('modalFooter');
    modalFooter.innerHTML = `
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            <i class="fas fa-times me-2"></i>Cancelar
        </button>
        <button type="button" class="btn btn-primary" onclick="cambiarALogin()">
            <i class="fas fa-sign-in-alt me-2"></i>Ya tengo cuenta
        </button>
    `;
    
    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('infoModal'));
    modal.show();
    
    // Hacer función disponible globalmente
    window.procesarRegistro = procesarRegistro;
    window.cambiarALogin = cambiarALogin;
}

function procesarRegistro(event) {
    event.preventDefault();
    console.log('📝 Procesando registro de usuario...');
    
    // Obtener datos del formulario
    const nombre = document.getElementById('regNombre').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const usuario = document.getElementById('regUsuario').value.trim();
    const password = document.getElementById('regPassword').value;
    const telefono = document.getElementById('regTelefono').value.trim();
    const terminos = document.getElementById('regTerminos').checked;
    
    // Validaciones
    if (!terminos) {
        mostrarAlertaRegistro('Debes aceptar los términos y condiciones', 'danger');
        return;
    }
    
    if (usuario.length < 3 || password.length < 3) {
        mostrarAlertaRegistro('Usuario y contraseña deben tener al menos 3 caracteres', 'danger');
        return;
    }
    
    // Verificar si el usuario ya existe
    if (verificarUsuarioExistente(usuario, email)) {
        mostrarAlertaRegistro('El usuario o email ya están registrados', 'danger');
        return;
    }
    
    // Mostrar loading
    const btnRegistro = document.getElementById('btnRegistro');
    const textoOriginal = btnRegistro.innerHTML;
    btnRegistro.disabled = true;
    btnRegistro.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Creando cuenta...';
    
    // Simular proceso de registro
    setTimeout(() => {
        const nuevoUsuario = {
            usuario: usuario,
            password: password,
            nombre: nombre,
            email: email,
            telefono: telefono,
            rol: 'cliente',
            fechaRegistro: new Date().toLocaleDateString(),
            activo: true
        };
        
        // Guardar en localStorage
        const exito = guardarUsuarioRegistrado(nuevoUsuario);
        
        if (exito) {
            mostrarAlertaRegistro('¡Cuenta creada exitosamente! Puedes iniciar sesión ahora.', 'success');
            
            // Limpiar formulario y mostrar éxito
            document.getElementById('registroForm').reset();
            
            setTimeout(() => {
                cerrarModales();
                alert('✅ ¡Bienvenido a ElectroHogar! Tu cuenta ha sido creada. Ahora puedes iniciar sesión.');
                
                // Pre-llenar el formulario de login
                document.getElementById('username').value = usuario;
                document.getElementById('password').focus();
            }, 2000);
            
        } else {
            mostrarAlertaRegistro('Error al crear la cuenta. Inténtalo nuevamente.', 'danger');
        }
        
        // Restaurar botón
        btnRegistro.disabled = false;
        btnRegistro.innerHTML = textoOriginal;
        
    }, 2000);
}

function verificarUsuarioExistente(usuario, email) {
    // Verificar en usuarios predefinidos
    for (let i = 0; i < USUARIOS_DB.length; i++) {
        const [user, pass, nombre, userEmail, rol] = USUARIOS_DB[i];
        if (user === usuario || userEmail === email) {
            return true;
        }
    }
    
    // Verificar en usuarios registrados
    const usuariosRegistrados = obtenerUsuariosRegistrados();
    return usuariosRegistrados.some(user => 
        user.usuario === usuario || user.email === email
    );
}

function guardarUsuarioRegistrado(usuario) {
    try {
        const usuariosRegistrados = obtenerUsuariosRegistrados();
        usuariosRegistrados.push(usuario);
        localStorage.setItem('usuariosRegistrados', JSON.stringify(usuariosRegistrados));
        console.log('✅ Usuario registrado guardado:', usuario.usuario);
        return true;
    } catch (error) {
        console.error('❌ Error al guardar usuario:', error);
        return false;
    }
}

function obtenerUsuariosRegistrados() {
    try {
        const usuarios = localStorage.getItem('usuariosRegistrados');
        return usuarios ? JSON.parse(usuarios) : [];
    } catch (error) {
        console.error('❌ Error al obtener usuarios registrados:', error);
        return [];
    }
}

function mostrarAlertaRegistro(mensaje, tipo) {
    const alertContainer = document.getElementById('registroAlerta');
    if (!alertContainer) return;
    
    const iconos = {
        success: 'fas fa-check-circle',
        danger: 'fas fa-exclamation-triangle',
        warning: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle'
    };
    
    alertContainer.innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
            <i class="${iconos[tipo]} me-2"></i>
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
}

function cambiarALogin() {
    cerrarModales();
    alert('💡 Usa el formulario de login para acceder con tu cuenta existente.');
}

// ==================== ESTRUCTURAS DE CONTROL Y VALIDACIONES ====================
function validarCampoUsuario() {
    const username = document.getElementById('username').value;
    const usernameError = document.getElementById('usernameError');
    
    // ESTRUCTURA IF-ELSE para validación
    if (username.length === 0) {
        mostrarError('usernameError', 'El usuario es requerido');
        return false;
    } else if (username.length < 3) {
        mostrarError('usernameError', 'El usuario debe tener al menos 3 caracteres');
        return false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        mostrarError('usernameError', 'Solo se permiten letras, números y guiones bajos');
        return false;
    } else {
        limpiarError('usernameError');
        return true;
    }
}

function validarCampoPassword() {
    const password = document.getElementById('password').value;
    const passwordError = document.getElementById('passwordError');
    
    // ESTRUCTURA IF-ELSE ANIDADA
    if (password.length === 0) {
        mostrarError('passwordError', 'La contraseña es requerida');
        return false;
    } else if (password.length < 3) {
        mostrarError('passwordError', 'La contraseña debe tener al menos 3 caracteres');
        return false;
    } else {
        // Verificar fortaleza de contraseña
        let fortaleza = 0;
        if (password.length >= 6) fortaleza++;
        if (/[A-Z]/.test(password)) fortaleza++;
        if (/[0-9]/.test(password)) fortaleza++;
        if (/[^A-Za-z0-9]/.test(password)) fortaleza++;
        
        if (fortaleza < 2 && password !== '123' && password !== '456' && password !== '789' && password !== '321' && password !== 'spv2025') {
            mostrarError('passwordError', 'Contraseña débil. Use mayúsculas, números o símbolos');
            return false;
        } else {
            limpiarError('passwordError');
            return true;
        }
    }
}

// ==================== PROCESAMIENTO DE LOGIN ACTUALIZADO ====================
function procesarLogin() {
    console.log('🔐 Procesando intento de login...');
    
    // Verificar si el sistema está bloqueado
    if (sistemaBloqueo) {
        alert('⛔ Sistema temporalmente bloqueado. Intenta más tarde.');
        return;
    }
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Validar campos
    if (!validarCampoUsuario() || !validarCampoPassword()) {
        mostrarAlerta('danger', 'Por favor corrige los errores en el formulario', 'fas fa-exclamation-triangle');
        return;
    }
    
    // Mostrar loading
    mostrarCargando(true);
    
    // Simular delay de autenticación
    setTimeout(() => {
        autenticarUsuario(username, password, rememberMe);
    }, 1500);
}

function autenticarUsuario(username, password, rememberMe) {
    console.log('🔍 Autenticando usuario:', username);
    
    let usuarioEncontrado = null;
    
    // ESTRUCTURA FOR - Buscar en usuarios predefinidos
    for (let i = 0; i < USUARIOS_DB.length; i++) {
        const [user, pass, nombre, email, rol] = USUARIOS_DB[i];
        
        // ESTRUCTURA IF-ELSE para verificar credenciales
        if (user === username && pass === password) {
            usuarioEncontrado = {
                username: user,
                nombre: nombre,
                email: email,
                rol: rol,
                fechaAcceso: new Date().toLocaleString(),
                tipo: 'predefinido'
            };
            break;
        }
    }
    
    // Si no se encontró en predefinidos, buscar en registrados
    if (!usuarioEncontrado) {
        const usuariosRegistrados = obtenerUsuariosRegistrados();
        
        // ESTRUCTURA WHILE para buscar en usuarios registrados
        let i = 0;
        while (i < usuariosRegistrados.length && !usuarioEncontrado) {
            const user = usuariosRegistrados[i];
            if (user.usuario === username && user.password === password && user.activo) {
                usuarioEncontrado = {
                    username: user.usuario,
                    nombre: user.nombre,
                    email: user.email,
                    rol: user.rol,
                    telefono: user.telefono,
                    fechaAcceso: new Date().toLocaleString(),
                    tipo: 'registrado'
                };
            }
            i++;
        }
    }
    
    mostrarCargando(false);
    
    // ESTRUCTURA IF-ELSE para resultado de autenticación
    if (usuarioEncontrado) {
        loginExitoso(usuarioEncontrado, rememberMe);
    } else {
        loginFallido();
    }
}

function loginExitoso(usuario, recordar) {
    console.log('✅ Login exitoso para:', usuario.username);
    
    usuarioActual = usuario;
    intentosLogin = 0;
    
    // Guardar sesión si se solicitó (simulado)
    if (recordar) {
        const sessionData = {
            user: usuario.username,
            timestamp: Date.now(),
            remember: true
        };
        console.log('💾 Sesión guardada:', sessionData);
    }
    
    // Mostrar mensaje de éxito
    const tipoUsuario = usuario.tipo === 'registrado' ? '(Usuario registrado)' : '(Usuario del sistema)';
    mostrarAlerta('success', `¡Bienvenido ${usuario.nombre}! ${tipoUsuario}`, 'fas fa-check-circle');
    
    // Redireccionar según el rol (CORREGIDO) ✅
    setTimeout(() => {
        redirigirSegunRolCorregido(usuario.rol);
    }, 1500);
}

function redirigirSegunRolCorregido(rol) {
    // ESTRUCTURA SWITCH-CASE para redirección por rol CORREGIDA ✅
    switch(rol) {
        case 'admin':
        case 'gerente':
        case 'empleado':
            console.log(`🔧 Redirigiendo ${rol} a gestión de productos...`);
            alert(`👨‍💼 Bienvenido al panel de administración. Acceso: ${rol.toUpperCase()}`);
            window.location.href = 'gestion-productos.html'; // ✅ CORREGIDO
            break;
            
        case 'cliente':
        default:
            console.log('🛍️ Redirigiendo cliente a productos...');
            if (confirm('🛍️ ¡Bienvenido a ElectroHogar! ¿Deseas ver nuestros productos?')) {
                window.location.href = 'productos.html'; // ✅ CORREGIDO
            } else {
                window.location.href = 'index.html';
            }
            break;
    }
}

function loginFallido() {
    console.log('❌ Login fallido');
    
    intentosLogin++;
    
    // ESTRUCTURA IF-ELSE para manejo de intentos
    if (intentosLogin >= MAX_INTENTOS_LOGIN) {
        bloquearSistema();
    } else {
        const intentosRestantes = MAX_INTENTOS_LOGIN - intentosLogin;
        mostrarAlerta('danger', 
            `Credenciales incorrectas. Te quedan ${intentosRestantes} intentos`, 
            'fas fa-times-circle');
        
        // Shake effect
        document.getElementById('loginCard').classList.add('shake');
        setTimeout(() => {
            document.getElementById('loginCard').classList.remove('shake');
        }, 500);
        
        // Alert JavaScript
        alert(`⚠️ Credenciales incorrectas. Intentos restantes: ${intentosRestantes}`);
    }
}

function bloquearSistema() {
    sistemaBloqueo = true;
    
    mostrarAlerta('danger', 
        `Sistema bloqueado por ${TIEMPO_BLOQUEO/1000} segundos por exceso de intentos`, 
        'fas fa-lock');
    
    // Confirm JavaScript
    if (confirm('🔒 ¿Deseas resetear los intentos de acceso?')) {
        intentosLogin = 0;
        sistemaBloqueo = false;
        mostrarAlerta('info', 'Sistema desbloqueado', 'fas fa-unlock');
    } else {
        // Desbloquear automáticamente después del tiempo
        setTimeout(() => {
            sistemaBloqueo = false;
            intentosLogin = 0;
            mostrarAlerta('info', 'Sistema desbloqueado automáticamente', 'fas fa-unlock');
        }, TIEMPO_BLOQUEO);
    }
}

// ==================== FUNCIONES DEL SISTEMA ====================
function mostrarRecuperarPassword() {
    const emailRecuperacion = prompt('📧 Ingresa tu email para recuperar la contraseña:');
    
    if (emailRecuperacion) {
        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(emailRecuperacion)) {
            // Simular envío de email
            setTimeout(() => {
                alert('✅ Se ha enviado un enlace de recuperación a tu email.');
                mostrarModal('Recuperación de Contraseña', 
                    `<div class="text-center">
                        <i class="fas fa-envelope fa-3x text-primary mb-3"></i>
                        <h5>Email Enviado</h5>
                        <p>Se ha enviado un enlace de recuperación a:</p>
                        <strong>${emailRecuperacion}</strong>
                        <div class="alert alert-info mt-3">
                            <small>El enlace será válido por 24 horas</small>
                        </div>
                    </div>`);
            }, 1000);
        } else {
            alert('❌ Por favor ingresa un email válido');
            mostrarRecuperarPassword();
        }
    }
}

// ==================== FUNCIONES AUXILIARES ====================
function mostrarCargando(mostrar) {
    const loginBtn = document.getElementById('loginBtn');
    const loginBtnText = document.getElementById('loginBtnText');
    
    if (mostrar) {
        loginBtn.disabled = true;
        loginBtnText.innerHTML = '<span class="loading-spinner me-2"></span>Validando...';
    } else {
        loginBtn.disabled = false;
        loginBtnText.innerHTML = 'Iniciar Sesión';
    }
}

function mostrarAlerta(tipo, mensaje, icono) {
    const alertContainer = document.getElementById('alertContainer');
    const alertId = 'alert_' + Date.now();
    
    const alertHTML = `
        <div id="${alertId}" class="alert alert-${tipo} alert-custom alert-dismissible fade show" role="alert">
            <i class="${icono} me-2"></i>
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    alertContainer.innerHTML = alertHTML;
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        const alert = document.getElementById(alertId);
        if (alert) {
            alert.remove();
        }
    }, 5000);
}

function mostrarError(elementId, mensaje) {
    const errorElement = document.getElementById(elementId);
    const inputElement = errorElement.previousElementSibling;
    
    errorElement.textContent = mensaje;
    errorElement.style.display = 'block';
    inputElement.classList.add('is-invalid');
}

function limpiarError(elementId) {
    const errorElement = document.getElementById(elementId);
    const inputElement = errorElement.previousElementSibling;
    
    errorElement.textContent = '';
    errorElement.style.display = 'none';
    inputElement.classList.remove('is-invalid');
}

function mostrarModal(titulo, contenido) {
    document.getElementById('modalTitle').innerHTML = '<i class="fas fa-info-circle me-2"></i>' + titulo;
    document.getElementById('modalBody').innerHTML = contenido;
    
    const modal = new bootstrap.Modal(document.getElementById('infoModal'));
    modal.show();
}

function togglePassword() {
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.getElementById('eyeIcon');
    
    // ESTRUCTURA IF-ELSE para toggle
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.className = 'fas fa-eye-slash';
    } else {
        passwordInput.type = 'password';
        eyeIcon.className = 'fas fa-eye';
    }
}

function toggleTheme() {
    const body = document.body;
    const themeIcon = document.getElementById('theme-icon');
    
    temaOscuro = !temaOscuro;
    
    // ESTRUCTURA IF-ELSE para cambio de tema
    if (temaOscuro) {
        body.classList.add('dark-mode');
        themeIcon.className = 'fas fa-sun';
    } else {
        body.classList.remove('dark-mode');
        themeIcon.className = 'fas fa-moon';
    }
    
    console.log('🎨 Tema cambiado a:', temaOscuro ? 'oscuro' : 'claro');
}

function verificarSesionExistente() {
    console.log('🔍 Verificando sesión existente...');
    
    // Simular verificación de sesión
    const sessionExists = false;
    
    if (sessionExists) {
        mostrarAlerta('info', 'Sesión anterior detectada', 'fas fa-history');
    }
}

function mostrarAyuda() {
    const ayudaContent = `
        <div class="text-start">
            <h5>🆘 Ayuda del Sistema de Login</h5>
            
            <h6>🔐 Usuarios Predefinidos del Sistema:</h6>
            <div class="table-responsive">
                <table class="table table-sm">
                    <thead>
                        <tr>
                            <th>Usuario</th>
                            <th>Contraseña</th>
                            <th>Rol</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code>admin</code></td>
                            <td><code>123</code></td>
                            <td><span class="badge bg-danger">Administrador</span></td>
                        </tr>
                        <tr>
                            <td><code>gerente</code></td>
                            <td><code>456</code></td>
                            <td><span class="badge bg-warning">Gerente</span></td>
                        </tr>
                        <tr>
                            <td><code>empleado1</code></td>
                            <td><code>789</code></td>
                            <td><span class="badge bg-info">Empleado</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <h6>👤 Registro de Usuarios:</h6>
            <ul>
                <li>Los usuarios pueden registrarse y acceder como clientes</li>
                <li>Los usuarios registrados son redirigidos a la tienda</li>
                <li>Los usuarios del sistema acceden al panel de administración</li>
            </ul>
            
            <h6>⌨️ Atajos de Teclado:</h6>
            <ul>
                <li><kbd>F1</kbd> - Mostrar esta ayuda</li>
                <li><kbd>F2</kbd> - Información del sistema</li>
                <li><kbd>Esc</kbd> - Cerrar ventanas</li>
            </ul>
            
            <div class="alert alert-info mt-3">
                <strong>📞 Soporte Técnico:</strong><br>
                Email: soporte@electrohogar.com<br>
                Teléfono: +51 987 654 321
            </div>
        </div>
    `;
    
    mostrarModal('Centro de Ayuda', ayudaContent);
}

function cerrarModales() {
    const modales = document.querySelectorAll('.modal.show');
    modales.forEach(modal => {
        bootstrap.Modal.getInstance(modal)?.hide();
    });
}

// ==================== EVENT LISTENERS ADICIONALES ====================

// Detectar cambio de tamaño de ventana para responsive
window.addEventListener('resize', function() {
    if (window.innerWidth < 768) {
        console.log('📱 Modo móvil detectado');
    }
});

// Log de actividad
console.log('📝 Sistema de Login ElectroHogar v' + SISTEMA_CONFIG.version + ' iniciado');
console.log('🎯 Sistema de registro implementado correctamente');
console.log('✅ Redirecciones corregidas: admin/empleado -> gestion-productos.html');

// ==================== EXPORTAR FUNCIONES (OPCIONAL) ====================
export {
    USUARIOS_DB,
    SISTEMA_CONFIG,
    procesarLogin,
    mostrarRecuperarPassword,
    mostrarRegistro,
    obtenerUsuariosRegistrados
};