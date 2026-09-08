# Scribbly HCI CCP Project Notes

## 1. Problem Definition & User Analysis

Scribbly is a child-friendly stationery e-commerce concept designed to make browsing and choosing everyday school supplies simple, colorful and enjoyable. The interface prioritizes readability, low cognitive load, clear navigation, visible feedback and easy recovery from mistakes.

Primary users: school-age students who want bright, easy-to-understand stationery choices.

Stakeholder groups: students, parents/guardians, Scribbly business/marketing team, and the development/design team.

### User persona

Name: Areeba Khan

Age: 13

Context: Uses a phone and a family tablet to look for school supplies and creative stationery. She likes colorful products but gets frustrated when buttons are tiny, pages feel crowded, product images are unclear, or she cannot tell whether an action worked.

Goals: Find products quickly, understand prices, add or remove items easily, sign in without confusion, and review everything before a demo order.

Pain points: Small text, low-contrast buttons, cropped product images, broken mobile layouts, unclear form errors, hidden navigation, and accidental actions that cannot be undone.

Major usability requirements: responsive layout, readable text, visible button states, clear labels, consistent navigation, keyboard focus, understandable errors, persistent bag state, confirmation before final demo order, and undo for item removal.

## 2. Information Architecture & User Flows

### Sitemap

Home
- Products preview
- About
- FAQs
- School Orders
- Contact

Products
- Product detail
- Add to bag

Cart
- Edit quantity
- Remove/undo
- Checkout

Checkout
- Delivery details
- Payment choice
- Review
- Confirm demo order

Account
- Login
- Sign up
- Dashboard
- Logout

### User flow 1: Registration

Home → Sign up → Complete required fields → Resolve any visible validation errors → Create demo account → Dashboard → Continue shopping

### User flow 2: Purchase prototype

Home/Products → Product detail → Choose quantity → Add to bag → Cart → Edit or remove if needed → Checkout → Enter delivery details → Review demo order → Confirm → Dashboard

## 3. Brand Identity / Visual Design

Logo: the original Scribbly mascot and wordmark supplied for the project are preserved.

Primary colors:
- #6D71BF Scribbly violet
- #C3C4E3 soft lavender
- #3F3F90 deep violet
- #F5F39A soft yellow

Supporting accent colors are used carefully for child-friendly variety while the logo palette remains dominant.

Typography:
- DM Sans for interface text, headings, forms and navigation
- Gloria Hallelujah for handwritten accent words only

Accessibility and readability decisions:
- Body text uses readable sizing and line height.
- Primary buttons use dark violet with white text for stronger contrast.
- Focus-visible outlines are provided for keyboard users.
- Form errors appear next to the related field and are announced through status areas.
- Images include meaningful alt text.
- Reduced-motion preferences are respected.
- Product imagery uses square media areas and fills the available frame without white layout gaps.

## 4. Online Presence Design

Connected interface screens included in this coded prototype:
1. Home
2. Products
3. Product detail
4. Cart
5. Checkout
6. Login
7. Sign up
8. User dashboard

The same header, navigation language, color system, button styling, icon style and responsive rules are reused across the experience.

## 5. Branded Supporting Artifacts

The folder graphics/supporting-artifacts contains four branded visual artifacts/mockups that follow the Scribbly identity.

## 6. Interactive Prototype

The website itself is a connected front-end prototype with working navigation, demo authentication, persistent localStorage bag, editable cart, checkout review and feedback states. If the instructor specifically requires a Figma/Adobe XD/Canva link, reproduce these connected screens in the approved tool or confirm that a coded prototype is accepted as the “another approved tool” option in the brief.

## 7. Usability Evaluation

Real usability evidence should be collected from at least five actual participants. Do not fabricate results. Use Usability-Test-Plan.md to record task completion, time, errors, ratings and observations. After testing, identify at least five observed issues and document the design changes made in response.

## 8. HCI Principles Applied

Visibility of system status: bag counts, added states, toast messages, form status, dashboard state and checkout review.

Match with the real world: familiar terms such as bag, checkout, quantity, delivery, login and dashboard.

User control and freedom: editable quantities, removable items, undo remove, back links, review-before-confirm and logout.

Consistency and standards: repeated header, typography, buttons, icons, spacing and interaction patterns.

Error prevention: required-field guidance, password confirmation, quantity limits, review-before-confirm and disabled checkout when the bag is empty.

Recognition rather than recall: visible product cards, labels, prices, categories and dashboard quick links.

Flexibility and efficiency: search, category filters, persistent bag and direct quick links.

Aesthetic and minimalist design: clear hierarchy, generous spacing and limited primary palette with playful accents.

Error recovery: inline messages explain what needs correction without clearing entered data.

Help and documentation: FAQ section, field helper text and demo notices explain the prototype.

Norman principles: visibility, feedback, constraints, mapping, consistency, affordance and conceptual model are reflected through visible controls, immediate feedback, limited quantities, familiar control placement and consistent button styling.

Shneiderman rules: consistency, shortcuts through search/quick links, informative feedback, clear dialog closure in checkout, error prevention, reversible actions, user control and reduced memory load are represented in the interface.
