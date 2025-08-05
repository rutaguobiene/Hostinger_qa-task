const BasePage = require("./BasePage");
const TEST_CONFIG = require("../test-data/config");
const PRODUCT_DATA = require("../test-data/products");
const { expect } = require("@playwright/test");

class ShoppingCartPage extends BasePage {
  constructor(page) {
    super(page);
  }

  // Locators
  get productName() {
    return this.page.getByTestId("builder-product-section-title");
  }

  get productPrice() {
    return this.page.getByTestId("shoppingcart-text-price");
  }

  get subtotal() {
    return this.page.getByTestId("shoppingcart-text-subtotal").locator("span");
  }

  get checkoutButton() {
    return this.page.getByTestId("shoppingcart-btn-checkout");
  }

  //Actions
  async verifyProductInCart(productName, productPrice) {
    return this.executeWithErrorHandling(async () => {
      await expect(this.productName).toContainText(productName);

      await expect(this.productPrice).toContainText(productPrice);

      await expect(this.subtotal).toContainText(productPrice);
    }, "Verified product details in cart");
  }

  async proceedToCheckout() {
    return this.clickWithErrorHandling(
      this.checkoutButton,
      "Proceeded to checkout"
    );
  }
}

module.exports = ShoppingCartPage;
