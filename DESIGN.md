---
name: Vitality Healthcare System
colors:
  surface: '#f9f9ff'
  surface-dim: '#d0daf0'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eeff'
  surface-container-high: '#dee8ff'
  surface-container-highest: '#d9e3f9'
  on-surface: '#121c2c'
  on-surface-variant: '#3e494a'
  inverse-surface: '#273141'
  inverse-on-surface: '#ebf1ff'
  outline: '#6f797a'
  outline-variant: '#bec8ca'
  surface-tint: '#006972'
  primary: '#00535b'
  on-primary: '#ffffff'
  primary-container: '#006d77'
  on-primary-container: '#9becf7'
  inverse-primary: '#82d3de'
  secondary: '#236863'
  on-secondary: '#ffffff'
  secondary-container: '#a9ece5'
  on-secondary-container: '#286d67'
  tertiary: '#434c4f'
  on-tertiary: '#ffffff'
  tertiary-container: '#5b6467'
  on-tertiary-container: '#d8e1e4'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#9ff0fb'
  primary-fixed-dim: '#82d3de'
  on-primary-fixed: '#001f23'
  on-primary-fixed-variant: '#004f56'
  secondary-fixed: '#acefe7'
  secondary-fixed-dim: '#90d3cb'
  on-secondary-fixed: '#00201e'
  on-secondary-fixed-variant: '#00504b'
  tertiary-fixed: '#dbe4e7'
  tertiary-fixed-dim: '#bfc8cb'
  on-tertiary-fixed: '#141d1f'
  on-tertiary-fixed-variant: '#3f484b'
  background: '#f9f9ff'
  on-background: '#121c2c'
  surface-variant: '#d9e3f9'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 40px
  margin-mobile: 16px
  stack-sm: 4px
  stack-md: 12px
  stack-lg: 24px
---

## Brand & Style

This design system is built upon the **Vitality Teal** narrative, prioritizing an atmosphere of healing, approachable modern healthcare, and holistic wellness. The brand personality balances clinical competence with a calming, human-centric aesthetic to reduce patient anxiety and foster trust.

The design style is **Corporate / Modern** with a slight lean towards **Minimalism**. It utilizes expansive white space, soft tonal transitions, and high-quality typography to ensure that complex diagnostic data remains legible and non-intimidating. The emotional response should be one of serenity, clarity, and optimism.

## Colors

The palette is anchored by **Deep Emerald (#006D77)**, providing a grounded, professional foundation that signifies growth and stability. **Sage (#83C5BE)** serves as the secondary action color, offering a softer alternative for secondary UI elements.

The background architecture relies on **Mint/Ice Water (#EDF6F9)** for subtle surface differentiation, replacing harsh grays with cooler, more organic tones. Text is rendered in a deep Slate neutral to maintain high contrast without the visual fatigue of pure black. Functional colors (Success, Warning, Error) should be desaturated to align with the calming nature of the primary palette.

## Typography

This design system employs **Plus Jakarta Sans** across all levels to maintain a friendly, approachable, and highly legible interface. The type scale is generous, ensuring that medical information is easily digestible for users of all ages.

Headlines use semi-bold weights with tighter letter spacing to create a modern, structured look. Body text favors a slightly increased line-height (1.5x) to improve readability in data-heavy diagnostic reports. Label styles are used for navigation, table headers, and form captions, utilizing medium and semi-bold weights for clear information hierarchy.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy on desktop to maintain clinical precision, transitioning to a **Fluid Grid** on mobile devices. A 12-column system is used for desktop (1280px max-width) with 24px gutters.

Spacing is governed by an 8px linear scale. Vertical "stack" spacing is used to group related medical data, while larger margins are used to separate distinct diagnostic sections. On mobile, horizontal margins shrink to 16px to maximize the screen real estate for charts and tables.

## Elevation & Depth

This design system uses **Tonal Layers** and **Ambient Shadows** to convey hierarchy. Depth is handled through three primary levels:

1.  **Floor (0dp):** The main background using the Tertiary color (#EDF6F9).
2.  **Surface (1dp):** White cards or containers with a very soft, diffused shadow (Blur: 12px, Y: 4px, Color: Primary at 5% opacity).
3.  **Overlay (2dp):** Modals and dropdowns with a more defined shadow and a subtle 1px border using the secondary color at 20% opacity.

Avoid heavy shadows or harsh black borders; the depth should feel "airy" and clinical.

## Shapes

The shape language is defined by a consistent **12px (0.75rem)** radius for primary UI components, aligning with the "Rounded" setting. This specific value is chosen to appear softer than traditional institutional grids while maintaining enough structure to feel professional and reliable.

- **Standard Buttons & Inputs:** 12px radius.
- **Large Cards & Containers:** 16px (rounded-lg) to 24px (rounded-xl) radius.
- **Contextual Elements (Tags/Badges):** Fully pill-shaped to differentiate them from actionable buttons.

## Components

### Buttons
Primary buttons use the Deep Emerald (#006D77) with white text. Secondary buttons use a Sage (#83C5BE) outline or a light Mint fill. Hover states should involve a subtle shift in luminosity rather than a color change.

### Input Fields
Inputs feature a 12px radius with a 1px border in a light slate. On focus, the border transitions to Deep Emerald with a 3px soft glow (shadow) using the primary color at 15% opacity.

### Cards
Cards are the primary vehicle for diagnostic data. They must be white, featuring a 16px corner radius and the "Surface" ambient shadow. Padding inside cards should be a minimum of 24px to prevent information density from feeling overwhelming.

### Diagnostic Badges
Used for status (e.g., "Normal", "Critical", "Pending"). These should be pill-shaped with a low-saturation background and a high-saturation text color for accessibility.

### Charts & Data Viz
Use the primary and secondary colors as the base for data visualization. For multi-series charts, extend the palette with muted versions of gold and lavender to ensure they do not clash with the healing teal theme.