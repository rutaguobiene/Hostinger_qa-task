const { test, expect } = require("@playwright/test");
const HomePage = require("./pages/HomePage");
const ProductPage = require("./pages/ProductPage");
const ShoppingCartPage = require("./pages/ShoppingCartPage");
const CheckoutPage = require("./pages/CheckoutPage");
const PRODUCT_DATA = require("./test-data/products");

// This test will pick a different random product each time it runs
test.skip("user can place an order for a random product", async ({ page }) => {
  // Get a random product dynamically
  const randomProduct = PRODUCT_DATA.getRandomProduct();

  const homePage = new HomePage(page);
  const productPage = new ProductPage(page);
  const shoppingCartPage = new ShoppingCartPage(page);
  const checkoutPage = new CheckoutPage(page);

  // Navigate and verify home page
  await homePage.navigate();
  await homePage.verifyProductListVisible();

  // Select product and add to cart
  await homePage.selectProduct(randomProduct.name);
  await productPage.waitForAddToBagButtonReady();
  await productPage.verifyProductPageDetails(
    randomProduct.name,
    randomProduct.price
  );
  await productPage.addProductToCart();
  await productPage.verifyCartCount(1);

  // Open cart and proceed to checkout
  await productPage.openCart();
  await shoppingCartPage.verifyProductInCart(
    randomProduct.name,
    randomProduct.price
  );
  await shoppingCartPage.proceedToCheckout();
  await checkoutPage.verifyProductDetailsInCheckout(
    randomProduct.name,
    randomProduct.price
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
