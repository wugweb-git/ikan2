import type { Block, Instrument, Row, StandingEntry, Unit } from "./types";

/* ------------------------------------------------------------------ *
 * Instruments — user-scoped, shared key, schema owned by the instrument
 * ------------------------------------------------------------------ */

const seed = (id: string, values: Record<string, string | boolean | null>): Row =>
  ({ id, seed: true, ...values }) as Row;

export const instruments: Record<string, Instrument> = {
  sleepStatements: {
    key: "sleepStatements",
    name: "Sleep statements",
    type: "option_pool",
  },
  diary: {
    key: "diary",
    name: "Sleep diary",
    type: "record",
    identity: ["night"],
    columns: [
      { key: "night", label: "Night of", type: "text" },
      { key: "in_bed", label: "Time got in bed", type: "time" },
      { key: "struggled", label: "Struggled to fall asleep", type: "bool" },
      { key: "tried", label: "Time tried to sleep", type: "time" },
      { key: "latency", label: "Minutes to fall asleep", type: "text" },
      { key: "awakenings", label: "Number of awakenings", type: "text" },
      { key: "awake", label: "Total minutes awake", type: "text" },
      { key: "woke", label: "Time finally woke", type: "time" },
      { key: "out_of_bed", label: "Time got out of bed", type: "time" },
      {
        key: "quality",
        label: "Sleep quality",
        type: "enum",
        options: ["Very poor", "Poor", "Fair", "Good", "Very good"],
      },
      { key: "interference", label: "Anything that interfered", type: "text" },
    ],
  },
  mood: { key: "mood", name: "Mood log", type: "scale" },
  thoughtRecord: {
    key: "thoughtRecord",
    name: "Thought record",
    type: "record",
    identity: ["time", "situation"],
    columns: [
      { key: "time", label: "Time", type: "text" },
      { key: "situation", label: "Situation", type: "text" },
      { key: "thoughts", label: "Thoughts", type: "text" },
      { key: "feelings", label: "Feelings", type: "text" },
      { key: "response", label: "Response", type: "text" },
      {
        key: "affected_sleep",
        label: "Affected my sleep",
        type: "enum",
        options: ["yes", "no", "NA"],
        revision: 2,
      },
    ],
    seeds: [
      seed("tr-seed-1", {
        time: "9:00 PM",
        situation: "home office setup, a late evening emergency call with the team",
        thoughts: "This is ridiculous! Why do they expect us to work till this hour!",
        feelings: "angry, irritated",
        response: "Worrying about work",
        affected_sleep: "yes",
      }),
      seed("tr-seed-2", {
        time: "7:00 AM",
        situation: "Making tea",
        thoughts: "I did not get enough sleep!",
        feelings: "Tired, worried",
        response: "Making strong tea to get fresh",
        affected_sleep: null,
      }),
    ],
  },
  thoughtDump: {
    key: "thoughtDump",
    name: "Thought dump",
    type: "record",
    retentionHours: 48,
    columns: [{ key: "text", label: "Everything on your mind", type: "text" }],
  },
  distractors: {
    key: "distractors",
    name: "My distractors",
    type: "record",
    identity: ["distractor"],
    columns: [
      { key: "distractor", label: "What disturbs my sleep", type: "text" },
      { key: "in_my_control", label: "In my control", type: "bool", revision: 2 },
    ],
    seeds: [
      seed("ds-seed-1", { distractor: "Scrolling on social media", in_my_control: true }),
      seed("ds-seed-2", { distractor: "Weather", in_my_control: false }),
    ],
  },
  ideation: {
    key: "ideation",
    name: "Ideation",
    type: "nested_record",
    childCap: 10,
    columns: [
      { key: "way", label: "A way", type: "text" },
      { key: "pros", label: "Pros", type: "text", revision: 3 },
      { key: "cons", label: "Cons", type: "text", revision: 3 },
    ],
    seeds: [
      seed("id-seed-1", {
        parent: "Doomscrolling on instagram",
        way: "uninstalling Instagram each night",
        pros: "a major distraction will be reduced",
        cons: "its a unnecessary hassle",
      }),
      seed("id-seed-2", {
        parent: "Doomscrolling on instagram",
        way: "Keeping my phone away",
        pros: "will prevent usage of other distractions as well!",
        cons: "i put my alarms on my phone",
      }),
      seed("id-seed-3", {
        parent: "Doomscrolling on instagram",
        way: "Using low brightness and night mode",
        pros: "will be better on the eyes as bright lights also make going to sleep difficult",
        cons: "the distraction still persists though",
      }),
      seed("id-seed-4", {
        parent: "Doomscrolling on instagram",
        way: "Going off instagram completely",
        pros: "that will be a major distraction reduced and i need to reduce social media usage",
        cons: "sounds a bit extreme. I use it for staying in touch with friends",
      }),
    ],
  },
  ritualOptions: { key: "ritualOptions", name: "Ritual options", type: "option_pool" },
  bedtimeRitual: {
    key: "bedtimeRitual",
    name: "Bedtime ritual",
    type: "record",
    identity: ["step"],
    columns: [
      { key: "step", label: "Ritual step", type: "text" },
      { key: "done", label: "Done tonight", type: "bool", revision: 2 },
    ],
    seeds: [
      seed("br-seed-1", { step: "No caffeine 4 hours before sleep", done: null }),
      seed("br-seed-2", { step: "No exercise 3 hours before sleep", done: null }),
      seed("br-seed-3", { step: "Lights dulled or switched off 30 mins before sleep", done: null }),
      seed("br-seed-4", { step: "No mobile usage 30 minutes before bedtime", done: null }),
    ],
  },
  dailyActivities: {
    key: "dailyActivities",
    name: "Daily activities",
    type: "record",
    identity: ["activity"],
    columns: [
      { key: "activity", label: "Something I do every day", type: "text" },
      { key: "device_possible", label: "Could carry a new habit", type: "bool" },
    ],
  },
  targetHabits: {
    key: "targetHabits",
    name: "Target habits",
    type: "record",
    identity: ["habit"],
    columns: [{ key: "habit", label: "A habit I want", type: "text" }],
  },
  piggyback: {
    key: "piggyback",
    name: "Piggyback pair",
    type: "join",
    identity: ["habit"],
    columns: [
      { key: "habit", label: "New habit", type: "text" },
      { key: "activity", label: "Stacked onto", type: "text" },
    ],
  },
  wakeRitual: {
    key: "wakeRitual",
    name: "Wake ritual",
    type: "record",
    identity: ["step"],
    columns: [
      { key: "step", label: "Wake-time habit", type: "text" },
      { key: "done", label: "Done today", type: "bool" },
    ],
    seeds: [
      seed("wr-seed-1", { step: "No cellphone time for 15 mins after waking", done: null }),
      seed("wr-seed-2", { step: "Standing and stretching", done: null }),
      seed("wr-seed-3", { step: "Washing face", done: null }),
      seed("wr-seed-4", { step: "Getting sunlight or fresh air", done: null }),
      seed("wr-seed-5", { step: "Making bed", done: null }),
      seed("wr-seed-6", { step: "Drink a glass of water", done: null }),
    ],
  },
  successes: {
    key: "successes",
    name: "My successes",
    type: "record",
    identity: ["text"],
    columns: [{ key: "text", label: "Something that went well", type: "text" }],
  },
  energisers: {
    key: "energisers",
    name: "My energisers",
    type: "record",
    identity: ["text"],
    columns: [{ key: "text", label: "Something that lifts me", type: "text" }],
  },
  bedSeparation: {
    key: "bedSeparation",
    name: "Bed separation ideas",
    type: "record",
    identity: ["text"],
    columns: [
      { key: "text", label: "A way to keep the bed for sleep only", type: "text" },
      { key: "room", label: "Works in my room", type: "bool", revision: 2 },
    ],
    seeds: [seed("bs-seed-1", { text: "I can use 2 completely different sheets", room: null })],
  },
  adherence: {
    key: "adherence",
    name: "Habit adherence",
    type: "record",
    identity: ["habit"],
    columns: [
      { key: "habit", label: "Habit", type: "text" },
      { key: "mon", label: "Mon", type: "bool" },
      { key: "tue", label: "Tue", type: "bool" },
      { key: "wed", label: "Wed", type: "bool" },
      { key: "thu", label: "Thu", type: "bool" },
      { key: "fri", label: "Fri", type: "bool" },
      { key: "sat", label: "Sat", type: "bool" },
      { key: "sun", label: "Sun", type: "bool" },
    ],
    seeds: [
      seed("ad-1", { habit: "Sleep hygiene", startsOn: "mon" }),
      seed("ad-2", { habit: "Bedtime ritual", startsOn: "mon" }),
      seed("ad-3", { habit: "Journalling", startsOn: "mon" }),
      seed("ad-4", { habit: "Wake-up ritual", startsOn: "thu" }),
    ],
  },
};

