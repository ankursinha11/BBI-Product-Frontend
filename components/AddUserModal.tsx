// components/AddUserModal.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createUser } from "@/lib/api";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserAdded?: () => void; // Optional: Callback for when user is added
}

export function AddUserModal({ isOpen, onClose, onUserAdded }: AddUserModalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // Default role
  const [clientId, setClientId] = useState(1); //  Set a default or get dynamically
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      // Get the token from the cookie
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("access_token="))
        ?.split("=")[1];

      if (!token) {
        setError("Not authorized to create users.");
        setIsLoading(false);
        return;
      }

      await createUser(username, password, role, clientId, token);
      onClose(); // Close the modal
      if (onUserAdded) {
        onUserAdded(); // Call the optional callback
      }
    } catch (err: any) {
      setError(err.message || "Failed to create user");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 300 }}
            className="bg-[#000B2E] rounded-xl p-8 w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
            <h2 className="text-3xl font-bold text-white mb-6 font-display">
              Add User
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder-white/50"
                  required
                />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder-white/50"
                  required
                />
              </div>
              <div>
                <label htmlFor="role"  className="block text-sm font-medium text-white">Role:</label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="bg-white/10 border-white/20 text-white p-2 rounded-md w-full"
                >
                  <option value="user">User</option>
                  <option value="viewer">Viewer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <Input
                  type="number"
                  placeholder="Client ID"
                  value={clientId}
                  onChange={(e) => setClientId(parseInt(e.target.value, 10))}
                  className="bg-white/10 border-white/20 text-white placeholder-white/50"
                  required
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-lg"
                disabled={isLoading}
              >
                {isLoading ? "Creating User..." : "Create User"}
              </Button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}