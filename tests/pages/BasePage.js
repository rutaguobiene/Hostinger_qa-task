const { expect } = require("@playwright/test");

class BasePage {
  constructor(page) {
    this.page = page;
  }

  async waitForLoadState() {
    // Use domcontentloaded instead of networkidle for better reliability
    await this.page.waitForLoadState("domcontentloaded");
  }

  async waitForTimeout(ms) {
    await this.page.waitForTimeout(ms);
  }

  async takeScreenshot(name) {
    await this.page.screenshot({ path: `test-results/${name}.png` });
  }

  // Best practice: Add retry mechanism for flaky elements
  async waitForElementWithRetry(locator, timeout = 10000) {
    try {
      await locator.waitFor({ state: "visible", timeout });
    } catch (error) {
      console.log(`Element not found, retrying...`);
      await this.page.waitForTimeout(1000);
      await locator.waitFor({ state: "visible", timeout });
    }
  }

  // Generic error handling wrapper for actions
  async executeWithErrorHandling(action, actionName, screenshotName = null) {
    try {
      const result = await action();
      console.log(`✅ ${actionName}`);
      return result;
    } catch (error) {
      console.error(`❌ ${actionName} failed: ${error.message}`);
      const screenshotPath =
        screenshotName ||
        `${actionName.toLowerCase().replace(/\s+/g, "-")}-error`;
      await this.takeScreenshot(screenshotPath);
      throw error;
    }
  }

  // Generic click wrapper with error handling
  async clickWithErrorHandling(locator, actionName) {
    return this.executeWithErrorHandling(
      async () => await locator.click(),
      actionName
    );
  }

  // Generic fill wrapper with error handling
  async fillWithErrorHandling(locator, value, actionName) {
    return this.executeWithErrorHandling(
      async () => await locator.fill(value),
      actionName
    );
  }

  // Generic wait wrapper with error handling
  async waitForWithErrorHandling(locator, actionName, options = {}) {
    return this.executeWithErrorHandling(
      async () => await locator.waitFor(options),
      actionName
    );
  }
}

module.exports = BasePage;
