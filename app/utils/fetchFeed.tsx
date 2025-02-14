interface FeedData {
  feed_id: string;
  feed_name: string;
  create_date: string;
  file_delta_percent_allow: string;
  quality_threshold: string;
  land_filename_pattern_compressed: string;
  land_filename_pattern_uncompressed: string;
  land_file_extension_pattern_compressed: string;
  land_file_extension_pattern_uncompressed: string;
  land_dir: string;
  raw_dir: string;
  glue_workflow_name: string;
  feed_description: string;
}

export async function fetchFeed(): Promise<FeedData[]> {
  try {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QifQ.YbP4we6mqRJDrVV1AJlUbotlJIfMlD7NXEj6tM3LhXI";

    if (!token) {
      console.error("No Auth Token Found! Please log in.");
      return [];
    }

    const url = `http://localhost:8000/get-data?table_name=feed`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
      "quality_threshold",
      "land_filename_pattern_compressed",
      "land_filename_pattern_uncompressed",
      "land_file_extension_pattern_compressed",
      "land_file_extension_pattern_uncompressed",
      "land_dir",
      "raw_dir",
      "glue_workflow_name",
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
