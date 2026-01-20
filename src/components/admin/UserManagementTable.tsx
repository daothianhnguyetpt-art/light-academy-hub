import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useTranslation } from "@/i18n";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useOwner } from "@/hooks/useOwner";
import { Loader2, Shield, GraduationCap, BookOpen, User, Crown, Trash2 } from "lucide-react";

interface UserWithRole {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  email?: string;
  role: string;
  created_at: string | null;
}

export function UserManagementTable() {
  const { t } = useTranslation();
  const { isOwner, loading: ownerLoading } = useOwner();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, created_at')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch user roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Merge profiles with roles
      const rolesMap = new Map(roles?.map(r => [r.user_id, r.role]) || []);
      
      const usersWithRoles: UserWithRole[] = (profiles || []).map(profile => ({
        ...profile,
        role: rolesMap.get(profile.id) || 'learner',
      }));

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: t("common.error"),
        description: t("admin.fetchUsersFailed"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdatingUserId(userId);

    try {
      // Check if user already has a role entry
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (existingRole) {
        // Update existing role
        const { error } = await supabase
          .from('user_roles')
          .update({ role: newRole as any })
          .eq('user_id', userId);

        if (error) throw error;
      } else {
        // Insert new role
        const { error } = await supabase
          .from('user_roles')
          .insert([{ user_id: userId, role: newRole as any }]);

        if (error) throw error;
      }

      toast({
        title: t("admin.roleChanged"),
        description: t("admin.roleChangedDesc"),
      });

      // Update local state
      setUsers(users.map(u => 
        u.id === userId ? { ...u, role: newRole } : u
      ));
    } catch (error: any) {
      toast({
        title: t("common.error"),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleDeleteRole = async (userId: string) => {
    setDeletingUserId(userId);
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: t("common.success"),
        description: t("admin.roleChangedDesc"),
      });

      // Update local state
      setUsers(users.map(u => 
        u.id === userId ? { ...u, role: 'learner' } : u
      ));
    } catch (error: any) {
      toast({
        title: t("common.error"),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeletingUserId(null);
    }
  };

  const canChangeRole = (targetRole: string) => {
    // Owner can change any role
    if (isOwner) return true;
    // Admin cannot change owner or other admins
    if (targetRole === 'owner' || targetRole === 'admin') return false;
    return true;
  };

  const getAvailableRoles = () => {
    // Owner can assign any role
    if (isOwner) {
      return ['owner', 'admin', 'moderator', 'educator', 'learner'];
    }
    // Admin can only assign non-admin roles
    return ['moderator', 'educator', 'learner'];
  };

  const getRoleBadge = (role: string) => {
    const config: Record<string, { icon: any; className: string; label: string }> = {
      owner: { 
        icon: Crown, 
        className: "bg-amber-100 text-amber-700 border-amber-300",
        label: t("admin.roles.owner")
      },
      admin: { 
        icon: Shield, 
        className: "bg-purple-100 text-purple-700 border-purple-200",
        label: t("admin.roles.admin")
      },
      moderator: { 
        icon: Shield, 
        className: "bg-blue-100 text-blue-700 border-blue-200",
        label: t("admin.roles.moderator")
      },
      educator: { 
        icon: GraduationCap, 
        className: "bg-green-100 text-green-700 border-green-200",
        label: t("admin.roles.educator")
      },
      learner: { 
        icon: BookOpen, 
        className: "bg-gray-100 text-gray-700 border-gray-200",
        label: t("admin.roles.learner")
      },
    };

    const roleConfig = config[role] || config.learner;
    const Icon = roleConfig.icon;

    return (
      <Badge className={roleConfig.className} variant="outline">
        <Icon className="w-3 h-3 mr-1" />
        {roleConfig.label}
      </Badge>
    );
  };

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("admin.user")}</TableHead>
            <TableHead>{t("admin.currentRole")}</TableHead>
            <TableHead>{t("admin.changeRole")}</TableHead>
            {isOwner && <TableHead className="w-[80px]">{t("admin.actions")}</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={isOwner ? 4 : 3} className="text-center text-muted-foreground py-8">
                {t("admin.noUsers")}
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => {
              const canChange = canChangeRole(user.role);
              return (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar_url || undefined} />
                        <AvatarFallback>{getInitials(user.full_name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{user.full_name || t("admin.anonymous")}</p>
                          {user.role === 'owner' && (
                            <Crown className="w-4 h-4 text-amber-500" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">ID: {user.id.slice(0, 8)}...</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>
                    {user.role === 'owner' ? (
                      <span className="text-sm text-muted-foreground italic">
                        {t("admin.cannotChangeOwner")}
                      </span>
                    ) : !canChange ? (
                      <span className="text-sm text-muted-foreground italic">
                        {t("admin.cannotChangeAdmin")}
                      </span>
                    ) : (
                      <Select
                        value={user.role}
                        onValueChange={(value) => handleRoleChange(user.id, value)}
                        disabled={updatingUserId === user.id}
                      >
                        <SelectTrigger className="w-[140px]">
                          {updatingUserId === user.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <SelectValue />
                          )}
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableRoles().map((role) => (
                            <SelectItem key={role} value={role}>
                              {t(`admin.roles.${role}`)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </TableCell>
                  {isOwner && (
                    <TableCell>
                      {user.role !== 'owner' && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              disabled={deletingUserId === user.id}
                            >
                              {deletingUserId === user.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>{t("admin.deleteRole")}</AlertDialogTitle>
                              <AlertDialogDescription>
                                {t("admin.deleteRoleConfirm")}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteRole(user.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                {t("common.delete")}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
