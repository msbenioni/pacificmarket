-- Fresh Database Dump
-- Generated: 2026-03-17T11:58:37.970Z
-- Database: postgres
-- Host: db.mnmisjprswpuvcojnbip.supabase.co


-- ================================================
-- Table: audit_logs
-- ================================================

-- Table Structure:
-- id: uuid NOT NULL DEFAULT gen_random_uuid()
-- table_name: character varying NOT NULL
-- record_id: uuid NOT NULL
-- action: character varying NOT NULL
-- old_data: jsonb NULL
-- new_data: jsonb NULL
-- user_id: uuid NULL
-- ip_address: inet NULL
-- user_agent: text NULL
-- created_at: timestamp with time zone NULL DEFAULT now()

-- Sample Data (first 5 rows):
-- Columns: id, table_name, record_id, action, old_data, new_data, user_id, ip_address, user_agent, created_at
-- Row 1:
--   id: '95762e97-163a-4557-8c27-c93bf8556921'
--   table_name: 'businesses'
--   record_id: '1ceaf4d4-8a5e-4f25-b75f-43a05cd656fb'
--   action: 'UPDATE'
--   old_data: {"id":"1ceaf4d4-8a5e-4f25-b75f-43a05cd656fb","city":"Auckland","name":"SaaSy Cookies","source":"user","status":"active","suburb":null,"address":null,"claimed":true,"country":"New Zealand","tagline":null,"user_id":"d5cf35f3-321d-4fb1-9a68-9e16cab473e4","industry":"Digital Media & Technology","logo_url":"https://mnmisjprswpuvcojnbip.supabase.co/storage/v1/object/public/admin-listings/logos/saasycookies.png","verified":false,"banner_url":"https://mnmisjprswpuvcojnbip.supabase.co/storage/v1/object/public/admin-listings/banners/SaaSy%20Cookies.png","claimed_at":"2026-02-26T22:33:27.633401+00:00","claimed_by":"system","created_at":"2025-11-27T05:54:58.04014+00:00","created_by":null,"tech_stack":null,"updated_at":"2026-03-06T17:06:27.644257+00:00","description":"SaaSy Cookies is a digital product studio and infrastructure partner for founders, creators, and growing businesses.\n\nAs the exclusive technology partner behind Pacific Market, we design and manage the systems that power visibility, credibility, and growth for Pacific-owned businesses across the platform.\n\nWe don’t just build websites.\nWe build managed website and funnel infrastructure — combining clean design, automation, AI tools, and scalable systems that help founders operate professionally and grow sustainably.\n\nOur work includes:\n\n• Custom website design and development\n• Funnel strategy and automation\n• AI-powered tools and digital products\n• Business-ready resources (invoices, QR systems, digital assets)\n• Listing optimisation and technical support for Pacific Market vendors\n\nFrom first-time founders to established brands, we build the backend structure that allows businesses to move with clarity and confidence.\n\nOur mission is simple:\nBuild systems that work.\nRemove tech overwhelm.\nStrengthen the Pacific digital economy.","postal_code":null,"proof_links":null,"contact_name":"Jasmin Benioni","created_date":"2025-11-27","future_plans":null,"growth_stage":null,"social_links":{"tiktok":"","facebook":"","linkedin":"https://www.linkedin.com/company/111610220","instagram":""},"state_region":null,"year_started":null,"contact_email":"saasycookies@gmail.com","contact_phone":null,"owner_user_id":null,"business_hours":null,"funding_source":null,"primary_market":null,"business_handle":"saasy-cookies","contact_website":"https://www.saasycookies.com","visibility_tier":"homepage","languages_spoken":["English","French"],"cultural_identity":"Cook Islands, French Polynesia","customer_segments":null,"homepage_featured":true,"short_description":"Digital products for freelancers, creators, and small businesses","subscription_tier":"mana","business_structure":null,"stripe_customer_id":null,"business_challenges":null,"full_time_employees":null,"part_time_employees":null,"annual_revenue_exact":null,"profile_completeness":0,"competitive_advantage":null}
--   new_data: {"id":"1ceaf4d4-8a5e-4f25-b75f-43a05cd656fb","city":"Auckland","name":"SaaSy Cookies","source":"user","status":"active","suburb":null,"address":null,"claimed":true,"country":"New Zealand","tagline":null,"user_id":"d5cf35f3-321d-4fb1-9a68-9e16cab473e4","industry":"Digital Media & Technology","logo_url":"https://mnmisjprswpuvcojnbip.supabase.co/storage/v1/object/public/admin-listings/logos/saasycookies.png","verified":false,"banner_url":"https://mnmisjprswpuvcojnbip.supabase.co/storage/v1/object/public/admin-listings/banners/SaaSy%20Cookies.png","claimed_at":"2026-02-26T22:33:27.633401+00:00","claimed_by":"system","created_at":"2025-11-27T05:54:58.04014+00:00","created_by":null,"tech_stack":null,"updated_at":"2026-03-06T17:09:42.929021+00:00","description":"SaaSy Cookies is a digital product studio and infrastructure partner for founders, creators, and growing businesses.\n\nAs the exclusive technology partner behind Pacific Market, we design and manage the systems that power visibility, credibility, and growth for Pacific-owned businesses across the platform.\n\nWe don’t just build websites.\nWe build managed website and funnel infrastructure — combining clean design, automation, AI tools, and scalable systems that help founders operate professionally and grow sustainably.\n\nOur work includes:\n\n• Custom website design and development\n• Funnel strategy and automation\n• AI-powered tools and digital products\n• Business-ready resources (invoices, QR systems, digital assets)\n• Listing optimisation and technical support for Pacific Market vendors\n\nFrom first-time founders to established brands, we build the backend structure that allows businesses to move with clarity and confidence.\n\nOur mission is simple:\nBuild systems that work.\nRemove tech overwhelm.\nStrengthen the Pacific digital economy.","postal_code":null,"proof_links":null,"contact_name":"Jasmin Benioni","created_date":"2025-11-27","future_plans":null,"growth_stage":null,"social_links":{"tiktok":"","facebook":"","linkedin":"https://www.linkedin.com/company/111610220","instagram":""},"state_region":null,"year_started":null,"contact_email":"saasycookies@gmail.com","contact_phone":null,"owner_user_id":null,"business_hours":null,"funding_source":null,"primary_market":null,"business_handle":"saasy-cookies","contact_website":"https://www.saasycookies.com","visibility_tier":"homepage","languages_spoken":["English","French"],"cultural_identity":"Cook Islands, French Polynesia","customer_segments":null,"homepage_featured":true,"short_description":"Digital products for freelancers, creators, and small businesses","subscription_tier":"moana","business_structure":null,"stripe_customer_id":null,"business_challenges":null,"full_time_employees":null,"part_time_employees":null,"annual_revenue_exact":null,"profile_completeness":0,"competitive_advantage":null}
--   user_id: NULL
--   ip_address: NULL
--   user_agent: NULL
--   created_at: "2026-03-06T17:09:42.929Z"

-- Row 2:
--   id: '3293d33a-0878-4acd-bebd-c87bcb20f848'
--   table_name: 'businesses'
--   record_id: 'a0cf1a9e-5f09-4005-9329-b3b83936e523'
--   action: 'INSERT'
--   old_data: NULL
--   new_data: {"id":"a0cf1a9e-5f09-4005-9329-b3b83936e523","name":"Pacific Tech Solutions","email":null,"phone":null,"status":"active","address":null,"country":"New Zealand","user_id":null,"featured":true,"industry":"Technology","logo_url":null,"verified":true,"created_at":"2026-02-26T19:23:15.870428+00:00","updated_at":"2026-02-26T19:23:15.870428+00:00","description":"Leading technology solutions for Pacific businesses. We provide comprehensive IT services including web development, cloud solutions, and digital transformation consulting.","website_url":null,"created_date":"2026-02-26","short_description":"Technology solutions for Pacific businesses","subscription_tier":"featured","stripe_customer_id":null}
--   user_id: NULL
--   ip_address: NULL
--   user_agent: NULL
--   created_at: "2026-02-26T19:23:15.870Z"

-- Row 3:
--   id: 'e86c0369-be1f-45c0-9b24-b3be17a056be'
--   table_name: 'businesses'
--   record_id: '5e528eda-c7f2-4c71-b92d-8a513edf5965'
--   action: 'INSERT'
--   old_data: NULL
--   new_data: {"id":"5e528eda-c7f2-4c71-b92d-8a513edf5965","name":"Island Trading Co","email":null,"phone":null,"status":"active","address":null,"country":"Fiji","user_id":null,"featured":false,"industry":"Trading","logo_url":null,"verified":false,"created_at":"2026-02-26T19:23:15.870428+00:00","updated_at":"2026-02-26T19:23:15.870428+00:00","description":"Premium trading services across Pacific islands. Specializing in import/export of agricultural products and manufactured goods.","website_url":null,"created_date":"2026-02-26","short_description":"Trading services across Pacific islands","subscription_tier":"basic","stripe_customer_id":null}
--   user_id: NULL
--   ip_address: NULL
--   user_agent: NULL
--   created_at: "2026-02-26T19:23:15.870Z"

