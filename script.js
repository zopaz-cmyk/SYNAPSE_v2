/* SYNAPSE — Interfaz y agentes autónomos
   Inspiración: The Nature of Code, cap. 5 (Autonomous Agents).
   Cada agente calcula su propio movimiento mediante seek/arrive, seguimiento
   de una trayectoria y separación suave respecto de otros agentes. */

const STORAGE_KEY = "synapse-state-v2";

const lessons = [
  { id: 1, category: "lenguaje", title: "Storytelling para proyectos", tag: "LENGUAJE · 6 MIN", desc: "Estructura narrativas que comuniquen la motivación detrás de una idea social.", completed: true, content: "<p>El <em>storytelling</em> transmite la motivación detrás de una investigación o proyecto. Una estructura sencilla puede organizarse en tres actos:</p><ol><li><strong>Gancho:</strong> presenta una pregunta o situación que despierte curiosidad.</li><li><strong>Nudo:</strong> explica el reto, la evidencia y las personas implicadas.</li><li><strong>Llamada a la acción:</strong> propone una forma concreta de participar o cambiar algo.</li></ol>", quiz: { q: "¿Qué busca principalmente el gancho de una historia?", opts: [{ t: "Conectar con la audiencia y despertar interés", c: true }, { t: "Presentar todas las conclusiones de inmediato", c: false }, { t: "Evitar que la audiencia haga preguntas", c: false }] } },
  { id: 2, category: "humanidades", title: "Pioneras invisibles", tag: "HUMANIDADES · 8 MIN", desc: "Explora el sesgo de visibilidad histórica de las mujeres en la ciencia.", completed: false, content: "<p>El <strong>Efecto Matilda</strong> describe cómo las contribuciones de mujeres científicas han sido ignoradas, minimizadas o atribuidas a colegas varones. Revisar estas historias también implica observar quién cuenta la historia y qué fuentes utiliza.</p><p>Para investigar una pionera: identifica su contribución, el contexto histórico, las barreras que enfrentó y las fuentes que respaldan la información.</p>", quiz: { q: "¿Qué describe el Efecto Matilda?", opts: [{ t: "La desvalorización o invisibilización de aportaciones de mujeres científicas", c: true }, { t: "Una técnica para medir la velocidad de la luz", c: false }, { t: "Un premio internacional de ingeniería", c: false }] } },
  { id: 3, category: "matematicas", title: "Estadística y brechas", tag: "MATEMÁTICAS · 5 MIN", desc: "Lee datos con perspectiva crítica y evita conclusiones basadas en muestras sesgadas.", completed: false, content: "<p>Los datos pueden ayudar a identificar desigualdades, pero deben interpretarse en contexto. Pregunta quién fue incluido en la muestra, cómo se recogió la información y qué variables podrían faltar.</p><p>Una gráfica clara no garantiza por sí sola una conclusión justa: la selección de datos y su interpretación también importan.</p>", quiz: { q: "¿Cuándo puede existir sesgo de muestreo?", opts: [{ t: "Cuando la muestra no representa adecuadamente a la población que se estudia", c: true }, { t: "Cuando una tabla tiene encabezados", c: false }, { t: "Siempre que los datos se presentan con porcentajes", c: false }] } },
  { id: 4, category: "tecnologia", title: "Arte generativo: partículas y agentes", tag: "CÓDIGO CREATIVO · 8 MIN", desc: "Convierte reglas sencillas en movimiento, sistemas visuales y comportamientos emergentes.", completed: false, content: "<p><strong>Sistemas de partículas:</strong> imagina muchos elementos pequeños que tienen posición, velocidad y un ciclo de vida. Cada partícula puede moverse con ligeras variaciones, desaparecer y reaparecer; en conjunto, forman una composición en constante cambio.</p><p><strong>Agentes autónomos:</strong> son elementos que ajustan su movimiento según reglas locales, como buscar un objetivo, mantener distancia de otros o reaccionar al cursor. No necesitan una coreografía fija: sus interacciones pueden producir patrones inesperados.</p><p><strong>Prueba creativa:</strong> diseña una escena con puntos de colores. Haz que las partículas floten y que los agentes se separen suavemente cuando el cursor se acerque. Observa cómo unas pocas reglas transforman la experiencia visual.</p>", quiz: { q: "¿Qué diferencia mejor a un agente autónomo de una partícula sencilla?", opts: [{ t: "El agente ajusta su movimiento según objetivos e interacciones con el entorno", c: true }, { t: "La partícula siempre necesita un usuario que la mueva", c: false }, { t: "Un agente no puede reaccionar al cursor", c: false }] } }
];

