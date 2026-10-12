/* The seven iKAN assessments, copied from Notion "iKan — Assessment Instruments (live spec)",
 * approved 8 Sep 2026. Question text, option text, weights, cut-points and band names are verbatim.
 * Band sentences come from the spec's FINAL COPY where it has one, otherwise from the
 * 2026-09-08 content revision. PHQ-9 bands have no sentence in either source, so they show none. */

export type Tone = "success" | "warning" | "error";
export type Severity = "minimal" | "mild" | "moderate" | "moderately-severe" | "severe";
export type Option = { text: string; value: number };

export type Band = {
  label: string;
  min: number;
  max: number;
  severity: Severity;
  tone: Tone;
  interpretation?: string;
};

export type Profile = {
  id: string;
  calc: "sum" | "mean" | "sum4";
  direction: "distress" | "better";
  min: number;
  max: number;
  bands: Band[];
};

export type Question = {
  id: string;
  text: string;
  scale: string;
  /** score ids this answer counts toward; empty when asked but not scored */
  scores: string[];
  reversed?: boolean;
  /** self-harm item: an answer above the lowest option offers support on the result */
  risk?: boolean;
};

export type Score = { id: string; label: string; instrument: string; profile: string };

export type Assessment = {
  id: string;
  slug: string;
  category: "depression" | "anxiety" | "stress" | "sleep" | "balance" | "burnout" | "general";
  name: string;
  title: string;
  instrument: string;
  minutes: number;
  scales: Record<string, { options: Option[]; prompt?: string }>;
  questions: Question[];
  scores: Score[];
  /** the score shown as the result; general has none */
  headline?: string;
  /** Equip programmes each band recommends, strongest first (Notion "What each assessment recommends") */
  recommends: Record<string, string[]>;
};

const b = (
  label: string,
  min: number,
  max: number,
  severity: Severity,
  tone: Tone,
  interpretation?: string,
): Band =>
  interpretation
    ? { label, min, max, severity, tone, interpretation }
    : { label, min, max, severity, tone };

