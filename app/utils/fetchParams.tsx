import { BASE_URL, TOKEN } from "./config";

interface ParamsData {
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

export async function fetchParams(): Promise<ParamsData[]> {
  try {
    if (!TOKEN) {
      console.error("No Auth Token Found! Please log in.");
      return [];
    }

    const res = await fetch(`${BASE_URL}/get-data?table_name=parameters`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    if (!res.ok) {
      const errorMessage = await res.text();
      throw new Error(`Fetch error: ${errorMessage}`);
    }

    const response = await res.json();
    console.log("API Response (Raw):", JSON.stringify(response, null, 2));

    if (!response.data || !Array.isArray(response.data)) {
      console.error("API returned an invalid response format:", response);
      return [];
    }

    console.log("Extracted API Data:", JSON.stringify(response.data, null, 2));

    const columnNames: (keyof ParamsData)[] = [
      "parameters_id",
      "parameter_name",
      "parameter_value",
      "parameter_type",
      "feed_name",
      "default_or_custom",
      "batch_id",
      "timestamp",
      "override_parameter_value",
    ];

    const formattedData: ParamsData[] = response.data.map(
      (rowValues: any[]) => {
        let rowObject: Partial<ParamsData> = {};
        columnNames.forEach((col, index) => {
          rowObject[col] = rowValues[index] !== null ? rowValues[index] : "N/A";
        });
        return rowObject as ParamsData;
      }
    );

    console.log("Converted Data:", JSON.stringify(formattedData, null, 2));
    return formattedData;
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
}
