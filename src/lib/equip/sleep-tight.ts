import cover from "@/assets/equip-sleep-tight.jpg";
import type { Day, Field, Programme, Step } from "./types";

/* Source: Notion "Equip Sleep Tight" (sleep-tight · 31 days · beginner). Copy kept as authored,
 * with obvious typos fixed. "Repeat X from day N" notes are expanded into the same steps. */

const diary: Step = { kind: "diary", title: "Sleep diary" };

const welcome = (body: string, title = "Welcome back"): Step => ({
  kind: "lesson",
  title,
  body: [body],
});

const conclude = (line: string, reflect = false): Step =>
  reflect
    ? { kind: "conclude", line, reflectKey: "stood_out", prompt: "Anything that stood out?" }
    : { kind: "conclude", line };

const thoughtFields: Field[] = [
  { key: "time", label: "Time", type: "time" },
  { key: "situation", label: "Situation", type: "text", placeholder: "Meeting got delayed" },
  { key: "thoughts", label: "Thoughts", type: "text", placeholder: "I'm wasting my time" },
  { key: "feelings", label: "Feelings", type: "text", placeholder: "Anxious, annoyed" },
  { key: "response", label: "Response", type: "text", placeholder: "Took a deep breath" },
];

const affectedSleep: Field = {
  key: "affected_sleep",
  label: "Did it affect my sleep?",
  type: "yesno",
};

const tracking: Step = {
  kind: "tracker",
  collection: "habits",
  field: "habit",
  title: "Tracking",
  prompt: "Did you do this today?",
};

const emptyingMind: Step = {
  kind: "entries",
  collection: "mind_dump",
  title: "Emptying the mind",
  prompt: "Pick the date, then write down every thought. No editing. You don't need to reread it.",
  fields: [
    { key: "date", label: "Date", type: "date" },
    { key: "text", label: "What's on your mind", type: "longtext" },
  ],
  timerSeconds: 300,
};

const identifyingDisruptions: Step = {
  kind: "review",
  collection: "thoughts",
  title: "Identifying disruptions",
  prompt: "Did it affect my sleep?",
  fields: [affectedSleep],
  addFields: thoughtFields,
};

const understanding = (
  day: number,
  intro: string,
  line: string,
  introTitle = "Understanding sleep",
): Day => ({
  day,
  title: "Understanding your sleep",
  subtitle: "Observing without fixing",
  steps: [welcome(intro, introTitle), diary, conclude(line, true)],
});

const patterns = (day: number, intro: string, line: string): Day => ({
  day,
  title: "Tracking patterns",
  subtitle: "Noticing patterns",
  steps: [welcome(intro), diary, tracking, conclude(line)],
});

const fullStack = (day: number, intro: string, line: string): Day => ({
  day,
  title: "Rituals in action",
  subtitle: "Noticing patterns",
  steps: [welcome(intro), diary, tracking, emptyingMind, identifyingDisruptions, conclude(line)],
});

const loopLine = "Good job with today! Let's continue it for the next few days.";