-- Row 4:
--   id: '9bc14acc-2d8e-4dce-8480-bf4311d16596'
--   table_name: 'businesses'
--   record_id: '27708d7a-484b-45ca-9f59-2555e1ed1f30'
--   action: 'INSERT'
--   old_data: NULL
--   new_data: {"id":"27708d7a-484b-45ca-9f59-2555e1ed1f30","name":"Tropical Foods Ltd","email":null,"phone":null,"status":"active","address":null,"country":"Samoa","user_id":null,"featured":true,"industry":"Food & Beverage","logo_url":null,"verified":true,"created_at":"2026-02-26T19:23:15.870428+00:00","updated_at":"2026-02-26T19:23:15.870428+00:00","description":"Authentic Pacific foods and beverages. We export organic tropical fruits, coffee, and traditional Pacific cuisine ingredients.","website_url":null,"created_date":"2026-02-26","short_description":"Authentic Pacific foods and beverages","subscription_tier":"featured","stripe_customer_id":null}
--   user_id: NULL
--   ip_address: NULL
--   user_agent: NULL
--   created_at: "2026-02-26T19:23:15.870Z"

-- Row 5:
--   id: '239609de-f591-4b15-ad04-c30b62a107b1'
--   table_name: 'businesses'
--   record_id: '8374884a-f583-4688-ac15-895757b389a0'
--   action: 'INSERT'
--   old_data: NULL
--   new_data: {"id":"8374884a-f583-4688-ac15-895757b389a0","name":"Oceanic Tours","email":null,"phone":null,"status":"active","address":null,"country":"Tonga","user_id":null,"featured":false,"industry":"Tourism","logo_url":null,"verified":false,"created_at":"2026-02-26T19:23:15.870428+00:00","updated_at":"2026-02-26T19:23:15.870428+00:00","description":"Sustainable tourism experiences across the Pacific. Eco-friendly tours, cultural experiences, and adventure activities.","website_url":null,"created_date":"2026-02-26","short_description":"Sustainable tourism experiences","subscription_tier":"basic","stripe_customer_id":null}
--   user_id: NULL
--   ip_address: NULL
--   user_agent: NULL
--   created_at: "2026-02-26T19:23:15.870Z"



-- ================================================
-- Table: backup_businesses
-- ================================================

-- Table Structure:
-- id: uuid NULL
-- name: character varying NULL
-- description: text NULL
-- short_description: text NULL
-- logo_url: text NULL
-- contact_website: text NULL
-- contact_email: character varying NULL
-- contact_phone: character varying NULL
-- address: text NULL
-- country: character varying NULL
-- industry: character varying NULL
-- status: character varying NULL
-- user_id: uuid NULL
-- created_at: timestamp with time zone NULL
-- updated_at: timestamp with time zone NULL
-- created_date: date NULL
-- contact_name: text NULL
-- languages_spoken: ARRAY NULL
-- social_links: jsonb NULL
-- suburb: text NULL
-- city: text NULL
-- state_region: text NULL
-- postal_code: text NULL
-- business_hours: text NULL
-- banner_url: text NULL
-- cultural_identity: text NULL
-- claimed: boolean NULL
-- claimed_at: timestamp with time zone NULL
-- claimed_by: text NULL
-- business_handle: text NULL
-- verified: boolean NULL
-- owner_user_id: uuid NULL
-- proof_links: ARRAY NULL
-- homepage_featured: boolean NULL
-- visibility_tier: text NULL
-- business_structure: text NULL
-- annual_revenue_exact: integer NULL
-- full_time_employees: integer NULL
-- part_time_employees: integer NULL
-- primary_market: text NULL
-- growth_stage: text NULL
-- funding_source: text NULL
-- business_challenges: ARRAY NULL
-- future_plans: text NULL
-- tech_stack: ARRAY NULL
-- customer_segments: ARRAY NULL
-- competitive_advantage: text NULL
-- year_started: integer NULL
-- created_by: uuid NULL
-- source: text NULL
-- profile_completeness: numeric NULL
-- referral_code: text NULL
-- subscription_tier: character varying NULL
-- business_operating_status: text NULL
-- business_age: text NULL
-- business_registered: boolean NULL
-- sales_channels: jsonb NULL
-- import_export_status: text NULL
-- team_size_band: text NULL
-- revenue_band: text NULL
-- business_owner: text NULL
-- business_owner_email: text NULL
-- additional_owner_emails: ARRAY NULL
-- public_phone: text NULL

-- Sample Data (first 5 rows):
-- Columns: id, name, description, short_description, logo_url, contact_website, contact_email, contact_phone, address, country, industry, status, user_id, created_at, updated_at, created_date, contact_name, languages_spoken, social_links, suburb, city, state_region, postal_code, business_hours, banner_url, cultural_identity, claimed, claimed_at, claimed_by, business_handle, verified, owner_user_id, proof_links, homepage_featured, visibility_tier, business_structure, annual_revenue_exact, full_time_employees, part_time_employees, primary_market, growth_stage, funding_source, business_challenges, future_plans, tech_stack, customer_segments, competitive_advantage, year_started, created_by, source, profile_completeness, referral_code, subscription_tier, business_operating_status, business_age, business_registered, sales_channels, import_export_status, team_size_band, revenue_band, business_owner, business_owner_email, additional_owner_emails, public_phone
-- Row 1:
--   id: 'dff7bc6d-4a8d-4374-8345-b4f1f5f98803'
--   name: 'Beautyby2'
--   description: 'Beautyby2 is a nail artistry studio dedicated to creating beautifully detailed, modern nail designs that celebrate individuality and self-expression. Each set is carefully crafted with precision, creativity, and a genuine love for the art of nails.

From soft, elegant styles to bold statement designs, Beautyby2 focuses on enhancing natural beauty while delivering a personalised experience for every client. Every detail matters — because great nails aren't just an accessory; they're a reflection of confidence and care.

Discover nail artistry created with passion, patience, and purpose at Beautyby2.'
--   short_description: 'Nail enhancement'
--   logo_url: 'https://mnmisjprswpuvcojnbip.supabase.co/storage/v1/object/public/admin-listings/logos/beautyby2.jpg'
--   contact_website: NULL
--   contact_email: 'beautyby2nails@gmail.com'
--   contact_phone: '0223154675'
--   address: NULL
--   country: 'new-zealand'
--   industry: 'Beauty & Personal Care'
--   status: 'active'
--   user_id: NULL
--   created_at: "2025-12-13T07:26:49.823Z"
--   updated_at: "2026-03-06T19:23:31.102Z"
--   created_date: "2026-02-25T11:00:00.000Z"
--   contact_name: 'Destiny.S'
--   languages_spoken: ["English"]
--   social_links: {"tiktok":"https://tiktok.com/@_beautyby2_","facebook":"https://facebook.com/profile.php?id=61582321290345","instagram":"https://instagram.com/_beautyby2._"}
--   suburb: NULL
--   city: 'Auckland'
--   state_region: 'North Island'
--   postal_code: NULL
--   business_hours: NULL
--   banner_url: 'https://mnmisjprswpuvcojnbip.supabase.co/storage/v1/object/public/admin-listings/banners/Beauty%20By%202.png'
--   cultural_identity: 'New Zealand Maori'
--   claimed: false
--   claimed_at: NULL
--   claimed_by: NULL
--   business_handle: 'beautyby2'
--   verified: false
--   owner_user_id: NULL
--   proof_links: NULL
--   homepage_featured: true
--   visibility_tier: 'homepage'
--   business_structure: NULL
--   annual_revenue_exact: NULL
--   full_time_employees: NULL
--   part_time_employees: NULL
--   primary_market: NULL
--   growth_stage: NULL
--   funding_source: NULL
--   business_challenges: NULL
--   future_plans: NULL
--   tech_stack: NULL
--   customer_segments: NULL
--   competitive_advantage: NULL
--   year_started: NULL
--   created_by: NULL
--   source: 'user'
--   profile_completeness: '0.00'
--   referral_code: 'beautyby2'
--   subscription_tier: 'vaka'
--   business_operating_status: NULL
--   business_age: NULL
--   business_registered: false
--   sales_channels: []
--   import_export_status: NULL
--   team_size_band: NULL
--   revenue_band: NULL
--   business_owner: NULL
--   business_owner_email: NULL
--   additional_owner_emails: NULL
--   public_phone: NULL

