const BasePage = require("./BasePage");
const { expect } = require("@playwright/test");

class CheckoutPage extends BasePage {
  constructor(page) {
    super(page);
  }

  // Locators - Using stable selectors
  get productDetails() {
    return this.page.getByTestId("checkout-cartsummary-item");
  }

  // Locators
  get addDiscountButton() {
    return this.page.getByTestId("checkout-cartsummary-button-adddiscountcode");
  }

  get discountInput() {
    return this.page.getByPlaceholder("Enter discount code");
  }

  get applyDiscountButton() {
    return this.page.getByTestId("checkout-cartsummary-button-discountapply");
  }

  get discountChip() {
    return this.page.getByTestId("checkout-cartsummary-discount-chip");
  }

  get discountValue() {
    return this.page.getByTestId("checkout-cartsummary-discount-value");
  }

  get discountText() {
    return this.page.discountChip().getByText("MUFFIN (10% OFF)");
  }

  get shippingDestinationSelect() {
    return this.page
      .getByTestId("checkout-shippingdestination-select")
      .getByRole("combobox");
  }

  get shippingOptionsContainer() {
    return this.page.getByTestId("checkout-shippingoptions-parcelselect");
  }

  get addressSelector() {
    return this.page.getByPlaceholder("Choose address");
  }

  get continueShippingButton() {
    return this.page.getByTestId("checkout-shippingdetails-continue", {
      exact: true,
    });
  }
  get emailField() {
    return this.page.getByRole("textbox", { name: "Email" });
  }

  get fullNameField() {
    return this.page.getByRole("textbox", { name: "Your full name" });
  }

  get phoneField() {
    return this.page.getByRole("textbox", { name: "Your phone number" });
  }

  get commentField() {
    return this.page
      .getByTestId("checkout-contactinformation-customfield")
      .getByRole("textbox");
  }

  get continueContactButton() {
    return this.page.getByTestId("checkout-contactinformation-continue");
  }

  get paymentMethodText() {
    return this.page.getByText("Payment method");
  }

  get placeOrderButton() {
    return this.page.getByTestId("checkout-paymentmethods-placeorder");
  }

  get orderSuccessText() {
    return this.page.getByText("Your order has been received.");
  }

  get gotItButton() {
    return this.page.getByRole("button", { name: "Got it" });
  }

  // Wait methods
  async waitForCheckoutPageLoad() {
    return this.executeWithErrorHandling(async () => {
      await this.page.waitForLoadState("domcontentloaded");
      await this.waitForTimeout(2000);
    }, "Waited for checkout page to load");
  }

  async waitForContactFormLoad() {
    return this.waitForWithErrorHandling(
      this.emailField,
      "Waited for contact form to load",
      { state: "visible", timeout: 10000 }
    );
  }

  async waitForShippingPageLoad() {
    return this.waitForWithErrorHandling(
      this.shippingDestinationSelect,
      "Waited for shipping page to load",
      { state: "visible", timeout: 10000 }
    );
  }

  async waitForPaymentPageLoad() {
    return this.waitForWithErrorHandling(
      this.paymentMethodText,
      "Waited for payment page to load",
      { state: "visible", timeout: 10000 }
    );
  }

  async waitForContinueButtonEnabled() {
    return this.executeWithErrorHandling(async () => {
      const continueButton = this.continueShippingButton;

      // Wait for button to be visible and enabled
      await continueButton.waitFor({ state: "visible", timeout: 10000 });

      // Wait for button to not be disabled
      await this.page.waitForFunction(
        () =>
          !document.querySelector(
            '[data-qa="checkout-shippingdetails-continue"]'
          ).disabled,
        { timeout: 10000 }
      );
    }, "Waited for Continue button to be enabled");
  }

  // Actions
  async verifyProductDetailsInCheckout(productName, productPrice) {
    return this.executeWithErrorHandling(async () => {
      await expect(this.productDetails).toContainText(productName);
      await expect(this.productDetails).toContainText(productPrice);
    }, "Verified product details in checkout");
  }

  async waitForDiscountApplied() {
    await this.waitForLoadState();
    await this.waitForTimeout(3000);
  }

  async waitForDiscountResponse() {
    return this.executeWithErrorHandling(async () => {
      // Wait for either discount chip or error message
      await Promise.race([
        this.discountChip.waitFor({ state: "visible", timeout: 15000 }),
        this.page
          .getByText(/invalid|error|not found/i)
          .waitFor({ state: "visible", timeout: 15000 }),
      ]);
    }, "Waited for discount response");
  }

