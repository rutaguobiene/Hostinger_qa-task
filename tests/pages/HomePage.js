const BasePage = require("./BasePage");
const TEST_CONFIG = require("../test-data/config");
const PRODUCT_DATA = require("../test-data/products");
const { expect } = require("@playwright/test");

class HomePage extends BasePage {
  constructor(page) {
    super(page);
    this.url = TEST_CONFIG.baseUrl;
  }

  // Locators
  get productList() {
    return this.page.getByTestId("product-list-section-item-title");
  }

  // Actions
  async navigate() {
    return this.executeWithErrorHandling(async () => {
      await this.page.goto(this.url);
      await this.waitForLoadState();
    }, `Navigated to ${this.url}`);
  }

  async selectProduct(productName) {
    return this.clickWithErrorHandling(
      this.page.getByRole("link", { name: productName }),
      `Selected product: ${productName}`
    );
  }

  async verifyAddToBagButtonIsVisible() {
    return this.executeWithErrorHandling(async () => {
      // Verify "Add to bag" button is visible
      await this.page
        .getByRole("button", { name: "Add to bag" })
        .waitFor({ state: "visible", timeout: 10000 });

      await expect(
        this.page.getByRole("button", { name: "Add to bag" })
      ).toContainText("Add to bag");
    }, "Verified Add to bag button is visible");
  }

  async verifyProductListVisible() {
    return this.executeWithErrorHandling(async () => {
      // Wait for at least one product to be visible using text from our test data
      // This is more reliable than waiting for the test ID which might not be immediately visible
      const firstProductName = PRODUCT_DATA.getAllProducts()[0].name;
      await this.page
        .getByText(firstProductName)
        .waitFor({ state: "visible", timeout: 10000 });

      // Also verify that the product list container is present (but don't wait for it to be visible)
      await this.productList
        .first()
        .waitFor({ state: "attached", timeout: 5000 });
    }, "Verified product list visible");
  }
}

module.exports = HomePage;
