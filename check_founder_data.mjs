import { getSupabase } from './src/lib/supabase/client.js';

async function checkFounderInsightsData() {
  try {
    const supabase = getSupabase();
    
    // Check if there's any data in founder_insights
    const { data, error } = await supabase
      .from('founder_insights')
      .select('id, user_id, gender, age_range, years_entrepreneurial, founder_motivation_array')
      .limit(5);
    
    if (error) {
      console.error('Error:', error);
      return;
    }
    
    console.log('Founder Insights Data Check:');
    console.log('Total records:', data?.length || 0);
    
    if (data && data.length > 0) {
      console.log('Sample record:', JSON.stringify(data[0], null, 2));
      
      // Check for gender and age data
      const hasGender = data.some(record => record.gender);
      const hasAge = data.some(record => record.age_range);
      
      console.log('Has gender data:', hasGender);
      console.log('Has age data:', hasAge);
      
      if (hasGender) {
        const genderCounts = data.reduce((acc, record) => {
          if (record.gender) {
            acc[record.gender] = (acc[record.gender] || 0) + 1;
          }
          return acc;
        }, {});
        console.log('Gender distribution:', genderCounts);
      }
      
      if (hasAge) {
        const ageCounts = data.reduce((acc, record) => {
          if (record.age_range) {
            acc[record.age_range] = (acc[record.age_range] || 0) + 1;
          }
          return acc;
        }, {});
        console.log('Age distribution:', ageCounts);
      }
    } else {
      console.log('No data found in founder_insights table');
    }
    
  } catch (err) {
    console.error('Connection error:', err);
  }
}

checkFounderInsightsData();
