// Shared demo data for Pacific Discovery Network tools
// Used across Tools landing page and tool generators

export const PDN_DEMO_DATA = {
  // Business details
  business_name: "Pacific Discovery Network",
  business_email: "hello@pacificdiscoverynetwork.com",
  business_phone: "+64 21 234 5678",
  business_website: "pacificdiscoverynetwork.com",
  business_address: "Auckland, New Zealand",
  
  // Personal details for signature
  full_name: "Jasmin Benioni",
  job_title: "Founder & Software Developer",
  department: "",
  pronouns: "",
  
  // Brand colors (PDN defaults)
  brand_primary: "#0a1628",
  brand_secondary: "#0d4f4f", 
  brand_accent: "#00c4cc",
  brand_text: "#0f172a",
  
  // Social links
  linkedin: "https://linkedin.com/in/pacificdiscoverynetwork",
  facebook: "",
  instagram: "https://instagram.com/pacificdiscoverynetwork",
  tiktok: "",
  
  // Signature options
  include_logo: true,
  include_socials: true,
  include_badge: true,
  include_address: true,
  include_pronouns: false,
  logo_url: "/1pm_logo.png", // PDN logo if available
  
  // Disclaimer
  disclaimer: "This email and any attachments are confidential and intended solely for the addressee.",
  
  // Invoice data
  invoice: {
    invoice_number: "INV-240318",
    date: "2024-03-18",
    due_date: "2024-03-25",
    
    // Sender details (PDN)
    sender_name: "Pacific Discovery Network",
    sender_email: "hello@pacificdiscoverynetwork.com",
    sender_phone: "+64 21 234 5678",
    sender_address: "123 Queen Street\nAuckland 1010\nNew Zealand",
    sender_logo_url: "/1pm_logo.png",
    
    // Client details
    client_name: "Moana Creative Studio",
    client_email: "contact@moanacreative.nz",
    client_phone: "+64 9 123 4567",
    client_address: "456 Beach Road\nMount Maunganui 3116\nNew Zealand",
    
    // Items
    items: [
      {
        description: "Directory Listing Upgrade",
        quantity: 1,
        unit_price: 99.00
      },
      {
        description: "QR Code Flyer Setup", 
        quantity: 1,
        unit_price: 55.00
      },
      {
        description: "Email Signature Setup",
        quantity: 1,
        unit_price: 25.00
      }
    ],
    
    // Tax and payment
    tax_rate: 15, // NZ GST
    withholding_tax_rate: 0,
    payment_account_name: "Pacific Discovery Network Ltd",
    payment_account_number: "12-3456-7890123-00",
    payment_reference_label: "INV-240318",
    payment_terms: "Payment due within 7 days",
    
    // Notes
    notes: "Thank you for your business with Pacific Discovery Network.",
    
    // Adjustments (empty for demo)
    adjustments: []
  },
  
  // QR Code data
  qr: {
    url: "https://pacificdiscoverynetwork.com",
    label: "Pacific Discovery Network",
    size: 256,
    use_cases: ["Storefront", "Payments", "Events"]
  }
};