/* ------------------------------------------------------------------ *
 * Standing set — collected every sitting once introduced
 * ------------------------------------------------------------------ */

export const standingSet: StandingEntry[] = [
  { instrument: "diary", from: 2 },
  { instrument: "mood", from: 2 },
  { instrument: "thoughtRecord", from: 4 },
  { instrument: "thoughtDump", from: 6 },
  { instrument: "bedtimeRitual", from: 12 },
  { instrument: "wakeRitual", from: 21 },
];

export function standingBlocks(unit: number): Block[] {
  return standingSet
    .filter((entry) => entry.from <= unit)
    .map((entry): Block => {
      if (entry.instrument === "mood") {
        return { kind: "scale", id: `st-mood-${unit}`, beat: "work", instrument: "mood", title: "How rested do you feel?" };
      }
      if (entry.instrument === "diary") {
        return { kind: "diary", id: `st-diary-${unit}`, beat: "work", title: "Last night" };
      }
      if (entry.instrument === "thoughtDump") {
        return {
          kind: "timed",
          id: `st-dump-${unit}`,
          beat: "work",
          instrument: "thoughtDump",
          title: "Thought dump",
          seconds: 300,
          retentionNote: "Deleted after 48 hours. You never have to read it again.",
        };
      }
      return {
        kind: "record",
        id: `st-${entry.instrument}-${unit}`,
        beat: "work",
        instrument: entry.instrument,
        mode: "collect",
        title: instruments[entry.instrument].name,
      };
    });
}

