Feature: Task Management from UI
  As a team member
  I want to manage tasks through the interface
  So that I can track tasks and update their status

  Background:
    Given I am logged in as a user
    And project "Application Project" exists
      | Task 2 | [Task 1]     |
      | Task 3 | [Task 2]     |
    When I click on task "Task 1"
    And I select "Task 3" as predecessor
    Then I should see warning "This will create a circular dependency"
    And the save button should be disabled
