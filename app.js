let Titulo = document.title;
reproducirMusica();

window.addEventListener('blur', () => {
    Titulo = document.title;
    document.title = "No te vayas, regresa :(";
});

window.addEventListener('focus', () => {
    document.title = Titulo;
});

// Elementos DOM
const h1 = document.getElementById("Titulo");
const Boton1 = document.getElementById("B1");
const canvas = document.getElementById('Flor');
const ctx = canvas.getContext('2d');
const corazonesContainer = document.getElementById('corazones-container');

// Ajustar el tamaño del canvas al tamaño de la ventana
function ajustarCanvas() {
    const containerWidth = document.querySelector('.canvas-container').clientWidth;
    const scale = containerWidth / 800;
    canvas.style.height = `${600 * scale}px`;
    reproducirMusica();
}

window.addEventListener('resize', ajustarCanvas);
ajustarCanvas();

// Botón para mostrar una flor
Boton1.addEventListener('click', function() {
    const ContenedorBotones = document.querySelector(".Con");
    document.querySelector(".Texto").style.display = "block";
    ContenedorBotones.style.display = "none";
    
    // Limpiar canvas antes de dibujar
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    DibujarFlor(400, 100, 8, 40, 100, 200);
    
    h1.remove();
    crearCorazones(15);
    reproducirMusica();
    
    

});

// Botón para mostrar varias flores
document.getElementById("B12").addEventListener('click', function() {
    const ContenedorBotones = document.querySelector(".Con");
    ContenedorBotones.style.display = "none";
    document.querySelector(".Texto").style.display = "block";
    
    // Limpiar canvas antes de dibujar
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    CrearVarias();
    
    h1.remove();
    crearCorazones(30);
    reproducirMusica();
});

// Funciones para dibujar pétalos y flores
function DibujarPetalo(x, y, RadioX, scala, Rotacion, color, pasos) {
    const Numero = scala;
    const AnguloIncrement = (Math.PI / pasos) * 2;
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Rotacion);
    ctx.scale(1, Numero);
    ctx.beginPath();
    
    // Dibuja el pétalo con degradado
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, RadioX);
    
    if (color === 'yellow') {
        gradient.addColorStop(0, '#fff9c4');
        gradient.addColorStop(0.7, '#ffeb3b');
        gradient.addColorStop(1, '#ffd600');
    } else if (color === 'green') {
        gradient.addColorStop(0, '#c8e6c9');
        gradient.addColorStop(0.7, '#66bb6a');
        gradient.addColorStop(1, '#2e7d32');
    } else {
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, shadeColor(color, -30));
    }
    
    for (let i = 0; i <= pasos; i++) {
        const AnguloActual = i * AnguloIncrement;
        const currentRadius = Math.sin(AnguloActual) * RadioX;
        const PuntoY = Math.sin(AnguloActual) * currentRadius;
        const PuntoX = Math.cos(AnguloActual) * currentRadius;
        
        if (i === 0) {
            ctx.moveTo(PuntoX, PuntoY);
        } else {
            ctx.lineTo(PuntoX, PuntoY);
        }
    }
    
    ctx.fillStyle = gradient;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.fill();
    
    ctx.strokeStyle = shadeColor(color, -50);
    ctx.lineWidth = 0.5;
    ctx.stroke();
    ctx.restore();
}

// Función para oscurecer/aclarar colores
function shadeColor(color, percent) {
    let R = parseInt(color.substring(1, 3), 16);
    let G = parseInt(color.substring(3, 5), 16);
    let B = parseInt(color.substring(5, 7), 16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R < 255) ? R : 255;
    G = (G < 255) ? G : 255;
    B = (B < 255) ? B : 255;

    R = Math.max(0, R).toString(16);
    G = Math.max(0, G).toString(16);
    B = Math.max(0, B).toString(16);

    const RR = (R.length === 1) ? "0" + R : R;
    const GG = (G.length === 1) ? "0" + G : G;
    const BB = (B.length === 1) ? "0" + B : B;

    return "#" + RR + GG + BB;
}

