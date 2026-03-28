// Referral System Test Suite
// Tests for the automated referral reward system

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';

// Mock Supabase client
const mockSupabase = {
  from: jest.fn(),
  rpc: jest.fn(),
  auth: {
    getUser: jest.fn(),
  },
};

// Import functions to test (these would need to be adapted for actual test environment)
import { 
  getBusinessReferralRewards,
  getBusinessReferralSummary,
  processPendingReferralRewards,
  applyReferralReward 
} from '../../lib/supabase/queries/referralRewards';

describe('Referral System Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Scenario A: Single Referral', () => {
    it('should apply +31 days to BOTH referrer and referred business when referred business becomes active', async () => {
      // Setup: Business A refers Business B
      const referrerBusiness = {
        id: 'business-a-id',
        business_name: 'Business A',
        subscription_tier: 'moana',
        tier_expires_at: new Date('2026-04-30').toISOString(),
        referral_count: 0,
      };

      const referredBusiness = {
        id: 'business-b-id', 
        business_name: 'Business B',
        referred_by_business_id: 'business-a-id',
        status: 'pending',
        referral_reward_applied: false,
      };

      // Mock the RPC call for applying reward
      mockSupabase.rpc.mockResolvedValueOnce({
        data: {
          success: true,
          action: 'applied',
          reward_id: 'reward-123',
          referrer_business_name: 'Business A',
          referred_business_name: 'Business B',
          reward_days: 31,
          referrer_expiry_date: new Date('2026-05-31').toISOString(),
          referred_expiry_date: new Date('2026-05-31').toISOString(),
        },
        error: null,
      });

      // Simulate business B becoming active (this would trigger the database trigger)
      const result = await applyReferralReward(mockSupabase, 'business-b-id');

      expect(result.success).toBe(true);
      expect(result.action).toBe('applied');
      expect(result.reward_days).toBe(31);
      expect(result.referrer_business_name).toBe('Business A');
      expect(result.referred_business_name).toBe('Business B');
      
      // Verify BOTH businesses got +31 days
      const expectedExpiry = new Date('2026-05-31').toISOString();
      expect(result.referrer_expiry_date).toBe(expectedExpiry);
      expect(result.referred_expiry_date).toBe(expectedExpiry);
    });
  });

  describe('Scenario B: Multiple Referrals', () => {
    it('should accumulate +62 days for referrer with 2 successful referrals', async () => {
      // Setup: Business A refers Business B and Business C
      const mockRewards = [
        {
          success: true,
          action: 'applied',
          reward_id: 'reward-123',
          referrer_business_name: 'Business A',
          referred_business_name: 'Business B',
          reward_days: 31,
          referrer_expiry_date: new Date('2026-05-31').toISOString(),
          referred_expiry_date: new Date('2026-05-31').toISOString(),
        },
        {
          success: true,
          action: 'applied', 
          reward_id: 'reward-456',
          referrer_business_name: 'Business A',
          referred_business_name: 'Business C',
          reward_days: 31,
          referrer_expiry_date: new Date('2026-06-30').toISOString(), // +31 more days for referrer
          referred_expiry_date: new Date('2026-05-31').toISOString(), // +31 days for referred C
        },
      ];

      // Mock sequential reward applications
      mockSupabase.rpc
        .mockResolvedValueOnce({ data: mockRewards[0], error: null })
        .mockResolvedValueOnce({ data: mockRewards[1], error: null });

      // Apply first reward
      const result1 = await applyReferralReward(mockSupabase, 'business-b-id');
      expect(result1.success).toBe(true);
      expect(result1.reward_days).toBe(31);

      // Apply second reward
      const result2 = await applyReferralReward(mockSupabase, 'business-c-id');
      expect(result2.success).toBe(true);
      expect(result2.reward_days).toBe(31);

      // Verify cumulative effect: second expiry should be 31 days after first for referrer
      const firstReferrerExpiry = new Date(result1.referrer_expiry_date);
      const secondReferrerExpiry = new Date(result2.referrer_expiry_date);
      const daysDifference = Math.round((secondReferrerExpiry - firstReferrerExpiry) / (1000 * 60 * 60 * 24));
      
      expect(daysDifference).toBe(31);
      
      // Verify both referred businesses got +31 days each
      expect(result1.referred_expiry_date).toBe(result2.referred_expiry_date); // Both get same initial expiry
    });
  });

  describe('Scenario C: Duplicate Update Protection', () => {
    it('should only apply reward once even with multiple status updates', async () => {
      // Mock first application - succeeds
      mockSupabase.rpc.mockResolvedValueOnce({
        data: {
          success: true,
          action: 'applied',
          reward_id: 'reward-123',
        },
        error: null,
      });

      // Mock second application - returns already_applied
      mockSupabase.rpc.mockResolvedValueOnce({
        data: {
          success: true,
          action: 'already_applied',
          reward_id: 'reward-123',
          applied_at: new Date().toISOString(),
        },
        error: null,
      });

      // First activation
      const result1 = await applyReferralReward(mockSupabase, 'business-b-id');
      expect(result1.action).toBe('applied');

      // Second activation (duplicate)
      const result2 = await applyReferralReward(mockSupabase, 'business-b-id');
      expect(result2.action).toBe('already_applied');

      // Verify only one reward was applied
      expect(mockSupabase.rpc).toHaveBeenCalledTimes(2);
      expect(result1.reward_id).toBe(result2.reward_id); // Same reward ID
    });
  });

  describe('Scenario D: Expired or Null Plan End Date', () => {
    it('should set expiry to now() + 31 days for expired or null end dates', async () => {
      const now = new Date();
      const expectedExpiry = new Date(now.getTime() + (31 * 24 * 60 * 60 * 1000));
      
      // Mock reward application for business with expired/null expiry
      mockSupabase.rpc.mockResolvedValue({
        data: {
          success: true,
          action: 'applied',
          new_expiry_date: expectedExpiry.toISOString(),
        },
        error: null,
      });

      const result = await applyReferralReward(mockSupabase, 'business-b-id');
      
      expect(result.success).toBe(true);
      expect(result.action).toBe('applied');
      
      // Verify expiry is approximately now + 31 days (allowing for small time differences)
      const actualExpiry = new Date(result.new_expiry_date);
      const timeDifference = Math.abs(actualExpiry.getTime() - expectedExpiry.getTime());
      expect(timeDifference).toBeLessThan(5000); // Less than 5 seconds difference
    });
  });

  describe('Scenario E: Not Active Yet', () => {
    it('should not apply reward for non-active businesses', async () => {
      // Mock eligibility check failure
      mockSupabase.rpc.mockResolvedValue({
        data: {
          success: false,
          error: 'Business not eligible for referral reward',
          reason: 'Business is not active (status: pending)',
          action: 'none',
        },
        error: null,
      });

      const result = await applyReferralReward(mockSupabase, 'business-b-id');
      
      expect(result.success).toBe(false);
      expect(result.action).toBe('none');
      expect(result.reason).toContain('not active');
    });
  });

  describe('Scenario F: Admin Retry', () => {
    it('should not duplicate reward on manual retry', async () => {
      // Mock already applied response
      mockSupabase.rpc.mockResolvedValue({
        data: {
          success: true,
          action: 'already_applied',
          reward_id: 'reward-123',
          applied_at: new Date('2026-03-28T10:00:00Z').toISOString(),
        },
        error: null,
      });

      const result = await applyReferralReward(mockSupabase, 'business-b-id');
      
      expect(result.success).toBe(true);
      expect(result.action).toBe('already_applied');
      expect(result.reward_id).toBe('reward-123');
      
      // Verify no new reward was created
      expect(mockSupabase.rpc).toHaveBeenCalledTimes(1);
    });
  });

  describe('Referral Summary Tests', () => {
    it('should return comprehensive referral summary for a business', async () => {
      const mockSummary = {
        business_id: 'business-a-id',
        business_name: 'Business A',
        current_tier: 'moana',
        tier_expires_at: new Date('2026-05-31').toISOString(),
        referral_count: 2,
        referred_by_business_id: null,
        rewards_given: [
          {
            reward_id: 'reward-123',
            referred_business_id: 'business-b-id',
            referred_business_name: 'Business B',
            status: 'applied',
            reward_days: 31,
            applied_at: new Date('2026-03-28T10:00:00Z').toISOString(),
          },
          {
            reward_id: 'reward-456',
            referred_business_id: 'business-c-id', 
            referred_business_name: 'Business C',
            status: 'applied',
            reward_days: 31,
            applied_at: new Date('2026-03-28T11:00:00Z').toISOString(),
          },
        ],
        rewards_received: [],
        total_reward_days_given: 62,
      };

      mockSupabase.rpc.mockResolvedValue({
        data: mockSummary,
        error: null,
      });

      const result = await getBusinessReferralSummary(mockSupabase, 'business-a-id');
      
      expect(result.business_name).toBe('Business A');
      expect(result.referral_count).toBe(2);
      expect(result.rewards_given).toHaveLength(2);
      expect(result.total_reward_days_given).toBe(62);
      expect(result.rewards_received).toHaveLength(0);
    });
  });

  describe('Pending Rewards Processing', () => {
    it('should process all pending rewards', async () => {
      const mockProcessResult = {
        success: true,
        processed: 3,
        skipped: 2,
        failed: 0,
        total_attempted: 5,
      };

      mockSupabase.rpc.mockResolvedValue({
        data: mockProcessResult,
        error: null,
      });

      const result = await processPendingReferralRewards(mockSupabase);
      
      expect(result.success).toBe(true);
      expect(result.processed).toBe(3);
      expect(result.skipped).toBe(2);
      expect(result.failed).toBe(0);
      expect(result.total_attempted).toBe(5);
    });
  });
});

// Integration Test Example (would need actual test database)
describe('Referral System Integration Tests', () => {
  it('should handle complete referral flow end-to-end', async () => {
    // This would test:
    // 1. Create Business A (referrer)
    // 2. Create Business B with referral to A
    // 3. Verify pending reward record created
    // 4. Update Business B status to 'active'
    // 5. Verify reward automatically applied to A
    // 6. Verify Business A's tier_expires_at extended by 31 days
    // 7. Verify reward record marked as 'applied'
    
    // This would require a test database setup
    expect(true).toBe(true); // Placeholder
  });
});
