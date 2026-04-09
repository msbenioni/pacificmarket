"use client";

import { ExternalLink, MessageCircle, Users } from "lucide-react";

const FB_PAGE = process.env.NEXT_PUBLIC_FB_PAGE || "https://www.facebook.com/pacificdiscoverynetwork/";
const FB_GROUP = process.env.NEXT_PUBLIC_FB_GROUP || "https://www.facebook.com/groups/1823260561674756";

export default function CommunitySection() {
  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-[#f8f9fc] to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0a1628] mb-4">
            Join Our Community
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Connect with Pacific business owners, discover new opportunities, and be part of our growing network.
          </p>
        </div>

        {/* Community Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Facebook Page Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow flex flex-col h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#1877f2] rounded-lg flex items-center justify-center">
                <ExternalLink className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#0a1628]">
                Join our Facebook Page
              </h3>
            </div>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              Follow our Pacific Discovery Network Facebook page to see other business listings, updates, and featured businesses.
            </p>
            
            <div className="mt-auto">
              <a
                href={FB_PAGE}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#1877f2] hover:bg-[#166fe5] text-white font-semibold px-6 py-3 rounded-lg transition-colors w-full justify-center"
              >
                <Users className="w-4 h-4" />
                Follow Page
              </a>
            </div>
          </div>

          {/* Facebook Group Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow flex flex-col h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#1877f2] rounded-lg flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#0a1628]">
                Join our Facebook Group
              </h3>
            </div>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              Join the group to take part in business conversations, connect with other Pacific business owners, and share your own posts with the community.
            </p>
            
            <div className="mt-auto">
              <a
                href={FB_GROUP}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#1877f2] hover:bg-[#166fe5] text-white font-semibold px-6 py-3 rounded-lg transition-colors w-full justify-center"
              >
                <MessageCircle className="w-4 h-4" />
                Join Group
              </a>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-gradient-to-r from-[#0a1628] to-[#07101d] rounded-2xl p-8 sm:p-12 text-white">
          <div className="text-center mb-8">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">
              Why Join Our Community?
            </h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Be part of a supportive network that's helping Pacific businesses thrive and grow together.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-3 gap-6 text-center">
            <div>
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-[#00c4cc]" />
              </div>
              <h4 className="font-semibold mb-2">Connect</h4>
              <p className="text-gray-300 text-sm">
                Network with fellow Pacific business owners and entrepreneurs
              </p>
            </div>
            
            <div>
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ExternalLink className="w-8 h-8 text-[#c9a84c]" />
              </div>
              <h4 className="font-semibold mb-2">Discover</h4>
              <p className="text-gray-300 text-sm">
                Find new business opportunities and collaborations
              </p>
            </div>
            
            <div>
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-[#00c4cc]" />
              </div>
              <h4 className="font-semibold mb-2">Share</h4>
              <p className="text-gray-300 text-sm">
                Promote your business and share your success stories
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
