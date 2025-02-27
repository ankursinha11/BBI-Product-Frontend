import { BASE_URL } from "./config";

export interface DagNode {
  id: string;
  label: string;
  status: string;
  x: number;
  y: number;
}

export interface DagEdge {
  id: string;
  source: string;
  target: string;
}

export interface DagData {
  nodes: DagNode[];
  edges: DagEdge[];
}

export async function fetchDag(): Promise<DagData | null> {
  try {
    const response = await fetch(`${BASE_URL}/get-dag-status`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching DAG data: ${response.statusText}`);
    }

    const data: DagData = await response.json();
    console.log("DAG Data Received:", data);
    return data;
  } catch (error) {
    console.error("Failed to fetch DAG data:", error);
    return null;
  }
}
