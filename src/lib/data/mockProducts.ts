import { Product, BlogPost } from "../types";

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Orthopedic Memory Foam Bolster Bed",
    category: "Beds",
    price: 189,
    rating: 4.9,
    reviewsCount: 142,
    image: "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=600&q=80"
    ],
    description: "Designed for premium support, this orthopedic memory foam bed relieves joint pressure and offers ultra-cozy comfort with a machine-washable cotton linen cover. Inspired by Scandinavian interior aesthetics, it blends seamlessly into any modern living space.",
    specifications: {
      "Material": "Gel-infused memory foam, organic cotton cover",
      "Size": "Medium (36\" x 28\" x 9\")",
      "Care Instructions": "Machine washable cover (cold cycle)",
      "Origin": "Designed in Denmark"
    },
    stock: 24,
    discount: 10,
    isFeatured: true,
    isNew: false
  },
  {
    id: "prod-2",
    name: "Aura Smart Health & GPS Collar",
    category: "Accessories",
    price: 249,
    rating: 4.8,
    reviewsCount: 88,
    image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=600&q=80"
    ],
    description: "The ultimate pet health wearable. Tracks location in real time via GPS, monitors daily steps, sleep patterns, heart rate variability, and alerts you to potential health changes. Finished with a premium waterproof leather strap.",
    specifications: {
      "Battery Life": "Up to 14 days",
      "Waterproofing": "IP68 Submersible",
      "Strap Material": "Genuine full-grain Italian leather",
      "Connectivity": "LTE, Bluetooth, Wi-Fi"
    },
    stock: 15,
    isFeatured: true,
    isNew: true
  },
  {
    id: "prod-3",
    name: "Ceramic Cascade Silent Water Fountain",
    category: "Accessories",
    price: 79,
    rating: 4.7,
    reviewsCount: 204,
    image: "https://images.unsplash.com/photo-1591946614720-90a587da4a36?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1591946614720-90a587da4a36?auto=format&fit=crop&w=600&q=80"
    ],
    description: "Hydrate your pets in peace. Constructed from heavy, hygienic non-porous ceramic, this fountain features an ultra-quiet water pump and triple-filtration technology to keep water fresh, oxygenated, and free of impurities.",
    specifications: {
      "Capacity": "2.1 Liters / 71 oz",
      "Material": "Food-grade double-fired ceramic",
      "Filter Type": "Activated carbon and ion-exchange resin",
      "Power Source": "USB cable (wall adapter included)"
    },
    stock: 40,
    isFeatured: false,
    isNew: false
  },
  {
    id: "prod-4",
    name: "Organic Dehydrated Salmon Bites",
    category: "Treats",
    price: 18,
    rating: 4.9,
    reviewsCount: 312,
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=600&q=80"
    ],
    description: "Single-ingredient premium dog and cat treats made from 100% wild-caught Alaskan salmon. Slowly dehydrated to preserve natural nutrients, essential omega-3 fatty acids, and a rich flavor that pets find irresistible.",
    specifications: {
      "Ingredients": "100% Wild Alaskan Salmon",
      "Weight": "6.0 oz (170g)",
      "Guaranteed Analysis": "Crude Protein (min) 60%, Crude Fat (min) 12%",
      "Dietary Profile": "Grain-free, gluten-free, no preservatives"
    },
    stock: 120,
    discount: 15,
    isFeatured: true,
    isNew: false
  },
  {
    id: "prod-5",
    name: "Architectural Felt Cat Cave",
    category: "Beds",
    price: 95,
    rating: 4.6,
    reviewsCount: 96,
    image: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=600&q=80"
    ],
    description: "Handcrafted from 100% premium New Zealand wool, this cozy felt dome provides cats with a warm, dark, and insulated sanctuary. Fits cat sizes up to 18 lbs and retains its shape over years of use.",
    specifications: {
      "Material": "100% Organic Merino Wool",
      "Dimensions": "19\" base diameter, 10\" height",
      "Method": "Wet felted by hand",
      "Care": "Spot clean or vacuum"
    },
    stock: 8,
    isFeatured: false,
    isNew: true
  },
  {
    id: "prod-6",
    name: "Premium Walnut cat Scratching Post",
    category: "Toys",
    price: 149,
    rating: 4.8,
    reviewsCount: 65,
    image: "https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?auto=format&fit=crop&w=600&q=80"
    ],
    description: "Ditch the ugly sisal posts. Crafted with structural solid walnut and wrapped in heavy-duty natural woven jute fabric, this modern tower offers cats a premium stretching and scratching outlet that elevates your interior design.",
    specifications: {
      "Wood Type": "FSC-certified solid American walnut",
      "Wrap Material": "Natural sisal jute carpet weave",
      "Weight": "16 lbs (Ultra-stable, won't tip over)",
      "Height": "32 inches"
    },
    stock: 12,
    isFeatured: true,
    isNew: false
  },
  {
    id: "prod-7",
    name: "Luxe Cashmere Dog Sweater",
    category: "Accessories",
    price: 115,
    rating: 4.9,
    reviewsCount: 45,
    image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=600&q=80"
    ],
    description: "Indulgently soft knit sweater crafted from sustainable, Mongolian grade-A cashmere. Keeps small-to-medium dogs beautifully warm during crisp autumn and winter walks, featuring a rib-knit mock neck and leash portal.",
    specifications: {
      "Material": "100% Grade-A Cashmere",
      "Colors": "Oatmeal Melange, Slate Gray, Forest Green",
      "Care": "Hand wash flat, reshape to dry",
      "Sizing": "Available in XS, S, M, L"
    },
    stock: 6,
    isFeatured: false,
    isNew: true
  },
  {
    id: "prod-8",
    name: "Minimalist Brass & Leather Leash Set",
    category: "Accessories",
    price: 90,
    rating: 4.8,
    reviewsCount: 118,
    image: "https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=600&q=80"
    ],
    description: "A matching set featuring a premium latigo leather leash and matching collar. Handcrafted with heavy brass hardware, this weather-resistant set develops a gorgeous rustic patina with age and adventure.",
    specifications: {
      "Leash Length": "5 feet",
      "Leather Type": "Vegetable-tanned full-grain leather",
      "Hardware": "100% solid brushed brass",
      "Collar Fit": "Adjustable buckle closure"
    },
    stock: 19,
    discount: 5,
    isFeatured: false,
    isNew: false
  },
  {
    id: "prod-9",
    name: "Freeze-Dried Grain-Free Feast (Beef)",
    category: "Food",
    price: 48,
    rating: 4.9,
    reviewsCount: 220,
    image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=600&q=80"
    ],
    description: "Premium biologically appropriate raw food for dogs. Features 85% grass-fed beef, organs, and bone, blended with organic superfoods and freeze-dried to lock in maximum nutrition and taste. Simply add warm water and serve.",
    specifications: {
      "Main Ingredient": "Grass-Fed Beef, Beef Liver, Beef Heart",
      "Weight": "14 oz (Rehydrates to 4 lbs of raw food)",
      "Vitamins": "Fortified with organic kelp, squash, blueberries",
      "Formula": "100% complete and balanced for all life stages"
    },
    stock: 55,
    isFeatured: true,
    isNew: false
  },
  {
    id: "prod-10",
    name: "Weighted Ceramic Anti-Slip Bowls",
    category: "Accessories",
    price: 45,
    rating: 4.7,
    reviewsCount: 154,
    image: "https://images.unsplash.com/photo-1591946614720-90a587da4a36?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1591946614720-90a587da4a36?auto=format&fit=crop&w=600&q=80"
    ],
    description: "Premium double-fired heavy ceramic bowls fitted with a removable medical-grade silicone base ring to prevent slides, clinking, and spills. Easy to clean and completely dishwasher-safe.",
    specifications: {
      "Diameter": "7 inches (Holds 4 cups)",
      "Dishwasher Safe": "Yes",
      "Microwave Safe": "Yes",
      "Base": "Food-grade non-slip silicone"
    },
    stock: 33,
    isFeatured: false,
    isNew: false
  },
  {
    id: "prod-11",
    name: "Interactive AI Laser Companion",
    category: "Toys",
    price: 65,
    rating: 4.5,
    reviewsCount: 78,
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80"
    ],
    description: "Keep your indoor cats active and entertained. Using subtle random motion patterns, this device automatically wakes when it senses your pet and starts a gentle laser play sequence, shutting off after 15 minutes to prevent overstimulation.",
    specifications: {
      "Sensors": "PIR Motion Detection up to 8 feet",
      "Safety": "Class 1 safe laser output",
      "Charging": "Rechargeable USB-C (cable included)",
      "Modes": "Auto-schedule, manual trigger"
    },
    stock: 20,
    isFeatured: false,
    isNew: true
  },
  {
    id: "prod-12",
    name: "Wild Salmon Oil Skin & Coat Tonic",
    category: "Health",
    price: 32,
    rating: 4.9,
    reviewsCount: 186,
    image: "https://images.unsplash.com/photo-1612538498456-e861df91d4d0?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1612538498456-e861df91d4d0?auto=format&fit=crop&w=600&q=80"
    ],
    description: "100% pure wild-caught salmon oil supplement rich in Omega-3 (EPA and DHA). Daily pumps onto your pet's food promote a glossy, flake-free coat, reduce joint inflammation, and support heart and brain health.",
    specifications: {
      "Ingredients": "100% Pure Wild Salmon Oil",
      "Size": "16 fl oz (473 ml)",
      "Daily Dosage": "1 pump per 10 lbs body weight",
      "Guaranteed": "Min 30% Omega-3 Fatty Acids"
    },
    stock: 62,
    discount: 10,
    isFeatured: true,
    isNew: false
  }
];

