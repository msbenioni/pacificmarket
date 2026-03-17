import { Upload, X, Info, Crown } from "lucide-react";
import { SUBSCRIPTION_TIER } from "@/constants/unifiedConstants";

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

  const canUploadImages = isManaOrMoana;

  const displayLogoUrl =
    form.logo_url || form.generated_logo_url || "";

  const displayDesktopBannerUrl =
    form.banner_url || form.generated_banner_url || "";

  const displayMobileBannerUrl =
    form.mobile_banner_url || form.generated_mobile_banner_url || "";

  const displayCardBannerUrl =
    form.mobile_banner_url ||
    form.banner_url ||
    form.generated_mobile_banner_url ||
    form.generated_banner_url ||
    "";

  const hasAnyBranding =
    !!displayLogoUrl || !!displayDesktopBannerUrl || !!displayMobileBannerUrl;

  return (
    <div className="space-y-6">
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

      {/* Vaka: Starter Branding Only */}
      {isVaka && (
        <div className="space-y-6">
          {/* Logo */}
          <div>
            <div className="mb-2">
              <label className={labelCls}>Starter logo</label>
            </div>

            {displayLogoUrl ? (
              <div className="inline-block overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
                <img
                  src={displayLogoUrl}
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

              {displayDesktopBannerUrl ? (
                <div className="inline-block overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
                  <img
                    src={displayDesktopBannerUrl}
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
                Used in the business registry.
              </p>
            </div>

            <div>
              <div className="mb-2">
                <label className={labelCls}>Starter mobile banner</label>
              </div>

              {displayMobileBannerUrl ? (
                <div className="inline-block overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
                  <img
                    src={displayMobileBannerUrl}
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
                Used for business cards and homepage features.
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
          {/* Logo Upload */}
          <UploadCard
            label="Logo"
            imageUrl={form.logo_url}
            fallbackUrl={form.generated_logo_url}
            inputId={logoInputId}
            onFileChange={(e) => handleFileUpload(e, "logo")}
            onRemove={() => removeImage("logo")}
            helpText="200×200px recommended"
          />

          {/* Banner Uploads */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <UploadCard
              label="Desktop banner"
              imageUrl={form.banner_url}
              fallbackUrl={form.generated_banner_url}
              inputId={bannerInputId}
              onFileChange={(e) => handleFileUpload(e, "banner")}
              onRemove={() => removeImage("banner")}
              helpText="1200×300px recommended"
              imageClassName="h-32 w-64 rounded-xl object-cover"
            />

            <UploadCard
              label="Mobile banner"
              imageUrl={form.mobile_banner_url}
              fallbackUrl={form.generated_mobile_banner_url}
              inputId={mobileBannerInputId}
              onFileChange={(e) => handleFileUpload(e, "mobile_banner")}
              onRemove={() => removeImage("mobile_banner")}
              helpText="400×160px recommended"
              imageClassName="h-24 w-48 rounded-xl object-cover"
            />
          </div>
        </div>
      )}

      {/* Brand Preview */}
      {hasAnyBranding && (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-slate-900">Brand preview</h4>
            <p className="text-sm text-slate-500">
              See how your branding appears across the platform.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Business Card Preview */}
            <div>
              <h5 className="mb-2 text-sm font-medium text-slate-700">
                Business card
              </h5>
              <div className="max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="relative h-40 bg-gradient-to-br from-slate-100 via-slate-50 to-[#eef6f6]">
                  {displayCardBannerUrl ? (
                    <img
                      src={displayCardBannerUrl}
                      alt="Business card preview"
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="p-4">
                  <div className="text-xs text-slate-500">
                    Industry • Location
                  </div>
                  <div className="mt-1 text-xs text-slate-600">
                    Brief business description...
                  </div>
                </div>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Uses mobile banner first, then desktop fallback.
              </p>
            </div>

            {/* Homepage Featured Preview */}
            <div>
              <h5 className="mb-2 text-sm font-medium text-slate-700">
                Homepage featured
              </h5>
              <div className="max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="relative h-40 bg-gradient-to-br from-[#0d4f4f] to-[#1a6b6b]">
                  {displayCardBannerUrl ? (
                    <img
                      src={displayCardBannerUrl}
                      alt="Homepage featured preview"
                      className="absolute inset-0 h-full w-full object-cover"
                      style={{ objectPosition: "center top" }}
                    />
                  ) : null}
                </div>

                <div className="bg-white p-4">
                  <div className="flex items-center gap-2">
                    {displayLogoUrl ? (
                      <img
                        src={displayLogoUrl}
                        alt="Business logo"
                        className="h-8 w-8 rounded-lg border border-slate-200 object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-lg border border-slate-200 bg-slate-200" />
                    )}

                    <div className="flex-1">
                      <h6 className="text-sm font-semibold text-slate-900">
                        Business Name
                      </h6>
                      <p className="text-xs text-slate-500">
                        Industry • Location
                      </p>
                    </div>
                  </div>

                  <p className="mt-2 line-clamp-2 text-xs text-slate-600">
                    Brief business description for featured spotlight...
                  </p>
                </div>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Uses mobile banner first, then desktop fallback.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-start gap-3">
              <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
              <div className="text-sm text-blue-900">
                <p className="mb-1 font-semibold">Brand placement</p>
                <div className="space-y-1 text-xs text-blue-800">
                  <p>
                    <strong>Business card:</strong> uses mobile banner first,
                    then desktop fallback
                  </p>
                  <p>
                    <strong>Homepage featured:</strong> uses mobile banner
                    first, then desktop fallback
                  </p>
                  <p>
                    <strong>Business registry:</strong> uses desktop banner
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function UploadCard({
  label,
  imageUrl,
  fallbackUrl,
  inputId,
  onFileChange,
  onRemove,
  helpText,
  imageClassName = "h-20 w-20 rounded-xl object-cover",
}) {
  const displayUrl = imageUrl || fallbackUrl || "";
  const isUsingFallback = !imageUrl && !!fallbackUrl;

  return (
    <div>
      <div className="mb-2">
        <label className="text-sm font-medium text-slate-800">{label}</label>
      </div>

      <div className="space-y-3">
        {displayUrl ? (
          <div className="relative inline-block overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
            <img
              src={displayUrl}
              alt={label}
              className={imageClassName}
            />
            {imageUrl && (
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

        {displayUrl && (
          <div className="space-y-1">
            {isUsingFallback ? (
              <p className="text-xs text-slate-500">
                Using starter branding until you upload your own image.
              </p>
            ) : (
              <p className="text-xs text-slate-500">{helpText}</p>
            )}

            <label
              htmlFor={inputId}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <Upload className="h-4 w-4" />
              {imageUrl ? `Replace ${label.toLowerCase()}` : `Upload ${label.toLowerCase()}`}
            </label>
          </div>
        )}
      </div>
    </div>
  );
}