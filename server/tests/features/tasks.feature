Feature: Task Management
  As a project manager
  I want to manage tasks related to projects
  So that I can track work progress and assign tasks to members

  Background:
    Given a project exists with name "Main Project"
    And a user exists with name "Developer"

  Scenario: Create a new task successfully
    When I send a POST request to "/api/tasks" with data:
      | title           | description              | status      | priority | duration | projectId    | assignedTo   |
      | UI Design       | Design user interface    | pending     | high     | 5        | {projectId}  | {userId}     |
    Then the response status code should be 201
    And the response should contain property "title" with value "UI Design"
    And the response should contain property "status" with value "pending"
    And the response should contain property "_id"

  Scenario: Try to create task without title
    When I send a POST request to "/api/tasks" with data:
      | description              | status      | priority | duration | projectId    |
      | Task without title       | pending     | medium   | 3        | {projectId}  |
    Then the response status code should be 400

  Scenario: Get all tasks
    Given the following tasks exist:
      | title           | description    | status      | priority | duration | projectId    |
      | Task 1          | Description 1  | pending     | high     | 3        | {projectId}  |
      | Task 2          | Description 2  | in-progress | medium   | 5        | {projectId}  |
      | Task 3          | Description 3  | completed   | low      | 2        | {projectId}  |
    When I send a GET request to "/api/tasks"
    Then the response status code should be 200
    And the response should contain 3 tasks

  Scenario: Get a specific task by ID
    Given a task exists with title "Specific Task"
    When I send a GET request to "/api/tasks/{taskId}"
    Then the response status code should be 200
    And the response should contain property "title" with value "Specific Task"

  Scenario: Update task status
    Given a task exists with status "pending"
    When I send a PUT request to "/api/tasks/{taskId}" with data:
      | status      |
      | in-progress |
    Then the response status code should be 200
    And the response should contain property "status" with value "in-progress"

  Scenario: Update task priority
    Given a task exists with priority "low"
    When I send a PUT request to "/api/tasks/{taskId}" with data:
      | priority |
      | high     |
    Then the response status code should be 200
    And the response should contain property "priority" with value "high"

  Scenario: Assign task to user
    Given a task exists without assignment
    When I send a PUT request to "/api/tasks/{taskId}" with data:
      | assignedTo  |
      | {userId}    |
    Then the response status code should be 200
    And the response should contain property "assignedTo"

  Scenario: Delete a task
    Given a task exists with title "Task To Delete"
    When I send a DELETE request to "/api/tasks/{taskId}"
    Then the response status code should be 200
    When I send a GET request to "/api/tasks/{taskId}"
    Then the response status code should be 404

  Scenario: Get tasks for a specific project
    Given the following tasks exist in the project:
      | title           | status      | projectId    |
      | Project Task 1  | pending     | {projectId}  |
      | Project Task 2  | in-progress | {projectId}  |
    When I send a GET request to "/api/tasks?projectId={projectId}"
    Then the response status code should be 200
    And the response should contain 2 tasks

  Scenario: Try to get non-existing task
    When I send a GET request to "/api/tasks/507f1f77bcf86cd799439011"
    Then the response status code should be 404

  Scenario: Update task with dependencies
    Given a task exists with title "Task A"
    And a task exists with title "Task B"
    When I send a PUT request to "/api/tasks/{taskId}" with data:
      | dependencies  |
      | [{taskId2}]   |
    Then the response status code should be 200
    And the response should contain property "dependencies"

  Scenario: Prevent circular dependency
    Given a task exists with title "Task X" and id "task1"
    And a task exists with title "Task Y" with dependency "task1"
    And a task exists with title "Task Z" with dependency "task2"
    When I send a PUT request to update "task1" to depend on "task3"
    Then the response status code should be 400
    And the response should contain error message "Circular dependency detected"
