/**
 * Client List Manager — Two-step discovery workflow
 * 
 * Step 1: FIND — Search for Pacific businesses by country (lightweight, returns URLs)
 * Step 2: SCRAPE — Deep-scrape selected URLs to extract full details (name, email, phone, etc.)
 * 
 * Additional tabs: Scraped Businesses, Create Listings, Email Outreach
 */

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  CheckCircle,
  Download,
  ExternalLink,
  Globe,
  Mail,
  Plus,
  RefreshCw,
  Search,
  Send,
  Trash2,
  Users,
  X
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

// Countries available for search
const COUNTRIES = [
  'New Zealand', 'Australia', 'Samoa', 'Fiji', 'Tonga',
  'Hawaii', 'Papua New Guinea', 'Cook Islands', 'French Polynesia',
  'Vanuatu', 'Solomon Islands',
];

export function ClientListManager() {
  // ── Tab state (persisted) ──
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('clm-active-tab') || 'find';
    }
    return 'find';
  });
  const changeTab = (val) => {
    setActiveTab(val);
    if (typeof window !== 'undefined') localStorage.setItem('clm-active-tab', val);
  };

  // ── Step 1: Find state ──
  const [selectedCountry, setSelectedCountry] = useState('New Zealand');
  const [customQuery, setCustomQuery] = useState('');
  const [isFinding, setIsFinding] = useState(false);
  const [foundUrls, setFoundUrls] = useState([]); // { url, title, description, domain, country, selected: true }

  // ── Step 2: Scrape state ──
  const [isScraping, setIsScraping] = useState(false);
  const [scrapeProgress, setScrapeProgress] = useState({ current: 0, total: 0 });
  const [scrapeUrl, setScrapeUrl] = useState('');

  // ── Scraped businesses state (from Supabase) ──
  const [businesses, setBusinesses] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  // ── Listings & Email state ──
  const [isCreatingListings, setIsCreatingListings] = useState(false);
  const [isSendingEmails, setIsSendingEmails] = useState(false);
  const [emailSubject, setEmailSubject] = useState('Partnership Opportunity — Pacific Discovery Network');
  const [emailBody, setEmailBody] = useState(
    `<p>Kia ora {{name}},</p>
<p>We discovered your business through our Pacific Discovery Network and would love to connect with you.</p>
<p>Pacific Discovery Network is a platform dedicated to supporting and promoting Pacific diaspora businesses. We'd love to feature your business on our directory — completely free.</p>
<p>Would you be interested in learning more?</p>
<p>Warm regards,<br/>Pacific Discovery Network Team</p>`
  );

  const { toast } = useToast();

  // ════════════════════════════════════════════
  //  Step 1: Find businesses (search only)
  // ════════════════════════════════════════════
  const findBusinesses = async () => {
    setIsFinding(true);
    try {
      const res = await fetch('/api/client-discovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'find_businesses',
          country: selectedCountry,
          customQuery: customQuery.trim() || undefined,
        })
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.error || 'Search failed');

      const found = (result.data.businesses || []).map(b => ({ ...b, selected: true }));
      setFoundUrls(found);
      toast({
        title: 'Search Complete',
        description: `Found ${found.length} businesses in ${result.data.country} (${result.data.duration})`,
      });
    } catch (err) {
      console.error('Find error:', err);
      toast({ title: 'Search Failed', description: err.message, variant: 'destructive' });
    } finally {
      setIsFinding(false);
    }
  };

  // Toggle a found URL selection
  const toggleFoundUrl = (index) => {
    setFoundUrls(prev => prev.map((item, i) => i === index ? { ...item, selected: !item.selected } : item));
  };

  // Remove a found URL from the list
  const removeFoundUrl = (index) => {
    setFoundUrls(prev => prev.filter((_, i) => i !== index));
  };

  // Select / deselect all found URLs
  const toggleAllFoundUrls = () => {
    const allSelected = foundUrls.every(u => u.selected);
    setFoundUrls(prev => prev.map(u => ({ ...u, selected: !allSelected })));
  };

  // ════════════════════════════════════════════
  //  Step 2: Scrape selected URLs
  // ════════════════════════════════════════════
  const scrapeSelectedUrls = async () => {
    const urlsToScrape = foundUrls.filter(u => u.selected).map(u => u.url);
    if (urlsToScrape.length === 0) {
      toast({ title: 'No URLs Selected', description: 'Select at least one URL to scrape', variant: 'destructive' });
      return;
    }

    setIsScraping(true);
    setScrapeProgress({ current: 0, total: urlsToScrape.length });

    try {
      const res = await fetch('/api/client-discovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'scrape_urls',
          urls: urlsToScrape,
          country: selectedCountry,
        })
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.error || 'Scrape failed');

      setScrapeProgress({ current: urlsToScrape.length, total: urlsToScrape.length });
      toast({
        title: 'Scrape Complete',
        description: `Scraped: ${result.data.scraped}, Failed: ${result.data.failed} (${result.data.duration})`,
      });

      // Remove scraped URLs from the found list
      const scrapedDomains = new Set(urlsToScrape.map(u => { try { return new URL(u).hostname; } catch { return ''; } }));
      setFoundUrls(prev => prev.filter(u => { try { return !scrapedDomains.has(new URL(u.url).hostname); } catch { return true; } }));

      // Switch to scraped businesses tab and reload
      changeTab('scraped');
      await loadBusinesses();
    } catch (err) {
      console.error('Scrape error:', err);
      toast({ title: 'Scrape Failed', description: err.message, variant: 'destructive' });
    } finally {
      setIsScraping(false);
      setTimeout(() => setScrapeProgress({ current: 0, total: 0 }), 2000);
    }
  };

  // Scrape a single URL manually
  const scrapeSingleUrl = async () => {
    const url = scrapeUrl.trim();
    if (!url) return;
    if (!/^https?:\/\//i.test(url)) {
      toast({ title: 'Invalid URL', description: 'URL must start with http:// or https://', variant: 'destructive' });
      return;
    }
    setIsScraping(true);
    try {
      const res = await fetch('/api/client-discovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'scrape_url', url, country: selectedCountry })
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.error || 'Scrape failed');

      const biz = result.data.businesses?.[0];
      toast({
        title: 'Business Scraped',
        description: biz ? `${biz.name} — ${biz.email || 'no email found'}` : 'Saved to database',
      });
      setScrapeUrl('');
      await loadBusinesses();
    } catch (err) {
      toast({ title: 'Scrape Failed', description: err.message, variant: 'destructive' });
    } finally {
      setIsScraping(false);
    }
  };

  // ════════════════════════════════════════════
  //  Scraped businesses (from Supabase)
  // ════════════════════════════════════════════
  const loadBusinesses = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus !== 'all') params.set('status', filterStatus);
      if (searchQuery) params.set('search', searchQuery);

      const res = await fetch(`/api/discovered-businesses?${params}`);
      const result = await res.json();
      if (result.success) setBusinesses(result.data || []);
    } catch (err) {
      console.error('Failed to load businesses:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filterStatus, searchQuery]);

  useEffect(() => {
    loadBusinesses();
  }, [loadBusinesses]);

  // Toggle selection in scraped list
  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };
  const toggleSelectAll = () => {
    if (selectedIds.size === businesses.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(businesses.map(b => b.id)));
  };

  const selectedBusinesses = businesses.filter(b => selectedIds.has(b.id));
  const selectedWithEmail = selectedBusinesses.filter(b => b.email);

  // Update status
  const updateStatus = async (id, status) => {
    try {
      const res = await fetch('/api/discovered-businesses', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      const result = await res.json();
      if (result.success) {
        setBusinesses(prev => prev.map(b => b.id === id ? { ...b, status } : b));
        toast({ title: 'Status Updated', description: `Business marked as ${status}` });
      }
    } catch (err) {
      toast({ title: 'Update Failed', description: err.message, variant: 'destructive' });
    }
  };

  // Delete
  const deleteBusiness = async (id) => {
    try {
      const res = await fetch(`/api/discovered-businesses?id=${id}`, { method: 'DELETE' });
      const result = await res.json();
      if (result.success) {
        setBusinesses(prev => prev.filter(b => b.id !== id));
        setSelectedIds(prev => { const n = new Set(prev); n.delete(id); return n; });
        toast({ title: 'Deleted', description: 'Business removed' });
      }
    } catch (err) {
      toast({ title: 'Delete Failed', description: err.message, variant: 'destructive' });
    }
  };

  // Create listings
  const createListings = async () => {
    if (selectedIds.size === 0) return;
    setIsCreatingListings(true);
    try {
      const res = await fetch('/api/create-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ discoveredBusinessIds: [...selectedIds] })
      });
      const result = await res.json();
      if (result.success) {
        toast({ title: 'Listings Created', description: `Created ${result.data.created} listings` });
        setSelectedIds(new Set());
        await loadBusinesses();
      } else throw new Error(result.error);
    } catch (err) {
      toast({ title: 'Create Failed', description: err.message, variant: 'destructive' });
    } finally {
      setIsCreatingListings(false);
    }
  };

  // Send emails
  const sendEmails = async () => {
    if (selectedWithEmail.length === 0) return;
    setIsSendingEmails(true);
    try {
      const res = await fetch('/api/send-outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessIds: selectedWithEmail.map(b => b.id),
          subject: emailSubject,
          htmlContent: emailBody,
        })
      });
      const result = await res.json();
      if (result.success) {
        toast({ title: 'Emails Sent', description: `Sent: ${result.data.sent}, Failed: ${result.data.failed}` });
      } else throw new Error(result.error);
    } catch (err) {
      toast({ title: 'Send Failed', description: err.message, variant: 'destructive' });
    } finally {
      setIsSendingEmails(false);
    }
  };

  // Export CSV
  const exportCSV = () => {
    const source = selectedIds.size > 0 ? selectedBusinesses : businesses;
    const headers = ['Name', 'Website', 'Email', 'Phone', 'Region', 'Category', 'Confidence', 'Status'];
    const rows = source.map(b => [
      b.name, b.website, b.email, b.phone, b.region, b.category, b.confidence, b.status
    ].map(v => `"${(v || '').toString().replace(/"/g, '""')}"`));
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `discovered-businesses-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Exported', description: `${source.length} businesses exported to CSV` });
  };

  // ════════════════════════════════════════════
  //  RENDER
  // ════════════════════════════════════════════
  const selectedFoundCount = foundUrls.filter(u => u.selected).length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Client Discovery</h1>
          <p className="text-muted-foreground">
            Find Pacific businesses → Review → Scrape details → Create listings
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={exportCSV} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={loadBusinesses} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />Refresh
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={changeTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="find">
            <Search className="h-4 w-4 mr-1" />Find
          </TabsTrigger>
          <TabsTrigger value="review">
            <Globe className="h-4 w-4 mr-1" />Review ({foundUrls.length})
          </TabsTrigger>
          <TabsTrigger value="scraped">
            <CheckCircle className="h-4 w-4 mr-1" />Scraped ({businesses.length})
          </TabsTrigger>
          <TabsTrigger value="listings">
            <Plus className="h-4 w-4 mr-1" />Listings
          </TabsTrigger>
          <TabsTrigger value="email">
            <Mail className="h-4 w-4 mr-1" />Email
          </TabsTrigger>
        </TabsList>

        {/* ═══ Tab 1: FIND ═══ */}
        <TabsContent value="find" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Step 1: Find Pacific Businesses</CardTitle>
              <CardDescription>
                Search by country to get a list of business URLs. This is a lightweight search — no deep scraping yet.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Country</Label>
                  <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Countries">All Countries</SelectItem>
                      {COUNTRIES.map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label>Custom Search Query (optional)</Label>
                  <Input
                    placeholder="e.g. Pacific restaurant Auckland"
                    value={customQuery}
                    onChange={e => setCustomQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && findBusinesses()}
                  />
                </div>
              </div>

              <Button onClick={findBusinesses} disabled={isFinding} className="w-full">
                {isFinding ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
                {isFinding ? 'Searching...' : `Search ${selectedCountry}`}
              </Button>

              {foundUrls.length > 0 && (
                <div className="border rounded-lg p-3 bg-green-50 text-green-800 text-sm">
                  Found <strong>{foundUrls.length}</strong> businesses. Go to the <strong>Review</strong> tab to remove unwanted entries, then scrape the rest.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Single URL scrape */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Scrape a Single URL</CardTitle>
              <CardDescription>
                Already have a business URL? Paste it here to scrape homepage + /contact/ page directly.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="https://pacificbusinessnetworks.com"
                  value={scrapeUrl}
                  onChange={e => setScrapeUrl(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && scrapeSingleUrl()}
                  className="flex-1"
                />
                <Button onClick={scrapeSingleUrl} disabled={isScraping}>
                  {isScraping ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Globe className="h-4 w-4 mr-2" />}
                  {isScraping ? 'Scraping...' : 'Scrape'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══ Tab 2: REVIEW ═══ */}
        <TabsContent value="review" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Step 2: Review & Remove</CardTitle>
              <CardDescription>
                Review the found URLs. Remove any that aren&apos;t real businesses, then scrape the remaining ones.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {foundUrls.length === 0 ? (
                <div className="text-center py-8">
                  <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No URLs to Review</h3>
                  <p className="text-muted-foreground mb-4">Go to the Find tab and search for businesses first.</p>
                  <Button variant="outline" onClick={() => changeTab('find')}>Go to Find</Button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      <strong>{selectedFoundCount}</strong> of {foundUrls.length} selected for scraping
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={toggleAllFoundUrls}>
                        {foundUrls.every(u => u.selected) ? 'Deselect All' : 'Select All'}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2 max-h-[500px] overflow-y-auto">
                    {foundUrls.map((item, i) => (
                      <div key={`${item.url}-${i}`} className={`flex items-center gap-3 p-3 border rounded-lg transition-colors ${item.selected ? 'bg-accent/50 border-primary/30' : 'opacity-50'}`}>
                        <input
                          type="checkbox"
                          checked={item.selected}
                          onChange={() => toggleFoundUrl(i)}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium truncate">{item.title || item.domain}</span>
                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {item.domain}
                            {item.description && <span className="ml-2">— {item.description.slice(0, 100)}</span>}
                          </div>
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => removeFoundUrl(i)} title="Remove">
                          <X className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* Scrape progress */}
                  {isScraping && scrapeProgress.total > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Scraping {scrapeProgress.current} of {scrapeProgress.total}...</span>
                        <span>{Math.round((scrapeProgress.current / scrapeProgress.total) * 100)}%</span>
                      </div>
                      <Progress value={(scrapeProgress.current / scrapeProgress.total) * 100} />
                    </div>
                  )}

                  <Button onClick={scrapeSelectedUrls} disabled={isScraping || selectedFoundCount === 0} className="w-full">
                    {isScraping ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Globe className="h-4 w-4 mr-2" />}
                    {isScraping ? 'Scraping...' : `Scrape ${selectedFoundCount} URL${selectedFoundCount !== 1 ? 's' : ''}`}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══ Tab 3: SCRAPED BUSINESSES ═══ */}
        <TabsContent value="scraped" className="space-y-4">
          <div className="flex gap-3 flex-wrap">
            <Input
              placeholder="Search by name, email, website..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-64"
            />
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={toggleSelectAll}>
              <Users className="h-4 w-4 mr-2" />
              {selectedIds.size === businesses.length && businesses.length > 0 ? 'Deselect All' : 'Select All'}
            </Button>
          </div>

          <Card>
            <CardContent className="pt-6">
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading businesses...</div>
              ) : businesses.length === 0 ? (
                <div className="text-center py-8">
                  <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Scraped Businesses Yet</h3>
                  <p className="text-muted-foreground mb-4">Find businesses first, then scrape their URLs to populate this list.</p>
                  <Button variant="outline" onClick={() => changeTab('find')}>Go to Find</Button>
                </div>
              ) : (
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {businesses.map(biz => (
                    <div key={biz.id} className={`flex items-center gap-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors ${selectedIds.has(biz.id) ? 'bg-accent border-primary' : ''}`}>
                      <input
                        type="checkbox"
                        checked={selectedIds.has(biz.id)}
                        onChange={() => toggleSelect(biz.id)}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate">{biz.name}</span>
                          {biz.website && (
                            <a href={biz.website} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                          <span className={`text-xs px-2 py-0.5 rounded-full ${biz.status === 'approved' ? 'bg-green-100 text-green-700' :
                              biz.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                'bg-yellow-100 text-yellow-700'
                            }`}>{biz.status}</span>
                          <span className="text-xs text-muted-foreground">conf: {biz.confidence}%</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          {biz.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{biz.email}</span>}
                          {biz.phone && <span>{biz.phone}</span>}
                          {biz.region && <span className="flex items-center gap-1"><Globe className="h-3 w-3" />{biz.region}</span>}
                        </div>
                        {biz.description && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{biz.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {biz.status === 'pending' && (
                          <>
                            <Button size="sm" variant="ghost" onClick={() => updateStatus(biz.id, 'approved')} title="Approve">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => updateStatus(biz.id, 'rejected')} title="Reject">
                              <X className="h-4 w-4 text-red-500" />
                            </Button>
                          </>
                        )}
                        <Button size="sm" variant="ghost" onClick={() => deleteBusiness(biz.id)} title="Delete">
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══ Tab 4: CREATE LISTINGS ═══ */}
        <TabsContent value="listings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Plus className="h-5 w-5" />Create Business Listings</CardTitle>
              <CardDescription>Convert selected scraped businesses into platform listings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedIds.size === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Businesses Selected</h3>
                  <p className="text-muted-foreground mb-4">Go to the Scraped tab and select businesses first.</p>
                  <Button variant="outline" onClick={() => changeTab('scraped')}>Go to Scraped</Button>
                </div>
              ) : (
                <>
                  <div className="border rounded-lg p-4 bg-muted/50">
                    <h4 className="font-medium mb-2">{selectedIds.size} businesses selected:</h4>
                    <div className="space-y-1 max-h-[200px] overflow-y-auto">
                      {selectedBusinesses.map(b => (
                        <div key={b.id} className="flex items-center justify-between text-sm">
                          <span>{b.name}</span>
                          <span className="text-muted-foreground">{b.website || 'No website'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button onClick={createListings} disabled={isCreatingListings} className="w-full">
                    {isCreatingListings ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                    {isCreatingListings ? 'Creating...' : `Create ${selectedIds.size} Listing${selectedIds.size > 1 ? 's' : ''}`}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══ Tab 5: EMAIL OUTREACH ═══ */}
        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Mail className="h-5 w-5" />Email Outreach</CardTitle>
              <CardDescription>
                Send outreach emails to selected businesses. Use {'{{name}}'}, {'{{website}}'}, {'{{region}}'} for personalization.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-lg p-4 bg-muted/50">
                <p className="text-sm">
                  <strong>{selectedIds.size}</strong> selected • <strong>{selectedWithEmail.length}</strong> have email
                </p>
                {selectedIds.size > 0 && selectedWithEmail.length === 0 && (
                  <p className="text-sm text-red-500 mt-1">None of the selected businesses have email addresses</p>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="email-subject">Subject</Label>
                  <Input id="email-subject" value={emailSubject} onChange={e => setEmailSubject(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="email-body">Email Body (HTML)</Label>
                  <Textarea id="email-body" value={emailBody} onChange={e => setEmailBody(e.target.value)} rows={10} className="font-mono text-sm" />
                </div>
              </div>

              {selectedWithEmail.length > 0 && (
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Recipients ({selectedWithEmail.length}):</h4>
                  <div className="space-y-1 max-h-[150px] overflow-y-auto">
                    {selectedWithEmail.map(b => (
                      <div key={b.id} className="flex items-center justify-between text-sm">
                        <span>{b.name}</span>
                        <span className="text-muted-foreground">{b.email}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button onClick={sendEmails} disabled={isSendingEmails || selectedWithEmail.length === 0} className="w-full">
                {isSendingEmails ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                {isSendingEmails ? 'Sending...' : `Send to ${selectedWithEmail.length} Business${selectedWithEmail.length !== 1 ? 'es' : ''}`}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