/* ------------------------------------------------------------------ *
 * Content
 * ------------------------------------------------------------------ */

export const sleepStatementOptions = [
  { glyph: "🍉", label: "My mind replays every mistake I've made" },
  { glyph: "📞", label: "I feel my loneliness during the night" },
  { glyph: "😊", label: "I wake up refreshed and ready for the day" },
  { glyph: "💭", label: "My dreams were vivid, and I woke up with a smile" },
  { glyph: "💤", label: "Last night's sleep was soothing and uninterrupted" },
  { glyph: "🤸", label: "I struggle to fall asleep, tossing and turning" },
  { glyph: "😨", label: "Worries keep my mind active" },
  { glyph: "🕜", label: "Ticking of the clock irritates me as I lie awake" },
  { glyph: "💢", label: "I woke up groggy and in a foul mood" },
  { glyph: "🔋", label: "I am well rested and full of energy" },
  { glyph: "😪", label: "I am still so tired" },
  { glyph: "😩", label: "Why can't I ever fall asleep?" },
  { glyph: "🫂", label: "My body thanks me." },
  { glyph: "💪", label: "I'm ready for anything." },
];

export const ritualOptions = [
  "Drinking turmeric milk",
  "Skincare",
  "Reading a book",
  "Meditation",
  "Praying",
  "Listening to music",
  "Oiling your hair",
  "Washing your feet",
  "Dimming the lights",
  "Putting on an incense stick",
  "Journalling",
  "Taking a bath",
  "Massaging your hands and feet",
].map((label) => ({ label }));

export const distractorDrillOptions = [
  "Room is too hot",
  "The pillow is too hard",
  "The room is too bright",
  "I overate during dinner",
  "I had a coffee right before going to bed",
  "The light is on",
  "Too many thoughts in my mind",
  "The mattress is nice and comfortable",
  "The bedsheet is nice and soft",
  "Dogs are barking on the street outside",
].map((label) => ({ label }));

export const brainstormRules = [
  "There are no right or wrong ideas",
  "Do not be critical of any idea while writing",
  "Write down every idea. Be as visual as possible",
  "Build down on another idea",
  "Stay focussed on the topic",
  "Abide by the time limit",
];

