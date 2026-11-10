"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  ArrowLeft,
  CalendarDays,
  HandCoins,
  Landmark,
  Mail,
  Phone,
  Wallet,
  FileText,
} from "lucide-react";
import { useRoleAuth } from "@/hooks/useRoleAuth";
import { partnersAPI } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value || 0));
}

function formatDateTime(value) {
  if (!value) {
    return "—";
  }

  return new Date(value).toLocaleString();
}

export default function PartnerDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const partnerId = Array.isArray(params?.partnerId)
    ? params.partnerId[0]
    : params?.partnerId;

  const { isLoading, user, hasAccess } = useRoleAuth({
    allowedRoles: ["admin"],
    redirectTo: "/portal",
  });

  const [partner, setPartner] = useState(null);
  const [withdrawals, setWithdrawals] = useState([]);
  const [statementRequests, setStatementRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markingStatementId, setMarkingStatementId] = useState("");

  useEffect(() => {
    if (!user || user.role !== "admin" || !partnerId) {
      return;
    }

    let isMounted = true;

    async function loadPartnerDetails() {
      try {
        setLoading(true);
        const response = await partnersAPI.getAdminPartnerDetails(partnerId);

        if (!isMounted) {
          return;
        }

        setPartner(response.partner || null);
        setWithdrawals(response.withdrawals || []);
        setStatementRequests(response.statementRequests || []);
      } catch (error) {
        if (isMounted) {
          setPartner(null);
          setWithdrawals([]);
          setStatementRequests([]);
          toast.error(error.message || "Failed to load partner details");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadPartnerDetails();

    return () => {
      isMounted = false;
    };
  }, [user, partnerId]);

  const pendingCount = useMemo(
    () => withdrawals.filter((item) => item.status === "pending").length,
    [withdrawals],
  );

  const paidCount = useMemo(
    () => withdrawals.filter((item) => item.status === "paid").length,
    [withdrawals],
  );

  const totalRequested = useMemo(
    () =>
      withdrawals.reduce(
        (sum, withdrawal) => sum + Number(withdrawal.amount || 0),
        0,
      ),
    [withdrawals],
  );

  const pendingStatementCount = useMemo(
    () => statementRequests.filter((item) => item.status === "pending").length,
    [statementRequests],
  );

  const deliveredStatementCount = useMemo(
    () =>
      statementRequests.filter((item) => item.status === "delivered").length,
    [statementRequests],
  );

  const handleMarkStatementDelivered = async (statementId) => {
    try {
      setMarkingStatementId(statementId);
      const response = await partnersAPI.markStatementDelivered(statementId);

      if (response.success) {
        toast.success("Statement marked as delivered");
        setStatementRequests((current) =>
          current.map((statement) =>
            statement._id === statementId
              ? { ...statement, ...response.statementRequest }
              : statement,
          ),
        );
      }
    } catch (error) {
      toast.error(error.message || "Failed to update statement request");
    } finally {
      setMarkingStatementId("");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mx-auto size-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-sm text-muted-foreground">
            Loading partner details...
          </p>
        </div>
      </div>
    );
  }

  if (!hasAccess || !user) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-muted-foreground">Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl p-4 sm:p-8">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Button
              variant="ghost"
              className="mb-2 -ml-3 gap-2"
              onClick={() => router.push("/portal/partners")}
            >
              <ArrowLeft className="size-4" />
              Back to Partners
            </Button>
            <h1 className="text-3xl font-bold">Partner Details</h1>
            <p className="mt-2 text-muted-foreground">
              Review partner profile information and complete withdrawal
              history.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="mx-auto size-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="mt-4 text-sm text-muted-foreground">
                Fetching partner record...
              </p>
            </div>
          </div>
        ) : !partner ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-sm text-muted-foreground">
                Partner not found or no longer available.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Current Balance</CardTitle>
                  <CardDescription>Available payout balance</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-3">
                  <Wallet className="size-5 text-emerald-600" />
                  <p className="text-2xl font-bold">
                    {formatCurrency(partner.currentBalance)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Total Withdrawn</CardTitle>
                  <CardDescription>Lifetime paid withdrawals</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-3">
                  <HandCoins className="size-5 text-blue-600" />
                  <p className="text-2xl font-bold">
                    {formatCurrency(partner.totalWithdrawn)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Total Requested</CardTitle>
                  <CardDescription>All withdrawal requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {formatCurrency(totalRequested)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Request Status</CardTitle>
                  <CardDescription>Pending vs paid payouts</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium">
                    {pendingCount} pending · {paidCount} paid
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <Card>
                <CardHeader>
                  <CardTitle>{partner.partnerName}</CardTitle>
                  <CardDescription>
                    Detailed partner profile and account information.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">
                        Partner Name
                      </p>
                      <p className="mt-1 text-sm font-medium">
                        {partner.partnerName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">
                        TFN
                      </p>
                      <p className="mt-1 text-sm font-medium">
                        {partner.partnerTFN}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">
                        Email
                      </p>
                      <p className="mt-1 flex items-center gap-2 text-sm font-medium">
                        <Mail className="size-4 text-muted-foreground" />
                        {partner.user?.email || "No email"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">
                        Phone
                      </p>
                      <p className="mt-1 flex items-center gap-2 text-sm font-medium">
                        <Phone className="size-4 text-muted-foreground" />
                        {partner.user?.phoneNumber || "No phone"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">
                        Account Status
                      </p>
                      <div className="mt-1">
                        <Badge
                          variant={
                            partner.user?.isActive ? "default" : "secondary"
                          }
                        >
                          {partner.user?.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">
                        Created On
                      </p>
                      <p className="mt-1 flex items-center gap-2 text-sm font-medium">
                        <CalendarDays className="size-4 text-muted-foreground" />
                        {formatDateTime(partner.createdAt)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payout Details</CardTitle>
                  <CardDescription>
                    Saved payment method for partner withdrawals.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-xl border bg-muted/40 p-4">
                    <div className="flex items-center gap-2">
                      <Landmark className="size-4 text-primary" />
                      <p className="font-semibold">Payment Method</p>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {partner.paymentMethodSummary}
                    </p>
                  </div>

                  {!partner.hasSavedPaymentMethod && (
                    <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
                      This partner has not configured payout details yet.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Withdrawal History</CardTitle>
                <CardDescription>
                  Complete record of payout requests for this partner.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {withdrawals.length === 0 ? (
                  <div className="rounded-xl border border-dashed p-6 text-sm text-muted-foreground">
                    No withdrawal requests have been made yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="px-4 py-3 text-left font-semibold">
                            Requested
                          </th>
                          <th className="px-4 py-3 text-left font-semibold">
                            Amount
                          </th>
                          <th className="px-4 py-3 text-left font-semibold">
                            Status
                          </th>
                          <th className="px-4 py-3 text-left font-semibold">
                            Payment Method
                          </th>
                          <th className="px-4 py-3 text-left font-semibold">
                            Paid At
                          </th>
                          <th className="px-4 py-3 text-left font-semibold">
                            Notes
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {withdrawals.map((withdrawal) => (
                          <tr
                            key={withdrawal._id}
                            className="border-b align-top hover:bg-muted/40"
                          >
                            <td className="px-4 py-3">
                              {formatDateTime(withdrawal.requestedAt)}
                            </td>
                            <td className="px-4 py-3 font-medium">
                              {formatCurrency(withdrawal.amount)}
                            </td>
                            <td className="px-4 py-3">
                              <Badge
                                variant={
                                  withdrawal.status === "paid"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {withdrawal.status}
                              </Badge>
                            </td>
                            <td className="px-4 py-3">
                              {withdrawal.paymentMethodSummary}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">
                              {formatDateTime(withdrawal.paidAt)}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">
                              {withdrawal.notes || "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>TFN Statement Requests</CardTitle>
                <CardDescription>
                  Requested statements and their delivery status for this
                  partner.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex items-center gap-3 text-sm text-muted-foreground">
                  <FileText className="size-4 text-primary" />
                  <span>
                    {pendingStatementCount} pending · {deliveredStatementCount}{" "}
                    delivered
                  </span>
                </div>

                {statementRequests.length === 0 ? (
                  <div className="rounded-xl border border-dashed p-6 text-sm text-muted-foreground">
                    No TFN statement requests have been made yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="px-4 py-3 text-left font-semibold">
                            Requested
                          </th>
                          <th className="px-4 py-3 text-left font-semibold">
                            Status
                          </th>
                          <th className="px-4 py-3 text-left font-semibold">
                            Delivered At
                          </th>
                          <th className="px-4 py-3 text-left font-semibold">
                            Notes
                          </th>
                          <th className="px-4 py-3 text-left font-semibold">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {statementRequests.map((statement) => (
                          <tr
                            key={statement._id}
                            className="border-b align-top hover:bg-muted/40"
                          >
                            <td className="px-4 py-3">
                              {formatDateTime(statement.requestedAt)}
                            </td>
                            <td className="px-4 py-3">
                              <Badge
                                variant={
                                  statement.status === "delivered"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {statement.status}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">
                              {formatDateTime(statement.deliveredAt)}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">
                              {statement.notes || "—"}
                            </td>
                            <td className="px-4 py-3">
                              {statement.status === "pending" ? (
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleMarkStatementDelivered(statement._id)
                                  }
                                  disabled={
                                    markingStatementId === statement._id
                                  }
                                >
                                  {markingStatementId === statement._id
                                    ? "Saving..."
                                    : "Mark as Delivered"}
                                </Button>
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