-- Row 2:
--   id: '10467620-13c0-42bc-9e7e-7a039b00af6f'
--   name: 'Amuri Boyz Entertainment'
--   description: 'Amuri Boyz deliver more than music — they deliver a full Island experience.

Known for their powerful live sound, smooth harmonies, and unmatched crowd connection, Amuri Boyz bring authentic Cook Islands flavour 🇨🇰 to every stage they step on. Whether it’s an intimate celebration or a major event, they create moments people remember long after the night ends.

Perfect For:

🎤 Weddings
🎉 Birthdays
💍 Engagements
🏢 Corporate Functions
🏝 Island Nights
🎓 Graduations
🎶 Festivals & Community Events'
--   short_description: 'Bringing Island Vibes. Real Energy. Unforgettable Nights.'
--   logo_url: 'https://mnmisjprswpuvcojnbip.supabase.co/storage/v1/object/public/admin-listings/logos/amuriboyz.jpg'
--   contact_website: ''
--   contact_email: 'apunoua@gmail.com'
--   contact_phone: '02102756705'
--   address: NULL
--   country: 'new-zealand'
--   industry: 'Media & Entertainment'
--   status: 'active'
--   user_id: NULL
--   created_at: "2026-02-27T23:55:14.201Z"
--   updated_at: "2026-03-06T19:10:50.004Z"
--   created_date: "2026-02-26T11:00:00.000Z"
--   contact_name: NULL
--   languages_spoken: ["Cook Island","English"]
--   social_links: []
--   suburb: NULL
--   city: 'Auckland'
--   state_region: NULL
--   postal_code: NULL
--   business_hours: NULL
--   banner_url: 'https://mnmisjprswpuvcojnbip.supabase.co/storage/v1/object/public/admin-listings/banners/Amuri%20Boyz.png'
--   cultural_identity: 'Cook Islands'
--   claimed: false
--   claimed_at: NULL
--   claimed_by: NULL
--   business_handle: 'amuri-boyz-entertainment'
--   verified: false
--   owner_user_id: NULL
--   proof_links: NULL
--   homepage_featured: true
--   visibility_tier: 'homepage'
--   business_structure: NULL
--   annual_revenue_exact: NULL
--   full_time_employees: NULL
--   part_time_employees: NULL
--   primary_market: NULL
--   growth_stage: NULL
--   funding_source: NULL
--   business_challenges: NULL
--   future_plans: NULL
--   tech_stack: NULL
--   customer_segments: NULL
--   competitive_advantage: NULL
--   year_started: NULL
--   created_by: NULL
--   source: 'user'
--   profile_completeness: '0.00'
--   referral_code: 'amuri-boyz-entertainment'
--   subscription_tier: 'vaka'
--   business_operating_status: NULL
--   business_age: NULL
--   business_registered: false
--   sales_channels: []
--   import_export_status: NULL
--   team_size_band: NULL
--   revenue_band: NULL
--   business_owner: NULL
--   business_owner_email: NULL
--   additional_owner_emails: NULL
--   public_phone: NULL

-- Row 3:
--   id: 'bd8e8158-02b5-4ea5-9c8f-bd9721ded7ca'
--   name: 'Tangata Whenua Carving'
--   description: 'Te Rangimarie (T) is a lifelong Māori carver and artist whose work carries deep cultural knowledge, history, and passion. Based at the Ōtara Markets every Saturday, T has been carving for as long as he can remember — starting with trees in his own backyard and now working on his current major project: a traditional waka.

Carving is not a hobby for T. It is his calling. Every spare moment is spent bringing new pieces to life, each one carved by hand with meaning and intention. Alongside his carvings, T also creates Māori drawings and crochet bags, and holds an extensive personal portfolio of designs.

T does not take custom orders — his work is created from inspiration, not instruction. What he carves is what becomes available. All pieces are first in, first served, and every artwork is unique.

About T

T was one of the talented Māori artists involved in the 2009 carving of a waharoa (gateway) for Northcross Intermediate School. The waharoa, carved alongside fellow Māori artists, stands as a symbol of identity, learning, and connection — welcoming students, whānau, and the wider community onto the school grounds.

This project reflects T’s commitment to preserving and expressing Māori culture through carving, and his belief that art is not only something to be admired, but something that carries responsibility, story, and mana.'
--   short_description: 'Carving stories of whenua, whakapapa, and tradition'
--   logo_url: NULL
--   contact_website: ''
--   contact_email: 'pacificmarketltd@gmail.com'
--   contact_phone: '02108680075'
--   address: 'Otara Market'
--   country: 'new-zealand'
--   industry: 'Arts & Crafts'
--   status: 'active'
--   user_id: NULL
--   created_at: "2025-12-11T21:08:12.207Z"
--   updated_at: "2026-03-06T19:14:01.008Z"
--   created_date: "2026-02-25T11:00:00.000Z"
--   contact_name: 'Te Rangimarie Akena'
--   languages_spoken: ["English"]
--   social_links: []
--   suburb: 'Otara'
--   city: 'Auckland'
--   state_region: 'Auckland'
--   postal_code: '2012'
--   business_hours: 'Saturdays - 7am - 12pm (Otara Market)'
--   banner_url: 'https://mnmisjprswpuvcojnbip.supabase.co/storage/v1/object/public/admin-listings/banners/Tangata.png'
--   cultural_identity: 'New Zealand Maori'
--   claimed: false
--   claimed_at: NULL
--   claimed_by: NULL
--   business_handle: 'tangata-whenua-carving'
--   verified: false
--   owner_user_id: NULL
--   proof_links: NULL
--   homepage_featured: true
--   visibility_tier: 'homepage'
--   business_structure: NULL
--   annual_revenue_exact: NULL
--   full_time_employees: NULL
--   part_time_employees: NULL
--   primary_market: NULL
--   growth_stage: NULL
--   funding_source: NULL
--   business_challenges: NULL
--   future_plans: NULL
--   tech_stack: NULL
--   customer_segments: NULL
--   competitive_advantage: NULL
--   year_started: NULL
--   created_by: NULL
--   source: 'user'
--   profile_completeness: '0.00'
--   referral_code: 'tangata-whenua-carving'
--   subscription_tier: 'vaka'
--   business_operating_status: NULL
--   business_age: NULL
--   business_registered: false
--   sales_channels: []
--   import_export_status: NULL
--   team_size_band: NULL
--   revenue_band: NULL
--   business_owner: NULL
--   business_owner_email: NULL
--   additional_owner_emails: NULL
--   public_phone: NULL

-- Row 4:
--   id: '0391090c-447c-4511-8c78-09e39e5e9305'
--   name: 'Steam Pudding Lady'
--   description: 'Steamed Pudding Lady is a home-made dessert business dedicated to bringing comfort, nostalgia, and joy through freshly made steamed puddings.

Each pudding is carefully prepared in small batches using simple ingredients and time-honoured methods, creating rich, comforting flavours that feel like home. From family gatherings to special occasions, Steamed Pudding Lady's desserts are made to be shared warm, generous, and full of heart.

Rooted in care, consistency, and a genuine love for feeding people well, this is comfort food done properly. No shortcuts. No mass production. Just honest desserts made with intention, perfect for those moments when only something truly comforting will do.'
--   short_description: 'Steam Puddings'
--   logo_url: 'https://mnmisjprswpuvcojnbip.supabase.co/storage/v1/object/public/admin-listings/logos/steampudding.jpg'
--   contact_website: NULL
--   contact_email: 'lisa.blake@me.com'
--   contact_phone: '021847481'
--   address: NULL
--   country: 'new-zealand'
--   industry: 'Food & Beverage'
--   status: 'active'
--   user_id: NULL
--   created_at: "2025-12-06T21:55:04.540Z"
--   updated_at: "2026-03-06T17:06:27.644Z"
--   created_date: "2026-02-25T11:00:00.000Z"
--   contact_name: 'Lisa'
--   languages_spoken: ["English"]
--   social_links: {"facebook":"https://facebook.com/profile.php?id=100063681325604"}
--   suburb: NULL
--   city: 'Takanini'
--   state_region: 'Auckland'
--   postal_code: NULL
--   business_hours: NULL
--   banner_url: 'https://mnmisjprswpuvcojnbip.supabase.co/storage/v1/object/public/admin-listings/banners/Steam%20Pudding.png'
--   cultural_identity: 'New Zealand'
--   claimed: false
--   claimed_at: NULL
--   claimed_by: NULL
--   business_handle: 'steam-pudding-lady'
--   verified: false
--   owner_user_id: NULL
--   proof_links: NULL
--   homepage_featured: true
--   visibility_tier: 'homepage'
--   business_structure: NULL
--   annual_revenue_exact: NULL
--   full_time_employees: NULL
--   part_time_employees: NULL
--   primary_market: NULL
--   growth_stage: NULL
--   funding_source: NULL
--   business_challenges: NULL
--   future_plans: NULL
--   tech_stack: NULL
--   customer_segments: NULL
--   competitive_advantage: NULL
--   year_started: NULL
--   created_by: NULL
--   source: 'user'
--   profile_completeness: '0.00'
--   referral_code: 'steam-pudding-lady'
--   subscription_tier: 'vaka'
--   business_operating_status: NULL
--   business_age: NULL
--   business_registered: false
--   sales_channels: []
--   import_export_status: NULL
--   team_size_band: NULL
--   revenue_band: NULL
--   business_owner: NULL
--   business_owner_email: NULL
--   additional_owner_emails: NULL
--   public_phone: NULL

