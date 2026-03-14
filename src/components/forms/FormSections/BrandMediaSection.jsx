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
    </div>
  );
}
