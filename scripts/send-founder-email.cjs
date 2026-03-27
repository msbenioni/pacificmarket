#!/usr/bin/env node

/**
 * Send founder email to all businesses
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const nodemailer = require('nodemailer');

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

const emailTemplate = (firstName) => `Hi ${firstName},

I wanted to personally reach out and let you know that Pacific Market is evolving into Pacific Discovery Network.

Pacific Market started as a simple way for me to help make Pacific businesses more visible and easier to discover. But as I kept building, I realised the bigger opportunity was not just to create a listing space, but to build something more useful around it — a platform that could better support Pacific businesses with visibility, connection, and practical tools over time.

That is where Pacific Discovery Network comes in.

This next stage is something my co-founder Daniel and I are building together. PDN is a new startup platform that we are actively building and improving, and it is still in transition from Pacific Market. I want to be transparent about that, because you may notice the occasional hiccup, missing detail, or something that still needs refining while we continue building it out behind the scenes.

If you notice anything wrong with your listing or need help with anything at all, please reply to this email and let me know so I can fix it.

Your business has already been transitioned across to the new platform on the Vaka plan.

As part of that transition, your current logo and banner image have been carried across and kept in place.

To secure and manage your listing going forward, you will need to create an account and claim your business.

Claiming your business allows you to:
- manage and secure your listing
- update your business information
- upgrade your plan
- access business tools as they roll out

And to help with this transition, we're also running a launch promotion:

If you claim your business by 30 April, you will automatically receive a free upgrade to the Mana plan.

The Mana plan is normally $4.99 per month and gives you the ability to update your logo and banner image.

Pacific Discovery Network is being built to become more than just a listing platform. Our goal is to create something that helps Pacific businesses become more visible, more supported, and easier to discover, while also making room for practical tools that help businesses grow.

As we begin actively marketing Pacific Discovery Network more publicly, the businesses on the platform will also benefit from that visibility. Our hope is that this creates more opportunities over time — from reaching new customers, to being discovered by collaborators, stockists, importers, global customers, and even investors interested in promising Pacific businesses with growth potential.

Thank you for being part of this journey and for growing with us while we build this.

If you need help claiming your business, want anything corrected, or notice anything that needs fixing, just reply to this email.

Jasmin Benioni
Co-Founder, Pacific Discovery Network
www.pacificdiscoverynetwork.com

---
Claim your business before April 30th: https://pacificdiscoverynetwork.com/BusinessPortal
View your listing: https://pacificdiscoverynetwork.com/PacificBusinesses`;

async function sendFounderEmail() {
  console.log('📧 Sending Founder Email');
  console.log('======================\n');

  try {
    // Get all businesses
    console.log('🏢 Fetching businesses...');
    const { data: businesses, error: businessError } = await supabase
      .from('businesses')
      .select('business_name, business_email, business_contact_person')
      .eq('is_active', true)
      .not('business_email', 'is', null)
      .order('business_name');

    if (businessError) {
      console.error('❌ Failed to fetch businesses:', businessError);
      return;
    }

    console.log(`✅ Found ${businesses?.length || 0} businesses`);

    // Check if this is a test run
    const isTestRun = !process.argv.includes('--send');
    
    if (isTestRun) {
      console.log('\n⚠️  TEST RUN MODE - No emails will be sent');
      console.log('To actually send, run with: node scripts/send-founder-email.cjs --send');
      
      console.log('\n👥 Recipients preview:');
      businesses?.slice(0, 5).forEach((business, i) => {
        const firstName = business.business_contact_person || business.business_name;
        console.log(`  ${i + 1}. ${firstName} (${business.business_email})`);
        console.log(`     Business: ${business.business_name}`);
      });
      
      if (businesses.length > 5) {
        console.log(`     ... and ${businesses.length - 5} more`);
      }
      
      console.log('\n📧 Email preview:');
      const sampleFirstName = businesses?.[0]?.business_contact_person || businesses?.[0]?.business_name || '[First Name]';
      console.log('Subject: Your business is now on Pacific Discovery Network - Claim before 30th April for a free upgrade');
      console.log('From: Pacific Discovery Network <hello@pacificdiscoverynetwork.com>');
      console.log('\nBody (first 200 characters):');
      console.log(emailTemplate(sampleFirstName).substring(0, 200) + '...');
      
      console.log('\n💡 Ready to send! Run with --send flag to actually send emails.');
      return;
    }

    // Actual sending
    console.log('\n🚀 Starting to send emails...');
    
    // Create SMTP transporter
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    let successCount = 0;
    let errorCount = 0;
    const results = [];

    // Send emails one by one
    for (let i = 0; i < businesses.length; i++) {
      const business = businesses[i];
      const firstName = business.business_contact_person || business.business_name;
      
      try {
        const emailContent = emailTemplate(firstName);

        const mailOptions = {
          from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
          to: business.business_email,
          subject: 'Your business is now on Pacific Discovery Network - Claim before 30th April for a free upgrade',
          text: emailContent,
          replyTo: process.env.SMTP_FROM_EMAIL
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ [${i + 1}/${businesses.length}] Sent to: ${business.business_name} (${business.email})`);
        successCount++;
        results.push({ business: business.business_name, email: business.business_email, status: 'sent' });

        // Delay between emails (2 seconds)
        if (i < businesses.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }

      } catch (error) {
        console.error(`❌ [${i + 1}/${businesses.length}] Failed to send to ${business.business_email}:`, error.message);
        errorCount++;
        results.push({ business: business.business_name, email: business.business_email, status: 'failed', error: error.message });
      }
    }

    console.log('\n📊 Sending Summary:');
    console.log(`✅ Successfully sent: ${successCount}`);
    console.log(`❌ Failed: ${errorCount}`);
    console.log(`📊 Total: ${businesses.length}`);

    // Show failed emails if any
    if (errorCount > 0) {
      console.log('\n❌ Failed emails:');
      results.filter(r => r.status === 'failed').forEach(result => {
        console.log(`  - ${result.business} (${result.email}): ${result.error}`);
      });
    }

    console.log('\n🎉 Email sending completed!');

  } catch (error) {
    console.error('❌ Process failed:', error);
  }
}

sendFounderEmail().catch(console.error);
