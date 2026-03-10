-- Add revenue_band column to businesses table
-- This is preferred over annual_revenue_exact for better user experience

-- Add the revenue_band column
ALTER TABLE businesses 
ADD COLUMN revenue_band TEXT;

-- Add comment for documentation
COMMENT ON COLUMN businesses.revenue_band IS 'Revenue band/category for business (e.g., pre-revenue, under-10k, 10k-25k, etc.)';

-- Verify the column was added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'businesses' AND column_name = 'revenue_band';
