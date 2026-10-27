Feature: Login
  Shoppers log in to My Demo App from the side menu.

  Rule: Valid credentials must take Vijay back to the catalog as a logged-in user

    Example: Vijay logs in with a valid account and sees the Log Out option
      Given Vijay is on the "catalog" screen
      When Vijay taps the "menu button"
      And Vijay taps the "log in menu item"
      Then Vijay is redirected to the "login" screen
      When Vijay enters the "username" as "bod@example.com"
      And Vijay enters the "password" as "10203040"
      And Vijay taps the "login button"
      Then Vijay is redirected to the "catalog" screen
      When Vijay taps the "menu button"
      Then Vijay confirms the "log out menu item"

  Rule: Username and password are both required

    Example: Vijay is asked for a username when he logs in with empty fields
      Given Vijay is on the "catalog" screen
      When Vijay taps the "menu button"
      And Vijay taps the "log in menu item"
      And Vijay taps the "login button"
      Then Vijay confirms the "username error" as "Username is required"

    Example: Vijay is asked for a password when he enters only a username
      Given Vijay is on the "catalog" screen
      When Vijay taps the "menu button"
      And Vijay taps the "log in menu item"
      And Vijay enters the "username" as "bod@example.com"
      And Vijay taps the "login button"
      Then Vijay confirms the "password error" as "Enter Password"

  Rule: A locked-out account must not be able to log in

    Example: Vijay sees the locked-out message for a locked account
      Given Vijay is on the "catalog" screen
      When Vijay taps the "menu button"
      And Vijay taps the "log in menu item"
      And Vijay enters the "username" as "alice@example.com"
      And Vijay enters the "password" as "10203040"
      And Vijay taps the "login button"
      Then Vijay confirms the "password error" as "Sorry this user has been locked out."
      And Vijay is redirected to the "login" screen
