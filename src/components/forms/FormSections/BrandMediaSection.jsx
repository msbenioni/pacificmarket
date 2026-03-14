import { X, Upload, Info } from "lucide-react";

export default function BrandMediaSection({ 
  form, 
  handleInputChange, 
  handleFileUpload, 
  removeImage, 
  logoInputId, 
  bannerInputId,
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

      {/* Logo and Banner - Side by side on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

        {/* Banner Upload */}
        <div>
          <label className={labelCls}>Business Banner</label>
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
                  Upload Banner
                </label>
                <p className="mt-2 text-xs text-slate-500">1200×300px recommended, PNG/JPG up to 5MB</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Banner Preview Section */}
      {(form.logo_url || form.banner_url) && (
        <div className="space-y-4">
          <h4 className="font-medium text-slate-900">Preview: How Your Images Will Appear</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Business Registry Preview */}
            <div>
              <h5 className="text-sm font-medium text-slate-700 mb-2">Business Registry (Full Width)</h5>
              <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
                <div className="relative h-40 bg-gradient-to-br from-slate-100 via-slate-50 to-[#eef6f6]">
                  {form.banner_url ? (
                    <img
                      src={form.banner_url}
                      alt="Business registry banner preview"
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="h-full w-full bg-slate-100 flex items-center justify-center text-slate-400 text-sm">
                      Banner will appear here
                    </div>
                  )}
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-1">Actual size: 220px-400px height, object-contain</p>
            </div>

            {/* Business Card Preview */}
            <div>
              <h5 className="text-sm font-medium text-slate-700 mb-2">Business Card (Portal/Homepage)</h5>
              <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm max-w-sm">
                <div className="relative h-40 bg-gradient-to-br from-slate-100 via-slate-50 to-[#eef6f6]">
                  {form.banner_url ? (
                    <img
                      src={form.banner_url}
                      alt="Business card banner preview"
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
              <p className="text-xs text-slate-500 mt-1">Actual size: 160px height, object-cover</p>
            </div>
          </div>
          
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-3">
            <div className="flex items-start gap-2">
              <div className="text-amber-600 text-sm">⚠️</div>
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-1">Important: Banner Cropping</p>
                <p className="text-xs">
                  <strong>Registry:</strong> Uses <code>object-contain</code> - shows full image, may have empty space<br/>
                  <strong>Business Card:</strong> Uses <code>object-cover</code> - crops to fill, may cut off edges
                </p>
                <p className="text-xs mt-1 italic">
                  💡 Tip: Test your banner to ensure it looks good with both display modes!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
