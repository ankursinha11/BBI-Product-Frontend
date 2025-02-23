"use client";

import { fetchFeed } from "@/app/utils/fetchFeed";
import React, { useEffect, useState } from "react";
import ReactFlow, {
  Controls,
  Background,
  Handle,
  Position,
  Node,
  Edge,
} from "reactflow";
import "reactflow/dist/style.css";

const CustomNode = ({ data }: { data: { label: string } }) => (
  <div className="p-4 w-40 h-20 shadow-md rounded-md border-2 bg-blue-200 border-blue-500 flex items-center justify-center">
    <strong className="text-gray-700">{data.label}</strong>
    <Handle type="target" position={Position.Top} />
    <Handle type="source" position={Position.Bottom} />
  </div>
);

export default function DAG() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  useEffect(() => {
    async function loadFeedData() {
      try {
        console.log("📡 Fetching Feed Data...");
        const data = await fetchFeed();
        console.log("✅ Fetched Data:", data);

        if (!data || data.length === 0) {
          console.warn("⚠️ No feed data found. Check API response.");
          return;
        }

        // ✅ Ensure all IDs are strings
        const fetchedNodes: Node[] = data.map((feed, index) => ({
          id: String(feed.feed_id),
          type: "custom",
          position: { x: index * 250, y: index * 150 }, // ✅ Adjusted for visibility
          data: { label: `${feed.feed_id} - ${feed.feed_name}` },
        }));

        console.log("📌 Generated Nodes:", fetchedNodes);

        // ✅ Ensure edges exist
        const fetchedEdges: Edge[] = data.slice(1).map((feed, index) => ({
          id: `edge-${index}`,
          source: String(data[index].feed_id),
          target: String(feed.feed_id),
        }));

        console.log("🔗 Generated Edges:", fetchedEdges);

        setNodes(
          fetchedNodes.length > 0
            ? fetchedNodes
            : [
                {
                  id: "test-node",
                  type: "custom",
                  position: { x: 300, y: 200 },
                  data: { label: "Test Node" },
                },
              ]
        );
        setEdges(fetchedEdges);
      } catch (error) {
        console.error("🚨 Error fetching DAG data:", error);
      }
    }

    loadFeedData();
  }, []);

  return (
    <div className="relative w-full h-[600px] p-6 border-black">
      {nodes.length === 0 ? (
        <p className="text-white text-center">⚠️ No DAG Data Available</p>
      ) : (
        <>
          <p className="text-white text-center mb-2">
            ✅ Nodes Loaded: {nodes.length}
          </p>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={{ custom: CustomNode }}
            fitView
            defaultViewport={{ x: 100, y: 100, zoom: 1.2 }} // ✅ Ensures nodes are visible
            minZoom={0.2}
            maxZoom={1.5}
          >
            <Controls />
            <Background gap={12} size={1} />
          </ReactFlow>
        </>
      )}
    </div>
  );
}
