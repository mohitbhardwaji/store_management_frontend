import { apiServerUrl } from "../constant/constants";

export async function loginUser({ email, password }) {
    const response = await fetch(`${apiServerUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }
  
    return await response.json(); // returns { access_token }
  }
  