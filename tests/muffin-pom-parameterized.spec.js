const { test, expect } = require("@playwright/test");
const HomePage = require("./pages/HomePage");
const ProductPage = require("./pages/ProductPage");
const ShoppingCartPage = require("./pages/ShoppingCartPage");
const CheckoutPage = require("./pages/CheckoutPage");
const PRODUCT_DATA = require("./test-data/products");

// Get test parameters from external data file
const testProducts = PRODUCT_DATA.getTestParameters();

// Configure parallel execution
test.describe.configure({ mode: "parallel" });

// Parameterized test for placing orders
for (const product of testProducts) {
  test(`user can place an order for ${product.productName}`, async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);
    const shoppingCartPage = new ShoppingCartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // Navigate and verify home page
    await homePage.navigate();
    await homePage.verifyProductListVisible();

    // Select product and add to cart
    await homePage.selectProduct(product.productName);
    await productPage.waitForAddToBagButtonReady();
    await productPage.verifyProductPageDetails(
      product.productName,
      product.productPrice
    );
    await productPage.addProductToCart();
    await productPage.verifyCartCount(1);

    // Open cart and proceed to checkout
    await productPage.openCart();
    await shoppingCartPage.verifyProductInCart(
      product.productName,
      product.productPrice
    );
    await shoppingCartPage.proceedToCheckout();
    await checkoutPage.verifyProductDetailsInCheckout(
      product.productName,
      product.productPrice
    );

    // Handle shipping
    await checkoutPage.selectShippingDestination();
    await checkoutPage.selectShippingOption();
    await checkoutPage.continueToContact();

    // Fill contact form
    await checkoutPage.fillContactForm();
    await checkoutPage.continueToPayment();

    // Complete payment
    await checkoutPage.verifyPaymentPage();
    await checkoutPage.placeOrder();
    await checkoutPage.verifyOrderSuccess();
    await checkoutPage.verifyCartEmpty();
  });
}

// Parameterized test for discount application
for (const product of testProducts) {
  test(`user can place and order with a discount code for ${product.productName}`, async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);
    const shoppingCartPage = new ShoppingCartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // Navigate and add product to cart
    await homePage.navigate();
    await homePage.selectProduct(product.productName);
    await productPage.waitForAddToBagButtonReady();
    await productPage.addProductToCart();

    // Open cart and proceed to checkout
    await productPage.openCart();
    await shoppingCartPage.proceedToCheckout();

    // Handle shipping
    await checkoutPage.selectShippingDestination();

    // Apply discount code
    const productPriceNum = parseFloat(product.productPrice.replace("€", ""));
    const expectedDiscount = (productPriceNum * 10) / 100;

    await checkoutPage.applyDiscountCode("MUFFIN", expectedDiscount);
    await checkoutPage.selectShippingOption();
    await checkoutPage.continueToContact();

    // Fill contact form
    await checkoutPage.fillContactForm();
    await checkoutPage.continueToPayment();
    await checkoutPage.placeOrder();
    await checkoutPage.verifyOrderSuccess();
  });
}

// Parameterized test for removing from cart
for (const product of testProducts) {
  test(`user can remove ${product.productName} from shopping cart`, async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);

    await homePage.navigate();
    await homePage.selectProduct(product.productName);
    await productPage.waitForAddToBagButtonReady();
    await productPage.addProductToCart();
    await productPage.openCart();

    // Remove item
    const removeButton = page.getByTestId("shoppingcart-btn-delete");

    await removeButton.first().click();
    await productPage.waitForLoadState();
    await productPage.waitForTimeout(1000);

    // Verify cart is empty
    await expect(
      page.getByTestId("shoppingcart-text-emptystate")
    ).toBeVisible();
    await expect(page.getByText("Shopping bag is empty")).toBeVisible();
  });
}
