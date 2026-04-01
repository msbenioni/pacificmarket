import { Upload, X, Info, Crown } from "lucide-react";
import { SUBSCRIPTION_TIER } from "@/constants/unifiedConstants";
import { isPersistentMediaUrl } from "@/utils/mediaUrlUtils";
import { useMediaState } from "@/hooks/useMediaState";
import { DesktopBannerPreview, MobileBannerPreview } from "./BannerPreviews";
import { getBannerHelpText, getBannerGuideText } from "@/constants/bannerDimensions";

export default function BrandMediaSection({
  form,
  handleFileUpload,
  removeImage,
  logoInputId,
  bannerInputId,
  mobileBannerInputId,
  labelCls,
  subscriptionTier = SUBSCRIPTION_TIER.VAKA,
}) {
  const isVaka = subscriptionTier === SUBSCRIPTION_TIER.VAKA;
  const isManaOrMoana =
    subscriptionTier === SUBSCRIPTION_TIER.MANA ||
    subscriptionTier === SUBSCRIPTION_TIER.MOANA;

  // Use helper hook for each media preview with removal support
  const logoMediaState = useMediaState({ 
    file: form.logo_file, 
    persistedUrl: form.logo_url, 
    removeFlag: form.logo_remove 
  });
  
  const bannerMediaState = useMediaState({ 
    file: form.banner_file, 
    persistedUrl: form.banner_url, 
    removeFlag: form.banner_remove 
  });
  
  const mobileBannerMediaState = useMediaState({ 
    file: form.mobile_banner_file, 
    persistedUrl: form.mobile_banner_url, 
    removeFlag: form.mobile_banner_remove 
  });

  const hasPersistedLogo = isPersistentMediaUrl(form.logo_url, {
    allowRootRelative: false,
  });
  const isStarterLogo =
    !hasPersistedLogo &&
    isPersistentMediaUrl(form.logo_url, { allowRootRelative: true });

  const hasPersistedDesktopBanner = isPersistentMediaUrl(form.banner_url, {
    allowRootRelative: false,
  });
  const isStarterDesktopBanner =
    !hasPersistedDesktopBanner &&
    isPersistentMediaUrl(form.banner_url, { allowRootRelative: true });

  const hasPersistedMobileBanner = isPersistentMediaUrl(form.mobile_banner_url, {
    allowRootRelative: false,
  });
  const isStarterMobileBanner =
    !hasPersistedMobileBanner &&
    isPersistentMediaUrl(form.mobile_banner_url, { allowRootRelative: true });

  return (
    <div className="space-y-6">
      {/* Plan Info and Image Guide Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Plan Info */}
        <div
          className={`rounded-2xl border p-4 sm:p-5 ${
            isVaka
              ? "border-blue-200 bg-blue-50"
              : "border-emerald-200 bg-emerald-50"
          }`}
        >
          <div className="flex items-start gap-3">
            <Info
              className={`mt-0.5 h-4 w-4 flex-shrink-0 ${
                isVaka ? "text-blue-600" : "text-emerald-600"
              }`}
            />
            <div className="text-sm">
              <h4
                className={`mb-2 font-semibold ${
                  isVaka ? "text-blue-900" : "text-emerald-900"
                }`}
              >
                {isVaka ? "Starter branding included" : "Custom branding enabled"}
              </h4>

              {isVaka ? (
                <div className="space-y-1 text-blue-800">
                  <p>
                    We automatically create a professional starter logo and banner
                    set for your business so your profile looks polished from day
                    one.
                  </p>
                  <p>
                    Upgrade to <strong>Mana</strong> or <strong>Moana</strong> to
                    upload your own custom branding.
                  </p>
                </div>
              ) : (
                <div className="space-y-1 text-emerald-800">
                  <p>
                    Upload your own logo and banners to fully match your brand
                    across your profile, cards, and featured sections.
                  </p>
                  <p>
                    Until you upload your own images, your starter branding can be
                    used as a fallback.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Image Guide */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-600" />
            <div className="text-sm">
              <h4 className="mb-2 font-semibold text-slate-900">
                Image upload guide
              </h4>
              <div className="space-y-1 text-slate-700">
                <p>
                  <strong>Logo:</strong> 200×200px
                </p>
                <p>
                  <strong>Desktop banner:</strong> 1200×300px
                </p>
                <p>
                  <strong>Mobile banner:</strong> 400×160px
                </p>
                <p className="pt-1 text-xs text-slate-500">
                  PNG or JPG up to 5MB
                </p>
                <p className="pt-1 text-xs text-slate-500">
                  {isVaka
                    ? "These sizes are used for your starter branding."
                    : "For best results, upload images close to these sizes."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vaka: Starter Branding Only */}
      {isVaka && (
        <div className="space-y-6">
          {/* Logo */}
          <div>
            <div className="mb-2">
              <label className={labelCls}>Starter logo</label>
            </div>

            {logoMediaState.hasImage ? (
              <div className="inline-block overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
                <img
                  src={logoMediaState.displayUrl}
                  alt="Starter logo"
                  className="h-20 w-20 rounded-xl object-cover"
                />
              </div>
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white text-xs text-slate-500">
                No logo yet
              </div>
            )}

            <p className="mt-2 text-xs text-slate-500">
              Included with Vaka. Upgrade to Mana or Moana to upload your own
              logo.
            </p>
          </div>

          {/* Banners */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <div className="mb-2">
                <label className={labelCls}>Starter desktop banner</label>
              </div>

              {bannerMediaState.hasImage ? (
                <div className="inline-block overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
                  <img
                    src={bannerMediaState.displayUrl}
                    alt="Starter desktop banner"
                    className="h-32 w-64 rounded-xl object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-32 w-64 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white text-xs text-slate-500">
                  No desktop banner yet
                </div>
              )}

              <p className="mt-2 text-xs text-slate-500">
                {getBannerGuideText('desktop')}. Used in the business registry.
              </p>
            </div>

            <div>
              <div className="mb-2">
                <label className={labelCls}>Starter mobile banner</label>
              </div>

              {mobileBannerMediaState.hasImage ? (
                <div className="inline-block overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
                  <img
                    src={mobileBannerMediaState.displayUrl}
                    alt="Starter mobile banner"
                    className="h-24 w-48 rounded-xl object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-24 w-48 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white text-xs text-slate-500">
                  No mobile banner yet
                </div>
              )}

              <p className="mt-2 text-xs text-slate-500">
                {getBannerGuideText('mobile')}. Used for business cards and homepage features.
              </p>
            </div>
          </div>

          {/* Upgrade Card */}
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-3">
              <Crown className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
              <div className="text-sm">
                <h4 className="mb-1 font-semibold text-amber-900">
                  Want to use your own brand assets?
                </h4>
                <p className="text-amber-800">
                  Upgrade to <strong>Mana</strong> or <strong>Moana</strong> to
                  upload your own logo, desktop banner, and mobile banner.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mana / Moana: Upload Area */}
      {isManaOrMoana && (
        <div className="space-y-6">
          {/* All Uploads in One Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Logo Upload */}
            <UploadCard
              label="Logo"
              businessName={form.business_name || "Business"}
              displayUrl={logoMediaState.displayUrl}
              hasUnsavedFile={!!form.logo_file}
              isMarkedForRemoval={form.logo_remove}
              isStarterBranding={isStarterLogo}
              hasPersistedImage={hasPersistedLogo}
              inputId={logoInputId}
              onFileChange={(e) => handleFileUpload(e, "logo")}
              onRemove={() => removeImage("logo")}
              helpText="200×200px recommended"
            />

            {/* Desktop Banner Upload */}
            <UploadCard
              label="Desktop banner"
              businessName={form.business_name || "Business"}
              displayUrl={bannerMediaState.displayUrl}
              hasUnsavedFile={!!form.banner_file}
              isMarkedForRemoval={form.banner_remove}
              isStarterBranding={isStarterDesktopBanner}
              hasPersistedImage={hasPersistedDesktopBanner}
              inputId={bannerInputId}
              onFileChange={(e) => handleFileUpload(e, "banner")}
              onRemove={() => removeImage("banner")}
              helpText={getBannerHelpText('desktop')}
              bannerType="desktop"
              desktopBannerUrl={bannerMediaState.displayUrl}
              mobileBannerUrl={mobileBannerMediaState.displayUrl}
            />

            {/* Mobile Banner Upload */}
            <UploadCard
              label="Mobile banner"
              businessName={form.business_name || "Business"}
              displayUrl={mobileBannerMediaState.displayUrl}
              hasUnsavedFile={!!form.mobile_banner_file}
              isMarkedForRemoval={form.mobile_banner_remove}
              isStarterBranding={isStarterMobileBanner}
              hasPersistedImage={hasPersistedMobileBanner}
              inputId={mobileBannerInputId}
              onFileChange={(e) => handleFileUpload(e, "mobile_banner")}
              onRemove={() => removeImage("mobile_banner")}
              helpText={getBannerHelpText('mobile')}
              bannerType="mobile"
              desktopBannerUrl={bannerMediaState.displayUrl}
              mobileBannerUrl={mobileBannerMediaState.displayUrl}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function UploadCard({
  label,
  businessName,
  displayUrl,
  hasUnsavedFile,
  isMarkedForRemoval = false,
  isStarterBranding = false,
  hasPersistedImage = false,
  inputId,
  onFileChange,
  onRemove,
  helpText,
  imageClassName = "h-20 w-20 rounded-xl object-cover",
  bannerType = null, // 'desktop' | 'mobile' | 'featured' | null
  desktopBannerUrl = null,
  mobileBannerUrl = null,
}) {
  const hasImage = !!displayUrl && !isMarkedForRemoval;

  // Determine status from explicit state, matching actual visible behavior
  const getStatusInfo = () => {
    // Priority order: removal > pending replacement > persisted/starter > none
    if (isMarkedForRemoval) {
      return { 
        label: "Will be removed", 
        detail: "Image will be removed after save", 
        tone: "amber",
        canRemove: false // No undo - removal is final until save
      };
    }
    if (hasUnsavedFile) {
      return { 
        label: "New image ready", 
        detail: "Save to upload new image", 
        tone: "green",
        canRemove: true
      };
    }
    
    if (hasPersistedImage) {
      return { 
        label: "Current image", 
        detail: "Saved image", 
        tone: "green",
        canRemove: true
      };
    }
    
    if (isStarterBranding) {
      return { 
        label: "Using starter branding", 
        detail: "Default branding asset", 
        tone: "slate",
        canRemove: false // Starter assets not removable
      };
    }
    
    return { 
      label: "No image", 
      detail: "Upload an image to get started", 
      tone: "slate",
      canRemove: false
    };
  };

  const statusInfo = getStatusInfo();

  const getStatusColor = (tone) => {
    switch (tone) {
      case 'amber': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'green': return 'text-green-700 bg-green-50 border-green-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div>
      <div className="mb-2">
        <label className="text-sm font-medium text-slate-800">{label}</label>
      </div>

      <div className="space-y-3">
        {hasImage ? (
          <div className="relative inline-block overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
            {bannerType === 'desktop' ? (
              <DesktopBannerPreview 
                bannerUrl={desktopBannerUrl}
                businessName={businessName}
                className="!h-32 !w-64"
              />
            ) : bannerType === 'mobile' ? (
              <MobileBannerPreview 
                bannerUrl={desktopBannerUrl}
                mobileBannerUrl={mobileBannerUrl}
                businessName={businessName}
                className="!h-24 !w-48 !rounded-t-[12px]"
              />
            ) : (
              <img
                src={displayUrl}
                alt={label}
                className={imageClassName}
              />
            )}
            {statusInfo.canRemove && (
              <button
                type="button"
                onClick={onRemove}
                className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white transition-colors hover:bg-red-600 shadow-md"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        ) : (
          <label
            htmlFor={inputId}
            className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-8 text-center transition hover:border-slate-400 hover:bg-slate-50"
          >
            <Upload className="mb-2 h-5 w-5 text-slate-500" />
            <span className="text-sm font-medium text-slate-700">
              Upload {label.toLowerCase()}
            </span>
            <span className="mt-1 text-xs text-slate-500">{helpText}</span>
          </label>
        )}

        <input
          id={inputId}
          type="file"
          accept="image/png, image/jpeg, image/jpg, image/webp"
          onChange={onFileChange}
          className="hidden"
        />

        {hasImage && (
          <div className="space-y-2">
            {/* Status Badge */}
            <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getStatusColor(statusInfo.tone)}`}>
              {statusInfo.label}
            </div>

            {statusInfo.detail ? (
              <p className="text-xs text-slate-500">{statusInfo.detail}</p>
            ) : null}

            {/* Upload/Replace Button */}
            <label
              htmlFor={inputId}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <Upload className="h-4 w-4" />
              {hasImage ? `Choose new ${label.toLowerCase()}` : `Upload ${label.toLowerCase()}`}
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
