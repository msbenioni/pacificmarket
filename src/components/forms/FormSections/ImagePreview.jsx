"use client";

export default function ImagePreview({ 
  file, 
  label, 
  className = "h-20 w-20 rounded-xl object-cover",
  bannerType = null,
  businessName = "Business"
}) {
  if (!file || !(file instanceof File)) {
    return null;
  }

  // Create a temporary URL for preview
  const previewUrl = URL.createObjectURL(file);

  if (bannerType === 'desktop') {
    return (
      <div className={`relative w-full max-w-[400px] h-[100px] bg-gray-100 ${className}`} style={{ aspectRatio: '4/1' }}>
        <img
          src={previewUrl}
          alt={`${businessName} desktop banner preview`}
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>
    );
  }

  if (bannerType === 'mobile') {
    return (
      <div className={`relative w-full h-[160px] bg-[#0d4f4f] overflow-hidden rounded-t-[24px] ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d4f4f] to-[#1a6b6b]" />
        <img
          src={previewUrl}
          alt={`${businessName} mobile banner preview`}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    );
  }

  // Default image preview (for logo)
  return (
    <img
      src={previewUrl}
      alt={`${label} preview`}
      className={className}
    />
  );
}
