-- Create user onboarding status tracking table
create table if not exists public.user_onboarding_status (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  confirmed_at timestamptz,
  welcome_email_sent_at timestamptz,
  reminder_email_sent_at timestamptz,
  has_business boolean not null default false,
  has_claim boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Create admin notifications table
create table if not exists public.admin_notifications (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  title text not null,
  message text not null,
  entity_type text,
  entity_id uuid,
  user_id uuid references auth.users(id) on delete set null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- Create indexes for better performance
create index if not exists idx_user_onboarding_status_email on public.user_onboarding_status(email);
create index if not exists idx_user_onboarding_status_confirmed_at on public.user_onboarding_status(confirmed_at);
create index if not exists idx_user_onboarding_status_has_business on public.user_onboarding_status(has_business);
create index if not exists idx_user_onboarding_status_has_claim on public.user_onboarding_status(has_claim);

create index if not exists idx_admin_notifications_type on public.admin_notifications(type);
create index if not exists idx_admin_notifications_is_read on public.admin_notifications(is_read);
create index if not exists idx_admin_notifications_entity on public.admin_notifications(entity_type, entity_id);
create index if not exists idx_admin_notifications_user_id on public.admin_notifications(user_id);

-- Enable RLS
alter table public.user_onboarding_status enable row level security;
alter table public.admin_notifications enable row level security;

-- Drop policies if they exist, then create them
drop policy if exists "Users can view their own onboarding status" on public.user_onboarding_status;
create policy "Users can view their own onboarding status" on public.user_onboarding_status
  for select using (auth.uid() = user_id);

drop policy if exists "Service role full access onboarding" on public.user_onboarding_status;
create policy "Service role full access onboarding" on public.user_onboarding_status
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

drop policy if exists "Admins can view all notifications" on public.admin_notifications;
create policy "Admins can view all notifications" on public.admin_notifications
  for select using (
    exists (
      select 1 from public.profiles 
      where profiles.id = auth.uid() 
      and profiles.role = 'admin'
    )
  );

drop policy if exists "Admins can update notifications" on public.admin_notifications;
create policy "Admins can update notifications" on public.admin_notifications
  for update using (
    exists (
      select 1 from public.profiles 
      where profiles.id = auth.uid() 
      and profiles.role = 'admin'
    )
  );

drop policy if exists "Service role full access notifications" on public.admin_notifications;
create policy "Service role full access notifications" on public.admin_notifications
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

-- Function to automatically update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Drop trigger if exists, then create it
drop trigger if exists handle_user_onboarding_status_updated_at on public.user_onboarding_status;
create trigger handle_user_onboarding_status_updated_at
before update on public.user_onboarding_status
for each row execute function public.handle_updated_at();
