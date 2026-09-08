SCRIBBLY — HCI CCP FRONT-END PROTOTYPE

Main screens:
- index.html — home / landing page
- products.html — product browsing, search and filters
- product.html — reusable product-detail screen using ?id=
- cart.html — editable shopping bag with undo
- checkout.html — validated checkout with review-before-confirm
- login.html — user login
- signup.html — user registration
- dashboard.html — user dashboard

Supporting files:
- styles.css — responsive design system for desktop, tablet and mobile
- script.js — store interactions, validation, localStorage state and feedback
- img/ — supplied Scribbly logo, mascot and product images
- graphics/supporting-artifacts/ — four branded supporting visuals/mockups
- project-docs/ — HCI project notes, brand guide and usability-test plan

How to use:
1. Open index.html in a modern browser or serve the folder as a static website.
2. Account, bag and order state are stored in the browser using localStorage.

Prototype flows:
- Registration: Home → Sign up → Dashboard → Products
- Purchase: Products → Product detail → Bag → Checkout → Review → Confirm → Dashboard

The prototype includes responsive layouts, visible feedback, readable controls, form validation, error recovery, quantity constraints, undo on removal, keyboard focus states, clear system-status messages and review-before-confirm behavior.
