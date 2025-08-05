// Test data for products
const PRODUCT_DATA = {
  products: {
    blueberry: {
      name: "Blueberry Burst Muffins",
      price: "€3.50",
      key: "blueberry",
    },
    cookies: {
      name: "Cookies & Cream Cloud Cupcakes",
      price: "€5.00",
      key: "cookies",
    },
    daily: {
      name: "Freshly Baked Muffins Daily",
      price: "€10.00",
      key: "daily",
    },
    cupcakes: {
      name: "Choco-Caramel Drizzle Cupcakes",
      price: "€3.99",
      key: "cupcakes",
    },
    donuts: {
      name: "Glazed Paradise Donuts",
      price: "€5",
      key: "donuts",
    },
  },

  // Helper methods
  getAllProducts() {
    return Object.values(this.products);
  },

  getProductByKey(key) {
    return this.products[key];
  },

  getProductNames() {
    return Object.values(this.products).map((product) => product.name);
  },

  getProductPrices() {
    return Object.values(this.products).map((product) => product.price);
  },

  // Create test parameters for parameterized testing
  getTestParameters() {
    return Object.entries(this.products).map(([key, product]) => ({
      productKey: key,
      productName: product.name,
      productPrice: product.price,
    }));
  },

  // Data validation
  validateProductData() {
    const errors = [];

    Object.entries(this.products).forEach(([key, product]) => {
      if (!product.name) errors.push(`Product ${key} missing name`);
      if (!product.price) errors.push(`Product ${key} missing price`);
      if (!product.key) errors.push(`Product ${key} missing key`);
    });

    if (errors.length > 0) {
      throw new Error(`Product data validation failed: ${errors.join(", ")}`);
    }

    return true;
  },

  // Get random product for testing
  getRandomProduct() {
    const products = this.getAllProducts();
    return products[Math.floor(Math.random() * products.length)];
  },
};

// Validate data on module load
PRODUCT_DATA.validateProductData();

module.exports = PRODUCT_DATA;
