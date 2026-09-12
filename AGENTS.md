# Bobby's Bun Factory — AI Developer Instructions

This file documents the menu architecture, categorization constraints, and component pairings for Bobby's Bun Factory to ensure future development stays consistent with the official brand structure.

## 1. Menu Architecture & Categorizations

All products, toppings ("caviars"), and frost options are centered in `/constants.tsx`.

### A. Toppings (Caviar Flavors)
Toppings are divided strictly into **Standard** and **Premium / Seasonal** tiers:

*   **Standard Caviar Flavors** (Included in standard upcharge, classic fruit profiles):
    *   **No Caviar / Classic Roll**: Signature warm bun with velvety Secret Frost cream whip.
    *   **Blueberry Caviar**: Deep mountain wild blueberry indigo reduction.
    *   **Strawberry Caviar**: Fresh, sweet mountain-grown strawberry crush.
    *   **Salted Caramel**: Hand-caramelized drizzle with sea salt.

*   **Premium / Seasonal Flavors** (Hand-crafted, chunky/artisanal reductions):
    *   **Georgia Peach**: Fresh succulent Georgia peach chunks caramelized in brown sugar and piled high.
    *   **Velvet Apple**: Signature slow-simmered regional apples in spiced brown sugar cinnamon glaze (chunkier cut).
    *   **Wildberry**: Forest raspberries, dark blackberries, sweet blueberries.

### B. Frosting Packaging Guidelines
Secret Frost (our signature cream whip) is served in strictly designated packaging sizes:

1.  **Petit Frost (3.5 oz)**: Served in a **black plastic cup** with an airtight lid (not a glass jar).
2.  **Coupe de Frost (8 oz)**: Served in an elegant custom **glass jar**.
3.  **Pint de Frost (16 oz)**: Served in a classic **glass mason jar**.
4.  **Vrai Grande Frost (32 oz)**: Served in a heavy-duty wide-mouth **glass mason jar**.
5.  **2x Vrai Grande Jars (32 oz Double-Pack)**: Packaged as a special twin-bundle value combo.

---

## 2. Dynamic Image Asset Mapping
All topping and frosting choices have high-resolution, custom-generated editorial photoshoot assets mapped inside `constants.tsx`. When components render these options, they must reference the predefined image variables rather than fallback URLs:

*   `chocolateCherryCaviar` / `cookiesCreamTopping` (Cinnamon roll format)
*   `petitFrostCup` / `coupeFrostJar` / `pintFrostJar` / `grandeFrostJar` / `doubleGrandeJars` (Frost containers)
*   `velvetAppleBun` (Chunky apple slices spread)

---

## 3. Key Component Dependencies
When editing the catalog or ordering systems, keep these in sync:
*   `OrderingWizard.tsx`: Manages the box customization steps. Custom topping slots and standard/premium filters dynamically pull from `CAVIAR_FLAVORS`.
*   `FlavorsCarousel.tsx`: Focuses on displaying the premium "Flavors of the Month" prominent at the top.
