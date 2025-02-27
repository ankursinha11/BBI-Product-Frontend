import { BASE_URL, TOKEN } from "./config";

export async function updateEnvironment(
  databaseName: string,
  environmentData: Record<string, string>
): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/abc-config?type=enviornment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({ database: databaseName, config: environmentData }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Error updating Enviornment: ${response.status} - ${errorText}`
      );
    }

    console.log("Enviornment updated successfully");
    return true;
  } catch (error) {
    console.error("Failed to update Enviornment:", error);
    return false;
  }
}
