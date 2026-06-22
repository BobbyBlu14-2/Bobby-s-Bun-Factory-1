import { Product } from './types';

// Import generated flavor images
import flavorPeach from './src/assets/images/flavor_peach_1779744816402.png';
import flavorCaramel from './src/assets/images/flavor_caramel_1779744831602.png';
import flavorStrawberry from './src/assets/images/flavor_strawberry_1779744848150.png';
import flavorAppleCinnamon from './src/assets/images/flavor_apple_cinnamon_1779744860992.png';
import flavorAppleSlices from './src/assets/images/flavor_apple_slices_1779744875193.png';
import flavorMixedBerry from './src/assets/images/flavor_mixed_berry_1779744889006.png';

import caviarApple from './src/assets/images/apple_caviar_1779749857036.png';
import caviarPeach from './src/assets/images/peach_caviar_1779749873518.png';
import caviarBlueberry from './src/assets/images/blueberry_caviar_1779749888303.png';
import caviarWildberry from './src/assets/images/wildberry_caviar_1779749903216.png';
import jumboComparison from './src/assets/images/jumbo_comparison_1779752851857.png';
import cinnabitesChopped from './src/assets/images/cinnabites_chopped_1779753276487.png';
export { default as classicFrosting } from './src/assets/images/classic_frosting_1779749364471.png';
export { default as fourPackBuns } from './src/assets/images/four_pack_buns_1781559681011.jpg';
export { default as sixPackHorizontal } from './src/assets/images/six_pack_horizontal_1781560642971.jpg';
export { default as singleFruitCaviarBun } from './src/assets/images/single_fruit_caviar_bun_1781632684136.jpg';
export { default as chocolateCherryCaviar } from './src/assets/images/cherry_bomb_roll_1781638531994.jpg';
export { default as cookiesCreamTopping } from './src/assets/images/cookies_cream_roll_1781638548197.jpg';
export { default as fourPackCaviarUpgrade } from './src/assets/images/four_pack_caviar_upgrade_1781735237944.jpg';

import classicFrosting from './src/assets/images/classic_frosting_1779749364471.png';
import lemonFrosting from './src/assets/images/lemon_frosting_1779749381826.png';
import orangeCreamsicleFrosting from './src/assets/images/orange_creamsicle_frosting_1779756755486.png';
import fourPackBuns from './src/assets/images/four_pack_buns_1781559681011.jpg';
import sixPackHorizontal from './src/assets/images/six_pack_horizontal_1781560642971.jpg';
import peachSingleBun from './src/assets/images/peach_single_bun_1781560974108.jpg';
import singleFruitCaviarBun from './src/assets/images/single_fruit_caviar_bun_1781632684136.jpg';
import velvetAppleBun from './src/assets/images/apple_velvet_chunky_coulis_1781636501773.jpg';
import classicSingleBun from './src/assets/images/classic_single_bun_1781632743231.jpg';
import chocolateCherryCaviar from './src/assets/images/cherry_bomb_roll_1781638531994.jpg';
import cookiesCreamTopping from './src/assets/images/cookies_cream_roll_1781638548197.jpg';

// Export imported local images for other pages (like Instagram grid)
export { 
  flavorPeach, 
  flavorCaramel, 
  flavorStrawberry, 
  flavorAppleCinnamon, 
  flavorAppleSlices, 
  flavorMixedBerry, 
  caviarApple, 
  caviarPeach, 
  caviarBlueberry, 
  caviarWildberry, 
  velvetAppleBun, 
  classicSingleBun, 
  peachSingleBun,
  lemonFrosting, 
  orangeCreamsicleFrosting
};

