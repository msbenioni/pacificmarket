-- Check if there are any existing templates before removal
SELECT 
    COUNT(*) as template_count,
    STRING_AGG(name, ', ') as template_names
FROM email_templates;

-- If there are templates, show their details
SELECT 
    id,
    name,
    subject,
    created_at,
    created_by
FROM email_templates 
ORDER BY created_at DESC;
