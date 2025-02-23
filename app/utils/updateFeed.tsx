import { BASE_URL } from "./config";

export interface FeedData {
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

export async function updateFeed(updatedFeed: FeedData[]): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/get-data?table_name=feed`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ feeds: updatedFeed }),
    });

    if (!response.ok) {
      throw new Error(`Error updating feed: ${response.statusText}`);
    }

    console.log("Feed updated successfully");
    return true;
  } catch (error) {
    console.error("Failed to update feed:", error);
    return false;
  }
}
