import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Radio, Users, Plus, Loader2, ArrowLeft, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "@/i18n";
import { useAdmin } from "@/hooks/useAdmin";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { LivestreamForm } from "@/components/admin/LivestreamForm";
import { LivestreamTable } from "@/components/admin/LivestreamTable";
import { UserManagementTable } from "@/components/admin/UserManagementTable";
import { RewardForm } from "@/components/admin/RewardForm";
import { RewardHistoryTable } from "@/components/admin/RewardHistoryTable";

export default function AdminDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  
  const [classes, setClasses] = useState<any[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<any>(null);
  const [isRewardFormOpen, setIsRewardFormOpen] = useState(false);
  const [rewardRefreshKey, setRewardRefreshKey] = useState(0);

  const fetchClasses = async () => {
    try {
      const { data, error } = await supabase
        .from('live_classes')
        .select('*')
        .order('scheduled_at', { ascending: false });

      if (error) throw error;
      setClasses(data || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoadingClasses(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchClasses();
    }
  }, [isAdmin]);

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!authLoading && !adminLoading) {
      if (!user) {
        navigate('/');
      } else if (!isAdmin) {
        navigate('/');
      }
    }
  }, [user, isAdmin, authLoading, adminLoading, navigate]);

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const handleEdit = (classItem: any) => {
    setEditingClass(classItem);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingClass(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {t("common.back")}
              </Button>
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-primary" />
                <h1 className="text-xl font-bold">{t("admin.dashboard")}</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Tabs defaultValue="livestream" className="space-y-6">
            <TabsList className="grid w-full max-w-2xl grid-cols-3">
              <TabsTrigger value="livestream" className="gap-2">
                <Radio className="w-4 h-4" />
                {t("admin.livestreamManagement")}
              </TabsTrigger>
              <TabsTrigger value="users" className="gap-2">
                <Users className="w-4 h-4" />
                {t("admin.userManagement")}
              </TabsTrigger>
              <TabsTrigger value="rewards" className="gap-2">
                <Gift className="w-4 h-4" />
                {t("admin.rewards.title")}
              </TabsTrigger>
            </TabsList>

            {/* Livestream Management Tab */}
            <TabsContent value="livestream" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">{t("admin.livestreamManagement")}</h2>
                  <p className="text-sm text-muted-foreground">
                    {t("admin.livestreamManagementDesc")}
                  </p>
                </div>
                <Button onClick={() => setIsFormOpen(true)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  {t("admin.addLivestream")}
                </Button>
              </div>

              {loadingClasses ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <LivestreamTable
                  classes={classes}
                  onEdit={handleEdit}
                  onRefresh={fetchClasses}
                />
              )}
            </TabsContent>

            {/* User Management Tab */}
            <TabsContent value="users" className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold">{t("admin.userManagement")}</h2>
                <p className="text-sm text-muted-foreground">
                  {t("admin.userManagementDesc")}
                </p>
              </div>

              <UserManagementTable />
            </TabsContent>

            {/* Rewards Management Tab */}
            <TabsContent value="rewards" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">{t("admin.rewards.title")}</h2>
                  <p className="text-sm text-muted-foreground">
                    {t("admin.rewards.description")}
                  </p>
                </div>
                <Button onClick={() => setIsRewardFormOpen(true)} className="gap-2">
                  <Gift className="w-4 h-4" />
                  {t("admin.rewards.grantReward")}
                </Button>
              </div>

              <RewardHistoryTable key={rewardRefreshKey} />
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>

      {/* Livestream Form Modal */}
      <LivestreamForm
        open={isFormOpen}
        onOpenChange={handleFormClose}
        editingClass={editingClass}
        onSuccess={() => {
          fetchClasses();
          handleFormClose();
        }}
      />

      {/* Reward Form Modal */}
      <RewardForm
        open={isRewardFormOpen}
        onOpenChange={setIsRewardFormOpen}
        onSuccess={() => {
          setRewardRefreshKey((k) => k + 1);
          setIsRewardFormOpen(false);
        }}
      />
    </div>
  );
}
