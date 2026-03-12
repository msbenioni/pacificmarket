-- Test the table creation with proper syntax
CREATE TABLE test_array_syntax (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    text_array TEXT[],
    jsonb_field JSONB,
    text_field TEXT
);

-- If this works, the main tables should work too
DROP TABLE test_array_syntax;