export const MOCK_BLOGS: BlogPost[] = [
  {
    id: "blog-1",
    title: "Understanding Canine Nutrition: Raw vs. Kibble",
    excerpt: "Demystifying pet food diets. Learn the benefits of biologically appropriate ingredients and how to transition safely.",
    content: "Feeding your dog is one of the most fundamental choices you make. In this guide, we dive deep into raw diets, dehydrated formulas, and standard kibble. Raw diets focus on unprocessed proteins, bones, and organs, mimicking a wild diet. Dehydrated raw options lock in the raw benefits with dry-food convenience. Traditional kibble provides a shelf-stable balance but requires careful consideration of binders, grains, and fillers. To choose the right balance, assess your pet's activity levels, check for sensitivities, and introduce changes gradually to avoid digestive upset...",
    category: "Nutrition",
    readTime: "5 min read",
    date: "July 2, 2026",
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80",
    author: {
      name: "Dr. Elena Rostova",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&q=80"
    }
  },
  {
    id: "blog-2",
    title: "The Art of Positive Reinforcement in Puppy Training",
    excerpt: "Establish deep trust and good habits early using positive conditioning, consistency, and premium reward structures.",
    content: "Puppies learn through consequences. Rewarding good behavior with healthy treats, verbal praise, or a favorite toy encourages repetition. Avoid punishments; redirection is far more effective. Ensure everyone in the house uses the same verbal commands (e.g., 'Sit' vs. 'Sit down'). Keep training sessions short, under 5–10 minutes, as a puppy's attention span is brief. Most importantly, build a routine of rewards that is highly valued, such as single-ingredient dehydrated treats, to keep their motivation high.",
    category: "Training",
    readTime: "4 min read",
    date: "June 28, 2026",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=600&q=80",
    author: {
      name: "Mark Henderson",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
    }
  },
  {
    id: "blog-3",
    title: "Preventative Health for Indoor Cats: Tips & Advice",
    excerpt: "How to manage dental care, weight control, and mental wellness for cats living exclusively inside.",
    content: "Indoor cats can lead long, healthy lives, but they are prone to physical inactivity and boredom. Ensure they get daily play using interactive toys that simulate the hunting cycle (stalk, chase, catch). Dental disease affects 70% of cats by age three; brushing teeth or using enzymatic water additives is vital. Feed a high-moisture diet to support kidney health and control portion sizes to avoid obesity. Regularly rotate their toys and scratching surfaces to keep their environments rich and engaging.",
    category: "Health Tips",
    readTime: "6 min read",
    date: "June 15, 2026",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80",
    author: {
      name: "Sarah Lindqvist",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
    }
  }
];