  async applyDiscountCode(code = "MUFFIN", expectedDiscount) {
    return this.executeWithErrorHandling(async () => {
      // Add discount code
      await this.addDiscountButton.click();
      await this.discountInput.waitFor({ state: "visible", timeout: 10000 });
      await this.discountInput.click();
      await this.discountInput.fill(code);

      // Click apply and wait for the button to be disabled (API call started)
      await this.applyDiscountButton.click();

      // Wait for Apply button to be disabled (processing state)
      await this.page.waitForFunction(
        () => {
          const applyButton = document.querySelector(
            '[data-qa="checkout-cartsummary-button-discountapply"]'
          );
          return applyButton && applyButton.disabled;
        },
        { timeout: 5000 }
      );

      // Wait for either discount chip to appear (success) or button to be re-enabled (error)
      try {
        // Wait for discount chip to appear (success case)
        await this.discountChip.waitFor({ state: "visible", timeout: 15000 });

        // Verify discount value
        const actualDiscount = await this.discountValue.textContent();
        const expectedFormatted = `-€${expectedDiscount.toFixed(2)}`;
        await expect(this.discountValue).toContainText(expectedFormatted);
      } catch (error) {
        // If discount chip didn't appear, check if button was re-enabled (error case)
        const buttonReEnabled = await this.page
          .waitForFunction(
            () => {
              const applyButton = document.querySelector(
                '[data-qa="checkout-cartsummary-button-discountapply"]'
              );
              return applyButton && !applyButton.disabled;
            },
            { timeout: 10000 }
          )
          .catch(() => false);

        if (buttonReEnabled) {
          // Button was re-enabled, check for specific error message
          const errorMessage = this.page.locator("#discountCode-messages");
          const hasError = await errorMessage.isVisible().catch(() => false);

          if (hasError) {
            const errorText = await errorMessage.textContent();
            throw new Error(`Discount code "${code}" is invalid: ${errorText}`);
          } else {
            throw new Error(
              `Discount code "${code}" was rejected but no error message found`
            );
          }
        } else {
          // Button is still disabled, might be a timeout or other issue
          throw new Error(
            `Discount application timed out or failed for code "${code}"`
          );
        }
      }
    }, "Applied discount code");
  }

  async waitForShippingDestinationSelectToLoad() {
    return this.waitForWithErrorHandling(
      this.shippingDestinationSelect,
      "Waited for Shipping destination select to load",
      { state: "visible", timeout: 10000 }
    );
  }

  async selectShippingDestination() {
    return this.executeWithErrorHandling(async () => {
      // Wait for the shipping options container to load first
      await this.waitForShippingDestinationSelectToLoad();

      // Check if the combobox already contains "Lithuania"
      const combobox = this.shippingDestinationSelect;
      const comboboxText = await combobox.textContent();

      if (comboboxText && comboboxText.includes("Lithuania")) {
        await combobox.press("Tab");
      } else {
        // Click the shipping destination field to open dropdown
        await combobox.click();

        // Wait for dropdown to appear and select Lithuania from the listbox
        await this.page
          .getByRole("listbox")
          .getByText("Lithuania")
          .waitFor({ state: "visible", timeout: 5000 });

        await this.page.getByRole("listbox").getByText("Lithuania").click();

        // Wait a moment for the selection to register
        await this.waitForTimeout(1000);
      }

      // Verify the selection was successful
      const updatedText = await combobox.textContent();

      if (!updatedText || !updatedText.includes("Lithuania")) {
        throw new Error("Failed to select Lithuania - combobox is still empty");
      }
    }, "Selected shipping destination");
  }

  async selectShippingOption() {
    return this.executeWithErrorHandling(async () => {
      // Select the first available shipping option
      await this.addressSelector.click();
      await this.page.getByText("Akmenės NORFA Daukanto paš").click();
    }, "Selected shipping option");
  }

  async continueToContact() {
    return this.clickWithErrorHandling(
      this.continueShippingButton,
      "Continued to contact form"
    );
  }

  async fillContactForm(
    email = "test@test.com",
    name = "test user",
    phone = "+37068456784",
    comment = "-"
  ) {
    return this.executeWithErrorHandling(async () => {
      await this.fillWithErrorHandling(
        this.emailField,
        email,
        "Filled email field"
      );
      await this.fillWithErrorHandling(
        this.fullNameField,
        name,
        "Filled name field"
      );
      await this.fillWithErrorHandling(
        this.phoneField,
        phone,
        "Filled phone field"
      );
      await this.fillWithErrorHandling(
        this.commentField,
        comment,
        "Filled comment field"
      );
    }, "Filled contact form");
  }

  async continueToPayment() {
    return this.clickWithErrorHandling(
      this.continueContactButton,
      "Continued to payment"
    );
  }

  async verifyPaymentPage() {
    return this.executeWithErrorHandling(async () => {
      await this.waitForWithErrorHandling(
        this.paymentMethodText,
        "Verified payment method text",
        { state: "visible" }
      );
      await this.waitForWithErrorHandling(
        this.placeOrderButton,
        "Verified place order button",
        { state: "visible" }
      );
    }, "Verified payment page");
  }

  async placeOrder() {
    return this.clickWithErrorHandling(this.placeOrderButton, "Placed order");
  }

  async verifyOrderSuccess() {
    return this.executeWithErrorHandling(async () => {
      await this.waitForWithErrorHandling(
        this.orderSuccessText,
        "Verified order success text",
        { state: "visible" }
      );
      await this.clickWithErrorHandling(
        this.gotItButton,
        "Clicked Got it button"
      );
    }, "Verified order success");
  }

  async verifyCartEmpty() {
    return this.waitForWithErrorHandling(
      this.page.locator("header"),
      "Verified cart is empty",
      { state: "visible" }
    );
  }
}

module.exports = CheckoutPage;
