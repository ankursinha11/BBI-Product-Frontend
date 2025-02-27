import { BASE_URL, TOKEN } from "./config";

export interface Param {
  parameters_id: string;
  parameter_name: string;
  parameter_value: string;
  parameter_type: string;
  feed_name: string;
  default_or_custom: string;
  batch_id: string;
  timestamp: string;
  override_parameter_value: string;
}

export async function updateParams(
  payload?: Partial<Param[]>
): Promise<Param[] | null> {
  try {
    const response = await fetch(`${BASE_URL}/update-params`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify(payload || {}),
    });

    if (!response.ok) {
      throw new Error(
        `Error fetching params: ${response.status} - ${response.statusText}`
      );
    }

    const data: Param[] = await response.json();
    console.log("Params Data Received:", data);
    return data;
  } catch (error) {
    console.error("Failed to fetch params:", error);
    return null;
  }
}
