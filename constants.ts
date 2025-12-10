import { MethodDetails, LatteArtPattern } from "./types";

export const BREW_METHODS: MethodDetails[] = [
  {
    id: 'v60',
    name: 'Hario V60',
    image: 'https://picsum.photos/400/300?random=1',
    difficulty: 'Medium',
    body: 'Light',
    description: 'A cone-shaped dripper that highlights acidity and floral notes. Great for light roasts.'
  },
  {
    id: 'french_press',
    name: 'French Press',
    image: 'https://picsum.photos/400/300?random=2',
    difficulty: 'Easy',
    body: 'Heavy',
    description: 'Immersion brewing that produces a rich, full-bodied cup. excellent for medium to dark roasts.'
  },
  {
    id: 'aeropress',
    name: 'AeroPress',
    image: 'https://picsum.photos/400/300?random=3',
    difficulty: 'Medium',
    body: 'Medium',
    description: 'Versatile immersion and pressure brewer. Can mimic espresso or drip coffee.'
  },
  {
    id: 'chemex',
    name: 'Chemex',
    image: 'https://picsum.photos/400/300?random=4',
    difficulty: 'Hard',
    body: 'Light',
    description: 'Thick filters result in an incredibly clean cup with highlighted sweetness.'
  },
  {
    id: 'moka_pot',
    name: 'Moka Pot',
    image: 'https://picsum.photos/400/300?random=5',
    difficulty: 'Medium',
    body: 'Heavy',
    description: 'Stovetop espresso maker. Produces strong, intense coffee.'
  },
  {
    id: 'espresso',
    name: 'Espresso',
    image: 'https://picsum.photos/400/300?random=6',
    difficulty: 'Hard',
    body: 'Heavy',
    description: 'High pressure extraction. The base for lattes and cappuccinos.'
  }
];

export const ORIGINS = [
  "Ethiopia", "Colombia", "Brazil", "Kenya", "Guatemala", "Costa Rica", "Indonesia", "Rwanda", "Panama"
];

export const TASTING_NOTES = [
  "Chocolate", "Nutty", "Caramel", "Berry", "Citrus", "Floral", "Spicy", "Earthy", "Stone Fruit", "Vanilla"
];