// Export custom frost jar and cup images for other components
export { default as petitFrostCup } from './src/assets/images/petit_frost_cup_clean_1782139419311.jpg';
export { default as coupeFrostJar } from './src/assets/images/coupe_frost_jar_1781639210959.jpg';
export { default as pintFrostJar } from './src/assets/images/pint_frost_jar_1781639225544.jpg';
export { default as grandeFrostJar } from './src/assets/images/grande_frost_jar_1781639245051.jpg';
export { default as doubleGrandeJars } from './src/assets/images/double_grande_jars_1781639674387.jpg';
export { default as petitDuoCups } from './src/assets/images/petit_duo_cups_clean_1782140168745.jpg';
export { default as petitCaviarCup } from './src/assets/images/petit_caviar_cup_clean_1782139434494.jpg';
export { default as petitDuoCaviarCups } from './src/assets/images/petit_duo_cups_clean_1782140168745.jpg';
export { default as coupeCaviarJar } from './src/assets/images/coupe_coulis_jar_1781795360086.jpg';
export { default as pintCaviarJar } from './src/assets/images/pint_coulis_jar_1781795372539.jpg';
export { default as grandeCaviarJar } from './src/assets/images/grande_coulis_jar_1781795383935.jpg';
export { default as doubleGrandeCaviarJars } from './src/assets/images/double_grande_coulis_1781795395918.jpg';

import petitFrostCup from './src/assets/images/petit_frost_cup_clean_1782139419311.jpg';
import coupeFrostJar from './src/assets/images/coupe_frost_jar_1781639210959.jpg';
import pintFrostJar from './src/assets/images/pint_frost_jar_1781639225544.jpg';
import grandeFrostJar from './src/assets/images/grande_frost_jar_1781639245051.jpg';
import doubleGrandeJars from './src/assets/images/double_grande_jars_1781639674387.jpg';
import petitDuoCups from './src/assets/images/petit_duo_cups_clean_1782140168745.jpg';
import petitCaviarCup from './src/assets/images/petit_caviar_cup_clean_1782139434494.jpg';
import petitDuoCaviarCups from './src/assets/images/petit_duo_cups_clean_1782140168745.jpg';
import coupeCaviarJar from './src/assets/images/coupe_coulis_jar_1781795360086.jpg';
import pintCaviarJar from './src/assets/images/pint_coulis_jar_1781795372539.jpg';
import grandeCaviarJar from './src/assets/images/grande_coulis_jar_1781795383935.jpg';
import doubleGrandeCaviarJars from './src/assets/images/double_grande_coulis_1781795395918.jpg';

export const FLAVORS_OF_THE_MONTH: Product[] = [
  {
    id: 'peach-outlaw',
    name: 'The Peach Outlaw',
    description: 'Fresh succulent local Dacula peach chunks caramelized in brown sugar, piled high over warm rolls and drenched in Bobby’s Secret Frost.',
    price: 6.50,
    image: flavorPeach,
    type: 'bun',
    tags: ['Limited Drop', 'Georgia Peach Cobbler'],
    color: 'border-brand-ochre/25 text-brand-terracotta bg-orange-50/50'
  },
  {
    id: 'cherry-bomb',
    name: 'Chocolate Cherry Bomb',
    description: 'Warm, hand-crafted roll topped with explosive tart dark cherry reduction, and double-drizzled in rich, swirling dark chocolate sauce.',
    price: 6.50,
    image: chocolateCherryCaviar,
    type: 'bun',
    tags: ['Premium Drop', 'Chocolate Cherry'],
    color: 'border-rose-950/20 text-rose-950 bg-rose-50/40'
  },
  {
    id: 'loaded-bun',
    name: 'Velvet Apple',
    description: 'Our signature warm bun topped with slow-simmered regional apples cooked in spiced brown sugar cinnamon glaze.',
    price: 7.00,
    image: velvetAppleBun,
    type: 'bun',
    tags: ['Signature Drop', 'Velvet Apple'],
    color: 'border-amber-950/20 text-amber-950 bg-amber-50/40'
  },
  {
    id: 'cookies-cream',
    name: 'Cookies & Cream (Oreo)',
    description: 'Sweet, warm bun layered beautifully with crushed Oreo cookie sand and loaded inside velvety vanilla bean cream cheese frosting.',
    price: 6.50,
    image: cookiesCreamTopping,
    type: 'bun',
    tags: ['Limited Drop', 'Oreo & Cream'],
    color: 'border-slate-950/20 text-slate-950 bg-slate-50/40'
  }
];

