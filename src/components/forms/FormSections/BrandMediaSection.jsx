import { X, Upload, Info } from "lucide-react";

export default function BrandMediaSection({ 
  form, 
  handleInputChange, 
  handleFileUpload, 
  removeImage, 
  logoInputId, 
  bannerInputId,
  mobileBannerInputId,
  inputCls, 
  labelCls 
}) {
  return (
    <div className="space-y-6">
      {/* Image Size Guidelines */}
      <div className="rounded-xl bg-blue-50 border border-blue-200 p-4">
        <div className="flex items-start gap-2">
          <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <h4 className="font-medium text-blue-900 mb-2">Recommended Image Sizes</h4>
            <div className="space-y-1 text-blue-700">
              <p><strong>Logo:</strong> 200×200px (square, for profile cards & listings)</p>
              <p><strong>Banner:</strong> 1200×300px (wide rectangle, for business registry)</p>
              <p><strong>Mobile Banner:</strong> 400×200px (narrow rectangle, for business cards)</p>
              <p className="text-xs mt-2">All images: PNG, JPG up to 5MB. Images will be automatically resized.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Logo Upload */}
      <div>
        <label className={labelCls}>Business Logo</label>
        <div className="mt-2 space-y-3">
          {form.logo_url ? (
            <div className="relative inline-block">
              <img
                src={form.logo_url}
                alt="Business logo"
                className="h-20 w-20 rounded-xl object-cover border border-slate-200"
              />
              <button
                type="button"
                onClick={() => removeImage("logo")}
                className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <div>
              <input
                id={logoInputId}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, "logo")}
                className="hidden"
              />
              <label
                htmlFor={logoInputId}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <Upload className="h-4 w-4" />
                Upload Logo
              </label>
              <p className="mt-2 text-xs text-slate-500">200×200px recommended, PNG/JPG up to 5MB</p>
            </div>
          )}
        </div>
      </div>

      {/* Banner Uploads - Side by side on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Desktop Banner Upload */}
        <div>
          <label className={labelCls}>Desktop Banner (Business Registry)</label>
          <div className="mt-2 space-y-3">
            {form.banner_url ? (
              <div className="relative inline-block">
                <img
                  src={form.banner_url}
                  alt="Business banner"
                  className="h-32 w-64 rounded-xl object-cover border border-slate-200"
                />
                <button
                  type="button"
                  onClick={() => removeImage("banner")}
                  className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <div>
                <input
                  id={bannerInputId}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "banner")}
                  className="hidden"
                />
                <label
                  htmlFor={bannerInputId}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <Upload className="h-4 w-4" />
                  Upload Desktop Banner
                </label>
                <p className="mt-2 text-xs text-slate-500">1200×300px recommended, PNG/JPG up to 5MB</p>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Banner Upload */}
        <div>
          <label className={labelCls}>Mobile Banner (Business Cards)</label>
          <div className="mt-2 space-y-3">
            {form.mobile_banner_url ? (
              <div className="relative inline-block">
                <img
                  src={form.mobile_banner_url}
                  alt="Mobile business banner"
                  className="h-24 w-48 rounded-xl object-cover border border-slate-200"
                />
                <button
                  type="button"
                  onClick={() => removeImage("mobile_banner")}
                  className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <div>
                <input
                  id={mobileBannerInputId}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "mobile_banner")}
                  className="hidden"
                />
                <label
                  htmlFor={mobileBannerInputId}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <Upload className="h-4 w-4" />
                  Upload Mobile Banner
                </label>
                <p className="mt-2 text-xs text-slate-500">400×200px recommended, PNG/JPG up to 5MB</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Banner Preview Section */}
      {(form.logo_url || form.banner_url || form.mobile_banner_url) && (
        <div className="space-y-4">
          <h4 className="font-medium text-slate-900">Preview: How Your Banners Will Appear</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Business Card Preview */}
            <div>
              <h5 className="text-sm font-medium text-slate-700 mb-2">Business Card (Portal)</h5>
              <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm max-w-sm">
                <div className="relative h-40 bg-gradient-to-br from-slate-100 via-slate-50 to-[#eef6f6]">
                  {form.mobile_banner_url ? (
                    <img
                      src={form.mobile_banner_url}
                      alt="Business card preview"
                      className="h-full w-full object-cover"
                    />
                  ) : form.banner_url ? (
                    <img
                      src={form.banner_url}
                      alt="Business card preview (fallback)"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-slate-100 flex items-center justify-center text-slate-400 text-xs">
                      Banner will appear here
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <div className="text-xs text-slate-500">Industry • Location</div>
                  <div className="text-xs text-slate-600 mt-1">Brief business description...</div>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {form.mobile_banner_url ? "Uses mobile banner" : "Uses desktop banner as fallback"}
              </p>
            </div>

            {/* Homepage Featured Preview */}
            <div>
              <h5 className="text-sm font-medium text-slate-700 mb-2">Homepage Featured</h5>
              <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm max-w-sm">
                <div className="relative h-[133px] bg-gradient-to-br from-[#0d4f4f] to-[#1a6b6b] rounded-t-2xl">
                  {form.mobile_banner_url ? (
                    <img
                      src={form.mobile_banner_url}
                      alt="Homepage featured preview"
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{ objectPosition: "center top" }}
                    />
                  ) : form.banner_url ? (
                    <img
                      src={form.banner_url}
                      alt="Homepage featured preview (fallback)"
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{ objectPosition: "center top" }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-xs">
                      Featured banner will appear here
                    </div>
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
                {form.mobile_banner_url ? "Uses mobile banner" : "Uses desktop banner as fallback"}
              </p>
            </div>
          </div>
          
          <div className="rounded-xl bg-blue-50 border border-blue-200 p-3">
            <div className="flex items-start gap-2">
              <div className="text-blue-600 text-sm">ℹ️</div>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Banner Display Contexts</p>
                <p className="text-xs">
                  <strong>Business Card:</strong> Portal business cards with logo and details<br/>
                  <strong>Homepage Featured:</strong> Spotlight section on homepage with gradient background<br/>
                  <strong>Business Registry:</strong> Full-width banner on business profile pages
                </p>
                <p className="text-xs mt-1 italic">
                  💡 Tip: Mobile banner works for both cards and homepage, desktop banner for registry!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
