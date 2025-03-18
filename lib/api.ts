// lib/api.ts
const API_BASE_URL = "http://127.0.0.1:8000"; // Replace with your API URL

export async function loginUser(username: string, password: string): Promise<{ access_token: string; token_type: string }> {
  const response = await fetch(`${API_BASE_URL}/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      username,
      password,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Login failed");
  }

  return response.json();
}


// Add other API functions here as needed (e.g., registerClient, createUser, etc.)
export async function registerClient(  //Removed, not required.
    client_name: string,
    snowflake_account: string,
    snowflake_user: string,
    snowflake_password: string,
    snowflake_database: string,
    snowflake_warehouse: string,
    snowflake_schema: string,
    token:string
  ): Promise<any> {
      const response = await fetch(`${API_BASE_URL}/register-client`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Include the token for authentication
        },
        body: JSON.stringify({
          client_name,
          snowflake_account,
          snowflake_user,
          snowflake_password,
          snowflake_database,
          snowflake_warehouse,
          snowflake_schema
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Client registration failed');
      }

      return response.json();
  }

export async function createUser(
  username: string,
  password: string,
  role: string,
  client_id: number,  // You might get this from the user context
  token: string
): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/create-user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ username, password, role, client_id }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "User creation failed");
  }

  return response.json(); // Or whatever the API returns
}

// Add a function for fetching the current user's info
export async function getCurrentUser(token: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch user information');
    }
    return response.json();
}

export async function getSnowflakeData(tableName: string, token: string) {
    const response = await fetch(`${API_BASE_URL}/get-snowflake-data?table_name=${tableName}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`, // Include the JWT for authentication
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch data from Snowflake');
    }
    return response.json();
}

export async function uploadFileToSnowflake(
  table_name: string,
  stage_name: string,
  file: File,
  token: string
): Promise<any> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
        `${API_BASE_URL}/upload-file-to-snowflake?table_name=${table_name}&stage_name=${stage_name}`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`, // Include token
            },
            body: formData,
        }
    );
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "File upload failed");
      }
    return response.json();

}