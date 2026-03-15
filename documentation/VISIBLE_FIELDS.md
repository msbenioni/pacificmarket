# 👁️ Public Profile Visible Fields

> **📅 Last Updated:** March 2026  
> **🎯 Current State:** Optimized public profile display after cleanup

---

## 📋 **Table of Contents**

1. [Visibility Overview](#visibility-overview)
2. [Business Profile Page](#business-profile-page)
3. [Registry/Grid View](#registrygrid-view)
4. [Portal/Management View](#portalmanagement-view)
5. [Field Visibility Rules](#field-visibility-rules)

---

## 🎯 **Visibility Overview**

### **✅ Public Data Principles**

The Pacific Market platform follows strict data privacy principles:

- **Customer-facing data** only displayed on public profiles
- **Privacy-sensitive data** restricted to owners/admins
- **Progressive disclosure** - More info on detailed profile page
- **User-controlled visibility** - Users choose what contact info to share

### **✅ Data Hierarchy**

1. **Essential Information** - Always visible (name, logo, description)
2. **Location Information** - Always visible (city, country, industry)
3. **Contact Information** - Visible when provided by user
4. **Detailed Information** - Visible on full profile page
5. **Internal Data** - Never visible publicly

---

## 🖥️ **Business Profile Page**

**Location:** `/BusinessProfile` - Full business profile page

### **✅ Header Section**

| Field | Display | Source | Notes |
|-------|---------|--------|-------|
| **logo_url** | Profile image | businesses.logo_url | Business logo |
| **banner_url** | Header banner | businesses.banner_url | Desktop banner |
| **mobile_banner_url** | Mobile banner | businesses.mobile_banner_url | Mobile banner |
| **name** | Main title | businesses.name | Business name |
| **tagline** | Subtitle | businesses.tagline | Short description |
| **description** | Full description | businesses.description | Long-form description |

### **✅ Verification & Status**

| Field | Display | Source | Condition |
|-------|---------|--------|----------|
| **is_verified** | "Verified" badge | businesses.is_verified | If verified |
| **status** | Status badge | businesses.status | Always visible |
| **subscription_tier** | Tier badge | businesses.subscription_tier | Management view only |

### **✅ Location & Identity**

| Field | Display | Source | Condition |
|-------|---------|--------|----------|
| **city** | Location badge | businesses.city | If provided |
| **country** | Location badge | businesses.country | If provided |
| **industry** | Industry badge | businesses.industry | If provided |
| **cultural_identity** | Culture badge | businesses.cultural_identity | If provided |

### **✅ Contact Information**

| Field | Display | Source | Condition |
|-------|---------|--------|----------|
| **contact_email** | Contact button | businesses.contact_email | If provided |
| **contact_phone** | Contact button | businesses.contact_phone | If provided |
| **contact_website** | Website link | businesses.contact_website | If provided |
| **business_hours** | Hours section | businesses.business_hours | If provided |

### **✅ Business Details**

| Field | Display | Source | Condition |
|-------|---------|--------|----------|
| **year_started** | Details section | businesses.year_started | If provided |
| **business_structure** | Details section | businesses.business_structure | If provided |
| **team_size_band** | Details section | businesses.team_size_band | If provided |
| **revenue_band** | Details section | businesses.revenue_band | If provided |

### **✅ Languages**

| Field | Display | Source | Condition |
|-------|---------|--------|----------|
| **languages_spoken** | Languages section | businesses.languages_spoken | If array has values |

### **✅ Social Links**

| Field | Display | Source | Condition |
|-------|---------|--------|----------|
| **social_links** | Social media links | businesses.social_links | If populated |

### **✅ Claim Status**

| Field | Display | Source | Condition |
|-------|---------|--------|----------|
| **claimed** | Claim section | businesses.claimed | Show claim form if false |
| **claimed_at** | Claim info | businesses.claimed_at | If claimed |
| **claimed_by** | Claim info | businesses.claimed_by | If claimed |

---

## 🗂️ **Registry/Grid View**

**Location:** Registry page - Grid/list view of all businesses

### **✅ Grid View (Compact)**

| Field | Display | Source | Notes |
|-------|---------|--------|-------|
| **name** | Card title | businesses.name | Business name |
| **tagline** | Description | businesses.tagline | Short description |
| **logo_url** | Card image | businesses.logo_url | Business logo |
| **city** | Location | businesses.city | City name |
| **country** | Location | businesses.country | Country name |
| **industry** | Industry | businesses.industry | Industry category |
| **is_verified** | Verification icon | businesses.is_verified | Green checkmark |
| **business_handle** | Link URL | businesses.business_handle | Profile link |

### **✅ List View (Expanded)**

| Field | Display | Source | Notes |
|-------|---------|--------|-------|
| **name** | List title | businesses.name | Business name |
| **tagline** | Description | businesses.tagline | Short description |
| **description** | Description | businesses.description | Full description |
| **logo_url** | List image | businesses.logo_url | Business logo |
| **city** | Location | businesses.city | City name |
| **country** | Location | businesses.country | Country name |
| **industry** | Industry | businesses.industry | Industry category |
| **is_verified** | Verification icon | businesses.is_verified | Green checkmark |
| **business_handle** | Link URL | businesses.business_handle | Profile link |

---

## 🔧 **Portal/Management View**

**Location:** User portal - Business management cards

### **✅ Management Card View**

| Field | Display | Source | Notes |
|-------|---------|--------|-------|
| **name** | Card title | businesses.name | Business name |
| **tagline** | Summary text | businesses.tagline | Short description |
| **city** | Summary text | businesses.city | Location info |
| **country** | Summary text | businesses.country | Location info |
| **industry** | Summary text | businesses.industry | Industry info |
| **logo_url** | Card image | businesses.logo_url | Business logo |
| **is_verified** | Verification badge | businesses.is_verified | Green badge |
| **status** | Status badge | businesses.status | Active/draft/pending |
| **subscription_tier** | Tier label | businesses.subscription_tier | Subscription level |
| **business_handle** | Link URL | businesses.business_handle | Profile link |

---

## 📋 **Field Visibility Rules**

### **✅ Always Visible (Public)**

| Field | Table | Display Context |
|-------|-------|----------------|
| **name** | businesses | All views |
| **logo_url** | businesses | All views |
| **description/tagline** | businesses | All views |
| **city** | businesses | All views |
| **country** | businesses | All views |
| **industry** | businesses | All views |
| **is_verified** | businesses | All views |
| **status** | businesses | Management view only |

### **✅ Conditionally Visible (User-Controlled)**

| Field | Table | Condition | Display Context |
|-------|-------|-----------|----------------|
| **contact_email** | businesses | If provided | Profile page |
| **contact_phone** | businesses | If provided | Profile page |
| **contact_website** | businesses | If provided | Profile page |
| **business_hours** | businesses | If provided | Profile page |
| **languages_spoken** | businesses | If array has values | Profile page |
| **cultural_identity** | businesses | If specified | Profile page |
| **social_links** | businesses | If populated | Profile page |
| **team_size_band** | businesses | If provided | Profile page |
| **revenue_band** | businesses | If provided | Profile page |
| **year_started** | businesses | If provided | Profile page |
| **business_structure** | businesses | If provided | Profile page |

### **❌ Never Visible Publicly**

| Field | Table | Reason |
|-------|-------|--------|
| **business_owner** | businesses | Privacy |
| **business_owner_email** | businesses | Privacy |
| **additional_owner_emails** | businesses | Privacy |
| **private_business_phone** | business_insights | Privacy |
| **private_business_email** | business_insights | Privacy |
| **business_stage** | business_insights | Internal |
| **top_challenges_array** | business_insights | Internal |
| **is_business_registered** | business_insights | Internal |
| **All founder_insights fields** | founder_insights | Privacy |

---

## 🔒 **Privacy & Security**

### **✅ Data Protection**

- **Personal Information** - Owner details never exposed publicly
- **Contact Information** - Only public contact info shown
- **Financial Data** - Revenue and employee data private
- **Internal Metrics** - Business insights not public
- **Founder Data** - Personal founder information private

### **✅ User Control**

- **Contact Information** - Users choose what to share publicly
- **Business Details** - Users control level of detail
- **Profile Visibility** - Users can control profile visibility
- **Data Updates** - Users can update or remove public information

### **✅ System Controls**

- **RLS Policies** - Row-level security for data access
- **Field Selection** - Only public fields queried for display
- **Validation** - Server-side validation of all public data
- **Audit Trail** - Track all data access and changes

---

## 📊 **Display Optimization**

### **✅ Progressive Disclosure**

1. **Registry View** - Essential information only
2. **Profile Page** - Complete business information
3. **Contact Modal** - Detailed contact information
4. **Management Portal** - Administrative details

### **✅ Performance Optimization**

- **Lazy Loading** - Images and details loaded on demand
- **Caching** - Profile data cached for better performance
- **Field Selection** - Only query necessary fields
- **Image Optimization** - Optimized image loading and serving

### **✅ User Experience**

- **Mobile Responsive** - Optimized for all screen sizes
- **Fast Loading** - Optimized for quick page loads
- **Intuitive Navigation** - Easy access to business information
- **Clear Information Hierarchy** - Most important information prominent

---

## 🎨 **UI Components**

### **✅ Profile Header**

```jsx
<ProfileHeader>
  <BusinessLogo src={business.logo_url} />
  <BusinessInfo>
    <BusinessName>{business.name}</BusinessName>
    <VerificationBadge verified={business.is_verified} />
    <BusinessTagline>{business.tagline}</BusinessTagline>
  </BusinessInfo>
  <ContactActions>
    <ContactButton email={business.contact_email} />
    <WebsiteButton url={business.contact_website} />
  </ContactActions>
</ProfileHeader>
```

### **✅ Location Badges**

```jsx
<LocationBadges>
  <LocationBadge icon={<MapPin />}>
    {business.city}, {business.country}
  </LocationBadge>
  <IndustryBadge>{business.industry}</IndustryBadge>
  <CultureBadge>{business.cultural_identity}</CultureBadge>
</LocationBadges>
```

### **✅ Contact Modal**

```jsx
<ContactModal>
  <ContactInfo>
    <EmailField email={business.contact_email} />
    <PhoneField phone={business.contact_phone} />
    <WebsiteField website={business.contact_website} />
    <HoursField hours={business.business_hours} />
  </ContactInfo>
</ContactModal>
```

---

## 📈 **Analytics & Tracking**

### **✅ Profile Views**

- **View Tracking** - Track profile views and engagement
- **Contact Clicks** - Track contact information access
- **Search Impressions** - Track search visibility
- **User Engagement** - Track time spent on profiles

### **✅ Data Insights**

- **Popular Fields** - Most viewed business information
- **Contact Patterns** - How users access contact information
- **Search Behavior** - What information drives engagement
- **Conversion Metrics** - Profile views to contact actions

---

## 📞 **Visibility Support**

### **✅ Common Issues**

**Missing Information:**
- Check if user has provided the information
- Verify field mapping in database queries
- Confirm privacy settings

**Display Problems:**
- Check responsive design for different screen sizes
- Verify image loading and optimization
- Confirm data formatting and display

**Privacy Concerns:**
- Review RLS policies for data access
- Check field selection in public queries
- Verify user permission settings

### **✅ Troubleshooting**

**Field Not Showing:**
1. Check if field exists in database
2. Verify field mapping in queries
3. Confirm user has provided data
4. Check visibility rules and permissions

**Performance Issues:**
1. Optimize image sizes and loading
2. Implement caching strategies
3. Reduce field selection in queries
4. Optimize component rendering

**Privacy Issues:**
1. Review RLS policy configurations
2. Check field access permissions
3. Verify data sanitization
4. Audit public query results

---

## 🎉 **Current State**

**✅ Completed:**
- Field visibility optimization and cleanup
- Privacy controls and data protection
- Progressive disclosure implementation
- Performance optimization for profile display
- Mobile-responsive design implementation

**✅ Result:**
- **Better User Privacy** - Sensitive data properly protected
- **Improved Performance** - Faster profile loading and display
- **Enhanced User Experience** - Clear information hierarchy
- **Mobile Optimization** - Works well on all devices
- **Data Security** - Proper access controls and validation

**This visible fields documentation reflects the current optimized public profile display of the Pacific Market platform.** 🎯
