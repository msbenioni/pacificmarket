// Signature generation utilities extracted from EmailSignatureGenerator
// Used by both the generator and Tools landing page

const SIGNATURE_TEMPLATES = {
  modern: {
    id: "modern",
    name: "Modern",
    description: "Clean and professional",
    colors: {
      primary: "#0a1628",
      secondary: "#0d4f4f",
      accent: "#00c4cc",
      text: "#0f172a",
    },
  },
  pacific: {
    id: "pacific",
    name: "Pacific",
    description: "Pacific Discovery Network inspired",
    colors: {
      primary: "#0a1628",
      secondary: "#c9a84c",
      accent: "#00c4cc",
      text: "#0f172a",
    },
  },
  minimal: {
    id: "minimal",
    name: "Minimal",
    description: "Simple and understated",
    colors: {
      primary: "#333333",
      secondary: "#666666",
      accent: "#0d4f4f",
      text: "#222222",
    },
  },
};

// Helper function to escape HTML (server-safe)
export function escapeHtml(text) {
  if (!text) return "";
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Helper function to normalize URLs
export function normalizeUrl(url) {
  if (!url) return "";
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return `https://${url}`;
  }
  return url;
}

// Main signature HTML generation function
export function generateSignatureHTML(signature) {
  const template = SIGNATURE_TEMPLATES[signature.template] || SIGNATURE_TEMPLATES.modern;

  const primary = signature.brand_primary || template.colors.primary;
  const secondary = signature.brand_secondary || template.colors.secondary;
  const accent = signature.brand_accent || template.colors.accent;
  const text = signature.text_color || template.colors.text;

  const logoCell = signature.include_logo && signature.logo_url
    ? `
      <td style="vertical-align: top; padding-right: 18px; width: 92px;">
        <img
          src="${escapeHtml(signature.logo_url)}"
          alt="${escapeHtml(signature.business_name || "Business Logo")}"
          style="display:block; width:80px; max-width:80px; height:auto; max-height:80px; object-fit:contain; border-radius:10px;"
        />
      </td>
    `
    : "";

  const socials = [];
  if (signature.include_socials && signature.linkedin) {
    socials.push(`
      <a href="${escapeHtml(normalizeUrl(signature.linkedin))}" target="_blank" style="text-decoration:none; margin-right:8px; color:${accent}; font-size:12px;">LinkedIn</a>
    `);
  }
  if (signature.include_socials && signature.facebook) {
    socials.push(`
      <a href="${escapeHtml(normalizeUrl(signature.facebook))}" target="_blank" style="text-decoration:none; margin-right:8px; color:${accent}; font-size:12px;">Facebook</a>
    `);
  }
  if (signature.include_socials && signature.instagram) {
    socials.push(`
      <a href="${escapeHtml(normalizeUrl(signature.instagram))}" target="_blank" style="text-decoration:none; margin-right:8px; color:${accent}; font-size:12px;">Instagram</a>
    `);
  }
  if (signature.include_socials && signature.tiktok) {
    socials.push(`
      <a href="${escapeHtml(normalizeUrl(signature.tiktok))}" target="_blank" style="text-decoration:none; margin-right:8px; color:${accent}; font-size:12px;">TikTok</a>
    `);
  }

  const nameLine = `
    <div style="margin-bottom:6px;">
      <div style="font-size:18px; line-height:1.25; font-weight:700; color:${primary};">
        ${escapeHtml(signature.full_name || "Your Name")}
      </div>
      ${
        signature.include_pronouns && signature.pronouns
          ? `<div style="font-size:11px; color:${secondary}; margin-top:2px;">${escapeHtml(
              signature.pronouns
            )}</div>`
          : ""
      }
    </div>
  `;

  const roleLine =
    signature.job_title || signature.department
      ? `
      <div style="font-size:13px; line-height:1.4; color:${secondary}; margin-bottom:2px;">
        ${escapeHtml(signature.job_title || "")}
        ${
          signature.job_title && signature.department
            ? ` <span style="color:#94a3b8;">|</span> `
            : ""
        }
        ${escapeHtml(signature.department || "")}
      </div>
    `
      : "";

  const businessLine = signature.business_name
    ? `
      <div style="font-size:13px; line-height:1.4; color:${secondary}; font-weight:600; margin-bottom:10px;">
        ${escapeHtml(signature.business_name)}
      </div>
    `
    : "";

  const contactRows = `
    ${
      signature.email
        ? `
      <div style="margin:3px 0; font-size:13px; color:${text};">
        <span style="color:${accent}; font-weight:700;">Email:</span>
        <a href="mailto:${escapeHtml(signature.email)}" style="color:${text}; text-decoration:none;"> ${escapeHtml(signature.email)}</a>
      </div>
    `
        : ""
    }

    ${
      signature.phone
        ? `
      <div style="margin:3px 0; font-size:13px; color:${text};">
        <span style="color:${accent}; font-weight:700;">Phone:</span>
        <a href="tel:${escapeHtml(signature.phone)}" style="color:${text}; text-decoration:none;"> ${escapeHtml(signature.phone)}</a>
      </div>
    `
        : ""
    }

    ${
      signature.website
        ? `
      <div style="margin:3px 0; font-size:13px; color:${text};">
        <span style="color:${accent}; font-weight:700;">Web:</span>
        <a href="${escapeHtml(normalizeUrl(signature.website))}" target="_blank" style="color:${text}; text-decoration:none;"> ${escapeHtml(signature.website)}</a>
      </div>
    `
        : ""
    }

    ${
      signature.include_address && signature.address
        ? `
      <div style="margin:3px 0; font-size:13px; color:${text};">
        <span style="color:${accent}; font-weight:700;">Address:</span>
        <span> ${escapeHtml(signature.address)}</span>
      </div>
    `
        : ""
    }
  `;

  const badgeBlock = signature.include_badge
    ? `
      <div style="margin-top:14px; padding-top:12px; border-top:1px solid #e5e7eb;">
        <span style="display:inline-block; background:${accent}; color:#ffffff; font-size:10px; font-weight:700; letter-spacing:0.04em; padding:5px 8px; border-radius:999px;">
          PACIFIC DISCOVERY NETWORK VERIFIED
        </span>
        <div style="margin-top:6px; font-size:10px; color:#64748b;">
          Listed on <a href="https://pacificdiscoverynetwork.com" target="_blank" style="color:#64748b; text-decoration:none;">Pacific Discovery Network</a>
        </div>
      </div>
    `
    : "";

  const disclaimerBlock = signature.disclaimer
    ? `
      <div style="margin-top:12px; font-size:10px; line-height:1.45; color:#64748b;">
        ${escapeHtml(signature.disclaimer)}
      </div>
    `
    : "";

  return `
    <div style="font-family: Arial, Helvetica, sans-serif; margin:0; padding:18px 0; max-width:640px;">
      <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; width:100%; max-width:640px;">
        <tr>
          ${logoCell}
          <td style="vertical-align:top;">
            ${nameLine}
            ${roleLine}
            ${businessLine}

            <div style="margin-bottom:10px;">
              ${contactRows}
            </div>

            ${
              socials.length > 0
                ? `
              <div style="margin-top:8px;">
                ${socials.join("")}
              </div>
            `
                : ""
            }

            ${badgeBlock}
            ${disclaimerBlock}
          </td>
        </tr>
      </table>
    </div>
  `;
}

