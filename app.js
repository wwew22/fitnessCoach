const DAYS = [
  { key: "luni", label: "LUN", type: "PUSH" },
  { key: "marti", label: "MAR", type: "PULL" },
  { key: "miercuri", label: "MIE", type: "REST" },
  { key: "joi", label: "JOI", type: "LEGS" },
  { key: "vineri", label: "VIN", type: "PUMP" },
  { key: "sambata", label: "SAM", type: "BAZIN" },
  { key: "duminica", label: "DUM", type: "REST" },
];

const WORKOUTS = {
  luni: {
    title: "PUSH",
    subtitle: "Piept · Umeri · Triceps",
    exercises: ["Incline DB Press", "Machine Chest Press", "Cable Fly", "Push-ups"]
  },
  marti: {
    title: "PULL",
    subtitle: "Spate · Biceps",
    exercises: ["Row", "Pulldown", "Face Pull", "Curl"]
  },
  miercuri: {
    title: "PAUZA",
    subtitle: "Recuperare",
    exercises: []
  }
};

let activeDay = "luni";
let state = JSON.parse(localStorage.getItem("gc_state") || "{}");

function save() {
  localStorage.setItem("gc_state", JSON.stringify(state));
}

function id(day, i) {
  return `${day}_${i}`;
}

function setDay(day) {
  activeDay = day;
  render();
}

function toggle(day, i) {
  const key = id(day, i);
  state[key] = { done: !state[key]?.done };
  save();
  render();
}

function render() {
  const app = document.getElementById("app");
  const w = WORKOUTS[activeDay];

  app.innerHTML = `
    <div class="container">

      <div class="header">
        <div class="title">Gym <span class="highlight">Coach</span></div>
      </div>

      <div class="tabs">
        ${DAYS.map(d => `
          <button class="tab ${d.key === activeDay ? "active" : ""}"
            onclick="setDay('${d.key}')">
            ${d.label}
          </button>
        `).join("")}
      </div>

      <h2>${w.title}</h2>
      <div class="small">${w.subtitle}</div>

      <div style="margin-top:16px">
        ${w.exercises.map((ex, i) => {
          const done = state[id(activeDay, i)]?.done;

          return `
            <div class="card">
              <div class="exercise-title" style="color:${done ? "#2dcd7a" : "#e8e8ec"}">
                ${ex}
              </div>

              <div class="small">Exercițiu</div>

              <button class="secondary" onclick="toggle('${activeDay}',${i})">
                ${done ? "✓ Done" : "Mark done"}
              </button>
            </div>
          `;
        }).join("")}
      </div>

    </div>
  `;
}

window.setDay = setDay;
window.toggle = toggle;

render();
