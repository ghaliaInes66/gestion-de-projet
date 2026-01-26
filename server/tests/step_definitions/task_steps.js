const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('chai');

// Given Steps
Given('the following tasks exist:', async function(dataTable) {
  const tasks = dataTable.hashes();
  for (const task of tasks) {
    // Replace placeholder with actual projectId
    if (task.projectId === '{projectId}') {
      task.projectId = this.projectId;
    }
    const response = await this.makeRequest('post', '/api/tasks', task);
    this.taskIds.push(response.body._id);
  }
});

Given('a task exists with title {string}', async function(title) {
  const response = await this.makeRequest('post', '/api/tasks', {
    title: title,
    description: 'Test task description',
    status: 'pending',
    priority: 'medium',
    duration: 3,
    projectId: this.projectId
  });
  
  // Store in different slots based on order
  if (!this.taskId) {
    this.taskId = response.body._id;
  } else if (!this.taskId2) {
    this.taskId2 = response.body._id;
  } else if (!this.taskId3) {
    this.taskId3 = response.body._id;
  }
});

Given('a task exists with status {string}', async function(status) {
  const response = await this.makeRequest('post', '/api/tasks', {
    title: 'Test Task',
    description: 'Test task description',
    status: status,
    priority: 'medium',
    duration: 3,
    projectId: this.projectId
  });
  this.taskId = response.body._id;
});

Given('a task exists with priority {string}', async function(priority) {
  const response = await this.makeRequest('post', '/api/tasks', {
    title: 'Test Task',
    description: 'Test task description',
    status: 'pending',
    priority: priority,
    duration: 3,
    projectId: this.projectId
  });
  this.taskId = response.body._id;
});

Given('a task exists without assignment', async function() {
  const response = await this.makeRequest('post', '/api/tasks', {
    title: 'Unassigned Task',
    description: 'Task without assignment',
    status: 'pending',
    priority: 'medium',
    duration: 3,
    projectId: this.projectId
  });
  this.taskId = response.body._id;
});

Given('the following tasks exist in the project:', async function(dataTable) {
  const tasks = dataTable.hashes();
  for (const task of tasks) {
    // Replace placeholder with actual projectId
    if (task.projectId === '{projectId}') {
      task.projectId = this.projectId;
    }
    task.description = task.description || 'Test description';
    task.priority = task.priority || 'medium';
    task.duration = task.duration || 3;
    
    const response = await this.makeRequest('post', '/api/tasks', task);
    this.taskIds.push(response.body._id);
  }
});

// Then Steps
Then('the response should contain {int} tasks', function(count) {
  expect(this.response.body).to.be.an('array');
  expect(this.response.body).to.have.lengthOf(count);
});

// Steps for circular dependency detection
Given('a task exists with title {string} and id {string}', async function(title, taskRef) {
  const response = await this.makeRequest('post', '/api/tasks', {
    title: title,
    description: 'Test task',
    status: 'pending',
    priority: 'medium',
    duration: 3,
    projectId: this.projectId
  });
  this[taskRef] = response.body._id;
});

Given('a task exists with title {string} with dependency {string}', async function(title, depTaskRef) {
  const response = await this.makeRequest('post', '/api/tasks', {
    title: title,
    description: 'Test task',
    status: 'pending',
    priority: 'medium',
    duration: 3,
    projectId: this.projectId,
    dependencies: [this[depTaskRef]]
  });
  const taskNum = depTaskRef.replace('task', '');
  const newTaskNum = parseInt(taskNum) + 1;
  this[`task${newTaskNum}`] = response.body._id;
});

When('I send a PUT request to update {string} to depend on {string}', async function(taskRef, depTaskRef) {
  await this.makeRequest('put', `/api/tasks/${this[taskRef]}`, {
    dependencies: [this[depTaskRef]]
  });
});

Then('the response should contain error message {string}', function(message) {
  expect(this.response.body).to.have.property('error');
  expect(this.response.body.error).to.include(message);
});