-- Row 5:
--   id: 'e0e03cd4-3a8b-48f9-8ffa-546abfa7925c'
--   name: 'SenseAI'
--   description: 'SenseAI is a supportive space for your thoughts, feelings, and ideas — without judgment, pressure, or noise.

Life can be complex, and sometimes you just need help making sense of what's in your head. SenseAI blends journaling with compassionate AI guidance to help you reflect, gain perspective, and move forward with confidence.

It's like having a thoughtful companion who listens, understands, and helps you see things more clearly.'
--   short_description: 'AI-Powered Journaling App - Type It, Speak It, Scan It'
--   logo_url: 'https://mnmisjprswpuvcojnbip.supabase.co/storage/v1/object/public/admin-listings/logos/e0e03cd4-3a8b-48f9-8ffa-546abfa7925c-logo-1773453506824.png'
--   contact_website: 'https://www.senseai.co.nz'
--   contact_email: 'accounts@saasycookies.com'
--   contact_phone: ''
--   address: ''
--   country: 'new-zealand'
--   industry: 'digital_it_technology'
--   status: 'active'
--   user_id: NULL
--   created_at: "2026-02-07T18:26:40.653Z"
--   updated_at: "2026-03-11T03:13:54.038Z"
--   created_date: "2026-02-25T11:00:00.000Z"
--   contact_name: 'Jasmin Benioni'
--   languages_spoken: ["English"]
--   social_links: {}
--   suburb: ''
--   city: 'Auckland'
--   state_region: 'Auckland'
--   postal_code: ''
--   business_hours: NULL
--   banner_url: 'https://mnmisjprswpuvcojnbip.supabase.co/storage/v1/object/public/admin-listings/banners/SenseAI.png'
--   cultural_identity: 'Cook Islands, French Polynesia'
--   claimed: true
--   claimed_at: NULL
--   claimed_by: NULL
--   business_handle: 'senseai'
--   verified: true
--   owner_user_id: '1eb66672-7581-4184-96a8-553abed10682'
--   proof_links: NULL
--   homepage_featured: true
--   visibility_tier: 'homepage'
--   business_structure: 'sole-proprietorship'
--   annual_revenue_exact: NULL
--   full_time_employees: NULL
--   part_time_employees: NULL
--   primary_market: NULL
--   growth_stage: 'startup'
--   funding_source: NULL
--   business_challenges: NULL
--   future_plans: NULL
--   tech_stack: NULL
--   customer_segments: NULL
--   competitive_advantage: NULL
--   year_started: 2026
--   created_by: NULL
--   source: 'user'
--   profile_completeness: '0.00'
--   referral_code: 'senseai'
--   subscription_tier: 'moana'
--   business_operating_status: 'operating'
--   business_age: NULL
--   business_registered: false
--   sales_channels: ["direct"]
--   import_export_status: NULL
--   team_size_band: '1'
--   revenue_band: '0-10k'
--   business_owner: 'Jasmin Benioni'
--   business_owner_email: NULL
--   additional_owner_emails: NULL
--   public_phone: NULL



-- ================================================
-- Table: backup_profiles
-- ================================================

-- Table Structure:
-- id: uuid NULL
-- display_name: text NULL
-- email: text NULL
-- country: text NULL
-- created_at: timestamp with time zone NULL
-- updated_at: timestamp with time zone NULL
-- primary_cultural: text NULL
-- education_level: text NULL
-- professional_background: ARRAY NULL
-- business_networks: ARRAY NULL
-- mentorship_availability: boolean NULL
-- investment_interest: text NULL
-- community_involvement: ARRAY NULL
-- skills_expertise: ARRAY NULL
-- business_goals: text NULL
-- challenges_faced: ARRAY NULL
-- success_factors: ARRAY NULL
-- preferred_collaboration: ARRAY NULL
-- role: USER-DEFINED NULL
-- years_operating: integer NULL
-- business_role: text NULL
-- city: text NULL
-- languages: ARRAY NULL
-- market_region: text NULL
-- pending_business_id: uuid NULL
-- pending_business_name: text NULL
-- invited_by: uuid NULL
-- invited_date: timestamp with time zone NULL
-- status: text NULL
-- gdpr_consent: boolean NULL
-- gdpr_consent_date: timestamp with time zone NULL
-- cultural_tags: ARRAY NULL

-- Sample Data (first 5 rows):
-- Columns: id, display_name, email, country, created_at, updated_at, primary_cultural, education_level, professional_background, business_networks, mentorship_availability, investment_interest, community_involvement, skills_expertise, business_goals, challenges_faced, success_factors, preferred_collaboration, role, years_operating, business_role, city, languages, market_region, pending_business_id, pending_business_name, invited_by, invited_date, status, gdpr_consent, gdpr_consent_date, cultural_tags
-- Row 1:
--   id: '364269e4-a6c5-4122-bf63-0d318607effd'
--   display_name: 'Daniel Maine'
--   email: 'travel@danielmaine.com'
--   country: 'new-zealand'
--   created_at: "2026-03-08T06:49:13.992Z"
--   updated_at: "2026-03-09T03:27:02.040Z"
--   primary_cultural: '{"cook-islands","french-polynesia"}'
--   education_level: 'associate-degree'
--   professional_background: ["education","hospitality","other"]
--   business_networks: NULL
--   mentorship_availability: false
--   investment_interest: NULL
--   community_involvement: NULL
--   skills_expertise: ["business-strategy","marketing-sales","project-management","leadership","public-speaking","languages","networking","other"]
--   business_goals: 'Short term goal is to integrate start up Pacific Market and Océanique SolutioNZ to become the first choice of Business within the 2nd to 3rd year of operation. '
--   challenges_faced: NULL
--   success_factors: NULL
--   preferred_collaboration: NULL
--   role: 'owner'
--   years_operating: 25
--   business_role: NULL
--   city: 'Auckland'
--   languages: ["english","french"]
--   market_region: ''
--   pending_business_id: NULL
--   pending_business_name: NULL
--   invited_by: NULL
--   invited_date: NULL
--   status: 'active'
--   gdpr_consent: true
--   gdpr_consent_date: "2026-03-08T06:49:13.097Z"
--   cultural_tags: NULL

-- Row 2:
--   id: '1eb66672-7581-4184-96a8-553abed10682'
--   display_name: 'Jasmin Jesse Benioni'
--   email: 'msbenioni+1@gmail.com'
--   country: 'new-zealand'
--   created_at: "2026-03-06T22:01:17.736Z"
--   updated_at: "2026-03-06T22:06:06.086Z"
--   primary_cultural: '{"cook-islands","french-polynesia"}'
--   education_level: 'trade-certification'
--   professional_background: ["other"]
--   business_networks: NULL
--   mentorship_availability: true
--   investment_interest: 'exploring'
--   community_involvement: NULL
--   skills_expertise: ["digital-marketing","web-development"]
--   business_goals: 'become the largest online registry of pacific owned businesses globally'
--   challenges_faced: NULL
--   success_factors: NULL
--   preferred_collaboration: NULL
--   role: 'owner'
--   years_operating: 2
--   business_role: NULL
--   city: 'Auckland'
--   languages: ["english","french"]
--   market_region: ''
--   pending_business_id: NULL
--   pending_business_name: NULL
--   invited_by: NULL
--   invited_date: NULL
--   status: 'active'
--   gdpr_consent: true
--   gdpr_consent_date: "2026-03-06T22:01:16.445Z"
--   cultural_tags: NULL

