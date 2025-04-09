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
// frontend/src/utils/frappe.ts
// Update the customLogin function:

export const customLogin = async (username: string, password: string) => {
  try {
    console.log('Attempting login with:', { username, password: '***' });
    
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    
    const response = await fetch(`${FRAPPE_URL}/api/method/demo.api.auth.simple_login.login`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });
    
    console.log('Login response status:', response.status);
    
    // Get the response text
    const responseText = await response.text();
    console.log('Raw response:', responseText);
    
    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      throw new Error(`Invalid JSON response: ${responseText}`);
    }
    
    // Handle different response formats from Frappe
    if (data.exc_type || data.exception) {
      throw new Error(data.exception || data.exc_type);
    }
    
    // Return the actual data, which might be in a message property
    return data;
  } catch (error) {
    console.error('Login function error:', error);
    throw error;
  }
};

// Custom function to get current user
// frontend/src/utils/frappe.ts
// Update the getCurrentUser function:

export const getCurrentUser = async () => {
  try {
    const response = await fetch(`${FRAPPE_URL}/api/method/demo.api.auth.simple_user.get_user`, {
      method: 'GET',
      credentials: 'include',
    });
    
    // Get the response text
    const responseText = await response.text();
    console.log('User response:', responseText);
    
    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      throw new Error(`Invalid JSON response: ${responseText}`);
    }
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    return data;
  } catch (error) {
    console.error('Get user error:', error);
    throw error;
  }
};

// Custom logout function
// frontend/src/utils/frappe.ts
// Update the customLogout function:

export const customLogout = async () => {
  try {
    const response = await fetch(`${FRAPPE_URL}/api/method/demo.api.auth.simple_logout.logout`, {
      method: 'GET',
      credentials: 'include',
    });
    
    // Get the response text
    const responseText = await response.text();
    console.log('Logout response:', responseText);
    
    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      throw new Error(`Invalid JSON response: ${responseText}`);
    }
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    return data;
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
