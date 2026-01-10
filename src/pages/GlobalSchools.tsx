import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Globe, Building2, Sparkles, MapPin } from 'lucide-react';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { InstitutionCard } from '@/components/institutions/InstitutionCard';
import { 
  useInstitutions, 
  useFeaturedRemoteSchools,
  REGIONS, 
  INSTITUTION_TYPES,
  InstitutionFilters 
} from '@/hooks/useInstitutions';
import { useWallet } from '@/hooks/useWallet';

export default function GlobalSchools() {
  const { connectWallet, isConnected, address, isConnecting, connectingWallet } = useWallet();
  
  const [filters, setFilters] = useState<InstitutionFilters>({});
  const [searchInput, setSearchInput] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Debounced search
  const debouncedFilters = useMemo(() => ({
    ...filters,
    search: searchInput || undefined,
  }), [filters, searchInput]);

  const { institutions, loading, error } = useInstitutions(debouncedFilters);
  const { featuredSchools, loading: featuredLoading } = useFeaturedRemoteSchools();

  const handleFilterChange = (key: keyof InstitutionFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === 'all' ? undefined : value,
    }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchInput('');
  };

  const hasActiveFilters = Object.values(filters).some(Boolean) || searchInput;

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
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full mb-6">
                <Globe className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-accent">Mạng Lưới Học Thuật Toàn Cầu</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
                Global Schools
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8">
                Khám phá mạng lưới trường học, đại học và tổ chức giáo dục từ khắp nơi trên thế giới.
                Mọi tổ chức đều bình đẳng, không xếp hạng, chỉ có sự đóng góp.
              </p>

              {/* Search Bar */}
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm trường học, tổ chức..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-12 h-12 text-base"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Featured Remote Schools Section - Global South Visibility */}
        {!hasActiveFilters && featuredSchools.length > 0 && (
          <section className="py-8 border-b border-border/50">
            <div className="container mx-auto px-4">
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="w-5 h-5 text-accent" />
                <h2 className="text-xl font-semibold text-foreground">Trường Học Nổi Bật</h2>
                <span className="text-sm text-muted-foreground">— Từ khắp nơi trên thế giới</span>
              </div>
              
              {featuredLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-48 rounded-xl" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {featuredSchools.map((school, index) => (
                    <InstitutionCard key={school.id} institution={school} index={index} />
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Filters Section */}
        <section className="py-6 border-b border-border/50 sticky top-16 bg-background/95 backdrop-blur-sm z-40">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center gap-4">
              <Button
                variant={showFilters ? "default" : "outline"}
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2"
              >
                <Filter className="w-4 h-4" />
                Bộ Lọc
              </Button>

              {showFilters && (
                <>
                  <Select
                    value={filters.region || 'all'}
                    onValueChange={(value) => handleFilterChange('region', value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Khu Vực" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất Cả Khu Vực</SelectItem>
                      {REGIONS.map((region) => (
                        <SelectItem key={region.value} value={region.value}>
                          {region.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={filters.institution_type || 'all'}
                    onValueChange={(value) => handleFilterChange('institution_type', value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Loại Hình" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất Cả Loại Hình</SelectItem>
                      {INSTITUTION_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      Xóa bộ lọc
                    </Button>
                  )}
                </>
              )}

              <div className="ml-auto text-sm text-muted-foreground">
                {loading ? 'Đang tải...' : `${institutions.length} tổ chức`}
              </div>
            </div>
          </div>
        </section>

        {/* Institutions Grid */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(9)].map((_, i) => (
                  <Skeleton key={i} className="h-64 rounded-xl" />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <Building2 className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">{error}</h3>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Thử lại
                </Button>
              </div>
            ) : institutions.length === 0 ? (
              <div className="text-center py-16">
                <Globe className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Chưa có tổ chức nào
                </h3>
                <p className="text-muted-foreground mb-4">
                  {hasActiveFilters 
                    ? 'Không tìm thấy tổ chức phù hợp với bộ lọc của bạn.'
                    : 'Mạng lưới học thuật đang được xây dựng.'}
                </p>
                {hasActiveFilters && (
                  <Button variant="outline" onClick={clearFilters}>
                    Xóa bộ lọc
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {institutions.map((institution, index) => (
                  <InstitutionCard 
                    key={institution.id} 
                    institution={institution} 
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="py-16 bg-gradient-to-t from-primary/5 to-transparent">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <Sparkles className="w-8 h-8 text-accent mx-auto mb-4" />
              <h2 className="text-2xl font-display font-semibold text-foreground mb-4">
                Triết Lý Bình Đẳng
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                FUN Academy không sử dụng hệ thống xếp hạng truyền thống. Thay vào đó, 
                chúng tôi đề cao <strong className="text-foreground">sự đóng góp</strong> và <strong className="text-foreground">hợp tác</strong>.
                Mọi trường học từ làng quê đến thành phố, từ Nam Bán Cầu đến Bắc Bán Cầu, 
                đều được hiển thị bình đẳng. Chân lý, cống hiến và phục vụ quan trọng hơn thương hiệu.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