// Re-map CHOOSE_YOUR_BUN for compatibility
export const CHOOSE_YOUR_BUN: Product[] = [
  {
    id: 'classic-bun',
    name: 'Classic Bun',
    description: 'Secret Frost. Clean. Easy. Always right.',
    price: 5.00,
    image: classicSingleBun,
    type: 'bun',
    tags: ['Classic', 'Start Here'],
    color: '#F4E3DD'
  },
  {
    id: 'caviar-bun',
    name: 'Caviar Bun',
    description: 'Your bun + one sweet fruit caviar (coulis) topping.',
    price: 6.00,
    image: singleFruitCaviarBun,
    type: 'bun',
    tags: ['Upgrade'],
    color: '#FFFBF5'
  },
  {
    id: 'loaded-bun',
    name: 'Velvet Apple Bun',
    description: 'Our signature warm bun topped with slow-simmered regional spiced brown-sugar apples.',
    price: 7.00,
    image: velvetAppleBun,
    type: 'bun',
    tags: ['Signature', 'Velvet Apple'],
    color: '#F5F5F7'
  }
];

export const SECRET_FROST: Product[] = [
  {
    id: 'frost-mini',
    name: 'Bobby’s Secret Frost — Mini',
    description: 'A lil’ dip never hurt nobody.',
    price: 1.50,
    image: 'https://images.unsplash.com/photo-1579372781848-69160419266e?q=80&w=800&auto=format&fit=crop',
    type: 'jar',
    color: '#F9F9F9'
  }
];

export const SECRET_CAVIAR: Product[] = [
  {
    id: 'classic-secret-frost',
    name: 'Classic Secret Frost',
    description: 'Our signature velvety vanilla bean cream cheese frosting whip.',
    price: 1.50,
    image: classicFrosting,
    type: 'jar',
    color: 'border-brand-ochre/10 text-brand-ink bg-white/60'
  }
];

export const FRUIT_CAVIAR_JARS: Product[] = [
  {
    id: 'apple-caviar-jar',
    name: 'Spiced Caramel Apple Caviar',
    description: 'A 4oz jar of luxurious slow-simmered regional apples in deep brown sugar caramel sauce.',
    price: 7.00,
    image: caviarApple,
    type: 'jar',
    tags: ['Jar', 'Apple Velvet'],
    color: 'border-emerald-950/10 text-emerald-800 bg-emerald-50/40'
  }
];

// --- STREAMLINED CORE MENU (BOBBY'S BUN FACTORY PREMIUM UPDATE) ---

export const SINGLES_MENU: Product[] = [
  {
    id: 'classic-bun',
    name: 'Classic Bun',
    description: 'Secret Frost. Clean. Easy. Always right.',
    price: 5.00,
    image: classicSingleBun,
    type: 'bun',
    tags: ['Daily', 'Entry Product', 'Start Here'],
    color: '#F4E3DD'
  },
  {
    id: 'caviar-bun',
    name: 'Caviar Bun',
    description: 'Your bun + one sweet fruit caviar (coulis) topping of your choice.',
    price: 6.00,
    image: singleFruitCaviarBun,
    type: 'bun',
    tags: ['Upgrade', 'Drip Swirl'],
    color: '#FFFBF5'
  },
  {
    id: 'loaded-bun',
    name: 'Velvet Apple Bun',
    description: 'Our signature warm bun topped with slow-simmered regional spiced brown-sugar apples.',
    price: 7.00,
    image: velvetAppleBun,
    type: 'bun',
    tags: ['Signature', 'Velvet Apple'],
    color: '#F5F5F7'
  }
];

export const BOXED_4_PACKS: Product[] = [
  {
    id: 'classic-4pack',
    name: 'Classic 4-Pack',
    description: 'Four classic buns with Secret Frost.',
    price: 18.00,
    image: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?q=80&w=800&auto=format&fit=crop',
    type: 'bun',
    tags: ['Classic Box'],
    color: '#FDF2F2'
  },
  {
    id: 'mixed-4pack',
    name: 'Mixed 4-Pack',
    description: 'A mix of classic and caviar buns.',
    price: 22.00,
    image: fourPackBuns,
    type: 'bun',
    tags: ['Popular'],
    color: '#FFFBF5'
  },
  {
    id: 'signature-4pack',
    name: 'Premium 4-Pack',
    description: 'For the elevated box moment.',
    price: 25.00,
    image: fourPackBuns,
    type: 'bun',
    tags: ['Curated Mix', 'Elevated'],
    color: '#FFF5F5'
  }
];

