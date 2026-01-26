const { setWorldConstructor } = require('@cucumber/cucumber');
const request = require('supertest');
const express = require('express');
const UserRouter = require('../../router/UserRouter');
const ProjectRouter = require('../../router/ProjectRouter');
const TaskRouter = require('../../router/TaskRouter');

class CustomWorld {
  constructor() {
    // Create Express app for testing
    this.app = express();
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use('/api/users', UserRouter);
    this.app.use('/api/projects', ProjectRouter);
    this.app.use('/api/tasks', TaskRouter);
    
    // Store responses and data
    this.response = null;
    this.userId = null;
    this.projectId = null;
    this.taskId = null;
    this.taskId2 = null;
    this.taskId3 = null;
    this.userIds = [];
    this.projectIds = [];
    this.taskIds = [];
  }

  async makeRequest(method, path, data = null) {
    const req = request(this.app)[method](path);
    if (data) {
      req.send(data);
    }
    this.response = await req;
    return this.response;
  }
}

setWorldConstructor(CustomWorld);
