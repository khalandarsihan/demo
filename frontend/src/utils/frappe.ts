import { FrappeApp } from 'frappe-js-sdk';

// Get the Frappe URL from environment variables
const FRAPPE_URL = process.env.NEXT_PUBLIC_FRAPPE_URL || 'http://demo.localhost:8002';

console.log('Connecting to Frappe server at:', FRAPPE_URL);

// Initialize Frappe app
export const frappe = new FrappeApp(FRAPPE_URL, {
  useToken: false,
  forceCredentials: true
});

// Initialize services (though we'll be using custom endpoints)
export const auth = frappe.auth();
export const db = frappe.db();

// Custom login function using our new endpoint
export const customLogin = async (username: string, password: string) => {
  try {
    console.log('Attempting login with:', { username, password: '***' });
    
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    
    const response = await fetch(`${FRAPPE_URL}/api/method/demo.api.auth.login.login_with_cors`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });
    
    console.log('Login response status:', response.status);
    
    if (!response.ok) {
      let errorMessage = `Login failed with status: ${response.status}`;
      try {
        const errorText = await response.text();
        console.error('Error response body:', errorText);
        errorMessage += ` - ${errorText}`;
      } catch (err) {
        console.error('Failed to read error response:', err);
      }
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    console.log('Login response data:', data);
    return data;
  } catch (error) {
    console.error('Login function error:', error);
    throw error;
  }
};

// Custom function to get current user
export const getCurrentUser = async () => {
  try {
    const response = await fetch(`${FRAPPE_URL}/api/method/demo.api.auth.user.get_current_user`, {
      method: 'GET',
      credentials: 'include',
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get user: ${response.status} - ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Get user error:', error);
    throw error;
  }
};

// Custom logout function
export const customLogout = async () => {
  try {
    const response = await fetch(`${FRAPPE_URL}/api/method/demo.api.auth.logout.logout_user`, {
      method: 'GET',
      credentials: 'include',
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Logout failed: ${response.status} - ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

// Test server connectivity
export const testConnection = async () => {
  try {
    const response = await fetch(`${FRAPPE_URL}/api/method/ping`, {
      method: 'GET',
      credentials: 'include',
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Connection test failed:', error);
    throw error;
  }
};
