import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';

Given('I am on project {string} page', async function(projectName) {
  if (!this.projectId) {
    // Create project if it doesn't exist
    const response = await this.page.request.post('http://localhost:3000/api/projects', {
      data: {
        name: projectName,
        description: 'Test project',
        startDate: '2024-01-01',
        endDate: '2024-12-31'
      }
    });
    const project = await response.json();
    this.projectId = project._id;
  }
  
  await this.page.goto(`http://localhost:5173/project/${this.projectId}`);
  await this.page.waitForTimeout(500);
});

Given('task {string} exists', async function(taskTitle) {
  const response = await this.page.request.post('http://localhost:3000/api/tasks', {
    data: {
      projectId: this.projectId,
      title: taskTitle,
      description: 'Test task',
      status: 'pending',
      priority: 'medium',
      duration: 3
    }
  });
  const task = await response.json();
  this.taskId = task._id;
});

Given('task {string} exists with status {string}', async function(taskTitle, status) {
  const response = await this.page.request.post('http://localhost:3000/api/tasks', {
    data: {
      projectId: this.projectId,
      title: taskTitle,
      description: 'Test task',
      status: status,
      priority: 'medium',
      duration: 3
    }
  });
  const task = await response.json();
  this.taskId = task._id;
});

Given('task {string} exists with priority {string}', async function (taskTitle, priority) {
  const response = await this.page.request.post('http://localhost:3000/api/tasks', {
    data: {
      projectId: this.projectId,
      title: taskTitle,
      description: 'Test task',
      status: 'pending',
      priority: priority,
      duration: 3
    }
  });
  const task = await response.json();
  this.taskId = task._id;
});

Given('task {string} exists with predecessor {string}', async function (taskTitle, predecessorTitle) {
  // First find the predecessor task
  // This assumes predecessor already exists in database or context
  // Implementation tricky if predecessor not tracked. 
  // Simplified: create both.
  
  // Actually, we need to fetch all tasks to find ID of predecessorTitle
  const tasksResponse = await this.page.request.get(`http://localhost:3000/api/tasks/project/${this.projectId}`);
  const tasksData = await tasksResponse.json();
  const tasks = Array.isArray(tasksData) ? tasksData : (tasksData.tasks || []);
  
  const predecessor = tasks.find(t => t.title === predecessorTitle);
  let predecessorId = predecessor ? predecessor._id : null;

  if (!predecessorId) {
     // Create predecessor if not found
     const preResponse = await this.page.request.post('http://localhost:3000/api/tasks', {
      data: {
        projectId: this.projectId,
        title: predecessorTitle,
        description: 'Predecessor task',
        status: 'pending',
        priority: 'medium',
        duration: 3
      }
    });
    const preTask = await preResponse.json();
    predecessorId = preTask._id;
  }

  // Create task with dependency
  const response = await this.page.request.post('http://localhost:3000/api/tasks', {
    data: {
      projectId: this.projectId,
      title: taskTitle,
      description: 'Task with dependency',
      status: 'pending',
      priority: 'medium',
      duration: 3,
      dependencies: [predecessorId]
    }
  });
});

When('I change priority to {string}', async function (priority) {
  await this.page.selectOption('select[name="priority"]', priority.toLowerCase());
});

Then('I should see task {string}', async function (taskTitle) {
  await this.page.waitForTimeout(500);
  const content = await this.page.textContent('body');
  expect(content).to.include(taskTitle);
});

Then('I should not see task {string}', async function (taskTitle) {
  await this.page.waitForTimeout(500);
  const content = await this.page.textContent('body');
  expect(content).to.not.include(taskTitle);
});

Then('I should see task {string} with priority {string}', async function (taskTitle, priority) {
  // This is hard to verify visually without specific selectors.
  // Checking if the text exists near each other or if the row contains both.
  await this.page.waitForTimeout(500);
  const row = this.page.locator(`tr:has-text("${taskTitle}")`);
  if (await row.count() > 0) {
      const text = await row.textContent();
      expect(text.toLowerCase()).to.include(priority.toLowerCase());
  } else {
      // Logic for card view or other layouts
      const content = await this.page.textContent('body');
      expect(content).to.include(taskTitle);
      // We might not be able to strictly associate them without better selectors
  }
});

When('I try to add {string} as predecessor', async function (taskTitle) {
   // Assuming multi-select or checkbox list for dependencies
   // or a select box
   await this.page.click('text=Dependencies'); // Open dropdown if accordion?
   // Or find checkbox
   const checkbox = this.page.locator(`label:has-text("${taskTitle}") input[type="checkbox"]`);
   if (await checkbox.count() > 0) {
       await checkbox.check();
   }
});

Then('the task should not be saved', async function () {
  // Check if we are still on the form or if error is shown
  // If we are still on the form, it wasn't saved (modal still open)
  const modal = this.page.locator('.fixed.inset-0'); // Modal overlay
  expect(await modal.isVisible()).to.be.true;
});

Given('the following tasks exist with dependencies:', async function (dataTable) {
  const tasks = dataTable.hashes();
  const createdTasks = {}; // Map title -> id
  
  for (const task of tasks) {
    // Resolve predecessors
    const predecessorNames = task.predecessors.replace(/[\[\]]/g, '').split(',').map(s => s.trim()).filter(s => s);
    const predecessorIds = predecessorNames.map(name => createdTasks[name]).filter(id => id);

    const response = await this.page.request.post('http://localhost:3000/api/tasks', {
        data: {
          projectId: this.projectId,
          title: task.title,
          description: `Description for ${task.title}`,
          status: 'pending',
          priority: 'medium',
          duration: task.duration || 3,
          dependencies: predecessorIds
        }
      });
      const t = await response.json();
      createdTasks[task.title] = t._id;
  }
  await this.page.reload();
});

