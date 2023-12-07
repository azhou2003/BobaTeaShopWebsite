interface Config {
    appId: string;
    redirectUri: string;
    scopes: string[];
    authority: string;
  }
  
  export const config: Config = {
    appId: '40d9fcf1-64fa-4d68-91b5-5b903c85ac5e',
    // redirectUri: 'http://localhost:5173',
    redirectUri: 'https://sharetea-w9rx.onrender.com/',
    scopes: ['openid', 'profile', 'email', 'user.read', 'RoleManagement.Read.All'],
    authority: 'https://login.microsoftonline.com/common', // Use the common endpoint for multi-tenant
  };
  