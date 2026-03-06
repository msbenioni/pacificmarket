import { useState, useEffect } from "react";
import Link from "next/link";
import { createPageUrl } from "@/utils";
import { pacificMarket } from "@/lib/pacificMarketClient";
import { CheckCircle, Globe, MapPin, Instagram, Facebook, Star, ArrowLeft, ExternalLink, MessageCircle, Languages } from "lucide-react";
import ReactMarkdown from "react-markdown";

import FlagIcon from "@/components/shared/FlagIcon";
import ContactModal from "@/components/profile/ContactModal";
import BusinessGallery from "@/components/profile/BusinessGallery";
import ProductsServices from "@/components/profile/ProductsServices";

export default function BusinessProfile() {
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [claimSubmitted, setClaimSubmitted] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [products, setProducts] = useState([]);

  const formatMarkdown = (text) =>
    text
      .replace(/\s*•\s*/g, "\n- ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

  useEffect(() => {
    pacificMarket.auth.me().then(setUser).catch(() => {});

    const params = new URLSearchParams(window.location.search);
    const handle = params.get("handle");

    if (handle) {
      pacificMarket.entities.Business.filter({ business_handle: handle }).then(async res => {
        const biz = res.length > 0 ? res[0] : null;
        if (!biz) {
          const res2 = await pacificMarket.entities.Business.filter({ id: handle });
          const biz2 = res2[0] || null;
          setBusiness(biz2);
          if (biz2) await fetchExtras(biz2);
        } else {
          setBusiness(biz);
          await fetchExtras(biz);
        }
        setLoading(false);
      });
    } else setLoading(false);
  }, []);

  const fetchExtras = async (biz) => {
    const tier = biz.subscription_tier ?? biz.tier;
    if (tier === "verified" || tier === "featured_plus") {
      const imgs = await pacificMarket.entities.BusinessImage.filter({ business_id: biz.id });
      setGalleryImages(imgs);
    }
    if (tier === "featured_plus") {
      const prods = await pacificMarket.entities.ProductService.filter({ business_id: biz.id });
      setProducts(prods);
    }
  };

  const handleClaim = () => {
    // Redirect to login with pre-selected business for claiming
    window.location.href = `${createPageUrl("BusinessLogin")}?business=${business.id}&name=${encodeURIComponent(business.name)}`;
  };

  const isOwner = user && business?.owner_user_id === user.id;

  if (loading) return (
    <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-[#0d4f4f] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-400 text-sm">Loading registry record...</p>
      </div>
    </div>
  );

  if (!business) return (
    <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-bold text-[#0a1628] mb-2">Record Not Found</h2>
        <p className="text-gray-500 text-sm mb-4">This business record does not exist in the registry.</p>
        <Link href={createPageUrl("Registry")} className="text-[#0d4f4f] font-medium text-sm hover:underline">← Back to Registry</Link>
      </div>
    </div>
  );

  const socials = [
    { icon: Globe, label: "Website", value: business.website, href: business.website },
    { icon: Instagram, label: "Instagram", value: business.instagram, href: `https://instagram.com/${business.instagram?.replace("@", "")}` },
    { icon: Facebook, label: "Facebook", value: business.facebook, href: business.facebook },
    { icon: Globe, label: "LinkedIn", value: business.linkedin, href: business.linkedin },
    { icon: Globe, label: "TikTok", value: business.tiktok, href: business.tiktok },
  ].filter(s => s.value);

  const socialLinks = business.social_links && typeof business.social_links === "object"
    ? Object.entries(business.social_links)
        .filter(([, value]) => value)
        .map(([label, value]) => ({
          icon: Globe,
          label: label.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
          value,
          href: value,
        }))
    : [];

  const allSocials = [...socials, ...socialLinks];

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      {showContact && <ContactModal business={business} onClose={() => setShowContact(false)} />}
      {/* Banner */}
      <div className="h-96 bg-gradient-to-br from-[#0a1628] to-[#0d4f4f] relative overflow-hidden">
        {business.banner_url && <img src={business.banner_url} alt="" className="w-full h-full object-cover" />}
        {business.cultural_identity && (
          <div className="absolute bottom-3 right-4 flex items-center gap-1.5 bg-black/30 backdrop-blur-sm px-2.5 py-1.5 rounded-lg">
            <FlagIcon identity={business.cultural_identity} size={20} />
            <span className="text-white text-xs font-medium">{business.cultural_identity}</span>
          </div>
        )}
      </div>

      <div className="px-4 sm:px-6 lg:px-8 -mt-8 pb-16 relative flex justify-center">
        <div className="flex flex-col gap-8 items-start w-full mx-auto max-w-3xl">
          {/* Left: Main Profile */}
          <div className="flex-1 w-full">
            {/* Header card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 relative">
              {/* Contact button - top right */}
              {(business.contact_email || business.contact_phone) && (
                <button
                  onClick={() => setShowContact(true)}
                  className="absolute top-6 right-6 flex items-center gap-2 text-xs font-semibold text-white bg-[#0d4f4f] hover:bg-[#0a3d3d] px-4 py-2 rounded-lg transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" /> Contact Us
                </button>
              )}
              
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl border-2 border-white shadow-md flex-shrink-0 overflow-hidden bg-gradient-to-br from-[#0a1628] to-[#0d4f4f] flex items-center justify-center">
                  {business.logo_url
                    ? <img src={business.logo_url} alt="" className="w-full h-full object-cover" />
                    : <img src="/pm_logo.png" alt="Pacific Market" className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h1 className="text-xl font-bold text-[#0a1628]">{business.name}</h1>
                    {(business.subscription_tier ?? business.tier) === "featured_plus" && (
                      <span className="featured-badge flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold">
                        <Star className="w-3 h-3" /> Featured+
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{business.city ? `${business.city}, ` : ""}{business.country}</span>
                    <span className="flex items-center gap-1"><FlagIcon identity={business.cultural_identity} size={14} />{business.industry}</span>
                  </div>
                </div>
              </div>

              {(business.short_description || business.tagline) && (
                <div className="text-gray-600 text-sm leading-relaxed mb-4 prose prose-sm max-w-none prose-headings:font-semibold prose-headings:text-[#0a1628] prose-strong:text-[#0a1628] prose-ul:pl-5 prose-ul:my-3 prose-li:my-2 prose-p:my-3">
                  <ReactMarkdown>{formatMarkdown(business.short_description || business.tagline)}</ReactMarkdown>
                </div>
              )}
              {business.description && (
                <div className="text-gray-500 text-sm leading-relaxed prose prose-sm max-w-none prose-headings:font-semibold prose-headings:text-[#0a1628] prose-strong:text-[#0a1628] prose-ul:pl-5 prose-ul:my-3 prose-li:my-2 prose-p:my-3">
                  <ReactMarkdown>{formatMarkdown(business.description)}</ReactMarkdown>
                </div>
              )}

              {/* Languages */}
              {business.languages_spoken?.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-50">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
                    <img src="/language_spoken.png" alt="Languages spoken" className="w-[42px] h-[42px]" /> Languages spoken
                  </div>
                  <div className="flex flex-wrap gap-2">
                  {business.languages_spoken.map(l => (
                    <span key={l} className="bg-[#0a1628]/5 text-[#0a1628] text-xs px-3 py-1 rounded-full">{l}</span>
                  ))}
                  </div>
                </div>
              )}

              {/* Socials */}
              <div className="flex flex-wrap gap-3 mt-5 pt-5 border-t border-gray-50">
                {allSocials.map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors">
                    <s.icon className="w-3.5 h-3.5" /> {s.label}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ))}
              </div>
            </div>

            <BusinessGallery images={galleryImages} />

            <ProductsServices products={products} onContact={() => setShowContact(true)} />

            {!business.claimed && (
              <div className="mt-6 pt-5 border-t border-gray-100">
                {claimSubmitted ? (
                  <div className="flex items-center gap-2 text-green-700 text-xs bg-green-50 px-3 py-2 rounded-lg">
                    <CheckCircle className="w-4 h-4" /> Claim submitted for review
                  </div>
                ) : (
                  <p className="text-xs text-gray-400">Is this your business? <button onClick={handleClaim} className="text-[#0d4f4f] font-semibold hover:underline">Claim this listing</button></p>
                )}
              </div>
            )}

            <Link href={createPageUrl("Registry")} className="flex items-center gap-1 text-sm text-gray-400 hover:text-[#0d4f4f] transition-colors mt-6">
              <ArrowLeft className="w-4 h-4" /> Back to Registry
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}