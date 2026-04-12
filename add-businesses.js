import { Pool } from 'pg';

// Database connection from .env.local
const connectionString = 'postgresql://postgres:MontBlanc3001@db.mnmisjprswpuvcojnbip.supabase.co:5432/postgres';

const pool = new Pool({
  connectionString: connectionString,
});

const businesses = [
  {
    business_name: 'DigitalDNA',
    business_handle: 'digitaldna',
    business_email: 'jack@digitaldna.co.nz',
    business_website: 'https://digitaldna.co.nz',
    tagline: 'Building websites, software & AI solutions for Pacific businesses.',
    description: 'DigitalDNA is a technology company focused on building websites, custom software, and AI-powered solutions for Pacific businesses across New Zealand, Australia, and Samoa. With a strong understanding of local and regional needs, DigitalDNA helps businesses modernise their operations, improve efficiency, and scale through practical, tailored digital tools. From startups to established organisations, the focus is on creating solutions that solve real problems and support long-term growth in the Pacific business ecosystem.',
    business_contact_person: 'FUIMAONO JACK SI\u014c',
    business_phone: '027-88-52257',
    cultural_identity: '["Samoa"]',
    subscription_tier: 'mana',
    city: 'Auckland',
    country: 'NZ',
    industry: 'technology',
    business_stage: 'growth',
    is_verified: true,
    visibility_tier: 'homepage'
  },
  {
    business_name: 'USO Beer',
    business_handle: 'usobeer',
    business_email: 'jack@usobeer.com',
    business_website: 'https://usobeer.com',
    tagline: 'Pacific-inspired beer, brewed for connection and balance.',
    description: 'USO Beer is a proudly New Zealand-made beer brand inspired by Pacific culture, community, and connection. Built around the values of unity and responsible enjoyment, USO Beer is redefining drinking culture by promoting moderation while bringing people together. More than just a beverage, it represents a lifestyle rooted in respect, celebration, and shared moments \u2014 created for the Pacific, and made for the world.',
    business_contact_person: 'FUIMAONO JACK SI\u014c',
    business_phone: '027-88-52257',
    cultural_identity: '["Samoa"]',
    subscription_tier: 'mana',
    city: 'Auckland',
    country: 'NZ',
    industry: 'food_beverage',
    business_stage: 'growth',
    is_verified: true,
    visibility_tier: 'homepage'
  },
  {
    business_name: "Jack's Shipping Containers",
    business_handle: 'jacksshippingcontainers',
    business_email: 'jack@jacksshippingcontainers.co.nz',
    business_website: 'https://jacksshippingcontainers.co.nz',
    tagline: 'Shipping goods home to the Pacific with care and reliability.',
    description: "Jack's Shipping Containers is a family-run business dedicated to helping Pacific communities and businesses send personal and commercial goods back to the islands. With a strong focus on trust, affordability, and reliability, they make the shipping process simple and accessible. Whether it's household items, business freight, or bulk shipments, Jack's Shipping Containers supports families and businesses staying connected to home.",
    business_contact_person: 'FUIMAONO JACK SI\u014c',
    business_phone: '027-88-52257',
    cultural_identity: '["Samoa"]',
    subscription_tier: 'mana',
    city: 'Auckland',
    country: 'NZ',
    industry: 'logistics',
    business_stage: 'growth',
    is_verified: true,
    visibility_tier: 'homepage'
  },
  {
    business_name: 'Ready Homes Pacific',
    business_handle: 'readyhomespacific',
    business_email: 'jack@readyhomespacific.com',
    business_website: 'https://readyhomespacific.com',
    tagline: 'Expandable container homes, built for a new way of living in Samoa.',
    description: 'Ready Homes Pacific is a Samoa-based company leading the way in modern, flexible housing solutions. As the first to introduce expandable container homes and pods into Samoa, they offer an innovative alternative to traditional housing. Designed for efficiency, affordability, and practicality, their homes provide a new way of living that meets the evolving needs of individuals, families, and communities across the Pacific.',
    business_contact_person: 'FUIMAONO JACK SI\u014c',
    business_phone: '027-88-52257',
    cultural_identity: '["Samoa"]',
    subscription_tier: 'mana',
    city: 'Apia',
    country: 'WS',
    industry: 'construction',
    business_stage: 'growth',
    is_verified: true,
    visibility_tier: 'homepage'
  }
];

async function addBusinesses() {
  const client = await pool.connect();
  
  try {
    console.log('Connected to database. Adding businesses...');
    
    for (const business of businesses) {
      console.log(`Adding: ${business.business_name}`);
      
      const query = `
        INSERT INTO businesses (
          business_name, 
          business_handle, 
          business_email, 
          business_website, 
          tagline, 
          description, 
          business_contact_person, 
          business_phone, 
          cultural_identity, 
          subscription_tier, 
          city, 
          country, 
          industry, 
          business_stage, 
          is_verified, 
          visibility_tier,
          created_at,
          updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW(), NOW()
        )
        RETURNING id, business_name, business_handle
      `;
      
      const values = [
        business.business_name,
        business.business_handle,
        business.business_email,
        business.business_website,
        business.tagline,
        business.description,
        business.business_contact_person,
        business.business_phone,
        business.cultural_identity,
        business.subscription_tier,
        business.city,
        business.country,
        business.industry,
        business.business_stage,
        business.is_verified,
        business.visibility_tier
      ];
      
      const result = await client.query(query, values);
      console.log(`Successfully added: ${result.rows[0].business_name} (ID: ${result.rows[0].id})`);
    }
    
    console.log('All businesses added successfully!');
    
  } catch (error) {
    console.error('Error adding businesses:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

addBusinesses();
