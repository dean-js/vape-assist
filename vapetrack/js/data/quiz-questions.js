/**
 * quiz-questions.js
 * ---------------------------------------------------------------
 * The onboarding quiz definition. Each answer attaches "tags" to
 * the user's profile; recommendations.js later scores catalogue
 * items by how many of a user's tags they match. Keeping the quiz
 * as plain data (instead of hardcoded HTML) means you can add or
 * reorder questions without touching onboarding.js at all.
 * ---------------------------------------------------------------
 */

export const QUIZ_QUESTIONS = [
  {
    id: "cigarettesPerDay",
    question: "Roughly how many cigarettes did you smoke a day?",
    type: "single",
    field: "cigarettesPerDay",
    options: [
      { label: "1-5 (light smoker)", value: "1-5", nicotineHint: "low" },
      { label: "6-15", value: "6-15", nicotineHint: "medium" },
      { label: "16-25", value: "16-25", nicotineHint: "high" },
      { label: "25+ (heavy smoker)", value: "25+", nicotineHint: "very-high" },
    ],
  },
  {
    id: "nicotineStrength",
    question: "What nicotine strength are you starting with?",
    type: "single",
    field: "nicotineStrength",
    options: [
      { label: "0mg (nicotine-free)", value: 0, tags: ["zero-nic"] },
      { label: "3mg (low)", value: 3, tags: ["low-nic"] },
      { label: "6mg (low-medium)", value: 6, tags: ["low-nic"] },
      { label: "10mg (medium)", value: 10, tags: ["mid-nic"] },
      { label: "20mg (high, e.g. for heavier smokers)", value: 20, tags: ["high-nic"] },
    ],
  },
  {
    id: "flavourPreferences",
    question: "Which flavours are you curious about? (pick as many as you like)",
    type: "multi",
    field: "flavourPreferences",
    options: [
      { label: "Fruit", value: "fruit" },
      { label: "Menthol / Cold", value: "menthol" },
      { label: "Tobacco (familiar, like a cigarette)", value: "tobacco" },
      { label: "Dessert / Sweet", value: "dessert" },
      { label: "Drinks (cola, energy drink, etc.)", value: "drinks" },
    ],
  },
  {
    id: "deviceType",
    question: "What kind of device sounds right for you?",
    type: "single",
    field: "deviceType",
    options: [
      {
        label: "Simple pod system (refillable, beginner friendly)",
        value: "pod-system",
        tags: ["pod-system", "mtl", "beginner-friendly"],
      },
      {
        label: "Disposable-style (no maintenance, higher running cost)",
        value: "disposable-style",
        tags: ["disposable-style"],
      },
      { label: "Not sure yet - recommend something beginner friendly", value: "unsure", tags: ["beginner-friendly"] },
    ],
  },
  {
    id: "budget",
    question: "What's your budget like for hardware?",
    type: "single",
    field: "budget",
    options: [
      { label: "Keep it cheap to start", value: "low" },
      { label: "Mid-range, I'll invest a bit", value: "medium" },
      { label: "Not too fussed on price", value: "high" },
    ],
  },
];
