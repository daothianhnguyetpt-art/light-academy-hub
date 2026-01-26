import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Key, Loader2, Eye, EyeOff, Info } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "@/i18n/useTranslation";
import { supabase } from "@/integrations/supabase/client";

interface SetPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userEmail: string;
}

const setPasswordSchema = z.object({
  newPassword: z.string()
    .min(6, "passwordTooShort")
    .max(72, "passwordTooLong"),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "passwordMismatch",
  path: ["confirmPassword"],
});

type SetPasswordFormData = z.infer<typeof setPasswordSchema>;

export function SetPasswordModal({
  open,
  onOpenChange,
  userEmail,
}: SetPasswordModalProps) {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<SetPasswordFormData>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SetPasswordFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword,
      });

      if (error) {
        throw error;
      }

      toast.success(t("profile.setPasswordModal.success"));
      form.reset();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Set password error:", error);
      toast.error(t("profile.setPasswordModal.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const getErrorMessage = (errorKey: string) => {
    const messages: Record<string, string> = {
      passwordTooShort: t("profile.setPasswordModal.passwordTooShort"),
      passwordTooLong: t("profile.setPasswordModal.passwordTooLong") || "Password must be less than 72 characters",
      passwordMismatch: t("profile.setPasswordModal.passwordMismatch"),
    };
    return messages[errorKey] || errorKey;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="w-5 h-5 text-primary" />
            {t("profile.setPasswordModal.title")}
          </DialogTitle>
          <DialogDescription>
            {t("profile.setPasswordModal.description")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/50 border border-border mb-4">
          <Info className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground">
            {t("profile.setPasswordModal.infoMessage") || 
              "After setting a password, you can login with either Google or email/password."}
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Display */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("profile.setPasswordModal.email")}
              </label>
              <Input
                value={userEmail}
                disabled
                className="bg-muted cursor-not-allowed"
              />
            </div>

            {/* New Password */}
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("profile.setPasswordModal.newPassword")}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.newPassword?.message && 
                      getErrorMessage(form.formState.errors.newPassword.message)}
                  </FormMessage>
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("profile.setPasswordModal.confirmPassword")}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.confirmPassword?.message && 
                      getErrorMessage(form.formState.errors.confirmPassword.message)}
                  </FormMessage>
                </FormItem>
              )}
            />

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                {t("common.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary-gold"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t("profile.setPasswordModal.saving")}
                  </>
                ) : (
                  t("profile.setPasswordModal.save")
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
