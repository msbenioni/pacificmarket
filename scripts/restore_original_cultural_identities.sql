-- SQL to restore the original cultural identities that were lost
-- This specifically restores the exact data you had before

-- First, let's see what we have now (should be mostly {})
SELECT 
  cultural_identity,
  COUNT(*) as business_count,
  (SELECT ARRAY_AGG(business_name ORDER BY business_name) 
   FROM (SELECT business_name FROM businesses b2 
         WHERE b2.cultural_identity = b1.cultural_identity 
         ORDER BY business_name LIMIT 3) AS subquery) as sample_businesses
FROM businesses b1
WHERE cultural_identity IS NOT NULL 
GROUP BY cultural_identity
ORDER BY business_count DESC;

-- Restore specific businesses with their original cultural identities
UPDATE businesses SET cultural_identity = '{Samoan}' WHERE business_name = 'Aki Store';
UPDATE businesses SET cultural_identity = '{Samoan}' WHERE business_name = 'Anarra Alofa Est.2020';
UPDATE businesses SET cultural_identity = '{Samoan}' WHERE business_name = 'DAN KAS Construction';
UPDATE businesses SET cultural_identity = '{"New Zealand Maori"}' WHERE business_name = 'Beautyby2';
UPDATE businesses SET cultural_identity = '{"New Zealand Maori"}' WHERE business_name = 'Tangata Whenua Carving';
UPDATE businesses SET cultural_identity = '{"New Zealand Maori"}' WHERE business_name = 'The Artwork of Dave Sotogi';
UPDATE businesses SET cultural_identity = '{"Cook Islands Maori","French Polynesia"}' WHERE business_name = 'Oceanique SolutioNZ';
UPDATE businesses SET cultural_identity = '{"Cook Islands Maori","French Polynesia"}' WHERE business_name = 'SaaSy Cookies';
UPDATE businesses SET cultural_identity = '{"Cook Islands Maori","French Polynesia"}' WHERE business_name = 'SenseAI';
UPDATE businesses SET cultural_identity = '{"Cook Islands Maori"}' WHERE business_name = 'Amuri Boyz Entertainment';
UPDATE businesses SET cultural_identity = '{"Cook Islands Maori"}' WHERE business_name = 'Jztamakaandkickz';
UPDATE businesses SET cultural_identity = '{"Cook Islands Maori"}' WHERE business_name = 'Mana Carvings';
UPDATE businesses SET cultural_identity = '{"French Polynesia"}' WHERE business_name = 'L''ame Du Pareu by Vai''ohani';
UPDATE businesses SET cultural_identity = '{"French Polynesia"}' WHERE business_name = 'VAHINE CHIC';
UPDATE businesses SET cultural_identity = '{Papuan}' WHERE business_name = 'Pacificana';
UPDATE businesses SET cultural_identity = '{Papuan}' WHERE business_name = 'Papua New Guinea Bilums and Baskets';
UPDATE businesses SET cultural_identity = '{"Cook Islands Maori","New Zealand Maori"}' WHERE business_name = 'Te Mauri o te Makawe';
UPDATE businesses SET cultural_identity = '{"New Caledonia"}' WHERE business_name = 'Pacifikmarket.nc';
UPDATE businesses SET cultural_identity = '{"New Zealand"}' WHERE business_name = 'Steam Pudding Lady';
UPDATE businesses SET cultural_identity = '{"Wallis and Futuna"}' WHERE business_name = 'SILILO TATTOO';
UPDATE businesses SET cultural_identity = '{China,Fijian,India}' WHERE business_name = 'Zeena Khan Coaching';
UPDATE businesses SET cultural_identity = '{China,Samoan}' WHERE business_name = 'David Laumatia Art';
UPDATE businesses SET cultural_identity = '{Fijian,Italy}' WHERE business_name = 'M.Steven';
UPDATE businesses SET cultural_identity = '{Fijian,Samoan,Tongan}' WHERE business_name = 'Warrior Lines Tattoo';
UPDATE businesses SET cultural_identity = '{Ireland,Samoan}' WHERE business_name = 'Angela Malakai | The HONESTea';
UPDATE businesses SET cultural_identity = '{Samoan,Tongan}' WHERE business_name = 'Island Pepe';
UPDATE businesses SET cultural_identity = '{Tongan}' WHERE business_name = 'NEST Interiors';

-- Show results after restoration
SELECT 
  cultural_identity,
  COUNT(*) as business_count,
  (SELECT ARRAY_AGG(business_name ORDER BY business_name) 
   FROM (SELECT business_name FROM businesses b2 
         WHERE b2.cultural_identity = b1.cultural_identity 
         ORDER BY business_name LIMIT 3) AS subquery) as sample_businesses
FROM businesses b1
WHERE cultural_identity IS NOT NULL 
  AND cultural_identity != '{}'
GROUP BY cultural_identity
ORDER BY business_count DESC, cultural_identity;

-- Show businesses that still have no cultural identities (for manual review)
SELECT 
  business_name,
  country,
  'No cultural identity - needs manual review' as status
FROM businesses 
WHERE cultural_identity IS NULL OR cultural_identity = '{}'
ORDER BY business_name;
