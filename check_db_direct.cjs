// Simple database check using connection string
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mnmisjprswpuvcojnbip.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ubWlzanByc3dwdXZjb2puYmlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2ODkwMTcsImV4cCI6MjA4NzI2NTAxN30.vl7Em91jGQP8mse-CJkIxTtuxWswoDO6sdSFLhhEc9A';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkFounderInsightsData() {
  try {
    console.log('Checking founder_insights table...');
    
    // Check if there's any data in founder_insights
    const { data, error } = await supabase
      .from('founder_insights')
      .select('id, user_id, gender, age_range, years_entrepreneurial, founder_motivation_array, submitted_date')
      .limit(5);
    
    if (error) {
      console.error('Database error:', error);
      return;
    }
    
    console.log('=== FOUNDER INSIGHTS DATA CHECK ===');
    console.log('Total records:', data?.length || 0);
    
    if (data && data.length > 0) {
      console.log('\nSample record:');
      console.log(JSON.stringify(data[0], null, 2));
      
      // Check for gender and age data
      const hasGender = data.some(record => record.gender);
      const hasAge = data.some(record => record.age_range);
      const hasMotivations = data.some(record => record.founder_motivation_array);
      
      console.log('\n=== DATA AVAILABILITY ===');
      console.log('Has gender data:', hasGender);
      console.log('Has age data:', hasAge);
      console.log('Has motivation data:', hasMotivations);
      
      if (hasGender) {
        const genderCounts = data.reduce((acc, record) => {
          if (record.gender) {
            acc[record.gender] = (acc[record.gender] || 0) + 1;
          }
          return acc;
        }, {});
        console.log('\nGender distribution:', genderCounts);
      }
      
      if (hasAge) {
        const ageCounts = data.reduce((acc, record) => {
          if (record.age_range) {
            acc[record.age_range] = (acc[record.age_range] || 0) + 1;
          }
          return acc;
        }, {});
        console.log('\nAge distribution:', ageCounts);
      }
      
      if (hasMotivations) {
        const motivationCounts = data.reduce((acc, record) => {
          if (record.founder_motivation_array && Array.isArray(record.founder_motivation_array)) {
            record.founder_motivation_array.forEach(motivation => {
              acc[motivation] = (acc[motivation] || 0) + 1;
            });
          }
          return acc;
        }, {});
        console.log('\nMotivation distribution:', motivationCounts);
      }
    } else {
      console.log('❌ No data found in founder_insights table');
    }
    
    // Also check business_insights for comparison
    console.log('\n=== BUSINESS INSIGHTS DATA CHECK ===');
    const { data: businessData, error: businessError } = await supabase
      .from('business_insights')
      .select('id, business_id, user_id, business_stage, top_challenges')
      .limit(3);
    
    if (businessError) {
      console.error('Business insights error:', businessError);
    } else {
      console.log('Business insights records:', businessData?.length || 0);
      if (businessData && businessData.length > 0) {
        console.log('Sample business record:', JSON.stringify(businessData[0], null, 2));
      }
    }
    
  } catch (err) {
    console.error('Connection error:', err.message);
  }
}

checkFounderInsightsData();
