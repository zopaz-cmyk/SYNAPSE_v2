# Synapse — Exploración STEAM

Synapse es un prototipo educativo de exploración STEAM que conecta aprendizaje creativo, participación comunitaria y los Objetivos de Desarrollo Sostenible 4 (Educación de calidad) y 5 (Igualdad de género).

## Archivos
- `index.html`: estructura y contenido de la aplicación, incluida la sección de referencias.
- `styles.css`: diseño adaptable para escritorio, tablet y móvil.
- `script.js`: navegación, microlecciones, progreso local, interacciones y animaciones generativas con Canvas 2D.

## Requisitos del checklist
- **HTML:** sección de referencias con enlaces externos.
- **CSS:** diseño de escritorio y móvil mediante media queries (`1000px`, `720px` y `380px`).
- **JavaScript aleatorio:** `Math.random()` se usa para variar posiciones, velocidades, tamaños y ciclos de vida de partículas.
- **Algoritmos avanzados:** agentes autónomos y sistemas de partículas inspirados en *The Nature of Code*, implementados con JavaScript y Canvas 2D.
- **GitHub:** instrucciones de publicación al final de este documento.

## Ejecutar localmente
Descarga los tres archivos en la misma carpeta y abre `index.html` en un navegador moderno. Para una prueba más fiel al entorno web, también puedes ejecutar un servidor local desde esa carpeta.

## Publicar con GitHub Pages
1. Inicia sesión en GitHub y crea un repositorio nuevo, por ejemplo `synapse-steam`.
2. Sube `index.html`, `styles.css`, `script.js` y este `README.md` a la raíz del repositorio.
3. En el repositorio abre **Settings → Pages**.
4. En **Build and deployment**, selecciona **Deploy from a branch**.
5. Elige la rama `main` y la carpeta `/(root)`, guarda los cambios.
6. Espera a que GitHub Pages genere la URL pública. Verifica el sitio en escritorio y móvil.

> La publicación requiere que la hagas desde tu cuenta de GitHub. No se ha publicado automáticamente desde este paquete.

## Referencias
- Daniel Shiffman, [The Nature of Code](https://natureofcode.com/).
- [Documentación de p5.js](https://p5js.org/reference/).
- Naciones Unidas, [ODS 4: Educación de calidad](https://sdgs.un.org/goals/goal4).
- Naciones Unidas, [ODS 5: Igualdad de género](https://sdgs.un.org/goals/goal5).

## Nota
Los recursos de escuelas y becas en la sección Brújula están marcados como ejemplos conceptuales; no deben presentarse como convocatorias verificadas.
