-- user_profiles (replaces profile.json)
create table user_profiles (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  name text not null,
  email text not null,
  age integer,
  occupation text,
  monthly_income numeric(10,2) not null default 0,
  account_balance numeric(10,2) not null default 0,
  savings_goal numeric(10,2) not null default 0,
  savings_progress numeric(10,2) not null default 0,
  currency text not null default 'USD',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- subscriptions (replaces subscriptions.json)
create table subscriptions (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  icon text,
  monthly_cost numeric(10,2) not null,
  billing_date integer not null,
  status text not null default 'active',
  category text not null,
  notes text,
  target_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- transactions (replaces transactions.json)
create table transactions (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  description text not null,
  amount numeric(10,2) not null,
  category text not null,
  merchant text,
  transaction_date date not null,
  notes text,
  created_at timestamptz not null default now()
);

-- user_preferences (replaces localStorage onboarding data)
create table user_preferences (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  roast_level text not null default 'balanced',
  spending_personality text[],
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- spending_summaries (computed view, replaces summary.json)
create view spending_summaries as
select
  t.user_id,
  coalesce(sum(t.amount), 0) as total_spend_30d,
  coalesce(sum(case when t.category = 'Subscription' then t.amount end), 0) as subscription_spend_30d,
  (select count(*) from subscriptions s where s.user_id = t.user_id and s.status = 'active') as subscription_count,
  coalesce(sum(case when t.category = 'Food Delivery' then t.amount end), 0) as food_delivery_spend_30d,
  coalesce(sum(case when t.category = 'Shopping' then t.amount end), 0) as shopping_spend_30d
from transactions t
where t.transaction_date >= current_date - interval '30 days'
group by t.user_id;

-- RLS policies (users can only access own data)
-- Backend uses service-role key which bypasses RLS for all queries
alter table user_profiles enable row level security;
alter table subscriptions enable row level security;
alter table transactions enable row level security;
alter table user_preferences enable row level security;

create policy "Users can read own profile" on user_profiles for select using (auth.uid() = user_id);
create policy "Users can read own subscriptions" on subscriptions for select using (auth.uid() = user_id);
create policy "Users can read own transactions" on transactions for select using (auth.uid() = user_id);
create policy "Users can read own preferences" on user_preferences for select using (auth.uid() = user_id);