-- Row 3:
--   id: 'd5cf35f3-321d-4fb1-9a68-9e16cab473e4'
--   display_name: 'Jasmin Benioni'
--   email: 'msbenioni@gmail.com'
--   country: 'New Zealand'
--   created_at: "2025-10-14T18:48:55.812Z"
--   updated_at: "2026-03-06T07:23:36.333Z"
--   primary_cultural: NULL
--   education_level: NULL
--   professional_background: NULL
--   business_networks: NULL
--   mentorship_availability: false
--   investment_interest: NULL
--   community_involvement: NULL
--   skills_expertise: NULL
--   business_goals: NULL
--   challenges_faced: NULL
--   success_factors: NULL
--   preferred_collaboration: NULL
--   role: 'admin'
--   years_operating: NULL
--   business_role: NULL
--   city: NULL
--   languages: ["english","french"]
--   market_region: NULL
--   pending_business_id: NULL
--   pending_business_name: NULL
--   invited_by: NULL
--   invited_date: NULL
--   status: 'active'
--   gdpr_consent: false
--   gdpr_consent_date: NULL
--   cultural_tags: NULL

-- Row 4:
--   id: '695016f7-52f9-4593-b44a-297a273dfef4'
--   display_name: NULL
--   email: 'karl@kamano.co.nz'
--   country: NULL
--   created_at: "2026-03-09T09:27:52.640Z"
--   updated_at: "2026-03-09T09:27:52.640Z"
--   primary_cultural: NULL
--   education_level: NULL
--   professional_background: NULL
--   business_networks: NULL
--   mentorship_availability: false
--   investment_interest: NULL
--   community_involvement: NULL
--   skills_expertise: NULL
--   business_goals: NULL
--   challenges_faced: NULL
--   success_factors: NULL
--   preferred_collaboration: NULL
--   role: 'owner'
--   years_operating: NULL
--   business_role: NULL
--   city: NULL
--   languages: []
--   market_region: NULL
--   pending_business_id: NULL
--   pending_business_name: NULL
--   invited_by: NULL
--   invited_date: NULL
--   status: 'active'
--   gdpr_consent: true
--   gdpr_consent_date: "2026-03-09T09:27:51.347Z"
--   cultural_tags: NULL



-- ================================================
-- Table: business_images
-- ================================================

-- Table Structure:
-- id: uuid NOT NULL DEFAULT gen_random_uuid()
-- business_id: uuid NOT NULL
-- url: text NOT NULL
-- caption: text NULL
-- sort_order: integer NULL DEFAULT 0
-- created_at: timestamp with time zone NULL DEFAULT now()

-- No data in table


-- ================================================
-- Table: businesses
-- ================================================

-- Table Structure:
-- id: uuid NOT NULL DEFAULT gen_random_uuid()
-- name: character varying NOT NULL
-- description: text NULL
-- logo_url: text NULL
-- contact_website: text NULL
-- contact_email: character varying NULL
-- contact_phone: character varying NULL
-- address: text NULL
-- country: character varying NULL
-- industry: character varying NULL
-- status: character varying NULL DEFAULT 'pending'::character varying
-- user_id: uuid NULL
-- created_at: timestamp with time zone NULL DEFAULT now()
-- updated_at: timestamp with time zone NULL DEFAULT now()
-- created_date: date NULL DEFAULT CURRENT_DATE
-- contact_name: text NULL
-- languages_spoken: ARRAY NULL
-- social_links: jsonb NULL
-- suburb: text NULL
-- city: text NULL
-- state_region: text NULL
-- postal_code: text NULL
-- business_hours: text NULL
-- banner_url: text NULL
-- cultural_identity: text NULL
-- is_claimed: boolean NULL DEFAULT false
-- claimed_at: timestamp with time zone NULL
-- claimed_by: text NULL
-- business_handle: text NULL
-- is_verified: boolean NULL DEFAULT false
-- owner_user_id: uuid NULL
-- proof_links: ARRAY NULL
-- is_homepage_featured: boolean NOT NULL DEFAULT false
-- visibility_tier: text NOT NULL DEFAULT 'none'::text
-- business_structure: text NULL
-- year_started: integer NULL
-- created_by: uuid NULL
-- source: text NULL DEFAULT 'user'::text
-- profile_completeness: numeric NULL DEFAULT 0.0
-- referral_code: text NULL
-- subscription_tier: character varying NULL DEFAULT 'vaka'::character varying
-- business_registered: boolean NULL DEFAULT false
-- sales_channels: jsonb NULL DEFAULT '[]'::jsonb
-- team_size_band: text NULL
-- business_owner: text NULL
-- business_owner_email: text NULL
-- additional_owner_emails: ARRAY NULL
-- tagline: text NULL
-- mobile_banner_url: text NULL
-- business_acquisition_interest: boolean NULL DEFAULT false
-- founder_story: text NULL
-- age_range: text NULL
-- gender: text NULL
-- collaboration_interest: boolean NULL DEFAULT false
-- mentorship_offering: boolean NULL DEFAULT false
-- open_to_future_contact: boolean NULL DEFAULT false
-- business_stage: text NULL
-- generated_logo_url: text NULL
-- generated_banner_url: text NULL
-- generated_mobile_banner_url: text NULL

-- Sample Data (first 5 rows):
-- Columns: id, name, description, logo_url, contact_website, contact_email, contact_phone, address, country, industry, status, user_id, created_at, updated_at, created_date, contact_name, languages_spoken, social_links, suburb, city, state_region, postal_code, business_hours, banner_url, cultural_identity, is_claimed, claimed_at, claimed_by, business_handle, is_verified, owner_user_id, proof_links, is_homepage_featured, visibility_tier, business_structure, year_started, created_by, source, profile_completeness, referral_code, subscription_tier, business_registered, sales_channels, team_size_band, business_owner, business_owner_email, additional_owner_emails, tagline, mobile_banner_url, business_acquisition_interest, founder_story, age_range, gender, collaboration_interest, mentorship_offering, open_to_future_contact, business_stage, generated_logo_url, generated_banner_url, generated_mobile_banner_url
-- Row 1:
--   id: 'dff7bc6d-4a8d-4374-8345-b4f1f5f98803'
--   name: 'Beautyby2'
--   description: 'Beautyby2 is a nail artistry studio dedicated to creating beautifully detailed, modern nail designs that celebrate individuality and self-expression. Each set is carefully crafted with precision, creativity, and a genuine love for the art of nails.

From soft, elegant styles to bold statement designs, Beautyby2 focuses on enhancing natural beauty while delivering a personalised experience for every client. Every detail matters — because great nails aren't just an accessory; they're a reflection of confidence and care.

Discover nail artistry created with passion, patience, and purpose at Beautyby2.'
--   logo_url: 'https://mnmisjprswpuvcojnbip.supabase.co/storage/v1/object/public/admin-listings/logos/beautyby2.jpg'
--   contact_website: NULL
--   contact_email: 'beautyby2nails@gmail.com'
--   contact_phone: '0223154675'
--   address: NULL
--   country: 'new-zealand'
--   industry: 'Beauty & Personal Care'
--   status: 'active'
--   user_id: NULL
--   created_at: "2025-12-13T07:26:49.823Z"
--   updated_at: "2026-03-06T19:23:31.102Z"
--   created_date: "2026-02-25T11:00:00.000Z"
--   contact_name: 'Destiny.S'
--   languages_spoken: ["English"]
--   social_links: {"tiktok":"https://tiktok.com/@_beautyby2_","facebook":"https://facebook.com/profile.php?id=61582321290345","instagram":"https://instagram.com/_beautyby2._"}
--   suburb: NULL
--   city: 'Auckland'
--   state_region: 'North Island'
--   postal_code: NULL
--   business_hours: NULL
--   banner_url: 'https://mnmisjprswpuvcojnbip.supabase.co/storage/v1/object/public/admin-listings/banners/Beauty%20By%202.png'
--   cultural_identity: 'New Zealand Maori'
--   is_claimed: false
--   claimed_at: NULL
--   claimed_by: NULL
--   business_handle: 'beautyby2'
--   is_verified: false
--   owner_user_id: NULL
--   proof_links: NULL
--   is_homepage_featured: true
--   visibility_tier: 'homepage'
--   business_structure: NULL
--   year_started: NULL
--   created_by: NULL
--   source: 'user'
--   profile_completeness: '0.00'
--   referral_code: 'beautyby2'
--   subscription_tier: 'vaka'
--   business_registered: false
--   sales_channels: []
--   team_size_band: NULL
--   business_owner: NULL
--   business_owner_email: NULL
--   additional_owner_emails: NULL
--   tagline: 'Nail enhancement'
--   mobile_banner_url: NULL
--   business_acquisition_interest: false
--   founder_story: NULL
--   age_range: NULL
--   gender: NULL
--   collaboration_interest: false
--   mentorship_offering: false
--   open_to_future_contact: false
--   business_stage: NULL
--   generated_logo_url: NULL
--   generated_banner_url: NULL
--   generated_mobile_banner_url: NULL

