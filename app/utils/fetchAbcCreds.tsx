import { BASE_URL, TOKEN } from "./config";

export async function fetchAbcCreds(dbName: string) {
  try {
    console.log(`Fetching ABC Credentials for: ${dbName}`);

    const res = await fetch(
      `${BASE_URL}/abc-config/?type=abc_creds&db=${dbName}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    );

    if (!res.ok) {
      const errorMsg = await res.text();
      throw new Error(`Fetch failed: ${errorMsg}`);
    }

    const response = await res.json();
    console.log("Database Config Received:", response);

    if (!response?.data) {
      console.warn("⚠️ No data in response!");
      return null;
    }

    return response;
  } catch (error) {
    console.error("Failed to fetch ABC creds:", error);
    return null;
  }
}
