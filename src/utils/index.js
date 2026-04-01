export function createPageUrl(pageName) {
    // Special cases to preserve case for PascalCase routes
    const pascalCasePages = [
        "About",
        "Accessibility",
        "AdminDashboard",
        "AdminLogin",
        "BusinessProfile",
        "BusinessLogin",
        "BusinessPortal",
        "Contact",
        "Cookies",
        "Data",
        "Guidelines",
        "Help",
        "Home",
        "InvoiceGenerator",
        "Pricing",
        "Privacy",
        "ProfileSettings",
        "QRCodeGenerator",
        "PacificBusinesses",
        "Terms",
        "Tools"
    ];
    
    if (pascalCasePages.includes(pageName)) {
        return '/' + pageName;
    }
    
    return '/' + pageName.toLowerCase().replace(/ /g, '-');
}
