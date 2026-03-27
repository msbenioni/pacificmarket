import { requireAdmin } from '@/lib/server-auth';

/**
 * Get available languages and countries from business data
 * Used by CampaignForm to populate dropdown options
 */
export async function GET(request) {
  try {
    // Authenticate admin and get service client
    const auth = await requireAdmin(request);
    if (auth.error) {
      return Response.json({ error: auth.error }, { status: auth.status });
    }

    const { serviceClient } = auth;

    // Get unique languages from businesses table
    const { data: businesses, error: businessError } = await serviceClient
      .from('businesses')
      .select('languages_spoken')
      .not('languages_spoken', 'is', null);

    const languageSet = new Set();
    if (!businessError && businesses) {
      businesses.forEach(business => {
        if (business.languages_spoken) {
          try {
            // Try JSON.parse first
            const languages = JSON.parse(business.languages_spoken);
            if (Array.isArray(languages)) {
              languages.forEach(lang => {
                if (typeof lang === 'string' && lang.trim()) {
                  languageSet.add(lang.trim());
                }
              });
            }
          } catch (e) {
            // Fallback to text parsing for malformed JSON
            const cleanStr = business.languages_spoken.trim();
            
            // Handle various broken JSON patterns
            if (cleanStr.startsWith('[') && cleanStr.endsWith(']')) {
              // Try to extract quoted strings from array-like strings
              const matches = cleanStr.match(/"([^"]+)"/g);
              if (matches) {
                matches.forEach(match => {
                  const lang = match.replace(/"/g, '').trim();
                  if (lang) languageSet.add(lang);
                });
              }
            } else if (cleanStr.startsWith('"') && cleanStr.endsWith('"')) {
              // Single quoted language
              const lang = cleanStr.slice(1, -1).trim();
              if (lang) languageSet.add(lang);
            } else {
              // Unquoted language
              if (cleanStr) languageSet.add(cleanStr);
            }
          }
        }
      });
    }

    // Get unique countries from businesses table
    const { data: countries, error: countryError } = await serviceClient
      .from('businesses')
      .select('country')
      .not('country', 'is', null);

    const countrySet = new Set();
    if (!countryError && countries) {
      countries.forEach(business => {
        if (business.country && typeof business.country === 'string') {
          const cleanCountry = business.country.trim();
          if (cleanCountry) {
            countrySet.add(cleanCountry);
          }
        }
      });
    }

    return Response.json({
      success: true,
      languages: Array.from(languageSet).sort(),
      countries: Array.from(countrySet).sort()
    });

  } catch (error) {
    console.error('Audience data API error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
