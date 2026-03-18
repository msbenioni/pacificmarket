export function createPageUrl(pageName) {
    // Special case for BusinessPortal to preserve case
    if (pageName === "BusinessPortal") {
        return '/BusinessPortal';
    }
    return '/' + pageName.toLowerCase().replace(/ /g, '-');
}
