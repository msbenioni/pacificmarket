/**
 * Firecrawl Demo Component
 * 
 * Demonstrates how to use Firecrawl for:
 * - Scraping business websites
 * - Enriching business data
 * - Batch processing
 */

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  useBatchEnricher,
  useBusinessCrawler,
  useBusinessEnricher,
  useBusinessScraper
} from "@/hooks/useFirecrawl";
import {
  CheckCircle,
  Download,
  Globe,
  Info,
  Play,
  RefreshCw,
  Search,
  XCircle
} from "lucide-react";
import { useState } from "react";

export function FirecrawlDemo() {
  const [url, setUrl] = useState("");
  const [businessData, setBusinessData] = useState(null);

  // Firecrawl hooks
  const scraper = useBusinessScraper();
  const crawler = useBusinessCrawler();
  const enricher = useBusinessEnricher();
  const batchEnricher = useBatchEnricher();
  const actionScraper = useActionScraper();
  const extractor = useStructuredExtractor();
  const browserSession = useBrowserSession();
  const advancedSearch = useAdvancedSearch();
  const batchScraper = useBatchScraper();

  // Sample business data for enrichment demo
  const sampleBusiness = {
    id: "demo-1",
    name: "Pacific Paradise Tours",
    website: "https://example.com",
    description: "Guided tours across the Pacific islands",
    category: "Tourism"
  };

  const handleScrape = async () => {
    if (!url.trim()) return;

    const result = await scraper.scrapeWebsite(url);
    if (result) {
      setBusinessData(result);
    }
  };

  const handleCrawl = async () => {
    if (!url.trim()) return;

    await crawler.crawlWebsite(url, { limit: 5 });
  };

  const handleEnrich = async () => {
    await enricher.enrichBusiness(sampleBusiness);
  };

  const handleBatchEnrich = async () => {
    const sampleBusinesses = [
      sampleBusiness,
      { ...sampleBusiness, id: "demo-2", name: "Island Adventures", website: "https://example2.com" },
      { ...sampleBusiness, id: "demo-3", name: "Pacific Diving Co", website: "https://example3.com" }
    ];

    await batchEnricher.enrichBatch(sampleBusinesses);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Firecrawl Demo</h1>
        <p className="text-muted-foreground">
          Test web scraping and business data enrichment capabilities
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          This demo requires a Firecrawl API key. Add <code>FIRECRAWL_API_KEY</code> to your environment variables to use these features.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="scraper" className="space-y-6">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="scraper">Scraper</TabsTrigger>
          <TabsTrigger value="crawler">Crawler</TabsTrigger>
          <TabsTrigger value="enricher">Enricher</TabsTrigger>
          <TabsTrigger value="batch">Batch</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
          <TabsTrigger value="extractor">AI Extract</TabsTrigger>
          <TabsTrigger value="browser">Browser</TabsTrigger>
          <TabsTrigger value="search">Search</TabsTrigger>
        </TabsList>

        {/* Single Page Scraper */}
        <TabsContent value="scraper" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Website Scraper
              </CardTitle>
              <CardDescription>
                Scrape a single webpage for business information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter website URL..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={handleScrape}
                  disabled={scraper.isLoading || !url.trim()}
                >
                  {scraper.isLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                  Scrape
                </Button>
              </div>

              {scraper.error && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>{scraper.error.message}</AlertDescription>
                </Alert>
              )}

              {scraper.data && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">Scraping successful!</span>
                  </div>

                  <div className="grid gap-4">
                    <div>
                      <label className="text-sm font-medium">Title</label>
                      <p className="text-sm text-muted-foreground">{scraper.data.title}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <p className="text-sm text-muted-foreground">{scraper.data.description}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Content Preview</label>
                      <Textarea
                        value={scraper.data.content?.substring(0, 500) + "..."}
                        readOnly
                        className="h-32"
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Multi-Page Crawler */}
        <TabsContent value="crawler" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Website Crawler
              </CardTitle>
              <CardDescription>
                Crawl multiple pages from a website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter website URL..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={handleCrawl}
                  disabled={crawler.isLoading || !url.trim()}
                >
                  {crawler.isLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  Crawl
                </Button>
              </div>

              {crawler.error && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>{crawler.error.message}</AlertDescription>
                </Alert>
              )}

              {crawler.pages.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">
                      Crawled {crawler.pages.length} pages
                    </span>
                  </div>

                  <div className="space-y-2">
                    {crawler.pages.map((page, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <p className="text-sm font-medium">{page.title}</p>
                          <p className="text-xs text-muted-foreground">{page.url}</p>
                        </div>
                        <Badge variant="secondary">
                          {page.content?.length || 0} chars
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Enricher */}
        <TabsContent value="enricher" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Business Enricher
              </CardTitle>
              <CardDescription>
                Enrich existing business data with web scraping
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded bg-muted/50">
                <h4 className="font-medium">Sample Business</h4>
                <p className="text-sm text-muted-foreground">{sampleBusiness.name}</p>
                <p className="text-sm text-muted-foreground">{sampleBusiness.website}</p>
              </div>

              <Button
                onClick={handleEnrich}
                disabled={enricher.isLoading}
                className="w-full"
              >
                {enricher.isLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                Enrich Business Data
              </Button>

              {enricher.error && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>{enricher.error.message}</AlertDescription>
                </Alert>
              )}

              {enricher.enrichedBusiness && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">Business enriched successfully!</span>
                  </div>

                  <div className="grid gap-4">
                    <div>
                      <label className="text-sm font-medium">Extracted Info</label>
                      <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                        {JSON.stringify(enricher.enrichedBusiness.enriched?.extractedInfo, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Batch Processor */}
        <TabsContent value="batch" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                Batch Enricher
              </CardTitle>
              <CardDescription>
                Process multiple businesses at once
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded bg-muted/50">
                <h4 className="font-medium">Sample Batch (3 businesses)</h4>
                <p className="text-sm text-muted-foreground">Pacific Paradise Tours, Island Adventures, Pacific Diving Co</p>
              </div>

              <Button
                onClick={handleBatchEnrich}
                disabled={batchEnricher.isLoading}
                className="w-full"
              >
                {batchEnricher.isLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Process Batch
              </Button>

              {batchEnricher.isLoading && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Processing...</span>
                    <Badge variant="secondary">{batchEnricher.progress}%</Badge>
                  </div>
                  <Progress value={batchEnricher.progress} />
                </div>
              )}

              {batchEnricher.error && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>{batchEnricher.error.message}</AlertDescription>
                </Alert>
              )}

              {batchEnricher.results.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">
                      Batch complete: {batchEnricher.results.filter(r => r.success).length} successful
                    </span>
                  </div>

                  <div className="space-y-2">
                    {batchEnricher.results.map((result, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <p className="text-sm font-medium">{result.business.name}</p>
                          <p className="text-xs text-muted-foreground">{result.business.website}</p>
                        </div>
                        <Badge variant={result.success ? "default" : "destructive"}>
                          {result.success ? "Success" : "Failed"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Actions Scraper */}
        <TabsContent value="actions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                Dynamic Actions Scraper
              </CardTitle>
              <CardDescription>
                Scrape websites with custom actions (click, scroll, fill forms)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="Enter website URL..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button
                    onClick={() => actionScraper.scrapeWithActions(url, [
                      { type: 'wait', milliseconds: 1000 },
                      { type: 'scroll', direction: 'down' },
                      { type: 'screenshot' }
                    ])}
                    disabled={actionScraper.isLoading || !url.trim()}
                  >
                    {actionScraper.isLoading ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                    Scrape with Actions
                  </Button>
                </div>
              </div>

              {actionScraper.error && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>{actionScraper.error.message}</AlertDescription>
                </Alert>
              )}

              {actionScraper.data && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">Actions executed successfully!</span>
                  </div>

                  {actionScraper.data.screenshot && (
                    <div>
                      <label className="text-sm font-medium">Screenshot Available</label>
                      <p className="text-xs text-muted-foreground">Screenshot captured during scraping</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Structured Extractor */}
        <TabsContent value="extractor" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                AI-Powered Extraction
              </CardTitle>
              <CardDescription>
                Extract structured data using AI and custom schemas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="Enter website URL..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <Button
                  onClick={() => extractor.extractData(url, "Extract business name, contact info, and services", {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      email: { type: "string" },
                      phone: { type: "string" },
                      services: { type: "array", items: { type: "string" } }
                    }
                  })}
                  disabled={extractor.isLoading || !url.trim()}
                >
                  {extractor.isLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                  Extract Structured Data
                </Button>
              </div>

              {extractor.error && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>{extractor.error.message}</AlertDescription>
                </Alert>
              )}

              {extractor.extractedData && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">Data extracted successfully!</span>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Extracted Data</label>
                    <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                      {JSON.stringify(extractor.extractedData.data, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Browser Session */}
        <TabsContent value="browser" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Browser Automation
              </CardTitle>
              <CardDescription>
                Control a remote browser session for complex interactions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button
                  onClick={() => browserSession.startSession()}
                  disabled={browserSession.isLoading}
                >
                  {browserSession.isLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                  Start Browser Session
                </Button>

                {browserSession.session && (
                  <>
                    <Button
                      onClick={() => browserSession.executeCode(`
                        await page.goto("https://example.com");
                        const title = await page.title();
                        console.log(title);
                      `)}
                      disabled={browserSession.isLoading}
                      variant="outline"
                    >
                      Navigate & Get Title
                    </Button>

                    <Button
                      onClick={() => browserSession.closeSession()}
                      variant="destructive"
                    >
                      Close Session
                    </Button>
                  </>
                )}
              </div>

              {browserSession.error && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>{browserSession.error.message}</AlertDescription>
                </Alert>
              )}

              {browserSession.session && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">Browser session active!</span>
                  </div>

                  <div className="grid gap-2 text-sm">
                    <div><strong>Session ID:</strong> {browserSession.session.sessionId}</div>
                    <div><strong>Live View:</strong>
                      <a href={browserSession.session.liveViewUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline ml-1">
                        Open Live View
                      </a>
                    </div>
                    <div><strong>Interactive:</strong>
                      <a href={browserSession.session.interactiveLiveViewUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline ml-1">
                        Interactive View
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Search */}
        <TabsContent value="search" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Advanced Web Search
              </CardTitle>
              <CardDescription>
                Search the web with filtering and scraping capabilities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="Enter search query..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <Button
                  onClick={() => advancedSearch.performSearch(url, {
                    sources: ['web', 'news'],
                    limit: 5
                  })}
                  disabled={advancedSearch.isLoading || !url.trim()}
                >
                  {advancedSearch.isLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                  Search Web
                </Button>
              </div>

              {advancedSearch.error && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>{advancedSearch.error.message}</AlertDescription>
                </Alert>
              )}

              {advancedSearch.searchResults && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">Search completed!</span>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Web Results</label>
                    {advancedSearch.searchResults.results?.web?.map((result, index) => (
                      <div key={index} className="p-2 border rounded">
                        <div className="font-medium text-sm">{result.title}</div>
                        <div className="text-xs text-muted-foreground">{result.url}</div>
                        <div className="text-xs text-muted-foreground">{result.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
