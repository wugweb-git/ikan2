export type Tone = "mind" | "calm" | "rest" | "alert";

export type AssessmentOption = { label: string; value: number };

export type AssessmentQuestion = {
  id: string;
  text: string;
  helper?: string;
  options: AssessmentOption[];
};

export type Band = {
  max: number;
  label: string;
  tone: Tone;
  headline: string;
  body: string;
  advice: string[];
  seekHelp?: boolean;
};

export type Assessment = {
  slug: string;
  title: string;
  category: string;
  instrument: string;
  tone: Tone;
  minutes: number;
  blurb: string;
  about: string;
  focus: string[];
  scale: AssessmentOption[];
  questions: AssessmentQuestion[];
  bands: Band[];
};

const FREQ_5: AssessmentOption[] = [
  { label: "Never", value: 0 },
  { label: "Almost never", value: 1 },
  { label: "Sometimes", value: 2 },
  { label: "Fairly often", value: 3 },
  { label: "Very often", value: 4 },
];

const FREQ_4: AssessmentOption[] = [
  { label: "Not at all", value: 0 },
  { label: "Several days", value: 1 },
  { label: "More than half the days", value: 2 },
  { label: "Nearly every day", value: 3 },
];

const AGREE_4: AssessmentOption[] = [
  { label: "Strongly disagree", value: 0 },
  { label: "Disagree", value: 1 },
  { label: "Agree", value: 2 },
  { label: "Strongly agree", value: 3 },
];

const q = (id: string, text: string, options: AssessmentOption[], helper?: string) =>
  ({ id, text, options, helper }) as AssessmentQuestion;

