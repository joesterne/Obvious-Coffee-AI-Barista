import { MethodDetails, LatteArtPattern } from "./types";

export const BREW_METHODS: MethodDetails[] = [
  {
    id: 'v60',
    name: 'Hario V60',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
    difficulty: 'Medium',
    body: 'Light',
    description: 'A cone-shaped dripper that highlights acidity and floral notes. Great for light roasts.',
    defaultRecipe: {
      type: 'recipe',
      method: 'Hario V60',
      coffeeAmount: 20,
      waterAmount: 320,
      waterTemp: 94,
      grindSize: 'Medium-Fine',
      ratio: '1:16',
      description: 'The standard 2-pour technique. Provides a balanced cup with good clarity and sweetness.',
      flavorExpectation: 'Clean, floral, acidic',
      steps: [
        { timeStart: 0, duration: 45, action: 'Bloom', description: 'Pour 40g of water ensuring all grounds are wet. Swirl gently.', waterAmount: 40 },
        { timeStart: 45, duration: 30, action: 'First Pour', description: 'Pour in concentric circles up to 200g total weight.', waterAmount: 200 },
        { timeStart: 75, duration: 30, action: 'Second Pour', description: 'Gently pour the remaining water up to 320g.', waterAmount: 320 },
        { timeStart: 105, duration: 60, action: 'Draw Down', description: 'Allow the water to drain completely through the coffee bed.' }
      ]
    }
  },
  {
    id: 'french_press',
    name: 'French Press',
    image: 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&w=600&q=80',
    difficulty: 'Easy',
    body: 'Heavy',
    description: 'Immersion brewing that produces a rich, full-bodied cup. Excellent for medium to dark roasts.',
    defaultRecipe: {
      type: 'recipe',
      method: 'French Press',
      coffeeAmount: 30,
      waterAmount: 500,
      waterTemp: 95,
      grindSize: 'Coarse',
      ratio: '1:16',
      description: 'The classic immersion method for a rich, full-bodied cup. Patience is key here.',
      flavorExpectation: 'Rich, textured, chocolatey',
      steps: [
        { timeStart: 0, duration: 60, action: 'Pour', description: 'Pour all 500g of water vigorously to ensure all grounds are wet.', waterAmount: 500 },
        { timeStart: 60, duration: 240, action: 'Steep', description: 'Let the coffee sit undisturbed for 4 minutes.' },
        { timeStart: 300, duration: 30, action: 'Break Crust', description: 'Stir the surface crust gently with a spoon. Scoop off floating foam and grounds.' },
        { timeStart: 330, duration: 300, action: 'Settle & Plunge', description: 'Wait for grounds to settle (5-8 min total), then insert plunger and press gently.' }
      ]
    }
  },
  {
    id: 'aeropress',
    name: 'AeroPress',
    image: 'https://images.unsplash.com/photo-1519087532306-69970c679a97?auto=format&fit=crop&w=600&q=80',
    difficulty: 'Medium',
    body: 'Medium',
    description: 'Versatile immersion and pressure brewer. Can mimic espresso or drip coffee.',
    defaultRecipe: {
      type: 'recipe',
      method: 'AeroPress',
      coffeeAmount: 15,
      waterAmount: 250,
      waterTemp: 90,
      grindSize: 'Medium',
      ratio: '1:16',
      description: 'The standard upright method. Quick, clean, and impossible to mess up.',
      flavorExpectation: 'Sweet, full-bodied, low acidity',
      steps: [
        { timeStart: 0, duration: 30, action: 'Pour', description: 'Pour 250g of water over the coffee.', waterAmount: 250 },
        { timeStart: 30, duration: 10, action: 'Stir', description: 'Stir gently back and forth 3 times.' },
        { timeStart: 40, duration: 60, action: 'Steep', description: 'Insert plunger slightly to create a vacuum and let steep.' },
        { timeStart: 100, duration: 30, action: 'Press', description: 'Press the plunger down gently and steadily. Stop at the hiss.' }
      ]
    }
  },
  {
    id: 'chemex',
    name: 'Chemex',
    image: 'https://images.unsplash.com/photo-1595928642581-f50f4f3453a5?auto=format&fit=crop&w=600&q=80',
    difficulty: 'Hard',
    body: 'Light',
    description: 'Thick filters result in an incredibly clean cup with highlighted sweetness.',
    defaultRecipe: {
      type: 'recipe',
      method: 'Chemex',
      coffeeAmount: 30,
      waterAmount: 500,
      waterTemp: 96,
      grindSize: 'Medium-Coarse',
      ratio: '1:16',
      description: 'A slow flow method that produces a tea-like body and highlights delicate notes.',
      flavorExpectation: 'Clean, sweet, tea-like',
      steps: [
        { timeStart: 0, duration: 45, action: 'Bloom', description: 'Pour 60g water to wet grounds. Swirl.', waterAmount: 60 },
        { timeStart: 45, duration: 60, action: 'First Pour', description: 'Pour in concentric circles to 300g.', waterAmount: 300 },
        { timeStart: 105, duration: 60, action: 'Second Pour', description: 'Pour gently to 500g, avoiding the filter walls.', waterAmount: 500 },
        { timeStart: 165, duration: 120, action: 'Draw Down', description: 'Let the water drain completely. Discard filter and serve.' }
      ]
    }
  },
  {
    id: 'moka_pot',
    name: 'Moka Pot',
    image: 'https://images.unsplash.com/photo-1520623351280-5a3d463d1a3a?auto=format&fit=crop&w=600&q=80',
    difficulty: 'Medium',
    body: 'Heavy',
    description: 'Stovetop espresso maker. Produces strong, intense coffee.',
    defaultRecipe: {
      type: 'recipe',
      method: 'Moka Pot',
      coffeeAmount: 18,
      waterAmount: 180,
      waterTemp: 99,
      grindSize: 'Fine',
      ratio: '1:10',
      description: 'Classic stove-top espresso. Strong, intense, and syrupy.',
      flavorExpectation: 'Intense, bittersweet, heavy body',
      steps: [
        { timeStart: 0, duration: 120, action: 'Heat', description: 'Place on low-medium heat with lid open.' },
        { timeStart: 120, duration: 60, action: 'Extract', description: 'Coffee will start to flow smoothly like honey.' },
        { timeStart: 180, duration: 10, action: 'Stop', description: 'When the flow becomes pale and bubbles rapidly (strombolian phase), run base under cold water to stop extraction.' }
      ]
    }
  },
  {
    id: 'espresso',
    name: 'Espresso',
    image: 'https://images.unsplash.com/photo-1515442261605-65987783cb6a?auto=format&fit=crop&w=600&q=80',
    difficulty: 'Hard',
    body: 'Heavy',
    description: 'High pressure extraction. The base for lattes and cappuccinos.',
    defaultRecipe: {
      type: 'recipe',
      method: 'Espresso',
      coffeeAmount: 18,
      waterAmount: 36,
      waterTemp: 93,
      grindSize: 'Fine (Espresso)',
      ratio: '1:2',
      description: 'The golden standard double shot.',
      flavorExpectation: 'Complex, concentrated, lingering finish',
      steps: [
        { timeStart: 0, duration: 5, action: 'Pre-infusion', description: 'Saturate puck with low pressure.' },
        { timeStart: 5, duration: 25, action: 'Extract', description: 'Pull shot at 9 bars of pressure. Aim for steady mouse-tail flow.' }
      ]
    }
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
    image: "https://images.unsplash.com/photo-1556742031-c6961e8560b0?auto=format&fit=crop&w=600&q=80",
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
    image: "https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=600&q=80",
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
    image: "https://images.unsplash.com/photo-1570968992193-96aa877477c7?auto=format&fit=crop&w=600&q=80",
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
    image: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=600&q=80",
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
    image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80",
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
    image: "https://images.unsplash.com/photo-1559496417-e7f25cb247f3?auto=format&fit=crop&w=600&q=80",
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
    image: "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&w=600&q=80",
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
    image: "https://images.unsplash.com/photo-1459755486867-b55449bb39ff?auto=format&fit=crop&w=600&q=80",
    steps: [
        "Pour a wide, wrapping Rosetta base for the outer wings.",
        "Pour a second, smaller inner Rosetta for inner feathers.",
        "Stack a central Tulip for the bird's body.",
        "Finish with a heart for the head and a sharp cut-through."
    ],
    videoPrompt: "Cinematic close-up of pouring a Phoenix latte art design. Wide wrapping wings, central body stack, and precise symmetry. Professional barista competition style."
  }
];