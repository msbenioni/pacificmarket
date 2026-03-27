#!/usr/bin/env node

/**
 * Simple founder email sender
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function previewFounderEmail() {
  console.log('📧 Founder Email Preview');
  console.log('========================\n');

  try {
    // Get all businesses
    console.log('🏢 Fetching businesses...');
    
    const query = supabase
      .from('businesses')
      .select('business_name, business_email, business_contact_person')
      .eq('is_active', true)
      .not('business_email', 'is', null)
      .order('business_name');

    const { data: businesses, error: businessError } = await query;

    if (businessError) {
      console.error('❌ Failed to fetch businesses:', businessError);
      return;
    }

    console.log(`✅ Found ${businesses?.length || 0} businesses`);

    // Show recipients
    console.log('\n👥 Email Recipients:');
    businesses?.forEach((business, i) => {
      const firstName = business.business_contact_person || business.business_name;
      console.log(`  ${i + 1}. ${firstName} (${business.business_email})`);
      console.log(`     Business: ${business.business_name}`);
    });

    // Show email content
    console.log('\n📧 Email Content Preview:');
    console.log('========================');
    console.log('Subject: Personal Message from Jasmin: Pacific Market is evolving into Pacific Discovery Network');
    console.log('From: Pacific Discovery Network <hello@pacificdiscoverynetwork.com>');
    console.log('Reply-to: hello@pacificdiscoverynetwork.com');
    console.log('\nBody:');
    
    const sampleFirstName = businesses?.[0]?.business_contact_person || businesses?.[0]?.business_name || '[First Name]';
    
    console.log(`Hi ${sampleFirstName},`);
    console.log('');
    console.log('I wanted to personally let you know that Pacific Market is evolving into Pacific Discovery Network.');
    console.log('');
    console.log('Pacific Market started as a way for me to help make Pacific businesses more visible and easier to discover. As I kept building, it became clear that the bigger opportunity was not just creating a listing space, but building a platform that could better support Pacific businesses with visibility, connection, and practical tools for growth.');
    console.log('');
    console.log('That is where Pacific Discovery Network comes in.');
    console.log('');
    console.log('PDN is a new startup platform that I am actively building and improving. It is still in transition from Pacific Market, and I want to be transparent about that. There may still be a few hiccups along the way while I continue refining the platform and putting the right infrastructure in place. If you notice anything wrong or missing, please reply to this email and let me know so I can fix it.');
    console.log('');
    console.log('Your business has already been transitioned across to the new platform on the Vaka plan.');
    console.log('');
    console.log('As part of that transition, your current logo and banner image have been kept in place. If you would prefer those removed, I can do that for free. If you want to update your branding, upgrade your plan, or access the business tools, you will need to create an account and claim your business on the platform.');
    console.log('');
    console.log('Claiming your business is important because it allows you to:');
    console.log('- update your business details');
    console.log('- change your logo or banner image');
    console.log('- upgrade your plan');
    console.log('- access business tools as they roll out');
    console.log('- manage your listing properly going forward');
    console.log('');
    console.log('So while your business has already been moved across, the next step is still yours: create your account and claim your business.');
    console.log('');
    console.log('Pacific Discovery Network is being built to become more than just a listing platform. My goal is to create something that helps Pacific businesses become more visible, more supported, and easier to discover — while also giving them practical tools that make running and growing a business easier.');
    console.log('');
    console.log('As I begin actively marketing Pacific Discovery Network more publicly, the businesses on the platform will also benefit from that visibility. My hope is that this leads to more reach, more customers, stronger partnerships, and more opportunities over time.');
    console.log('');
    console.log('Thank you for being part of this journey and for growing with me while I build this.');
    console.log('');
    console.log('If you need help claiming your business, want anything updated, or notice anything that needs fixing, just reply to this email.');
    console.log('');
    console.log('Warmly,');
    console.log('Jasmin');
    console.log('Founder, Pacific Discovery Network');
    console.log('');
    console.log('---');
    console.log('View your business: https://pacificdiscoverynetwork.com/PacificBusinesses');
    console.log('Create account & claim: https://pacificdiscoverynetwork.com/BusinessPortal');

    console.log('\n⚠️  This is a preview only - no emails sent');
    console.log('\n💡 To send these emails, you have several options:');
    console.log('');
    console.log('Option 1: Use the existing email campaign system');
    console.log('- Go to: https://pacificdiscoverynetwork.com/AdminDashboard');
    console.log('- Look for email marketing section');
    console.log('- Create campaign with this content');
    console.log('');
    console.log('Option 2: I can create a simple sending script');
    console.log('- Would send via SMTP directly');
    console.log('- Would track sent/failed emails');
    console.log('- Would add delays between sends');
    console.log('');
    console.log('Option 3: Use your email client');
    console.log('- Copy the recipient list below');
    console.log('- Send as BCC to protect privacy');
    console.log('');
    console.log('Which option would you prefer?');

  } catch (error) {
    console.error('❌ Process failed:', error);
  }
}

previewFounderEmail().catch(console.error);
