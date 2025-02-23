import { BASE_URL, TOKEN } from "./config";

export async function updateAbcCreds(
  databaseName: string,
  creds: Record<string, string>
) {
  try {
    const response = await fetch(`${BASE_URL}/abc-config`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({ databaseName, creds }),
    });

    if (!response.ok) {
      throw new Error(
        `Error updating ABC config for ${databaseName}: ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log(`ABC Config Updated for ${databaseName}:`, data);
    return data;
  } catch (error) {
    console.error(`Failed to update ABC config for ${databaseName}:`, error);
    return null;
  }
}