export const profiles: Record<string, Profile> = {
  phq9: {
    id: "phq9",
    calc: "sum",
    direction: "distress",
    min: 0,
    max: 27,
    bands: [
      // band sentences from the old iKan scoring profile (the Notion spec has none for PHQ-9)
      b("Minimal", 0, 5, "minimal", "success", "Minimal depressive symptoms."),
      b("Mild", 5, 10, "mild", "warning", "Mild depressive symptoms."),
      b(
        "Moderate",
        10,
        15,
        "moderate",
        "warning",
        "Moderate depressive symptoms — consider speaking with someone you trust.",
      ),
      b(
        "Moderately severe",
        15,
        20,
        "moderately-severe",
        "warning",
        "Moderately severe symptoms — professional support is recommended.",
      ),
      b(
        "Severe",
        20,
        27,
        "severe",
        "error",
        "Severe depressive symptoms. We recommend speaking with a professional soon.",
      ),
    ],
  },
  gad7: {
    id: "gad7",
    calc: "sum",
    direction: "distress",
    min: 0,
    max: 21,
    bands: [
      b("Minimal", 0, 5, "minimal", "success", "Minimal anxiety symptoms."),
      b("Mild", 5, 8, "mild", "warning", "Mild anxiety symptoms."),
      b("Moderate", 8, 10, "moderate", "warning", "Moderate anxiety symptoms."),
      b(
        "Moderately severe",
        10,
        15,
        "moderately-severe",
        "warning",
        "Anxiety is affecting your daily life. This is worth talking through with a professional.",
      ),
      b(
        "Severe",
        15,
        21,
        "severe",
        "error",
        "Severe anxiety symptoms detected. We recommend speaking with a professional.",
      ),
    ],
  },
  "gad2-screen": {
    id: "gad2-screen",
    calc: "sum",
    direction: "distress",
    min: 0,
    max: 6,
    bands: [
      b(
        "Minimal or no anxiety symptoms",
        0,
        3,
        "minimal",
        "success",
        "This brief screen did not indicate anxiety symptoms.",
      ),
      b(
        "Potential anxiety symptoms",
        3,
        6,
        "moderate",
        "warning",
        "This brief screen suggests it is worth looking at anxiety as well.",
      ),
    ],
  },
  "phq2-screen": {
    id: "phq2-screen",
    calc: "sum",
    direction: "distress",
    min: 0,
    max: 6,
    bands: [
      b(
        "Minimal or no depression risk",
        0,
        3,
        "minimal",
        "success",
        "This brief screen did not indicate depressive symptoms.",
      ),
      b(
        "Major depressive disorder is likely",
        3,
        6,
        "moderate",
        "warning",
        "This brief screen suggests it is worth looking at depression as well.",
      ),
    ],
  },
  "stress-severity": {
    id: "stress-severity",
    calc: "sum",
    direction: "distress",
    min: 0,
    max: 40,
    bands: [
      b("Low Stress", 0, 14, "minimal", "success", "You are managing stress well."),
      b(
        "Moderate Stress",
        14,
        27,
        "moderate",
        "warning",
        "Stress is starting to affect your life.",
      ),
      b(
        "High Stress",
        27,
        40,
        "moderately-severe",
        "error",
        "High stress levels. We recommend giving this attention.",
      ),
    ],
  },
  "sleep-severity": {
    id: "sleep-severity",
    calc: "sum",
    direction: "distress",
    min: 8,
    max: 40,
    bands: [
      b("Healthy Sleep", 8, 17, "minimal", "success", "Your sleep patterns look healthy overall."),
      b(
        "Poor Sleep",
        17,
        32,
        "moderate",
        "warning",
        "Your sleep is disturbed often enough to be affecting your days.",
      ),
      b(
        "Very Poor Sleep",
        32,
        40,
        "severe",
        "error",
        "Your sleep is substantially disrupted. Structured support is recommended.",
      ),
    ],
  },
  "balance-severity": {
    id: "balance-severity",
    calc: "sum",
    direction: "distress",
    min: 8,
    max: 40,
    bands: [
      b(
        "Nil",
        8,
        16,
        "minimal",
        "success",
        "Your work conditions aren't putting much strain on you.",
      ),
      b(
        "Fairly Low",
        16,
        21,
        "mild",
        "warning",
        "There's some strain at work, but it's within a range most people manage.",
      ),
      b(
        "Moderate",
        21,
        26,
        "moderate",
        "warning",
        "Work is putting real strain on you. Worth addressing before it builds.",
      ),
      b(
        "Severe",
        26,
        31,
        "moderately-severe",
        "error",
        "Your work conditions are taking a heavy toll. This needs attention.",
      ),
      b(
        "Potentially Dangerous",
        31,
        40,
        "severe",
        "error",
        "Your work conditions are seriously affecting your wellbeing. We recommend speaking with a professional.",
      ),
    ],
  },
  "bat-mean": {
    id: "bat-mean",
    calc: "mean",
    direction: "distress",
    min: 1,
    max: 5,
    bands: [
      b("Low", 1, 2.59, "minimal", "success", "Low burnout risk."),
      b(
        "Normal",
        2.59,
        3.02,
        "mild",
        "warning",
        "Within the normal range, with some signs worth watching.",
      ),
      b("High", 3.02, 5, "moderately-severe", "error", "High burnout risk."),
    ],
  },
  who5: {
    id: "who5",
    calc: "sum4",
    direction: "better",
    min: 0,
    max: 100,
    bands: [
      b(
        "Poor",
        0,
        51,
        "moderately-severe",
        "error",
        "Your wellbeing has been low lately. This is worth paying attention to.",
      ),
      b("Good", 51, 100, "minimal", "success", "Good wellbeing."),
    ],
  },
  ngse: {
    id: "ngse",
    calc: "sum",
    direction: "better",
    min: 8,
    max: 40,
    bands: [
      b("Low", 8, 30, "moderate", "error", "Low self-efficacy."),
      b("Normal", 30, 35, "mild", "warning", "Normal self-efficacy."),
      b("High", 35, 40, "minimal", "success", "High self-efficacy."),
    ],
  },
  brs: {
    id: "brs",
    calc: "mean",
    direction: "better",
    min: 1,
    max: 5,
    bands: [
      b("Low", 1, 3, "moderate", "error", "Low resilience."),
      b("Normal", 3, 4.31, "mild", "warning", "Normal resilience."),
      b("High", 4.31, 5, "minimal", "success", "High resilience."),
    ],
  },
};

