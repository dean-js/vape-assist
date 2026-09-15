/**
 * pages/onboarding.js
 * Renders the sign-up quiz from QUIZ_QUESTIONS (data, not hardcoded
 * markup - see data/quiz-questions.js) and saves the answers as the
 * user's profile. That profile feeds recommendations.js everywhere
 * else in the app.
 */

import { initPage } from "../components/shared.js";
import { showToast } from "../components/toast.js";
import { QUIZ_QUESTIONS } from "../data/quiz-questions.js";
import { saveProfile, getProfile } from "../data/store.js";

// In-memory answer state while the user is filling the form out.
// Shape: { [questionId]: singleValue | [valuesForMulti] }
const answers = {};

async function render() {
  await initPage("profile"); // no active sidebar highlight really fits; reuse profile icon area is fine
  const existing = await getProfile();
  if (existing) {
    QUIZ_QUESTIONS.forEach((q) => {
      if (existing[q.field] !== undefined) answers[q.id] = existing[q.field];
    });
  }

  document.getElementById("quiz-questions").innerHTML = QUIZ_QUESTIONS.map(renderQuestion).join("");
  document.getElementById("quiz-form").addEventListener("submit", handleSubmit);
  document.getElementById("quiz-questions").addEventListener("click", handleChipClick);
}

function renderQuestion(question) {
  const selected = answers[question.id];
  const chips = question.options
    .map((opt) => {
      const isSelected = question.type === "multi" ? (selected || []).includes(opt.value) : selected === opt.value;
      return `<button type="button" class="chip ${isSelected ? "selected" : ""}" data-question="${question.id}" data-value="${opt.value}">${opt.label}</button>`;
    })
    .join("");

  return `
    <div class="field">
      <label>${question.question}</label>
      <div class="chip-group">${chips}</div>
    </div>`;
}

function handleChipClick(event) {
  const chip = event.target.closest(".chip");
  if (!chip) return;

  const questionId = chip.dataset.question;
  const question = QUIZ_QUESTIONS.find((q) => q.id === questionId);
  const rawValue = chip.dataset.value;
  // Values in quiz-questions.js can be numbers (nicotineStrength) or strings - coerce back.
  const value = question.options.find((o) => String(o.value) === rawValue)?.value;

  if (question.type === "multi") {
    const current = new Set(answers[questionId] || []);
    if (current.has(value)) current.delete(value);
    else current.add(value);
    answers[questionId] = Array.from(current);
  } else {
    answers[questionId] = value;
  }

  // Re-render just this question's chip group so the "selected" style updates.
  chip.closest(".field").outerHTML = renderQuestion(question);
}

async function handleSubmit(event) {
  event.preventDefault();

  const deviceTypeQuestion = QUIZ_QUESTIONS.find((q) => q.id === "deviceType");
  const deviceTypeOption = deviceTypeQuestion.options.find((o) => o.value === answers.deviceType);

  const existing = await getProfile();

  const profile = {
    cigarettesPerDay: answers.cigarettesPerDay || null,
    nicotineStrength: answers.nicotineStrength ?? null,
    flavourPreferences: answers.flavourPreferences || [],
    deviceType: answers.deviceType || null,
    deviceTypeTags: deviceTypeOption?.tags || [],
    budget: answers.budget || null,
    // First time completing the quiz starts the "smoke free" day count.
    startDate: existing?.startDate || new Date().toISOString(),
  };

  await saveProfile(profile);
  showToast("Profile saved!");
  window.location.href = "index.html";
}

render();
