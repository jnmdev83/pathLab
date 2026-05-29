---
name: Clinical Clarity
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#424654'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#737785'
  outline-variant: '#c3c6d6'
  surface-tint: '#0856cf'
  primary: '#0041a2'
  on-primary: '#ffffff'
  primary-container: '#0b57d0'
  on-primary-container: '#ced9ff'
  inverse-primary: '#b2c5ff'
  secondary: '#006e2c'
  on-secondary: '#ffffff'
  secondary-container: '#86f898'
  on-secondary-container: '#00722f'
  tertiary: '#802b00'
  on-tertiary: '#ffffff'
  tertiary-container: '#a83b00'
  on-tertiary-container: '#ffcfbe'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2ff'
  primary-fixed-dim: '#b2c5ff'
  on-primary-fixed: '#001847'
  on-primary-fixed-variant: '#0040a1'
  secondary-fixed: '#89fa9b'
  secondary-fixed-dim: '#6ddd81'
  on-secondary-fixed: '#002108'
  on-secondary-fixed-variant: '#005320'
  tertiary-fixed: '#ffdbce'
  tertiary-fixed-dim: '#ffb599'
  on-tertiary-fixed: '#370e00'
  on-tertiary-fixed-variant: '#7f2b00'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 52px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  body-lg:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 20px
    fontWeight: '400'
    lineHeight: 32px
  body-md:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  label-md:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 20px
    letterSpacing: 0.03em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  gutter-desktop: 32px
  margin-desktop: 64px
  gutter-mobile: 16px
  margin-mobile: 20px
  section-gap: 80px
---

## Brand & Style

This design system is built on the pillars of **Human-Centric Clinical Precision**. It balances the rigorous, high-contrast standards required for medical accessibility with a warm, approachable aesthetic that reduces user anxiety during lab test selection. 

The visual style is **Corporate Modern** with a focus on **Minimalism**. It utilizes generous white space to allow for high cognitive load management—essential for elder users—while maintaining a sharp, data-driven efficiency that appeals to younger, tech-savvy demographics. The interface should feel transparent, authoritative, and frictionless. 

Key principles:
- **Absolute Legibility:** Every decision prioritizes reading speed and comprehension.
- **Calm Authority:** A professional color palette that instills confidence in medical data.
- **Predictable Interaction:** Navigation and interactive elements follow standard mental models to accommodate varying digital literacy levels.

## Colors

The palette is anchored in **Deep Medical Blue (#0B57D0)**, specifically chosen to meet WCAG AAA contrast requirements against white backgrounds, ensuring the most critical information is accessible to users with visual impairments. 

- **Primary (Deep Medical Blue):** Used for navigation, primary buttons, and headings. It signifies stability and clinical trust.
- **Secondary (Soft Mint Green):** Reserved for "Success" states, price drops, and health-positive indicators. It provides a calming counterpoint to the primary blue.
- **Accent (Warm Orange):** Applied sparingly for high-priority Call to Actions (CTAs) and urgent alerts to ensure they stand out without causing alarm.
- **Neutral (Grays/White):** The background hierarchy uses `#FFFFFF` for the primary canvas and `#F8F9FA` for secondary sections or card backgrounds to create subtle visual grouping.

## Typography

Typography is the backbone of this design system's accessibility. We use **Plus Jakarta Sans** for headlines to provide a modern, friendly character. For all functional text, body copy, and labels, we utilize **Atkinson Hyperlegible Next**, a typeface specifically designed to increase character recognition and improve legibility for low-vision readers.

The type scale is intentionally oversized. The base body size starts at **18px** to ensure elders can navigate the platform without zooming. Line heights are kept generous (1.5x - 1.6x) to prevent lines of text from blurring together for users with astigmatism or cognitive fatigue.

## Layout & Spacing

The layout follows a **Fixed Grid** model on desktop (max-width 1280px) to maintain readable line lengths for medical content. On mobile, it transitions to a **Fluid 4-Column Grid**.

- **Rhythm:** An 8px linear scale governs all spacing.
- **Sectioning:** Large gaps (80px+) are used to separate different phases of the user journey (e.g., Search vs. Results vs. Educational content).
- **Touch Targets:** All interactive elements maintain a minimum hit area of 48x48px to accommodate users with reduced motor precision.
- **Content Density:** Low density is preferred. Every card or comparison table must have significant internal padding (min 24px) to prevent visual overwhelm.

## Elevation & Depth

To maintain a "clinical yet warm" feel, the system uses **Ambient Shadows** rather than harsh borders. This creates a soft, layered environment that feels modern and inviting.

- **Level 0 (Base):** `#F8F9FA` background.
- **Level 1 (Cards):** White surface with a soft, diffused shadow (0px 4px 20px rgba(11, 87, 208, 0.05)). The slight blue tint in the shadow maintains brand consistency.
- **Level 2 (Interactive/Hover):** Increased shadow spread and slightly more opacity to indicate lift.
- **Tonal Layers:** Used for "Comparison Trays" or "Sticky Navigation," utilizing backdrop blurs (20px) to maintain context of the content underneath while focusing the user on the current action.

## Shapes

The shape language uses **Rounded (Level 2)** corners. This 0.5rem (8px) base radius removes the "sharpness" of traditional clinical software, making the platform feel safer and more user-friendly. 

- **Cards & Containers:** 1rem (16px) for large containers to emphasize the "soft" feel.
- **Buttons & Inputs:** 0.5rem (8px) to maintain a professional, structured appearance.
- **Trust Badges:** Fully pill-shaped (rounded-full) to distinguish them from interactive buttons.

## Components

### Hero Search Bar
The central entry point. It must be oversized (64px height) with a prominent "Primary Blue" search icon. Use a large shadow on focus to dim the rest of the UI, helping elders focus on the input task.

### Comparison Cards
Cards must display three clear hierarchies:
1. **Price:** Large, bold primary color text.
2. **Lab Name:** Medium headline weight.
3. **Turnaround Time:** Clear label with a "clock" icon.
Include a "Compare" checkbox in the top right corner that is large and easy to toggle.

### Trust Badges
Small, pill-shaped indicators. 
- **Certified Lab:** Secondary Mint Green background with a white checkmark.
- **Best Price:** Primary Blue background with a small white tag icon.
Badges should always be placed in the same relative position (top left of cards) for scanning consistency.

### Input Fields
Inputs must have high-contrast borders (1.5px) and clear floating labels. Error states must use both color (Red) and an icon (Alert) to ensure accessibility for color-blind users.

### Navigation
- **Desktop:** Simple top-bar with text-only links for clarity. CTAs (e.g., "Sign In") should be outlined to distinguish from the primary "Book Now" actions.
- **Mobile:** A fixed bottom navigation bar with large icons and labels (12px) for the most common tasks: Search, Comparisons, and Profile.