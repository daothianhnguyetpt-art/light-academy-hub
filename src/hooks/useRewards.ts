import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Reward {
  id: string;
  user_id: string;
  reward_type: string;
  title: string;
  description: string | null;
  points_amount: number | null;
  badge_icon: string | null;
  badge_color: string | null;
  awarded_by: string | null;
  created_at: string;
  // Joined data
  user_name?: string;
  awarded_by_name?: string;
}

export function useRewards() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [userRewards, setUserRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Fetch all rewards (for admin)
  const fetchAllRewards = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_rewards')
        .select(`
          *,
          profiles!user_rewards_user_id_fkey(full_name),
          awarded_by_profile:profiles!user_rewards_awarded_by_fkey(full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedRewards = (data || []).map((r: any) => ({
        ...r,
        user_name: r.profiles?.full_name || 'Unknown',
        awarded_by_name: r.awarded_by_profile?.full_name || 'System',
      }));

      setRewards(formattedRewards);
    } catch (error) {
      console.error('Error fetching rewards:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch rewards for current user
  const fetchUserRewards = useCallback(async () => {
    if (!user) {
      setUserRewards([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_rewards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserRewards(data || []);
    } catch (error) {
      console.error('Error fetching user rewards:', error);
    }
  }, [user]);

  // Award a reward to a user
  const awardReward = useCallback(async (
    userId: string,
    rewardType: 'points' | 'badge' | 'certificate',
    title: string,
    description?: string,
    pointsAmount?: number,
    badgeIcon?: string,
    badgeColor?: string
  ) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('user_rewards')
        .insert({
          user_id: userId,
          reward_type: rewardType,
          title,
          description: description || null,
          points_amount: pointsAmount || 0,
          badge_icon: badgeIcon || null,
          badge_color: badgeColor || null,
          awarded_by: user.id,
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error awarding reward:', error);
      return false;
    }
  }, [user]);

  // Delete a reward
  const deleteReward = useCallback(async (rewardId: string) => {
    try {
      const { error } = await supabase
        .from('user_rewards')
        .delete()
        .eq('id', rewardId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting reward:', error);
      return false;
    }
  }, []);

  useEffect(() => {
    fetchUserRewards();
  }, [fetchUserRewards]);

  return {
    rewards,
    userRewards,
    loading,
    fetchAllRewards,
    fetchUserRewards,
    awardReward,
    deleteReward,
  };
}
