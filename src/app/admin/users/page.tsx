"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Ban,
  Trash2,
  Shield,
  ShieldCheck,
  UserPlus,
  X,
  AlertTriangle,
  Crown,
  Users,
  ShieldAlert,
} from "lucide-react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store";

interface UserRow {
  id: string;
  username: string;
  email: string;
  role: string;
  avatar: string | null;
  created_at: string;
}

export default function AdminUsersPage() {
  const { user: currentUser } = useAuthStore();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<"all" | "admin" | "user">("all");
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [addingAdmin, setAddingAdmin] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: "promote" | "demote" | "ban" | "delete";
    user: UserRow;
  } | null>(null);

  // Fetch users from Supabase
  const fetchUsers = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setUsers(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users
  const filtered = users.filter((u) => {
    const matchSearch =
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === "all" || u.role === filterRole;
    return matchSearch && matchRole;
  });

  const adminCount = users.filter((u) => u.role === "admin").length;
  const userCount = users.filter((u) => u.role === "user").length;

  // Toggle role via API
  const handleToggleRole = async (targetUser: UserRow) => {
    const newRole = targetUser.role === "admin" ? "user" : "admin";

    // Prevent demoting yourself
    if (targetUser.id === currentUser?.id && newRole === "user") {
      toast.error("لا يمكنك إزالة صلاحيات الأدمن من نفسك");
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${targetUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setUsers((prev) =>
        prev.map((u) =>
          u.id === targetUser.id ? { ...u, role: newRole } : u
        )
      );

      toast.success(
        newRole === "admin"
          ? `✅ ${targetUser.username} أصبح أدمن`
          : `${targetUser.username} تم إزالة صلاحيات الأدمن`
      );
    } catch (err: any) {
      toast.error(err.message || "فشل تحديث الصلاحية");
    }
    setConfirmAction(null);
  };

  // Add admin by email
  const handleAddAdmin = async () => {
    if (!adminEmail.trim()) return;
    setAddingAdmin(true);

    try {
      const supabase = createClient();

      // Find user by email
      const { data: targetUser, error } = await supabase
        .from("users")
        .select("id, username, email, role")
        .eq("email", adminEmail.trim())
        .single();

      if (error || !targetUser) {
        toast.error("هذا الإيميل غير مسجل في المنصة");
        setAddingAdmin(false);
        return;
      }

      if (targetUser.role === "admin") {
        toast.error("هذا المستخدم أدمن بالفعل");
        setAddingAdmin(false);
        return;
      }

      const res = await fetch(`/api/admin/users/${targetUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "admin" }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }

      setUsers((prev) =>
        prev.map((u) =>
          u.id === targetUser.id ? { ...u, role: "admin" } : u
        )
      );

      toast.success(`✅ ${targetUser.username} أصبح أدمن`);
      setAdminEmail("");
      setShowAddAdmin(false);
    } catch (err: any) {
      toast.error(err.message || "فشل إضافة الأدمن");
    }
    setAddingAdmin(false);
  };

  // Delete user
  const handleDelete = async (targetUser: UserRow) => {
    if (targetUser.id === currentUser?.id) {
      toast.error("لا يمكنك حذف حسابك");
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${targetUser.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }

      setUsers((prev) => prev.filter((u) => u.id !== targetUser.id));
      toast.success(`تم حذف ${targetUser.username}`);
    } catch (err: any) {
      toast.error(err.message || "فشل الحذف");
    }
    setConfirmAction(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Users Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {users.length} users total • {adminCount} admins • {userCount} users
          </p>
        </div>
        <button
          onClick={() => setShowAddAdmin(true)}
          className="btn-primary flex items-center gap-2"
        >
          <UserPlus size={16} />
          Add Admin
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white">
            <Users size={20} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{users.length}</p>
            <p className="text-xs text-gray-500">Total Users</p>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white">
            <Crown size={20} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{adminCount}</p>
            <p className="text-xs text-gray-500">Admins</p>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white">
            <ShieldAlert size={20} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{userCount}</p>
            <p className="text-xs text-gray-500">Regular Users</p>
          </div>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="input-field pl-9"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "admin", "user"] as const).map((role) => (
            <button
              key={role}
              onClick={() => setFilterRole(role)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filterRole === role
                  ? "bg-primary text-white shadow-md"
                  : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700"
              }`}
            >
              {role === "all" ? "All" : role === "admin" ? "👑 Admins" : "Users"}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase tracking-wider bg-gray-50 dark:bg-slate-800/50">
                  <th className="px-5 py-3">User</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Joined</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                {filtered.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-bold shrink-0">
                          {user.username?.charAt(0).toUpperCase() || "?"}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                              {user.username}
                            </p>
                            {user.id === currentUser?.id && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary">
                                You
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          user.role === "admin"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                            : "bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-gray-400"
                        }`}
                      >
                        {user.role === "admin" ? (
                          <Crown size={12} />
                        ) : (
                          <Shield size={12} />
                        )}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        {/* Toggle Role */}
                        <button
                          onClick={() =>
                            setConfirmAction({
                              type: user.role === "admin" ? "demote" : "promote",
                              user,
                            })
                          }
                          className={`p-2 rounded-lg transition-colors ${
                            user.role === "admin"
                              ? "hover:bg-amber-100 dark:hover:bg-amber-900/30 text-amber-500"
                              : "hover:bg-purple-100 dark:hover:bg-purple-900/30 text-purple-500"
                          }`}
                          title={
                            user.role === "admin"
                              ? "Remove Admin"
                              : "Make Admin"
                          }
                        >
                          {user.role === "admin" ? (
                            <ShieldCheck size={17} />
                          ) : (
                            <Shield size={17} />
                          )}
                        </button>

                        {/* Delete */}
                        {user.id !== currentUser?.id && (
                          <button
                            onClick={() =>
                              setConfirmAction({ type: "delete", user })
                            }
                            className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 transition-colors"
                            title="Delete User"
                          >
                            <Trash2 size={17} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="px-5 py-12 text-center text-gray-400">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ===== Add Admin Modal ===== */}
      <AnimatePresence>
        {showAddAdmin && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowAddAdmin(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
            >
              <div className="glass-card rounded-2xl p-6 mx-4">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white">
                      <Crown size={20} />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                      Add New Admin
                    </h2>
                  </div>
                  <button
                    onClick={() => setShowAddAdmin(false)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500"
                  >
                    <X size={18} />
                  </button>
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  أدخل إيميل المستخدم المسجل في المنصة لترقيته إلى أدمن
                </p>

                <div className="space-y-4">
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="input-field"
                    onKeyDown={(e) => e.key === "Enter" && handleAddAdmin()}
                  />

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowAddAdmin(false)}
                      className="flex-1 btn-secondary py-3"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddAdmin}
                      disabled={addingAdmin || !adminEmail.trim()}
                      className="flex-1 btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {addingAdmin ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Crown size={16} />
                          Make Admin
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ===== Confirm Action Modal ===== */}
      <AnimatePresence>
        {confirmAction && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setConfirmAction(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm z-50"
            >
              <div className="glass-card rounded-2xl p-6 mx-4">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${
                      confirmAction.type === "delete"
                        ? "bg-red-500"
                        : confirmAction.type === "promote"
                        ? "bg-gradient-to-br from-amber-500 to-orange-500"
                        : "bg-gray-500"
                    }`}
                  >
                    <AlertTriangle size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      {confirmAction.type === "promote"
                        ? "ترقية إلى أدمن"
                        : confirmAction.type === "demote"
                        ? "إزالة صلاحيات الأدمن"
                        : "حذف المستخدم"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {confirmAction.user.username} ({confirmAction.user.email})
                    </p>
                  </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-300 mb-5">
                  {confirmAction.type === "promote"
                    ? "هل تريد ترقية هذا المستخدم إلى أدمن؟ سيحصل على كل صلاحيات الإدارة."
                    : confirmAction.type === "demote"
                    ? "هل تريد إزالة صلاحيات الأدمن من هذا المستخدم؟"
                    : "هل أنت متأكد من حذف هذا المستخدم؟ لا يمكن التراجع عن هذا الإجراء."}
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setConfirmAction(null)}
                    className="flex-1 btn-secondary py-2.5"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={() =>
                      confirmAction.type === "delete"
                        ? handleDelete(confirmAction.user)
                        : handleToggleRole(confirmAction.user)
                    }
                    className={`flex-1 py-2.5 rounded-xl font-semibold text-sm text-white transition-all ${
                      confirmAction.type === "delete"
                        ? "bg-red-500 hover:bg-red-600"
                        : "btn-primary"
                    }`}
                  >
                    {confirmAction.type === "promote"
                      ? "ترقية"
                      : confirmAction.type === "demote"
                      ? "إزالة"
                      : "حذف"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
