/**
 * Client List Manager - Manual Approval System
 * 
 * Complete workflow for:
 * 1. Daily client discovery via Firecrawl
 * 2. Manual review and editing
 * 3. Bulk approval and grouping
 * 4. Email campaign management
 */

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  Building,
  CheckCircle,
  Clock,
  Download,
  Edit,
  Globe,
  Mail,
  Phone,
  RefreshCw,
  Save,
  Search,
  Send,
  Star,
  Users,
  XCircle
} from "lucide-react";
import { useState } from "react";
import { REGIONAL_GROUPS } from "../../data/searchLibrary";

// Sample data structure
const initialClients = [
  {
    id: "1",
    name: "Pacific Island Tours",
    website: "https://pacifictours.com",
    email: "info@pacifictours.com",
    phone: "+64 9-123-4567",
    category: "Tourism",
    region: "New Zealand",
    city: "Auckland",
    description: "Guided tours across Pacific islands",
    confidence: 85,
    discovered: "2026-04-05",
    status: "pending",
    editedBy: null,
    editedAt: null,
    notes: "",
    tags: ["tourism", "guides", "pacific"],
    socialMedia: {
      facebook: "https://facebook.com/pacifictours",
      instagram: "@pacifictours"
    }
  }
];

export function ClientListManager() {
  const [clients, setClients] = useState(initialClients);
  const [selectedClients, setSelectedClients] = useState([]);
  const [editingClient, setEditingClient] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRegion, setFilterRegion] = useState("all");
  const [activeTab, setActiveTab] = useState("discover");
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [discoveryProgress, setDiscoveryProgress] = useState(0);
  const [emailGroups, setEmailGroups] = useState([]);
  const [sendingEmails, setSendingEmails] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("Global");

  const { toast } = useToast();

  // Test simple API
  const testSimpleAPI = async () => {
    try {
      const response = await fetch('/api/test-simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "Simple API Test Successful",
          description: `Environment: ${result.data.environment.nodeEnv}, Firecrawl Key: ${result.data.environment.hasFirecrawlKey ? 'Yes' : 'No'}`,
        });
        console.log('Simple API test result:', result);
      } else {
        toast({
          title: "Simple API Test Failed",
          description: result.error,
          variant: "destructive"
        });
        console.error('Simple API test error:', result);
      }
    } catch (error) {
      toast({
        title: "Simple API Test Error",
        description: error.message,
        variant: "destructive"
      });
      console.error('Simple API test error:', error);
    }
  };

  // Discovery workflow
  const startDiscovery = async () => {
    setIsDiscovering(true);
    setDiscoveryProgress(0);

    try {
      setDiscoveryProgress(10);

      const response = await fetch('/api/client-discovery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'run_discovery',
          region: selectedRegion
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const result = await response.json();
      setDiscoveryProgress(50);

      if (!result.success) {
        throw new Error(result.error || 'Discovery failed');
      }

      const { data } = result;
      setDiscoveryProgress(80);

      const newClients = (data.stored || []).map((business, index) => ({
        id: business.id || `client-${Date.now()}-${index}`,
        name: business.name || "Unknown Business",
        website: business.website || "",
        email: business.email || "",
        phone: business.phone || "",
        category: business.category || "Other",
        region: business.region || data.schedule?.region || "Unknown",
        city: business.city || data.schedule?.cities?.[0] || "Unknown",
        description: business.description || "",
        confidence: business.confidence || 75,
        discovered: business.discovered || new Date().toISOString().split('T')[0],
        status: business.status || "pending",
        editedBy: business.editedBy || null,
        editedAt: business.editedAt || null,
        notes: business.notes || "",
        tags: business.tags || [],
        socialMedia: business.socialMedia || {}
      }));

      setClients(prev => [...newClients, ...prev]);
      setDiscoveryProgress(100);

      toast({
        title: "Discovery Complete",
        description: `Found ${data.discovered || 0} businesses, enriched ${data.enriched || 0}, stored ${data.stored?.length || 0} from ${data.schedule?.region || 'unknown region'}`,
      });

    } catch (error) {
      console.error('Discovery error:', error);
      console.error('Error details:', error);
      
      const errorMessage = error.message || 'An unknown error occurred during discovery';
      const errorDetails = error.details ? JSON.stringify(error.details, null, 2) : 'No additional details';
      
      toast({
        title: "Discovery Failed",
        description: errorMessage,
        variant: "destructive"
      });
      
      console.error('Full discovery error:', {
        message: errorMessage,
        details: errorDetails,
        stack: error.stack
      });
    } finally {
      setIsDiscovering(false);
      setTimeout(() => setDiscoveryProgress(0), 2000);
    }
  };

  // Export clients
  const exportClients = () => {
    const headers = [
      "ID", "Name", "Website", "Email", "Phone", "Category", "Region", "City",
      "Description", "Confidence", "Discovered", "Status", "Edited By", "Edited At",
      "Notes", "Tags", "Facebook", "Instagram"
    ];
    const rows = clients.map(client => [
      client.id, client.name, client.website, client.email, client.phone,
      client.category, client.region, client.city, client.description,
      client.confidence, client.discovered, client.status, client.editedBy,
      client.editedAt, client.notes, client.tags.join(', '),
      client.socialMedia?.facebook || '', client.socialMedia?.instagram || ''
    ]);

    let csvContent = "data:text/csv;charset=utf-8,"
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "clients.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Complete",
      description: `Exported ${clients.length} clients to CSV`,
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Client List Manager</h1>
          <p className="text-muted-foreground">
            Discover, review, and manage Pacific diaspora business clients
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportClients} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button 
            onClick={testSimpleAPI} 
            variant="outline"
            className="border-purple-500 text-purple-600 hover:bg-purple-50"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Test API
          </Button>
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Global">Global</SelectItem>
              {REGIONAL_GROUPS.map(region => (
                <SelectItem key={region} value={region}>{region}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={startDiscovery} disabled={isDiscovering}>
            {isDiscovering ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Search className="h-4 w-4 mr-2" />
            )}
            {isDiscovering ? 'Discovering...' : 'Start Discovery'}
          </Button>
        </div>
      </div>

      {isDiscovering && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Discovery Progress</span>
                <span className="text-sm text-muted-foreground">{discoveryProgress}%</span>
              </div>
              <Progress value={discoveryProgress} />
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <TabsTrigger value="review">Review & Edit</TabsTrigger>
          <TabsTrigger value="approve">Approve</TabsTrigger>
          <TabsTrigger value="email">Email Campaigns</TabsTrigger>
        </TabsList>

        <TabsContent value="discover" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Daily Discovery
              </CardTitle>
              <CardDescription>
                Automated discovery of Pacific diaspora businesses using Firecrawl
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Ready to Discover</h3>
                <p className="text-muted-foreground mb-4">
                  Select a region and click "Start Discovery" to begin finding Pacific businesses
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="review" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Review & Edit</CardTitle>
              <CardDescription>
                Review discovered businesses and edit their information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Edit className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Clients to Review</h3>
                <p className="text-muted-foreground">
                  Run discovery first to populate the client list
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approve" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Approve Clients</CardTitle>
              <CardDescription>
                Approve verified clients for outreach campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Clients to Approve</h3>
                <p className="text-muted-foreground">
                  Review and edit clients before approving them
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Campaigns</CardTitle>
              <CardDescription>
                Create and manage email campaigns for approved clients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Email Campaigns</h3>
                <p className="text-muted-foreground">
                  Approve clients first to create email campaigns
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