// Dibujar una flor completa con tallo y hojas
function DibujarFlor(x, y, NumeroPetalos, RadioXPetalo, RadioYPetalo, AltoTrazo) {
    // Animación de crecimiento
    const duracion = 3000; // 3 segundos para el crecimiento completo
    const inicio = Date.now();
    let porcentajeCrecimiento = 0;
    
    function animar() {
        const tiempoActual = Date.now();
        porcentajeCrecimiento = Math.min(1, (tiempoActual - inicio) / duracion);
        
        // Limpiar solo el área del tallo para no afectar el resto
        ctx.clearRect(x - 50, y, 100, AltoTrazo + 100);
        
        // Dibujar tallo con porcentaje de crecimiento
        const alturaActual = AltoTrazo * porcentajeCrecimiento;
        
        // Tallo con curva natural
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.bezierCurveTo(
            x - 10 * Math.sin(porcentajeCrecimiento * Math.PI), 
            y + alturaActual * 0.3, 
            x + 10 * Math.sin(porcentajeCrecimiento * Math.PI), 
            y + alturaActual * 0.7, 
            x, y + alturaActual
        );
        ctx.lineWidth = 4;
        const gradienteTallo = ctx.createLinearGradient(x, y, x, y + alturaActual);
        gradienteTallo.addColorStop(0, '#7cb342');
        gradienteTallo.addColorStop(1, '#33691e');
        ctx.strokeStyle = gradienteTallo;
        ctx.stroke();
        
        // Dibujar hojas si ha crecido lo suficiente
        if (porcentajeCrecimiento > 0.4) {
            // Hoja izquierda
            const hojaSize = 25 * Math.min(1, (porcentajeCrecimiento - 0.4) / 0.6);
            DibujarHoja(x, y + alturaActual * 0.5, hojaSize, -Math.PI / 4);
            
            // Hoja derecha
            DibujarHoja(x, y + alturaActual * 0.7, hojaSize, Math.PI / 4);
        }
        
        if (porcentajeCrecimiento < 1) {
            requestAnimationFrame(animar);
        } else {
            // Al terminar el tallo, comenzar con los pétalos
            dibujarPetalosAnimados(x, y, NumeroPetalos, RadioXPetalo);
        }
    }
    
    animar();
}

// Función para dibujar hojas
function DibujarHoja(x, y, tamaño, angulo) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angulo);
    
    // Crear forma de hoja con curvas de Bezier
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(
        tamaño * 0.5, -tamaño * 0.5, 
        tamaño * 1.5, -tamaño * 0.3, 
        tamaño * 2, 0
    );
    ctx.bezierCurveTo(
        tamaño * 1.5, tamaño * 0.3, 
        tamaño * 0.5, tamaño * 0.5, 
        0, 0
    );
    
    // Gradiente para la hoja
    const gradient = ctx.createRadialGradient(tamaño * 0.7, 0, 0, tamaño * 0.7, 0, tamaño * 2);
    gradient.addColorStop(0, '#c5e1a5');
    gradient.addColorStop(0.5, '#7cb342');
    gradient.addColorStop(1, '#33691e');
    ctx.fillStyle = gradient;
    
    // Añadir sombras
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    ctx.fill();
    
    // Nervios de la hoja
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(tamaño * 1.7, 0);
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#33691e';
    ctx.stroke();
    
    // Nervios secundarios
    for (let i = 1; i <= 3; i++) {
        ctx.beginPath();
        ctx.moveTo(tamaño * 0.4 * i, 0);
        ctx.lineTo(tamaño * (0.4 * i - 0.1), -tamaño * 0.1 * i);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(tamaño * 0.4 * i, 0);
        ctx.lineTo(tamaño * (0.4 * i - 0.1), tamaño * 0.1 * i);
        ctx.stroke();
    }
    
    ctx.restore();
}

