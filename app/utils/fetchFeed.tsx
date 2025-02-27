import { BASE_URL, TOKEN } from "./config";

interface FeedData {
  feed_id: string;
  feed_name: string;
  create_date: string;
  file_delta_percent_allow: string;
  perform_min_max_validations: string;
  impose_datatypes: string;
  quality_threshold: string;
  rename_columns: string;
  source_type: string;
  raw_dir: string;
  workflow_name: string;
  feed_description: string;
}
export async function fetchFeed(): Promise<FeedData[]> {
  try {
    if (!TOKEN) {
      console.error("No Auth Token Found! Please log in.");
      return [];
    }

    const res = await fetch(`${BASE_URL}/get-data?table_name=feed`, {
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
    console.log(" API Response (Raw):", JSON.stringify(response, null, 2));

    if (!response.data || !Array.isArray(response.data)) {
      console.error(" API returned an invalid response format:", response);
      return [];
    }

    console.log(" Extracted API Data:", JSON.stringify(response.data, null, 2));

    const columnNames: (keyof FeedData)[] = [
      "feed_id",
      "feed_name",
      "create_date",
      "file_delta_percent_allow",
      "perform_min_max_validations",
      "impose_datatypes",
      "quality_threshold",
      "rename_columns",
      "source_type",
      "raw_dir",
      "workflow_name",
      "feed_description",
    ];

    const formattedData: FeedData[] = response.data.map((rowValues: any[]) => {
      let rowObject: Partial<FeedData> = {};
      columnNames.forEach((col, index) => {
        rowObject[col] = rowValues[index] !== null ? rowValues[index] : "N/A";
      });
      return rowObject as FeedData;
    });

    console.log("Converted Data:", JSON.stringify(formattedData, null, 2));
    return formattedData;
  } catch (error) {
    console.error(" Fetch error:", error);
    return [];
  }
}
