-- Create function to automatically sync businesses to email subscribers
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

-- Create trigger for automatic sync
DROP TRIGGER IF EXISTS on_business_insert_sync ON businesses;

CREATE TRIGGER on_business_insert_sync
  AFTER INSERT OR UPDATE ON businesses
  FOR EACH ROW
  EXECUTE FUNCTION sync_business_to_subscriber();

-- Add comment for documentation
COMMENT ON FUNCTION sync_business_to_subscriber IS 'Automatically sync new/updated businesses to email subscribers when they have valid emails and are active';
COMMENT ON TRIGGER on_business_insert_sync ON businesses IS 'Trigger to automatically sync businesses to email subscribers';