export const sleepTight: Programme = {
  slug: "sleep-tight",
  name: "Sleep Tight",
  tagline: "A gentle, guided programme to understand and improve your sleep.",
  description:
    "There's nothing to fix immediately. We'll start by noticing patterns and building consistency, one short sitting a day.",
  level: "Beginner",
  cover,
  notes: [
    "iKAN Equip is a self-help tool for developing skills to deal with distress. It does not claim to cure mental health distress.",
    "If you feel overwhelmed, we strongly suggest speaking with a mental health professional.",
  ],
  units: [
    {
      n: 1,
      title: "Onboarding",
      focus: "Baseline and commitment",
      days: [
        {
          day: 0,
          title: "Welcome to Sleep Tight",
          subtitle: "Onboarding",
          steps: [
            {
              kind: "lesson",
              title: "Welcome to Sleep Tight",
              body: [
                "Sleep impacts mood, focus, immunity, and emotional resilience. Over the next days, we'll gently rebuild your relationship with sleep.",
              ],
            },
            {
              kind: "choice",
              key: "sleep_primary_issue",
              title: "Primary sleep concern",
              prompt: "What troubles your sleep the most right now?",
              options: [
                { label: "Difficulty falling asleep" },
                { label: "Waking up during the night" },
                { label: "Waking too early" },
                { label: "Poor sleep quality" },
                { label: "Irregular sleep schedule" },
              ],
            },
            {
              kind: "scale",
              key: "avg_sleep_hours",
              title: "Sleep duration",
              prompt: "On average, how many hours do you sleep?",
              min: 3,
              max: 9,
              unit: "hours",
            },
            {
              kind: "reflect",
              key: "sleep_feel_note",
              title: "Feeling",
              prompt: "How does this amount of sleep usually feel for you?",
            },
            {
              kind: "choice",
              key: "commitment_ack",
              title: "Commitment",
              prompt: "One small promise before we start.",
              options: [{ label: "I'm willing to try small sleep changes daily" }],
              multi: true,
            },
            conclude("You're all set. Tomorrow we start your sleep diary."),
          ],
        },
      ],
    },
    {
      n: 2,
      title: "Understanding your sleep",
      focus: "Build the diary habit",
      days: [
        understanding(
          1,
          "A sleep diary tracks your patterns, habits, and quality. Think of it like a map you use to figure out the route to a destination. For the next week, filling it in is the whole assignment.",
          "That will be all for today, see you tomorrow.",
        ),
        understanding(
          2,
          "Welcome back. You don't need exact times, close estimates are fine. Let's keep going.",
          "Same time tomorrow.",
          "Welcome back",
        ),
        understanding(
          3,
          "Three days in and the patterns are emerging. Keep it up.",
          "Halfway there. See you tomorrow.",
          "Welcome back",
        ),
        understanding(
          4,
          "No new instructions today, just some plain and simple consistency. That's the actual exercise.",
          "Good. Let's get back tomorrow. Same time.",
          "Welcome back",
        ),
        understanding(
          5,
          "Halfway through the week.",
          "Almost through the week! Thank you.",
          "Welcome back",
        ),
        understanding(
          6,
          "One more after today, then we start using what you've logged.",
          "One left. See you tomorrow.",
          "Welcome back",
        ),
        understanding(
          7,
          "Last day of the plain diary week. Tomorrow we start looking at what it's telling us.",
          "Week one, done. Nice work!",
          "Welcome back",
        ),
      ],
    },
    {
      n: 3,
      title: "Thoughts and feelings",
      focus: "Thought and feeling literacy, thought tracking",
      days: [
        {
          day: 8,
          title: "Thoughts and feelings",
          steps: [
            welcome("Today we start connecting thoughts and feelings to sleep. Sleep diary first."),
            diary,
            {
              kind: "lesson",
              title: "Thoughts and feelings",
              body: [
                "Your thoughts, feelings and emotions have a direct connection with your sleep. Negative thoughts heighten alertness and delay sleep. Calmer thoughts do the opposite.",
                "This is the feedback loop we'll start tracking: your mindset shapes your rest, and your rest shapes tomorrow's mindset.",
              ],
            },
            {
              kind: "choice",
              key: "sleep_mental_mirror",
              title: "Mental mirror",
              prompt: "Which of these felt true this morning?",
              multi: true,
              options: [
                { glyph: "😊", label: "Woke up refreshed" },
                { glyph: "💤", label: "Slept soundly, uninterrupted" },
                { glyph: "🤸", label: "Tossed and turned" },
                { glyph: "😨", label: "Mind was racing with worries" },
                { glyph: "💢", label: "Woke up groggy or in a low mood" },
                { glyph: "🔋", label: "Feel rested and energised" },
                { glyph: "😪", label: "Still feel tired" },
                { glyph: "🫂", label: "Feel good, my body thanks me" },
              ],
            },
            conclude("Thanks for the honesty! Tomorrow we shall go a layer deeper."),
          ],
        },
        {
          day: 9,
          title: "Thoughts and feelings",
          subtitle: "Continued",
          steps: [
            welcome("Sleep diary, then straight into today's topic."),
            diary,
            {
              kind: "lesson",
              title: "A thought is a sentence. A feeling is a word.",
              body: [
                'A thought is a sentence in your head, like "This line is taking forever", whereas a feeling is usually a one-word reaction to that thought, say bored or anxious. Telling them apart helps you see why you reacted the way you did.',
              ],
            },
            {
              kind: "sort",
              title: "Small task",
              prompt:
                "For each situation, one line is a thought and one is a feeling. We've done the first one for you.",
              worked: {
                situation: "Frequent power cuts…",
                lines: [
                  { text: "They make me furious!", answer: "Feeling" },
                  { text: "They make things inconvenient for a lot of us.", answer: "Thought" },
                ],
              },
              items: [
                {
                  situation: "Your schooldays…",
                  lines: [
                    "I had such a good time there with my friends. I miss those days!",
                    "It makes me nostalgic.",
                  ],
                },
                {
                  situation: "The last cricket match you watched…",
                  lines: [
                    "I was so excited and happy that our team won!",
                    "We won the tournament after a really long time. The spinners played really well!",
                  ],
                },
                {
                  situation: "A friend of yours finally bagged their dream job…",
                  lines: [
                    "It is so great! They had worked so hard for this job. I am sure they will excel and thrive in the role.",
                    "I am so happy for them!",
                  ],
                },
                {
                  situation: "When you are about to deliver a presentation to your class",
                  lines: [
                    "I am definitely going to mess this up. I wish I had worked on my presentation instead of playing Counter-Strike with my friends.",
                    "I am so scared and nervous.",
                  ],
                },
                {
                  situation: "The time you went to a relative's wedding reception",
                  lines: [
                    "Why is everyone teasing me about getting married? I am so not ready for this.",
                    "This is getting really annoying now.",
                  ],
                },
              ],
            },
            {
              kind: "lesson",
              title: "Tracking thoughts",
              body: [
                "For the next stretch, jot down what happens about 3 hours before bed and about 1 hour after waking: the situation, the thought, the feeling, and how you responded.",
              ],
              example:
                '9:00 PM, home office setup, a late evening emergency call with the team. "This is ridiculous! Why do they expect us to work till this hour!" Angry, irritated. Kept worrying about work.',
            },
            {
              kind: "entries",
              collection: "thoughts",
              title: "Thought tracking",
              prompt: "Add a card for each moment you noticed.",
              fields: thoughtFields,
              example: {
                time: "10:30",
                situation: "Meeting got delayed",
                thoughts: "I'm wasting my time",
                feelings: "Anxious, annoyed",
                response: "Took a deep breath",
              },
            },
            conclude("Good start. Tomorrow we'll see if any of this actually affects your sleep."),
          ],
        },
        {
          day: 10,
          title: "Thoughts and feelings",
          subtitle: "Digging deeper",
          steps: [
            welcome("Sleep diary first."),
            diary,
            {
              kind: "lesson",
              title: "Digging deeper into thoughts and feelings",
              body: [
                "Look back at yesterday's thought and feeling log. Did any of it, especially thoughts within an hour of waking up, carry over from the night before? That overlap is often the actual sleep disruptor.",
              ],
            },
            identifyingDisruptions,
            conclude(
              "Short one today, but it matters. You now know which thoughts to watch. Tomorrow, we work on managing them.",
            ),
          ],
        },
        {
          day: 11,
          title: "Emptying the mind",
          subtitle: "Digging deeper",
          steps: [
            welcome("Before we proceed, let's fill the sleep diary."),
            diary,
            {
              kind: "lesson",
              title: "A release valve",
              body: [
                "Racing thoughts at night? Journaling may just be your secret weapon. Think of it as a release valve.",
                "Set a 5-minute timer, open a blank page, and write down every thought without any editing. Once the timer's up, you don't need to reread it. The point is emptying, not analysing.",
              ],
            },
            emptyingMind,
            conclude(
              "However that felt, you did it. Tomorrow we'll look at what actually distracts you from sleep.",
            ),
          ],
        },
      ],
    },
    {
      n: 4,
      title: "Distractions and control",
      focus: "Identify, brainstorm and refine solutions",
      days: [
        {
          day: 12,
          title: "Distractions and control",
          subtitle: "Small habits",
          steps: [
            welcome("Welcome back! As always, sleep diary first."),
            diary,
            {
              kind: "lesson",
              title: "Understanding distractions",
              body: [
                "Poor sleep usually comes from two places: trouble falling asleep, or poor quality once you're out. Both are driven by distractions.",
                "Some are within our control, like phone usage, bedtime and racing thoughts. Some are beyond it, like a dog barking, room temperature or a snoring partner.",
              ],
            },
            {
              kind: "choice",
              key: "sleep_lets_check",
              title: "Let's check",
              prompt: "Which of these would apply to you?",
              multi: true,
              other: true,
              options: [
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
              ].map((label) => ({ label })),
            },
            {
              kind: "review",
              collection: "distractors",
              title: "Analysing disruptions",
              prompt:
                "Now let's personalise them. From your own experience, list everything that keeps you up, and mark whether it's in your control.",
              fields: [{ key: "in_control", label: "Was this in my control?", type: "yesno" }],
              seedFrom: { choiceKey: "sleep_lets_check", field: "distractor" },
              addFields: [{ key: "distractor", label: "Thing that kept me up", type: "text" }],
            },
            conclude(
              "Now that we know what to target, we'll brainstorm fixes tomorrow. Stay tuned!",
            ),
          ],
        },
        {
          day: 13,
          title: "Distractions and control",
          subtitle: "Brainstorming",
          steps: [
            welcome("Sleep diary first."),
            diary,
            {
              kind: "lesson",
              title: "Ideation",
              body: [
                'Today is all about brainstorming, not solving. If phone use is the culprit, ideas might range from "keep it in another room" to "download a lock app" to "buy an alarm clock". No idea is too small or too obvious yet.',
              ],
            },
            {
              kind: "lesson",
              title: "Ground rules",
              body: ["Are you ready to start brainstorming?"],
              bullets: [
                "No idea is wrong",
                "Don't critique while writing",
                "Write everything down",
                "Build on your own ideas",
                "Stay on topic",
                "Respect the timer",
              ],
            },
            {
              kind: "lesson",
              title: "Worked example",
              body: ["Quantity over quality for now. We'll refine these later."],
              example:
                "Disturbance: doomscrolling on Instagram. Ideas: uninstall it nightly, keep phone in another room, use night mode, quit the app entirely.",
            },
            {
              kind: "entries",
              collection: "ideas",
              title: "Ideating solutions",
              prompt: "Enter a disturbance, then write every way you can think of to reduce it.",
              fields: [
                {
                  key: "disturbance",
                  label: "Disturbance",
                  type: "text",
                  placeholder: "Doomscrolling on Instagram",
                },
                {
                  key: "ways",
                  label: "Ways to reduce it",
                  type: "longtext",
                  placeholder: "One idea per line",
                },
              ],
            },
            conclude(
              "Keep your creative juices running! Tomorrow we keep going, then start narrowing down.",
            ),
          ],
        },
        {
          day: 14,
          title: "Distractions and control",
          subtitle: "More ideas",
          steps: [
            welcome("Let's continue brainstorming, but sleep diary first."),
            diary,
            {
              kind: "entries",
              collection: "ideas",
              title: "Ideating solutions",
              prompt: "Add new disturbances, or pull up earlier cards and add more ways.",
              fields: [
                {
                  key: "disturbance",
                  label: "Disturbance",
                  type: "text",
                  placeholder: "Doomscrolling on Instagram",
                },
                {
                  key: "ways",
                  label: "Ways to reduce it",
                  type: "longtext",
                  placeholder: "One idea per line",
                },
              ],
            },
            conclude("Take the rest of the day off from this. Tomorrow we turn ideas into a plan."),
          ],
        },
        {
          day: 15,
          title: "Distractions and control",
          subtitle: "Part of the solution",
          steps: [
            welcome("Welcome back! Before we begin, let's fill the sleep diary."),
            diary,
            {
              kind: "lesson",
              title: "Reducing disruptions",
              body: [
                "Not every idea from your brainstorm is realistic. We've pulled in your list so you can weigh the pros and cons of each and land on a balanced solution for every disturbance.",
              ],
              example:
                "Doomscrolling. Uninstall nightly: cuts the biggest distraction, but a hassle. Keep phone away: blocks other distractions too, but my alarm's on my phone. Night mode: easier on the eyes, but doesn't stop the scrolling. Quit entirely: biggest impact, but too extreme. Balanced fix: get a separate alarm clock, keep the phone away from the bed.",
            },
            {
              kind: "review",
              collection: "ideas",
              title: "Reducing disruptions",
              prompt: "Weigh up each card. You can fill the rest in later.",
              fields: [
                { key: "pros", label: "Pros", type: "longtext" },
                { key: "cons", label: "Cons", type: "longtext" },
                { key: "fix", label: "Balanced fix", type: "text" },
              ],
            },
            conclude("You've now got a plan, not just a wish list. Tomorrow: bedtime rituals."),
          ],
        },
      ],
    },
    {
      n: 5,
      title: "Bedtime rituals",
      focus: "Build a ritual, habit-stack it",
      days: [
        {
          day: 16,
          title: "Bedtime rituals",
          subtitle: "Part of the solution",
          steps: [
            welcome("Sleep diary first."),
            diary,
            {
              kind: "lesson",
              title: "Developing rituals",
              body: [
                "A consistent pre-sleep routine tells your nervous system and your body it's time to wind down. It's also a good place to fit in essentials like medication, washing up, or just decompressing after a stressful day.",
              ],
            },
            {
              kind: "choice",
              key: "ritual_options",
              title: "Countdown to better sleep",
              prompt: "What could be part of your wind-down?",
              multi: true,
              other: true,
              options: [
                "Warm drink, like turmeric milk",
                "Skincare",
                "Reading",
                "Meditation or prayer",
                "Music",
                "Dimming the lights",
                "Journaling",
                "A warm bath",
              ].map((label) => ({ label })),
            },
            {
              kind: "lesson",
              title: "Learning to relax",
              body: [
                "From what you picked, choose what you'll actually try tonight. A few non-negotiables help almost everyone:",
              ],
              bullets: [
                "No caffeine within 4 hours of bed",
                "No exercise within 3 hours of bed",
                "Lights dimmed 30 minutes before bed",
                "No phone in the last 30 minutes before bed",
              ],
            },
            {
              kind: "entries",
              collection: "rituals",
              title: "Learning to relax",
              prompt: "List the rituals you think will relax you before bed.",
              fields: [
                {
                  key: "ritual",
                  label: "Ritual",
                  type: "text",
                  placeholder: "Dim the lights at 10:30",
                },
              ],
              limit: 10,
            },
            conclude(
              "Now that we've come up with a list of rituals, we'll work on making it stick from tomorrow.",
            ),
          ],
        },
        {
          day: 17,
          title: "Bedtime rituals",
          subtitle: "Forming habits",
          steps: [
            welcome("First things first, let's fill the sleep diary."),
            diary,
            {
              kind: "lesson",
              title: "Forming habits",
              body: [
                "Knowing the technique isn't the hard part. Following through every day is. Distractions and broken routines get in the way of almost everyone.",
                "We'll take it one small step at a time, starting with a technique called piggybacking.",
              ],
            },
            {
              kind: "entries",
              collection: "activities",
              title: "Your day",
              prompt:
                "List everything you do in a day, start to finish: brushing your teeth, commuting, cooking, filing reports. Even the small stuff counts.",
              fields: [
                {
                  key: "activity",
                  label: "Activity",
                  type: "text",
                  placeholder: "Waiting for the pressure cooker",
                },
              ],
              limit: 10,
            },
            {
              kind: "review",
              collection: "activities",
              title: "My activities",
              prompt:
                "Flag the moments where you're stationary and could have your phone or laptop out. Waiting for the pressure cooker: yes. Taking a bath: no.",
              fields: [
                { key: "device", label: "Can I use a device while doing this?", type: "yesno" },
              ],
            },
            conclude("Good groundwork. Tomorrow we pick one and lock it in."),
          ],
        },
        {
          day: 18,
          title: "Bedtime rituals",
          subtitle: "Shortlisting",
          steps: [
            welcome("Sleep diary first."),
            diary,
            {
              kind: "lesson",
              title: "Shortlisting activities",
              body: [
                "From the activities you mentioned earlier, pick a small piece of the ritual you want to build. You can even pick anything else you've been meaning to start, like reading a chapter of a book before bed.",
              ],
            },
            {
              kind: "entries",
              collection: "habits",
              title: "Habits I want to build",
              prompt: "Add the habits you want to build.",
              fields: [
                {
                  key: "habit",
                  label: "Habit",
                  type: "text",
                  placeholder: "Read a chapter before bed",
                },
              ],
              limit: 10,
            },
            {
              kind: "lesson",
              title: "Habit tracking",
              body: [
                "Pick one thing you already do every day, ideally near the end of it, say clearing the dinner table. For the next week, do your new habit immediately after that anchor activity, with no distractions.",
                "Miss a day? That's alright, just don't miss two in a row.",
              ],
            },
            tracking,
            conclude("Now that we've developed a sleep ritual for ourselves, let's give it a try."),
          ],
        },
      ],
    },
    {
      n: 6,
      title: "Tracking patterns",
      focus: "Consistency stretch",
      days: [
        patterns(
          19,
          "For the next week, all we need is the diary and the habit tracker. No new exercises. Just some good old consistency.",
          "See you tomorrow.",
        ),
        patterns(
          20,
          "Same as yesterday. Quick log, then tick off your habits.",
          "Same time tomorrow.",
        ),
        patterns(21, "A week in on the new ritual. How's it coming along?", "Keep it going."),
        patterns(
          22,
          "Missed a day? No problem, just pick it back up today.",
          "Almost there. Thank you.",
        ),
        patterns(23, "Almost through this stretch.", "Great going, let's get back tomorrow."),
        patterns(24, "One more after today.", "One more to go."),
        patterns(
          25,
          "Last day of this tracking block. Kudos for the consistency.",
          "Nice work this week.",
        ),
      ],
    },
    {
      n: 7,
      title: "Rituals in action",
      focus: "Diary, tracker, thought log and disruption log together",
      days: [
        fullStack(
          26,
          "This is the real test: sticking with everything at once. Diary, habits, thoughts, disruptions. One step at a time.",
          loopLine,
        ),
        fullStack(27, "Keep the full stack going. It gets easier by the day.", loopLine),
        fullStack(28, "You're most of the way through the programme now.", loopLine),
        fullStack(29, "Two days left after today.", loopLine),
        fullStack(
          30,
          "Last full-stack day.",
          "That's the programme. The habits, the diary, the ritual, catching your thoughts before bed, are yours to keep using as often as you need them. Well done for sticking with it.",
        ),
      ],
    },
  ],
};
