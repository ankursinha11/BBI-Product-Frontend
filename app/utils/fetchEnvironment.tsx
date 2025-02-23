import { BASE_URL, TOKEN } from "./config";

export async function fetchAbcCreds(databaseName: string) {
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
        `Error fetching ABC config for ${databaseName}: ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log(`ABC Config Data Received for ${databaseName}:`, data);
    return data;
  } catch (error) {
    console.error(`Failed to fetch ABC config for ${databaseName}:`, error);
    return null;
  }
}