const schools = [
  { tag: "TECNOLOGÍA + ARTE", title: "Instituto de Artes Digitales", desc: "Ejemplo de programa técnico en diseño de interacción y animación.", details: ["Modalidad: híbrida", "Duración: 2 años"], url: "" },
  { tag: "INGENIERÍA", title: "Universidad Politécnica STEAM", desc: "Ejemplo de ruta educativa con enfoque interdisciplinario y laboratorios.", details: ["Modalidad: presencial", "Duración: 4 años"], url: "" }
];
const scholarships = [
  { tag: "EJEMPLO DE APOYO", title: "Fondo Coderas ODS 5", desc: "Ejemplo conceptual de financiamiento para mujeres que estudian desarrollo web.", details: ["Convocatoria: por verificar"], url: "" },
  { tag: "ARTE + CÓDIGO", title: "Innovación Creativa", desc: "Ejemplo conceptual de apoyo para proyectos interdisciplinarios.", details: ["Convocatoria: por verificar"], url: "" }
];

let activeId = null;
let lastFocusedElement = null;
let appState = loadState();

function loadState() {
  const defaults = { completed: [1], comments: [], completedWeeks: [], motionPaused: false };
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!saved || typeof saved !== "object") return defaults;
    return {
      completed: Array.isArray(saved.completed) ? saved.completed.filter(id => lessons.some(l => l.id === id)) : defaults.completed,
      comments: Array.isArray(saved.comments) ? saved.comments.filter(c => c && typeof c.text === "string").slice(-30) : [],
      completedWeeks: Array.isArray(saved.completedWeeks) ? saved.completedWeeks.filter(n => Number.isInteger(n) && n >= 1 && n <= 4) : [],
      motionPaused: Boolean(saved.motionPaused)
    };
  } catch (_) { return defaults; }
}
function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(appState)); }
  catch (error) { console.warn("No se pudo guardar el estado local.", error); }
}
function syncLessons() {
  lessons.forEach(l => { l.completed = appState.completed.includes(l.id); });
}
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
}

function init() {
  syncLessons();
  renderLessons();
  renderCompass();
  renderComments();
  updateProgress();
  updateWeeksStats();
  initAgents();
  document.getElementById("year").textContent = new Date().getFullYear();
  setMotionPaused(appState.motionPaused, false);
  document.getElementById("motion-toggle").addEventListener("click", () => setMotionPaused(!appState.motionPaused));
  document.getElementById("comment-form").addEventListener("submit", event => {
    event.preventDefault();
    addComment();
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeLessonModal();
  });
  document.getElementById("lesson-modal").addEventListener("click", event => {
    if (event.target.id === "lesson-modal") closeLessonModal();
  });
}

