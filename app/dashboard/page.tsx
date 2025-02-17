import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Database, FileEdit, Package, Plus, Sparkles } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-2 font-display">
            Dashboard
          </h1>
          <p className="text-white font-bold">
            Manage your data feeds and configurations
          </p>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300">
          <Sparkles className="w-4 h-4 mr-2" />
          Quick Actions
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/dashboard/ddl" className="group">
          <Card className="p-6 bg-white/5 backdrop-blur-lg border-white/10 hover:bg-white/10 transition-all duration-300 shadow-lg hover:shadow-xl">
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 group-hover:from-blue-500/30 group-hover:to-blue-600/30 transition-all duration-300">
                <Database className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-blue-300 mb-1 font-display">
                  Schema Changes
                </h3>
                <p className="text-sm font-semibold text-white">
                  Database schema creation and modifications
                </p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/dashboard/feeds/new" className="group">
          <Card className="p-6 bg-white/5 backdrop-blur-lg border-white/10 hover:bg-white/10 transition-all duration-300 shadow-lg hover:shadow-xl">
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20 group-hover:from-green-500/30 group-hover:to-green-600/30 transition-all duration-300">
                <Plus className="w-6 h-6 text-green-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-green-300 mb-1 font-display">
                  New Feed
                </h3>
                <p className="text-sm font-semibold text-white">
                  Create and configure new data feeds
                </p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/dashboard/feeds/edit" className="group">
          <Card className="p-6 bg-white/5 backdrop-blur-lg border-white/10 hover:bg-white/10 transition-all duration-300 shadow-lg hover:shadow-xl">
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 group-hover:from-purple-500/30 group-hover:to-purple-600/30 transition-all duration-300">
                <FileEdit className="w-6 h-6 text-purple-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-purple-300 mb-1 font-display">
                  Edit Feeds
                </h3>
                <p className="text-sm font-semibold text-white">
                  Modify existing feed configurations
                </p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/dashboard/migration" className="group">
          <Card className="p-6 bg-white/5 backdrop-blur-lg border-white/10 hover:bg-white/10 transition-all duration-300 shadow-lg hover:shadow-xl">
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/20 group-hover:from-orange-500/30 group-hover:to-orange-600/30 transition-all duration-300">
                <Package className="w-6 h-6 text-orange-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-orange-300 mb-1 font-display">
                  Migration
                </h3>
                <p className="text-sm font-semibold text-white">
                  Promote changes to higher environments
                </p>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      <div className="mt-12 p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 shadow-lg">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-4 font-display">
          Recent Activity
        </h2>
        <div className="space-y-4">
          {[1, 2, 3].map((_, i) => (
            <div
              key={i}
              className="p-4 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                <div>
                  <p className="text-sm font-bold text-blue-300">
                    Feed Configuration Updated
                  </p>
                  <p className="text-xs font-semibold text-white/80">
                    2 hours ago
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                className="text-purple-300 hover:text-white font-bold"
              >
                View Details
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
