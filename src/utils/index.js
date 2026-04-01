export function createPageUrl(pageName) {
    // Special cases to preserve case for PascalCase routes
    const pascalCasePages = [
        "BusinessPortal",
        "BusinessProfile", 
        "BusinessLogin",
        "PacificBusinesses",
        "AdminDashboard",
        "AdminLogin",
        "ProfileSettings",
        "InvoiceGenerator",
        "QRCodeGenerator"
    ];
    
    if (pascalCasePages.includes(pageName)) {
        return '/' + pageName;
    }
    
    return '/' + pageName.toLowerCase().replace(/ /g, '-');
}
