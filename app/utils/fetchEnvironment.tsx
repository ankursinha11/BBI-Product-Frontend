import { BASE_URL, TOKEN } from "./config";

export async function fetchEnvironment(databaseName: string) {
  try {
    const response = await fetch(`${BASE_URL}/abc-config?type=environment`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error fetching ABC Enviornment for ${databaseName}: ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log(`Enviornment Data Received for ${databaseName}:`, data);
    return data;
  } catch (error) {
    console.error(`Failed to fetch Enviornment for ${databaseName}:`, error);
    return null;
  }
}