export const BOXED_6_PACKS: Product[] = [
  {
    id: 'classic-6pack',
    name: 'Classic 6-Pack',
    description: 'Six classic buns with Secret Frost.',
    price: 26.00,
    image: sixPackHorizontal,
    type: 'bun',
    tags: ['Classic Pack'],
    color: '#FDF2F2'
  },
  {
    id: 'mixed-6pack',
    name: 'Mixed 6-Pack',
    description: 'The sweet spot. Best value, shareable, and delicious.',
    price: 32.00,
    image: sixPackHorizontal,
    type: 'bun',
    tags: ['Best Seller', 'Fan Favorite'],
    color: '#F5F7FF'
  },
  {
    id: 'signature-6pack',
    name: 'Premium 6-Pack',
    description: 'Your dressed-up party box.',
    price: 36.00,
    image: sixPackHorizontal,
    type: 'bun',
    tags: ['Signature Box', 'Highly Indulgent'],
    color: '#F7EEFF'
  }
];

export const JAR_PRODUCTS: Product[] = [
  {
    id: 'petit-caviar-jar',
    name: 'Petit de Caviar',
    description: '3.5 oz of slow-simmered regional fruit caviar in a black plastic cup.',
    price: 3.00,
    image: petitCaviarCup,
    type: 'jar',
    tags: ['Petit Cup', 'Fruit Caviar'],
    color: '#FFFBF5'
  },
  {
    id: 'petit-duo-caviar',
    name: 'Le Petit Duos',
    description: 'Any 2 Petits. Mix and match our standard or premium fruit caviar and frosting cups for a custom combo.',
    price: 5.00,
    image: petitDuoCaviarCups,
    type: 'jar',
    tags: ['Duo Pack', 'Fruit Caviar'],
    color: '#FFF8F5'
  },
  {
    id: 'coupe-caviar-jar',
    name: 'Coupe de Caviar',
    description: '8 oz of slow-simmered regional fruit caviar in an elegant custom glass jar.',
    price: 7.00,
    image: coupeCaviarJar,
    type: 'jar',
    tags: ['Coupe', 'Fruit Caviar'],
    color: '#FDF5FF'
  },
  {
    id: 'pint-caviar-jar',
    name: 'Pint de Caviar',
    description: '16 oz of slow-simmered regional fruit caviar in a classic glass mason jar.',
    price: 12.00,
    image: pintCaviarJar,
    type: 'jar',
    tags: ['Pint', 'Fruit Caviar'],
    color: '#F0F8FF'
  },
  {
    id: 'grande-caviar-jar',
    name: 'Vrai Grande Caviar',
    description: '32 oz (Quart Size) of slow-simmered regional fruit caviar in a heavy-duty wide-mouth glass mason jar.',
    price: 18.00,
    image: grandeCaviarJar,
    type: 'jar',
    tags: ['Vrai Grande', 'Fruit Caviar'],
    color: '#FFF0F5'
  },
  {
    id: 'double-grande-caviar-jars',
    name: '2x Vrai Grande Caviar Jars',
    description: 'A special bundle of two 32 oz wide-mouth classic glass jars packed with our slow-simmered regional fruit caviar.',
    price: 32.00,
    image: doubleGrandeCaviarJars,
    type: 'jar',
    tags: ['Double Pack', 'Best Value Combo', 'Fruit Caviar'],
    color: '#E8F5E9'
  },
  {
    id: 'petit-frost-jar',
    name: 'Petit Frost',
    description: '3.5 oz of temperature-calibrated velvety frosting whip served in a black plastic cup. Small but dangerous.',
    price: 3.00,
    image: petitFrostCup,
    type: 'jar',
    tags: ['Petit Cup', 'Secret Frost'],
    color: '#FDF6F0'
  },
  {
    id: 'petit-duo-frost',
    name: 'Le Petit Duo',
    description: 'Any 2 Petits. Mix and match our standard or premium whip flavors for a custom combo.',
    price: 5.00,
    image: petitDuoCups,
    type: 'jar',
    tags: ['Duo Pack', 'Secret Frost'],
    color: '#FFF8F5'
  },
  {
    id: 'coupe-frost-jar',
    name: 'Coupe de Frost',
    description: '8 oz of temperature-calibrated velvety frosting whip in an elegant custom glass jar. Your everyday extra.',
    price: 7.00,
    image: coupeFrostJar,
    type: 'jar',
    tags: ['Coupe', 'Secret Frost Jar'],
    color: '#FDF2F2'
  },
  {
    id: 'pint-frost-jar',
    name: 'Pint de Frost',
    description: '16 oz of temperature-calibrated velvety frosting whip in a classic glass mason jar. A very reasonable amount.',
    price: 12.00,
    image: pintFrostJar,
    type: 'jar',
    tags: ['Pint', 'Secret Frost Jar'],
    color: '#FFF8F5'
  },
  {
    id: 'grande-frost-jar',
    name: 'Vrai Grande Frost',
    description: '32 oz of temperature-calibrated velvety frosting whip in a heavy duty wide-mouth classic glass jar. The ultimate frosting reserve.',
    price: 18.00,
    image: grandeFrostJar,
    type: 'jar',
    tags: ['Vrai Grande', 'Secret Frost Jar'],
    color: '#F5FFF5'
  },
  {
    id: 'double-grande-frost-jars',
    name: '2x Vrai Grande Jars',
    description: 'A special bundle of two 32 oz wide-mouth classic glass jars packed with our signature velvety cream whip frosting.',
    price: 32.00,
    image: doubleGrandeJars,
    type: 'jar',
    tags: ['Double Pack', 'Best Value Combo', 'Secret Frost Jar'],
    color: '#E8F5E9'
  }
];

