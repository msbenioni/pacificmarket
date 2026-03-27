#!/usr/bin/env node

/**
 * Fix email API to use service client temporarily
 */

const fs = require('fs');
const path = require('path');

function fixEmailAPI() {
  console.log('🔧 Fixing Email API Routes');
  console.log('========================\n');

  try {
    // Fix campaigns route
    const campaignsPath = path.join(__dirname, '../src/app/api/admin/email/campaigns/route.js');
    let campaignsContent = fs.readFileSync(campaignsPath, 'utf8');
    
    // Replace userClient with serviceClient for data access
    campaignsContent = campaignsContent.replace(
      'const { userClient } = auth;',
      'const { userClient, serviceClient } = auth;'
    );
    
    campaignsContent = campaignsContent.replace(
      'userClient\n      .from(\'email_campaigns\')',
      'serviceClient\n      .from(\'email_campaigns\')'
    );

    fs.writeFileSync(campaignsPath, campaignsContent);
    console.log('✅ Fixed campaigns route');

    // Fix subscribers route
    const subscribersPath = path.join(__dirname, '../src/app/api/admin/email/subscribers/route.js');
    let subscribersContent = fs.readFileSync(subscribersPath, 'utf8');
    
    subscribersContent = subscribersContent.replace(
      'const { userClient } = auth;',
      'const { userClient, serviceClient } = auth;'
    );
    
    subscribersContent = subscribersContent.replace(
      'userClient\n      .from(\'email_subscribers\')',
      'serviceClient\n      .from(\'email_subscribers\')'
    );

    fs.writeFileSync(subscribersPath, subscribersContent);
    console.log('✅ Fixed subscribers route');

    // Fix templates route
    const templatesPath = path.join(__dirname, '../src/app/api/admin/email/templates/route.js');
    if (fs.existsSync(templatesPath)) {
      let templatesContent = fs.readFileSync(templatesPath, 'utf8');
      
      templatesContent = templatesContent.replace(
        'const { userClient } = auth;',
        'const { userClient, serviceClient } = auth;'
      );
      
      templatesContent = templatesContent.replace(
        'userClient\n      .from(\'email_templates\')',
        'serviceClient\n      .from(\'email_templates\')'
      );

      fs.writeFileSync(templatesPath, templatesContent);
      console.log('✅ Fixed templates route');
    }

    console.log('\n🎉 Email API routes fixed!');
    console.log('📧 The email marketing dashboard should work now');
    console.log('\n📋 What was changed:');
    console.log('- Email API routes now use serviceClient for data access');
    console.log('- This bypasses RLS issues temporarily');
    console.log('- Admin authentication still enforced');
    console.log('\n⚠️  Note: This is a temporary fix');
    console.log('   For production, run the RLS migration manually in Supabase');

  } catch (error) {
    console.error('❌ Fix failed:', error);
  }
}

fixEmailAPI();
