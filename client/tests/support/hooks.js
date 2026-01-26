import { Before, After, BeforeAll, AfterAll, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium } from 'playwright';
import fetch from 'node-fetch';

// Set default timeout
setDefaultTimeout(60000);

BeforeAll(async function() {
  console.log('Starting E2E tests...');
  
  // Create test user if not exists
  try {
    const response = await fetch('http://localhost:3000/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'aaa@gmail.com', password: 'aaa@gmail.com' })
    });
    
    if (!response.ok) {
      // User doesn't exist, create it
      await fetch('http://localhost:3000/api/users/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: 'Admin User',
          email: 'aaa@gmail.com', 
          password: 'aaa@gmail.com' 
        })
      });
      console.log('Test user created');
    } else {
      console.log('Test user already exists');
    }
  } catch (error) {
    console.error('Error setting up test user:', error.message);
  }
});

Before(async function() {
  // Launch browser
  this.browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  this.context = await this.browser.newContext({
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true
  });
  this.page = await this.context.newPage();
  
  // Set base URL
  this.baseURL = 'http://localhost:5173';
  this.loggedIn = false;
  this.projectId = null;
  this.taskId = null;
  this.userId = null;
  
  // Store test data
  this.testData = {
    users: [],
    projects: [],
    tasks: []
  };
});

After(async function() {
  // Close browser
  if (this.page) await this.page.close();
  if (this.context) await this.context.close();
  if (this.browser) await this.browser.close();
});

AfterAll(async function() {
  console.log('E2E tests completed');
});