// Función para animar los pétalos
function dibujarPetalosAnimados(x, y, NumeroPetalos, RadioXPetalo) {
    const AnguloIncrement = (Math.PI * 2) / NumeroPetalos;
    let contadorPetalos = 0;
    
    function dibujarSiguientePetalo() {
        if (contadorPetalos < NumeroPetalos) {
            const Angulo = contadorPetalos * AnguloIncrement;
            
            // Colores variados para pétalos
            const colores = ['#ffeb3b', '#ffd54f', '#ffca28', '#ffc107'];
            const colorPetalo = colores[contadorPetalos % colores.length];
            
            // Animación de aparición del pétalo
            let escala = 0;
            const duracionPetalo = 600;
            const inicioPetalo = Date.now();
            
            function animarPetalo() {
                const tiempoActual = Date.now();
                escala = Math.min(1, (tiempoActual - inicioPetalo) / duracionPetalo);
                
                // Limpiar y redibujar solo este pétalo
                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(Angulo);
                ctx.clearRect(-RadioXPetalo, -RadioXPetalo, RadioXPetalo * 2, RadioXPetalo * 2);
                ctx.restore();
                
                DibujarPetalo(x, y, RadioXPetalo * escala, 2, Angulo, colorPetalo, 100);
                
                if (escala < 1) {
                    requestAnimationFrame(animarPetalo);
                } else {
                    contadorPetalos++;
                    setTimeout(dibujarSiguientePetalo, 150);
                }
            }
            
            animarPetalo();
        } else {
            // Al terminar todos los pétalos, dibujar el centro
            dibujarCentroFlor(x, y);
        }
    }
    
    dibujarSiguientePetalo();
}

// Función para dibujar el centro de la flor con animación
function dibujarCentroFlor(x, y) {
    let tamaño = 0;
    const tamañoFinal = 15;
    const duracion = 500;
    const inicio = Date.now();
    
    function animarCentro() {
        const tiempoActual = Date.now();
        const progreso = Math.min(1, (tiempoActual - inicio) / duracion);
        tamaño = tamañoFinal * progreso;
        
        // Limpiar solo el centro
        ctx.clearRect(x - tamañoFinal, y - tamañoFinal, tamañoFinal * 2, tamañoFinal * 2);
        
        // Dibujar centro con gradiente
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, tamaño);
        gradient.addColorStop(0, '#8d6e63');
        gradient.addColorStop(0.7, '#5d4037');
        gradient.addColorStop(1, '#3e2723');
        ctx.fillStyle = gradient;
        
        ctx.arc(x, y, tamaño, 0, Math.PI * 2);
        ctx.fill();
        
        // Detalles del centro (polen)
        if (progreso > 0.7) {
            const numPuntos = 12;
            const radioPuntos = tamaño * 0.7;
            for (let i = 0; i < numPuntos; i++) {
                const angulo = (i / numPuntos) * Math.PI * 2;
                const px = x + Math.cos(angulo) * radioPuntos;
                const py = y + Math.sin(angulo) * radioPuntos;
                
                ctx.beginPath();
                ctx.arc(px, py, 1.5, 0, Math.PI * 2);
                ctx.fillStyle = '#ffa000';
                ctx.fill();
            }
        }
        
        if (progreso < 1) {
            requestAnimationFrame(animarCentro);
        } else {
            // Añadir brillo final
            añadirBrilloFlor(x, y);
        }
    }
    
    animarCentro();
}

// Añadir efecto de brillo a la flor
function añadirBrilloFlor(x, y) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    
    // Crear un resplandor
    const gradient = ctx.createRadialGradient(x, y, 10, x, y, 70);
    gradient.addColorStop(0, 'rgba(255, 255, 200, 0.8)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 150, 0.3)');
    gradient.addColorStop(1, 'rgba(255, 255, 100, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, 70, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
}

// Versión simplificada para múltiples flores
function DibujarFlorSinTallo(x, y, NumeroPetalos, RadioXPetalo, RadioYPetalo, AltoTrazo) {
    // Animación simplificada para múltiples flores
    setTimeout(() => {
        // Colores aleatorios para cada flor
        const colores = [
            ['#ffeb3b', '#ffd54f', '#ffca28'], // Amarillos
            ['#ff9800', '#fb8c00', '#f57c00'], // Naranjas
            ['#ff5722', '#f4511e', '#e64a19'], // Rojos
            ['#f48fb1', '#f06292', '#ec407a']  // Rosas
        ];
        
        const colorSet = colores[Math.floor(Math.random() * colores.length)];
        
        // Dibujar tallo simple
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + AltoTrazo);
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#558b2f';
        ctx.stroke();
        
        // Dibujar pétalos con colores variados
        const AnguloIncrement = (Math.PI * 2) / NumeroPetalos;
        for (let i = 0; i < NumeroPetalos; i++) {
            const Angulo = i * AnguloIncrement;
            const colorIndex = i % colorSet.length;
            DibujarPetalo(x, y, RadioXPetalo, 2, Angulo, colorSet[colorIndex], 100);
        }
        
        // Centro de la flor
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        const gradientCentro = ctx.createRadialGradient(x, y, 0, x, y, 10);
        gradientCentro.addColorStop(0, '#8d6e63');
        gradientCentro.addColorStop(1, '#3e2723');
        ctx.fillStyle = gradientCentro;
        ctx.fill();
        
        // Detalles del centro
        const numPuntos = 8;
        for (let i = 0; i < numPuntos; i++) {
            const angulo = (i / numPuntos) * Math.PI * 2;
            const px = x + Math.cos(angulo) * 7;
            const py = y + Math.sin(angulo) * 7;
            
            ctx.beginPath();
            ctx.arc(px, py, 1, 0, Math.PI * 2);
            ctx.fillStyle = '#ffa000';
            ctx.fill();
        }
    }, Math.random() * 1000); // Retardo aleatorio para que no aparezcan todas a la vez
}

