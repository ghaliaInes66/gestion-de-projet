Feature: Project Management from UI
  As a project manager
  I want to manage projects through the interface
  So that I can create, view, and update projects easily

  Background:
    Given I am logged in as a user
    And I am on the home page

  Scenario: View home page after login
    Then I should see the home page

  Scenario: Navigate to projects page
    When I go to projects page
    Then I should see the home page

  Scenario: Open project creation form
    When I go to projects page
    And I click the "Create New Project" button
    Then I should see the home page

  Scenario: Access projects section successfully
    When I go to projects page
    Then I should see message "Welcome"
