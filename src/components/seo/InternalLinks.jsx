// Internal linking components for SEO
import Link from "next/link";

export const RelatedBusinesses = ({ currentBusiness, businesses }) => {
  const relatedBusinesses = businesses
    .filter(b => 
      b.id !== currentBusiness.id && 
      (b.industry === currentBusiness.industry || 
       b.city === currentBusiness.city ||
       b.cultural_identity === currentBusiness.cultural_identity)
    )
    .slice(0, 3);

  return (
    <div className="related-businesses">
      <h3>Related Pacific Businesses</h3>
      {relatedBusinesses.map(business => (
        <Link key={business.id} href={`/business/${business.business_handle}`}>
          {business.business_name}
        </Link>
      ))}
    </div>
  );
};

// Breadcrumb navigation
export const Breadcrumbs = ({ pages }) => (
  <nav aria-label="Breadcrumb">
    <ol>
      <li><Link href="/">Home</Link></li>
      {pages.map((page, index) => (
        <li key={index}>
          {page.href ? (
            <Link href={page.href}>{page.title}</Link>
          ) : (
            <span>{page.title}</span>
          )}
        </li>
      ))}
    </ol>
  </nav>
);

// Industry category links
export const IndustryLinks = () => {
  const industries = [
    "Restaurants & Food",
    "Retail & Shopping", 
    "Services",
    "Tourism & Hospitality",
    "Professional Services",
    "Arts & Crafts",
    "Technology",
    "Health & Wellness"
  ];

  return (
    <div className="industry-links">
      <h3>Browse by Industry</h3>
      <ul>
        {industries.map(industry => (
          <li key={industry}>
            <Link href={`/industries/${industry.toLowerCase().replace(/\s+/g, '-')}`}>
              {industry}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
