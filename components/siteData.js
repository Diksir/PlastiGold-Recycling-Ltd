import {
  defaultContent,
  googleMapsEmbedForContact,
  googleMapsUrlForContact,
  mapQueryFromContact,
  mergeContent,
  whatsappUrlForContact,
} from '@/lib/defaultContent';

export { defaultContent, googleMapsEmbedForContact, googleMapsUrlForContact, mapQueryFromContact, mergeContent, whatsappUrlForContact };

export const navItems = defaultContent.navItems;
export const services = defaultContent.services;
export const impactStats = defaultContent.impactStats;
export const partners = ['Manufacturers', 'Local Collectors', 'Community Groups', 'Industrial Buyers'];
export const processSteps = defaultContent.processSteps;
export const mapQuery = encodeURIComponent(mapQueryFromContact(defaultContent.contact));
export const googleMapsUrl = googleMapsUrlForContact(defaultContent.contact);
export const whatsappUrl = whatsappUrlForContact(defaultContent.contact);
export const tokenKey = 'plastigold_admin_token';