-- Row 2:
--   id: '10467620-13c0-42bc-9e7e-7a039b00af6f'
--   name: 'Amuri Boyz Entertainment'
--   description: 'Amuri Boyz deliver more than music — they deliver a full Island experience.

Known for their powerful live sound, smooth harmonies, and unmatched crowd connection, Amuri Boyz bring authentic Cook Islands flavour 🇨🇰 to every stage they step on. Whether it’s an intimate celebration or a major event, they create moments people remember long after the night ends.

Perfect For:

🎤 Weddings
🎉 Birthdays
💍 Engagements
🏢 Corporate Functions
🏝 Island Nights
🎓 Graduations
🎶 Festivals & Community Events'
--   logo_url: 'https://mnmisjprswpuvcojnbip.supabase.co/storage/v1/object/public/admin-listings/logos/amuriboyz.jpg'
--   contact_website: ''
--   contact_email: 'apunoua@gmail.com'
--   contact_phone: '02102756705'
--   address: NULL
--   country: 'new-zealand'
--   industry: 'Media & Entertainment'
--   status: 'active'
--   user_id: NULL
--   created_at: "2026-02-27T23:55:14.201Z"
--   updated_at: "2026-03-06T19:10:50.004Z"
--   created_date: "2026-02-26T11:00:00.000Z"
--   contact_name: NULL
--   languages_spoken: ["Cook Island","English"]
--   social_links: []
--   suburb: NULL
--   city: 'Auckland'
--   state_region: NULL
--   postal_code: NULL
--   business_hours: NULL
--   banner_url: 'https://mnmisjprswpuvcojnbip.supabase.co/storage/v1/object/public/admin-listings/banners/Amuri%20Boyz.png'
--   cultural_identity: 'Cook Islands'
--   is_claimed: false
--   claimed_at: NULL
--   claimed_by: NULL
--   business_handle: 'amuri-boyz-entertainment'
--   is_verified: false
--   owner_user_id: NULL
--   proof_links: NULL
--   is_homepage_featured: true
--   visibility_tier: 'homepage'
--   business_structure: NULL
--   year_started: NULL
--   created_by: NULL
--   source: 'user'
--   profile_completeness: '0.00'
--   referral_code: 'amuri-boyz-entertainment'
--   subscription_tier: 'vaka'
--   business_registered: false
--   sales_channels: []
--   team_size_band: NULL
--   business_owner: NULL
--   business_owner_email: NULL
--   additional_owner_emails: NULL
--   tagline: 'Bringing Island Vibes. Real Energy. Unforgettable Nights.'
--   mobile_banner_url: NULL
--   business_acquisition_interest: false
--   founder_story: NULL
--   age_range: NULL
--   gender: NULL
--   collaboration_interest: false
--   mentorship_offering: false
--   open_to_future_contact: false
--   business_stage: NULL
--   generated_logo_url: NULL
--   generated_banner_url: NULL
--   generated_mobile_banner_url: NULL

-- Row 3:
--   id: 'bd8e8158-02b5-4ea5-9c8f-bd9721ded7ca'
--   name: 'Tangata Whenua Carving'
--   description: 'Te Rangimarie (T) is a lifelong Māori carver and artist whose work carries deep cultural knowledge, history, and passion. Based at the Ōtara Markets every Saturday, T has been carving for as long as he can remember — starting with trees in his own backyard and now working on his current major project: a traditional waka.

Carving is not a hobby for T. It is his calling. Every spare moment is spent bringing new pieces to life, each one carved by hand with meaning and intention. Alongside his carvings, T also creates Māori drawings and crochet bags, and holds an extensive personal portfolio of designs.

T does not take custom orders — his work is created from inspiration, not instruction. What he carves is what becomes available. All pieces are first in, first served, and every artwork is unique.

About T

T was one of the talented Māori artists involved in the 2009 carving of a waharoa (gateway) for Northcross Intermediate School. The waharoa, carved alongside fellow Māori artists, stands as a symbol of identity, learning, and connection — welcoming students, whānau, and the wider community onto the school grounds.

This project reflects T’s commitment to preserving and expressing Māori culture through carving, and his belief that art is not only something to be admired, but something that carries responsibility, story, and mana.'
--   logo_url: NULL
--   contact_website: ''
--   contact_email: 'pacificmarketltd@gmail.com'
--   contact_phone: '02108680075'
--   address: 'Otara Market'
--   country: 'new-zealand'
--   industry: 'Arts & Crafts'
--   status: 'active'
--   user_id: NULL
--   created_at: "2025-12-11T21:08:12.207Z"
--   updated_at: "2026-03-06T19:14:01.008Z"
--   created_date: "2026-02-25T11:00:00.000Z"
--   contact_name: 'Te Rangimarie Akena'
--   languages_spoken: ["English"]
--   social_links: []
--   suburb: 'Otara'
--   city: 'Auckland'
--   state_region: 'Auckland'
--   postal_code: '2012'
--   business_hours: 'Saturdays - 7am - 12pm (Otara Market)'
--   banner_url: 'https://mnmisjprswpuvcojnbip.supabase.co/storage/v1/object/public/admin-listings/banners/Tangata.png'
--   cultural_identity: 'New Zealand Maori'
--   is_claimed: false
--   claimed_at: NULL
--   claimed_by: NULL
--   business_handle: 'tangata-whenua-carving'
--   is_verified: false
--   owner_user_id: NULL
--   proof_links: NULL
--   is_homepage_featured: true
--   visibility_tier: 'homepage'
--   business_structure: NULL
--   year_started: NULL
--   created_by: NULL
--   source: 'user'
--   profile_completeness: '0.00'
--   referral_code: 'tangata-whenua-carving'
--   subscription_tier: 'vaka'
--   business_registered: false
--   sales_channels: []
--   team_size_band: NULL
--   business_owner: NULL
--   business_owner_email: NULL
--   additional_owner_emails: NULL
--   tagline: 'Carving stories of whenua, whakapapa, and tradition'
--   mobile_banner_url: NULL
--   business_acquisition_interest: false
--   founder_story: NULL
--   age_range: NULL
--   gender: NULL
--   collaboration_interest: false
--   mentorship_offering: false
--   open_to_future_contact: false
--   business_stage: NULL
--   generated_logo_url: NULL
--   generated_banner_url: NULL
--   generated_mobile_banner_url: NULL

-- Row 4:
--   id: '0391090c-447c-4511-8c78-09e39e5e9305'
--   name: 'Steam Pudding Lady'
--   description: 'Steamed Pudding Lady is a home-made dessert business dedicated to bringing comfort, nostalgia, and joy through freshly made steamed puddings.

Each pudding is carefully prepared in small batches using simple ingredients and time-honoured methods, creating rich, comforting flavours that feel like home. From family gatherings to special occasions, Steamed Pudding Lady's desserts are made to be shared warm, generous, and full of heart.

Rooted in care, consistency, and a genuine love for feeding people well, this is comfort food done properly. No shortcuts. No mass production. Just honest desserts made with intention, perfect for those moments when only something truly comforting will do.'
--   logo_url: 'https://mnmisjprswpuvcojnbip.supabase.co/storage/v1/object/public/admin-listings/logos/steampudding.jpg'
--   contact_website: NULL
--   contact_email: 'lisa.blake@me.com'
--   contact_phone: '021847481'
--   address: NULL
--   country: 'new-zealand'
--   industry: 'Food & Beverage'
--   status: 'active'
--   user_id: NULL
--   created_at: "2025-12-06T21:55:04.540Z"
--   updated_at: "2026-03-06T17:06:27.644Z"
--   created_date: "2026-02-25T11:00:00.000Z"
--   contact_name: 'Lisa'
--   languages_spoken: ["English"]
--   social_links: {"facebook":"https://facebook.com/profile.php?id=100063681325604"}
--   suburb: NULL
--   city: 'Takanini'
--   state_region: 'Auckland'
--   postal_code: NULL
--   business_hours: NULL
--   banner_url: 'https://mnmisjprswpuvcojnbip.supabase.co/storage/v1/object/public/admin-listings/banners/Steam%20Pudding.png'
--   cultural_identity: 'New Zealand'
--   is_claimed: false
--   claimed_at: NULL
--   claimed_by: NULL
--   business_handle: 'steam-pudding-lady'
--   is_verified: false
--   owner_user_id: NULL
--   proof_links: NULL
--   is_homepage_featured: true
--   visibility_tier: 'homepage'
--   business_structure: NULL
--   year_started: NULL
--   created_by: NULL
--   source: 'user'
--   profile_completeness: '0.00'
--   referral_code: 'steam-pudding-lady'
--   subscription_tier: 'vaka'
--   business_registered: false
--   sales_channels: []
--   team_size_band: NULL
--   business_owner: NULL
--   business_owner_email: NULL
--   additional_owner_emails: NULL
--   tagline: 'Steam Puddings'
--   mobile_banner_url: NULL
--   business_acquisition_interest: false
--   founder_story: NULL
--   age_range: NULL
--   gender: NULL
--   collaboration_interest: false
--   mentorship_offering: false
--   open_to_future_contact: false
--   business_stage: NULL
--   generated_logo_url: NULL
--   generated_banner_url: NULL
--   generated_mobile_banner_url: NULL

