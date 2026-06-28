-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text not null unique,
  email text not null,
  created_at timestamptz default now()
);

-- Orders table
create table if not exists public.orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete set null,
  customer_name text not null,
  customer_email text not null,
  address text not null,
  city text not null,
  postal_code text not null,
  country text not null,
  items jsonb not null default '[]',
  total numeric(10,2) not null,
  status text not null default 'pending',
  created_at timestamptz default now()
);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.orders enable row level security;

-- Profiles: users can read/update their own profile
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- Orders: users can insert and see their own orders; guests can insert
create policy "orders_insert" on public.orders
  for insert with check (true);

create policy "orders_select_own" on public.orders
  for select using (auth.uid() = user_id);
