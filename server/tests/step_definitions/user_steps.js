const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('chai');

// Given Steps
Given('a user exists with email {string}', async function(email) {
  await this.makeRequest('post', '/api/users', {
    name: 'Test User',
    email: email,
    password: 'Test123!'
  });
});

Given('the following users exist:', async function(dataTable) {
  const users = dataTable.hashes();
  for (const user of users) {
    const response = await this.makeRequest('post', '/api/users', user);
    this.userIds.push(response.body._id);
  }
});

Given('a user exists with name {string}', async function(name) {
  const response = await this.makeRequest('post', '/api/users', {
    name: name,
    email: `${name.toLowerCase().replace(/\s+/g, '')}@test.com`,
    password: 'Test123!'
  });
  this.userId = response.body._id;
});

// When Steps
When('I send a POST request to {string} with data:', async function(path, dataTable) {
  const data = dataTable.hashes()[0];
  
  // Replace placeholders in data
  if (data.projectId === '{projectId}') {
    data.projectId = this.projectId;
  }
  if (data.assignedTo === '{userId}') {
    data.assignedTo = this.userId;
  }
  
  await this.makeRequest('post', path, data);
});

When('I send a GET request to {string}', async function(path) {
  // Replace placeholders with actual IDs
  path = path.replace('{userId}', this.userId);
  path = path.replace('{projectId}', this.projectId);
  path = path.replace('{taskId}', this.taskId);
  await this.makeRequest('get', path);
});

When('I send a PUT request to {string} with data:', async function(path, dataTable) {
  const data = dataTable.hashes()[0];
  // Replace placeholders
  path = path.replace('{userId}', this.userId);
  path = path.replace('{projectId}', this.projectId);
  path = path.replace('{taskId}', this.taskId);
  
  // Replace placeholders in data
  if (data.assignedTo === '{userId}') {
    data.assignedTo = this.userId;
  }
  
  // Handle dependencies array
  if (data.dependencies) {
    // Parse string array like "[{taskId2}]" into actual array
    if (typeof data.dependencies === 'string') {
      // Remove brackets and parse
      let depStr = data.dependencies.replace('[', '').replace(']', '');
      // Replace taskId placeholders
      depStr = depStr.replace('{taskId}', this.taskId);
      depStr = depStr.replace('{taskId2}', this.taskId2);
      depStr = depStr.replace('{taskId3}', this.taskId3);
      // Convert to array
      data.dependencies = depStr ? [depStr] : [];
    }
  }
  
  await this.makeRequest('put', path, data);
});

When('I send a DELETE request to {string}', async function(path) {
  // Replace placeholders
  path = path.replace('{userId}', this.userId);
  path = path.replace('{projectId}', this.projectId);
  path = path.replace('{taskId}', this.taskId);
  await this.makeRequest('delete', path);
});

// Then Steps
Then('the response status code should be {int}', function(statusCode) {
  expect(this.response.status).to.equal(statusCode);
});

Then('the response should contain property {string} with value {string}', function(property, value) {
  expect(this.response.body).to.have.property(property);
  expect(this.response.body[property]).to.equal(value);
});

Then('the response should contain property {string}', function(property) {
  expect(this.response.body).to.have.property(property);
});

Then('the response should contain {int} users', function(count) {
  expect(this.response.body).to.be.an('array');
  expect(this.response.body).to.have.lengthOf(count);
});