// Text-only signature generation
export function generateSignatureText(signature) {
  let text = "";

  if (signature.full_name) text += `${signature.full_name}\n`;
  if (signature.job_title || signature.department) {
    text += `${signature.job_title || ""}${
      signature.job_title && signature.department ? " | " : ""
    }${signature.department || ""}\n`;
  }
  if (signature.business_name) text += `${signature.business_name}\n`;

  text += "\n";

  if (signature.email) text += `Email: ${signature.email}\n`;
  if (signature.phone) text += `Phone: ${signature.phone}\n`;
  if (signature.website) text += `Web: ${signature.website}\n`;
  if (signature.include_address && signature.address) {
    text += `Address: ${signature.address}\n`;
  }

  if (signature.include_socials) {
    const socialLinks = [];
    if (signature.linkedin) socialLinks.push(`LinkedIn: ${signature.linkedin}`);
    if (signature.facebook) socialLinks.push(`Facebook: ${signature.facebook}`);
    if (signature.instagram) socialLinks.push(`Instagram: ${signature.instagram}`);
    if (signature.tiktok) socialLinks.push(`TikTok: ${signature.tiktok}`);
    
    if (socialLinks.length > 0) {
      text += "\n" + socialLinks.join("\n");
    }
  }

  if (signature.include_badge) {
    text += "\nPacific Discovery Network Verified Business";
  }

  if (signature.disclaimer) {
    text += "\n\n" + signature.disclaimer;
  }

  return text;
}