const thoughtFeelingDrill = [
  {
    prompt: "Tell me about the issue of power cuts in your city…",
    question: "Which of these is the thought?",
    choices: [
      "It makes me furious!",
      "It makes things really inconvenient and difficult for a lot of us.",
    ],
    reveal: "It makes things really inconvenient and difficult for a lot of us.",
  },
  {
    prompt: "Tell me about your schooldays…",
    question: "Which of these is the thought?",
    choices: [
      "I had such a good time there with my friends. I miss those days!",
      "It makes me nostalgic.",
    ],
  },
  {
    prompt: "Tell me about the last cricket match you watched…",
    question: "Which of these is the thought?",
    choices: [
      "I was so excited and happy that our team won!",
      "We won the tournament after a really long time. The spinners played really well!",
    ],
  },
  {
    prompt: "A friend of yours finally bagged their dream job…",
    question: "Which of these is the thought?",
    choices: [
      "It is so great! They had worked so hard for this job. I am sure they will excel and thrive in the role.",
      "I am so happy for them!",
    ],
  },
  {
    prompt: "Tell me about the time when you gave a presentation in front of your class",
    question: "Which of these is the thought?",
    choices: [
      "I am definitely going to mess this up. I wish I had worked on my presentation instead of playing counterstrike with my friends",
      "I am so scared and nervous",
    ],
  },
  {
    prompt: "Tell me about the time when you went to a relative's wedding reception",
    question: "Which of these is the thought?",
    choices: [
      "Why is everyone teasing me about getting married? I am so not ready for this.",
      "This is getting really annoying now.",
    ],
  },
];

const journalDrill = [
  {
    prompt: "Which of these counts as a journal entry?",
    question: "Pick the one that works.",
    choices: [
      "Today was one of those days—the kind that leaves you drained, questioning your choices…",
      "Today was relentless—a missed alarm, chaotic commute, and a malfunctioning coffee machine…",
      "Today was bad. Everything was bad. I hope tomorrow will be good",
      "I had a great day today! I am so excited for tomorrow!",
    ],
  },
];

/* ------------------------------------------------------------------ *
 * Front matter — preserved verbatim from the source
 * ------------------------------------------------------------------ */

export const programCard = {
  key: "sleep-tight",
  name: "Equip : Sleep Tight",
  tagline: "Natural, skill-based sleep. No pills.",
  about:
    "Having trouble sleeping? I-Kan's Sleep Tight module is here. We know quality sleep is essential for your well-being. Over the next 18 days, we'll work together to address your sleep troubles and help you achieve restful nights, improving your health, focus, and mood.",
  expect:
    "We're tackling sleep in two steps. First, you'll work with cool tricks for better sleep and calming your mind. Then, we'll build a personalized sleep schedule and practice those techniques. Think of it like training your brain for sleep, just like those meds do, but naturally. We're ditching the pills and going for good habits!",
  who:
    "Ready to ditch sleepless nights? Adults aiming for better sleep, join us! If you're managing other mental health stuff, just check with your doc first.",
  notes: [
    "This is an 18 day programme. As much as we would have liked to make it self-paced, we would suggest you give some time to the activities daily, before going to bed or after waking up. Consistency is the key here.",
    "IKan Equip is a self help tool which is all about developing skills to deal with distresses. We do not claim to cure mental health distress.",
    "In case you do feel overwhelmed with your distresses, we would strongly suggest you speak with a mental health professional.",
  ],
};

export const intakeQuestions = [
  { key: "name", label: "Let's get to know each other, tell us your name.", prefilled: "Ravi Menon" },
  { key: "phone", label: "What number can we call you on? We promise to not spam you.", prefilled: "+91 98xxx xxx21" },
  { key: "email", label: "What's your email id? We'll keep our word and won't spam you.", prefilled: "ravi@example.com" },
  { key: "gender", label: "Tell us your gender.", options: ["Woman", "Man", "Non-binary", "I'd prefer not to answer"] },
  { key: "born", label: "When were you born?", type: "date" as const },
  {
    key: "work",
    label: "What do you do for a living?",
    options: ["Employed", "Self-employed", "Homemaker", "Between jobs", "Student", "Retired"],
  },
  {
    key: "therapy",
    label: "Have you ever taken therapy before?",
    options: ["Yes", "No", "I'd prefer not to answer"],
    followUp: { on: "Yes", label: "If yes, what for?" },
  },
  {
    key: "conditions",
    label: "Do you have any pre-existing conditions?",
    options: ["Yes", "No", "I'd prefer not to answer"],
    followUp: { on: "Yes", label: "If yes, what?" },
  },
];

