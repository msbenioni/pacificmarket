CREATE OR REPLACE FUNCTION sync_business_to_subscriber()
RETURNS TRIGGER AS $$
DECLARE
  existing_subscriber UUID;
  subscriber_id UUID;
BEGIN
  IF NEW.business_email IS NULL OR NEW.is_active = false OR NEW.status != 'active' THEN
    RETURN NEW;
  END IF;
  
  SELECT id INTO existing_subscriber 
  FROM email_subscribers 
  WHERE email = NEW.business_email;
  
  IF existing_subscriber IS NOT NULL THEN
    INSERT INTO email_subscriber_entities (subscriber_id, entity_type, entity_id, entity_name, relationship_type)
    VALUES (existing_subscriber, 'business', NEW.id, NEW.business_name, 'owner')
    ON CONFLICT DO NOTHING;
    
    RETURN NEW;
  END IF;
  
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
  
  INSERT INTO email_subscriber_entities (subscriber_id, entity_type, entity_id, entity_name, relationship_type)
  VALUES (subscriber_id, 'business', NEW.id, NEW.business_name, 'owner');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