-- Row 5:
--   id: '1ceaf4d4-8a5e-4f25-b75f-43a05cd656fb'
--   name: 'SaaSy Cookies'
--   description: 'SaaSy Cookies is a digital product studio and infrastructure partner for founders, creators, and growing businesses.

As the exclusive technology partner behind Pacific Market, we design and manage the systems that power visibility, credibility, and growth for Pacific-owned businesses across the platform.

We don’t just build websites.
We build managed website and funnel infrastructure — combining clean design, automation, AI tools, and scalable systems that help founders operate professionally and grow sustainably.

Our work includes:

• Custom website design and development
• Funnel strategy and automation
• AI-powered tools and digital products
• Business-ready resources (invoices, QR systems, digital assets)
• Listing optimisation and technical support for Pacific Market vendors

From first-time founders to established brands, we build the backend structure that allows businesses to move with clarity and confidence.

Our mission is simple:
Build systems that work.
Remove tech overwhelm.
Strengthen the Pacific digital economy.'
--   logo_url: 'https://mnmisjprswpuvcojnbip.supabase.co/storage/v1/object/public/admin-listings/logos/saasycookies.png'
--   contact_website: 'https://www.saasycookies.com'
--   contact_email: 'accounts@saasycookies.com'
--   contact_phone: ''
--   address: ''
--   country: 'new-zealand'
--   industry: 'digital_it_technology'
--   status: 'active'
--   user_id: NULL
--   created_at: "2025-11-27T05:54:58.040Z"
--   updated_at: "2026-03-16T10:12:47.341Z"
--   created_date: "2025-11-26T11:00:00.000Z"
--   contact_name: 'Jasmin Benioni'
--   languages_spoken: ["English","French"]
--   social_links: {"linkedin":"https://www.linkedin.com/company/111610220"}
--   suburb: ''
--   city: 'Auckland'
--   state_region: ''
--   postal_code: ''
--   business_hours: NULL
--   banner_url: 'https://mnmisjprswpuvcojnbip.supabase.co/storage/v1/object/public/admin-listings/banners/SaaSy%20Cookies.png'
--   cultural_identity: 'Cook Islands, French Polynesia'
--   is_claimed: false
--   claimed_at: NULL
--   claimed_by: NULL
--   business_handle: 'saasy-cookies'
--   is_verified: true
--   owner_user_id: '1eb66672-7581-4184-96a8-553abed10682'
--   proof_links: NULL
--   is_homepage_featured: true
--   visibility_tier: 'homepage'
--   business_structure: 'llc'
--   year_started: 2024
--   created_by: NULL
--   source: 'user'
--   profile_completeness: '0.00'
--   referral_code: 'saasy-cookies'
--   subscription_tier: 'moana'
--   business_registered: false
--   sales_channels: []
--   team_size_band: '1'
--   business_owner: ''
--   business_owner_email: ''
--   additional_owner_emails: []
--   tagline: 'Digital products for freelancers, creators, and small businesses'
--   mobile_banner_url: NULL
--   business_acquisition_interest: true
--   founder_story: 'I started this as a way to show my kids its possible to come from nothing to having a successful business with hardwork and determination'
--   age_range: '45-54'
--   gender: 'female'
--   collaboration_interest: true
--   mentorship_offering: true
--   open_to_future_contact: true
--   business_stage: 'startup'
--   generated_logo_url: NULL
--   generated_banner_url: NULL
--   generated_mobile_banner_url: NULL



-- ================================================
-- Table: claim_requests
-- ================================================

-- Table Structure:
-- id: uuid NOT NULL DEFAULT gen_random_uuid()
-- business_id: uuid NOT NULL
-- user_id: uuid NOT NULL
-- status: text NOT NULL DEFAULT 'pending'::text
-- contact_email: text NULL
-- contact_phone: text NULL
-- role: text NULL
-- proof_url: text NULL
-- created_at: timestamp with time zone NULL DEFAULT now()
-- claim_type: character varying NULL DEFAULT 'request'::character varying
-- message: text NULL
-- reviewed_by: uuid NULL
-- reviewed_at: timestamp with time zone NULL

-- Sample Data (first 5 rows):
-- Columns: id, business_id, user_id, status, contact_email, contact_phone, role, proof_url, created_at, claim_type, message, reviewed_by, reviewed_at
-- Row 1:
--   id: 'db99a9a4-8f30-44dd-8b14-77b663c7531e'
--   business_id: '8e3c51fd-f7f9-4873-a91e-5edafb7b10f0'
--   user_id: '6d2d6ad5-8b38-40ce-a79c-cbb2c6f28d6c'
--   status: 'approved'
--   contact_email: 'inailau.womens.network@gmail.com'
--   contact_phone: '+64226575990'
--   role: 'owner'
--   proof_url: 'https://www.inailauwomen.com/'
--   created_at: "2026-03-17T05:30:33.315Z"
--   claim_type: 'request'
--   message: NULL
--   reviewed_by: NULL
--   reviewed_at: "2026-03-17T08:00:59.508Z"



-- ================================================
-- Table: claim_requests_backup_cleanup
-- ================================================

-- Table Structure:
-- id: uuid NULL
-- business_id: uuid NULL
-- user_id: uuid NULL
-- status: text NULL
-- contact_email: text NULL
-- contact_phone: text NULL
-- verification_documents: text NULL
-- rejection_reason: text NULL
-- reviewed_by: uuid NULL
-- reviewed_at: timestamp with time zone NULL
-- business_name: text NULL
-- user_email: text NULL
-- role: text NULL
-- proof_url: text NULL
-- created_at: timestamp with time zone NULL
-- updated_at: timestamp with time zone NULL
-- claim_type: character varying NULL
-- listing_contact_email: text NULL
-- listing_contact_phone: text NULL
-- message: text NULL

-- Sample Data (first 5 rows):
-- Columns: id, business_id, user_id, status, contact_email, contact_phone, verification_documents, rejection_reason, reviewed_by, reviewed_at, business_name, user_email, role, proof_url, created_at, updated_at, claim_type, listing_contact_email, listing_contact_phone, message
-- Row 1:
--   id: '5a299745-ba95-48a0-a730-87c2c9690d81'
--   business_id: 'e0e03cd4-3a8b-48f9-8ffa-546abfa7925c'
--   user_id: '1eb66672-7581-4184-96a8-553abed10682'
--   status: 'pending'
--   contact_email: 'saasycookies@gmail.com'
--   contact_phone: '0273220545'
--   verification_documents: NULL
--   rejection_reason: NULL
--   reviewed_by: NULL
--   reviewed_at: NULL
--   business_name: NULL
--   user_email: NULL
--   role: 'owner'
--   proof_url: 'https://senseai.com'
--   created_at: "2026-03-16T09:06:46.885Z"
--   updated_at: "2026-03-16T09:06:46.885Z"
--   claim_type: 'request'
--   listing_contact_email: NULL
--   listing_contact_phone: NULL
--   message: 'n/a'



-- ================================================
-- Table: countries
-- ================================================

-- Table Structure:
-- id: uuid NOT NULL DEFAULT gen_random_uuid()
-- code: text NOT NULL
-- name: text NOT NULL
-- region: text NULL
-- created_at: timestamp with time zone NOT NULL DEFAULT now()

-- Sample Data (first 5 rows):
-- Columns: id, code, name, region, created_at
-- Row 1:
--   id: '0889fdaa-375d-4abf-bebb-9736c73603ac'
--   code: 'CK'
--   name: 'Cook Islands'
--   region: 'Polynesia'
--   created_at: "2025-10-05T18:02:13.275Z"

-- Row 2:
--   id: '96fcedfe-bac7-45ec-8d84-3ddb7b712ad0'
--   code: 'WS'
--   name: 'Samoa'
--   region: 'Polynesia'
--   created_at: "2025-10-05T18:02:13.275Z"

-- Row 3:
--   id: '935291a9-7b12-4877-9b97-784ee40eee69'
--   code: 'AS'
--   name: 'American Samoa'
--   region: 'Polynesia'
--   created_at: "2025-10-05T18:02:13.275Z"

