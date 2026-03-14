-- Create claim_requests table for business claim functionality
-- This table was missing from the database schema

CREATE TABLE IF NOT EXISTS claim_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    contact_email TEXT,
    contact_phone TEXT,
    verification_documents TEXT, -- JSON array of document URLs
    rejection_reason TEXT,
    reviewed_by UUID REFERENCES profiles(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    business_name TEXT, -- Denormalized for convenience
    user_email TEXT, -- Denormalized for convenience
    role TEXT, -- User role at time of claim
    proof_url TEXT, -- URL to proof documents
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_claim_requests_user_id ON claim_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_claim_requests_business_id ON claim_requests(business_id);
CREATE INDEX IF NOT EXISTS idx_claim_requests_status ON claim_requests(status);
CREATE INDEX IF NOT EXISTS idx_claim_requests_created_at ON claim_requests(created_at);

-- Enable RLS
ALTER TABLE claim_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for claim_requests
CREATE POLICY "Users can view their own claim requests" ON claim_requests
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own claim requests" ON claim_requests
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pending claim requests" ON claim_requests
    FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Users can delete their own pending claim requests" ON claim_requests
    FOR DELETE USING (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Admins have full access to claim requests" ON claim_requests
    FOR ALL USING (
        auth.jwt() ->> 'role' = 'admin'
    );

-- Function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_claim_requests_updated_at
    BEFORE UPDATE ON claim_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
