export const SCIENCE_GRADE_ORDER = ["g1", "g2", "g3", "g4", "g5", "g6"];

export const SCIENCE_GENERAL_GOALS = [
  "Develop scientific thinking, curiosity, and careful observation.",
  "Build a broad familiarity with living things, plants, materials, Earth, and technology in the student's world.",
  "Introduce basic scientific language and understanding of processes through experiments and recording.",
  "Connect science and technology to solving everyday problems.",
];

export const SCIENCE_GRADES = {
  g1: {
    key: "g1",
    name: "Grade 1",
    stage: "Basic introduction to the natural world",
    topics: ["body", "animals", "plants", "materials", "earth_space", "environment"],
    curriculum: {
      summary:
        "A first year of getting to know the nature around us: living vs non-living, basic needs, and a sense of weather.",
      focus: [
        "Living versus non-living; basic growth of plants and animals.",
        "The human body — senses and movement; properties of everyday materials.",
        "Observing weather and daily changes.",
      ],
      skills: [
        "Careful observation and description of objects and experiences.",
        "Comparing properties (hard/soft, hot/cold).",
        "Using simple scientific language and drawing data in a class journal.",
      ],
      inquiry: [
        "Recording daily weather observations and showing them in a symbolic chart.",
        "Simple material tests (float, sink, feel).",
      ],
      technology: [
        "Talking about everyday tools (scissors, flashlight) and how they help us.",
      ],
    },
  },
  g2: {
    key: "g2",
    name: "Grade 2",
    stage: "Foundation for scientific learning",
    topics: ["body", "animals", "plants", "materials", "experiments", "earth_space", "environment"],
    curriculum: {
      summary:
        "Deepening basic ideas: life cycles, healthy body habits, material properties, and states of matter.",
      focus: [
        "Life cycles of plants and animals and their needs.",
        "The human body — health and good daily habits.",
        "Materials and their properties; basic states of matter.",
        "Simple technology and tools in the child's environment.",
      ],
      skills: [
        "Sorting and classifying objects by given criteria.",
        "Recording observations in a table and comparing results.",
        "Noticing basic cause–effect links (a plant without water wilts).",
      ],
      inquiry: [
        "Tracking a classroom plant and recording growth stages.",
        "General temperature checks (hot/cold) and comparing materials.",
      ],
      technology: [
        "Examining home/classroom tools and understanding their role (nail/hammer, magnets).",
      ],
    },
  },
  g3: {
    key: "g3",
    name: "Grade 3",
    stage: "Expanding scientific concepts",
    topics: [
      "body",
      "animals",
      "plants",
      "materials",
      "experiments",
      "earth_space",
      "environment",
    ],
    curriculum: {
      summary:
        "Broader life science, basic physics, and Earth science. Introduction to simple machines and problem-solving.",
      focus: [
        "Life science: growing conditions, adaptation, and habitats.",
        "Physics: push/pull forces, motion, and early ideas of speed.",
        "Earth science: weather vs climate, the water cycle.",
        "Technology: simple machines and planning a solution.",
      ],
      skills: [
        "Running short experiments and understanding why one variable matters.",
        "Measuring with a ruler, measuring cups, and a basic thermometer.",
        "Writing short conclusions using graphs and tables.",
      ],
      inquiry: [
        "Force experiment: pulling objects on different surfaces.",
        "Building small lever/inclined-plane models and judging usefulness.",
      ],
      technology: [
        "Basic engineering thinking — identify a problem, propose a solution, and test it.",
      ],
    },
  },
  g4: {
    key: "g4",
    name: "Grade 4",
    stage: "Deeper scientific understanding",
    topics: ["body", "animals", "materials", "experiments", "earth_space", "environment"],
    curriculum: {
      summary:
        "Body systems, states of matter, basic electricity, rocks, and seasons. Combining scientific inquiry with engineering design.",
      focus: [
        "Biology: respiratory, digestive, and circulatory systems; interactions in ecosystems.",
        "Materials: states of matter; simple physical and chemical changes.",
        "Physics: basic electricity, conductors, and insulators.",
        "Earth: seasons, rock types, and soils.",
      ],
      skills: [
        "Planning an experiment with a question, hypothesis, and recorded results.",
        "Working with tables and graphs to present data.",
        "Using precise scientific language when sharing findings with the class.",
      ],
      inquiry: [
        "Building an open/closed electric circuit and drawing conclusions.",
        "Testing soil/rocks and presenting traits in a table.",
      ],
      technology: [
        "Full engineering design process: need → plan → build → test → improve.",
      ],
    },
  },
  g5: {
    key: "g5",
    name: "Grade 5",
    stage: "Expansion and application of knowledge",
    topics: ["body", "animals", "materials", "experiments", "earth_space", "environment"],
    curriculum: {
      summary:
        "Detailed body systems, energy, light and shadow, Earth resources, and more advanced technology processes.",
      focus: [
        "Biology: skeleton, muscles, senses; plant and animal reproduction.",
        "Materials: mixtures and solutions; natural vs synthetic.",
        "Physics: energy sources, light and shadow, reflection and transparency.",
        "Earth: Earth's structure, natural resources, and natural phenomena.",
      ],
      skills: [
        "Drawing more complex conclusions and using evidence from data.",
        "Documenting a full inquiry process in a personal/digital journal.",
        "Presenting a technology solution and evaluating how well it works.",
      ],
      inquiry: [
        "Light and shadow experiments; testing reflection and transparency of materials.",
        "Building models that show energy transfer (such as a small wind turbine).",
      ],
      technology: [
        "Gathering feedback, evaluating performance, and improving technology models.",
      ],
    },
  },
  g6: {
    key: "g6",
    name: "Grade 6",
    stage: "Advanced level before middle school",
    topics: ["body", "animals", "materials", "experiments", "earth_space", "environment"],
    curriculum: {
      summary:
        "Connecting science areas: multi-system body coordination, basic chemistry, gravity, climate change, and engineering problem-solving.",
      focus: [
        "Biology: coordination among body systems and complex adaptations to the environment.",
        "Chemistry: simple reactions, hazardous materials, and lab safety.",
        "Physics: gravity, mass and weight, more complex electric circuits.",
        "Earth: food chains, climate change, and human impact.",
      ],
      skills: [
        "Carrying out full inquiry — question, plan, measure, conclude, and discuss.",
        "Reading and analyzing scientific information from varied sources.",
        "Presenting a science/technology project to an audience.",
      ],
      inquiry: [
        "Documenting electricity experiments; measuring mass/weight and comparing them.",
        "Analyzing weather data over time and presenting trends.",
      ],
      technology: [
        "Complex engineering design projects with a focus on optimization and improvement.",
      ],
    },
  },
};