function showView(viewId, clickedButton) {
  document.querySelectorAll(".view").forEach(view => view.classList.toggle("active", view.id === "view-" + viewId));
  document.querySelectorAll(".nav-link").forEach(button => button.classList.toggle("active", button.dataset.view === viewId));
  // Los canvas de las vistas ocultas miden 0 px durante la carga inicial.
  // Al activar una vista, medir de nuevo su encabezado y crear sus agentes.
  requestAnimationFrame(() => {
    const activeView = document.getElementById("view-" + viewId);
    if (activeView) activeView.querySelectorAll(".agent-canvas").forEach(canvas => {
      if (typeof canvas._resizeAgents === "function") canvas._resizeAgents();
    });
    requestAgentsFrame();
  });
  const main = document.querySelector(".main-content");
  if (main) main.scrollTo({ top: 0, behavior: appState.motionPaused ? "auto" : "smooth" });
  if (viewId === "ruta") updateWeeksStats();
}

function switchWeek(number) {
  document.querySelectorAll(".stepper .step").forEach(button => {
    const active = Number(button.dataset.week) === number;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  document.querySelectorAll(".week-content").forEach(card => card.classList.toggle("hidden", card.id !== "week-" + number));
  if (!appState.completedWeeks.includes(number)) {
    appState.completedWeeks.push(number);
    saveState();
    updateWeeksStats();
  }
}
function filterLessons(category, button) {
  document.querySelectorAll("#view-aprender .tab").forEach(tab => tab.classList.toggle("active", tab === button));
  document.querySelectorAll(".lesson-card").forEach(card => card.classList.toggle("hidden", category !== "todos" && card.dataset.cat !== category));
}
function switchCompassTab(tabName, button) {
  document.querySelectorAll("#view-brujula .tab").forEach(tab => {
    if (tab.dataset.compass) tab.classList.toggle("active", tab === button);
  });
  document.getElementById("dir-escuelas").classList.toggle("hidden", tabName !== "escuelas");
  document.getElementById("dir-becas").classList.toggle("hidden", tabName !== "becas");
}

function renderLessons() {
  const grid = document.getElementById("lessons-grid");
  grid.replaceChildren();
  lessons.forEach(lesson => {
    const card = document.createElement("article");
    card.className = "card lesson-card";
    card.dataset.cat = lesson.category;
    const top = document.createElement("div");
    top.className = "lesson-card-top";
    const tag = document.createElement("span");
    tag.className = "tag tag-ods4";
    tag.textContent = lesson.tag;
    const checkLabel = document.createElement("label");
    checkLabel.className = "lesson-check-label";
    checkLabel.title = "Marcar como completada";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox"; checkbox.className = "lesson-cb"; checkbox.dataset.id = lesson.id;
    checkbox.checked = lesson.completed;
    checkbox.setAttribute("aria-label", "Marcar " + lesson.title + " como completada");
    checkbox.addEventListener("change", () => toggleCompletion(lesson.id, checkbox.checked));
    checkLabel.append(checkbox);
    top.append(tag, checkLabel);
    const number = document.createElement("div"); number.className = "lesson-number"; number.textContent = String(lesson.id).padStart(2, "0");
    const title = document.createElement("h3"); title.textContent = lesson.title;
    const desc = document.createElement("p"); desc.className = "lesson-desc"; desc.textContent = lesson.desc;
    const bottom = document.createElement("div"); bottom.className = "lesson-card-bottom";
    const category = document.createElement("span"); category.textContent = lesson.category.toUpperCase();
    const open = document.createElement("button"); open.className = "text-button"; open.type = "button"; open.innerHTML = 'Abrir lección <span aria-hidden="true">↗</span>';
    open.addEventListener("click", () => openModal(lesson.id));
    bottom.append(category, open);
    card.append(top, number, title, desc, bottom);
    grid.append(card);
  });
}
function renderCompass() {
  renderResourceCards("dir-escuelas", schools, "school");
  renderResourceCards("dir-becas", scholarships, "scholarship");
}
function renderResourceCards(id, items, type) {
  const grid = document.getElementById(id);
  grid.replaceChildren();
  items.forEach((item, index) => {
    const card = document.createElement("article"); card.className = "card resource-card";
    const indexEl = document.createElement("span"); indexEl.className = "resource-index"; indexEl.textContent = String(index + 1).padStart(2, "0");
    const tag = document.createElement("span"); tag.className = "tag " + (type === "school" ? "tag-ods5" : "tag-ods4"); tag.textContent = item.tag;
    const title = document.createElement("h3"); title.textContent = item.title;
    const desc = document.createElement("p"); desc.className = "resource-desc"; desc.textContent = item.desc;
    const details = document.createElement("ul"); details.className = "resource-details";
    item.details.forEach(text => { const li = document.createElement("li"); li.textContent = text; details.append(li); });
    const button = document.createElement("button"); button.type = "button"; button.className = "btn " + (type === "school" ? "btn-outline" : "btn-dark");
    button.textContent = type === "school" ? "Ver información ↗" : "Revisar requisitos ↗";
    button.addEventListener("click", () => {
      if (item.url) window.open(item.url, "_blank", "noopener,noreferrer");
      else window.alert("Este recurso es un ejemplo de diseño. Añade una URL oficial y verifica la convocatoria antes de publicar la aplicación.");
    });
    card.append(indexEl, tag, title, desc, details, button); grid.append(card);
  });
}
function renderComments() {
  const list = document.getElementById("comment-list");
  list.replaceChildren();
  const all = [{ name: "Elena R.", initials: "ER", text: "A veces se asume que las ingenierías no son para mujeres. Necesitamos más referentes y espacios donde todas podamos experimentar." }, ...appState.comments.map(c => ({ name: c.name || "Tú", initials: c.initials || "TÚ", text: c.text }))];
  all.forEach(comment => {
    const article = document.createElement("article"); article.className = "comment";
    const avatar = document.createElement("span"); avatar.className = "comment-avatar"; avatar.textContent = comment.initials;
    const content = document.createElement("div");
    const name = document.createElement("strong"); name.textContent = comment.name;
    const text = document.createElement("p"); text.textContent = comment.text;
    content.append(name, text); article.append(avatar, content); list.append(article);
  });
}
function addComment() {
  const input = document.getElementById("comment-input");
  const text = input.value.trim();
  if (!text) return;
  appState.comments.push({ name: "Tú", initials: "TÚ", text: text.slice(0, 400) });
  appState.comments = appState.comments.slice(-30);
  saveState(); renderComments(); input.value = ""; input.focus();
}

function openModal(id) {
  const lesson = lessons.find(item => item.id === id);
  if (!lesson) return;
  activeId = id; lastFocusedElement = document.activeElement;
  document.getElementById("modal-title").textContent = lesson.title;
  document.getElementById("modal-tag").textContent = lesson.tag;
  document.getElementById("modal-content").innerHTML = lesson.content;
  document.getElementById("quiz-question").textContent = lesson.quiz.q;
  document.getElementById("quiz-feedback").textContent = "";
  const options = document.getElementById("quiz-options"); options.replaceChildren();
  lesson.quiz.opts.forEach((option, index) => {
    const button = document.createElement("button"); button.type = "button"; button.className = "quiz-option"; button.textContent = option.t;
    button.addEventListener("click", () => checkQuiz(button, option.c));
    options.append(button);
  });
  document.getElementById("modal-checkbox").checked = lesson.completed;
  document.getElementById("lesson-modal").classList.remove("hidden");
  document.body.classList.add("modal-open");
  document.querySelector(".close-modal").focus();
}
function checkQuiz(button, isCorrect) {
  document.querySelectorAll(".quiz-option").forEach(option => { option.classList.remove("correct", "wrong"); option.disabled = false; });
  button.classList.add(isCorrect ? "correct" : "wrong");
  const feedback = document.getElementById("quiz-feedback");
  feedback.textContent = isCorrect ? "¡Correcto! Has identificado la idea clave." : "No del todo. Vuelve a leer la lección e inténtalo otra vez.";
  feedback.className = "quiz-feedback " + (isCorrect ? "success" : "error");
}
function closeLessonModal() {
  document.getElementById("lesson-modal").classList.add("hidden");
  document.body.classList.remove("modal-open");
  if (lastFocusedElement && typeof lastFocusedElement.focus === "function") lastFocusedElement.focus();
}
function toggleCompletion(id, completed) {
  const lesson = lessons.find(item => item.id === id);
  if (!lesson) return;
  lesson.completed = completed;
  appState.completed = lessons.filter(item => item.completed).map(item => item.id);
  saveState(); updateProgress();
  const checkbox = document.querySelector(`.lesson-cb[data-id="${id}"]`);
  if (checkbox) checkbox.checked = completed;
  if (activeId === id) document.getElementById("modal-checkbox").checked = completed;
}
function toggleModalCompletion(completed) {
  if (activeId !== null) toggleCompletion(activeId, completed);
}
function updateProgress() {
  const done = lessons.filter(lesson => lesson.completed).length;
  const percent = Math.round(done / lessons.length * 100);
  document.getElementById("progress-bar").style.width = percent + "%";
  document.getElementById("progress-text").textContent = `${done} de ${lessons.length} · ${percent}%`;
  const track = document.getElementById("progress-track");
  track.setAttribute("aria-valuenow", String(done));
  document.getElementById("completed-stat").innerHTML = `${done} <small>/ ${lessons.length}</small>`;
  const areas = new Set(lessons.filter(l => l.completed).map(l => l.category)).size;
  document.getElementById("areas-stat").innerHTML = `${areas} <small>/ 4</small>`;
}
function updateWeeksStats() {
  document.getElementById("weeks-stat").innerHTML = `${appState.completedWeeks.length} <small>/ 4</small>`;
}
function setMotionPaused(paused, persist = true) {
  appState.motionPaused = Boolean(paused);
  document.body.classList.toggle("motion-paused", appState.motionPaused);
  const button = document.getElementById("motion-toggle");
  button.setAttribute("aria-pressed", String(appState.motionPaused));
  document.getElementById("motion-label").textContent = appState.motionPaused ? "Activar movimiento" : "Pausar movimiento";
  if (persist) saveState();
  agentsPaused = appState.motionPaused;
  if (!agentsPaused) requestAgentsFrame();
}

/* --- Agentes autónomos (steering behaviors) --- */
const prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let agents = [];
let agentCanvases = [];
let agentsPaused = false;
let agentsFrameRequested = false;
let pointer = { x: -1000, y: -1000, active: false };
let globalPointer = { x: -1000, y: -1000 };
const palette = {
  pink: ["#ff5d9e", "#ffb2d0", "#ffd9e8"],
  cyan: ["#5ce1e6", "#b5fbf2", "#9b8cff"],
  lime: ["#d9f66f", "#9ee6ba", "#e9ffb0"],
  violet: ["#b6a0ff", "#ff83c6", "#7de4e7"]
};
class Agent {
  constructor(canvas, index, theme) {
    this.canvas = canvas; this.ctx = canvas.getContext("2d"); this.theme = theme;
    this.colors = palette[theme] || palette.cyan;
    this.seed = Math.random() * 1000 + index * 13.7;
    this.x = Math.random() * (canvas._logicalWidth || canvas.width); this.y = Math.random() * (canvas._logicalHeight || canvas.height);
    this.vx = (Math.random() - .5) * 1.1; this.vy = (Math.random() - .5) * 1.1;
    this.ax = 0; this.ay = 0; this.maxSpeed = .8 + Math.random() * .65;
    this.maxForce = .035; this.radius = 1.4 + Math.random() * 2;
    this.phase = Math.random() * Math.PI * 2; this.targetX = this.x; this.targetY = this.y;
    this.mode = canvas.dataset.mode || "agents";
    this.life = 0.35 + Math.random() * 0.65;
    this.lifeSpeed = 0.0015 + Math.random() * 0.0018;
  }
  seek(tx, ty, arrive = false) {
    let dx = tx - this.x, dy = ty - this.y;
    const distance = Math.hypot(dx, dy) || 1;
    let speed = this.maxSpeed;
    if (arrive) speed *= Math.min(1, distance / 90);
    const desiredX = dx / distance * speed, desiredY = dy / distance * speed;
    let fx = desiredX - this.vx, fy = desiredY - this.vy;
    const mag = Math.hypot(fx, fy) || 1;
    const force = Math.min(this.maxForce, mag) / mag;
    return [fx * force, fy * force];
  }
  update(time, neighbors, pointerLocal) {
    const w = this.canvas._logicalWidth || this.canvas.width, h = this.canvas._logicalHeight || this.canvas.height;
    // Cap. 4: partículas independientes con vida limitada, deriva y reinicio.
    if (this.mode === "particles") {
      this.life -= this.lifeSpeed;
      this.ax += Math.sin(time * .0007 + this.seed) * .008;
      this.ay += .003 + Math.cos(time * .0005 + this.seed) * .006;
      if (pointerLocal && pointerLocal.active) {
        const dx = this.x - pointerLocal.x, dy = this.y - pointerLocal.y, d = Math.hypot(dx, dy);
        if (d > 0 && d < 150) { const force = (1 - d / 150) * .09; this.ax += dx / d * force; this.ay += dy / d * force; }
      }
      this.vx = (this.vx + this.ax) * .995; this.vy = (this.vy + this.ay) * .995;
      this.x += this.vx; this.y += this.vy; this.ax = 0; this.ay = 0;
      if (this.life <= 0 || this.x < -12 || this.x > w + 12 || this.y < -12 || this.y > h + 12) {
        this.x = Math.random() * w; this.y = h * (.35 + Math.random() * .75);
        this.vx = (Math.random() - .5) * 1.1; this.vy = -(.25 + Math.random() * .9);
        this.life = .55 + Math.random() * .45;
      }
      return;
    }
    // Cap. 5: agentes autónomos que eligen trayectoria y se separan entre sí.
    const cx = w * (.58 + Math.sin(time * .00016 + this.seed) * .16);
    const cy = h * (.52 + Math.cos(time * .00013 + this.seed * .7) * .25);
    let [sx, sy] = this.seek(cx, cy, true);
    this.ax += sx; this.ay += sy;

    // Separación: evita que los agentes se amontonen demasiado.
    let sepX = 0, sepY = 0, count = 0;
    for (const other of neighbors) {
      if (other === this) continue;
      const dx = this.x - other.x, dy = this.y - other.y, d = Math.hypot(dx, dy);
      if (d > 0 && d < 34) { sepX += dx / d / d; sepY += dy / d / d; count++; }
    }
    if (count) { this.ax += sepX * .11; this.ay += sepY * .11; }

    // El cursor modifica la intención: repulsión cercana + atracción suave en el entorno.
    if (pointerLocal && pointerLocal.active) {
      const dx = this.x - pointerLocal.x, dy = this.y - pointerLocal.y, d = Math.hypot(dx, dy);
      if (d > 0 && d < 125) {
        const strength = (1 - d / 125) * .13;
        this.ax += dx / d * strength; this.ay += dy / d * strength;
      } else if (d >= 125 && d < 240) {
        const force = this.seek(pointerLocal.x, pointerLocal.y, true);
        this.ax -= force[0] * .28; this.ay -= force[1] * .28;
      }
    }
    this.vx += this.ax; this.vy += this.ay;
    const speed = Math.hypot(this.vx, this.vy) || 1;
    if (speed > this.maxSpeed) { this.vx = this.vx / speed * this.maxSpeed; this.vy = this.vy / speed * this.maxSpeed; }
    this.x += this.vx; this.y += this.vy; this.ax = 0; this.ay = 0;
    // Reaparece suavemente por el lado opuesto para mantenerse dentro del lienzo.
    const margin = 18;
    if (this.x < -margin) this.x = w + margin; if (this.x > w + margin) this.x = -margin;
    if (this.y < -margin) this.y = h + margin; if (this.y > h + margin) this.y = -margin;
  }
  draw(time) {
    const ctx = this.ctx;
    const pulse = this.mode === "particles" ? .8 + Math.sin(time * .002 + this.phase) * .3 : .7 + Math.sin(time * .001 + this.phase) * .22;
    ctx.beginPath(); ctx.arc(this.x, this.y, this.radius * pulse * (this.mode === "particles" ? 1.2 : 1), 0, Math.PI * 2);
    ctx.fillStyle = this.colors[Math.floor((this.seed % 3))];
    ctx.globalAlpha = this.mode === "particles" ? Math.max(.08, Math.min(.9, this.life)) : .82;
    ctx.fill(); ctx.globalAlpha = 1;
    if (this.mode === "particles") {
      ctx.beginPath(); ctx.moveTo(this.x, this.y); ctx.lineTo(this.x - this.vx * 5, this.y - this.vy * 5);
      ctx.strokeStyle = this.colors[1]; ctx.globalAlpha = Math.max(.05, this.life * .5); ctx.lineWidth = 1; ctx.stroke(); ctx.globalAlpha = 1;
    }
  }
}
function initAgents() {
  agentCanvases = Array.from(document.querySelectorAll(".agent-canvas"));
  if (prefersReducedMotion) {
    setMotionPaused(true, false);
    return;
  }
  agentCanvases.forEach(canvas => {
    const theme = canvas.dataset.theme || "cyan";
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      // No inicializar partículas con dimensiones nulas: la vista puede estar oculta.
      if (rect.width < 2 || rect.height < 2) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      canvas._logicalWidth = rect.width; canvas._logicalHeight = rect.height;
      agents = agents.filter(agent => agent.canvas !== canvas);
      const amount = Math.max(12, Math.min(34, Math.round(rect.width / 24)));
      for (let i = 0; i < amount; i++) agents.push(new Agent(canvas, i, theme));
    };
    canvas._resizeAgents = resize;
    resize();
    const hero = canvas.closest(".section-hero");
    hero.addEventListener("pointermove", event => {
      const rect = canvas.getBoundingClientRect();
      canvas._pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top, active: true };
    });
    hero.addEventListener("pointerleave", () => { canvas._pointer = { x: -1000, y: -1000, active: false }; });
  });
  window.addEventListener("resize", debounce(() => agentCanvases.forEach(canvas => canvas._resizeAgents && canvas._resizeAgents()), 180));
  requestAgentsFrame();
}
function debounce(fn, wait) {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), wait); };
}
function requestAgentsFrame() {
  if (agentsFrameRequested || agentsPaused || document.hidden) return;
  agentsFrameRequested = true;
  requestAnimationFrame(drawAgents);
}
function drawAgents(time) {
  agentsFrameRequested = false;
  if (agentsPaused || document.hidden) return;
  agentCanvases.forEach(canvas => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, rect.width, rect.height);
    const group = agents.filter(agent => agent.canvas === canvas);
    const p = canvas._pointer || { active: false };
    group.forEach(agent => agent.update(time || 0, group, p));
    // Líneas de proximidad: conexiones emergentes, sin líder central.
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        const a = group[i], b = group[j], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 76) {
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = a.colors[0]; ctx.globalAlpha = (1 - d / 76) * .22; ctx.lineWidth = .8; ctx.stroke(); ctx.globalAlpha = 1;
        }
      }
    }
    group.forEach(agent => agent.draw(time || 0));
  });
  requestAgentsFrame();
}
document.addEventListener("visibilitychange", () => { if (!document.hidden) requestAgentsFrame(); });
window.addEventListener("pointermove", event => { globalPointer.x = event.clientX; globalPointer.y = event.clientY; });
window.addEventListener("load", init);