/* ------------------------------------------------------------------ *
 * The spine
 * ------------------------------------------------------------------ */

const close = (n: number, line: string): Block => ({ kind: "close", id: `u${n}-close`, beat: "close", line });

export const units: Unit[] = [
  {
    n: 0,
    title: "Welcome to Sleep Tight",
    component: "Front matter",
    minutes: 10,
    blocks: [
      {
        kind: "teach",
        id: "u0-teach",
        beat: "teach",
        title: "Before we begin",
        body: [programCard.about, programCard.expect],
        image: true,
      },
      {
        kind: "teach",
        id: "u0-notes",
        beat: "teach",
        title: "Things to note",
        bullets: programCard.notes,
      },
      close(0, "Let's start by hearing how your nights actually go."),
    ],
  },
  {
    n: 1,
    title: "Let's Begin",
    component: "Elicit",
    minutes: 10,
    blocks: [
      {
        kind: "pool",
        id: "u1-pool",
        beat: "work",
        instrument: "sleepStatements",
        title: "Which of these sound like you?",
        note: "Pick as many as fit. There is nothing to get right here.",
        options: sleepStatementOptions,
        allowOther: true,
      },
      close(1, "Thanks for the insights on your sleep! We shall meet tomorrow and explore more."),
    ],
  },
  {
    n: 2,
    title: "Your sleep, measured",
    component: "Sleep Diary · prep",
    minutes: 15,
    blocks: [
      {
        kind: "teach",
        id: "u2-teach",
        beat: "teach",
        title: "The sleep diary",
        body: [
          "From here on, each sitting starts with one short entry about the night before. It takes a minute.",
          "The diary is the instrument the rest of the programme reads from. Nothing in it is graded, and a night you miss simply carries no row.",
        ],
      },
      { kind: "diary", id: "u2-diary", beat: "work", title: "Your first entry" },
      { kind: "scale", id: "u2-mood", beat: "work", instrument: "mood", title: "How rested do you feel?" },
      close(2, "That's one night recorded. Next we read what your own nights are saying."),
    ],
  },
  {
    n: 3,
    title: "Reading your own nights",
    component: "Sleep Diary",
    minutes: 15,
    needsClinicalCall: true,
    blocks: [
      {
        kind: "teach",
        id: "u3-teach",
        beat: "teach",
        title: "Sleep window and efficiency",
        body: [
          "Your sleep window is the time between getting into bed and getting out of it. Your time asleep is that window minus the time you spent awake inside it.",
          "Sleep efficiency is time asleep as a share of the window. It is a description, not a target — we are only learning to read it.",
        ],
      },
      { kind: "summarise", id: "u3-sum", beat: "work", instrument: "diary", title: "What your entries show" },
      ...standingBlocks(3),
      close(3, "Now we turn to the thoughts that keep the lights on."),
    ],
  },
  {
    n: 4,
    title: "Thoughts and feelings",
    component: "Thoughts · prep",
    minutes: 50,
    blocks: [
      {
        kind: "teach",
        id: "u4-teach",
        beat: "teach",
        title: "A thought is a sentence. A feeling is a word.",
        body: [
          "Thoughts and feelings arrive together and get mistaken for each other. Telling them apart is the single distinction the next few sittings rest on.",
          "A feeling can usually be named in one word. A thought is something you could write as a sentence about the world.",
        ],
      },
      {
        kind: "drill",
        id: "u4-drill",
        beat: "rehearse",
        title: "Thought or feeling?",
        note: "Nothing here is scored. The first one is answered for you.",
        items: thoughtFeelingDrill,
      },
      {
        kind: "record",
        id: "u4-record",
        beat: "work",
        instrument: "thoughtRecord",
        mode: "collect",
        title: "Your thought record",
        note: "The grey rows are ours, as an example. Add your own below them.",
        fields: ["time", "situation", "thoughts", "feelings", "response"],
      },
      ...standingBlocks(4).filter((b) => b.kind !== "record" || b.instrument !== "thoughtRecord"),
      close(
        4,
        "That's all for today. Now let's get to work by tracking our thoughts and feelings. We will meet tomorrow and find out what's stopping us from sleeping well.",
      ),
    ],
  },
  {
    n: 5,
    title: "Digging deeper",
    component: "Thoughts",
    minutes: 30,
    blocks: [
      {
        kind: "record",
        id: "u5-extend",
        beat: "work",
        instrument: "thoughtRecord",
        mode: "extend",
        title: "Did this affect your sleep?",
        note: "Go back over what you wrote and answer one new question on each row.",
        fields: ["affected_sleep"],
      },
      ...standingBlocks(5).filter((b) => b.kind !== "record" || b.instrument !== "thoughtRecord"),
      close(
        5,
        "So today was short, sweet but extremely vital. When you selected a thought as yes, you were able to triangulate the things that affected your sleep. Tomorrow onwards, we will work on ways to manage those thoughts.",
      ),
    ],
  },
  {
    n: 6,
    title: "Journalling to clear the mind",
    component: "Thoughts",
    minutes: 30,
    blocks: [
      {
        kind: "teach",
        id: "u6-teach",
        beat: "teach",
        title: "Put it down so it stops circling",
        body: [
          "A thought dump is not a diary. You write everything on your mind for a set few minutes and then you stop.",
          "Once you are done, you need not visit your writings.",
        ],
      },
      {
        kind: "drill",
        id: "u6-drill",
        beat: "rehearse",
        title: "What counts as an entry?",
        note: "Every one of these works. That is the point.",
        items: journalDrill,
      },
      {
        kind: "timed",
        id: "u6-dump",
        beat: "work",
        instrument: "thoughtDump",
        title: "Five minutes, everything on your mind",
        seconds: 300,
        retentionNote: "Deleted after 48 hours. You never have to read it again.",
      },
      ...standingBlocks(6).filter((b) => b.kind !== "timed"),
      close(6, "So! How did you like the task? When we meet next, we will work on understanding other factors that keep us awake."),
    ],
  },
  {
    n: 7,
    title: "What the record is telling you",
    component: "Thoughts",
    minutes: 20,
    blocks: [
      {
        kind: "record",
        id: "u7-review",
        beat: "work",
        instrument: "thoughtRecord",
        mode: "review",
        title: "Everything you have recorded",
        note: "Read only. Look for what repeats.",
      },
      ...standingBlocks(7).filter((b) => b.kind !== "record" || b.instrument !== "thoughtRecord"),
      close(7, "Thoughts are one factor. Next we look at everything else in the room."),
    ],
  },
  {
    n: 8,
    title: "Distractions and control",
    component: "Stimulus Control · prep",
    minutes: 30,
    blocks: [
      {
        kind: "teach",
        id: "u8-teach",
        beat: "teach",
        title: "Inside and outside your control",
        body: [
          "Some things that disturb your sleep you can change tonight. Others you cannot, and trying is its own kind of wakefulness.",
          "Sorting them is the work. Only the first group is worth solving.",
        ],
      },
      {
        kind: "drill",
        id: "u8-drill",
        beat: "rehearse",
        title: "Which of these would disturb sleep?",
        note: "Not all of them do. Choose carefully.",
        items: [
          {
            prompt: "A night in a room like this one",
            question: "Pick everything that would disturb sleep.",
            choices: distractorDrillOptions.map((o) => o.label),
          },
        ],
      },
      {
        kind: "record",
        id: "u8-record",
        beat: "work",
        instrument: "distractors",
        mode: "collect",
        title: "What disturbs your sleep",
        fields: ["distractor"],
      },
      {
        kind: "record",
        id: "u8-extend",
        beat: "work",
        instrument: "distractors",
        mode: "extend",
        title: "Now sort them",
        note: "Which of these are in your control?",
        fields: ["in_my_control"],
      },
      ...standingBlocks(8),
      close(8, "Great! We have identified things that damage our sleep quality. Tomorrow, we will work on ways to reduce these distractors."),
    ],
  },
  {
    n: 9,
    title: "Ideation",
    component: "Problem solving",
    minutes: 30,
    blocks: [
      {
        kind: "teach",
        id: "u9-teach",
        beat: "teach",
        title: "Rules for brainstorming",
        bullets: brainstormRules,
        body: ["Are you ready to start brainstorming?"],
      },
      {
        kind: "nested",
        id: "u9-ideate",
        beat: "work",
        instrument: "ideation",
        mode: "collect",
        title: "Ways around each disturbance",
        note: "Three minutes. No judging anything you write.",
        evaluationAllowed: false,
        timeBoxSeconds: 180,
      },
      ...standingBlocks(9),
      close(9, "Keep your creative juices running! We have one more day to go."),
    ],
  },
  {
    n: 10,
    title: "Ideation, continued",
    component: "Problem solving",
    minutes: 30,
    blocks: [
      {
        kind: "nested",
        id: "u10-ideate",
        beat: "work",
        instrument: "ideation",
        mode: "collect",
        title: "More ways",
        note: "Same rules. Still no judging.",
        evaluationAllowed: false,
        timeBoxSeconds: 180,
      },
      ...standingBlocks(10),
      close(10, "Phew! Those were A LOT of ideas! Now take some rest. We will work tomorrow to come up with a more practical and doable solution."),
    ],
  },
  {
    n: 11,
    title: "Part of the solution",
    component: "Problem solving",
    minutes: 30,
    blocks: [
      {
        kind: "nested",
        id: "u11-converge",
        beat: "work",
        instrument: "ideation",
        mode: "extend",
        title: "Weigh each way",
        note: "Now you may judge. Add pros and cons, then one balanced solution per disturbance.",
        evaluationAllowed: true,
      },
      ...standingBlocks(11),
      close(11, "Now that you have developed skills to clear your mind and think through the options, let's move on to how bedtime rituals help with sleep."),
    ],
  },
  {
    n: 12,
    title: "Bedtime rituals",
    component: "Sleep Habits · prep + Relaxation",
    minutes: 30,
    blocks: [
      {
        kind: "teach",
        id: "u12-teach",
        beat: "teach",
        title: "A ritual tells your body what comes next",
        body: [
          "Sleep is not a switch. A short, repeated sequence before bed is how the body learns that sleep is coming.",
          "Pick what suits your evening. The point is the repetition, not the contents.",
        ],
      },
      {
        kind: "pool",
        id: "u12-pool",
        beat: "work",
        instrument: "ritualOptions",
        title: "What could be part of yours?",
        options: ritualOptions,
        allowOther: true,
      },
      {
        kind: "record",
        id: "u12-ritual",
        beat: "work",
        instrument: "bedtimeRitual",
        mode: "collect",
        title: "My bedtime ritual",
        note: "The grey rows are some essential points from our end to ensure good sleep quality.",
        fields: ["step"],
      },
      ...standingBlocks(12).filter((b) => b.kind !== "record" || b.instrument !== "bedtimeRitual"),
      close(12, "Now that we have been able to develop a sleep ritual for ourselves, let's give them a try."),
    ],
  },
  {
    n: 13,
    title: "Forming habits — piggybacking",
    component: "Sleep Habits",
    minutes: 30,
    blocks: [
      {
        kind: "teach",
        id: "u13-teach",
        beat: "teach",
        title: "Stack the new onto the old",
        body: [
          "A new habit sticks when it rides on something you already do without thinking — brushing your teeth, locking the door, putting your phone on charge.",
          "One pair at a time. Continue practicing it for a while and then add another daily habit.",
        ],
      },
      {
        kind: "record",
        id: "u13-activities",
        beat: "work",
        instrument: "dailyActivities",
        mode: "collect",
        title: "Things you already do daily",
      },
      {
        kind: "record",
        id: "u13-targets",
        beat: "work",
        instrument: "targetHabits",
        mode: "collect",
        title: "Habits you want",
      },
      {
        kind: "record",
        id: "u13-pair",
        beat: "work",
        instrument: "piggyback",
        mode: "collect",
        title: "Pair one, and only one",
      },
      ...standingBlocks(13),
      close(13, "Good Job with today! Let's continue it for the next few days..."),
    ],
  },
  {
    n: 14,
    title: "Rituals in action",
    component: "Sleep Habits",
    minutes: 20,
    blocks: [
      ...standingBlocks(14),
      close(14, "Keep running it. The next stretch is practice, and practice is the work."),
    ],
  },
];

