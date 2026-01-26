Feature: Project Management
  As a project manager
  I want to manage projects via API
  So that I can create, read, update and delete projects

  Scenario: Create a new project successfully
    When I send a POST request to "/api/projects" with data:
      | name              | description                  | startDate  | endDate    |
      | Web App Project   | Developing a web application | 2024-01-01 | 2024-12-31 |
    Then the response status code should be 201
    And the response should contain property "name" with value "Web App Project"
    And the response should contain property "description"
    And the response should contain property "_id"

  Scenario: Try to create project without name
    When I send a POST request to "/api/projects" with data:
      | description                  | startDate  | endDate    |
      | Project without name         | 2024-01-01 | 2024-12-31 |
    Then the response status code should be 400

  Scenario: Get all projects
    Given the following projects exist:
      | name              | description       | startDate  | endDate    |
      | Project A         | Description A     | 2024-01-01 | 2024-06-30 |
      | Project B         | Description B     | 2024-02-01 | 2024-07-31 |
      | Project C         | Description C     | 2024-03-01 | 2024-08-31 |
    When I send a GET request to "/api/projects"
    Then the response status code should be 200
    And the response should contain 3 projects

  Scenario: Get a specific project by ID
    Given a project exists with name "Test Project"
    When I send a GET request to "/api/projects/{projectId}"
    Then the response status code should be 200
    And the response should contain property "name" with value "Test Project"

  Scenario: Update project information
    Given a project exists with name "Old Project Name"
    When I send a PUT request to "/api/projects/{projectId}" with data:
      | name              | description          |
      | Updated Project   | Updated description  |
    Then the response status code should be 200
    And the response should contain property "name" with value "Updated Project"
    And the response should contain property "description" with value "Updated description"

  Scenario: Delete a project
    Given a project exists with name "Project To Delete"
    When I send a DELETE request to "/api/projects/{projectId}"
    Then the response status code should be 200
    When I send a GET request to "/api/projects/{projectId}"
    Then the response status code should be 404

  Scenario: Try to get non-existing project
    When I send a GET request to "/api/projects/507f1f77bcf86cd799439011"
    Then the response status code should be 404

  Scenario: Create project with invalid dates (end date before start date)
    When I send a POST request to "/api/projects" with data:
      | name              | description       | startDate  | endDate    |
      | Invalid Project   | Test description  | 2024-12-31 | 2024-01-01 |
    Then the response status code should be 400
