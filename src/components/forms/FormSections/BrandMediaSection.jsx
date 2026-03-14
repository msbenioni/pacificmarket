import { X, Upload } from "lucide-react";

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
              <p className="mt-2 text-xs text-slate-500">PNG, JPG up to 5MB</p>
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
              <p className="mt-2 text-xs text-slate-500">PNG, JPG up to 5MB</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
