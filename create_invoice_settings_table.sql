create table if not exists business_invoice_settings (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  account_name text,
  account_number text,
  payment_reference_label text,
  payment_terms text,
  footer_note text,
  default_tax_rate numeric default 0,
  default_withholding_tax_rate numeric default 0,
  invoice_primary_color text default '#0a1628',
  invoice_accent_color text default '#c9a84c',
  invoice_text_color text default '#0f172a',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (business_id)
);