export const LATTE_ART_PATTERNS: LatteArtPattern[] = [
  {
    type: 'latte_art',
    id: 'monks_head',
    name: "The Monk's Head",
    difficulty: 'Beginner',
    description: "The foundation of all patterns. A solid white circle surrounded by a symmetric crema ring.",
    image: "https://picsum.photos/400/300?random=10",
    steps: [
      "Tilt the cup 45 degrees.",
      "Pour from 5-7cm height into the center to mix milk and espresso (canvas building).",
      "When cup is 60% full, lower pitcher spout as close to surface as possible.",
      "Increase pour rate aggressively in the center.",
      "A white circle will bloom. Stop pouring and level the cup."
    ],
    videoPrompt: "Top down close up view of barista pouring milk into espresso. The milk forms a perfect solid white circle in the center of the dark brown crema. High contrast, cinematic lighting, 4k."
  },
  {
    type: 'latte_art',
    id: 'heart',
    name: "The Heart",
    difficulty: 'Beginner',
    description: "A classic symbol of coffee love. Mastering this unlocks the Rosetta and Tulip.",
    image: "https://picsum.photos/400/300?random=11",
    steps: [
      "Follow Monk's Head steps to create a white circle.",
      "Remain in the center until the circle is large.",
      "Lift the pitcher up 2 inches.",
      "Pour a thin stream while moving forward through the circle (the cut-through).",
      "This pulls the circle into a heart shape."
    ],
    videoPrompt: "Cinematic close up of a barista pouring a heart latte art pattern. Show the pitcher spout lowering, the white foam appearing, and the final pull-through that creates the heart tip. Slow motion, warm lighting."
  },
  {
    type: 'latte_art',
    id: 'tulip',
    name: "The Tulip",
    difficulty: 'Intermediate',
    description: "Multiple stacked hearts creating a floral appearance. Requires start-stop pouring control.",
    image: "https://picsum.photos/400/300?random=12",
    steps: [
      "Create a small Monk's Head, then stop pouring.",
      "Move spout back slightly.",
      "Lower and pour again to push the first circle forward.",
      "Repeat 2-3 times to create layers.",
      "Lift and cut through all layers to finish."
    ],
    videoPrompt: "Macro video of pouring a stacked tulip latte art pattern. Distinct layers of white foam pushing into each other. Golden crema contrast. Professional barista technique."
  },
  {
    type: 'latte_art',
    id: 'rosetta',
    name: "The Rosetta",
    difficulty: 'Advanced',
    description: "A fern-like leaf pattern created by wiggling the pitcher while moving backwards.",
    image: "https://picsum.photos/400/300?random=13",
    steps: [
      "Establish base, then lower spout close to surface.",
      "Gently rock pitcher side-to-side while moving backward.",
      "This creates the leaves (ripples).",
      "At the top, pause to create the heart.",
      "Lift and pull through the center quickly to create the stem."
    ],
    videoPrompt: "Slow motion top down view of pouring a Rosetta latte art pattern. Rhythmic wiggling of the pitcher, white ripples forming in the cup. Elegant and smooth motion."
  },
  {
    type: 'latte_art',
    id: 'swan',
    name: "The Swan",
    difficulty: 'Advanced',
    description: "An elegant combination of a Rosetta base and a precise neck draw, creating a bird silhouette.",
    image: "https://picsum.photos/400/300?random=14",
    steps: [
      "Pour a Rosetta base, but place it slightly off-center.",
      "At the top of the Rosetta, lift the pitcher to stop the leaves.",
      "Pour a thin stream up the side of the Rosetta to create the neck (drag method).",
      "At the top of the neck, drop the spout close again to pour a small heart for the head.",
      "Lift and cut through the head to finish."
    ],
    videoPrompt: "Cinematic close up of pouring a Swan latte art pattern. Base rosetta forming, then the pitcher lifts to draw a thin neck line up the side, finishing with a small heart head. Elegant and artistic."
  },
  {
    type: 'latte_art',
    id: 'winged_tulip',
    name: "The Winged Tulip",
    difficulty: 'Advanced',
    description: "Combines the flow of a Rosetta with the structure of a Tulip. A wide base wraps around the central stack.",
    image: "https://picsum.photos/400/300?random=15",
    steps: [
      "Start with a Rosetta motion to create a wide, wrapping base.",
      "Stop pouring, then move spout to the center of the base.",
      "Pour a standard Tulip stack (2-3 layers) inside the wings.",
      "Lift and cut through all layers to connect the design."
    ],
    videoPrompt: "Macro top-down view of a Winged Tulip pour. Wide, flowing white wings wrapping around a central stack of distinct hearts. High contrast espresso canvas."
  },
  {
    type: 'latte_art',
    id: 'seahorse',
    name: "The Seahorse",
    difficulty: 'Advanced',
    description: "A whimsical creature created by distorting a Rosetta neck. Features a curved body and detailed snout.",
    image: "https://picsum.photos/400/300?random=16",
    steps: [
        "Pour a curved Rosetta base, favoring one side of the cup.",
        "Drag the stream up the concave side to form the back.",
        "Stop at the top, then pour a small heart for the head.",
        "Drag the stream forward to create the snout."
    ],
    videoPrompt: "Top down view of pouring a Seahorse latte art pattern. Curved rosetta body, distinct head pour, and snout detail. High contrast and playful."
  },
  {
    type: 'latte_art',
    id: 'phoenix',
    name: "The Phoenix",
    difficulty: 'Advanced',
    description: "A majestic double-wing design surrounding a central body. Requires perfect symmetry and flow control.",
    image: "https://picsum.photos/400/300?random=17",
    steps: [
        "Pour a wide, wrapping Rosetta base for the outer wings.",
        "Pour a second, smaller inner Rosetta for inner feathers.",
        "Stack a central Tulip for the bird's body.",
        "Finish with a heart for the head and a sharp cut-through."
    ],
    videoPrompt: "Cinematic close-up of pouring a Phoenix latte art design. Wide wrapping wings, central body stack, and precise symmetry. Professional barista competition style."
  }
];