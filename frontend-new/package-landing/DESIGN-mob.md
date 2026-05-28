---
name: Clinical Clarity
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#424654'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#737785'
  outline-variant: '#c3c6d6'
  surface-tint: '#0856cf'
  primary: '#0041a2'
  on-primary: '#ffffff'
  primary-container: '#0b57d0'
  on-primary-container: '#ced9ff'
  inverse-primary: '#b2c5ff'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#3d485c'
  on-tertiary: '#ffffff'
  tertiary-container: '#556074'
  on-tertiary-container: '#d0dbf3'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2ff'
  primary-fixed-dim: '#b2c5ff'
  on-primary-fixed: '#001847'
  on-primary-fixed-variant: '#0040a1'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#d8e3fb'
  tertiary-fixed-dim: '#bcc7de'
  on-tertiary-fixed: '#111c2d'
  on-tertiary-fixed-variant: '#3c475a'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
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
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The design system is engineered for a premium healthcare price comparison platform, prioritizing clarity, efficiency, and high-stakes trust. The brand personality is professional and authoritative yet accessible, removing the friction and anxiety often associated with medical diagnostics.

The visual style is **Corporate Modern**, drawing heavily from high-end SaaS dashboards. It utilizes generous whitespace to reduce cognitive load, a disciplined color palette to signify medical precision, and a structured layout that feels lightweight and responsive. The interface should evoke a sense of calm and clinical accuracy, ensuring users feel confident in their healthcare financial decisions.

## Colors

The palette is anchored by a deep **Medical Blue** (#0B57D0) for primary actions and brand presence, conveying stability and institutional trust. An **Emerald Green** (#10B981) serves as a secondary accent, used exclusively for positive indicators, price savings, and "verified" statuses.

Surface colors are strictly limited to pure white backgrounds to maintain a "clinical" feel, with **Soft Gray** (#E2E8F0) used for structural borders. Text hierarchy is managed through **Deep Navy** (#1E293B) for high-contrast readability and a secondary **Muted Slate** (#64748B) for supportive metadata.

## Typography

The design system utilizes **Inter** for all typographic roles. This choice provides a systematic, utilitarian aesthetic that excels in data-heavy environments like price comparisons and lab reports.

Hierarchy is established primarily through weight and color rather than excessive size shifts. Large display sizes use tight letter-spacing for a modern "tech" feel, while body copy remains open for maximum legibility. Labels and metadata should utilize the medium weight to stand out against background surfaces without requiring large font sizes.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy for desktop screens to ensure a professional, dashboard-like structure, transitioning to a fluid model for mobile.

- **Grid:** A 12-column system on desktop (1280px max-width) and a 4-column system on mobile.
- **Rhythm:** An 8px base unit governs all padding and margins. 
- **Density:** High whitespace is mandatory. Content groups should be separated by at least 32px (stack-lg) to maintain the "lightweight" feel. 
- **Reflow:** On mobile, side-by-side card layouts must stack vertically, and horizontal padding should reduce to 16px to maximize screen real estate for data tables.

## Elevation & Depth

This design system uses a **Tonal Layering** approach combined with subtle **Ambient Shadows**. Depth is used to signify interactivity and relative importance:

- **Level 0 (Base):** Pure white (#FFFFFF) background.
- **Level 1 (Cards/Surface):** White background with a 1px border (#E2E8F0) and a very soft, diffused shadow (0px 1px 3px rgba(0,0,0,0.05), 0px 1px 2px rgba(0,0,0,0.03)). This is the primary container for lab listings and price details.
- **Level 2 (Hover/Active):** An increased shadow depth to indicate lift, signaling clickability.
- **Level 3 (Modals/Overlays):** High-diffusion shadows with a background backdrop blur (8px) to maintain context while focusing user attention.

## Shapes

The shape language is defined as **Rounded**, utilizing a 0.5rem (8px) base radius for standard components and 1rem (16px) for major cards and containers. This balance between sharp professional lines and soft approachable corners creates a modern, high-trust healthcare aesthetic. Interactive elements like buttons and input fields should strictly adhere to the 8px radius to maintain consistency across the dashboard.

## Components

### Buttons
- **Primary:** Solid Medical Blue (#0B57D0) with white text. High-contrast, 8px radius.
- **Secondary:** White background, 1px border (#E2E8F0), Navy text.
- **Tertiary:** Ghost style, no background, primary blue text for low-priority actions.

### Cards (Lab Listings)
The core component of the platform. Must use a 16px corner radius and Level 1 elevation. Internal padding should be 24px. Use a horizontal layout for desktop (Lab Info | Stats | Price | Action) and a vertical stack for mobile.

### Input Fields & Search
Search bars should include a leading "Medical Search" icon. Borders use #E2E8F0, focusing to the primary blue with a 2px outer glow.

### Chips & Badges
- **Savings Badge:** Emerald Green background (10% opacity) with #10B981 text.
- **Category Chip:** Light Gray background with Navy text, used for filtering lab types.

### Icons
Use professional, thin-stroke (2px) medical icons. Avoid multi-color or playful illustrations; stick to monochromatic slate or primary blue for iconography to maintain a "professional tool" aesthetic.