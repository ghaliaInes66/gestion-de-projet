Feature: User Management
  As a developer
  I want to manage users via API
  So that I can create, read, update and delete users

  Scenario: Create a new user successfully
    When I send a POST request to "/api/users" with data:
      | name     | email              | password  |
      | Ahmed    | ahmed@example.com  | Test123!  |
    Then the response status code should be 201
    And the response should contain property "name" with value "Ahmed"
    And the response should contain property "email" with value "ahmed@example.com"
    And the response should contain property "_id"

  Scenario: Try to create user with existing email
    Given a user exists with email "test@example.com"
    When I send a POST request to "/api/users" with data:
      | name     | email              | password  |
      | Test     | test@example.com   | Test123!  |
    Then the response status code should be 400

  Scenario: Try to create user with invalid email
    When I send a POST request to "/api/users" with data:
      | name     | email              | password  |
      | Test     | invalid-email      | Pass123!  |
    Then the response status code should be 400

  Scenario: Get all users
    Given the following users exist:
      | name     | email              | password  |
      | User1    | user1@test.com     | Test123!  |
      | User2    | user2@test.com     | Test123!  |
      | User3    | user3@test.com     | Test123!  |
    When I send a GET request to "/api/users"
    Then the response status code should be 200
    And the response should contain 3 users

  Scenario: Get a specific user by ID
    Given a user exists with name "Ahmed"
    When I send a GET request to "/api/users/{userId}"
    Then the response status code should be 200
    And the response should contain property "name" with value "Ahmed"

  Scenario: Update user information
    Given a user exists with name "OldName"
    When I send a PUT request to "/api/users/{userId}" with data:
      | name     |
      | NewName  |
    Then the response status code should be 200
    And the response should contain property "name" with value "NewName"

  Scenario: Delete a user
    Given a user exists with name "ToDelete"
    When I send a DELETE request to "/api/users/{userId}"
    Then the response status code should be 200
    When I send a GET request to "/api/users/{userId}"
    Then the response status code should be 404

  Scenario: Try to get non-existing user
    When I send a GET request to "/api/users/507f1f77bcf86cd799439011"
    Then the response status code should be 404
