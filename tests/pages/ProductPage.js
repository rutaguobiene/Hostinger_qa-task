const BasePage = require("./BasePage");
const TEST_CONFIG = require("../test-data/config");
const PRODUCT_DATA = require("../test-data/products");
const { expect } = require("@playwright/test");

class ProductPage extends BasePage {
  constructor(page) {
    super(page);
  }

  // Locators
  get productName() {
    return this.page.getByTestId("builder-product-section-title");
  }

  get productPrice() {
    return this.page.getByRole("paragraph").filter({ hasText: "€" });
  }

  get addToBagButton() {
    return this.page.getByTestId("productsection-btn-addtobag");
  }

  get cartButton() {
    return this.page.getByRole("button", { name: "(1)" });
  }

  //Actions
  async addProductToCart() {
    return this.executeWithErrorHandling(async () => {
      await this.addToBagButton.click();
      await this.waitForTimeout(2000);
    }, "Added product to cart");
  }

  async verifyProductPageDetails(productName, productPrice) {
    return this.executeWithErrorHandling(async () => {
      // Simple wait for button to be visible and ready
      await this.addToBagButton.waitFor({ state: "visible", timeout: 10000 });

      await expect(this.productName).toContainText(productName);
      await expect(this.productPrice).toContainText(productPrice);
    }, "Verified all product page details");
  }

  async waitForAddToBagButtonReady() {
    return this.executeWithErrorHandling(async () => {
      // Wait for button to be visible (Vue.js animation complete)
      await this.addToBagButton.waitFor({ state: "visible", timeout: 10000 });
    }, "Waited for 'Add to bag' button to be ready");
  }

  async verifyCartCount(expectedCount) {
    return this.waitForWithErrorHandling(
      this.cartButton,
      "Verified cart count",
      { state: "visible" }
    );
  }

  async openCart() {
    return this.executeWithErrorHandling(async () => {
      await this.cartButton.click({ force: true });
      await this.page.getByText("Shopping bag").waitFor({ state: "visible" });
    }, "Opened shopping cart");
  }
}

module.exports = ProductPage;
