// Test configuration
const TEST_CONFIG = {
  // Base URL for the application
  baseUrl: "https://lightgrey-antelope-m7vwozwl8xf7l3y2.builder-preview.com/",

  // Test timeouts
  timeouts: {
    default: 30000,
    short: 5000,
    long: 60000,
    element: 10000,
    navigation: 15000,
  },

  // Test data
  testData: {
    contactInfo: {
      email: "test@test.com",
      name: "test user",
      phone: "+37068456784",
      comment: "-",
    },
    discountCode: "MUFFIN",
    discountPercentage: 10,
    shippingCountry: "Lithuania",
    shippingAddress: "Akmenės NORFA Daukanto paš",
  },

  // Wait strategies
  waitStrategies: {
    networkIdle: "networkidle",
    domContentLoaded: "domcontentloaded",
    load: "load",
  },

  // Browser configurations
  browsers: {
    chromium: {
      headless: false,
      slowMo: 1000,
    },
    firefox: {
      headless: false,
      slowMo: 1000,
    },
    webkit: {
      headless: false,
      slowMo: 1000,
    },
  },

  // Retry configuration
  retry: {
    maxRetries: 2,
    retryDelay: 1000,
  },

  // Screenshot configuration
  screenshots: {
    onFailure: true,
    onSuccess: false,
    path: "test-results/screenshots",
  },
};

module.exports = TEST_CONFIG;
