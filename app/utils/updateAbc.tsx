import { BASE_URL, TOKEN } from "./config";

export async function updateAbcConfig(
  databaseName: string,
  configData: Record<string, string>
) {
  try {
    const response = await fetch(`${BASE_URL}/abc-config`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({ database: databaseName, config: configData }),
    });

    if (!response.ok) {
      throw new Error(`Error updating ABC config: ${response.statusText}`);
    }

    console.log("ABC Config updated successfully");
    return true;
  } catch (error) {
    console.error("Failed to update ABC config:", error);
    return false;
  }
}
