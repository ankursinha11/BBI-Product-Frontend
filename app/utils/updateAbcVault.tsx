import { BASE_URL, TOKEN } from "./config";

export async function updateAbcVault(
  databaseName: string,
  vaultData: Record<string, string>
): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/abc-config?type=vault`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({ database: databaseName, config: vaultData }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Error updating ABC config: ${response.status} - ${errorText}`
      );
    }

    console.log("ABC Vault Config updated successfully");
    return true;
  } catch (error) {
    console.error("Failed to update ABC Vault config:", error);
    return false;
  }
}
