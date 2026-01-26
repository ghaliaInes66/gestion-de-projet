Feature: Login and Authentication
  As a user
  I want to login to the system
  So that I can access the dashboard

  Scenario: Successful login
    Given I am on the login page
    When I enter email "aaa@gmail.com"
    And I enter password "aaa@gmail.com"
    And I click the "Login" button
    Then I should see the home page
    And I should see message "Welcome"

  Scenario: Failed login - wrong credentials
    Given I am on the login page
    When I enter email "wrong@example.com"
    And I enter password "wrongpassword"
    And I click the "Login" button
    Then I should see error message "Invalid credentials"

  Scenario: Failed login - empty fields
    Given I am on the login page
    When I click the "Login" button
    Then I should see message "Please fill all fields"

  Scenario: Logout
    Given I am logged in as a user
    And I am on the home page
    When I click the "Logout" button
    Then I should see the login page