export interface CaviarFlavor {
  id: string;
  name: string;
  category: 'standard' | 'premium';
  description: string;
  image: string;
}

export const CAVIAR_FLAVORS: CaviarFlavor[] = [
  // Standard Toppings/Flavors
  { id: 'none', name: 'No Caviar / Classic Roll', category: 'standard', description: 'Just our signature warm bun and velvety Secret Frost cream whip', image: classicFrosting },
  { id: 'blueberry', name: 'Blueberry', category: 'standard', description: 'Deep mountain wild blueberry indigo glaze', image: caviarBlueberry },
  { id: 'strawberry', name: 'Strawberry', category: 'standard', description: 'Fresh, sweet mountain-grown strawberry crush', image: flavorStrawberry },
  { id: 'wild-berry', name: 'Wildberry', category: 'standard', description: 'Forest raspberries, dark blackberries, sweet blueberries', image: caviarWildberry },
  { id: 'lemon', name: 'Lemon', category: 'standard', description: 'Zesty Meyer lemon infused sweet milk whip', image: lemonFrosting },
  { id: 'orange', name: 'Orange', category: 'standard', description: 'Sweet orange creamsicle citrus infusion', image: orangeCreamsicleFrosting },
  { id: 'salted-caramel', name: 'Salted Caramel', category: 'standard', description: 'Hand-harvested salted caramel drizzle', image: flavorCaramel },

  // Premium Toppings/Flavors
  { id: 'cherry-bomb', name: 'Chocolate Cherry Bomb', category: 'premium', description: 'Explosive tart dark cherry reduction with a rich chocolate drizzle', image: chocolateCherryCaviar },
  { id: 'peach', name: 'The Peach Outlaw', category: 'premium', description: 'Fresh succulent Georgia peach chunks caramelized in brown sugar and piled high over warm rolls', image: caviarPeach },
  { id: 'apple-velvet', name: 'Velvet Apple', category: 'premium', description: 'Signature slow-simmered regional apples in spiced brown sugar cinnamon glaze', image: caviarApple },
  { id: 'oreo', name: 'Cookies & Cream (Oreo)', category: 'premium', description: 'Crushed cookies & cream sand layered in sweet vanilla glaze', image: cookiesCreamTopping }
];
