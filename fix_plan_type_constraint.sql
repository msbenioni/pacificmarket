-- Fix the plan_type constraint to allow only Pacific Market tier values

-- Drop the existing constraint
ALTER TABLE subscriptions DROP CONSTRAINT IF EXISTS subscriptions_plan_type_check;

-- Add the correct constraint with only Pacific Market tier values
ALTER TABLE subscriptions 
ADD CONSTRAINT subscriptions_plan_type_check 
CHECK (plan_type IN ('vaka', 'mana', 'moana'));

-- Test the constraint
SELECT 'Plan type constraint updated for Pacific Market tiers only' as status;
