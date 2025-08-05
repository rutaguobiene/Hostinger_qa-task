# Hostinger_qa-task

### **Core Test Flows**

1. **Complete Order Flow** (`user can place an order for {product}`)

   - Navigate → Select Product → Add to Cart → Checkout → Payment → Verify Success

2. **Discount Code Flow** (`user can place and order with a discount code for {product}`)
   - Complete order flow with "MUFFIN" discount code (10% off)

### Prerequisites

```bash
npm install
npx playwright install
```

### Running Tests

```bash
# Run all parameterized tests
npx playwright test

# Run with Playright UI
npx playwright test --ui
```