// Crear múltiples flores en el canvas
function CrearVarias() {
    const numFlores = 12;
    
    // Espaciamiento y tamaño de cada flor
    const espacioX = canvas.width / 4;
    const espacioY = canvas.height / 3;
    
    for (let i = 0; i < numFlores; i++) {
        const fila = Math.floor(i / 4);
        const columna = i % 4;
        
        // Añadir algo de variación a la posición
        const variacionX = (Math.random() - 0.5) * 20;
        const variacionY = (Math.random() - 0.5) * 20;
        
        const x = espacioX * columna + espacioX / 2 + variacionX;
        const y = espacioY * fila + espacioY / 2 + variacionY;
        
        // Variar el tamaño de las flores
        const tamañoPetalo = 25 + Math.random() * 15;
        const altoTallo = 80 + Math.random() * 50;
        
        // Variar el número de pétalos
        const numPetalos = 6 + Math.floor(Math.random() * 5);
        
        DibujarFlorSinTallo(x, y, numPetalos, tamañoPetalo, 80, altoTallo);
    }
}

// Crear corazones flotantes por la pantalla
function crearCorazones(cantidad) {
    // Limpiar corazones existentes
    corazonesContainer.innerHTML = '';
    
    for (let i = 0; i < cantidad; i++) {
        const corazon = document.createElement('div');
        corazon.classList.add('corazon');
        
        // Posición aleatoria
        const posX = Math.random() * window.innerWidth;
        const posY = Math.random() * window.innerHeight;
        
        // Tamaño aleatorio
        const tamaño = 10 + Math.random() * 20;
        
        // Colores aleatorios
        const colores = ['#ff69b4', '#ff1493', '#ff6b6b', '#f06292', '#e91e63'];
        const color = colores[Math.floor(Math.random() * colores.length)];
        
        // Establecer propiedades
        corazon.style.left = `${posX}px`;
        corazon.style.top = `${posY}px`;
        corazon.style.width = `${tamaño}px`;
        corazon.style.height = `${tamaño}px`;
        
        // Crear animación única para cada corazón
        const duracion = 5 + Math.random() * 10;
        const delay = Math.random() * 5;
        corazon.style.animation = `flotar ${duracion}s ease-in-out ${delay}s infinite`;
        
        // Crear estilo específico para este corazón
        const style = document.createElement('style');
        style.textContent = `
            @keyframes flotar {
                0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
                10% { opacity: 0.8; }
                50% { transform: translate(${Math.random() * 100 - 50}px, -${100 + Math.random() * 200}px) rotate(${Math.random() * 360}deg); }
                90% { opacity: 0.8; }
                100% { transform: translate(${Math.random() * 200 - 100}px, -${200 + Math.random() * 300}px) rotate(${Math.random() * 720}deg); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        // Cambiar el color del SVG
        corazon.style.backgroundImage = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${encodeURIComponent(color)}"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>')`;
        
        corazonesContainer.appendChild(corazon);
        
        // Eliminar el corazón después de la animación
        setTimeout(() => {
            corazon.remove();
            style.remove();
        }, (duracion + delay) * 1000);
    }
}

