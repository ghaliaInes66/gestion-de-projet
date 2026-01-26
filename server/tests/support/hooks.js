const { Before, After, BeforeAll, AfterAll, setDefaultTimeout } = require('@cucumber/cucumber');
const mongoose = require('mongoose');

// Set default timeout for steps
setDefaultTimeout(10000);

// Database setup for testing
const TEST_DB_URL = 'mongodb+srv://aya:12345@smiling.pgesm.mongodb.net/gestion_de_projet_test?retryWrites=true&w=majority';

BeforeAll(async function() {
  // Connect to test database
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(TEST_DB_URL);
    console.log('Connected to test database');
  }
});

Before(async function() {
  // Clear all collections before each scenario
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

After(async function() {
  // Cleanup after each scenario
});

AfterAll(async function() {
  // Close database connection
  await mongoose.connection.close();
  console.log('Disconnected from test database');
});
