# Muffin Shop E2E Test Suite

A comprehensive end-to-end test automation suite using **Playwright** with **Page Object Model (POM)** and **parameterized testing**.

## 🏗️ Architecture

### **Page Object Model (POM)**

````
tests/pages/
├── BasePage.js          # Common page interactions
├── HomePage.js          # Home page interactions
├── ProductPage.js       # Product page interactions
├── ShoppingCartPage.js  # Shopping cart interactions
└── CheckoutPage.js      # Checkout process interactions


## 🍰 Available Products

| Product Key | Product Name                   | Price  |
| ----------- | ------------------------------ | ------ |
| `blueberry` | Blueberry Burst Muffins        | €3.50  |
| `cookies`   | Cookies & Cream Cloud Cupcakes | €5.00  |
| `daily`     | Freshly Baked Muffins Daily    | €10.00 |
| `cupcakes`  | Choco-Caramel Drizzle Cupcakes | €3.99  |
| `donuts`    | Glazed Paradise Donuts         | €5     |

## 🚀 Quick Start

### Prerequisites

```bash
npm install
npx playwright install
````

### Running Tests

```bash
# Run all parameterized tests
npx playwright test

# Run specific test file
npx playwright test tests/muffin-pom-parameterized.spec.js

# Run with headed browser
npx playwright test --headed

# Run random product test (currently skipped as could not fully test - no products in the shop)
npx playwright test tests/dynamic-random-test.spec.js
```

### **Playwright Configuration**

```javascript
// Key settings:
- testIdAttribute: "data-qa"  // Element selection
- fullyParallel: true         // Parallel execution
- retries: process.env.CI ? 2 : 0  // CI retry strategy
- reporter: "html"           // HTML reports
```
