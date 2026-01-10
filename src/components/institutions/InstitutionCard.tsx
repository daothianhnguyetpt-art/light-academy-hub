import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Building2, Award, ExternalLink, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Institution, INSTITUTION_TYPES } from '@/hooks/useInstitutions';

interface InstitutionCardProps {
  institution: Institution;
  index?: number;
}

export function InstitutionCard({ institution, index = 0 }: InstitutionCardProps) {
  const typeLabel = INSTITUTION_TYPES.find(t => t.value === institution.institution_type)?.label 
    || institution.institution_type;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link
        to={`/institution/${institution.id}`}
        className="block h-full"
      >
        <div className="h-full bg-card border border-border/50 rounded-xl p-6 hover:shadow-lg hover:border-primary/30 transition-all duration-300 group">
          {/* Header with Logo */}
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {institution.logo_url ? (
                <img 
                  src={institution.logo_url} 
                  alt={institution.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building2 className="w-8 h-8 text-primary/60" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                  {institution.name}
                </h3>
                {institution.verified && (
                  <Tooltip>
                    <TooltipTrigger>
                      <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Đã Xác Minh</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
              
              <Badge variant="secondary" className="text-xs">
                {typeLabel}
              </Badge>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">
              {[institution.city, institution.country].filter(Boolean).join(', ') || 'Chưa cập nhật'}
            </span>
          </div>

          {/* Description */}
          {institution.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {institution.description}
            </p>
          )}

          {/* Footer with Contribution Score */}
          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium text-foreground">
                    {institution.contribution_score || 0}
                  </span>
                  <span className="text-xs text-muted-foreground">điểm đóng góp</span>
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-sm">
                  <strong>Điểm Đóng Góp</strong> thể hiện sự cống hiến của tổ chức cho cộng đồng học thuật, 
                  không phải xếp hạng hay uy tín.
                </p>
              </TooltipContent>
            </Tooltip>

            {institution.website && (
              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
