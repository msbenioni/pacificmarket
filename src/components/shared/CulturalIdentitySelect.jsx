import { useState } from "react";
import { ChevronDown, X } from "lucide-react";
import FlagIcon from "./FlagIcon";
import { IDENTITIES } from "@/components/formConstants";

export default function CulturalIdentitySelect({ value, onChange, label = "Cultural Identity", required = false, className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Handle both single string and array values
  const selectedValues = Array.isArray(value) ? value : (value ? [value] : []);
  
  // Filter identities based on search
  const filteredIdentities = IDENTITIES.filter(identity => 
    identity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggle = (identity) => {
    const newValues = selectedValues.includes(identity)
      ? selectedValues.filter(v => v !== identity)
      : [...selectedValues, identity];
    
    // Pass as array if multiple selected, as string if single
    onChange(newValues.length === 1 ? newValues[0] : newValues);
  };

  const handleRemove = (identity) => {
    const newValues = selectedValues.filter(v => v !== identity);
    onChange(newValues.length === 1 ? newValues[0] : newValues);
  };

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      {/* Selected items display */}
      <div className="relative">
        <div 
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 bg-white cursor-text min-h-[42px] flex flex-wrap items-center gap-2"
          onClick={() => setIsOpen(true)}
        >
          {selectedValues.length === 0 ? (
            <span className="text-gray-400 text-sm">Select Pacific identities</span>
          ) : (
            selectedValues.map(identity => (
              <div 
                key={identity}
                className="inline-flex items-center gap-1 bg-gray-100 border border-gray-200 rounded-lg px-2 py-1 text-sm"
              >
                <FlagIcon identity={identity} size={14} />
                <span className="text-gray-700">{identity}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(identity);
                  }}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))
          )}
          <ChevronDown className="w-4 h-4 text-gray-400 ml-auto" />
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-hidden">
            {/* Search */}
            <div className="p-3 border-b border-gray-100">
              <input
                type="text"
                placeholder="Search identities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#0d4f4f]"
                autoFocus
              />
            </div>
            
            {/* Options */}
            <div className="max-h-48 overflow-y-auto">
              {filteredIdentities.map(identity => {
                const isSelected = selectedValues.includes(identity);
                return (
                  <div
                    key={identity}
                    onClick={() => handleToggle(identity)}
                    className={`flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer transition-colors ${
                      isSelected ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <FlagIcon identity={identity} size={16} />
                    <span className="text-sm">{identity}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
