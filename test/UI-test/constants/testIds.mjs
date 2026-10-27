// Every locator lives here, so page objects never hard-code an ID.
//
// My Demo App is a native Android app, so its "testIDs" are Android resource-ids.
// Mobilewright's getByTestId() matches the resource-id exactly as the device reports it,
// which for native apps is the full form "<package>:id/<name>". rid() builds that.
// If `npm run inspect` shows short ids instead, change rid() to return just the name.
const PACKAGE = 'com.saucelabs.mydemoapp.android';
const rid = (name) => `${PACKAGE}:id/${name}`;

export const testIds = {
  header: {
    menuButton: rid('menuIV'),
  },
  catalog: {
    title: rid('productTV'),
  },
  login: {
    title: rid('loginTV'),
    usernameInput: rid('nameET'),
    passwordInput: rid('passwordET'),
    loginButton: rid('loginBtn'),
    usernameError: rid('nameErrorTV'),
    passwordError: rid('passwordErrorTV'),
  },
};

// Side-menu entries are list rows without their own id, so they are matched by visible text.
export const menuItems = {
  logIn: 'Log In',
  logOut: 'Log Out',
};
