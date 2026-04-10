export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Pacific Discovery Network",
  "url": "https://pacificdiscoverynetwork.com",
  "logo": "https://pacificdiscoverynetwork.com/pm_logo.png",
  "description": "Discover and connect with authentic Pacific Island businesses. Support local entrepreneurs and strengthen Pacific communities.",
  "sameAs": [
    // Add social media URLs when you have them
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "availableLanguage": "English"
  }
};

export const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Pacific Discovery Network",
  "url": "https://pacificdiscoverynetwork.com",
  "description": "Discover and connect with authentic Pacific Island businesses",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://pacificdiscoverynetwork.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

export const localBusinessSchema = (business) => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": business.business_name,
  "description": business.description || "",
  "url": `https://pacificdiscoverynetwork.com/BusinessProfile/${business.business_handle}`,
  "logo": business.logo_url,
  "image": business.banner_url,
  "address": {
    "@type": "PostalAddress",
    "addressLocality": business.city,
    "addressCountry": business.country,
    "postalCode": business.postal_code
  },
  "telephone": business.phone,
  "email": business.email,
  "currenciesAccepted": "USD",
  "paymentAccepted": "Cash, Credit Card",
  "priceRange": "$$"
});
