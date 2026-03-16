import { Upload, X, Info, Lock, Crown } from "lucide-react";
import { getBannerUrl, hasMobileBanner, hasBanner } from '@/utils/bannerUtils';
import { SUBSCRIPTION_TIER } from "@/constants/unifiedConstants";

export default function BrandMediaSection({ 
  form, 
  handleInputChange, 
  handleFileUpload, 
  removeImage, 
  logoInputId, 
  bannerInputId,
  mobileBannerInputId,
  inputCls, 
  labelCls,
  subscriptionTier = SUBSCRIPTION_TIER.VAKA,
  onUpgrade
}) {
  const canUploadImages = subscriptionTier === SUBSCRIPTION_TIER.MANA || subscriptionTier === SUBSCRIPTION_TIER.MOANA;
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Image Size Guidelines */}
      <div className="rounded-xl bg-green-50 border border-green-200 p-3 sm:p-4">
        <div className="flex items-start gap-2">
          <Info className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600 mt-0.5 flex-shrink-0" />
          <div className="text-xs sm:text-sm">
            <h4 className="font-medium text-green-900 mb-1 sm:mb-2">Image Upload Guide</h4>
            <div className="space-y-0.5 sm:space-y-1 text-green-700">
              <p><strong>Logo:</strong> 200×200px (square, for profile cards & listings)</p>
              <p><strong>Desktop Banner:</strong> 1200×300px (wide, for business registry)</p>
              <p><strong>Mobile Banner:</strong> 400×160px (perfect for business cards & homepage)</p>
              <p className="text-[10px] sm:text-xs">All images: PNG, JPG up to 5MB</p>
            </div>
          </div>
        </div>
      </div>

      {/* Logo Upload */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className={labelCls}>Business Logo</label>
          {!canUploadImages && (
            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800 border border-amber-200">
              <Lock className="h-3 w-3" />
              Vaka Plan
            </span>
          )}
        </div>
        <div className="mt-2 space-y-3">
          {form.logo_url ? (
            <div className="relative inline-block">
              <img
                src={form.logo_url}
                alt="Business logo"
                className="h-20 w-20 rounded-xl object-cover border border-slate-200"
              />
              {canUploadImages && (
                <button
                  type="button"
                  onClick={() => removeImage("logo")}
                  className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          ) : (
            <div>
              <input
                id={logoInputId}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, "logo")}
                className="hidden"
                disabled={!canUploadImages}
              />
              <label
                htmlFor={logoInputId}
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${
                  canUploadImages 
                    ? 'cursor-pointer border-slate-300 bg-white text-slate-700 hover:bg-slate-50' 
                    : 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400'
                }`}
              >
                <Upload className="h-4 w-4" />
                {canUploadImages ? 'Upload Logo' : 'Auto-generated Logo'}
              </label>
              <p className={`mt-2 text-xs ${canUploadImages ? 'text-slate-500' : 'text-slate-400'}`}>
                {canUploadImages 
                  ? '200×200px recommended, PNG/JPG up to 5MB'
                  : 'Professional logo will be auto-generated from your business name'
                }
              </p>
              {!canUploadImages && (
                <div className="mt-2 rounded-lg bg-amber-50 border border-amber-200 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-xs text-amber-800 font-medium">
                        <strong>Upgrade to unlock custom branding</strong>
                      </p>
                      <p className="text-xs text-amber-700 mt-1">
                        Upload your own logo and banners with Mana or Moana plans
                      </p>
                    </div>
                    {onUpgrade && (
                      <button
                        type="button"
                        onClick={onUpgrade}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition-colors"
                      >
                        <Crown className="h-3 w-3" />
                        Upgrade
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Banner Uploads - Side by side on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Desktop Banner Upload */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className={labelCls}>Desktop Banner (Business Registry)</label>
            {!canUploadImages && (
              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                <Lock className="h-3 w-3" />
                Vaka Plan
              </span>
            )}
          </div>
          <div className="mt-2 space-y-3">
            {form.banner_url ? (
              <div className="relative inline-block">
                <img
                  src={form.banner_url}
                  alt="Business banner"
                  className="h-32 w-64 rounded-xl object-cover border border-slate-200"
                />
                {canUploadImages && (
                  <button
                    type="button"
                    onClick={() => removeImage("banner")}
                    className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            ) : (
              <div>
                <input
                  id={bannerInputId}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "banner")}
                  className="hidden"
                  disabled={!canUploadImages}
                />
                <label
                  htmlFor={bannerInputId}
                  className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${
                    canUploadImages 
                      ? 'cursor-pointer border-slate-300 bg-white text-slate-700 hover:bg-slate-50' 
                      : 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400'
                  }`}
                >
                  <Upload className="h-4 w-4" />
                  {canUploadImages ? 'Upload Desktop Banner' : 'Auto-generated Banner'}
                </label>
                <p className={`mt-2 text-xs ${canUploadImages ? 'text-slate-500' : 'text-slate-400'}`}>
                  {canUploadImages 
                    ? '1200×300px recommended, PNG/JPG up to 5MB'
                    : 'Professional banner will be auto-generated with your business name'
                  }
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Banner Upload */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className={labelCls}>Mobile Banner (Business Cards & Homepage)</label>
            {!canUploadImages && (
              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                <Lock className="h-3 w-3" />
                Vaka Plan
              </span>
            )}
          </div>
          <div className="mt-2 space-y-3">
            {form.mobile_banner_url ? (
              <div className="relative inline-block">
                <img
                  src={form.mobile_banner_url}
                  alt="Mobile business banner"
                  className="h-24 w-48 rounded-xl object-cover border border-slate-200"
                />
                {canUploadImages && (
                  <button
                    type="button"
                    onClick={() => removeImage("mobile_banner")}
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            ) : (
              <div>
                <input
                  id={mobileBannerInputId}
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/gif, image/webp"
                  onChange={(e) => handleFileUpload(e, "mobile_banner")}
                  className="hidden"
                  disabled={!canUploadImages}
                />
                <label
                  htmlFor={mobileBannerInputId}
                  className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${
                    canUploadImages 
                      ? 'cursor-pointer border-slate-300 bg-white text-slate-700 hover:bg-slate-50' 
                      : 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400'
                  }`}
                >
                  <Upload className="h-4 w-4" />
                  {canUploadImages ? 'Upload Mobile Banner' : 'Auto-generated Mobile Banner'}
                </label>
                <p className={`mt-2 text-xs ${canUploadImages ? 'text-slate-500' : 'text-slate-400'}`}>
                  {canUploadImages 
                    ? '400×160px perfect fit, PNG/JPG up to 5MB'
                    : 'Mobile-optimized banner will be auto-generated'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Banner Preview Section */}
      {(form.logo_url || form.banner_url || form.mobile_banner_url) && (
        <div className="space-y-4">
          <h4 className="font-medium text-slate-900">Live Preview: Your Banners in Action</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Business Card Preview */}
            <div>
              <h5 className="text-sm font-medium text-slate-700 mb-2">Business Card (Portal)</h5>
              <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm max-w-sm">
                <div className="relative h-40 bg-gradient-to-br from-slate-100 via-slate-50 to-[#eef6f6]">
                  {getBannerUrl(form) && (
                    <img
                      src={getBannerUrl(form)}
                      alt="Business card preview"
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="p-3">
                  <div className="text-xs text-slate-500">Industry • Location</div>
                  <div className="text-xs text-slate-600 mt-1">Brief business description...</div>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {hasMobileBanner(form) ? "Uses mobile banner" : "Uses desktop banner as fallback"}
              </p>
            </div>

            {/* Homepage Featured Preview */}
            <div>
              <h5 className="text-sm font-medium text-slate-700 mb-2">Homepage Featured</h5>
              <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm max-w-sm">
                <div className="relative h-40 bg-gradient-to-br from-[#0d4f4f] to-[#1a6b6b] rounded-t-2xl">
                  {getBannerUrl(form) && (
                    <img
                      src={getBannerUrl(form)}
                      alt="Homepage featured preview"
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{ objectPosition: "center top" }}
                    />
                  )}
                </div>
                <div className="p-4 bg-white">
                  <div className="flex items-center gap-2">
                    {form.logo_url ? (
                      <img
                        src={form.logo_url}
                        alt="Business logo"
                        className="h-8 w-8 rounded-lg object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-lg bg-slate-200 border border-slate-200"></div>
                    )}
                    <div className="flex-1">
                      <h6 className="text-sm font-semibold text-slate-900">Business Name</h6>
                      <p className="text-xs text-slate-500">Industry • Location</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2">Brief business description for featured spotlight...</p>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Uses mobile banner first, then desktop fallback
              </p>
            </div>
          </div>
          
          <div className="rounded-xl bg-blue-50 border border-blue-200 p-3">
            <div className="flex items-start gap-2">
              <div className="text-blue-600 text-sm">ℹ️</div>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Banner Display System</p>
                <p className="text-xs">
                  <strong>Business Card:</strong> Uses mobile banner (400×160px) or desktop fallback<br/>
                  <strong>Homepage Featured:</strong> Uses mobile banner (400×160px) or desktop fallback<br/>
                  <strong>Business Registry:</strong> Uses desktop banner only (1200×300px)
                </p>
                <p className="text-xs mt-1 italic">
                  ✨ One mobile banner size (400×160px) works perfectly for both cards and homepage!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
