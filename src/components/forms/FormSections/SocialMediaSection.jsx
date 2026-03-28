export default function SocialMediaSection({ form, handleInputChange, inputCls, labelCls }) {
  const handleSocialLinkChange = (platform, value) => {
    handleInputChange("social_links", {
      ...form.social_links,
      [platform]: value
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className={labelCls}>Facebook</label>
          <input
            type="url"
            value={form.social_links?.facebook || ""}
            onChange={(e) => handleSocialLinkChange("facebook", e.target.value)}
            className={inputCls}
            placeholder="e.g., https://facebook.com/yourbusiness"
            title="Please enter a valid Facebook URL starting with https://"
          />
        </div>

        <div>
          <label className={labelCls}>Instagram</label>
          <input
            type="url"
            value={form.social_links?.instagram || ""}
            onChange={(e) => handleSocialLinkChange("instagram", e.target.value)}
            className={inputCls}
            placeholder="e.g., https://instagram.com/yourbusiness"
            title="Please enter a valid Instagram URL starting with https://"
          />
        </div>

        <div>
          <label className={labelCls}>Twitter/X</label>
          <input
            type="url"
            value={form.social_links?.twitter || ""}
            onChange={(e) => handleSocialLinkChange("twitter", e.target.value)}
            className={inputCls}
            placeholder="e.g., https://x.com/yourbusiness"
            title="Please enter a valid Twitter/X URL starting with https://"
          />
        </div>

        <div>
          <label className={labelCls}>LinkedIn</label>
          <input
            type="url"
            value={form.social_links?.linkedin || ""}
            onChange={(e) => handleSocialLinkChange("linkedin", e.target.value)}
            className={inputCls}
            placeholder="e.g., https://linkedin.com/company/yourbusiness"
            title="Please enter a valid LinkedIn URL starting with https://"
          />
        </div>

        <div>
          <label className={labelCls}>YouTube</label>
          <input
            type="url"
            value={form.social_links?.youtube || ""}
            onChange={(e) => handleSocialLinkChange("youtube", e.target.value)}
            className={inputCls}
            placeholder="e.g., https://youtube.com/@yourbusiness"
            title="Please enter a valid YouTube URL starting with https://"
          />
        </div>

        <div>
          <label className={labelCls}>TikTok</label>
          <input
            type="url"
            value={form.social_links?.tiktok || ""}
            onChange={(e) => handleSocialLinkChange("tiktok", e.target.value)}
            className={inputCls}
            placeholder="e.g., https://tiktok.com/@yourbusiness"
            title="Please enter a valid TikTok URL starting with https://"
          />
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-2">
        Add your social media profiles to help customers connect with your business across different platforms.
      </p>
    </div>
  );
}
