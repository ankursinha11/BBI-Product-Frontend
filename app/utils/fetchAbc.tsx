import { TOKEN } from "./config";

export async function fetchAbcConfig(databaseName: string) {
  try {
    const response = await fetch(`http://localhost:8000/abc-config`, {
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
