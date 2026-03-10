import { createClient } from "@supabase/supabase-js";
import { getBusinessById } from "@/lib/supabase/queries/businesses";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const SIGNATURE_TEMPLATES = {
  modern: {
    name: "Modern",
    colors: {
      primary: "#0a1628",
      secondary: "#0d4f4f", 
      accent: "#00c4cc"
    }
  },
  pacific: {
    name: "Pacific",
    colors: {
      primary: "#0a1628",
      secondary: "#c9a84c",
      accent: "#00c4cc"
    }
  },
  minimal: {
    name: "Minimal",
    colors: {
      primary: "#333333",
      secondary: "#666666",
      accent: "#0d4f4f"
    }
  }
};

function generateSignatureHTML(data, template = 'modern', business = null) {
  const templateConfig = SIGNATURE_TEMPLATES[template];
  const colors = templateConfig.colors;

  const socialLinks = [];
  if (data.linkedin) socialLinks.push({ icon: 'linkedin', url: data.linkedin });
  if (data.facebook) socialLinks.push({ icon: 'facebook', url: data.facebook });
  if (data.instagram) socialLinks.push({ icon: 'instagram', url: data.instagram });

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0; padding: 20px 0;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          ${data.includeLogo && business?.logo_url ? `
            <td style="vertical-align: top; padding-right: 20px;">
              <img src="${business.logo_url}" alt="${business.name}" style="width: 80px; height: auto; max-height: 80px; object-fit: contain;" />
            </td>
          ` : ''}
          <td style="vertical-align: top;">
            <div style="margin-bottom: 15px;">
              <h2 style="margin: 0; color: ${colors.primary}; font-size: 18px; font-weight: bold;">
                ${data.name || 'Your Name'}
              </h2>
              ${data.title ? `
                <p style="margin: 2px 0; color: ${colors.secondary}; font-size: 14px;">
                  ${data.title}
                </p>
              ` : ''}
              ${business ? `
                <p style="margin: 2px 0; color: ${colors.secondary}; font-size: 14px; font-weight: 500;">
                  ${business.name}
                </p>
              ` : ''}
            </div>
            
            <div style="margin-bottom: 15px;">
              ${data.email ? `
                <div style="margin: 3px 0; color: ${colors.primary}; font-size: 13px;">
                  <span style="color: ${colors.accent};">📧</span> 
                  <a href="mailto:${data.email}" style="color: ${colors.primary}; text-decoration: none;">${data.email}</a>
                </div>
              ` : ''}
              ${data.phone ? `
                <div style="margin: 3px 0; color: ${colors.primary}; font-size: 13px;">
                  <span style="color: ${colors.accent};">📱</span> 
                  <a href="tel:${data.phone}" style="color: ${colors.primary}; text-decoration: none;">${data.phone}</a>
                </div>
              ` : ''}
              ${data.website ? `
                <div style="margin: 3px 0; color: ${colors.primary}; font-size: 13px;">
                  <span style="color: ${colors.accent};">🌐</span> 
                  <a href="${data.website}" style="color: ${colors.primary}; text-decoration: none;" target="_blank">${data.website}</a>
                </div>
              ` : ''}
              ${data.address ? `
                <div style="margin: 3px 0; color: ${colors.primary}; font-size: 13px;">
                  <span style="color: ${colors.accent};">📍</span> 
                  ${data.address}
                </div>
              ` : ''}
            </div>
            
            ${socialLinks.length > 0 ? `
              <div style="margin-top: 10px;">
                ${socialLinks.map(link => `
                  <a href="${link.url}" style="display: inline-block; margin-right: 8px; width: 20px; height: 20px;" target="_blank">
                    ${link.icon === 'linkedin' ? '💼' : link.icon === 'facebook' ? '📘' : '📷'}
                  </a>
                `).join('')}
              </div>
            ` : ''}
            
            ${data.includeBadge ? `
              <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e0e0e0;">
                <div style="display: inline-block; background: ${colors.accent}; color: white; padding: 4px 8px; border-radius: 3px; font-size: 10px; font-weight: bold;">
                  PACIFIC MARKET VERIFIED
                </div>
                <div style="margin-top: 5px; font-size: 10px; color: #666;">
                  <a href="https://pacificmarket.com" style="color: #666; text-decoration: none;" target="_blank">
                    Listed on Pacific Market
                  </a>
                </div>
              </div>
            ` : ''}
          </td>
        </tr>
      </table>
    </div>
  `;
}

export async function POST(request) {
  try {
    const { businessId, userId, signatureData, template = 'modern' } = await request.json();
    
    if (!businessId || !userId) {
      return Response.json({ error: 'Business ID and User ID are required' }, { status: 400 });
    }

    // Get business data using shared query
    const { data: business, error: businessError } = await getBusinessById(businessId);

    if (businessError || !business) {
      return Response.json({ error: businessError?.message || 'Business not found' }, { status: 404 });
    }

    // Verify user has access to this business
    if (business.owner_user_id !== userId) {
      return Response.json({ error: 'Unauthorized access to this business' }, { status: 403 });
    }

    // Generate signature HTML
    const html = generateSignatureHTML(signatureData, template, business);

    return Response.json({
      success: true,
      html,
      template,
      business: {
        name: business.name,
        logo_url: business.logo_url
      }
    });

  } catch (error) {
    console.error('Signature generation error:', error);
    return Response.json({ 
      error: 'Internal server error', 
      message: error.message 
    }, { status: 500 });
  }
}

// GET endpoint to show available templates
export async function GET() {
  return Response.json({
    templates: Object.entries(SIGNATURE_TEMPLATES).map(([key, template]) => ({
      id: key,
      name: template.name,
      colors: template.colors
    })),
    usage: {
      endpoint: "/api/signatures/generate",
      method: "POST",
      body: {
        businessId: "business-uuid",
        userId: "user-uuid",
        template: "modern",
        signatureData: {
          name: "John Doe",
          title: "Managing Director",
          email: "john@business.com",
          phone: "+64 21 123 456",
          website: "https://business.com",
          address: "123 Queen St, Auckland, New Zealand",
          linkedin: "https://linkedin.com/in/johndoe",
          facebook: "https://facebook.com/business",
          instagram: "https://instagram.com/business",
          includeLogo: true,
          includeBadge: true
        }
      }
    }
  });
}
