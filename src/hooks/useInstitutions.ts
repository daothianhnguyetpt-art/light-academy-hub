import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Institution {
  id: string;
  name: string;
  institution_type: string;
  country: string | null;
  region: string | null;
  city: string | null;
  description: string | null;
  logo_url: string | null;
  website: string | null;
  contribution_score: number | null;
  verified: boolean | null;
  founding_year: number | null;
  wallet_address: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  created_at: string | null;
}

export interface InstitutionMember {
  id: string;
  user_id: string;
  institution_id: string;
  member_role: string;
  department: string | null;
  title: string | null;
  verified: boolean | null;
  joined_at: string | null;
  profile?: {
    full_name: string | null;
    avatar_url: string | null;
    academic_title: string | null;
  };
}

export interface Partnership {
  id: string;
  institution_a_id: string;
  institution_b_id: string;
  partnership_type: string;
  status: string | null;
  established_at: string | null;
  partner?: Institution;
}

export interface InstitutionFilters {
  country?: string;
  region?: string;
  institution_type?: string;
  search?: string;
}

// Regions for Global South visibility
export const REGIONS = [
  { value: 'africa', label: 'Châu Phi' },
  { value: 'southeast_asia', label: 'Đông Nam Á' },
  { value: 'latin_america', label: 'Mỹ Latinh' },
  { value: 'middle_east', label: 'Trung Đông' },
  { value: 'south_asia', label: 'Nam Á' },
  { value: 'pacific_islands', label: 'Quần Đảo Thái Bình Dương' },
  { value: 'eastern_europe', label: 'Đông Âu' },
  { value: 'western_europe', label: 'Tây Âu' },
  { value: 'north_america', label: 'Bắc Mỹ' },
  { value: 'east_asia', label: 'Đông Á' },
  { value: 'oceania', label: 'Châu Đại Dương' },
];

export const INSTITUTION_TYPES = [
  { value: 'university', label: 'Đại Học' },
  { value: 'school', label: 'Trường Học' },
  { value: 'organization', label: 'Tổ Chức' },
  { value: 'independent', label: 'Nhà Giáo Dục Độc Lập' },
  { value: 'research', label: 'Viện Nghiên Cứu' },
];

export function useInstitutions(filters?: InstitutionFilters) {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInstitutions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('institutions')
        .select('*')
        .order('contribution_score', { ascending: false, nullsFirst: false });

      if (filters?.country) {
        query = query.eq('country', filters.country);
      }

      if (filters?.region) {
        query = query.eq('region', filters.region);
      }

      if (filters?.institution_type) {
        query = query.eq('institution_type', filters.institution_type);
      }

      if (filters?.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      // Shuffle institutions with same contribution score for equal visibility
      const shuffled = shuffleEqualScores(data || []);
      setInstitutions(shuffled);

    } catch (err) {
      console.error('Error fetching institutions:', err);
      setError('Không thể tải danh sách trường học');
    } finally {
      setLoading(false);
    }
  }, [filters?.country, filters?.region, filters?.institution_type, filters?.search]);

  useEffect(() => {
    fetchInstitutions();
  }, [fetchInstitutions]);

  return {
    institutions,
    loading,
    error,
    refetch: fetchInstitutions,
  };
}

export function useInstitutionDetail(institutionId: string | undefined) {
  const [institution, setInstitution] = useState<Institution | null>(null);
  const [members, setMembers] = useState<InstitutionMember[]>([]);
  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInstitutionDetail = useCallback(async () => {
    if (!institutionId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch institution details
      const { data: institutionData, error: institutionError } = await supabase
        .from('institutions')
        .select('*')
        .eq('id', institutionId)
        .maybeSingle();

      if (institutionError) throw institutionError;
      setInstitution(institutionData);

      // Fetch members with profile info
      const { data: membersData, error: membersError } = await supabase
        .from('institution_members')
        .select(`
          *,
          profile:profiles(full_name, avatar_url, academic_title)
        `)
        .eq('institution_id', institutionId)
        .order('joined_at', { ascending: false });

      if (membersError) throw membersError;
      setMembers(membersData?.map(m => ({
        ...m,
        profile: Array.isArray(m.profile) ? m.profile[0] : m.profile
      })) || []);

      // Fetch partnerships
      const { data: partnershipsData, error: partnershipsError } = await supabase
        .from('partnerships')
        .select('*')
        .or(`institution_a_id.eq.${institutionId},institution_b_id.eq.${institutionId}`)
        .eq('status', 'active');

      if (partnershipsError) throw partnershipsError;

      // Fetch partner institution details
      if (partnershipsData && partnershipsData.length > 0) {
        const partnerIds = partnershipsData.map(p => 
          p.institution_a_id === institutionId ? p.institution_b_id : p.institution_a_id
        );
        
        const { data: partnersData } = await supabase
          .from('institutions')
          .select('*')
          .in('id', partnerIds);

        const partnersMap = new Map(partnersData?.map(p => [p.id, p]));
        
        setPartnerships(partnershipsData.map(p => ({
          ...p,
          partner: partnersMap.get(
            p.institution_a_id === institutionId ? p.institution_b_id : p.institution_a_id
          )
        })));
      } else {
        setPartnerships([]);
      }

      // Fetch courses
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .eq('institution_id', institutionId)
        .order('created_at', { ascending: false });

      if (coursesError) throw coursesError;
      setCourses(coursesData || []);

    } catch (err) {
      console.error('Error fetching institution detail:', err);
      setError('Không thể tải thông tin trường học');
    } finally {
      setLoading(false);
    }
  }, [institutionId]);

  useEffect(() => {
    fetchInstitutionDetail();
  }, [fetchInstitutionDetail]);

  return {
    institution,
    members,
    partnerships,
    courses,
    loading,
    error,
    refetch: fetchInstitutionDetail,
  };
}

export function useFeaturedRemoteSchools() {
  const [featuredSchools, setFeaturedSchools] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        // Prioritize Global South regions
        const globalSouthRegions = ['africa', 'southeast_asia', 'latin_america', 'middle_east', 'south_asia', 'pacific_islands'];
        
        const { data, error } = await supabase
          .from('institutions')
          .select('*')
          .in('region', globalSouthRegions)
          .limit(10);

        if (error) throw error;

        // Random shuffle and pick 4
        const shuffled = (data || []).sort(() => Math.random() - 0.5).slice(0, 4);
        setFeaturedSchools(shuffled);

      } catch (err) {
        console.error('Error fetching featured schools:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return { featuredSchools, loading };
}

// Helper function to shuffle institutions with equal contribution scores
function shuffleEqualScores(institutions: Institution[]): Institution[] {
  if (institutions.length <= 1) return institutions;

  const result: Institution[] = [];
  let currentGroup: Institution[] = [];
  let currentScore: number | null = null;

  for (const inst of institutions) {
    if (inst.contribution_score !== currentScore) {
      // Shuffle and add the previous group
      if (currentGroup.length > 0) {
        result.push(...currentGroup.sort(() => Math.random() - 0.5));
      }
      currentGroup = [inst];
      currentScore = inst.contribution_score;
    } else {
      currentGroup.push(inst);
    }
  }

  // Don't forget the last group
  if (currentGroup.length > 0) {
    result.push(...currentGroup.sort(() => Math.random() - 0.5));
  }

  return result;
}
