#!/usr/bin/env node

/**
 * Create a database trigger to automatically sync new businesses to email subscribers
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const serviceClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function createBusinessSyncTrigger() {
  try {
    console.log('🔧 Creating automatic business sync trigger...');
    
    // Create a function to handle new business sync
    const createFunctionSQL = `
      CREATE OR REPLACE FUNCTION sync_business_to_subscriber()
      RETURNS TRIGGER AS $$
      DECLARE
        existing_subscriber UUID;
        subscriber_id UUID;
      BEGIN
        -- Only sync if business has an email and is active
        IF NEW.business_email IS NULL OR NEW.is_active = false OR NEW.status != 'active' THEN
          RETURN NEW;
        END IF;
        
        -- Check if subscriber already exists for this email
        SELECT id INTO existing_subscriber 
        FROM email_subscribers 
        WHERE email = NEW.business_email;
        
        IF existing_subscriber IS NOT NULL THEN
          -- Subscriber exists, link to this business if not already linked
          INSERT INTO email_subscriber_entities (subscriber_id, entity_type, entity_name, relationship_type)
          VALUES (existing_subscriber, 'business', NEW.business_name, 'business_owner')
          ON CONFLICT DO NOTHING;
          
          RETURN NEW;
        END IF;
        
        -- Create new subscriber
        INSERT INTO email_subscribers (
          email, 
          first_name, 
          source, 
          status,
          created_at
        ) VALUES (
          NEW.business_email,
          COALESCE(NEW.business_contact_person, SPLIT_PART(NEW.business_name, ' ', 1)),
          'business_signup',
          'subscribed',
          NOW()
        )
        RETURNING id INTO subscriber_id;
        
        -- Link to business entity
        INSERT INTO email_subscriber_entities (subscriber_id, entity_type, entity_name, relationship_type)
        VALUES (subscriber_id, 'business', NEW.business_name, 'business_owner');
        
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `;

    const { error: functionError } = await serviceClient.rpc('exec_sql', { sql: createFunctionSQL });
    
    if (functionError) {
      console.error('❌ Error creating function:', functionError);
      return;
    }
    
    console.log('✅ Function created successfully');

    // Create the trigger
    const createTriggerSQL = `
      DROP TRIGGER IF EXISTS on_business_insert_sync ON businesses;
      
      CREATE TRIGGER on_business_insert_sync
        AFTER INSERT OR UPDATE ON businesses
        FOR EACH ROW
        EXECUTE FUNCTION sync_business_to_subscriber();
    `;

    const { error: triggerError } = await serviceClient.rpc('exec_sql', { sql: createTriggerSQL });
    
    if (triggerError) {
      console.error('❌ Error creating trigger:', triggerError);
      return;
    }
    
    console.log('✅ Trigger created successfully');
    console.log('\n🎉 Automatic sync is now enabled!');
    console.log('   - New businesses will be automatically added as subscribers');
    console.log('   - Updated businesses will be synced if they become active');
    console.log('   - Shared emails will be handled correctly');

  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

createBusinessSyncTrigger().catch(console.error);