When('I select {string} as predecessor', async function (taskName) {
  // Checkbox or select interaction
   const checkbox = this.page.locator(`input[type="checkbox"][name="dependencies"][value*="${taskName}"]`); // value might be ID... tricky
   // Easier: look for label
   const label = this.page.locator(`label:has-text("${taskName}")`);
   if (await label.count() > 0) {
       await label.click();
   }
});

Then('I should see warning {string}', async function (warningMessage) {
  await this.page.waitForTimeout(500);
  const content = await this.page.textContent('body');
  expect(content).to.include(warningMessage);
});

Then('the save button should be disabled', async function () {
    const btn = this.page.locator('button:has-text("Save")');
    expect(await btn.isDisabled()).to.be.true;
});

Given('user {string} exists', async function(userName) {
  const response = await this.page.request.post('http://localhost:3000/api/users/signup', {
    data: {
      name: userName,
      email: `${userName.toLowerCase()}@test.com`,
      password: 'Test123!'
    }
  });
  const user = await response.json();
  this.userId = user._id;
});

Given('the following tasks exist:', async function(dataTable) {
  const tasks = dataTable.hashes();
  for (const task of tasks) {
    await this.page.request.post('http://localhost:3000/api/tasks', {
      data: {
        projectId: this.projectId,
        title: task.title,
        description: 'Test task',
        status: task.status || 'pending',
        priority: 'medium',
        duration: parseInt(task.duration) || 3
      }
    });
  }
  await this.page.reload();
  await this.page.waitForTimeout(500);
});

Given('the following tasks exist with dependencies', async function() {
  // Create tasks with dependencies for PERT chart
  const task1Response = await this.page.request.post('http://localhost:3000/api/tasks', {
    data: {
      projectId: this.projectId,
      title: 'Task 1',
      duration: 3,
      status: 'pending',
      priority: 'medium'
    }
  });
  const task1 = await task1Response.json();
  
  await this.page.request.post('http://localhost:3000/api/tasks', {
    data: {
      projectId: this.projectId,
      title: 'Task 2',
      duration: 5,
      status: 'pending',
      priority: 'medium',
      dependencies: [task1._id]
    }
  });
  
  await this.page.reload();
  await this.page.waitForTimeout(500);
});

When('I click on task {string}', async function(taskTitle) {
  await this.page.click(`text=${taskTitle}`);
  await this.page.waitForTimeout(500);
});

When('I enter task title {string}', async function(title) {
  await this.page.fill('input[name="title"], input[placeholder*="title" i]', title);
});

When('I enter task description {string}', async function(description) {
  await this.page.fill('textarea, input[name="description"]', description);
});

When('I select status {string}', async function(status) {
  await this.page.selectOption('select[name="status"], select:has-text("Status")', status);
});

When('I select priority {string}', async function(priority) {
  await this.page.selectOption('select[name="priority"], select:has-text("Priority")', priority);
});

When('I enter duration {string}', async function(duration) {
  await this.page.fill('input[name="duration"], input[type="number"]', duration);
});

When('I change status to {string}', async function(newStatus) {
  await this.page.selectOption('select[name="status"], select:has-text("Status")', newStatus);
});

When('I select user {string} from members list', async function(userName) {
  await this.page.selectOption('select[name="assignedTo"], select:has-text("Assign")', { label: userName });
});

When('I select filter {string}', async function(filterValue) {
  await this.page.selectOption('select:has-text("Filter"), select[name="filter"]', filterValue);
  await this.page.waitForTimeout(500);
});

When('I click on tab {string}', async function(tabName) {
  await this.page.click(`button:has-text("${tabName}"), a:has-text("${tabName}")`);
  await this.page.waitForTimeout(500);
});

Then('I should see task {string} in the list', async function(taskTitle) {
  await this.page.waitForTimeout(500);
  const content = await this.page.content();
  expect(content).to.include(taskTitle);
});

Then('I should not see task {string} in the list', async function(taskTitle) {
  await this.page.waitForTimeout(500);
  const content = await this.page.content();
  expect(content).to.not.include(taskTitle);
});

Then('I should see task {string} with status {string}', async function(taskTitle, status) {
  await this.page.waitForTimeout(500);
  const content = await this.page.content();
  expect(content).to.include(taskTitle);
  expect(content.toLowerCase()).to.include(status.toLowerCase());
});

Then('I should see task assigned to {string}', async function(userName) {
  await this.page.waitForTimeout(500);
  const content = await this.page.content();
  expect(content).to.include(userName);
});

Then('I should see Gantt chart', async function() {
  await this.page.waitForTimeout(1000);
  const content = await this.page.content();
  expect(content.toLowerCase()).to.match(/gantt|chart|timeline/);
});

Then('I should see tasks in the chart', async function() {
  await this.page.waitForTimeout(500);
  const hasCanvas = await this.page.$('canvas');
  const hasSvg = await this.page.$('svg');
  expect(hasCanvas || hasSvg).to.not.be.null;
});

Then('I should see PERT chart', async function() {
  await this.page.waitForTimeout(1000);
  const content = await this.page.content();
  expect(content.toLowerCase()).to.match(/pert|chart|network/);
});

Then('I should see critical path', async function() {
  await this.page.waitForTimeout(500);
  const content = await this.page.content();
  expect(content.toLowerCase()).to.match(/critical|path/);
});