export const assessments: Assessment[] = [
  {
    slug: "feeling-worried-and-stressed",
    title: "Feeling worried and stressed",
    category: "Stress",
    instrument: "PSS-10 · Perceived Stress Scale",
    tone: "rest",
    minutes: 4,
    blurb: "How unpredictable and overloaded life has felt over the last month.",
    about:
      "The Perceived Stress Scale looks at how often situations in your life have felt uncontrollable or overwhelming in the past month. It is the most widely used psychological instrument for measuring the perception of stress.",
    focus: ["Sense of control", "Coping capacity", "Daily overload"],
    scale: FREQ_5,
    questions: [
      q("s1", "In the last month, how often have you been upset because of something that happened unexpectedly?", FREQ_5),
      q("s2", "How often have you felt unable to control the important things in your life?", FREQ_5),
      q("s3", "How often have you felt nervous and stressed?", FREQ_5),
      q("s4", "How often have you felt confident about handling your personal problems?", FREQ_5, "Reverse scored"),
      q("s5", "How often have you felt that things were going your way?", FREQ_5, "Reverse scored"),
      q("s6", "How often have you found that you could not cope with all the things you had to do?", FREQ_5),
      q("s7", "How often have you been able to control irritations in your life?", FREQ_5, "Reverse scored"),
      q("s8", "How often have you felt that you were on top of things?", FREQ_5, "Reverse scored"),
      q("s9", "How often have you been angered because of things outside of your control?", FREQ_5),
      q("s10", "How often have difficulties piled up so high that you could not overcome them?", FREQ_5),
    ],
    bands: [
      {
        max: 13,
        label: "Low stress",
        tone: "calm",
        headline: "Your load feels manageable right now",
        body: "You are mostly able to absorb the unexpected without it tipping the day over.",
        advice: ["Keep the routines that are working", "A weekly check-in is enough for now"],
      },
      {
        max: 26,
        label: "Moderate stress",
        tone: "rest",
        headline: "Some weeks are running heavier than others",
        body: "Pressure is showing up often enough to shape your mood and energy, but you still have footing.",
        advice: ["Try a 10 minute reset on your heaviest days", "Protect one unscheduled hour this week"],
      },
      {
        max: 40,
        label: "High stress",
        tone: "alert",
        headline: "You are carrying more than one person should",
        body: "Stress is frequent and hard to control. Talking it through with someone trained can make the next step lighter.",
        advice: ["Book a consultation", "Start the Unburn program", "Share this result with someone you trust"],
        seekHelp: true,
      },
    ],
  },
  {
    slug: "feeling-overwhelmed-and-anxious",
    title: "Feeling overwhelmed and anxious",
    category: "Anxiety",
    instrument: "GAD-7 · Generalised Anxiety",
    tone: "mind",
    minutes: 3,
    blurb: "Worry, restlessness and tension across the last two weeks.",
    about:
      "GAD-7 is a seven item screening used in clinics worldwide to gauge the severity of generalised anxiety over the past two weeks.",
    focus: ["Worry", "Restlessness", "Irritability"],
    scale: FREQ_4,
    questions: [
      q("a1", "Over the last 2 weeks, how often have you felt nervous, anxious or on edge?", FREQ_4),
      q("a2", "How often have you been unable to stop or control worrying?", FREQ_4),
      q("a3", "How often have you worried too much about different things?", FREQ_4),
      q("a4", "How often have you had trouble relaxing?", FREQ_4),
      q("a5", "How often have you been so restless that it is hard to sit still?", FREQ_4),
      q("a6", "How often have you become easily annoyed or irritable?", FREQ_4),
      q("a7", "How often have you felt afraid as if something awful might happen?", FREQ_4),
    ],
    bands: [
      { max: 4, label: "Minimal", tone: "calm", headline: "Anxiety is quiet at the moment", body: "Your answers suggest worry is not getting in the way of daily life.", advice: ["Keep checking in monthly"] },
      { max: 9, label: "Mild", tone: "mind", headline: "A low hum of worry", body: "Anxiety shows up on some days without taking over.", advice: ["Try a breathing session before bed", "Note what precedes the tense days"] },
      { max: 14, label: "Moderate", tone: "rest", headline: "Worry is taking up real space", body: "This level of anxiety usually affects sleep, focus and patience.", advice: ["Start a guided program", "Consider speaking with a professional"] },
      { max: 21, label: "Severe", tone: "alert", headline: "Anxiety is running the day", body: "Support from a qualified professional is strongly recommended alongside self help.", advice: ["Book a consultation", "Reach a helpline if you feel unsafe"], seekHelp: true },
    ],
  },
  {
    slug: "feeling-depressed-and-hopeless",
    title: "Feeling depressed and hopeless",
    category: "Mood",
    instrument: "PHQ-9 · Depression screening",
    tone: "alert",
    minutes: 4,
    blurb: "Mood, interest, energy and self-worth over the last two weeks.",
    about:
      "The PHQ-9 maps the nine criteria clinicians use to understand depressive symptoms and their severity.",
    focus: ["Mood", "Interest", "Energy", "Self-worth"],
    scale: FREQ_4,
    questions: [
      q("d1", "Little interest or pleasure in doing things", FREQ_4),
      q("d2", "Feeling down, depressed or hopeless", FREQ_4),
      q("d3", "Trouble falling asleep, staying asleep, or sleeping too much", FREQ_4),
      q("d4", "Feeling tired or having little energy", FREQ_4),
      q("d5", "Poor appetite or overeating", FREQ_4),
      q("d6", "Feeling bad about yourself, or that you have let people down", FREQ_4),
      q("d7", "Trouble concentrating on things like reading or watching television", FREQ_4),
      q("d8", "Moving or speaking noticeably slowly, or being fidgety and restless", FREQ_4),
      q("d9", "Thoughts that you would be better off dead, or of hurting yourself", FREQ_4),
    ],
    bands: [
      { max: 4, label: "Minimal", tone: "calm", headline: "Mood looks steady", body: "Few depressive symptoms came through in your answers.", advice: ["Keep your routine and check in monthly"] },
      { max: 9, label: "Mild", tone: "mind", headline: "Some heaviness in the last two weeks", body: "Low mood is present but not constant.", advice: ["Move daily, even briefly", "Track mood for two weeks"] },
      { max: 14, label: "Moderate", tone: "rest", headline: "Low mood is affecting daily life", body: "This is a good point to add structured support to self help.", advice: ["Book a consultation", "Start a mood program"] },
      { max: 27, label: "Moderately severe to severe", tone: "alert", headline: "Please do not carry this alone", body: "Your answers suggest significant depressive symptoms. Speaking with a professional is strongly recommended.", advice: ["Book a consultation today", "Call a helpline if you have thoughts of harming yourself"], seekHelp: true },
    ],
  },
  {
    slug: "struggling-with-quality-sleep",
    title: "Struggling with quality sleep",
    category: "Sleep",
    instrument: "Insomnia severity index",
    tone: "calm",
    minutes: 3,
    blurb: "How well you fall asleep, stay asleep and wake up.",
    about:
      "A short index of sleep onset, maintenance, satisfaction and the daytime cost of poor nights over the last two weeks.",
    focus: ["Falling asleep", "Staying asleep", "Daytime energy"],
    scale: [
      { label: "None", value: 0 },
      { label: "Mild", value: 1 },
      { label: "Moderate", value: 2 },
      { label: "Severe", value: 3 },
      { label: "Very severe", value: 4 },
    ],
    questions: [
      q("z1", "Difficulty falling asleep", [
        { label: "None", value: 0 }, { label: "Mild", value: 1 }, { label: "Moderate", value: 2 }, { label: "Severe", value: 3 }, { label: "Very severe", value: 4 },
      ]),
      q("z2", "Difficulty staying asleep", [
        { label: "None", value: 0 }, { label: "Mild", value: 1 }, { label: "Moderate", value: 2 }, { label: "Severe", value: 3 }, { label: "Very severe", value: 4 },
      ]),
      q("z3", "Waking up too early", [
        { label: "None", value: 0 }, { label: "Mild", value: 1 }, { label: "Moderate", value: 2 }, { label: "Severe", value: 3 }, { label: "Very severe", value: 4 },
      ]),
      q("z4", "How satisfied are you with your current sleep pattern?", [
        { label: "Very satisfied", value: 0 }, { label: "Satisfied", value: 1 }, { label: "Neutral", value: 2 }, { label: "Dissatisfied", value: 3 }, { label: "Very dissatisfied", value: 4 },
      ]),
      q("z5", "How noticeable to others is your sleep problem?", [
        { label: "Not at all", value: 0 }, { label: "A little", value: 1 }, { label: "Somewhat", value: 2 }, { label: "Much", value: 3 }, { label: "Very much", value: 4 },
      ]),
      q("z6", "How worried are you about your current sleep problem?", [
        { label: "Not at all", value: 0 }, { label: "A little", value: 1 }, { label: "Somewhat", value: 2 }, { label: "Much", value: 3 }, { label: "Very much", value: 4 },
      ]),
      q("z7", "How much does poor sleep interfere with your daily functioning?", [
        { label: "Not at all", value: 0 }, { label: "A little", value: 1 }, { label: "Somewhat", value: 2 }, { label: "Much", value: 3 }, { label: "Very much", value: 4 },
      ]),
    ],
    bands: [
      { max: 7, label: "Sleeping well", tone: "calm", headline: "Nights are working for you", body: "No significant insomnia showed up in your answers.", advice: ["Keep a consistent wake time"] },
      { max: 14, label: "Sub-threshold", tone: "mind", headline: "A few restless nights", body: "Sleep is slipping occasionally and the cost shows during the day.", advice: ["Try a wind-down session", "Keep screens out of the last 45 minutes"] },
      { max: 21, label: "Moderate insomnia", tone: "rest", headline: "Sleep needs attention", body: "Poor nights are frequent enough to shape your mood and focus.", advice: ["Start the sleep program", "Fix a wake time for two weeks"] },
      { max: 28, label: "Severe insomnia", tone: "alert", headline: "Chronic sleep loss", body: "This level of insomnia usually needs guided or clinical support.", advice: ["Book a consultation"], seekHelp: true },
    ],
  },
  {
    slug: "burnt-out-at-work",
    title: "Burnt out at work",
    category: "Burnout",
    instrument: "Exhaustion & detachment scale",
    tone: "rest",
    minutes: 3,
    blurb: "Exhaustion, cynicism and the sense that effort no longer counts.",
    about:
      "A short screening across the three classic dimensions of burnout: emotional exhaustion, detachment from work, and reduced sense of accomplishment.",
    focus: ["Exhaustion", "Detachment", "Accomplishment"],
    scale: FREQ_5,
    questions: [
      q("b1", "I feel emotionally drained by my work", FREQ_5),
      q("b2", "I feel used up at the end of the workday", FREQ_5),
      q("b3", "I have become less interested in my work since I started", FREQ_5),
      q("b4", "I have become more cynical about whether my work matters", FREQ_5),
      q("b5", "I doubt the significance of what I do", FREQ_5),
      q("b6", "I can effectively solve the problems that come up at work", FREQ_5, "Reverse scored"),
      q("b7", "I feel I am making a useful contribution", FREQ_5, "Reverse scored"),
      q("b8", "Getting up for another day at work feels heavy", FREQ_5),
    ],
    bands: [
      { max: 10, label: "Engaged", tone: "calm", headline: "Work is not draining you", body: "You still have energy left at the end of the day.", advice: ["Protect what is working"] },
      { max: 20, label: "Early strain", tone: "mind", headline: "The early signs of strain", body: "Fatigue and detachment are showing up on some days.", advice: ["Take real breaks", "Set one boundary this week"] },
      { max: 32, label: "Burnout risk", tone: "alert", headline: "You are close to burnout", body: "Exhaustion plus detachment is the pattern that precedes burnout.", advice: ["Start the Unburn program", "Book a consultation"], seekHelp: true },
    ],
  },
  {
    slug: "struggling-with-self-worth",
    title: "Struggling with self-worth",
    category: "Self-esteem",
    instrument: "Rosenberg self-esteem scale",
    tone: "mind",
    minutes: 3,
    blurb: "How kindly and fairly you see yourself right now.",
    about:
      "The Rosenberg scale is the most used measure of global self-worth, balancing positive and negative statements about yourself.",
    focus: ["Self-worth", "Self-criticism", "Confidence"],
    scale: AGREE_4,
    questions: [
      q("e1", "On the whole, I am satisfied with myself", AGREE_4, "Reverse scored"),
      q("e2", "At times I think I am no good at all", AGREE_4),
      q("e3", "I feel that I have a number of good qualities", AGREE_4, "Reverse scored"),
      q("e4", "I am able to do things as well as most other people", AGREE_4, "Reverse scored"),
      q("e5", "I feel I do not have much to be proud of", AGREE_4),
      q("e6", "I certainly feel useless at times", AGREE_4),
      q("e7", "I wish I could have more respect for myself", AGREE_4),
      q("e8", "All in all, I am inclined to feel that I am a failure", AGREE_4),
    ],
    bands: [
      { max: 8, label: "Steady", tone: "calm", headline: "You see yourself fairly", body: "Self-criticism is not dominating how you judge yourself.", advice: ["Keep noticing what you do well"] },
      { max: 16, label: "Wavering", tone: "mind", headline: "Your self-view swings with the day", body: "Some days you are on your own side, other days not.", advice: ["Write one honest win each evening"] },
      { max: 24, label: "Low self-worth", tone: "alert", headline: "You are being very hard on yourself", body: "Persistent low self-worth responds well to guided therapeutic work.", advice: ["Book a consultation", "Start a self-compassion program"], seekHelp: true },
    ],
  },
  {
    slug: "trouble-focusing",
    title: "Trouble focusing and following through",
    category: "Focus",
    instrument: "Attention & follow-through screen",
    tone: "calm",
    minutes: 2,
    blurb: "Attention, organisation and finishing what you start.",
    about:
      "A short screening of the attention and task-completion difficulties that most often show up in daily life and work.",
    focus: ["Attention", "Organisation", "Follow-through"],
    scale: FREQ_5,
    questions: [
      q("f1", "How often do you have trouble wrapping up the final details of a project?", FREQ_5),
      q("f2", "How often do you have difficulty getting things in order for a task?", FREQ_5),
      q("f3", "How often do you avoid or delay tasks that need a lot of thought?", FREQ_5),
      q("f4", "How often do you feel restless or fidgety when sitting for long?", FREQ_5),
      q("f5", "How often are you distracted by activity or noise around you?", FREQ_5),
      q("f6", "How often do you misplace or have trouble finding things?", FREQ_5),
    ],
    bands: [
      { max: 8, label: "Focused", tone: "calm", headline: "Attention is holding up well", body: "Everyday focus and follow-through look intact.", advice: ["Keep your current work rhythm"] },
      { max: 16, label: "Some difficulty", tone: "mind", headline: "Focus slips more than you would like", body: "Distraction and unfinished tasks are a recurring theme.", advice: ["Try single-task blocks of 25 minutes"] },
      { max: 24, label: "Significant difficulty", tone: "rest", headline: "Focus is costing you", body: "This level of difficulty is worth discussing with a professional for a proper evaluation.", advice: ["Book a consultation"], seekHelp: true },
    ],
  },
];

export function getAssessment(slug: string) {
  return assessments.find((a) => a.slug === slug);
}

export function maxScore(a: Assessment) {
  return a.questions.reduce((sum, question) => sum + Math.max(...question.options.map((o) => o.value)), 0);
}

export function bandFor(a: Assessment, score: number) {
  return (a.bands.find((b) => score <= b.max) ?? a.bands[a.bands.length - 1])!;
}
