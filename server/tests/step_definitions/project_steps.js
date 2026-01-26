const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('chai');

// Given Steps
Given('the following projects exist:', async function(dataTable) {
  const projects = dataTable.hashes();
  for (const project of projects) {
    const response = await this.makeRequest('post', '/api/projects', project);
    this.projectIds.push(response.body._id);
  }
});

Given('a project exists with name {string}', async function(name) {
  const response = await this.makeRequest('post', '/api/projects', {
    name: name,
    description: 'Test project description',
    startDate: '2024-01-01',
    endDate: '2024-12-31'
  });
  this.projectId = response.body._id;
});

// Then Steps
Then('the response should contain {int} projects', function(count) {
  expect(this.response.body).to.be.an('array');
  expect(this.response.body).to.have.lengthOf(count);
});