const rehearsal = (n: number, component: string, line: string): Unit => ({
  n,
  title: "Practice",
  component,
  minutes: 15,
  rehearsal: true,
  needsClinicalCall: true,
  blocks: [...standingBlocks(n), close(n, line)],
});

for (let n = 15; n <= 20; n += 1) {
  units.push(rehearsal(n, "Sleep Compression", "Same again next sitting. Consistency is doing the work here."));
}

units.push(
  {
    n: 21,
    title: "Leaving sleep",
    component: "Stimulus Control",
    minutes: 30,
    blocks: [
      {
        kind: "teach",
        id: "u21-teach",
        beat: "teach",
        title: "How you leave sleep matters too",
        body: [
          "Waking is a ritual as much as sleeping is. A steady first fifteen minutes sets the whole day, and the day sets the night.",
        ],
      },
      { kind: "record", id: "u21-success", beat: "work", instrument: "successes", mode: "collect", title: "Recent successes" },
      { kind: "record", id: "u21-energy", beat: "work", instrument: "energisers", mode: "collect", title: "What lifts you" },
      {
        kind: "record",
        id: "u21-wake",
        beat: "work",
        instrument: "wakeRitual",
        mode: "collect",
        title: "My wake-up ritual",
        fields: ["step"],
      },
      ...standingBlocks(21).filter((b) => b.kind !== "record" || b.instrument !== "wakeRitual"),
      close(21, "Next, the bed itself."),
    ],
  },
  {
    n: 22,
    title: "Leaving the bed",
    component: "Stimulus Control",
    minutes: 30,
    blocks: [
      {
        kind: "teach",
        id: "u22-teach",
        beat: "teach",
        title: "The bed is a space we keep for sleep only",
        body: [
          "Our bed is a space that we must limit only to our sleep. Working, eating and scrolling in it teach the body that bed means awake.",
          "If your home is small: use different sides of the bed, different sheet textures and colours, a floor cushion with the bed foot as a table, or a desk with the bed as a chair.",
        ],
      },
      {
        kind: "record",
        id: "u22-sep",
        beat: "work",
        instrument: "bedSeparation",
        mode: "collect",
        title: "Ways that could work for you",
        fields: ["text"],
      },
      ...standingBlocks(22),
      close(22, "Next, we make it fit your actual room."),
    ],
  },
  {
    n: 23,
    title: "Your bed, your room",
    component: "Stimulus Control",
    minutes: 25,
    blocks: [
      {
        kind: "record",
        id: "u23-sep",
        beat: "work",
        instrument: "bedSeparation",
        mode: "extend",
        title: "Which of these fit your room?",
        fields: ["room"],
      },
      ...standingBlocks(23),
      close(23, "From here it is practice until the habits hold."),
    ],
  },
);

