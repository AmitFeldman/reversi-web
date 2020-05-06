import * as React from 'react';

const ELEMENT_ID = 'g-signin2';

const Login: React.FC = () => {
  const onSignIn = (googleUser: gapi.auth2.GoogleUser) => {
    const profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  };

  const onFail = ({error}: {error: string}) => {
    console.log(error);
  };

  React.useEffect(() => {
    gapi.load('auth2', () => {
      gapi.auth2
        .init({
          client_id:
            '964242933099-7p23u40oqul97mngm2irlrrm7m0ags56.apps.googleusercontent.com',
        })
        .then(googleAuth => {
          window.gapi.signin2.render(ELEMENT_ID, {
            scope: 'profile email',
            width: 250,
            height: 50,
            longtitle: false,
            theme: 'dark',
            onsuccess: onSignIn,
            onfailure: onFail,
          });
        });
    });
  });

  return (
    <>
      <h1>Login</h1>
      <div id={ELEMENT_ID} />
    </>
  );
};

export default Login;
