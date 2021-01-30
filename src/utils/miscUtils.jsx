import normalizeUrl from 'normalize-url';

export const getClearbitLogoURL = (SiteURL) => {
    if (!SiteURL || SiteURL.length <=0) return null;
    const normalizedAlexaURL = normalizeUrl(SiteURL, { stripProtocol: true });
    const clearbitLogoURL = "//logo.clearbit.com/" + normalizedAlexaURL;
    return clearbitLogoURL;
}