-- Row 4:
--   id: '1405d63e-86ac-4389-b799-86ab3eb28d50'
--   code: 'TO'
--   name: 'Tonga'
--   region: 'Polynesia'
--   created_at: "2025-10-05T18:02:13.275Z"

-- Row 5:
--   id: 'bf13ffc9-1685-4fd1-a355-d0792792103e'
--   code: 'NU'
--   name: 'Niue'
--   region: 'Polynesia'
--   created_at: "2025-10-05T18:02:13.275Z"



-- ================================================
-- Table: profiles
-- ================================================

-- Table Structure:
-- id: uuid NOT NULL
-- display_name: text NULL
-- private_email: text NULL
-- country: text NULL
-- created_at: timestamp with time zone NOT NULL DEFAULT now()
-- updated_at: timestamp with time zone NOT NULL DEFAULT now()
-- cultural_identity: text NULL
-- role: USER-DEFINED NULL DEFAULT 'owner'::app_role
-- city: text NULL
-- languages_spoken: ARRAY NULL DEFAULT '{}'::text[]
-- pending_business_id: uuid NULL
-- pending_business_name: text NULL
-- invited_by: uuid NULL
-- invited_date: timestamp with time zone NULL
-- status: text NULL DEFAULT 'active'::text
-- gdpr_consent: boolean NULL DEFAULT false
-- gdpr_consent_date: timestamp with time zone NULL
-- private_phone: text NULL

-- Sample Data (first 5 rows):
-- Columns: id, display_name, private_email, country, created_at, updated_at, cultural_identity, role, city, languages_spoken, pending_business_id, pending_business_name, invited_by, invited_date, status, gdpr_consent, gdpr_consent_date, private_phone
-- Row 1:
--   id: '6d2d6ad5-8b38-40ce-a79c-cbb2c6f28d6c'
--   display_name: 'Jackie Curry'
--   private_email: 'jackiec@business-spacific.com'
--   country: 'new-zealand'
--   created_at: "2026-03-17T05:25:57.944Z"
--   updated_at: "2026-03-17T05:25:57.944Z"
--   cultural_identity: '["samoa"]'
--   role: 'owner'
--   city: 'Auckland'
--   languages_spoken: ["samoan","english"]
--   pending_business_id: NULL
--   pending_business_name: NULL
--   invited_by: NULL
--   invited_date: NULL
--   status: 'active'
--   gdpr_consent: true
--   gdpr_consent_date: "2026-03-17T05:25:57.936Z"
--   private_phone: NULL

-- Row 2:
--   id: '364269e4-a6c5-4122-bf63-0d318607effd'
--   display_name: 'Daniel Maine'
--   private_email: 'travel@danielmaine.com'
--   country: 'new-zealand'
--   created_at: "2026-03-08T06:49:13.992Z"
--   updated_at: "2026-03-09T03:27:02.040Z"
--   cultural_identity: '{"cook-islands","french-polynesia"}'
--   role: 'owner'
--   city: 'Auckland'
--   languages_spoken: ["english","french"]
--   pending_business_id: NULL
--   pending_business_name: NULL
--   invited_by: NULL
--   invited_date: NULL
--   status: 'active'
--   gdpr_consent: true
--   gdpr_consent_date: "2026-03-08T06:49:13.097Z"
--   private_phone: NULL

-- Row 3:
--   id: '1eb66672-7581-4184-96a8-553abed10682'
--   display_name: 'Jasmin Jesse Benioni'
--   private_email: 'msbenioni+1@gmail.com'
--   country: 'new-zealand'
--   created_at: "2026-03-06T22:01:17.736Z"
--   updated_at: "2026-03-06T22:06:06.086Z"
--   cultural_identity: '{"cook-islands","french-polynesia"}'
--   role: 'owner'
--   city: 'Auckland'
--   languages_spoken: ["english","french"]
--   pending_business_id: NULL
--   pending_business_name: NULL
--   invited_by: NULL
--   invited_date: NULL
--   status: 'active'
--   gdpr_consent: true
--   gdpr_consent_date: "2026-03-06T22:01:16.445Z"
--   private_phone: NULL

-- Row 4:
--   id: 'd5cf35f3-321d-4fb1-9a68-9e16cab473e4'
--   display_name: 'Jasmin Benioni'
--   private_email: 'msbenioni@gmail.com'
--   country: 'New Zealand'
--   created_at: "2025-10-14T18:48:55.812Z"
--   updated_at: "2026-03-06T07:23:36.333Z"
--   cultural_identity: NULL
--   role: 'admin'
--   city: NULL
--   languages_spoken: ["english","french"]
--   pending_business_id: NULL
--   pending_business_name: NULL
--   invited_by: NULL
--   invited_date: NULL
--   status: 'active'
--   gdpr_consent: false
--   gdpr_consent_date: NULL
--   private_phone: NULL

-- Row 5:
--   id: '695016f7-52f9-4593-b44a-297a273dfef4'
--   display_name: NULL
--   private_email: 'karl@kamano.co.nz'
--   country: NULL
--   created_at: "2026-03-09T09:27:52.640Z"
--   updated_at: "2026-03-09T09:27:52.640Z"
--   cultural_identity: NULL
--   role: 'owner'
--   city: NULL
--   languages_spoken: []
--   pending_business_id: NULL
--   pending_business_name: NULL
--   invited_by: NULL
--   invited_date: NULL
--   status: 'active'
--   gdpr_consent: true
--   gdpr_consent_date: "2026-03-09T09:27:51.347Z"
--   private_phone: NULL



-- ================================================
-- Table: subscriptions
-- ================================================

-- Table Structure:
-- id: uuid NOT NULL DEFAULT gen_random_uuid()
-- user_id: uuid NOT NULL
-- business_id: uuid NULL
-- stripe_subscription_id: text NULL
-- stripe_customer_id: text NULL
-- plan_type: character varying NOT NULL
-- status: character varying NULL DEFAULT 'active'::character varying
-- current_period_start: timestamp with time zone NULL
-- current_period_end: timestamp with time zone NULL
-- cancel_at_period_end: boolean NULL DEFAULT false
-- created_at: timestamp with time zone NULL DEFAULT now()
-- updated_at: timestamp with time zone NULL DEFAULT now()

-- Sample Data (first 5 rows):
-- Columns: id, user_id, business_id, stripe_subscription_id, stripe_customer_id, plan_type, status, current_period_start, current_period_end, cancel_at_period_end, created_at, updated_at
-- Row 1:
--   id: 'c40e76ff-4822-4932-b6ad-31370ca29539'
--   user_id: '1eb66672-7581-4184-96a8-553abed10682'
--   business_id: '1ceaf4d4-8a5e-4f25-b75f-43a05cd656fb'
--   stripe_subscription_id: NULL
--   stripe_customer_id: NULL
--   plan_type: 'vaka'
--   status: 'active'
--   current_period_start: "2025-11-27T05:54:58.040Z"
--   current_period_end: "2025-12-27T05:54:58.040Z"
--   cancel_at_period_end: false
--   created_at: "2025-11-27T05:54:58.040Z"
--   updated_at: "2026-03-06T19:47:12.737Z"

-- Row 2:
--   id: '6a49ce8d-1237-408d-aa6a-5ff2fafe91a5'
--   user_id: '1eb66672-7581-4184-96a8-553abed10682'
--   business_id: 'e0e03cd4-3a8b-48f9-8ffa-546abfa7925c'
--   stripe_subscription_id: NULL
--   stripe_customer_id: NULL
--   plan_type: 'vaka'
--   status: 'active'
--   current_period_start: "2026-02-07T18:26:40.653Z"
--   current_period_end: "2026-03-07T18:26:40.653Z"
--   cancel_at_period_end: false
--   created_at: "2026-02-07T18:26:40.653Z"
--   updated_at: "2026-03-06T19:49:28.121Z"

-- Row 3:
--   id: '04189e21-594f-4aea-84ae-b941c02f6c6e'
--   user_id: '364269e4-a6c5-4122-bf63-0d318607effd'
--   business_id: '669c26b2-ceec-498e-9e38-17329d6b05ec'
--   stripe_subscription_id: NULL
--   stripe_customer_id: NULL
--   plan_type: 'vaka'
--   status: 'active'
--   current_period_start: "2025-11-24T09:10:17.344Z"
--   current_period_end: "2025-12-24T09:10:17.344Z"
--   cancel_at_period_end: false
--   created_at: "2025-11-24T09:10:17.344Z"
--   updated_at: "2026-03-06T19:23:30.918Z"



-- ================================================
-- Summary
-- ================================================
-- Total Tables: 10
-- Tables: audit_logs, backup_businesses, backup_profiles, business_images, businesses, claim_requests, claim_requests_backup_cleanup, countries, profiles, subscriptions
-- Dump Complete: 2026-03-17T11:58:38.718Z