const opts =
  (...texts: string[]) =>
  (start: number): Option[] =>
    texts.map((text, i) => ({ text, value: start + i }));

const frequency = opts(
  "1 Not at all",
  "2 Several days",
  "3 More than half the days",
  "4 Nearly every day",
)(0);
const difficulty = opts(
  "1 Not difficult at all",
  "2 Somewhat difficult",
  "3 Very difficult",
  "4 Extremely difficult",
)(0);
/* Instruction lines shown above a question. Not in the spec's tables; they are the published
 * PHQ/GAD/WHO-5 instructions, or a plain "how often/how much" so a fragment item reads. */
const twoWeeks = "Over the last 2 weeks, how often have you been bothered by…";

const q = (
  id: string,
  text: string,
  scale: string,
  scores: string[],
  extra: Partial<Question> = {},
): Question => ({
  id,
  text,
  scale,
  scores,
  ...extra,
});

export const assessments: Assessment[] = [
  {
    id: "asm_1767129862254_frzeigbdb",
    slug: "feeling-depressed-and-hopeless",
    category: "depression",
    name: "Depression",
    title: "Feeling depressed and hopeless",
    instrument: "PHQ-9 with an embedded GAD-2",
    minutes: 3,
    scales: { A: { options: frequency, prompt: twoWeeks }, F: { options: difficulty } },
    questions: [
      q("depression-q1", "Little interest or pleasure in doing things", "A", ["phq9-total"]),
      q("depression-q2", "Feeling down, depressed, or hopeless", "A", ["phq9-total"]),
      q("depression-q3", "Trouble falling or staying asleep or sleeping too much", "A", [
        "phq9-total",
      ]),
      q("depression-q4", "Feeling tired or having little energy", "A", ["phq9-total"]),
      q("depression-q5", "Poor appetite or overeating", "A", ["phq9-total"]),
      q(
        "depression-q6",
        "Feeling bad about yourself-or that you’re a failure or have let yourself or your family down",
        "A",
        ["phq9-total"],
      ),
      q(
        "depression-q7",
        "Trouble concentrating on things, such as reading the newspaper or watching television",
        "A",
        ["phq9-total"],
      ),
      q(
        "depression-q8",
        "Moving or speaking so slowly that other people could have noticed. Or, the opposite - being so fidgety or restless that you have been moving around a lot more than usual",
        "A",
        ["phq9-total"],
      ),
      q(
        "depression-q9",
        "Thoughts that you would be better off dead or of hurting yourself in some way",
        "A",
        ["phq9-total"],
        { risk: true },
      ),
      q(
        "depression-q10",
        "How difficult have the above problems made it for you to do your work, take care of things at home, or get along with other people?",
        "F",
        [],
      ),
      q("depression-q11", "Feeling nervous, anxious or on edge", "A", ["gad2-total"]),
      q("depression-q12", "Not being able to stop or control worrying", "A", ["gad2-total"]),
    ],
    scores: [
      { id: "phq9-total", label: "Depression", instrument: "PHQ-9", profile: "phq9" },
      { id: "gad2-total", label: "Anxiety", instrument: "GAD-2", profile: "gad2-screen" },
    ],
    headline: "phq9-total",
    recommends: {
      Moderate: ["sleep-tight"],
      "Moderately severe": ["unburn", "sleep-tight"],
      Severe: ["unburn", "sleep-tight"],
    },
  },
  {
    id: "asm_1767129765741_wse9aeprv",
    slug: "feeling-overwhelmed-and-anxious",
    category: "anxiety",
    name: "Anxiety",
    title: "Feeling overwhelmed and anxious",
    instrument: "GAD-7 with an embedded PHQ-2",
    minutes: 4,
    scales: { A: { options: frequency, prompt: twoWeeks }, F: { options: difficulty } },
    questions: [
      q("anxiety-q1", "Feeling nervous, anxious, or on edge", "A", ["gad7-total"]),
      q("anxiety-q2", "Not being able to stop or control worrying", "A", ["gad7-total"]),
      q("anxiety-q3", "Worrying too much about different things", "A", ["gad7-total"]),
      q("anxiety-q4", "Trouble relaxing", "A", ["gad7-total"]),
      q("anxiety-q5", "Being so restless it’s hard to sit still", "A", ["gad7-total"]),
      q("anxiety-q6", "Becoming easily annoyed or irritable", "A", ["gad7-total"]),
      q("anxiety-q7", "Feeling afraid as if something awful might happen", "A", ["gad7-total"]),
      q(
        "anxiety-q8",
        "How difficult have the above problems made it for you to do your work, take care of things at home, or get along with other people?",
        "F",
        [],
      ),
      q("anxiety-q9", "Little interest or pleasure in doing things", "A", ["phq2-total"]),
      q("anxiety-q10", "Feeling down, depressed or hopeless", "A", ["phq2-total"]),
    ],
    scores: [
      { id: "gad7-total", label: "Anxiety", instrument: "GAD-7", profile: "gad7" },
      { id: "phq2-total", label: "Depression", instrument: "PHQ-2", profile: "phq2-screen" },
    ],
    headline: "gad7-total",
    recommends: {
      Mild: ["stress-buster"],
      Moderate: ["sleep-tight", "stress-buster"],
      "Moderately severe": ["sleep-tight", "stress-buster", "unburn"],
      Severe: ["sleep-tight", "stress-buster", "unburn"],
    },
  },
  {
    id: "asm_1767129926263_ru3v6dozh",
    slug: "feeling-worried-and-stressed",
    category: "stress",
    name: "Stress",
    title: "Feeling worried and stressed",
    instrument: "PSS-10",
    minutes: 4,
    scales: {
      A: {
        options: opts(
          "0 - Never",
          "1 - Almost Never",
          "2 - Sometimes",
          "3 - Fairly Often",
          "4 - Very Often",
        )(0),
      },
    },
    questions: [
      q(
        "stress-q1",
        "In the last month, how often have you been upset because of something that happened unexpectedly?",
        "A",
        ["stress-total"],
      ),
      q(
        "stress-q2",
        "In the last month, how often have you felt that you were unable to control the important things in your life?",
        "A",
        ["stress-total"],
      ),
      q("stress-q3", "In the last month, how often have you felt nervous and stressed?", "A", [
        "stress-total",
      ]),
      q(
        "stress-q4",
        "In the last month, how often have you felt confident about your ability to handle your personal problems?",
        "A",
        ["stress-total"],
        { reversed: true },
      ),
      q(
        "stress-q5",
        "In the last month, how often have you felt that things were going your way?",
        "A",
        ["stress-total"],
        { reversed: true },
      ),
      q(
        "stress-q6",
        "In the last month, how often have you found that you could not cope with all the things that you had to do?",
        "A",
        ["stress-total"],
      ),
      q(
        "stress-q7",
        "In the last month, how often have you been able to control irritations in your life?",
        "A",
        ["stress-total"],
        { reversed: true },
      ),
      q(
        "stress-q8",
        "In the last month, how often have you felt that you were on top of things?",
        "A",
        ["stress-total"],
        { reversed: true },
      ),
      q(
        "stress-q9",
        "In the last month, how often have you been angered because of things that happened that were outside of your control?",
        "A",
        ["stress-total"],
      ),
      q(
        "stress-q10",
        "In the last month, how often have you felt difficulties were piling up so high that you could not overcome them?",
        "A",
        ["stress-total"],
      ),
    ],
    scores: [
      { id: "stress-total", label: "Stress", instrument: "PSS-10", profile: "stress-severity" },
    ],
    headline: "stress-total",
    recommends: {
      "Moderate Stress": ["stress-buster", "sleep-tight"],
      "High Stress": ["unburn", "stress-buster", "sleep-tight"],
    },
  },
  {
    id: "asm_1767130007889_mewy939gi",
    slug: "struggling-with-quality-sleep",
    category: "sleep",
    name: "Sleep",
    title: "Struggling with quality sleep",
    instrument: "Based on Insomnia Severity Index themes",
    minutes: 10,
    scales: {
      A: {
        options: opts(
          "1 0-15 minutes",
          "2 16-30 minutes",
          "3 31-45 minutes",
          "4 46-60 minutes",
          "5 Over 60 minutes",
        )(1),
      },
      B: { options: opts("1 0-1", "2 2", "3 3", "4 4", "5 5-7")(1) },
      C: { options: opts("1 Very Good", "2 Good", "3 Average", "4 Poor", "5 Very Poor")(1) },
      D: {
        options: opts("1 Not at all", "2 A little", "3 Somewhat", "4 Much", "5 Very Much")(1),
        prompt: "How much has your sleep problem…",
      },
      E: {
        options: opts(
          "1 I don’t have a problem/less than 1 month",
          "2 1 – 2 months",
          "3 3 – 6 months",
          "4 7 – 12 months",
          "5 More than 1 year",
        )(1),
      },
    },
    questions: [
      q("sleep-q1", "How long does it take you to fall asleep?", "A", ["sleep-total"]),
      q(
        "sleep-q2",
        "…if you then wake up during the night … how long are you awake for in total? (add all the times you woke up)",
        "A",
        ["sleep-total"],
      ),
      q("sleep-q3", "How many nights a week do you have sleep troubles?", "B", ["sleep-total"]),
      q("sleep-q4", "How would you rate the quality of your sleep?", "C", ["sleep-total"]),
      q("sleep-q5", "Affected your mood, energy, or relationships?", "D", ["sleep-total"]),
      q("sleep-q6", "Affected your concentration, productivity, or ability to stay awake?", "D", [
        "sleep-total",
      ]),
      q("sleep-q7", "Troubled you in general?", "D", ["sleep-total"]),
      q("sleep-q8", "Finally how long have you had a problem with your sleep?", "E", [
        "sleep-total",
      ]),
    ],
    scores: [
      {
        id: "sleep-total",
        label: "Sleep",
        /* Not "Sleep severity": the result screen prints "<label>, <instrument>", so that read
         * as "Sleep, Sleep severity". */
        instrument: "Insomnia severity",
        profile: "sleep-severity",
      },
    ],
    headline: "sleep-total",
    recommends: {
      "Poor Sleep": ["stress-buster"],
      "Very Poor Sleep": ["stress-buster", "unburn"],
    },
  },
  {
    id: "asm_1767130043662_wc4qpivfl",
    slug: "struggling-to-balance-life",
    category: "balance",
    name: "Balance",
    title: "Struggling to balance life",
    instrument: "Workplace strain",
    minutes: 10,
    scales: {
      A: {
        options: opts("1 Never", "2 Rarely", "3 Sometimes", "4 Often", "5 Very Often")(1),
        prompt: "How often is this true for you?",
      },
    },
    questions: [
      q("balance-q1", "Conditions at work are unpleasant or sometimes even unsafe.", "A", [
        "balance-total",
      ]),
      q(
        "balance-q2",
        "I feel that my job is negatively affecting my physical or emotional well-being.",
        "A",
        ["balance-total"],
      ),
      q("balance-q3", "I have too much work to do an/or too many unreasonable deadlines.", "A", [
        "balance-total",
      ]),
      q(
        "balance-q4",
        "I find it difficult to express my opinions or feelings about my job conditions to my superiors.",
        "A",
        ["balance-total"],
      ),
      q("balance-q5", "I feel that job pressures interfere with my family or personal life.", "A", [
        "balance-total",
      ]),
      q("balance-q6", "I feel that I have inadequate control or input over my work duties.", "A", [
        "balance-total",
      ]),
      q("balance-q7", "I receive inadequate recognition or rewards for good performance.", "A", [
        "balance-total",
      ]),
      q("balance-q8", "I am unable to fully utilize my skills and talents at work.", "A", [
        "balance-total",
      ]),
    ],
    scores: [
      {
        id: "balance-total",
        label: "Work strain",
        instrument: "Workplace strain",
        profile: "balance-severity",
      },
    ],
    headline: "balance-total",
    recommends: {
      "Fairly Low": ["productivity-reset", "stress-buster"],
      Moderate: ["stress-buster", "productivity-reset"],
      Severe: ["stress-buster"],
      "Potentially Dangerous": ["stress-buster"],
    },
  },
  {
    id: "asm_1767129964930_bv8cqgm16",
    slug: "feeling-drained-and-burned-out",
    category: "burnout",
    name: "Burnout",
    title: "Feeling drained and burned out",
    instrument: "BAT-23 (Burnout Assessment Tool)",
    minutes: 10,
    scales: {
      A: {
        options: opts("1 - Never", "2 - Rarely", "3 - Sometimes", "4 - Often", "5 - Always")(1),
        prompt: "How often does this apply to you?",
      },
    },
    questions: [
      ...[
        "At work, I feel mentally exhausted",
        "Everything I do at work requires a great deal of effort",
        "After a day at work, I find it hard to recover my energy",
        "At work, I feel physically exhausted",
        "When I get up in the morning, I lack the energy to start a new day at work",
        "I want to be active at work, but somehow I am unable to manage",
        "When I exert myself at work, I quickly get tired",
        "At the end of my working day, I feel mentally exhausted and drained",
      ].map((t, i) => q(`burnout-q${i + 1}`, t, "A", ["bat-exhaustion", "bat-overall"])),
      ...[
        "I struggle to find any enthusiasm for my work",
        "At work, I do not think much about what I am doing, and I function on autopilot",
        "I feel a strong aversion towards my job",
        "I feel indifferent about my job",
        "I’m cynical about what my work means to others",
      ].map((t, i) => q(`burnout-q${i + 9}`, t, "A", ["bat-mental-distance", "bat-overall"])),
      ...[
        "At work, I have trouble staying focused",
        "At work I struggle to think clearly",
        "I’m forgetful and distracted at work",
        "When I’m working, I have trouble concentrating",
        "I make mistakes in my work because I have my mind on other things",
      ].map((t, i) => q(`burnout-q${i + 14}`, t, "A", ["bat-cognitive", "bat-overall"])),
      ...[
        "At work, I feel unable to control my emotions",
        "I do not recognize myself in the way I react emotionally at work",
        "During my work I become irritable when things don’t go my way",
        "I get upset or sad at work without knowing why",
        "At work I may overreact unintentionally",
      ].map((t, i) => q(`burnout-q${i + 19}`, t, "A", ["bat-emotional", "bat-overall"])),
    ],
    scores: [
      { id: "bat-overall", label: "Overall burnout", instrument: "BAT-23", profile: "bat-mean" },
      { id: "bat-exhaustion", label: "Exhaustion", instrument: "BAT", profile: "bat-mean" },
      {
        id: "bat-mental-distance",
        label: "Mental distance",
        instrument: "BAT",
        profile: "bat-mean",
      },
      {
        id: "bat-cognitive",
        label: "Cognitive impairment",
        instrument: "BAT",
        profile: "bat-mean",
      },
      {
        id: "bat-emotional",
        label: "Emotional impairment",
        instrument: "BAT",
        profile: "bat-mean",
      },
    ],
    headline: "bat-overall",
    recommends: {
      Normal: ["stress-buster", "productivity-reset"],
      High: ["unburn", "sleep-tight", "stress-buster"],
    },
  },
  {
    id: "asm_1767129718791_zj1t8hx3c",
    slug: "unsure-or-general-concern",
    category: "general",
    name: "General",
    title: "Unsure or general concern",
    instrument: "Five short instruments in one: GAD-2, PHQ-2, WHO-5, NGSE, BRS",
    minutes: 3,
    scales: {
      A: { options: frequency, prompt: twoWeeks },
      B: {
        options: opts(
          "1 At no time",
          "2 Some of the time",
          "3 Less than half the time",
          "4 More than half the time",
          "5 Most of the time",
          "6 All of the time",
        )(0),
        prompt: "Over the last 2 weeks…",
      },
      C: {
        options: opts(
          "1 Strongly disagree",
          "2 Disagree",
          "3 Neither agree nor disagree",
          "4 Agree",
          "5 Strongly agree",
        )(1),
        prompt: "How much do you agree?",
      },
      D: {
        options: opts(
          "1 Strongly disagree",
          "2 Disagree",
          "3 Neutral",
          "4 Agree",
          "5 Strongly agree",
        )(1),
        prompt: "How much do you agree?",
      },
    },
    questions: [
      q("general-q1", "Feeling nervous, anxious or on edge", "A", ["gen-anxiety"]),
      q("general-q2", "Not being able to stop or control worrying", "A", ["gen-anxiety"]),
      q("general-q3", "Little interest or pleasure in doing things", "A", ["gen-depression"]),
      q("general-q4", "Feeling down, depressed, or hopeless", "A", ["gen-depression"]),
      q(
        "general-q5",
        "Thoughts that you would be better off dead or of hurting yourself in some way",
        "A",
        [],
        { risk: true },
      ),
      q("general-q6", "I have felt cheerful in good spirits.", "B", ["gen-wellbeing"]),
      q("general-q7", "I have felt calm and relaxed.", "B", ["gen-wellbeing"]),
      q("general-q8", "I have felt active and vigorous", "B", ["gen-wellbeing"]),
      q("general-q9", "I woke up feeling fresh and rested", "B", ["gen-wellbeing"]),
      q("general-q10", "My daily life has been filled with things that interest me", "B", [
        "gen-wellbeing",
      ]),
      q("general-q11", "I am able to achieve most of the goals that I have set for myself.", "C", [
        "gen-self-efficacy",
      ]),
      q(
        "general-q12",
        "When facing difficult tasks, I am certain that I will accomplish them.",
        "C",
        ["gen-self-efficacy"],
      ),
      q(
        "general-q13",
        "In general, I think that I can obtain outcomes that are important to me.",
        "C",
        ["gen-self-efficacy"],
      ),
      q(
        "general-q14",
        "I believe I can succeed at almost any endeavour to which I set my mind.",
        "C",
        ["gen-self-efficacy"],
      ),
      q("general-q15", "I will be able to successfully overcome many challenges.", "C", [
        "gen-self-efficacy",
      ]),
      q(
        "general-q16",
        "I am confident that I can perform effectively on many different tasks.",
        "C",
        ["gen-self-efficacy"],
      ),
      q("general-q17", "Compared to other people, I can do most tasks very well.", "C", [
        "gen-self-efficacy",
      ]),
      q("general-q18", "Even when things are tough, I can perform quite well.", "C", [
        "gen-self-efficacy",
      ]),
      q("general-q19", "I tend to bounce back quickly after hard times", "D", ["gen-resilience"]),
      q(
        "general-q20",
        "I have a hard time making it through stressful events",
        "D",
        ["gen-resilience"],
        { reversed: true },
      ),
      q("general-q21", "It does not take me long to recover from a stressful event", "D", [
        "gen-resilience",
      ]),
      q(
        "general-q22",
        "It is hard for me to snap back when something hard happens",
        "D",
        ["gen-resilience"],
        { reversed: true },
      ),
      q("general-q23", "I usually come through difficult times with little trouble", "D", [
        "gen-resilience",
      ]),
      q(
        "general-q24",
        "I tend to take a long time to get over set-backs in my life",
        "D",
        ["gen-resilience"],
        { reversed: true },
      ),
    ],
    scores: [
      { id: "gen-anxiety", label: "Anxiety", instrument: "GAD-2", profile: "gad2-screen" },
      { id: "gen-depression", label: "Depression", instrument: "PHQ-2", profile: "phq2-screen" },
      { id: "gen-wellbeing", label: "Wellbeing", instrument: "WHO-5", profile: "who5" },
      { id: "gen-self-efficacy", label: "Self-efficacy", instrument: "NGSE", profile: "ngse" },
      { id: "gen-resilience", label: "Resilience", instrument: "BRS", profile: "brs" },
    ],
    recommends: {},
  },
];

export const getAssessment = (slug: string) => assessments.find((a) => a.slug === slug);
