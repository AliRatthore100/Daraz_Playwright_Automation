# Daraz.pk Playwright Automation Project

## Project Overview
This project automates key UI workflows on Daraz.pk using Playwright and the Page Object Model (POM).

## Automated Tasks
1. Playwright project setup
2. Navigate to Daraz.pk
3. Search for "electronics"
4. Apply a brand filter
5. Apply price filter from 500 to 5000 PKR
6. Count and validate product cards
7. Open a product details page
8. Check Free Shipping availability

## Project Structure
```text
Daraz_Playwright_Automation/
├── pages/
│   ├── HomePage.js
│   ├── SearchResultsPage.js
│   └── ProductPage.js
├── tests/
│   └── daraz.spec.js
├── .gitignore
├── package.json
├── playwright.config.js
└── README.md
```

## Prerequisites
- Node.js 18+
- npm
- Internet connection

## Installation
```bash
npm install
npx playwright install
```

## Run Tests
Headless:
```bash
npm test
```

Headed:
```bash
npm run test:headed
```

Debug:
```bash
npm run test:debug
```

Open HTML report:
```bash
npm run report
```

## Notes
Daraz is a live e-commerce website, so product inventory, brand filters, pricing, shipping eligibility, popups, and page markup can change. The project therefore uses resilient locators where possible. If Daraz changes its UI, selectors in the relevant Page Object can be updated without changing the test structure.

The Free Shipping test records whether the label is offered for the selected product because shipping availability is product/location dependent.

## POM Design
- `HomePage.js` contains homepage navigation and search actions.
- `SearchResultsPage.js` contains result counting, filtering, and product-opening actions.
- `ProductPage.js` contains product-page and Free Shipping checks.
- `daraz.spec.js` contains the test scenarios and assertions.

## Submission
Push this complete folder to a Git repository and submit the repository link. Do not commit `node_modules`, test reports, or test-results because they are ignored by `.gitignore`.
