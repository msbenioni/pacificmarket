import { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Download, ArrowLeft, FileText, Building, Calendar, User, ShoppingCart, DollarSign, CreditCard, Palette, ChevronDown, Upload } from "lucide-react";
import Link from "next/link";
import { createPageUrl } from "@/utils";
import { getUserBusinesses, getBusinessById, updateBusiness } from "@/lib/supabase/queries/businesses";
import { getBusinessWebsite, getBusinessTier, hasPremiumFeatures } from "@/lib/business/helpers";
import HeroStandard from "../components/shared/HeroStandard";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useToast } from "@/components/ui/toast/ToastProvider";


// Premium accordion component (defined at module scope to prevent remounting)
function InvoiceAccordionSection({
  id,
  title,
  subtitle,
  summary,
  icon: Icon,
  isOpen,
  onToggle,
  children,
}) {
  return (
    <div className="border-b border-gray-100 last:border-b-0 bg-gradient-to-r from-[#0a1628] to-[#0d4f4f] text-white">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-4 sm:px-5 py-4 text-left hover:bg-white/10 transition"
      >
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <Icon className="w-4 h-4 text-white" />
          </div>

          <div className="min-w-0">
            <div className="font-semibold text-white text-sm">{title}</div>
            {subtitle && (
              <div className="text-xs text-gray-300 mt-0.5">{subtitle}</div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {summary && (
            <div className="hidden md:block text-xs text-gray-300 text-right max-w-[140px] truncate">
              {summary}
            </div>
          )}
          <div className="text-gray-300 text-sm">
            {isOpen ? <ChevronDown className="w-4 h-4 rotate-180" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 bg-white">
          <div className="pt-1">{children}</div>
        </div>
      )}
    </div>
  );
}

const createEmptyInvoice = () => ({
  invoice_number: "",
  date: new Date().toISOString().split("T")[0],
  due_date: "",

  sender_name: "",
  sender_logo_url: "",
  sender_email: "",
  sender_phone: "",
  sender_address: "",
  sender_suburb: "",
  sender_city: "",
  sender_state_region: "",
  sender_postal_code: "",
  sender_country: "",

  client_name: "",
  client_email: "",
  client_phone: "",
  client_address: "",

  tax_rate: "",
  withholding_tax_rate: "",

  payment_account_name: "",
  payment_account_number: "",
  payment_reference_label: "",
  payment_terms: "",

  notes: "",

  brand_primary: "#0a1628",
  brand_accent: "#c9a84c",
  brand_text: "#0f172a",

  items: [{ description: "", quantity: 1, unit_price: "" }],
  adjustments: [],
});

export default function InvoiceGenerator() {
  // Force cache refresh - premium invoice generator with accordion
  const [user, setUser] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState("");
  const [mode, setMode] = useState("business"); // business | custom
  const [exportingPdf, setExportingPdf] = useState(false);
  const printRef = useRef(null);
  const loadedBusinessIdRef = useRef(null);
  const isUserEditingRef = useRef(false);
  const { toast } = useToast();

  // Accordion state - multiple sections can be open
  const [openSections, setOpenSections] = useState(["business", "invoice", "items"]);

  const toggleSection = (section) => {
    setOpenSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const [businessInvoice, setBusinessInvoice] = useState(createEmptyInvoice());
  const [customInvoice, setCustomInvoice] = useState(createEmptyInvoice());
  const invoice = mode === "business" ? businessInvoice : customInvoice;
  const setActiveInvoice = (updater) => {
    if (mode === "business") {
      setBusinessInvoice(updater);
      return;
    }
    setCustomInvoice(updater);
  };

  useEffect(() => {
    // Generate invoice number only on client-side to avoid hydration mismatch
    const generated = `INV-${Date.now().toString().slice(-6)}`;
    setBusinessInvoice(prev => prev.invoice_number ? prev : { ...prev, invoice_number: generated });
    setCustomInvoice(prev => prev.invoice_number ? prev : { ...prev, invoice_number: generated });
  }, []);

  useEffect(() => {
    const loadInvoiceData = async () => {
      try {
        // Import getSupabase for auth and claims only
        const { getSupabase: getClient } = await import("@/lib/supabase/client");
        const supabase = getClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        setUser(user);
        
        // Get user's owned businesses using shared query
        const { data: ownedBusinesses } = await getUserBusinesses(user.id);

        // Get approved claimed businesses for this user
        const { data: claims } = await supabase
          .from('claim_requests')
          .select('business_id')
          .eq('user_id', user.id)
          .eq('status', 'approved');

        const claimedIds = (claims || []).map(claim => claim.business_id).filter(Boolean);
        let claimedBusinesses = [];
        if (claimedIds.length > 0) {
          // Use shared query for claimed businesses - match email generator pattern
          const claimedBusinessPromises = claimedIds.map(async (id) => {
            try {
              const business = await getBusinessById(id);
              return { data: business, error: null };
            } catch (error) {
              console.error(`Failed to load claimed business ${id}:`, error);
              return { data: null, error };
            }
          });
          const claimedResults = await Promise.all(claimedBusinessPromises);
          claimedBusinesses = claimedResults.filter(result => result.data).map(result => result.data);
        }

        const mergedBusinesses = [...(ownedBusinesses || []), ...claimedBusinesses];
        const uniqueBusinesses = Array.from(new Map(mergedBusinesses.map(b => [b.id, b])).values());

        if (uniqueBusinesses.length > 0) {
          setBusinesses(uniqueBusinesses);
          // Auto-select first business if none selected
          setSelectedBusinessId(prev => prev || uniqueBusinesses[0].id);
        }
      } catch (error) {
        console.error("Error loading invoice data:", error);
      }
    };

    loadInvoiceData();
  }, []);

  // Load business settings when business is selected
  useEffect(() => {
    if (!selectedBusinessId || mode !== "business" || loadedBusinessIdRef.current === selectedBusinessId) return;
    
    const loadBusinessSettings = async () => {
      try {
        // Import getSupabase for invoice settings only
        const { getSupabase } = await import("@/lib/supabase/client");
        const supabase = getSupabase();
        
        let business = null;
        try {
          business = await getBusinessById(selectedBusinessId);
        } catch (err) {
          console.error("Business query error:", err);
          throw new Error(`Failed to load business: ${err?.message || "Unknown error"}`);
        }

        if (!business) {
          throw new Error("Business not found");
        }
        
        // Get invoice settings
        const { data: settings, error: settingsError } = await supabase
          .from('business_invoice_settings')
          .select('*')
          .eq('business_id', selectedBusinessId)
          .maybeSingle();
        
        if (business && !isUserEditingRef.current) {
          // For generators/exports, use raw saved business assets.
          // Do not use UI display helpers like getLogoUrl/getBannerUrl here.
          setBusinessInvoice(prev => ({
            ...prev,
            sender_name: prev.sender_name || business.business_name || "",
            sender_logo_url: prev.sender_logo_url || business?.logo_url || "",
            sender_email: prev.sender_email || business.business_email || "",
            sender_phone: prev.sender_phone || business.business_phone || "",
            sender_address: prev.sender_address || business.address || "",
            sender_suburb: prev.sender_suburb || business.suburb || "",
            sender_city: prev.sender_city || business.city || "",
            sender_state_region: prev.sender_state_region || business.state_region || "",
            sender_postal_code: prev.sender_postal_code || business.postal_code || "",
            sender_country: prev.sender_country || business.country || "",
          }));
        }
        
        if (settings && !isUserEditingRef.current) {
          setBusinessInvoice(prev => ({
            ...prev,
            tax_rate: prev.tax_rate || settings.default_tax_rate || 10,
            withholding_tax_rate: prev.withholding_tax_rate || settings.default_withholding_tax_rate || 0,
            payment_account_name: prev.payment_account_name || settings.account_name || "",
            payment_account_number: prev.payment_account_number || settings.account_number || "",
            payment_reference_label: prev.payment_reference_label || settings.payment_reference_label || "",
            payment_terms: prev.payment_terms || settings.payment_terms || "",
            brand_primary: prev.brand_primary || settings.invoice_primary_color || "#0a1628",
            brand_accent: prev.brand_accent || settings.invoice_accent_color || "#c9a84c",
            brand_text: prev.brand_text || settings.invoice_text_color || "#0f172a",
          }));
        } else if (settingsError && settingsError.code !== "PGRST116") {
          console.warn("No business invoice settings found:", settingsError.message);
        }
        
        loadedBusinessIdRef.current = selectedBusinessId;
      } catch (error) {
        console.error("Error loading business settings:", error);
      }
    };

    loadBusinessSettings();
  }, [selectedBusinessId, mode]);

  useEffect(() => {
    if (!selectedBusinessId || mode !== "business") return;
    loadedBusinessIdRef.current = null;
    isUserEditingRef.current = false;
  }, [selectedBusinessId, mode]);

  const setField = (key, val) => {
    isUserEditingRef.current = true;
    setActiveInvoice(i => ({ ...i, [key]: val }));
  };
  
  const handleInputChange = (key, value) => {
    setField(key, value);
  };
  const setItem = (idx, key, val) => {
    isUserEditingRef.current = true;
    setActiveInvoice(i => ({ ...i, items: i.items.map((item, j) => j === idx ? { ...item, [key]: val } : item) }));
  };
  const addItem = () => {
    isUserEditingRef.current = true;
    setActiveInvoice(i => ({ ...i, items: [...i.items, { description: "", quantity: 1, unit_price: "" }] }));
  };
  const removeItem = (idx) => {
    isUserEditingRef.current = true;
    setActiveInvoice(i => ({ ...i, items: i.items.filter((_, j) => j !== idx) }));
  };

  // Adjustment management functions
  const addAdjustment = () => {
    isUserEditingRef.current = true;
    setActiveInvoice(i => ({ 
      ...i, 
      adjustments: [...i.adjustments, { 
        label: "", 
        kind: "fee", 
        value_type: "percent", 
        value: 0, 
        apply_stage: "before_tax" 
      }] 
    }));
  };
  
  const updateAdjustment = (idx, key, val) => {
    isUserEditingRef.current = true;
    setActiveInvoice(i => ({ 
      ...i, 
      adjustments: i.adjustments.map((adj, j) => j === idx ? { ...adj, [key]: val } : adj) 
    }));
  };
  
  const removeAdjustment = (idx) => {
    isUserEditingRef.current = true;
    setActiveInvoice(i => ({ ...i, adjustments: i.adjustments.filter((_, j) => j !== idx) }));
  };

  // Logo upload handler
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image under 5MB",
        variant: "error"
      });
      return;
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (PNG, JPG, GIF)",
        variant: "error"
      });
      return;
    }
    
    try {
      // Import getSupabase for storage operations
      const { getSupabase: getClient } = await import("@/lib/supabase/client");
      const supabase = getClient();
      
      // Upload file to Supabase storage
      const bucket = "admin-listings";
      const folder = "invoice-logos";
      const filePath = `${folder}/${Date.now()}-${file.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);
      
      const logoUrl = data.publicUrl;
      
      // Update invoice with new logo URL
      setField("sender_logo_url", logoUrl);
      
      toast({
        title: "Logo uploaded successfully",
        description: "Your business logo has been added to the invoice",
        variant: "success"
      });
      
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload logo. Please try again.",
        variant: "error"
      });
    }
    
    // Reset file input
    e.target.value = '';
  };

  // Save business settings (only in business mode)
  const saveBusinessSettings = async () => {
    if (mode !== "business" || !selectedBusinessId) return;
    
    try {
      // Import getSupabase for invoice settings only
      const { getSupabase } = await import("@/lib/supabase/client");
      const supabase = getSupabase();
      
      // First update business details using shared query
      const businessUpdate = {
        business_name: invoice.sender_name,
        business_email: invoice.sender_email,
        business_phone: invoice.sender_phone,
        address: invoice.sender_address,
        suburb: invoice.sender_suburb,
        city: invoice.sender_city,
        state_region: invoice.sender_state_region,
        postal_code: invoice.sender_postal_code,
        country: invoice.sender_country,
      };
      
      await updateBusiness(selectedBusinessId, businessUpdate);
      
      // Then update invoice settings
      const settingsUpdate = {
        business_id: selectedBusinessId,
        account_name: invoice.payment_account_name,
        account_number: invoice.payment_account_number,
        payment_reference_label: invoice.payment_reference_label,
        payment_terms: invoice.payment_terms,
        default_tax_rate: invoice.tax_rate || null,
        default_withholding_tax_rate: invoice.withholding_tax_rate || null,
        invoice_primary_color: invoice.brand_primary,
        invoice_accent_color: invoice.brand_accent,
        invoice_text_color: invoice.brand_text,
      };
      
      const { error } = await supabase
        .from('business_invoice_settings')
        .upsert(settingsUpdate, {
          onConflict: 'business_id',
        });
      
      if (error) throw error;
      
      // Show success message
      toast({
        variant: "success",
        title: "Invoice settings saved",
        description: "Business settings saved successfully.",
      });
      
    } catch (error) {
      console.error('Error saving business settings:', error);
      toast({
        variant: "error",
        title: "Failed to save settings",
        description: error?.message || 'Please try again.',
      });
    }
  };

  const handleExportPdf = async () => {
    if (!printRef.current) return;
    
    try {
      setExportingPdf(true);
      
      // Create a clone of the invoice preview for PDF generation
      const element = printRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Calculate dimensions to fit the page
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      // Generate filename
      const filename = `${invoice.sender_name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_invoice_${invoice.invoice_number}.pdf`;
      
      // Save the PDF
      pdf.save(filename);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        variant: "error",
        title: "PDF export failed",
        description: error?.message || 'Please try again.',
      });
    } finally {
      setExportingPdf(false);
    }
  };

  // Invoice calculations
  const subtotal = invoice.items.reduce((sum, item) => {
    const unitPrice = parseFloat(item.unit_price) || 0;
    const quantity = item.quantity || 0;
    return sum + (quantity * unitPrice);
  }, 0);
  
  const beforeTaxAdjustments = invoice.adjustments
    .filter(adj => adj.apply_stage === 'before_tax')
    .reduce((sum, adj) => {
      const value = adj.value_type === 'percent' 
        ? subtotal * (adj.value / 100) 
        : adj.value;
      return adj.kind === 'fee' ? sum + value : sum - value;
    }, 0);
  
  const taxableSubtotal = subtotal + beforeTaxAdjustments;
  const taxRate = parseFloat(invoice.tax_rate) || 0;
  const tax = taxableSubtotal * (taxRate / 100);
  const grossTotal = taxableSubtotal + tax;
  
  const afterTaxAdjustments = invoice.adjustments
    .filter(adj => adj.apply_stage === 'after_tax')
    .reduce((sum, adj) => {
      const value = adj.value_type === 'percent' 
        ? grossTotal * (adj.value / 100) 
        : adj.value;
      return adj.kind === 'fee' ? sum + value : sum - value;
    }, 0);
  
  const adjustedGrossTotal = grossTotal + afterTaxAdjustments;
  const withholdingTaxRate = parseFloat(invoice.withholding_tax_rate) || 0;
  const withholdingTax = adjustedGrossTotal * (withholdingTaxRate / 100);
  const totalPayable = adjustedGrossTotal - withholdingTax;

  const inputCls = "w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#0d4f4f] bg-white text-[#0a1628]";

  // Summary functions for accordion headers
  const getBusinessSummary = () => {
    if (mode === "business") {
      const business = businesses.find(b => b.id === selectedBusinessId);
      return business ? business.business_name : "No business selected";
    }
    return invoice.sender_name || "Custom sender";
  };

  const getInvoiceSummary = () => {
    const parts = [];
    if (invoice.invoice_number) parts.push(invoice.invoice_number);
    if (invoice.date) parts.push(invoice.date);
    if (invoice.tax_rate) parts.push(`Tax ${invoice.tax_rate}%`);
    if (invoice.withholding_tax_rate) parts.push(`Withholding ${invoice.withholding_tax_rate}%`);
    return parts.join(" · ") || "Invoice details not set";
  };

  const getClientSummary = () => {
    return invoice.client_name || "No client details yet";
  };

  const getItemsSummary = () => {
    const validItems = invoice.items.filter(item => item.description || item.unit_price);
    const subtotal = validItems.reduce((sum, item) => {
      const unitPrice = parseFloat(item.unit_price) || 0;
      const quantity = item.quantity || 0;
      return sum + (quantity * unitPrice);
    }, 0);
    return `${validItems.length} item${validItems.length !== 1 ? 's' : ''} · $${subtotal.toFixed(2)}`;
  };

  const getAdjustmentsSummary = () => {
    return invoice.adjustments.length > 0 ? `${invoice.adjustments.length} adjustment${invoice.adjustments.length !== 1 ? 's' : ''}` : "No adjustments";
  };

  const getPaymentSummary = () => {
    if (invoice.payment_account_name && invoice.payment_account_number) {
      return `${invoice.payment_account_name} · ${invoice.payment_account_number.slice(-4)}`;
    }
    return invoice.payment_account_name || "Payment details incomplete";
  };

  const getBrandSummary = () => {
    const parts = [];
    if (invoice.sender_logo_url) parts.push("Logo added");
    if (invoice.brand_primary === "#0a1628" && invoice.brand_accent === "#c9a84c") {
      parts.push("Pacific Discovery Network colours");
    } else {
      parts.push("Custom colours");
    }
    return parts.join(" · ") || "Default branding";
  };

  return (
    <div>
      <HeroStandard
        badge="Business Tool"
        title="Invoice Generator"
        subtitle="Create polished, branded invoices for your business in minutes."
        description="Generate professional PDF invoices with your business details, custom brand colours, payment information, and flexible tax settings."
        actions={
          <div className="hidden sm:flex items-center gap-3">
            <Link href={createPageUrl("BusinessPortal")} className="inline-flex items-center gap-2 bg-white text-[#0a1628] px-6 py-3 rounded-xl text-sm font-semibold hover:bg-gray-50 transition">
              <ArrowLeft className="w-4 h-4" />
              Back to Portal
            </Link>
            <button onClick={handleExportPdf}
              disabled={exportingPdf}
              className="flex items-center gap-2 bg-[#c9a84c] hover:bg-[#b8973b] text-[#0a1628] font-bold px-5 py-3 rounded-xl transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed">
              {exportingPdf ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download PDF
                </>
              )}
            </button>
            {mode === "business" && (
              <button onClick={saveBusinessSettings}
                className="flex items-center gap-2 bg-white text-[#0a1628] border border-gray-200 hover:border-[#0a1628] font-bold px-5 py-3 rounded-xl transition-all text-sm">
                <FileText className="w-4 h-4" /> Save Settings
              </button>
            )}
          </div>
        }
      />

      {/* Mobile-only back button */}
      <div className="sm:hidden max-w-7xl mx-auto px-4 pt-4">
        <Link
          href={createPageUrl("BusinessPortal")}
          className="inline-flex items-center gap-2 bg-white text-[#0a1628] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition border border-gray-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Portal
        </Link>
      </div>

      <div className="min-h-screen bg-[#f8f9fc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Mode Tabs */}
        <div className="bg-white/95 border border-gray-200 shadow-sm rounded-2xl p-2 mb-8">
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => setMode("business")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-medium transition-all border ${
                mode === "business" 
                  ? "bg-[#0a1628] text-white shadow-sm border-[#0a1628]" 
                  : "text-gray-600 border-gray-200 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              <FileText className="w-4 h-4" />
              Business Invoice
            </button>
            <button
              onClick={() => setMode("custom")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-medium transition-all border ${
                mode === "custom" 
                  ? "bg-[#0a1628] text-white shadow-sm border-[#0a1628]" 
                  : "text-gray-600 border-gray-200 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              <Plus className="w-4 h-4" />
              Custom Invoice
            </button>
          </div>
        </div>

        {/* Mode Description */}
        <div className="bg-white/95 border border-gray-200 shadow-sm rounded-2xl p-4 mb-8">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#0a1628]/10 flex items-center justify-center flex-shrink-0">
              {mode === "business" ? (
                <FileText className="w-4 h-4 text-[#0a1628]" />
              ) : (
                <Plus className="w-4 h-4 text-[#0a1628]" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-[#0a1628] text-sm mb-1">
                {mode === "business" ? "Business Invoice" : "Custom Invoice"}
              </h3>
              <p className="text-gray-600 text-sm">
                {mode === "business" 
                  ? "Use your saved business details to generate a branded invoice faster."
                  : "Create a one-time invoice with fully editable details. Nothing entered here is saved."
                }
              </p>
              <p className="text-amber-600 text-xs mt-2">
                {mode === "business" 
                  ? "Only your saved business details are remembered. Invoice content itself is generated for export and is not stored."
                  : "This custom invoice is generated for one-time use only. The details you enter here are not saved to your business profile or account."
                }
              </p>
            </div>
          </div>
        </div>

        {/* Mobile Sticky Action Bar */}
        <div className="sm:hidden sticky bottom-4 z-30 mt-4 mb-6">
          <div className="rounded-2xl border border-gray-200 bg-white/95 backdrop-blur shadow-[0_18px_40px_rgba(10,22,40,0.12)] px-4 pt-4 pb-5 flex gap-3">
            <button 
              onClick={handleExportPdf}
              disabled={exportingPdf}
              className="flex-1 flex items-center justify-center gap-2 bg-[#c9a84c] hover:bg-[#b8973b] text-[#0a1628] font-bold px-4 py-2.5 rounded-xl transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {exportingPdf ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#0a1628] border-t-transparent rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download PDF
                </>
              )}
            </button>
            {mode === "business" && (
              <button 
                onClick={saveBusinessSettings}
                className="flex-1 flex items-center justify-center gap-2 bg-white text-[#0a1628] border border-gray-200 hover:border-[#0a1628] font-bold px-4 py-2.5 rounded-xl transition-all text-sm"
              >
                <FileText className="w-4 h-4" /> 
                Save Settings
              </button>
            )}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          
          {/* Left: Premium Accordion Editor */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
              
              {/* Business / Sender */}
              <InvoiceAccordionSection
                id="business"
                title="Business / Sender"
                subtitle="Business details and contact information"
                summary={getBusinessSummary()}
                icon={Building}
                isOpen={openSections.includes("business")}
                onToggle={() => toggleSection("business")}
              >
                {mode === "business" && (
                  <div className="mb-4">
                    <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-2">Select Business</label>
                    <select
                      value={selectedBusinessId}
                      onChange={(e) => {
                        const nextId = e.target.value;
                        
                        isUserEditingRef.current = false;
                        loadedBusinessIdRef.current = null;
                        setBusinessInvoice(prev => ({
                          ...prev,
                          sender_name: "",
                          sender_logo_url: "",
                          sender_email: "",
                          sender_phone: "",
                          sender_address: "",
                          sender_suburb: "",
                          sender_city: "",
                          sender_state_region: "",
                          sender_postal_code: "",
                          sender_country: "",
                          payment_account_name: "",
                          payment_account_number: "",
                          payment_reference_label: "",
                          payment_terms: "",
                          brand_primary: "#0a1628",
                          brand_accent: "#c9a84c",
                          brand_text: "#0f172a",
                        }));
                        setSelectedBusinessId(nextId);
                      }}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#0d4f4f] bg-white text-[#0a1628]"
                    >
                      <option value="">Choose a business...</option>
                      {businesses.map((business) => (
                        <option key={business.id} value={business.id}>
                          {business.business_name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div><label className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">Business Name</label><input value={invoice.sender_name} onChange={e => setField("sender_name", e.target.value)} className={inputCls} /></div>
                  <div><label className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">Email</label><input value={invoice.sender_email} onChange={e => setField("sender_email", e.target.value)} className={inputCls} /></div>
                  <div><label className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">Phone</label><input value={invoice.sender_phone} onChange={e => setField("sender_phone", e.target.value)} className={inputCls} /></div>
                  <div><label className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">Address</label><input value={invoice.sender_address} onChange={e => setField("sender_address", e.target.value)} className={inputCls} /></div>
                </div>
              </InvoiceAccordionSection>

              {/* Invoice Details */}
              <InvoiceAccordionSection
                id="invoice"
                title="Invoice Details"
                subtitle="Invoice number, dates, and tax settings"
                summary={getInvoiceSummary()}
                icon={Calendar}
                isOpen={openSections.includes("invoice")}
                onToggle={() => toggleSection("invoice")}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div><label className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">Invoice #</label><input value={invoice.invoice_number} onChange={e => setField("invoice_number", e.target.value)} className={inputCls} /></div>
                  <div><label className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">Date</label><input type="date" value={invoice.date} onChange={e => setField("date", e.target.value)} className={inputCls} /></div>
                  <div><label className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">Due Date</label><input type="date" value={invoice.due_date} onChange={e => setField("due_date", e.target.value)} className={inputCls} /></div>
                  <div><label className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">Tax Rate (%)</label><input type="number" value={invoice.tax_rate || ""} onChange={e => setField("tax_rate", e.target.value)} className={inputCls} placeholder="Optional" /></div>
                  <div><label className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">Withholding Tax Rate (%)</label><input type="number" value={invoice.withholding_tax_rate || ""} onChange={e => setField("withholding_tax_rate", e.target.value)} className={inputCls} placeholder="Optional" /></div>
                </div>
              </InvoiceAccordionSection>

              {/* Client Details */}
              <InvoiceAccordionSection
                id="client"
                title="Client Details"
                subtitle="Billing client information"
                summary={getClientSummary()}
                icon={User}
                isOpen={openSections.includes("client")}
                onToggle={() => toggleSection("client")}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div><label className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">Client Name</label><input value={invoice.client_name} onChange={e => setField("client_name", e.target.value)} className={inputCls} /></div>
                  <div><label className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">Email</label><input value={invoice.client_email} onChange={e => setField("client_email", e.target.value)} className={inputCls} /></div>
                  <div><label className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">Phone</label><input value={invoice.client_phone} onChange={e => setField("client_phone", e.target.value)} className={inputCls} /></div>
                  <div><label className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">Address</label><textarea value={invoice.client_address} onChange={e => setField("client_address", e.target.value)} rows={2} className={`${inputCls} resize-none`} /></div>
                </div>
              </InvoiceAccordionSection>

              {/* Line Items */}
              <InvoiceAccordionSection
                id="items"
                title="Line Items"
                subtitle="Products, services, and pricing"
                summary={getItemsSummary()}
                icon={ShoppingCart}
                isOpen={openSections.includes("items")}
                onToggle={() => toggleSection("items")}
              >
                <div className="space-y-2">
                  {invoice.items.map((item, i) => (
                    <div key={i} className="rounded-xl border border-gray-200 p-3 space-y-3 sm:border-0 sm:p-0 sm:space-y-0">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input 
                          value={item.description} 
                          onChange={e => setItem(i, "description", e.target.value)} 
                          placeholder="Description" 
                          className="flex-1 text-sm text-gray-700 placeholder:text-gray-400 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#0d4f4f]" 
                        />
                        <div className="grid grid-cols-2 sm:flex gap-2">
                          <input 
                            type="number" 
                            value={item.quantity} 
                            onChange={e => setItem(i, "quantity", parseFloat(e.target.value)||0)} 
                            placeholder="Qty" 
                            className="w-full sm:w-16 text-center text-sm text-gray-700 placeholder:text-gray-400 border border-gray-200 rounded-lg px-2 py-2 focus:outline-none focus:border-[#0d4f4f]" 
                          />
                          <input 
                            type="number" 
                            value={item.unit_price} 
                            onChange={e => setItem(i, "unit_price", e.target.value)} 
                            placeholder="Price" 
                            className="w-full sm:w-24 text-right text-sm text-gray-700 placeholder:text-gray-400 border border-gray-200 rounded-lg px-2 py-2 focus:outline-none focus:border-[#0d4f4f]" 
                          />
                        </div>
                      </div>
                      <div className="flex justify-end sm:hidden">
                        <button 
                          onClick={() => removeItem(i)} 
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <button 
                        onClick={() => removeItem(i)} 
                        className="hidden sm:inline-flex p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button onClick={addItem} className="flex items-center gap-2 text-sm text-[#0d4f4f] hover:text-[#1a6b6b] font-medium">
                    <Plus className="w-4 h-4" /> Add line item
                  </button>
                </div>
              </InvoiceAccordionSection>

              {/* Charges & Adjustments */}
              <InvoiceAccordionSection
                id="adjustments"
                title="Charges & Adjustments"
                subtitle="Fees, discounts, and tax adjustments"
                summary={getAdjustmentsSummary()}
                icon={DollarSign}
                isOpen={openSections.includes("adjustments")}
                onToggle={() => toggleSection("adjustments")}
              >
                {invoice.adjustments.length > 0 ? (
                  <div className="space-y-3">
                    {invoice.adjustments.map((adj, i) => (
                      <div key={i} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex flex-col sm:flex-row items-start gap-3">
                          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <input
                              value={adj.label}
                              onChange={e => updateAdjustment(i, "label", e.target.value)}
                              placeholder="Label (e.g., Service Fee)"
                              className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#0d4f4f] bg-white text-[#0a1628] placeholder-gray-400"
                            />
                            <select
                              value={adj.kind}
                              onChange={e => updateAdjustment(i, "kind", e.target.value)}
                              className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#0d4f4f] bg-white text-[#0a1628]"
                            >
                              <option value="fee">Fee</option>
                              <option value="discount">Discount</option>
                            </select>
                            <select
                              value={adj.value_type}
                              onChange={e => updateAdjustment(i, "value_type", e.target.value)}
                              className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#0d4f4f] bg-white text-[#0a1628]"
                            >
                              <option value="fixed">Fixed Amount</option>
                              <option value="percent">Percentage</option>
                            </select>
                            <input
                              type="number"
                              value={adj.value}
                              onChange={e => updateAdjustment(i, "value", parseFloat(e.target.value) || 0)}
                              placeholder="Value"
                              className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#0d4f4f] bg-white text-[#0a1628] placeholder-gray-400"
                            />
                            <select
                              value={adj.apply_stage}
                              onChange={e => updateAdjustment(i, "apply_stage", e.target.value)}
                              className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#0d4f4f] bg-white text-[#0a1628]"
                            >
                              <option value="before_tax">Before Tax</option>
                              <option value="after_tax">After Tax</option>
                            </select>
                          </div>
                          <button
                            onClick={() => removeAdjustment(i)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm font-medium text-gray-700">No adjustments added</p>
                    <p className="text-xs mt-1 text-gray-500">Add fees or discounts that apply before or after tax</p>
                  </div>
                )}
                
                <button onClick={addAdjustment} className="flex items-center gap-2 text-sm text-[#0d4f4f] hover:text-[#1a6b6b] font-medium">
                  <Plus className="w-4 h-4" /> Add adjustment
                </button>
              </InvoiceAccordionSection>

              {/* Payment Details */}
              <InvoiceAccordionSection
                id="payment"
                title="Payment Details"
                subtitle="Bank account and payment instructions"
                summary={getPaymentSummary()}
                icon={CreditCard}
                isOpen={openSections.includes("payment")}
                onToggle={() => toggleSection("payment")}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div><label className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">Account Name</label><input value={invoice.payment_account_name} onChange={e => setField("payment_account_name", e.target.value)} className={inputCls} /></div>
                  <div><label className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">Account Number</label><input value={invoice.payment_account_number} onChange={e => setField("payment_account_number", e.target.value)} className={inputCls} /></div>
                  <div><label className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">Payment Reference Label</label><input value={invoice.payment_reference_label} onChange={e => setField("payment_reference_label", e.target.value)} placeholder="e.g., Use invoice number as reference" className={inputCls} /></div>
                  <div><label className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">Payment Terms</label><input value={invoice.payment_terms} onChange={e => setField("payment_terms", e.target.value)} placeholder="e.g., Due within 14 days" className={inputCls} /></div>
                </div>
              </InvoiceAccordionSection>

              {/* Brand & Footer */}
              <InvoiceAccordionSection
                id="brand"
                title="Brand & Notes"
                subtitle="Colours & notes"
                summary={getBrandSummary()}
                icon={Palette}
                isOpen={openSections.includes("brand")}
                onToggle={() => toggleSection("brand")}
              >
                <div className="space-y-4">
                  {/* Logo Upload */}
                  <div>
                    <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">Business Logo</label>
                    <div className="space-y-3">
                      {invoice.sender_logo_url && (
                        <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                          <img 
                            src={invoice.sender_logo_url} 
                            alt="Business logo" 
                            className="w-12 h-12 object-contain rounded border border-gray-200 bg-white"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-700">Logo uploaded</p>
                            <p className="text-xs text-gray-500">Click to replace or remove below</p>
                          </div>
                          <button
                            onClick={() => setField("sender_logo_url", "")}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                            title="Remove logo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-3">
                        <label className="flex-1 cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                          />
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#0d4f4f] hover:bg-[#0d4f4f]/5 transition-colors">
                            <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm font-medium text-gray-700">
                              {invoice.sender_logo_url ? "Replace logo" : "Upload logo"}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">Primary Colour</label>
                      <input type="color" value={invoice.brand_primary} onChange={e => setField("brand_primary", e.target.value)} className="w-full h-10 rounded-lg border border-gray-200 cursor-pointer" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">Accent Colour</label>
                      <input type="color" value={invoice.brand_accent} onChange={e => setField("brand_accent", e.target.value)} className="w-full h-10 rounded-lg border border-gray-200 cursor-pointer" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">Text Colour</label>
                      <input type="color" value={invoice.brand_text} onChange={e => setField("brand_text", e.target.value)} className="w-full h-10 rounded-lg border border-gray-200 cursor-pointer" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">Notes</label>
                    <textarea value={invoice.notes} onChange={e => setField("notes", e.target.value)} rows={3} placeholder="Payment terms, thank you note, etc..." className={`${inputCls} resize-none`} />
                  </div>
                  
                </div>
              </InvoiceAccordionSection>

            </div>
          </div>

          {/* Right: Sticky Preview */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-8">
              {/* Preview Header */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Live Preview</h3>
              </div>
              
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden invoice-preview" ref={printRef}>
                {/* Header */}
                <div className="bg-[#0a1628] text-white p-4 sm:p-8">
                  <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">
                    <div className="flex gap-4">
                      {/* Logo */}
                      {invoice.sender_logo_url ? (
                        <img
                          src={invoice.sender_logo_url}
                          alt="Business Logo"
                          className="w-16 h-16 rounded-lg object-cover border-2 border-white/20"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-[#0d4f4f] flex items-center justify-center border-2 border-white/20">
                          <FileText className="w-8 h-8 text-[#00c4cc]" />
                        </div>
                      )}

                      {/* Business Info */}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-sm">{invoice.sender_name || user?.full_name || "Your Business"}</span>
                        </div>
                        <p className="text-gray-400 text-xs">{invoice.sender_email}</p>
                        {invoice.sender_phone && <p className="text-gray-400 text-xs">{invoice.sender_phone}</p>}
                        {invoice.sender_address && <p className="text-gray-400 text-xs whitespace-pre-line">{invoice.sender_address}</p>}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-[#c9a84c] mb-1">INVOICE</div>
                      <div className="text-gray-300 text-sm">{invoice.invoice_number}</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 mb-6 sm:mb-8">
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Bill To</p>
                      <p className="font-semibold text-[#0a1628]">{invoice.client_name || "Client Name"}</p>
                      <p className="text-gray-500 text-sm">{invoice.client_email}</p>
                      {invoice.client_phone && <p className="text-gray-500 text-sm">{invoice.client_phone}</p>}
                      {invoice.client_address && <p className="text-gray-500 text-sm whitespace-pre-line">{invoice.client_address}</p>}
                    </div>
                    <div className="text-right">
                      <div className="mb-2">
                        <p className="text-xs text-gray-400 uppercase tracking-wider">Date</p>
                        <p className="font-semibold text-[#0a1628] text-sm">{invoice.date}</p>
                      </div>
                      {invoice.due_date && (
                        <div>
                          <p className="text-xs text-gray-400 uppercase tracking-wider">Due Date</p>
                          <p className="font-semibold text-[#0a1628] text-sm">{invoice.due_date}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Items Table */}
                  <table className="w-full mb-6 text-sm">
                    <thead>
                      <tr className="border-b-2 border-gray-100">
                        <th className="text-left py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Description</th>
                        <th className="text-center py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider w-16">Qty</th>
                        <th className="text-right py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider w-24">Price</th>
                        <th className="text-right py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider w-24">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.items.map((item, i) => (
                        <tr key={i} className="border-b border-gray-50">
                          <td className="py-3 text-sm text-gray-700">{item.description || "Item description"}</td>
                          <td className="py-3 text-center text-sm text-gray-700">{item.quantity}</td>
                          <td className="py-3 text-right text-sm text-gray-700">${item.unit_price || "0.00"}</td>
                          <td className="py-3 text-right font-semibold text-[#0a1628]">${((item.quantity || 0) * (parseFloat(item.unit_price) || 0)).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Adjustments Section */}
                  {invoice.adjustments.length > 0 && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Adjustments</h4>
                      <div className="space-y-1">
                        {invoice.adjustments.map((adj, i) => {
                          const adjustmentValue = adj.value_type === "percent"
                            ? (adj.apply_stage === "before_tax" ? subtotal : grossTotal) * (adj.value / 100)
                            : adj.value;
                          const displayValue = adj.kind === "fee" ? adjustmentValue : -adjustmentValue;

                          return (
                            <div key={i} className="flex justify-between text-sm">
                              <span className="text-gray-600">
                                {adj.label} ({adj.value_type === "percent" ? `${adj.value}%` : `$${adj.value}`})
                              </span>
                              <span className={`font-medium ${adj.kind === "fee" ? "text-red-600" : "text-green-600"}`}>
                                {adj.kind === "fee" ? "+" : "-"}${Math.abs(displayValue).toFixed(2)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Enhanced Totals Panel */}
                  <div className="border-t border-gray-200 pt-4 w-full sm:ml-auto sm:max-w-xs space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="font-semibold">${subtotal.toFixed(2)}</span>
                    </div>

                    {beforeTaxAdjustments !== 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Adjustments (before tax)</span>
                        <span className="font-semibold text-red-600">${beforeTaxAdjustments.toFixed(2)}</span>
                      </div>
                    )}

                    {taxRate > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Tax ({taxRate}%)</span>
                        <span className="font-semibold">${tax.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700 font-medium">Gross Total</span>
                      <span className="font-semibold">${grossTotal.toFixed(2)}</span>
                    </div>

                    {afterTaxAdjustments !== 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Adjustments (after tax)</span>
                        <span className="font-semibold text-red-600">${afterTaxAdjustments.toFixed(2)}</span>
                      </div>
                    )}

                    {withholdingTaxRate > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Withholding Tax ({withholdingTaxRate}%)</span>
                        <span className="font-semibold text-green-600">-${withholdingTax.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-lg font-bold text-[#0a1628] pt-3 border-t-2 border-gray-200">
                      <span>Total Payable</span>
                      <span className="text-[#c9a84c]">${totalPayable.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Payment Details Card */}
                  {(invoice.payment_account_name || invoice.payment_account_number) && (
                    <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Payment Details</h4>
                      <div className="space-y-2 text-sm">
                        {invoice.payment_account_name && (
                          <div>
                            <span className="text-gray-500">Account Name: </span>
                            <span className="font-medium">{invoice.payment_account_name}</span>
                          </div>
                        )}
                        {invoice.payment_account_number && (
                          <div>
                            <span className="text-gray-500">Account Number: </span>
                            <span className="font-medium">{invoice.payment_account_number}</span>
                          </div>
                        )}
                        {invoice.payment_reference_label && (
                          <div>
                            <span className="text-gray-500">Payment Reference: </span>
                            <span className="font-medium">{invoice.payment_reference_label}</span>
                          </div>
                        )}
                        {invoice.payment_terms && (
                          <div>
                            <span className="text-gray-500">Payment Terms: </span>
                            <span className="font-medium">{invoice.payment_terms}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {invoice.notes && (
                    <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-100">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Notes</p>
                      <p className="text-gray-500 text-sm whitespace-pre-line">{invoice.notes}</p>
                    </div>
                  )}

                  <div className="mt-8 pt-4 border-t border-gray-50 text-center">
                    <p className="text-xs text-gray-300">Thank You For Your Business</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <style>{`@media print { .no-print { display: none !important; } body { background: white; } .invoice-preview { box-shadow: none; border: none; transform: scale(0.9); transform-origin: top left; font-size: 12px; } .invoice-preview * { font-size: 0.92em; } }`}</style>
  </div>
);
}