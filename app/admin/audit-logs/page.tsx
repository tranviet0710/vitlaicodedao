"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Calendar,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  table_name: string;
  record_id: string | null;
  details: unknown;
  created_at: string;
}

export default function AuditLogsViewerPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAction, setFilterAction] = useState("all");
  const [filterTable, setFilterTable] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchLogs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from("admin_audit_logs")
        .select("*")
        .order("created_at", { ascending: false });

      if (filterAction !== "all") {
        query = query.eq("action", filterAction);
      }

      if (filterTable !== "all") {
        query = query.eq("table_name", filterTable);
      }

      if (startDate) {
        query = query.gte("created_at", new Date(startDate).toISOString());
      }

      if (endDate) {
        const endDateTime = new Date(endDate);
        endDateTime.setHours(23, 59, 59, 999);
        query = query.lte("created_at", endDateTime.toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải nhật ký kiểm tra",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    fetchLogs();
  };

  const handleReset = () => {
    setSearchTerm("");
    setFilterAction("all");
    setFilterTable("all");
    setStartDate("");
    setEndDate("");
    setTimeout(fetchLogs, 100);
  };

  const getActionIcon = (action: string) => {
    if (action.includes("view")) return <Eye className="w-4 h-4" />;
    if (action.includes("update")) return <Edit className="w-4 h-4" />;
    if (action.includes("delete")) return <Trash2 className="w-4 h-4" />;
    return <Search className="w-4 h-4" />;
  };

  const getActionColor = (action: string) => {
    if (action.includes("view")) return "text-primary";
    if (action.includes("update")) return "text-accent";
    if (action.includes("delete")) return "text-destructive";
    return "text-foreground";
  };

  const filteredLogs = logs.filter((log) => {
    if (!searchTerm) return true;
    return (
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.table_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user_id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (authLoading || !user) return null;

  return (
    <AdminLayout>
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">
            Nhật ký Kiểm tra
          </h1>
          <p className="text-foreground/60">
            Xem và theo dõi hoạt động của quản trị viên
          </p>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-8 bg-card border-border/50">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-foreground/60" />
              <h3 className="text-lg font-semibold">Bộ lọc</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Tìm kiếm</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground/60" />
                  <Input
                    placeholder="Tìm theo action, table..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Action Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Hành động</label>
                <Select value={filterAction} onValueChange={setFilterAction}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="view_support_requests">
                      Xem yêu cầu
                    </SelectItem>
                    <SelectItem value="update_status">
                      Cập nhật trạng thái
                    </SelectItem>
                    <SelectItem value="delete_request">Xóa yêu cầu</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Table Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Bảng</label>
                <Select value={filterTable} onValueChange={setFilterTable}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="support_requests">
                      Yêu cầu hỗ trợ
                    </SelectItem>
                    <SelectItem value="blogs">Blogs</SelectItem>
                    <SelectItem value="projects">Projects</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Start Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Từ ngày</label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Đến ngày</label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSearch} variant="default">
                <Search className="w-4 h-4 mr-2" />
                Tìm kiếm
              </Button>
              <Button onClick={handleReset} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Đặt lại
              </Button>
            </div>
          </div>
        </Card>

        {/* Logs List */}
        {isLoading ? (
          <div className="text-center py-8">Đang tải...</div>
        ) : (
          <div className="space-y-4">
            {filteredLogs.length === 0 ? (
              <Card className="p-8 text-center bg-card border-border/50">
                <p className="text-foreground/60">Không tìm thấy nhật ký nào</p>
              </Card>
            ) : (
              filteredLogs.map((log) => (
                <Card
                  key={log.id}
                  className="p-6 bg-card border-border/50 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className={`mt-1 ${getActionColor(log.action)}`}>
                      {getActionIcon(log.action)}
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-semibold text-foreground">
                              {log.action.replace(/_/g, " ").toUpperCase()}
                            </span>
                            <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                              {log.table_name}
                            </span>
                          </div>
                          <div className="text-sm text-foreground/60">
                            User ID:{" "}
                            <span className="font-mono text-xs">
                              {log.user_id}
                            </span>
                          </div>
                          {log.record_id && (
                            <div className="text-sm text-foreground/60">
                              Record ID:{" "}
                              <span className="font-mono text-xs">
                                {log.record_id}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-sm text-foreground/60">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {format(
                              new Date(log.created_at),
                              "dd/MM/yyyy HH:mm:ss"
                            )}
                          </span>
                        </div>
                      </div>

                      {log.details && (
                        <div className="bg-secondary/30 p-3 rounded-lg">
                          <pre className="text-xs text-foreground/80 whitespace-pre-wrap overflow-x-auto">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
