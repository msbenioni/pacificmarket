-- Add missing entrepreneurial_background field to founder_insights
ALTER TABLE founder_insights 
ADD COLUMN entrepreneurial_background TEXT;
