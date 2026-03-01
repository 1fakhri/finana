-- Seed data for Finana demo: Alex Rivera
-- Note: This seed file creates a demo auth user and populates all tables.
-- Run with: supabase db reset (which runs migrations + seed)

-- Create demo auth user (Supabase manages auth.users)
-- The user_id below is a fixed UUID for the demo user
-- When running locally, create this user via Supabase Auth UI or API first,
-- then update the UUID below to match.

-- Demo user UUID placeholder (update after creating auth user via supabase dashboard or API)
DO $$
DECLARE
  demo_user_id uuid := '00000000-0000-0000-0000-000000000001';
BEGIN

-- Insert into auth.users for local dev (this works with supabase local)
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  aud,
  role
) VALUES (
  demo_user_id,
  '00000000-0000-0000-0000-000000000000',
  'alex.rivera@email.com',
  crypt('password123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}'::jsonb,
  '{"name": "Alex Rivera"}'::jsonb,
  'authenticated',
  'authenticated'
) ON CONFLICT (id) DO NOTHING;

-- User Profile
INSERT INTO user_profiles (user_id, name, email, age, occupation, monthly_income, account_balance, savings_goal, savings_progress, currency)
VALUES (
  demo_user_id,
  'Alex Rivera',
  'alex.rivera@email.com',
  26,
  'Junior UX Designer',
  3800.00,
  412.37,
  5000.00,
  1240.00,
  'USD'
);

-- Subscriptions (8 active)
INSERT INTO subscriptions (user_id, name, icon, monthly_cost, billing_date, status, category, notes, target_url) VALUES
  (demo_user_id, 'StreamMax Pro',    'tv',       24.99, 5,  'active', 'Entertainment', 'Premium tier. Target for demo cancel.', 'http://localhost:3001'),
  (demo_user_id, 'Spotify Premium',  'music',    10.99, 12, 'active', 'Music',         'Family plan, shared with roommate.', NULL),
  (demo_user_id, 'Adobe CC',         'pen-tool', 54.99, 1,  'active', 'Productivity',  'Needed for work.', NULL),
  (demo_user_id, 'FitZone+',         'dumbbell', 29.99, 18, 'active', 'Fitness',       'Hasn''t logged in for 2 months.', NULL),
  (demo_user_id, 'CloudVault',       'cloud',    9.99,  8,  'active', 'Storage',       '2TB plan, using 340GB.', NULL),
  (demo_user_id, 'MealPrepKit',      'utensils', 49.99, 22, 'active', 'Food',          'Ordered once, forgot to cancel.', NULL),
  (demo_user_id, 'GamePass Ultra',   'gamepad-2',16.99, 15, 'active', 'Gaming',        'Plays occasionally.', NULL),
  (demo_user_id, 'NewsDigest Pro',   'newspaper',12.99, 3,  'active', 'News',          'Never reads it.', NULL);

-- Transactions (16 entries, last 30 days)
INSERT INTO transactions (user_id, description, amount, category, merchant, transaction_date, notes) VALUES
  (demo_user_id, 'Zara Online purchase',          127.50, 'Shopping',     'Zara Online',        '2026-02-27', 'Impulse buy. Third this month.'),
  (demo_user_id, 'Uber Eats delivery',            34.80,  'Food Delivery','Uber Eats',          '2026-02-25', 'Late night order.'),
  (demo_user_id, 'Starbucks coffee',              7.45,   'Coffee',       'Starbucks',          '2026-02-24', 'Venti Iced Latte.'),
  (demo_user_id, 'MealPrepKit subscription',      49.99,  'Subscription', 'MealPrepKit',        '2026-02-22', 'Auto-renewed.'),
  (demo_user_id, 'Amazon purchase',               89.00,  'Shopping',     'Amazon',             '2026-02-20', 'Mechanical keyboard.'),
  (demo_user_id, 'Uber Eats delivery',            28.50,  'Food Delivery','Uber Eats',          '2026-02-18', 'Dinner delivery.'),
  (demo_user_id, 'GamePass Ultra subscription',   16.99,  'Subscription', 'GamePass Ultra',     '2026-02-15', 'Auto-renewed.'),
  (demo_user_id, 'Sephora purchase',              62.00,  'Beauty',       'Sephora',            '2026-02-14', 'Valentine''s Day gift.'),
  (demo_user_id, 'Spotify Premium subscription',  10.99,  'Subscription', 'Spotify Premium',    '2026-02-12', 'Auto-renewed.'),
  (demo_user_id, 'Nike Online purchase',          145.00, 'Shopping',     'Nike Online',        '2026-02-10', 'Running shoes.'),
  (demo_user_id, 'CloudVault subscription',       9.99,   'Subscription', 'CloudVault',         '2026-02-08', 'Auto-renewed.'),
  (demo_user_id, 'StreamMax Pro subscription',    24.99,  'Subscription', 'StreamMax Pro',      '2026-02-05', 'Auto-renewed.'),
  (demo_user_id, 'Uber Eats delivery',            22.15,  'Food Delivery','Uber Eats',          '2026-02-03', 'Lunch delivery.'),
  (demo_user_id, 'NewsDigest Pro subscription',   12.99,  'Subscription', 'NewsDigest Pro',     '2026-02-03', 'Auto-renewed.'),
  (demo_user_id, 'Adobe CC subscription',         54.99,  'Subscription', 'Adobe CC',           '2026-02-01', 'Auto-renewed.'),
  (demo_user_id, 'Target purchase',               53.20,  'Shopping',     'Target',             '2026-01-30', 'Household items.');

-- User Preferences
INSERT INTO user_preferences (user_id, roast_level, spending_personality, onboarding_completed)
VALUES (
  demo_user_id,
  'balanced',
  ARRAY['Impulse Shopper', 'Subscription Hoarder'],
  true
);

END $$;
