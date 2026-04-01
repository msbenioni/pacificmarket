export function createPageUrl(pageName) {
    // Special cases to preserve case
    if (pageName === "BusinessPortal") {
        return '/BusinessPortal';
    }
    if (pageName === "BusinessProfile") {
        return '/BusinessProfile';
    }
    return '/' + pageName.toLowerCase().replace(/ /g, '-');
}
