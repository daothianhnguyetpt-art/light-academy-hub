import { useState, useEffect } from 'react';
import { Building2, GraduationCap, FileText, Calendar, Link as LinkIcon, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useVerification, VerificationRequest } from '@/hooks/useVerification';
import { toast } from 'sonner';

interface VerificationRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const VERIFICATION_TYPES = [
  { value: 'student', label: 'Sinh viên' },
  { value: 'alumni', label: 'Cựu sinh viên' },
  { value: 'faculty', label: 'Giảng viên' },
  { value: 'staff', label: 'Nhân viên' },
  { value: 'researcher', label: 'Nhà nghiên cứu' },
];

interface InstitutionOption {
  id: string;
  name: string;
}

export function VerificationRequestModal({ 
  open, 
  onOpenChange,
  onSuccess 
}: VerificationRequestModalProps) {
  const { submitVerificationRequest, submitting } = useVerification();
  
  const [institutions, setInstitutions] = useState<InstitutionOption[]>([]);
  const [loadingInstitutions, setLoadingInstitutions] = useState(true);
  
  const [formData, setFormData] = useState<VerificationRequest>({
    institution_id: '',
    verification_type: '',
    credential_name: '',
    field_of_study: '',
    start_date: '',
    end_date: '',
    evidence_url: '',
  });

  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        const { data, error } = await supabase
          .from('institutions')
          .select('id, name')
          .order('name');
        
        if (error) throw error;
        setInstitutions(data || []);
      } catch (err) {
        console.error('Error fetching institutions:', err);
      } finally {
        setLoadingInstitutions(false);
      }
    };

    if (open) {
      fetchInstitutions();
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.institution_id || !formData.verification_type || !formData.credential_name) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    const success = await submitVerificationRequest(formData);
    
    if (success) {
      setFormData({
        institution_id: '',
        verification_type: '',
        credential_name: '',
        field_of_study: '',
        start_date: '',
        end_date: '',
        evidence_url: '',
      });
      onOpenChange(false);
      onSuccess?.();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            Yêu Cầu Xác Minh Học Thuật
          </DialogTitle>
          <DialogDescription>
            Gửi yêu cầu xác minh danh tính học thuật của bạn với một tổ chức giáo dục.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Institution */}
          <div className="space-y-2">
            <Label htmlFor="institution" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Tổ Chức <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.institution_id}
              onValueChange={(value) => setFormData(prev => ({ ...prev, institution_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder={loadingInstitutions ? "Đang tải..." : "Chọn tổ chức"} />
              </SelectTrigger>
              <SelectContent>
                {institutions.map((inst) => (
                  <SelectItem key={inst.id} value={inst.id}>
                    {inst.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Verification Type */}
          <div className="space-y-2">
            <Label htmlFor="type" className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              Loại Xác Minh <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.verification_type}
              onValueChange={(value) => setFormData(prev => ({ ...prev, verification_type: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại xác minh" />
              </SelectTrigger>
              <SelectContent>
                {VERIFICATION_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Credential Name */}
          <div className="space-y-2">
            <Label htmlFor="credential" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Bằng cấp / Chức danh <span className="text-destructive">*</span>
            </Label>
            <Input
              id="credential"
              placeholder="VD: Cử nhân Khoa học Máy tính"
              value={formData.credential_name}
              onChange={(e) => setFormData(prev => ({ ...prev, credential_name: e.target.value }))}
            />
          </div>

          {/* Field of Study */}
          <div className="space-y-2">
            <Label htmlFor="field">Chuyên ngành</Label>
            <Input
              id="field"
              placeholder="VD: Khoa học Máy tính"
              value={formData.field_of_study}
              onChange={(e) => setFormData(prev => ({ ...prev, field_of_study: e.target.value }))}
            />
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Ngày bắt đầu
              </Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date">Ngày kết thúc</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
              />
            </div>
          </div>

          {/* Evidence URL */}
          <div className="space-y-2">
            <Label htmlFor="evidence" className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4" />
              Link chứng minh (tùy chọn)
            </Label>
            <Input
              id="evidence"
              type="url"
              placeholder="https://..."
              value={formData.evidence_url}
              onChange={(e) => setFormData(prev => ({ ...prev, evidence_url: e.target.value }))}
            />
            <p className="text-xs text-muted-foreground">
              Link tới giấy tờ chứng minh (bằng cấp, thẻ sinh viên, v.v.)
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="flex-1"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang gửi...
                </>
              ) : (
                'Gửi Yêu Cầu'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
