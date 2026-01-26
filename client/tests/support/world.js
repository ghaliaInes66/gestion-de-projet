import { setWorldConstructor } from '@cucumber/cucumber';

class CustomWorld {
  constructor() {
    this.browser = null;
    this.context = null;
    this.page = null;
    this.baseURL = 'http://localhost:5173';
    this.loggedIn = false;
    this.projectId = null;
    this.taskId = null;
    this.userId = null;
    this.testData = {
      users: [],
      projects: [],
      tasks: []
    };
  }

  async navigateTo(path) {
    await this.page.goto(`${this.baseURL}${path}`);
    await this.page.waitForLoadState('networkidle');
  }

  async fillForm(selector, value) {
    await this.page.fill(selector, value);
  }

  async clickButton(text) {
    await this.page.click(`button:has-text("${text}")`);
  }

  async waitForText(text) {
    await this.page.waitForSelector(`text=${text}`);
  }

  async screenshot(name) {
    await this.page.screenshot({ path: `tests/screenshots/${name}.png` });
  }
}

setWorldConstructor(CustomWorld);