for (let n = 24; n <= 32; n += 1) {
  units.push(rehearsal(n, "Follow Up", "Keep going. The instruments are yours now."));
}

units.push(
  {
    n: 33,
    title: "How did I do?",
    component: "Follow Up",
    minutes: 25,
    blocks: [
      {
        kind: "record",
        id: "u33-adherence",
        beat: "work",
        instrument: "adherence",
        mode: "extend",
        title: "Your habit grid",
        note: "Seeded from what you logged — confirm rather than re-enter. A habit is measured against the days it has been available, not against seven.",
      },
      { kind: "summarise", id: "u33-sum", beat: "work", instrument: "diary", title: "Your nights over time" },
      close(33, "One last sitting."),
    ],
  },
  {
    n: 34,
    title: "Conclusion",
    component: "Follow Up",
    minutes: 20,
    blocks: [
      {
        kind: "teach",
        id: "u34-teach",
        beat: "teach",
        title: "A graduation of sorts",
        body: [
          "You built a diary, a thought record, a set of solutions and two rituals. They are yours and they do not end with the programme.",
        ],
      },
      {
        kind: "record",
        id: "u34-commit",
        beat: "work",
        instrument: "targetHabits",
        mode: "collect",
        title: "What you commit to keeping",
      },
      close(
        34,
        "Well! This is the end of your programme. Do continue with the trackers and assessments. They are always there at your service! In case you feel that your stress is contributing to your sleeplessness, we would recommend you subscribe to our stressbuster programme.",
      ),
    ],
  },
);

export const unitCount = units.length;

export function getUnit(n: number): Unit | undefined {
  return units.find((u) => u.n === n);
}

/** Contiguous runs of rehearsal units, grouped for the unit list. */
export function unitGroups() {
  const groups: { rehearsal: boolean; units: Unit[] }[] = [];
  for (const unit of units) {
    const last = groups[groups.length - 1];
    if (last && last.rehearsal && unit.rehearsal) last.units.push(unit);
    else groups.push({ rehearsal: Boolean(unit.rehearsal), units: [unit] });
  }
  return groups;
}