function reproducirMusica() {
    // Verificar si ya existe un audio en la página
    let audio = document.getElementById('musicaFondo');

    if (!audio) {
        audio = document.createElement('audio');
        audio.id = 'musicaFondo';
        audio.style.display = 'none';
        audio.loop = true;
        audio.volume = 0.5;
        audio.src = 'audio.mp3'; // Reemplázalo con la URL de tu archivo .mp3

        document.body.appendChild(audio);

        // Iniciar desde el minuto 1 (60 segundos) al cargar los metadatos
        audio.addEventListener('loadedmetadata', function () {
            let tiempoGuardado = localStorage.getItem('tiempoMusica') || 34;
            audio.currentTime = tiempoGuardado;
            audio.play();
        });

        // Guardar la posición del audio antes de salir de la página
        window.addEventListener('beforeunload', function () {
            localStorage.setItem('tiempoMusica', audio.currentTime);
        });
    }

    // Botón para pausar/reproducir
    let botonMusica = document.getElementById('botonMusica');

    if (!botonMusica) {
        botonMusica = document.createElement('button');
        botonMusica.id = 'botonMusica';
        botonMusica.innerHTML = '🔊';
        botonMusica.style.position = 'fixed';
        botonMusica.style.bottom = '20px';
        botonMusica.style.right = '20px';
        botonMusica.style.width = '50px';
        botonMusica.style.height = '50px';
        botonMusica.style.borderRadius = '50%';
        botonMusica.style.border = 'none';
        botonMusica.style.cursor = 'pointer';

        botonMusica.addEventListener('click', () => {
            if (audio.paused) {
                audio.play();
                botonMusica.innerHTML = '🔊';
            } else {
                audio.pause();
                botonMusica.innerHTML = '🔇';
            }
        });

        document.body.appendChild(botonMusica);
    }
}




// Botones para mostrar mensaje inicial y cerrar
document.getElementById("BVer").addEventListener('click', function() {
    document.getElementById("resultado").style.display = "block";
    
    // Añadir efectos de partículas
    crearParticulasBrillo(5);
});

document.getElementById("BotonCerrar").addEventListener('click', function() {
    document.getElementById("resultado").style.display = "none";
    document.querySelector(".Contenedor-Binicio").style.display = "none";
    document.querySelector(".Con-2").style.display = "block";
    
    // Efecto de aparición para los botones de elección
    const botones = document.querySelectorAll('.Con .Button');
    botones.forEach((boton, index) => {
        boton.style.opacity = '0';
        boton.style.transform = 'translateY(20px)';
        setTimeout(() => {
            boton.style.transition = 'all 0.5s ease';
            boton.style.opacity = '1';
            boton.style.transform = 'translateY(0)';
        }, 300 + index * 200);
    });
});

// Función para crear partículas de brillo
function crearParticulasBrillo(cantidad) {
    for (let i = 0; i < cantidad; i++) {
        setTimeout(() => {
            const particula = document.createElement('div');
            particula.style.position = 'fixed';
            particula.style.width = '10px';
            particula.style.height = '10px';
            particula.style.background = 'white';
            particula.style.borderRadius = '50%';
            particula.style.boxShadow = '0 0 10px 5px rgba(255, 255, 255, 0.7)';
            particula.style.zIndex = '1000';
            particula.style.pointerEvents = 'none';
            
            // Posición aleatoria
            const posX = Math.random() * window.innerWidth;
            const posY = Math.random() * window.innerHeight;
            particula.style.left = `${posX}px`;
            particula.style.top = `${posY}px`;
            
            // Animación de desvanecimiento
            particula.style.animation = 'desvanecer 1.5s forwards';
            
            // Estilo de la animación
            const style = document.createElement('style');
            style.textContent = `
                @keyframes desvanecer {
                    0% { transform: scale(0); opacity: 0; }
                    50% { transform: scale(1.5); opacity: 1; }
                    100% { transform: scale(0); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
            
            document.body.appendChild(particula);
            
            // Eliminar la partícula después de la animación
            setTimeout(() => {
                particula.remove();
                style.remove();
            }, 1500);
        }, i * 200);
    }
}

// Iniciar con una pequeña animación de las estrellas de fondo
window.addEventListener('load', () => {
    const estrellas = document.querySelector('.estrellas');
    estrellas.style.opacity = '0';
    setTimeout(() => {
        estrellas.style.transition = 'opacity 2s ease';
        estrellas.style.opacity = '1';
    }, 500);
});