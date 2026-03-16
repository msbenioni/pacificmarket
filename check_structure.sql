SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'businesses' 
AND column_name IN (
    'founder_story', 'age_range', 'gender', 
    'collaboration_interest', 'mentorship_offering', 
    'open_to_future_contact', 'business_acquisition_interest', 'business_stage'
) 
ORDER BY column_name;
