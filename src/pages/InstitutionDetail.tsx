import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Building2, MapPin, Globe, Calendar, Award, CheckCircle2, 
  Users, BookOpen, Handshake, ExternalLink, ArrowLeft, Mail, Phone 
} from 'lucide-react';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useInstitutionDetail, INSTITUTION_TYPES } from '@/hooks/useInstitutions';
import { useWallet } from '@/hooks/useWallet';

export default function InstitutionDetail() {
  const { id } = useParams<{ id: string }>();
  const { connectWallet, isConnected, address, isConnecting, connectingWallet } = useWallet();
  const { institution, members, partnerships, courses, loading, error } = useInstitutionDetail(id);

  const typeLabel = INSTITUTION_TYPES.find(t => t.value === institution?.institution_type)?.label 
    || institution?.institution_type;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header
          onConnectWallet={connectWallet}
          isWalletConnected={isConnected}
          walletAddress={address}
          isConnectingWallet={isConnecting}
          connectingWalletType={connectingWallet}
        />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <Skeleton className="h-64 rounded-xl mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-48 rounded-xl" />
                <Skeleton className="h-48 rounded-xl" />
              </div>
              <div className="space-y-6">
                <Skeleton className="h-48 rounded-xl" />
                <Skeleton className="h-48 rounded-xl" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !institution) {
    return (
      <div className="min-h-screen bg-background">
        <Header
          onConnectWallet={connectWallet}
          isWalletConnected={isConnected}
          walletAddress={address}
          isConnectingWallet={isConnecting}
          connectingWalletType={connectingWallet}
        />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center py-16">
            <Building2 className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Không tìm thấy tổ chức
            </h2>
            <p className="text-muted-foreground mb-6">
              Tổ chức này không tồn tại hoặc đã bị xóa.
            </p>
            <Button asChild>
              <Link to="/global-schools">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại danh sách
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        onConnectWallet={connectWallet}
        isWalletConnected={isConnected}
        walletAddress={address}
        isConnectingWallet={isConnecting}
        connectingWalletType={connectingWallet}
      />

      <main className="pt-20 pb-16">
        {/* Back Button */}
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" asChild className="gap-2">
            <Link to="/global-schools">
              <ArrowLeft className="w-4 h-4" />
              Quay lại danh sách
            </Link>
          </Button>
        </div>

        {/* Hero Section */}
        <section className="pb-8">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-primary/5 via-accent/5 to-transparent rounded-2xl p-8 border border-border/50"
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Logo */}
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-card flex items-center justify-center flex-shrink-0 overflow-hidden border border-border/50">
                  {institution.logo_url ? (
                    <img 
                      src={institution.logo_url} 
                      alt={institution.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Building2 className="w-12 h-12 text-primary/60" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                      {institution.name}
                    </h1>
                    {institution.verified && (
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge className="gap-1 bg-accent/20 text-accent border-accent/30">
                            <CheckCircle2 className="w-3 h-3" />
                            Đã Xác Minh
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Tổ chức này đã được xác minh danh tính</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4">
                    <Badge variant="secondary">{typeLabel}</Badge>
                    
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{[institution.city, institution.country].filter(Boolean).join(', ') || 'Chưa cập nhật'}</span>
                    </div>

                    {institution.founding_year && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Thành lập {institution.founding_year}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 rounded-lg">
                          <Award className="w-5 h-5 text-accent" />
                          <span className="font-semibold text-foreground">
                            {institution.contribution_score || 0}
                          </span>
                          <span className="text-sm text-muted-foreground">điểm đóng góp</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>Điểm Đóng Góp thể hiện sự cống hiến cho cộng đồng học thuật, không phải xếp hạng.</p>
                      </TooltipContent>
                    </Tooltip>

                    {institution.website && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={institution.website} target="_blank" rel="noopener noreferrer">
                          <Globe className="w-4 h-4 mr-2" />
                          Website
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Content Grid */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* About */}
                {institution.description && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Building2 className="w-5 h-5 text-primary" />
                          Giới Thiệu
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                          {institution.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Members */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary" />
                        Thành Viên ({members.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {members.length === 0 ? (
                        <p className="text-muted-foreground text-center py-4">
                          Chưa có thành viên nào được công bố ✨
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {members.map((member) => (
                            <div 
                              key={member.id}
                              className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                            >
                              <Avatar>
                                <AvatarImage src={member.profile?.avatar_url || ''} />
                                <AvatarFallback>
                                  {member.profile?.full_name?.charAt(0) || 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-foreground truncate">
                                    {member.profile?.full_name || 'Thành viên'}
                                  </span>
                                  {member.verified && (
                                    <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                                  )}
                                </div>
                                <div className="text-sm text-muted-foreground truncate">
                                  {member.title || member.member_role}
                                  {member.department && ` • ${member.department}`}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Courses */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-primary" />
                        Khóa Học ({courses.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {courses.length === 0 ? (
                        <p className="text-muted-foreground text-center py-4">
                          Chưa có khóa học nào được công bố 📚
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {courses.map((course) => (
                            <div
                              key={course.id}
                              className="p-4 rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
                            >
                              <h4 className="font-medium text-foreground mb-1 line-clamp-2">
                                {course.title}
                              </h4>
                              {course.category && (
                                <Badge variant="secondary" className="text-xs">
                                  {course.category}
                                </Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                {/* Contact Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Thông Tin Liên Hệ</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {institution.email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <a href={`mailto:${institution.email}`} className="text-primary hover:underline">
                            {institution.email}
                          </a>
                        </div>
                      )}
                      {institution.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{institution.phone}</span>
                        </div>
                      )}
                      {institution.address && (
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                          <span className="text-muted-foreground">{institution.address}</span>
                        </div>
                      )}
                      {!institution.email && !institution.phone && !institution.address && (
                        <p className="text-sm text-muted-foreground">Chưa có thông tin liên hệ</p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Partnerships */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Handshake className="w-5 h-5 text-primary" />
                        Đối Tác ({partnerships.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {partnerships.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-2">
                          Đang mở rộng mạng lưới 🌐
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {partnerships.map((partnership) => (
                            <Link
                              key={partnership.id}
                              to={`/institution/${partnership.partner?.id}`}
                              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                            >
                              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                {partnership.partner?.logo_url ? (
                                  <img 
                                    src={partnership.partner.logo_url} 
                                    alt={partnership.partner.name}
                                    className="w-full h-full object-cover rounded-lg"
                                  />
                                ) : (
                                  <Building2 className="w-5 h-5 text-primary/60" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">
                                  {partnership.partner?.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {partnership.partnership_type}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
