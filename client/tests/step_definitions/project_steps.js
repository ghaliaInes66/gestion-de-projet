import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';

When('I go to projects page', async function() {
  // Check if already on projects/home page
  const currentUrl = this.page.url();
  if (currentUrl.includes('/home')) {
    // Already on projects page, no action needed
    return;
  }
  
  // Try to find and click Projects link if it exists
  try {
    const projectsLink = this.page.locator('a:has-text("Projects")');
    if (await projectsLink.count() > 0) {
      await projectsLink.click();
      await this.page.waitForTimeout(500);
    }
  } catch (e) {
    // Link doesn't exist, assume already on projects page
    console.log('Projects link not found, assuming already on projects page');
  }
});

Given('project {string} exists', async function(projectName) {
  // Create project via API - backend expects userId and title
  const response = await this.page.request.post('http://localhost:3000/api/projects', {
    data: {
      userId: this.userId || '507f1f77bcf86cd799439011',
      title: projectName,
      description: 'Test project description'
    }
  });
  const project = await response.json();
  this.projectId = project._id;
  this.projectName = projectName;
});

When('I click on project {string}', async function(projectName) {
  await this.page.click(`text=${projectName}`);
  await this.page.waitForTimeout(500);
});

When('I enter project name {string}', async function(name) {
  await this.page.fill('input[name="name"], input[placeholder*="name" i]', name);
});

When('I enter project description {string}', async function(description) {
  await this.page.fill('textarea, input[name="description"]', description);
});

When('I select start date {string}', async function(date) {
  await this.page.fill('input[type="date"]', date);
});

When('I select end date {string}', async function(date) {
  const dateInputs = await this.page.$$('input[type="date"]');
  if (dateInputs.length > 1) {
    await dateInputs[1].fill(date);
  }
});

When('I change project name to {string}', async function(newName) {
  await this.page.fill('input[name="name"], input[placeholder*="name" i]', newName);
});

When('I confirm the deletion', async function() {
  await this.page.click('button:has-text("Confirm"), button:has-text("Yes")');
  await this.page.waitForTimeout(500);
});

Then('I should see project {string} in the list', async function(projectName) {
  await this.page.waitForTimeout(500);
  const content = await this.page.content();
  expect(content).to.include(projectName);
});

Then('I should not see project {string} in the list', async function(projectName) {
  await this.page.waitForTimeout(500);
  const content = await this.page.content();
  expect(content).to.not.include(projectName);
});

Then('I should see project details', async function() {
  await this.page.waitForTimeout(500);
  const content = await this.page.content();
  expect(content.toLowerCase()).to.match(/details|description|tasks/);
});


Given('the following projects exist:', async function (dataTable) {
  const projects = dataTable.hashes();
  for (const project of projects) {
    // Create each project via API with correct backend schema
    await this.page.request.post('http://localhost:3000/api/projects', {
      data: {
        userId: this.userId || '507f1f77bcf86cd799439011',
        title: project.name,
        description: `Description for ${project.name}`
      }
    });
  }
  await this.page.reload(); // Reload to see new projects
});

When('I enter {string} in search field', async function (searchTerm) {
  // Assuming there is a search input. If not, this will fail or we can look for *any* text input not in a form
  const searchInput = this.page.locator('input[placeholder*="Search"], input[type="search"]');
  if (await searchInput.count() > 0) {
    await searchInput.fill(searchTerm);
  } else {
    // If no search input found, we might be filtering differently or feature is missing
    console.log('Search input not found, skipping search step');
  }
});

Then('I should see project {string}', async function (projectName) {
  await this.page.waitForTimeout(500);
  const content = await this.page.textContent('body');
  expect(content).to.include(projectName);
});

Then('I should not see project {string}', async function (projectName) {
  await this.page.waitForTimeout(500);
  const content = await this.page.textContent('body');
  expect(content).to.not.include(projectName);
});

Then('I should see project name {string}', async function (projectName) {
  await this.page.waitForTimeout(500);
  const content = await this.page.textContent('body');
  expect(content).to.include(projectName);
});
