"use client";

import { useMemo, useRef, useState } from "react";
import { HelpCircle, BookOpen, MessageCircle, Search, ChevronDown } from "lucide-react";
import HeroStandard from "@/components/shared/HeroStandard";
import CookieManager from "../components/shared/CookieManager";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function AccordionItem({ title, children, isOpen, onToggle }) {
  return (
    <div className="border border-gray-200 rounded-xl bg-white overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-start justify-between gap-4 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="font-semibold text-[#0a1628]">{title}</div>
        <ChevronDown
          className={cx(
            "w-5 h-5 mt-0.5 text-gray-500 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div className="px-5 pb-5 text-gray-600 leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
}

export default function Help() {

  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          q: "What is Pacific Discovery Network?",
          a: "Pacific Discovery Network is the first global structured registry of Pacific-owned businesses. We provide a searchable database that helps people discover, connect with, and support Pacific enterprises worldwide."
        },
        {
          q: "How do I create an account?",
          a: "Click 'Sign Up' in the top navigation, enter your email and create a password. You'll receive a confirmation email to verify your account."
        },
        {
          q: "Is Pacific Discovery Network free to use?",
          a: "Basic browsing and searching is free for everyone. Business listings start on the Vaka plan, with paid options for Mana and Moana tiers with enhanced features."
        },
        {
          q: "Who can list a business?",
          a: "Business owners, authorized representatives, or registry administrators can submit listings. All businesses must be Pacific-owned or have significant Pacific cultural connection to be included."
        }
      ]
    },
    {
      category: "Business Listings",
      questions: [
        {
          q: "What information do I need to submit a business?",
          a: "You'll need: business name, contact information, location, industry, cultural identity information, and basic business details."
        },
        {
          q: "How long does the review process take?",
          a: "Standard listings are typically reviewed within 2–3 business days. Mana listings may take 5–7 business days."
        },
        {
          q: "Can I edit my listing after submission?",
          a: "Yes. You can edit your listing any time from your account dashboard. Changes to Mana tier information may require review."
        },
        {
          q: "How do I upgrade my listing tier?",
          a: "Go to your account dashboard, open your listing, and choose 'Upgrade'. Follow the payment flow and it updates immediately."
        }
      ]
    },
    {
      category: "Using Pacific Businesses",
      questions: [
        {
          q: "How do I search for businesses?",
          a: "Use the search bar on the Pacific Businesses page to search by name, or filter by location, industry, cultural identity, or verification status."
        },
        {
          q: "Can I contact businesses through the Pacific Businesses page?",
          a: "Yes. All businesses show their contact details after you provide a valid email address. (This prevents spam and ensures legitimate inquiries.)"
        },
        {
          q: "How accurate is the information?",
          a: "We work for accuracy through review and verification, but information can change. Report inaccuracies and we’ll investigate."
        },
        {
          q: "Can I export data from the Pacific Businesses page?",
          a: "Users can export their own business data. Researchers and organizations can request bulk access via the contact form."
        }
      ]
    },
    {
      category: "Account & Billing",
      questions: [
        {
          q: "How do I reset my password?",
          a: "Click 'Forgot Password' on sign-in, enter your email, and follow the instructions sent to you."
        },
        {
          q: "Can I have multiple businesses under one account?",
          a: "Yes. You can manage multiple listings from a single account."
        },
        {
          q: "What payment methods do you accept?",
          a: "We accept cards (Visa/Mastercard/Amex), PayPal, and bank transfers for annual subscriptions."
        },
        {
          q: "How do I cancel my subscription?",
          a: "Go to Account Settings > Billing > Manage Subscription. You can cancel anytime; access remains until period end."
        }
      ]
    }
  ];

  const [query, setQuery] = useState("");
  const [openCategory, setOpenCategory] = useState(null); // category string or null
  const [openQuestionKey, setOpenQuestionKey] = useState(null); // `${category}__${q}`

  const categoryRefs = useRef({});

  const normalizedQuery = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    // Return: [{ category, icon, questions: [...] , matchCount }]
    const iconMap = {
      "Getting Started": BookOpen,
      "Business Listings": Search,
      "Using Pacific Businesses": MessageCircle,
      "Account & Billing": HelpCircle,
    };

    return faqs
      .map((cat) => {
        const questions = cat.questions.filter((item) => {
          if (!normalizedQuery) return true;
          return (
            item.q.toLowerCase().includes(normalizedQuery) ||
            item.a.toLowerCase().includes(normalizedQuery)
          );
        });

        return {
          category: cat.category,
          Icon: iconMap[cat.category] || HelpCircle,
          questions,
          matchCount: questions.length
        };
      })
      .filter((c) => {
        // If searching, hide empty categories entirely
        if (!normalizedQuery) return true;
        return c.matchCount > 0;
      });
  }, [faqs, normalizedQuery]);

  // Auto-expand matching categories while searching (no tabs needed)
  const categoriesToShow = filtered;

  const totalMatches = useMemo(() => {
    if (!normalizedQuery) return null;
    return categoriesToShow.reduce((sum, c) => sum + c.matchCount, 0);
  }, [categoriesToShow, normalizedQuery]);


  return (
    <div className="bg-[#f8f9fc] min-h-screen">
      <HeroStandard
        badge="Support"
        title="Help Center"
        subtitle=""
        description="Search answers, manage your listing, and get support — all in one place."
      />

      <section className="py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Search (sticky feels premium + reduces friction) */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-[0_12px_40px_rgba(10,22,40,0.08)] p-7 sm:p-8 mb-8 sticky top-4 z-10">
            <div className="max-w-3xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-[#0a1628]">How can we help?</h2>
                  <p className="text-gray-600 mt-1">
                    Search across all help topics.
                    {normalizedQuery && (
                      <span className="ml-2 text-sm text-gray-500">
                        {totalMatches} result{totalMatches === 1 ? "" : "s"}
                      </span>
                    )}
                  </p>
                </div>

                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setOpenCategory(null);
                      setOpenQuestionKey(null);
                    }}
                    className="text-sm font-semibold text-[#0d4f4f] hover:opacity-80"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="relative mt-5">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setOpenQuestionKey(null);
                    // while searching, we don't force a single openCategory
                    if (e.target.value.trim()) setOpenCategory(null);
                  }}
                  type="text"
                  placeholder="Search help articles, FAQs, or topics…"
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0d4f4f]/30 focus:border-[#0d4f4f]"
                />
              </div>
            </div>
          </div>

          {/* Category Accordions */}
          <div className="space-y-4">
            {categoriesToShow.map((cat) => {
              const isSearching = Boolean(normalizedQuery);
              const isOpen = isSearching || openCategory === cat.category;
              const Icon = cat.Icon;

              return (
                <div
                  key={cat.category}
                  ref={(el) => { categoryRefs.current[cat.category] = el; }}
                  className="bg-white border border-gray-200 rounded-2xl shadow-[0_10px_30px_rgba(10,22,40,0.06)] overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => {
                      // when searching, categories stay open by default (but still allow collapse if you want)
                      if (isSearching) return;
                      setOpenCategory(isOpen ? null : cat.category);
                      setOpenQuestionKey(null);
                    }}
                    className={cx(
                      "w-full flex items-center justify-between gap-4 px-6 py-5 text-left",
                      !isSearching && "hover:bg-gray-50 transition-colors"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-xl bg-[#0a1628] flex items-center justify-center">
                        <Icon className="w-5 h-5 text-[#00c4cc]" />
                      </span>
                      <div>
                        <div className="text-lg font-bold text-[#0a1628]">{cat.category}</div>
                        <div className="text-sm text-gray-600">
                          {cat.matchCount} item{cat.matchCount === 1 ? "" : "s"}
                        </div>
                      </div>
                    </div>

                    {!isSearching && (
                      <ChevronDown className={cx("w-5 h-5 text-gray-500 transition-transform", isOpen && "rotate-180")} />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6">
                      <div className="space-y-3">
                        {cat.questions.map((faq) => {
                          const key = `${cat.category}__${faq.q}`;
                          const qOpen = openQuestionKey === key;

                          return (
                            <AccordionItem
                              key={key}
                              title={faq.q}
                              isOpen={qOpen}
                              onToggle={() => setOpenQuestionKey(qOpen ? null : key)}
                            >
                              {faq.a}
                            </AccordionItem>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Still Need Help */}
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold text-[#0a1628] mb-4">Still Need Help?</h2>
            <p className="text-gray-600 mb-6">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <a
              href="/Contact"
              className="inline-flex items-center gap-2 bg-[#0d4f4f] hover:bg-[#0a3d3d] text-white font-semibold px-8 py-4 rounded-xl transition-all"
            >
              Contact Support Team <MessageCircle className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      <CookieManager />
    </div>
  );
}