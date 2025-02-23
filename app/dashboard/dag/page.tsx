import DAG from "@/components/Dag";

export default function DAGPage() {
  return (
    <div className="p-6">
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-2 font-display">
        DAG Visualization
      </h1>
      <DAG />
    </div>
  );
}
