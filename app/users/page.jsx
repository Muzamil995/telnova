"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useRoleAuth } from "@/hooks/useRoleAuth";
import { usersAPI } from "@/lib/api";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { PortalSidebar } from "@/components/portal/portal-sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, ChevronLeft, ChevronRight, Edit2 } from "lucide-react";
import { toast } from "react-hot-toast";

// Role badge colors
const roleBadgeColors = {
  admin: "bg-red-100 text-red-800 border border-red-300",
  operator: "bg-blue-100 text-blue-800 border border-blue-300",
  partner: "bg-purple-100 text-purple-800 border border-purple-300",
  user: "bg-gray-100 text-gray-800 border border-gray-300",
};

// Plan badge colors
const planBadgeColors = {
  free: "bg-slate-100 text-slate-800",
  monthly: "bg-green-100 text-green-800",
  yearly: "bg-blue-100 text-blue-800",
  lifetime: "bg-purple-100 text-purple-800",
};

export default function UsersPage() {
  const router = useRouter();
  const { isLoading, user, hasAccess } = useRoleAuth({
    allowedRoles: ["admin"],
    redirectTo: "/portal",
  });

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit] = useState(20);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editFormData, setEditFormData] = useState({
    role: "",
    isActive: true,
    subscription: { plan: "" },
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrentPage(1);
      setSearchQuery(searchInput.trim());
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      return;
    }

    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await usersAPI.getAllUsers(
          currentPage,
          limit,
          searchQuery,
        );

        if (response.success) {
          setUsers(response.users || []);
          setTotalPages(response.pagination?.totalPages || 1);
          setTotalCount(response.pagination?.totalCount || 0);
        }
      } catch (err) {
        setError(err.message || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user, currentPage, limit, searchQuery]);

  const showingFrom = useMemo(() => {
    if (!totalCount) return 0;
    return (currentPage - 1) * limit + 1;
  }, [currentPage, limit, totalCount]);

  const showingTo = useMemo(() => {
    if (!totalCount) return 0;
    return Math.min(currentPage * limit, totalCount);
  }, [currentPage, limit, totalCount]);

  const handleEditUser = (userData) => {
    setSelectedUser(userData);
    setEditFormData({
      role: userData.role,
      isActive: userData.isActive,
      subscription: { plan: userData.subscription?.plan || "free" },
    });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedUser) return;

    try {
      setEditLoading(true);
      const response = await usersAPI.updateUser(
        selectedUser._id,
        editFormData,
      );

      if (response.success) {
        toast.success("User updated successfully");
        setUsers((prevUsers) =>
          prevUsers.map((u) =>
            u._id === selectedUser._id ? response.user : u,
          ),
        );
        setEditDialogOpen(false);
      } else {
        toast.error(response.message || "Failed to update user");
      }
    } catch (err) {
      toast.error(err.message || "Failed to update user");
    } finally {
      setEditLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto size-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-sm text-muted-foreground">Loading users...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <DashboardHeader user={user} />

      <div className="flex flex-1">
        <PortalSidebar user={user} />

        <main className="flex-1 overflow-auto">
          <div className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold">Users</h1>
                  <p className="mt-2 text-muted-foreground">
                    View and manage all registered users
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => router.push("/portal")}
                >
                  ← Back to Portal
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Search</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative max-w-xl">
                    <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, email, phone or role..."
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>All Users</CardTitle>
                  <CardDescription>
                    Showing {showingFrom}-{showingTo} of {totalCount} users
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading && (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center">
                        <div className="mx-auto size-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                        <p className="mt-4 text-sm text-muted-foreground">
                          Loading users...
                        </p>
                      </div>
                    </div>
                  )}

                  {!loading && error && (
                    <div className="rounded-lg border border-destructive bg-destructive/5 p-4">
                      <p className="text-sm text-destructive">{error}</p>
                    </div>
                  )}

                  {!loading && !error && users.length === 0 && (
                    <div className="py-12 text-center">
                      <p className="text-muted-foreground">No users found</p>
                    </div>
                  )}

                  {!loading && !error && users.length > 0 && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="px-4 py-3 text-left font-semibold">
                              Name
                            </th>
                            <th className="px-4 py-3 text-left font-semibold">
                              Email
                            </th>
                            <th className="px-4 py-3 text-left font-semibold">
                              Phone
                            </th>
                            <th className="px-4 py-3 text-left font-semibold">
                              Role
                            </th>
                            <th className="px-4 py-3 text-left font-semibold">
                              Status
                            </th>
                            <th className="px-4 py-3 text-left font-semibold">
                              Plan
                            </th>
                            <th className="px-4 py-3 text-left font-semibold">
                              Joined
                            </th>
                            <th className="px-4 py-3 text-left font-semibold">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((item) => (
                            <tr
                              key={item._id}
                              className="border-b transition-colors hover:bg-muted/50"
                            >
                              <td className="px-4 py-3 font-medium">
                                {item.fullName}
                              </td>
                              <td className="px-4 py-3">{item.email}</td>
                              <td className="px-4 py-3">{item.phoneNumber}</td>
                              <td className="px-4 py-3">
                                <Badge
                                  className={`capitalize ${
                                    roleBadgeColors[item.role] ||
                                    roleBadgeColors.user
                                  }`}
                                >
                                  {item.role}
                                </Badge>
                              </td>
                              <td className="px-4 py-3">
                                <Badge
                                  variant={
                                    item.isActive ? "default" : "secondary"
                                  }
                                >
                                  {item.isActive ? "Active" : "Inactive"}
                                </Badge>
                              </td>
                              <td className="px-4 py-3">
                                <Badge
                                  className={`capitalize ${
                                    planBadgeColors[item.subscription?.plan] ||
                                    planBadgeColors.free
                                  }`}
                                >
                                  {item.subscription?.plan || "free"}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 text-muted-foreground">
                                {new Date(item.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-4 py-3">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditUser(item)}
                                  className="gap-2"
                                >
                                  <Edit2 className="h-4 w-4" />
                                  Edit
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {!loading && !error && totalPages > 1 && (
                    <div className="mt-6 flex items-center justify-between gap-4">
                      <p className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                          }
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="mr-1 size-4" /> Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(prev + 1, totalPages),
                            )
                          }
                          disabled={currentPage === totalPages}
                        >
                          Next <ChevronRight className="ml-1 size-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user details: role, status, and subscription plan
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6 py-4">
              {/* User Info */}
              <div>
                <p className="text-sm font-semibold text-muted-foreground">
                  User
                </p>
                <p className="mt-1 text-sm font-medium">
                  {selectedUser.fullName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {selectedUser.email}
                </p>
              </div>

              {/* Role */}
              <div>
                <label className="text-sm font-semibold">Role</label>
                <select
                  value={editFormData.role}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, role: e.target.value })
                  }
                  className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="user">User</option>
                  <option value="operator">Operator</option>
                  <option value="partner">Partner</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="text-sm font-semibold">Status</label>
                <div className="mt-2 flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="status"
                      checked={editFormData.isActive === true}
                      onChange={() =>
                        setEditFormData({ ...editFormData, isActive: true })
                      }
                      className="cursor-pointer"
                    />
                    <span className="text-sm">Active</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="status"
                      checked={editFormData.isActive === false}
                      onChange={() =>
                        setEditFormData({ ...editFormData, isActive: false })
                      }
                      className="cursor-pointer"
                    />
                    <span className="text-sm">Inactive</span>
                  </label>
                </div>
              </div>

              {/* Plan */}
              <div>
                <label className="text-sm font-semibold">
                  Subscription Plan
                </label>
                <select
                  value={editFormData.subscription.plan}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      subscription: {
                        ...editFormData.subscription,
                        plan: e.target.value,
                      },
                    })
                  }
                  className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="free">Free</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                  <option value="lifetime">Lifetime</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSaveEdit}
                  disabled={editLoading}
                  className="flex-1"
                >
                  {editLoading ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditDialogOpen(false)}
                  disabled={editLoading}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
