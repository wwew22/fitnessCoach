const WORKOUTS = {
  Push: [
    {
      name: 'Incline DB Press',
      reps: '4 x 8-10',
      sets: 4
    },
    {
      name: 'Chest Press',
      reps: '3 x 10-12',
      sets: 3
    },
    {
      name: 'Lateral Raises',
      reps: '4 x 15',
      sets: 4
    }
  ],

  Pull: [
    {
      name: 'Chest Supported Row',
      reps: '4 x 8-10',
      sets: 4
    },
    {
      name: 'Pulldown',
      reps: '4 x 10-12',
      sets: 4
    },
    {
      name: 'Hammer Curl',
      reps: '3 x 12',
      sets: 3
    }
  ],

  Legs: [
    {
      name: 'Leg Press',
      reps: '4 x 10',
      sets: 4
    },
    {
      name: 'Romanian Deadlift',
      reps: '4 x 10',
      sets: 4
    },
    {
      name: 'Calf Raises',
      reps: '4 x 15',
      sets: 4
    }
  ]
};

let activeDay = 'Push';

let state = JSON.parse(
  localStorage.getItem('gym_ai_state') || '{}'
);

function save() {
  localStorage.setItem(
    'gym_ai_state',
    JSON.stringify(state)
  );
}

function exerciseKey(day, index) {
  return `${day}_${index}`;
}

function renderTabs() {
  const tabs = document.getElementById('tabs');

  tabs.innerHTML = '';

  Object.keys(WORKOUTS).forEach(day => {
    const btn = document.createElement('button');

    btn.textContent = day;

    if (day === activeDay) {
      btn.classList.add('active');
    }

    btn.addEventListener('click', () => {
      activeDay = day;

      renderTabs();
      renderWorkout();
    });

    tabs.appendChild(btn);
  });
}

function renderWorkout() {
  const container =
    document.getElementById('workoutContainer');

  container.innerHTML = '';

  const workout = WORKOUTS[activeDay];

  let completed = 0;
  let totalSets = 0;

  workout.forEach((exercise, index) => {

    const key = exerciseKey(activeDay, index);

    if (!state[key]) {
      state[key] = {
        completedSets: [],
        weight: ''
      };
    }

    totalSets += exercise.sets;
    completed += state[key].completedSets.length;

    const card = document.createElement('div');

    card.className = 'exercise-card';

    const setsHTML = Array
      .from({ length: exercise.sets })
      .map((_, setIndex) => {

        const done =
          state[key].completedSets.includes(setIndex);

        return `
          <button
            class="set-btn ${done ? 'done' : ''}"
            data-key="${key}"
            data-set="${setIndex}"
          >
            ${done ? '✓' : setIndex + 1}
          </button>
        `;
      })
      .join('');

    card.innerHTML = `
      <div class="exercise-top">

        <div>
          <div class="exercise-name">
            ${exercise.name}
          </div>

          <div class="exercise-meta">
            ${exercise.reps}
          </div>
        </div>

      </div>

      <div class="sets">
        ${setsHTML}
      </div>

      <div class="weight-row">

        <input
          type="number"
          inputmode="decimal"
          placeholder="Greutate (kg)"
          value="${state[key].weight}"
          data-weight="${key}"
        />

      </div>
    `;

    container.appendChild(card);
  });

  attachEvents();

  const percent = totalSets
    ? Math.round((completed / totalSets) * 100)
    : 0;

  document.getElementById(
    'progressText'
  ).textContent = `${percent}%`;

  renderAI(percent);
}

function attachEvents() {

  document
    .querySelectorAll('.set-btn')
    .forEach(btn => {

      btn.addEventListener('click', () => {

        const key = btn.dataset.key;

        const set = Number(
          btn.dataset.set
        );

        const arr =
          state[key].completedSets;

        if (arr.includes(set)) {

          state[key].completedSets =
            arr.filter(s => s !== set);

        } else {

          state[key].completedSets.push(set);

          navigator.vibrate?.(50);

          startTimer(90);
        }

        save();

        renderWorkout();
      });
    });

  document
    .querySelectorAll('[data-weight]')
    .forEach(input => {

      input.addEventListener('input', () => {

        const key =
          input.dataset.weight;

        state[key].weight =
          input.value;

        save();
      });
    });
}

function renderAI(percent) {

  const ai =
    document.getElementById('aiMessage');

  if (percent >= 85) {

    ai.textContent =
      'Excelent progres. Poți crește greutățile cu 2.5–5% săptămâna viitoare.';

  } else if (percent >= 50) {

    ai.textContent =
      'Volum bun. Menține execuția controlată și focus pe tehnică.';

  } else {

    ai.textContent =
      'AI Coach recomandă o sesiune mai ușoară sau recovery extra.';
  }
}

let timerInterval;

let remaining = 0;

function startTimer(seconds) {

  clearInterval(timerInterval);

  remaining = seconds;

  updateTimer();

  timerInterval = setInterval(() => {

    remaining--;

    updateTimer();

    if (remaining <= 0) {

      clearInterval(timerInterval);

      navigator.vibrate?.([
        200,
        100,
        200
      ]);
    }

  }, 1000);
}

function updateTimer() {

  document.getElementById(
    'timerText'
  ).textContent = `${remaining}s`;
}

document
  .querySelectorAll('[data-timer]')
  .forEach(btn => {

    btn.addEventListener('click', () => {

      startTimer(
        Number(btn.dataset.timer)
      );
    });
  });

renderTabs();

renderWorkout();