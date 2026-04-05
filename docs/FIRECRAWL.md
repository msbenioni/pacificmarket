### Installation and Initialization

Source: https://docs.firecrawl.dev/sdks/node

Instructions on how to install the Firecrawl Node.js SDK and initialize it with an API key.

```APIDOC
## Installation

To install the Firecrawl Node SDK, you can use npm:

```bash
npm install @mendable/firecrawl-js
```

## Initialization

Initialize the Firecrawl SDK with your API key. You can either set it as an environment variable `FIRECRAWL_API_KEY` or pass it directly during instantiation.

```javascript
import Firecrawl from '@mendable/firecrawl-js';

// Using an API key directly
const firecrawl = new Firecrawl({ apiKey: "fc-YOUR-API-KEY" });

// Or, if the API key is set as an environment variable
// const firecrawl = new Firecrawl(); 
```
```

--------------------------------

### Setup Firecrawl and LangChain environment

Source: https://docs.firecrawl.dev/developer-guides/llm-sdks-and-frameworks/langchain

Install the necessary dependencies and configure environment variables for API authentication. This is the prerequisite for all Firecrawl and LangChain workflows.

```bash
npm install @langchain/openai @mendable/firecrawl-js
```

```bash
FIRECRAWL_API_KEY=your_firecrawl_key
OPENAI_API_KEY=your_openai_key
```

--------------------------------

### Browser Sandbox API

Source: https://docs.firecrawl.dev

Provides a secure browser environment for agents to interact with the web, including filling forms, clicking buttons, and authentication, without local setup.

```APIDOC
## Browser Sandbox API

### Description
Firecrawl Browser Sandbox gives your agents a secure browser environment to interact with the web. You can fill out forms, click buttons, authenticate, and more, without needing local setup or Chromium installs.

### Method
POST (for launching/executing), DELETE (for closing)

### Endpoints
1. **Launch a session**: `/v2/browser`
2. **Execute code**: `/v2/browser/{YOUR_SESSION_ID}/execute`
3. **Close session**: `/v2/browser/{YOUR_SESSION_ID}`

### Parameters
#### Launch Session (POST `/v2/browser`)
No specific parameters mentioned in the example.

#### Execute Code (POST `/v2/browser/{YOUR_SESSION_ID}/execute`)
##### Path Parameters
- **YOUR_SESSION_ID** (string) - Required - The ID of the browser session to execute code in.
##### Request Body
- **code** (string) - Required - The JavaScript code to execute within the browser page.

#### Close Session (DELETE `/v2/browser/{YOUR_SESSION_ID}`)
##### Path Parameters
- **YOUR_SESSION_ID** (string) - Required - The ID of the browser session to close.

### Request Examples (cURL)

**1. Launch a session**
```bash
curl -X POST "https://api.firecrawl.dev/v2/browser" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -H "Content-Type: application/json"
```

**2. Execute code**
```bash
curl -X POST "https://api.firecrawl.dev/v2/browser/YOUR_SESSION_ID/execute" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{ 
    "code": "await page.goto(\"https://news.ycombinator.com\")\ntitle = await page.title()\nprint(title)"
  }'
```

**3. Close session**
```bash
curl -X DELETE "https://api.firecrawl.dev/v2/browser/YOUR_SESSION_ID" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY"
```

### Response
#### Success Response (200)
**Launch Session Response:**
- **success** (boolean) - Indicates if the request was successful.
- **id** (string) - The unique ID for the new browser session.
- **cdpUrl** (string) - The WebSocket URL for the Chrome DevTools Protocol.
- **liveViewUrl** (string) - A URL to view the browser session live.
- **interactiveLiveViewUrl** (string) - A URL to interactively view the browser session.

**Execute Code Response:**
- **success** (boolean) - Indicates if the code execution was successful.
- **result** (any) - The result of the executed code (e.g., printed output, return values).

#### Response Example (Launch Session)
```json
{
  "success": true,
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "cdpUrl": "wss://cdp-proxy.firecrawl.dev/cdp/550e8400-...",
  "liveViewUrl": "https://liveview.firecrawl.dev/550e8400-மையில்...",
  "interactiveLiveViewUrl": "https://liveview.firecrawl.dev/550e8400-...?interactive=true"
}
```
```

--------------------------------

### Run Brand Style Guide Generator

Source: https://docs.firecrawl.dev/developer-guides/cookbooks/brand-style-guide-generator-cookbook

Executes the style guide generation script. Ensure the URL constant is configured in index.ts before running.

```bash
npm start
```

--------------------------------

### Install Dependencies and Configure Environment

Source: https://docs.firecrawl.dev/developer-guides/llm-sdks-and-frameworks/openai

Commands to install the necessary Node.js packages and set up the required environment variables for API authentication.

```bash
npm install @mendable/firecrawl-js openai zod
```

```bash
FIRECRAWL_API_KEY=your_firecrawl_key
OPENAI_API_KEY=your_openai_key
```

--------------------------------

### Install Firecrawl Go SDK

Source: https://docs.firecrawl.dev/sdks/go

Command to install the Firecrawl Go SDK package using the Go toolchain.

```bash
go get github.com/mendableai/firecrawl-go
```

--------------------------------

### Start Development Server

Source: https://docs.firecrawl.dev/developer-guides/cookbooks/ai-research-assistant-cookbook

Command to initialize the local development environment for testing the application.

```bash
npm run dev
```

--------------------------------

### Perform a Crawl with Custom Options (cURL)

Source: https://docs.firecrawl.dev/advanced-scraping-guide

This example shows how to initiate a crawl using the /v2/crawl endpoint with various customization options. It includes specifying include/exclude paths, setting max discovery depth, and defining the crawl limit. This allows for targeted crawling of specific sections of a website.

```bash
curl -X POST https://api.firecrawl.dev/v2/crawl \
    -H 'Content-Type: application/json' \
    -H 'Authorization: Bearer fc-YOUR-API-KEY' \
    -d '{
      "url": "https://docs.firecrawl.dev",
      "includePaths": ["^/blog/.*$", "^/docs/.*$"],
      "excludePaths": ["^/admin/.*$", "^/private/.*$"],
      "maxDiscoveryDepth": 2,
      "limit": 1000
    }'
```

--------------------------------

### Perform Web Scraping Request

Source: https://docs.firecrawl.dev

Execute a scrape request to convert a URL into clean, LLM-ready data. Supports multiple formats including markdown and HTML.

```curl
curl -X POST 'https://api.firecrawl.dev/v2/scrape' \
  -H 'Authorization: Bearer fc-YOUR-API-KEY' \
  -H 'Content-Type: application/json' \
  -d '{"url": "https://example.com"}'
```

```python
from firecrawl import Firecrawl

firecrawl = Firecrawl(api_key="fc-YOUR-API-KEY")

# Scrape a website:
doc = firecrawl.scrape("https://firecrawl.dev", formats=["markdown", "html"])
print(doc)
```

--------------------------------

### Install and Initialize Firecrawl Node SDK

Source: https://docs.firecrawl.dev/sdks/node

Installs the Firecrawl Node.js SDK using npm and demonstrates how to initialize the Firecrawl client with an API key. This is the first step to using the SDK's functionalities.

```javascript
npm install @mendable/firecrawl-js

import Firecrawl from '@mendable/firecrawl-js';

const firecrawl = new Firecrawl({ apiKey: "fc-YOUR-API-KEY" });
```

--------------------------------

### Install OpenAI Provider for AI SDK

Source: https://docs.firecrawl.dev/developer-guides/cookbooks/ai-research-assistant-cookbook

Installs the OpenAI provider package, enabling the AI SDK to connect with OpenAI's language models. This is crucial for leveraging OpenAI's capabilities within the application.

```bash
npm install @ai-sdk/openai
```

--------------------------------

### Preview Crawl Params with Firecrawl (Node.js, Python, cURL)

Source: https://docs.firecrawl.dev/migrate-to-v2

Demonstrates how to preview crawl parameters for Firecrawl. This includes examples for Node.js using the `@mendable/firecrawl-js` library, Python using the `firecrawl` library, and a cURL command for direct API interaction. These examples show how to specify a URL and a prompt to get a preview of the crawl parameters.

```javascript
import Firecrawl from '@mendable/firecrawl-js';

const firecrawl = new Firecrawl({ apiKey: "fc-YOUR-API-KEY" });

const params = await firecrawl.crawlParamsPreview('https://docs.firecrawl.dev', 'Extract docs and blog');
console.log(params);
```

```python
from firecrawl import Firecrawl

firecrawl = Firecrawl(api_key='fc-YOUR-API-KEY')
preview = firecrawl.crawl_params_preview(url='https://docs.firecrawl.dev', prompt='Extract docs and blog')
print(preview)
```

```bash
curl -X POST https://api.firecrawl.dev/v2/crawl/params-preview \
    -H 'Content-Type: application/json' \
    -H 'Authorization: Bearer YOUR_API_KEY' \
    -d '{
      "url": "https://docs.firecrawl.dev",
      "prompt": "Extract docs and blog"
    }'
```

--------------------------------

### Manage Browser Sandbox Sessions

Source: https://docs.firecrawl.dev

Provides a secure environment to interact with the web, including launching sessions, executing custom browser automation code, and closing sessions. Useful for form filling and authentication tasks.

```bash
# 1. Launch a session
curl -X POST "https://api.firecrawl.dev/v2/browser" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -H "Content-Type: application/json"

# 2. Execute code
curl -X POST "https://api.firecrawl.dev/v2/browser/YOUR_SESSION_ID/execute" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "await page.goto(\"https://news.ycombinator.com\")\ntitle = await page.title()\nprint(title)"
  }'

# 3. Close
curl -X DELETE "https://api.firecrawl.dev/v2/browser/YOUR_SESSION_ID" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY"
```

--------------------------------

### Install AI SDK and Related Packages

Source: https://docs.firecrawl.dev/developer-guides/cookbooks/ai-research-assistant-cookbook

Installs the core AI SDK, React hooks for chat interfaces, and Zod for schema validation. These packages provide essential tools for building AI-driven applications with streaming and tool-calling capabilities.

```bash
npm i ai @ai-sdk/react zod
```

--------------------------------

### Install Firecrawl SDKs and CLI

Source: https://docs.firecrawl.dev/features/search

Instructions for installing the Firecrawl Python SDK, Node.js SDK, and CLI tool. The Python and Node.js SDKs require package manager installation, while the CLI requires global npm installation and an authentication step.

```python
# pip install firecrawl-py

from firecrawl import Firecrawl

firecrawl = Firecrawl(api_key="fc-YOUR-API-KEY")
```

```javascript
// npm install @mendable/firecrawl-js

import Firecrawl from '@mendable/firecrawl-js';

const firecrawl = new Firecrawl({ apiKey: "fc-YOUR-API-KEY" });
```

```bash
# Install globally with npm
npm install -g firecrawl

# Authenticate (one-time setup)
firecrawl login
```

--------------------------------

### Configure Firecrawl API Environment Variables

Source: https://docs.firecrawl.dev/contributing/guide

Copies the example environment file to create a new .env file for the Firecrawl API. This file will store configuration settings for the local setup.

```bash
cp apps/api/.env.example apps/api/.env
```

--------------------------------

### Install Firecrawl AI SDK

Source: https://docs.firecrawl.dev/developer-guides/llm-sdks-and-frameworks/vercel-ai-sdk

Installs the necessary packages for the Firecrawl AI SDK and the AI SDK itself using npm. Also shows how to set essential environment variables for API keys.

```bash
npm install firecrawl-aisdk ai

FIRECRAWL_API_KEY=fc-your-key       # https://firecrawl.dev
AI_GATEWAY_API_KEY=your-key         # https://vercel.com/ai-gateway
```

--------------------------------

### Install Firecrawl Library

Source: https://docs.firecrawl.dev/features/crawl

Install the Firecrawl library for Python, Node.js, or authenticate the CLI. This is the first step before using any Firecrawl functionalities.

```python
# pip install firecrawl-py

from firecrawl import Firecrawl

firecrawl = Firecrawl(api_key="fc-YOUR-API-KEY")
```

```javascript
# npm install @mendable/firecrawl-js

import Firecrawl from '@mendable/firecrawl-js';

const firecrawl = new Firecrawl({ apiKey: "fc-YOUR-API-KEY" });
```

```bash
# Install globally with npm
npm install -g firecrawl

# Authenticate (one-time setup)
firecrawl login
```

--------------------------------

### POST /v2/scrape

Source: https://docs.firecrawl.dev

Scrapes a given URL and returns the content in various formats like markdown, HTML, or structured JSON. It's the primary endpoint for extracting data from websites.

```APIDOC
## POST /v2/scrape

### Description
Scrapes a given URL and returns the content in various formats like markdown, HTML, or structured JSON. This endpoint is designed to extract data from websites efficiently.

### Method
POST

### Endpoint
`/v2/scrape`

### Parameters
#### Query Parameters
- **url** (string) - Required - The URL of the website to scrape.
- **formats** (array[string]) - Optional - An array of desired output formats (e.g., "markdown", "html", "json"). Defaults to ["markdown"].
- **include_links** (boolean) - Optional - Whether to include extracted links in the response. Defaults to false.
- **include_images** (boolean) - Optional - Whether to include extracted image URLs in the response. Defaults to false.
- **include_tags** (boolean) - Optional - Whether to include extracted HTML tags in the response. Defaults to false.
- **only_content** (boolean) - Optional - Whether to return only the main content of the page, stripping out navigation and ads. Defaults to false.
- **max_pages** (integer) - Optional - The maximum number of pages to crawl if a crawl is initiated. Defaults to 1.
- **with_images** (boolean) - Optional - Alias for include_images. Defaults to false.

#### Request Body
- **url** (string) - Required - The URL of the website to scrape.
- **formats** (array[string]) - Optional - An array of desired output formats (e.g., "markdown", "html", "json"). Defaults to ["markdown"].
- **include_links** (boolean) - Optional - Whether to include extracted links in the response. Defaults to false.
- **include_images** (boolean) - Optional - Whether to include extracted image URLs in the response. Defaults to false.
- **include_tags** (boolean) - Optional - Whether to include extracted HTML tags in the response. Defaults to false.
- **only_content** (boolean) - Optional - Whether to return only the main content of the page, stripping out navigation and ads. Defaults to false.
- **max_pages** (integer) - Optional - The maximum number of pages to crawl if a crawl is initiated. Defaults to 1.
- **with_images** (boolean) - Optional - Alias for include_images. Defaults to false.

### Request Example
```json
{
  "url": "https://example.com"
}
```

### Response
#### Success Response (200)
- **success** (boolean) - Indicates if the operation was successful.
- **data** (object) - Contains the scraped content and metadata.
  - **markdown** (string) - The content of the website in markdown format.
  - **html** (string) - The content of the website in HTML format.
  - **metadata** (object) - Metadata about the scraped page.
    - **title** (string) - The title of the page.
    - **description** (string) - The meta description of the page.
    - **language** (string) - The language of the page.
    - **keywords** (string) - The meta keywords of the page.
    - **robots** (string) - The robots meta tag content.
    - **ogTitle** (string) - The Open Graph title.
    - **ogDescription** (string) - The Open Graph description.
    - **ogUrl** (string) - The Open Graph URL.
    - **ogImage** (string) - The Open Graph image URL.
    - **ogLocaleAlternate** (array[string]) - Alternate Open Graph locales.
    - **ogSiteName** (string) - The Open Graph site name.
    - **sourceURL** (string) - The original URL that was scraped.
    - **statusCode** (integer) - The HTTP status code of the original request.

#### Response Example
```json
{
  "success": true,
  "data": {
    "markdown": "# Example Domain\n\nThis domain is for use in illustrative examples...",
    "metadata": {
      "title": "Example Domain",
      "sourceURL": "https://example.com"
    }
  }
}
```
```

--------------------------------

### Install Firecrawl and Gemini Dependencies

Source: https://docs.firecrawl.dev/developer-guides/llm-sdks-and-frameworks/gemini

Installs the necessary Firecrawl and Google Gemini client libraries using npm. It also shows how to set up environment variables for API keys.

```bash
npm install @mendable/firecrawl-js @google/genai

# Create .env file:
FIRECRAWL_API_KEY=your_firecrawl_key
GEMINI_API_KEY=your_gemini_key
```

--------------------------------

### POST /agent

Source: https://docs.firecrawl.dev/api-reference/endpoint/agent

Starts an agent task for agentic data extraction. This endpoint allows you to define a prompt and optionally provide URLs, a schema, maximum credits, and a specific model to guide the data extraction process.

```APIDOC
## POST /agent

### Description
Start an agent task for agentic data extraction. This endpoint allows you to define a prompt and optionally provide URLs, a schema, maximum credits, and a specific model to guide the data extraction process.

### Method
POST

### Endpoint
/agent

### Parameters
#### Query Parameters
None

#### Request Body
- **prompt** (string) - Required - The prompt describing what data to extract. Maximum length is 10000 characters.
- **urls** (array[string]) - Optional - A list of URLs to constrain the agent to.
- **schema** (object) - Optional - A JSON schema to structure the extracted data.
- **maxCredits** (number) - Optional - Maximum credits to spend on this agent task. Defaults to 2500. Values above 2,500 are always billed as paid requests.
- **strictConstrainToURLs** (boolean) - Optional - If true, agent will only visit URLs provided in the urls array.
- **model** (string) - Optional - The model to use for the agent task. Options: `spark-1-mini` (default, cheaper), `spark-1-pro` (higher accuracy). Defaults to `spark-1-mini`.

### Request Example
```json
{
  "prompt": "Extract the title and author of the blog post.",
  "urls": ["https://example.com/blog/article1"],
  "schema": {
    "type": "object",
    "properties": {
      "title": {"type": "string"},
      "author": {"type": "string"}
    }
  },
  "maxCredits": 1000,
  "strictConstrainToURLs": true,
  "model": "spark-1-pro"
}
```

### Response
#### Success Response (200)
- **success** (boolean) - Indicates if the agent task was started successfully.
- **id** (string) - The unique identifier for the agent task.

#### Response Example
```json
{
  "success": true,
  "id": "d290f1ee-6c54-4b0b-87d9-27888489b90e"
}
```

#### Error Responses
- **402 Payment Required**: Returned if payment is required to access the resource.
- **429 Too Many Requests**: Returned if the rate limit is exceeded.
```

--------------------------------

### Search API

Source: https://docs.firecrawl.dev

Perform web searches and optionally scrape results in various formats (markdown, HTML, links, screenshots) from specified sources (web, news, images) with customizable parameters.

```APIDOC
## Search API

### Description
Firecrawl's search API allows you to perform web searches and optionally scrape the search results in one operation. You can choose specific output formats (markdown, HTML, links, screenshots) and sources (web, news, images), and search the web with customizable parameters like location.

### Method
GET (implied by the Python SDK usage, actual HTTP method may vary based on implementation)

### Endpoint
`/search` (This is a conceptual endpoint based on the SDK usage; the actual endpoint may differ)

### Parameters
#### Query Parameters
- **query** (string) - Required - The search query.
- **limit** (integer) - Optional - The maximum number of results to return.
- **output_format** (string) - Optional - The desired output format (e.g., 'markdown', 'html', 'links', 'screenshots').
- **sources** (string) - Optional - The sources to search from (e.g., 'web', 'news', 'images').
- **location** (string) - Optional - The search location.

### Request Example (Python SDK)
```python
from firecrawl import Firecrawl

firecrawl = Firecrawl(api_key="fc-YOUR-API-KEY")

results = firecrawl.search(
    query="firecrawl",
    limit=3,
)
print(results)
```

### Response
#### Success Response (200)
- **success** (boolean) - Indicates if the request was successful.
- **data** (object) - Contains the search results, categorized by source (e.g., 'web', 'images', 'news').
  - **web** (array) - Array of web search results, each with 'url', 'title', 'description', and 'position'.
  - **images** (array) - Array of image search results, each with 'title', 'imageUrl', 'imageWidth', 'imageHeight', 'url', and 'position'.
  - **news** (array) - Array of news search results, each with 'title', 'url', 'snippet', 'date', and 'position'.

#### Response Example
```json
{
  "success": true,
  "data": {
    "web": [
      {
        "url": "https://www.firecrawl.dev/",
        "title": "Firecrawl - The Web Data API for AI",
        "description": "The web crawling, scraping, and search API for AI. Built for scale. Firecrawl delivers the entire internet to AI agents and builders.",
        "position": 1
      },
      {
        "url": "https://github.com/firecrawl/firecrawl",
        "title": "mendableai/firecrawl: Turn entire websites into LLM-ready ... - GitHub",
        "description": "Firecrawl is an API service that takes a URL, crawls it, and converts it into clean markdown or structured data.",
        "position": 2
      }
    ],
    "images": [
      {
        "title": "Quickstart | Firecrawl",
        "imageUrl": "https://mintlify.s3.us-west-1.amazonaws.com/firecrawl/logo/logo.png",
        "imageWidth": 5814,
        "imageHeight": 1200,
        "url": "https://docs.firecrawl.dev/",
        "position": 1
      }
    ],
    "news": [
      {
        "title": "Y Combinator startup Firecrawl is ready to pay $1M to hire three AI agents as employees",
        "url": "https://techcrunch.com/2025/05/17/y-combinator-startup-firecrawl-is-ready-to-pay-1m-to-hire-three-ai-agents-as-employees/",
        "snippet": "It's now placed three new ads on YC's job board for “AI agents only” and has set aside a $1 million budget total to make it happen.",
        "date": "3 months ago",
        "position": 1
      }
    ]
  }
}
```
```

--------------------------------

### Build and Run Docker Containers

Source: https://docs.firecrawl.dev/contributing/self-host

Commands to build the Docker images and start the Firecrawl services.

```bash
docker compose build
docker compose up
```

--------------------------------

### Example JSON Schema for Product Extraction

Source: https://docs.firecrawl.dev/features/llm-extract

An example of a well-structured JSON schema designed for extracting product information. It includes fields for product name, installation type with enumerated values, and flow rate, with descriptions and null handling.

```json
{
  "type": "object",
  "properties": {
    "product_name": {
      "type": ["string", "null"],
      "description": "Full descriptive product name as shown on the page. Return null if not found."
    },
    "installation_type": {
      "type": ["string", "null"],
      "description": "Installation type from the Specifications section. Return null if not found.",
      "enum": ["Deck-mount", "Wall-mount", "Countertop", "Drop-in", "Undermount"]
    },
    "flow_rate_gpm": {
      "type": ["string", "null"],
      "description": "Flow rate in GPM from the Specifications section. Return null if not found."
    }
  }
}
```

--------------------------------

### Install Project Dependencies for Web Scraping and PDF Generation

Source: https://docs.firecrawl.dev/developer-guides/cookbooks/brand-style-guide-generator-cookbook

Installs necessary npm packages including the Firecrawl SDK for scraping, PDFKit for PDF generation, and development dependencies like TypeScript and tsx for execution.

```bash
npm i @mendable/firecrawl-js pdfkit
npm i -D typescript tsx @types/node @types/pdfkit
```

--------------------------------

### Initialize and Use Firecrawl Rust SDK

Source: https://docs.firecrawl.dev/sdks/rust

Example demonstrating how to initialize the FirecrawlApp with an API key, scrape a URL for Markdown and HTML, and crawl a website with specified options. It includes error handling for both operations.

```rust
use firecrawl::{
    crawl::{CrawlOptions, CrawlScrapeOptions, CrawlScrapeFormats},
    FirecrawlApp,
    scrape::{ScrapeOptions, ScrapeFormats},
};

#[tokio::main]
async fn main() {
    // Initialize the FirecrawlApp with the API key
    let app = FirecrawlApp::new("fc-YOUR_API_KEY").expect("Failed to initialize FirecrawlApp");

    // Scrape a URL
    let options = ScrapeOptions {
        formats: vec![ScrapeFormats::Markdown, ScrapeFormats::HTML].into(),
        ..Default::default()
    };

    let scrape_result = app.scrape_url("https://firecrawl.dev", options).await;

    match scrape_result {
        Ok(data) => println!("Scrape Result:\n{}", data.markdown.unwrap()),
        Err(e) => eprintln!("Map failed: {}", e),
    }

    // Crawl a website
    let crawl_options = CrawlOptions {
        scrape_options: CrawlScrapeOptions {
            formats: vec![CrawlScrapeFormats::Markdown, CrawlScrapeFormats::HTML].into(),
            ..Default::default()
        }.into(),
        limit: 100.into(),
        ..Default::default()
    };

    let crawl_result = app
        .crawl_url("https://mendable.ai", crawl_options)
        .await;

    match crawl_result {
        Ok(data) => println!("Crawl Result (used {} credits):\n{:#?}", data.credits_used, data.data),
        Err(e) => eprintln!("Crawl failed: {}", e),
    }
}
```

--------------------------------

### Install and Run Firecrawl MCP Server

Source: https://docs.firecrawl.dev/mcp-server

Commands for installing the Firecrawl MCP server globally or executing it directly via npx. These commands require a valid Firecrawl API key to function.

```bash
npm install -g firecrawl-mcp
```

```bash
env FIRECRAWL_API_KEY=fc-YOUR_API_KEY npx -y firecrawl-mcp
```

--------------------------------

### Perform Web Search with Firecrawl

Source: https://docs.firecrawl.dev

Executes a web search query using the Firecrawl SDK. It returns structured data including web results, images, and news based on the provided query and limit parameters.

```python
from firecrawl import Firecrawl

firecrawl = Firecrawl(api_key="fc-YOUR-API-KEY")

results = firecrawl.search(
    query="firecrawl",
    limit=3,
)
print(results)
```

--------------------------------

### Install via Smithery CLI

Source: https://docs.firecrawl.dev/mcp-server

Automated installation command for integrating the Firecrawl MCP server with the Claude Desktop client using the Smithery CLI tool.

```bash
npx -y @smithery/cli install @mendableai/mcp-server-firecrawl --client claude
```

--------------------------------

### Agent API

Source: https://docs.firecrawl.dev

An autonomous web data gathering tool that searches, navigates, and extracts data from the web based on a natural language prompt.

```APIDOC
## Agent API

### Description
Firecrawl's Agent is an autonomous web data gathering tool. Just describe what data you need, and it will search, navigate, and extract it from anywhere on the web.

### Method
POST

### Endpoint
`/v2/agent`

### Parameters
#### Request Body
- **prompt** (string) - Required - A natural language description of the data you need.

### Request Example (cURL)
```bash
curl -X POST 'https://api.firecrawl.dev/v2/agent' \
  -H 'Authorization: Bearer fc-YOUR-API-KEY' \
  -H 'Content-Type: application/json' \
  -d '{ 
    "prompt": "Find the pricing plans for Notion"
  }'
```

### Response
#### Success Response (200)
- **success** (boolean) - Indicates if the request was successful.
- **data** (object)
  - **result** (string) - The extracted data based on the prompt.
  - **sources** (array) - An array of URLs from which the data was extracted.

#### Response Example
```json
{
  "success": true,
  "data": {
    "result": "Notion offers the following pricing plans:\n\n1. **Free** - $0/month - For individuals...\n2. **Plus** - $10/seat/month - For small teams...\n3. **Business** - $18/seat/month - For companies...\n4. **Enterprise** - Custom pricing - For large organizations...",
    "sources": [
      "https://www.notion.so/pricing"
    ]
  }
}
```
```

--------------------------------

### Scrape Website using Python

Source: https://docs.firecrawl.dev/introduction

This Python code snippet shows how to scrape a website using the firecrawl-py library. Install the library using 'pip install firecrawl-py'. Replace 'fc-YOUR-API-KEY' with your API key and 'https://example.com' with the desired URL.

```python
# pip install firecrawl-py
from firecrawl import Firecrawl

app = Firecrawl(api_key="fc-YOUR-API-KEY")
result = app.scrape("https://example.com")
print(result)
```

--------------------------------

### Manually Install Firecrawl CLI Globally

Source: https://docs.firecrawl.dev/sdks/cli

Installs the Firecrawl CLI globally on your system using npm. This command is used for manual installation when not relying on AI agent integration.

```bash
# Install globally with npm
npm install -g firecrawl-cli
```

--------------------------------

### Development Commands

Source: https://docs.firecrawl.dev/mcp-server

Standard CLI commands for installing dependencies, building the project, and running the test suite.

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test
```

--------------------------------

### Install Firecrawl and Anthropic SDKs

Source: https://docs.firecrawl.dev/developer-guides/llm-sdks-and-frameworks/anthropic

Installs the necessary npm packages for Firecrawl, Anthropic SDK, and Zod for schema validation. Also shows how to set up environment variables for API keys.

```bash
npm install @mendable/firecrawl-js @anthropic-ai/sdk zod zod-to-json-schema

# Create .env file:
FIRECRAWL_API_KEY=your_firecrawl_key
ANTHROPIC_API_KEY=your_anthropic_key
```

--------------------------------

### Extend PDF Generator with UI Components

Source: https://docs.firecrawl.dev/developer-guides/cookbooks/brand-style-guide-generator-cookbook

Example of how to extend the PDF generation logic to include visual documentation for UI components like buttons.

```typescript
if (b.components) {
  doc.addPage();
  doc.fontSize(20).fillColor("#333").text("UI Components", 50, 50);

  if (b.components.buttonPrimary) {
    const btn = b.components.buttonPrimary;
    doc.fontSize(14).text("Primary Button", 50, 90);
    doc.rect(50, 110, 120, 40).fill(btn.background);
    doc.fontSize(12).fillColor(btn.textColor).text("Button", 50, 120, { width: 120, align: "center" });
  }
}
```

--------------------------------

### Install Firecrawl API Dependencies

Source: https://docs.firecrawl.dev/contributing/guide

Installs the necessary Node.js packages for the Firecrawl API using pnpm. This command should be run from the 'apps/api/' directory.

```bash
cd apps/api
pnpm install
```

--------------------------------

### Initialize Firecrawl CLI with Browser Support

Source: https://docs.firecrawl.dev/features/browser

This command initializes the Firecrawl CLI with all functionalities, including browser support, simplifying the setup for AI coding agents.

```bash
npx -y firecrawl-cli@latest init --all --browser
```

--------------------------------

### Install AI Elements for UI Components

Source: https://docs.firecrawl.dev/developer-guides/cookbooks/ai-research-assistant-cookbook

Scaffolds pre-built UI components for AI applications using AI Elements. This command sets up components for conversations, message displays, prompt inputs, and tool call visualizations, enhancing the user interface.

```bash
npx ai-elements@latest
```

--------------------------------

### Execute Firecrawl Scrape with Actions (Python, Node.js, cURL)

Source: https://docs.firecrawl.dev/advanced-scraping-guide

Demonstrates how to use Firecrawl's scrape function with a sequence of actions. This includes waiting, clicking elements, scrolling, typing text, pressing keys, and then scraping the result. The example shows usage in Python, Node.js, and as a cURL command.

```python
from firecrawl import Firecrawl

firecrawl = Firecrawl(api_key='fc-YOUR-API-KEY')

doc = firecrawl.scrape('https://example.com', {
  'actions': [
    { 'type': 'wait', 'milliseconds': 1000 },
    { 'type': 'click', 'selector': '#accept' },
    { 'type': 'scroll', 'direction': 'down' },
    { 'type': 'click', 'selector': '#q' },
    { 'type': 'write', 'text': 'firecrawl' },
    { 'type': 'press', 'key': 'Enter' },
    { 'type': 'wait', 'milliseconds': 2000 }
  ],
  'formats': ['markdown']
})

print(doc.markdown)
```

```javascript
import { Firecrawl } from 'firecrawl-js';

const firecrawl = new Firecrawl({ apiKey: 'fc-YOUR-API-KEY' });

const doc = await firecrawl.scrape('https://example.com', {
  actions: [
    { type: 'wait', milliseconds: 1000 },
    { type: 'click', selector: '#accept' },
    { type: 'scroll', direction: 'down' },
    { type: 'click', selector: '#q' },
    { type: 'write', text: 'firecrawl' },
    { type: 'press', key: 'Enter' },
    { type: 'wait', milliseconds: 2000 }
  ],
  formats: ['markdown']
});

console.log(doc.markdown);
```

```bash
curl -X POST https://api.firecrawl.dev/v2/scrape \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer fc-YOUR-API-KEY' \
  -d '{ \
    "url": "https://example.com", \
    "actions": [ \
      { "type": "wait", "milliseconds": 1000 }, \
      { "type": "click", "selector": "#accept" }, \
      { "type": "scroll", "direction": "down" }, \
      { "type": "click", "selector": "#q" }, \
      { "type": "write", "text": "firecrawl" }, \
      { "type": "press", "key": "Enter" }, \
      { "type": "wait", "milliseconds": 2000 } \
    ], \
    "formats": ["markdown"] \
  }'
```

--------------------------------

### Start Firecrawl API Server

Source: https://docs.firecrawl.dev/contributing/guide

Starts the Firecrawl API server and its associated worker processes. This command must be executed from the 'apps/api/' directory.

```bash
pnpm start
```

--------------------------------

### Manual Browser Session Control with AI

Source: https://docs.firecrawl.dev/developer-guides/llm-sdks-and-frameworks/vercel-ai-sdk

Shows how to manually control the lifecycle of a browser session, including starting it to get a live view URL and closing it explicitly. This allows for real-time monitoring and finer control over the browser instance used by the AI.

```typescript
const browserTool = browser();
console.log('Live view:', await browserTool.start());

const { text } = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  tools: { browserTool },
  stopWhen: stepCountIs(25),
  prompt: 'Go to https://news.ycombinator.com and get the top 3 stories.',
});

await browserTool.close();
```

--------------------------------

### Quick Start with FirecrawlTools

Source: https://docs.firecrawl.dev/developer-guides/llm-sdks-and-frameworks/vercel-ai-sdk

Demonstrates the basic usage of `FirecrawlTools()` to integrate search, scrape, and browser tools into an AI application using the Vercel AI SDK. It automatically generates a system prompt for tool selection.

```typescript
import { generateText, stepCountIs } from 'ai';
import { FirecrawlTools } from 'firecrawl-aisdk';

const { text } = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Search for Firecrawl, scrape the top result, and summarize what it does',
  tools: FirecrawlTools(),
  stopWhen: stepCountIs(5),
});
```

--------------------------------

### Interact with Web Browser using Node.js

Source: https://docs.firecrawl.dev/introduction

This Node.js example utilizes the '@mendable/firecrawl-js' SDK to manage browser sessions. It covers launching a session, executing JavaScript code within the browser context (e.g., navigating and getting page titles), and closing the session. An API key is required for initialization.

```javascript
// npm install @mendable/firecrawl-js
import Firecrawl from '@mendable/firecrawl-js';

const firecrawl = new Firecrawl({ apiKey: "fc-YOUR-API-KEY" });

// 1. Launch a session
const session = await firecrawl.browser();
console.log(session.cdpUrl); // wss://cdp-proxy.firecrawl.dev/cdp/...

// 2. Execute code
const result = await firecrawl.browserExecute(session.id, {
  code: `
    await page.goto("https://news.ycombinator.com");
    const title = await page.title();
    console.log(title);
  `,
  language: "node",
});
console.log(result.result); // "Hacker News"

// 3. Close
await firecrawl.deleteBrowser(session.id);
```

--------------------------------

### Install Dependencies and Configure Environment

Source: https://docs.firecrawl.dev/developer-guides/llm-sdks-and-frameworks/llamaindex

Commands to install the required LlamaIndex and Firecrawl packages via npm and the format for the .env configuration file. Ensure you have your API keys ready for both services.

```bash
npm install llamaindex @llamaindex/openai @mendable/firecrawl-js
```

```bash
FIRECRAWL_API_KEY=your_firecrawl_key
OPENAI_API_KEY=your_openai_key
```

--------------------------------

### Execute Autonomous Agent Tasks

Source: https://docs.firecrawl.dev

Utilizes the Firecrawl Agent to autonomously navigate and extract specific information from the web based on a natural language prompt. Requires an API key for authentication.

```bash
curl -X POST 'https://api.firecrawl.dev/v2/agent' \
  -H 'Authorization: Bearer fc-YOUR-API-KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "prompt": "Find the pricing plans for Notion"
  }'
```

--------------------------------

### List and Close Browser Sessions (Java)

Source: https://docs.firecrawl.dev/sdks/java

Provides examples for listing active browser sessions and closing a specific session using the Firecrawl Browser API. It uses GET to list sessions and DELETE to close a session, both requiring the FIRECRAWL_API_KEY for authentication.

```java
// List active sessions
HttpRequest list = HttpRequest.newBuilder()
    .uri(URI.create("https://api.firecrawl.dev/v2/browser?status=active"))
    .header("Authorization", "Bearer " + System.getenv("FIRECRAWL_API_KEY"))
    .GET()
    .build();

HttpResponse<String> listResponse = http.send(list, HttpResponse.BodyHandlers.ofString());
System.out.println(listResponse.body());

// Close a session
HttpRequest close = HttpRequest.newBuilder()
    .uri(URI.create("https://api.firecrawl.dev/v2/browser"))
    .header("Authorization", "Bearer " + System.getenv("FIRECRAWL_API_KEY"))
    .header("Content-Type", "application/json")
    .method("DELETE", HttpRequest.BodyPublishers.ofString("{\"id\":\"" + sessionId + "\"}"))
    .build();

HttpResponse<String> closeResponse = http.send(close, HttpResponse.BodyHandlers.ofString());
System.out.println(closeResponse.body());
```

--------------------------------

### Start Redis Server

Source: https://docs.firecrawl.dev/contributing/guide

Starts the Redis server, a required in-memory data structure store used by Firecrawl for caching and queuing. This command can be run from any directory within the project.

```bash
redis-server
```

--------------------------------

### Install Firecrawl Python SDK

Source: https://docs.firecrawl.dev/features/map

Installs the Firecrawl Python library using pip. This is the first step to using the Firecrawl API in Python projects.

```python
# pip install firecrawl-py

from firecrawl import Firecrawl

firecrawl = Firecrawl(api_key="fc-YOUR-API-KEY")
```

--------------------------------

### Batch Process Multiple Websites

Source: https://docs.firecrawl.dev/developer-guides/cookbooks/brand-style-guide-generator-cookbook

Iterates through an array of URLs to scrape and generate brand style guides for multiple websites sequentially.

```typescript
const websites = [
  "https://stripe.com",
  "https://linear.app",
  "https://vercel.com"
];

for (const site of websites) {
  const { branding } = await fc.scrape(site, { formats: ["branding"] }) as any;
}
```

--------------------------------

### Start a Crawl Job Asynchronously with Firecrawl Node SDK

Source: https://docs.firecrawl.dev/sdks/node

Explains how to start a crawl job without waiting for its completion using the `startCrawl` method in the Firecrawl Node.js SDK. It returns a job ID that can be used to track the crawl status later.

```javascript
const { id } = await firecrawl.startCrawl('https://docs.firecrawl.dev', { limit: 10 });
console.log(id);
```

--------------------------------

### Initialize Node.js Project and Configure ES Modules

Source: https://docs.firecrawl.dev/developer-guides/cookbooks/brand-style-guide-generator-cookbook

Sets up a new Node.js project directory, initializes npm, and configures the package.json to use ES modules for modern JavaScript development.

```bash
mkdir brand-style-guide-generator && cd brand-style-guide-generator
npm init -y
```

```json
{
  "name": "brand-style-guide-generator",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "npx tsx index.ts"
  }
}
```

--------------------------------

### GET /v2/agent/{jobId}

Source: https://docs.firecrawl.dev/advanced-scraping-guide

Retrieves the current status and results of an agent extraction job.

```APIDOC
## GET /v2/agent/{jobId}

### Description
Polls the status of an ongoing or completed agent job.

### Method
GET

### Endpoint
/v2/agent/{jobId}

### Parameters
#### Path Parameters
- **jobId** (string) - Required - The unique ID returned from the POST request.

### Response
#### Success Response (200)
- **status** (string) - Current job status: "processing", "completed", or "failed".
- **data** (object) - The extracted data if the job is completed.
```

--------------------------------

### Start and Check Firecrawl Agent Job (Python, Node.js, cURL)

Source: https://docs.firecrawl.dev/advanced-scraping-guide

Initiates an agent job to extract data based on a prompt and schema, and demonstrates how to poll for its status. Supports Python, Node.js, and cURL.

```python
from firecrawl import Firecrawl

firecrawl = Firecrawl(api_key='fc-YOUR-API-KEY')

# Start agent job
started = firecrawl.start_agent(
    prompt="Extract the title and description",
    urls=["https://docs.firecrawl.dev"],
    schema={"type": "object", "properties": {"title": {"type": "string"}, "description": {"type": "string"}}, "required": ["title"]}
)

# Poll status
status = firecrawl.get_agent_status(started["id"])
print(status.get("status"), status.get("data"))
```

```javascript
import Firecrawl from '@mendable/firecrawl-js';

const firecrawl = new Firecrawl({ apiKey: 'fc-YOUR-API-KEY' });

// Start agent job
const started = await firecrawl.startAgent({
  prompt: 'Extract the title and description',
  urls: ['https://docs.firecrawl.dev'],
  schema: { type: 'object', properties: { title: { type: 'string' }, description: { type: 'string' } }, required: ['title'] }
});

// Poll status
const status = await firecrawl.getAgentStatus(started.id);
console.log(status.status, status.data);
```

```bash
curl -X POST https://api.firecrawl.dev/v2/agent \
    -H 'Content-Type: application/json' \
    -H 'Authorization: Bearer fc-YOUR-API-KEY' \
    -d '{
      "prompt": "Extract the title and description",
      "urls": ["https://docs.firecrawl.dev"],
      "schema": {"type": "object", "properties": {"title": {"type": "string"}, "description": {"type": "string"}}, "required": ["title"]}
    }'
```

--------------------------------

### Create Next.js Project with AI SDK

Source: https://docs.firecrawl.dev/developer-guides/cookbooks/ai-research-assistant-cookbook

Initializes a new Next.js project with specified configurations (TypeScript, ESLint, Tailwind CSS, App Router) and navigates into the project directory. This is the first step in setting up the development environment.

```bash
npx create-next-app@latest ai-sdk-firecrawl && cd ai-sdk-firecrawl
```

--------------------------------

### Preview Crawl Parameters with Natural Language Prompt (cURL)

Source: https://docs.firecrawl.dev/advanced-scraping-guide

This snippet demonstrates how to use the /v2/crawl/params-preview endpoint to get a preview of crawl settings derived from a natural language prompt. It requires the target URL and the prompt string. The output provides insights into how Firecrawl interprets the prompt for crawl configuration.

```bash
curl -X POST https://api.firecrawl.dev/v2/crawl/params-preview \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer fc-YOUR-API-KEY' \
  -d '{
    "url": "https://docs.firecrawl.dev",
    "prompt": "Extract docs and blog"
  }'
```

--------------------------------

### Crawl a Website with Firecrawl Python SDK

Source: https://docs.firecrawl.dev/sdks/python

Demonstrates how to initiate a website crawl using the `crawl` method, specifying the starting URL, a limit for the number of pages, and a polling interval.

```python
job = firecrawl.crawl(url="https://docs.firecrawl.dev", limit=5, poll_interval=1, timeout=120)
print(job)
```

--------------------------------

### Combine Browser and Search Tools for AI Tasks

Source: https://docs.firecrawl.dev/developer-guides/llm-sdks-and-frameworks/vercel-ai-sdk

Illustrates integrating both the browser and search tools to perform complex AI-driven tasks. This example shows how an AI can search for information, browse a relevant page, and then summarize key findings, requiring 'ai' and 'firecrawl-aisdk' libraries.

```typescript
import { generateText, stepCountIs } from 'ai';
import { browser, search } from 'firecrawl-aisdk';

const { text } = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  tools: { browser: browser(), search },
  stopWhen: stepCountIs(25),
  prompt: 'Search for the top AI paper this week, browse it, and summarize the key findings.',
});
```

--------------------------------

### Get Job Status

Source: https://docs.firecrawl.dev/features/extract

Retrieve the current status of an extraction job using its Job ID. This is useful for polling progress after starting an asynchronous job.

```APIDOC
## GET /v2/extract/{ID}

### Description
Retrieves the status and results of a specific extraction job using its unique Job ID.

### Method
GET

### Endpoint
/v2/extract/{ID}

### Parameters
#### Path Parameters
- **ID** (string) - Required - The unique identifier for the extraction job.

#### Query Parameters
None

#### Request Body
None

### Request Example
```bash
curl -s -X GET "https://api.firecrawl.dev/v2/extract/<jobId>" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY"
```

### Response
#### Success Response (200)
- **success** (boolean) - Indicates if the request was successful.
- **data** (object|array) - The extracted data or an empty array if processing.
- **status** (string) - The current status of the job (e.g., 'completed', 'processing', 'failed').
- **expiresAt** (string) - The timestamp when the job results will expire.

#### Response Example (Pending)
```json
{
  "success": true,
  "data": [],
  "status": "processing",
  "expiresAt": "2025-01-08T20:58:12.000Z"
}
```

#### Response Example (Completed)
```json
{
  "success": true,
  "data": {
      "company_mission": "Firecrawl is the easiest way to extract data from the web. Developers use us to reliably convert URLs into LLM-ready markdown or structured data with a single API call.",
      "supports_sso": false,
      "is_open_source": true,
      "is_in_yc": true
    },
  "status": "completed",
  "expiresAt": "2025-01-08T20:58:12.000Z"
}
```
```

--------------------------------

### Start Firecrawl Crawl Job (cURL)

Source: https://docs.firecrawl.dev/advanced-scraping-guide

Initiates an asynchronous crawl job for a specified URL using the Firecrawl API. Returns a job ID that can be used to track the crawl's progress.

```bash
curl -X POST https://api.firecrawl.dev/v2/crawl \
    -H 'Content-Type: application/json' \
    -H 'Authorization: Bearer fc-YOUR-API-KEY' \
    -d '{
      "url": "https://docs.firecrawl.dev"
    }'
```

--------------------------------

### Initialize and Use Firecrawl Go SDK

Source: https://docs.firecrawl.dev/sdks/go

Demonstrates how to initialize the FirecrawlApp client and perform basic scraping and crawling operations with error handling.

```go
import (
	"fmt"
	"log"
	"github.com/google/uuid"
	"github.com/mendableai/firecrawl-go"
)

func ptr[T any](v T) *T {
	return &v
}

func main() {
	apiKey := "fc-YOUR_API_KEY"
	apiUrl := "https://api.firecrawl.dev"
	version := "v1"

	app, err := firecrawl.NewFirecrawlApp(apiKey, apiUrl, version)
	if err != nil {
		log.Fatalf("Failed to initialize FirecrawlApp: %v", err)
	}

  scrapeStatus, err := app.ScrapeUrl("https://firecrawl.dev", firecrawl.ScrapeParams{
    Formats: []string{"markdown", "html"},
  })
  if err != nil {
    log.Fatalf("Failed to send scrape request: %v", err)
  }

  fmt.Println(scrapeStatus)

  idempotencyKey := uuid.New().String()
  crawlParams := &firecrawl.CrawlParams{
		ExcludePaths: []string{"blog/*"},
		MaxDepth:     ptr(2),
	}

	crawlStatus, err := app.CrawlUrl("https://firecrawl.dev", crawlParams, &idempotencyKey)
	if err != nil {
		log.Fatalf("Failed to send crawl request: %v", err)
	}

	fmt.Println(crawlStatus) 
}
```

--------------------------------

### Install Firecrawl Rust SDK

Source: https://docs.firecrawl.dev/sdks/rust

Instructions to add the Firecrawl Rust SDK and Tokio to your project's Cargo.toml file. This is the first step to using the SDK in your Rust application.

```yaml
# Add this to your Cargo.toml
[dependencies]
firecrawl = "^1.0"
tokio = { version = "^1", features = ["full"] }
```

--------------------------------

### Basic Crawl Website

Source: https://docs.firecrawl.dev/features/crawl

Submit a crawl job to Firecrawl by providing a starting URL. The endpoint returns a job ID for polling results. Examples are provided for Python, Node.js, cURL, and CLI.

```python
from firecrawl import Firecrawl

firecrawl = Firecrawl(api_key="fc-YOUR-API-KEY")

docs = firecrawl.crawl(url="https://docs.firecrawl.dev", limit=10)
print(docs)
```

```javascript
import Firecrawl from '@mendable/firecrawl-js';

const firecrawl = new Firecrawl({ apiKey: "fc-YOUR-API-KEY" });

const docs = await firecrawl.crawl('https://docs.firecrawl.dev', { limit: 10 });
console.log(docs);
```

```bash
curl -s -X POST "https://api.firecrawl.dev/v2/crawl" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://docs.firecrawl.dev",
    "limit": 10
  }'
```

```bash
# Start a crawl job (returns job ID)
firecrawl crawl https://firecrawl.dev

# Wait for completion with progress
firecrawl crawl https://firecrawl.dev --wait --progress --limit 100
```

--------------------------------

### Starting a Crawl Job

Source: https://docs.firecrawl.dev/sdks/java

Starts a crawl job asynchronously without waiting for completion. Returns a job ID that can be used to track the crawl's progress.

```APIDOC
## POST /startCrawl

### Description
Starts a crawl job asynchronously. Returns a job ID that can be used to check the status later.

### Method
POST

### Endpoint
/startCrawl

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **url** (string) - Required - The starting URL for the crawl.
- **crawlParams** (object) - Optional - Parameters for controlling the crawl process (e.g., limit).
  - **limit** (integer) - Optional - Maximum number of pages to crawl.

### Request Example
```json
{
  "url": "https://firecrawl.dev",
  "crawlParams": {
    "limit": 100
  }
}
```

### Response
#### Success Response (200)
- **id** (string) - The unique identifier for the started crawl job.

#### Response Example
```json
{
  "id": "crawl-job-12345"
}
```
```

--------------------------------

### Extract Structured Data using Firecrawl Java SDK

Source: https://docs.firecrawl.dev/sdks/java

Example of extracting structured data from a URL using the Extract endpoint. It involves specifying a JSON schema and a prompt to guide the extraction process. The response includes job status and extracted data.

```java
import dev.firecrawl.model.ExtractParams;
import dev.firecrawl.model.ExtractResponse;
import dev.firecrawl.model.ExtractStatusResponse;
import java.util.Map;

ExtractParams extractParams = new ExtractParams(new String[]{"https://firecrawl.dev"});
extractParams.setPrompt("Extract the product name and price");
extractParams.setSchema(Map.of(
    "type", "object",
    "properties", Map.of(
        "name", Map.of("type", "string"),
        "price", Map.of("type", "number")
    )
));

ExtractResponse start = client.extract(extractParams);
ExtractStatusResponse result = client.getExtractStatus(start.getId());

System.out.println(result.getData());
```

--------------------------------

### Install Firecrawl and LangGraph Dependencies

Source: https://docs.firecrawl.dev/developer-guides/llm-sdks-and-frameworks/langgraph

Installs the necessary npm packages for Firecrawl, LangGraph, and OpenAI integration. Ensure you have Node.js version 20 or later, or install the 'dotenv' package for older versions.

```bash
npm install @langchain/langgraph @langchain/openai @mendable/firecrawl-js
```

--------------------------------

### Example Markdown Output from Excel

Source: https://docs.firecrawl.dev/features/document-parsing

An example of how Firecrawl represents multi-sheet Excel files in structured markdown format.

```markdown
## Sheet1

| Name  | Value |
|-------|-------|
| Item 1 | 100   |
| Item 2 | 200   |

## Sheet2

| Date       | Description  |
|------------|--------------|
| 2023-01-01 | First quarter|
```

--------------------------------

### Scrape Website using Node.js

Source: https://docs.firecrawl.dev/introduction

This Node.js code snippet demonstrates scraping a website using the @mendable/firecrawl-js library. Install it via 'npm install @mendable/firecrawl-js'. Ensure you replace 'fc-YOUR-API-KEY' with your key and 'https://example.com' with the target URL.

```javascript
// npm install @mendable/firecrawl-js
import Firecrawl from '@mendable/firecrawl-js';

const app = new Firecrawl({ apiKey: "fc-YOUR-API-KEY" });
const result = await app.scrape("https://example.com");
console.log(result);
```

--------------------------------

### Generate Brand Style Guide PDF from Website URL

Source: https://docs.firecrawl.dev/developer-guides/cookbooks/brand-style-guide-generator-cookbook

This TypeScript script uses the Firecrawl SDK to scrape a given URL for branding information (logo, colors, typography, spacing) and then utilizes PDFKit to generate a structured PDF document presenting this information.

```typescript
import Firecrawl from "@mendable/firecrawl-js";
import PDFDocument from "pdfkit";
import fs from "fs";

const API_KEY = "fc-YOUR-API-KEY";
const URL = "https://firecrawl.dev";

async function main() {
  const fc = new Firecrawl({ apiKey: API_KEY });
  const { branding: b } = (await fc.scrape(URL, { formats: ["branding"] })) as any;

  const doc = new PDFDocument({ size: "A4", margin: 50 });
  doc.pipe(fs.createWriteStream("brand-style-guide.pdf"));

  // Fetch logo (PNG/JPG only)
  let logoImg: Buffer | null = null;
  try {
    const logoUrl = b.images?.favicon || b.images?.ogImage;
    if (logoUrl?.match(/\.(png|jpg|jpeg)$/i)) {
      const res = await fetch(logoUrl);
      logoImg = Buffer.from(await res.arrayBuffer());
    }
  } catch {}

  // Header with logo
  doc.rect(0, 0, 595, 120).fill(b.colors?.primary || "#333");
  const titleX = logoImg ? 130 : 50;
  if (logoImg) doc.image(logoImg, 50, 30, { height: 60 });
  doc.fontSize(36).fillColor("#fff").text("Brand Style Guide", titleX, 38);
  doc.fontSize(14).text(URL, titleX, 80);

  // Colors
  doc.fontSize(18).fillColor("#333").text("Colors", 50, 160);
  const colors = Object.entries(b.colors || {}).filter(([, v]) => typeof v === "string" && (v as string).startsWith("#"));
  colors.forEach(([k, v], i) => {
    const x = 50 + i * 100;
    doc.rect(x, 195, 80, 80).fill(v as string);
    doc.fontSize(10).fillColor("#333").text(k, x, 282, { width: 80, align: "center" });
    doc.fontSize(9).fillColor("#888").text(v as string, x, 296, { width: 80, align: "center" });
  });

  // Typography
  doc.fontSize(18).fillColor("#333").text("Typography", 50, 340);
  doc.fontSize(13).fillColor("#444");
  doc.text(`Primary Font: ${b.typography?.fontFamilies?.primary || "—"}`, 50, 370);
  doc.text(`Heading Font: ${b.typography?.fontFamilies?.heading || "—"}`, 50, 392);
  doc.fontSize(12).fillColor("#666").text("Font Sizes:", 50, 422);
  Object.entries(b.typography?.fontSizes || {}).forEach(([k, v], i) => {
    doc.text(`${k.toUpperCase()}: ${v}`, 70, 445 + i * 22);
  });

  // Spacing & Theme
  doc.fontSize(18).fillColor("#333").text("Spacing & Theme", 320, 340);
  doc.fontSize(13).fillColor("#444");
  doc.text(`Base Unit: ${b.spacing?.baseUnit}px`, 320, 370);
  doc.text(`Border Radius: ${b.spacing?.borderRadius}`, 320, 392);
  doc.text(`Color Scheme: ${b.colorScheme}`, 320, 414);

  doc.end();
  console.log("Generated: brand-style-guide.pdf");
}

main();

```

--------------------------------

### Configure Environment Variables for Firecrawl

Source: https://docs.firecrawl.dev/mcp-server

Examples for setting up environment variables to manage API keys, retry logic, and credit thresholds for both cloud and self-hosted Firecrawl instances.

```bash
# Required for cloud API
export FIRECRAWL_API_KEY=your-api-key

# Optional retry configuration
export FIRECRAWL_RETRY_MAX_ATTEMPTS=5
export FIRECRAWL_RETRY_INITIAL_DELAY=2000
export FIRECRAWL_RETRY_MAX_DELAY=30000
export FIRECRAWL_RETRY_BACKOFF_FACTOR=3

# Optional credit monitoring
export FIRECRAWL_CREDIT_WARNING_THRESHOLD=2000
export FIRECRAWL_CREDIT_CRITICAL_THRESHOLD=500
```

```bash
# Required for self-hosted
export FIRECRAWL_API_URL=https://firecrawl.your-domain.com

# Optional authentication for self-hosted
export FIRECRAWL_API_KEY=your-api-key

# Custom retry configuration
export FIRECRAWL_RETRY_MAX_ATTEMPTS=10
export FIRECRAWL_RETRY_INITIAL_DELAY=500
```

--------------------------------

### POST /v2/crawl/params-preview

Source: https://docs.firecrawl.dev/advanced-scraping-guide

Preview crawl settings derived from a natural-language prompt for a specific URL.

```APIDOC
## POST /v2/crawl/params-preview

### Description
Allows users to provide a natural-language prompt to automatically derive crawl settings for a target URL.

### Method
POST

### Endpoint
https://api.firecrawl.dev/v2/crawl/params-preview

### Request Body
- **url** (string) - Required - The starting URL to crawl.
- **prompt** (string) - Required - Natural language description of crawl requirements.

### Request Example
{
  "url": "https://docs.firecrawl.dev",
  "prompt": "Extract docs and blog"
}
```

--------------------------------

### Install Dependencies for Mastra and Firecrawl

Source: https://docs.firecrawl.dev/developer-guides/llm-sdks-and-frameworks/mastra

Installs the necessary packages for using Mastra with Firecrawl and Zod for schema validation. Ensure you have Node.js installed.

```bash
npm install @mastra/core @mendable/firecrawl-js zod
```

--------------------------------

### Smart Crawling with Prompts

Source: https://docs.firecrawl.dev/migrate-to-v2

Using a natural-language prompt to guide the crawling process.

```APIDOC
## Smart Crawling with Prompts

### Description
Pass a natural-language `prompt` to crawl, and the system derives paths and limits automatically. Use the `/crawl/params-preview` endpoint to inspect the derived options before starting a job.

### Method
POST

### Endpoint
`/v2/crawl`

### Parameters
#### Request Body
- **url** (string) - Required - The starting URL for the crawl.
- **prompt** (string) - Required - A natural-language prompt describing what to crawl.
- **maxPages** (integer) - Optional - Maximum number of pages to crawl. If not provided, it's derived from the prompt.

### Request Example
```json
{
  "url": "https://example.com",
  "prompt": "Crawl all blog posts about product updates.",
  "maxPages": 50
}
```

### Response
#### Success Response (200)
- **jobId** (string) - The ID of the initiated crawl job.

#### Response Example
```json
{
  "jobId": "crawl-abc123xyz"
}
```
```

--------------------------------

### Install Firecrawl Node.js SDK

Source: https://docs.firecrawl.dev/features/map

Installs the Firecrawl Node.js library using npm. This is required for integrating Firecrawl into JavaScript applications.

```javascript
# npm install @mendable/firecrawl-js

import Firecrawl from '@mendable/firecrawl-js';

const firecrawl = new Firecrawl({ apiKey: "fc-YOUR-API-KEY" });
```

--------------------------------

### Use Firecrawl Java SDK for Scraping and Crawling

Source: https://docs.firecrawl.dev/sdks/java

Example demonstrating how to use the Firecrawl Java SDK to scrape a URL and crawl a website. It includes setting up the client, handling API keys, and processing responses with error handling for API, Firecrawl, and network issues.

```java
import dev.firecrawl.client.FirecrawlClient;
import dev.firecrawl.exception.ApiException;
import dev.firecrawl.exception.FirecrawlException;
import dev.firecrawl.model.*;
import java.io.IOException;
import java.time.Duration;
import java.util.UUID;

public class Example {
    public static void main(String[] args) {
        FirecrawlClient client = new FirecrawlClient(
            System.getenv("FIRECRAWL_API_KEY"),
            null,
            Duration.ofSeconds(60)
        );

        try {
            // Scrape a URL
            ScrapeParams scrapeParams = new ScrapeParams();
            scrapeParams.setFormats(new String[]{"markdown"});
            FirecrawlDocument doc = client.scrapeURL("https://firecrawl.dev", scrapeParams);
            System.out.println(doc.getMarkdown());

            // Crawl a website
            CrawlParams crawlParams = new CrawlParams();
            crawlParams.setLimit(5);
            CrawlStatusResponse job = client.crawlURL(
                "https://firecrawl.dev",
                crawlParams,
                UUID.randomUUID().toString(),
                5
            );

            if ("completed".equalsIgnoreCase(job.getStatus()) && job.getData() != null) {
                for (FirecrawlDocument page : job.getData()) {
                    System.out.println(page.getMetadata().get("sourceURL"));
                }
            }
        } catch (ApiException e) {
            System.err.println("API error " + e.getStatusCode() + ": " + e.getResponseBody());
        } catch (FirecrawlException e) {
            System.err.println("Firecrawl error: " + e.getMessage());
        } catch (IOException e) {
            System.err.println("Network error: " + e.getMessage());
        }
    }
}
```

--------------------------------

### Execute JavaScript Code in Browser Session (Java)

Source: https://docs.firecrawl.dev/sdks/java

Executes JavaScript code within an active browser session. This example sends a POST request to the browser execute endpoint, specifying the session ID and the code to run (e.g., navigating to a URL and getting the title). It requires the FIRECRAWL_API_KEY for authentication.

```java
String sessionId = "YOUR_SESSION_ID";

HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://api.firecrawl.dev/v2/browser/" + sessionId + "/execute"))
    .header("Authorization", "Bearer " + System.getenv("FIRECRAWL_API_KEY"))
    .header("Content-Type", "application/json")
    .POST(HttpRequest.BodyPublishers.ofString(
        "{\"code\":\"await page.goto(\\\"https://example.com\\\"); const t = await page.title(); console.log(t);\",\"language\":\"node\"}"
    ))
    .build();

HttpResponse<String> response = http.send(request, HttpResponse.BodyHandlers.ofString());
System.out.println(response.body());
```

--------------------------------

### Configure Environment Variables

Source: https://docs.firecrawl.dev/developer-guides/cookbooks/ai-research-assistant-cookbook

Sets up the required environment variables for the OpenAI API key in a local development environment.

```bash
touch .env.local
```

```env
OPENAI_API_KEY=sk-your-openai-api-key
```

--------------------------------

### Install Firecrawl Dependencies

Source: https://docs.firecrawl.dev/developer-guides/common-sites/wikipedia

Install the necessary Firecrawl SDK and Zod validation library via npm to begin scraping operations.

```bash
npm install @mendable/firecrawl-js zod
```

--------------------------------

### Start a Non-Blocking Crawl with Firecrawl Python SDK

Source: https://docs.firecrawl.dev/sdks/python

Explains how to start a crawl job asynchronously using `start_crawl`, which returns a job ID immediately without waiting for completion. This is useful for non-blocking operations.

```python
job = firecrawl.start_crawl(url="https://docs.firecrawl.dev", limit=10)
print(job)
```

--------------------------------

### Install Firecrawl CLI

Source: https://docs.firecrawl.dev/features/map

Installs the Firecrawl command-line interface globally using npm. This allows you to use Firecrawl commands directly from your terminal.

```bash
# Install globally with npm
npm install -g firecrawl

# Authenticate (one-time setup)
firecrawl login
```

--------------------------------

### Get Historical Credit Usage - OpenAPI

Source: https://docs.firecrawl.dev/api-reference/endpoint/credit-usage-historical

Retrieves historical credit usage for the authenticated team on a month-by-month basis. The endpoint can optionally break down usage by API key. It requires a bearer token for authentication and returns usage periods with start and end dates, API key (if specified), and total credits used.

```yaml
openapi: 3.0.0
info:
  title: Firecrawl API
  version: v2
  description: >-
    API for interacting with Firecrawl services to perform web scraping and
    crawling tasks.
  contact:
    name: Firecrawl Support
    url: https://firecrawl.dev/support
    email: support@firecrawl.dev
servers:
  - url: https://api.firecrawl.dev/v2
security:
  - bearerAuth: []
paths:
  /team/credit-usage/historical:
    get:
      tags:
        - Billing
      summary: Get historical credit usage for the authenticated team
      operationId: getHistoricalCreditUsage
      parameters:
        - name: byApiKey
          in: query
          description: Get historical credit usage by API key
          required: false
          schema:
            type: boolean
            default: false
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  periods:
                    type: array
                    items:
                      type: object
                      properties:
                        startDate:
                          type: string
                          format: date-time
                          description: Start date of the billing period
                          example: '2025-01-01T00:00:00Z'
                        endDate:
                          type: string
                          format: date-time
                          description: End date of the billing period
                          example: '2025-01-31T23:59:59Z'
                        apiKey:
                          type: string
                          description: >-
                            Name of the API key used for the billing period.
                            null if byApiKey is false (default)
                          nullable: true
                        totalCredits:
                          type: integer
                          description: Total number of credits used in the billing period
                          example: 1000
        '500':
          description: Server error
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: false
                  error:
                    type: string
                    example: >-
                      Internal server error while fetching historical credit
                      usage
      security:
        - bearerAuth: []
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer

```

--------------------------------

### POST /browser/launch-session

Source: https://docs.firecrawl.dev/sdks/cli

Initializes a new browser session with configurable TTL and streaming options.

```APIDOC
## POST /browser/launch-session

### Description
Starts a new browser session. Supports setting a time-to-live (TTL) and inactivity timeouts.

### Method
POST

### Endpoint
/browser/launch-session

### Parameters
#### Query Parameters
- **ttl** (integer) - Optional - Session duration in seconds.
- **ttl-inactivity** (integer) - Optional - Inactivity timeout in seconds.
- **stream** (boolean) - Optional - Enable live view streaming.

### Request Example
{
  "ttl": 600,
  "stream": true
}

### Response
#### Success Response (200)
- **session_id** (string) - The unique identifier for the launched session.

#### Response Example
{
  "session_id": "sess_12345"
}
```

--------------------------------

### POST /v2/browser - Launch a Session

Source: https://docs.firecrawl.dev/features/browser

Launches a new browser session, returning a session ID, CDP URL, and live view URL.

```APIDOC
## POST /v2/browser

### Description
Launches a new browser session, returning a session ID, CDP URL, and live view URL.

### Method
POST

### Endpoint
https://api.firecrawl.dev/v2/browser

### Parameters
#### Query Parameters
None

#### Request Body
- **ttl** (integer) - Optional - The time-to-live for the session in seconds.
- **activityTtl** (integer) - Optional - The time-to-live for inactivity in seconds.

### Request Example
```json
{
  "ttl": 120,
  "activityTtl": 60
}
```

### Response
#### Success Response (200)
- **success** (boolean) - Indicates if the operation was successful.
- **id** (string) - The unique identifier for the session.
- **cdpUrl** (string) - The WebSocket URL for the Chrome DevTools Protocol.
- **liveViewUrl** (string) - The URL for the live view of the browser session.
- **interactiveLiveViewUrl** (string) - The URL for an interactive live view of the browser session.

#### Response Example
```json
{
  "success": true,
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "cdpUrl": "wss://cdp-proxy.firecrawl.dev/cdp/550e8400-e29b-41d4-a716-446655440000",
  "liveViewUrl": "https://liveview.firecrawl.dev/550e8400-e29b-41d4-a716-446655440000",
  "interactiveLiveViewUrl": "https://liveview.firecrawl.dev/550e8400-e29b-41d4-a716-446655440000?interactive=true"
}
```
```

--------------------------------

### Start a Crawl Job

Source: https://docs.firecrawl.dev/sdks/node

Initiate a crawl job without waiting for completion. Returns a job ID for status checking.

```APIDOC
## Start Crawl Job

Start a crawl job asynchronously. This method returns a job ID that can be used to track the crawl's progress.

### Method

`POST`

### Endpoint

`/v1/crawl/start

### Parameters

#### Request Body

- **url** (string) - Required - The starting URL for the crawl.
- **limit** (integer) - Optional - The maximum number of pages to crawl.
- **exclude_paths** (array) - Optional - An array of path patterns to exclude from the crawl.
- **sitemap** (string) - Optional - If `sitemap: 'only'`, only sitemap URLs will be crawled.

### Request Example

```json
{
  "url": "https://docs.firecrawl.dev",
  "limit": 10,
  "exclude_paths": ["blog/*"]
}
```

### Response

#### Success Response (200)

- **id** (string) - The unique identifier for the crawl job.

#### Response Example

```json
{
  "id": "crawl-abc123xyz789"
}
```
```

--------------------------------

### Build PostgreSQL Docker Image

Source: https://docs.firecrawl.dev/contributing/guide

Builds a Docker image for the PostgreSQL database required by Firecrawl. Ensure Docker is installed and running before executing this command.

```bash
docker build -t nuq-postgres apps/nuq-postgres
```

--------------------------------

### POST /v2/crawl

Source: https://docs.firecrawl.dev/advanced-scraping-guide

Initiates a crawl job for multiple pages on a website.

```APIDOC
## POST /v2/crawl

### Description
Starts an asynchronous crawl job for a given URL.

### Method
POST

### Endpoint
/v2/crawl

### Parameters
#### Request Body
- **url** (string) - Required - The root URL to start the crawl from.

### Response
#### Success Response (200)
- **id** (string) - The unique identifier for the crawl job.

#### Response Example
{
  "id": "1234-5678-9101"
}
```

--------------------------------

### Perform Web Search with Firecrawl API

Source: https://docs.firecrawl.dev/introduction

This snippet demonstrates how to perform a web search using the Firecrawl API. It supports various output formats and sources, and allows for customizable search parameters. The Python and Node.js examples use the Firecrawl SDKs, while the cURL example shows a direct API call.

```python
from firecrawl import Firecrawl

firecrawl = Firecrawl(api_key="fc-YOUR-API-KEY")

results = firecrawl.search(
    query="firecrawl",
    limit=3,
)
print(results)
```

```javascript
import Firecrawl from '@mendable/firecrawl-js';

const firecrawl = new Firecrawl({ apiKey: "fc-YOUR-API-KEY" });

const results = await firecrawl.search('firecrawl', {
  limit: 3,
  scrapeOptions: { formats: ['markdown'] }
});
console.log(results);
```

```bash
curl -s -X POST "https://api.firecrawl.dev/v2/search" \
    -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "query": "firecrawl",
      "limit": 3
    }'
```

```bash
# Search the web
firecrawl search "firecrawl web scraping" --limit 5 --pretty
```

--------------------------------

### POST /v2/agent/start - Start Asynchronous Agent Job

Source: https://docs.firecrawl.dev/features/agent

Starts an asynchronous agent job and immediately returns a Job ID. This allows for polling the status of the job separately.

```APIDOC
## POST /v2/agent/start

### Description
Initiates an asynchronous agent job. It returns a Job ID immediately, which can then be used to poll for the job's status and results.

### Method
POST

### Endpoint
/v2/agent/start

#### Query Parameters
* **prompt** (string) - Required - The instruction for the agent to follow.
* **urls** (array[string]) - Optional - A list of URLs to scrape and process.
* **model** (string) - Optional - The AI model to use. Options: `spark-1-mini` (default), `spark-1-pro`.

### Request Body
```json
{
  "prompt": "Find the founders of Firecrawl",
  "urls": ["https://firecrawl.dev"],
  "model": "spark-1-mini"
}
```

### Response
#### Success Response (200)
- **id** (string) - The unique identifier for the agent job.

#### Response Example
```json
{
  "id": "job_abc123xyz"
}
```
```

--------------------------------

### GET /team/credit-usage

Source: https://docs.firecrawl.dev/api-reference/endpoint/credit-usage

Retrieves the current credit balance and billing cycle details for the authenticated team.

```APIDOC
## GET /team/credit-usage

### Description
Fetches the remaining credits, plan-specific credit limits, and the current billing period start and end dates for the authenticated team.

### Method
GET

### Endpoint
https://api.firecrawl.dev/v2/team/credit-usage

### Parameters
None required.

### Request Example
```json
{}
```

### Response
#### Success Response (200)
- **success** (boolean) - Indicates if the request was successful.
- **data** (object) - Contains credit usage details.
  - **remainingCredits** (number) - Number of credits remaining for the team.
  - **planCredits** (number) - Number of credits in the base plan.
  - **billingPeriodStart** (string) - Start date of the billing period (ISO 8601).
  - **billingPeriodEnd** (string) - End date of the billing period (ISO 8601).

#### Response Example
```json
{
  "success": true,
  "data": {
    "remainingCredits": 1000,
    "planCredits": 500000,
    "billingPeriodStart": "2025-01-01T00:00:00Z",
    "billingPeriodEnd": "2025-01-31T23:59:59Z"
  }
}
```
```

--------------------------------

### Launch Browser Session with Options

Source: https://docs.firecrawl.dev/sdks/cli

Launches a new browser session with custom configurations like Time To Live (TTL) and live streaming. TTL can be set in seconds.

```bash
firecrawl browser launch-session --ttl 600 --stream
```

```bash
firecrawl browser launch-session --ttl 120 --ttl-inactivity 60
```

--------------------------------

### POST /v2/crawl

Source: https://docs.firecrawl.dev/advanced-scraping-guide

Initiate a crawl of a website with customizable path filtering, scope, and scraping options.

```APIDOC
## POST /v2/crawl

### Description
Starts a crawl job for the specified URL using advanced configuration options like path filtering, discovery depth, and sitemap handling.

### Method
POST

### Endpoint
https://api.firecrawl.dev/v2/crawl

### Request Body
- **url** (string) - Required - The starting URL.
- **includePaths** (array) - Optional - Regex patterns for URLs to include.
- **excludePaths** (array) - Optional - Regex patterns for URLs to exclude.
- **maxDiscoveryDepth** (integer) - Optional - Max link-depth for discovery.
- **limit** (integer) - Optional - Max pages to crawl.

### Request Example
{
  "url": "https://docs.firecrawl.dev",
  "includePaths": ["^/blog/.*$", "^/docs/.*$"],
  "excludePaths": ["^/admin/.*$", "^/private/.*$"],
  "maxDiscoveryDepth": 2,
  "limit": 1000
}
```

--------------------------------

### GET /websites/firecrawl_dev

Source: https://docs.firecrawl.dev/ja/api-reference/endpoint/map

Retrieves a list of links from the specified website, including metadata like page titles and descriptions.

```APIDOC
## GET /websites/firecrawl_dev

### Description
Retrieves a structured list of links found on the target website. Each link object includes the URL, page title, and description if available.

### Method
GET

### Endpoint
/websites/firecrawl_dev

### Parameters
#### Path Parameters
- **None**

### Request Body
- **None**

### Request Example
N/A

### Response
#### Success Response (200)
- **success** (boolean) - Indicates if the request was successful.
- **links** (array) - A list of objects containing website link data.
  - **url** (string) - The absolute URI of the page.
  - **title** (string) - The title of the page, if available.
  - **description** (string) - The meta description of the page, if available.

#### Response Example
{
  "success": true,
  "links": [
    {
      "url": "https://firecrawl.dev/docs",
      "title": "Firecrawl Documentation",
      "description": "Official documentation for Firecrawl."
    }
  ]
}
```

--------------------------------

### Perform web searches with CLI

Source: https://docs.firecrawl.dev/sdks/cli

Examples of executing web searches using the Firecrawl CLI, including limiting result counts and formatting the output for readability.

```bash
# Search the web
firecrawl search "web scraping tutorials"

# Limit results
firecrawl search "AI news" --limit 10

# Pretty print results
firecrawl search "machine learning" --pretty
```

--------------------------------

### Scrape Configuration Parameters

Source: https://docs.firecrawl.dev/api-reference/endpoint/extract

Details on configuring PDF generation, proxy settings, and location-based scraping behavior.

```APIDOC
## POST /scrape

### Description
Configures the scraping request with specific output formats like PDF, proxy strategies, and location-based emulation.

### Method
POST

### Endpoint
/scrape

### Parameters
#### Request Body
- **actions.pdfs** (object) - Optional - Configuration for generating a PDF of the page.
  - **type** (string) - Required - Must be "pdf".
  - **format** (string) - Optional - Page size (e.g., A4, Letter). Default: Letter.
  - **landscape** (boolean) - Optional - Orientation. Default: false.
  - **scale** (number) - Optional - Scale multiplier. Default: 1.
- **location** (object) - Optional - Geographic settings for proxy and language emulation.
  - **country** (string) - Optional - ISO 3166-1 alpha-2 code. Default: US.
  - **languages** (array) - Optional - List of preferred locales.
- **removeBase64Images** (boolean) - Optional - Removes base64 images from output. Default: true.
- **blockAds** (boolean) - Optional - Enables ad/cookie blocking. Default: true.
- **proxy** (string) - Optional - Proxy strategy: "basic", "enhanced", or "auto". Default: auto.
- **storeInCache** (boolean) - Optional - Whether to index the page. Default: true.

### Request Example
{
  "proxy": "auto",
  "blockAds": true,
  "location": {
    "country": "US"
  },
  "actions": {
    "pdfs": {
      "type": "pdf",
      "format": "A4"
    }
  }
}

### Response
#### Success Response (200)
- **success** (boolean) - Indicates if the request was accepted.
- **id** (string) - Unique identifier for the scrape job.
- **invalidURLs** (array) - List of skipped URLs if ignoreInvalidURLs is enabled.

#### Response Example
{
  "success": true,
  "id": "job-123-abc",
  "invalidURLs": []
}
```

--------------------------------

### Install Firecrawl Java SDK

Source: https://docs.firecrawl.dev/sdks/java

Instructions for adding the Firecrawl Java SDK dependency to your project using Gradle (Kotlin DSL, Groovy) and Maven. Requires Java 17 or later.

```kotlin
repositories {
    mavenCentral()
    maven { url = uri("https://jitpack.io") }
}

dependencies {
    implementation("com.github.firecrawl:firecrawl-java-sdk:2.0")
}
```

```groovy
repositories {
    mavenCentral()
    maven { url 'https://jitpack.io' }
}

dependencies {
    implementation 'com.github.firecrawl:firecrawl-java-sdk:2.0'
}
```

```xml
<repositories>
    <repository>
        <id>jitpack.io</id>
        <url>https://jitpack.io</url>
    </repository>
</repositories>

<dependency>
    <groupId>com.github.firecrawl</groupId>
    <artifactId>firecrawl-java-sdk</artifactId>
    <version>2.0</version>
</dependency>
```

--------------------------------

### Crawling a Website

Source: https://docs.firecrawl.dev/sdks/java

Initiates a website crawl starting from a given URL. Allows configuration of crawl depth, limits, and scraping options. Returns a status response with crawled documents.

```APIDOC
## POST /crawlURL

### Description
Crawls a website starting from the provided URL with configurable parameters. It can poll and return crawled documents.

### Method
POST

### Endpoint
/crawlURL

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **url** (string) - Required - The starting URL for the crawl.
- **crawlParams** (object) - Optional - Parameters for controlling the crawl process (e.g., limit, maxDiscoveryDepth, scrapeOptions).
  - **limit** (integer) - Optional - Maximum number of pages to crawl.
  - **maxDiscoveryDepth** (integer) - Optional - Maximum depth of discovery from the starting URL.
  - **scrapeOptions** (object) - Optional - Options for scraping content from crawled pages.
    - **formats** (array of strings) - Optional - Desired output formats (e.g., "markdown").
- **jobId** (string) - Required - A unique identifier for the crawl job.
- **timeout** (integer) - Required - Timeout in seconds for the crawl operation.

### Request Example
```json
{
  "url": "https://firecrawl.dev",
  "crawlParams": {
    "limit": 50,
    "maxDiscoveryDepth": 3,
    "scrapeOptions": {
      "formats": ["markdown"]
    }
  },
  "jobId": "some-unique-id",
  "timeout": 10
}
```

### Response
#### Success Response (200)
- **status** (string) - The status of the crawl job.
- **data** (array of FirecrawlDocument) - An array of crawled documents, if available.
  - **metadata** (object) - Metadata for each document.
    - **sourceURL** (string) - The original URL of the document.

#### Response Example
```json
{
  "status": "completed",
  "data": [
    {
      "metadata": {
        "sourceURL": "https://firecrawl.dev"
      }
    }
  ]
}
```
```

--------------------------------

### Check CLI Version

Source: https://docs.firecrawl.dev/sdks/cli

Commands to display the currently installed version of the Firecrawl CLI.

```bash
firecrawl version
# or
firecrawl --version
```

--------------------------------

### Perform Basic Web Search with Firecrawl

Source: https://docs.firecrawl.dev/features/search

Examples of how to perform a basic web search using Firecrawl across different platforms. This includes setting up the client, specifying a query, and optionally setting a limit for the number of results. The output is typically a data object or a JSON payload.

```python
from firecrawl import Firecrawl

firecrawl = Firecrawl(api_key="fc-YOUR-API-KEY")

results = firecrawl.search(
    query="firecrawl",
    limit=3,
)
print(results)
```

```javascript
import Firecrawl from '@mendable/firecrawl-js';

const firecrawl = new Firecrawl({ apiKey: "fc-YOUR-API-KEY" });

const results = await firecrawl.search('firecrawl', {
  limit: 3,
  scrapeOptions: { formats: ['markdown'] }
});
console.log(results);
```

```bash
curl -s -X POST "https://api.firecrawl.dev/v2/search" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "firecrawl",
    "limit": 3
  }'
```

```bash
# Search the web
firecrawl search "firecrawl web scraping" --limit 5 --pretty
```

--------------------------------

### Handle Firecrawl SDK Exceptions in Java

Source: https://docs.firecrawl.dev/sdks/java

Demonstrates how to catch and handle `ApiException` for HTTP errors and `FirecrawlException` for other SDK-related issues. It also includes handling potential `IOException` for network problems. This example requires the Firecrawl SDK and standard Java I/O libraries.

```java
import dev.firecrawl.exception.ApiException;
import dev.firecrawl.exception.FirecrawlException;
import java.io.IOException;

try {
    ScrapeParams params = new ScrapeParams();
    params.setFormats(new String[]{"markdown"});
    FirecrawlDocument doc = client.scrapeURL("https://firecrawl.dev", params);
} catch (ApiException e) {
    System.err.println("API error " + e.getStatusCode() + ": " + e.getResponseBody());
} catch (FirecrawlException e) {
    System.err.println("Firecrawl error: " + e.getMessage());
} catch (IOException e) {
    System.err.println("Network error: " + e.getMessage());
}
```

--------------------------------

### GET /browser/list

Source: https://docs.firecrawl.dev/sdks/cli

Retrieves a list of all active browser sessions.

```APIDOC
## GET /browser/list

### Description
Returns a list of all currently active browser sessions.

### Method
GET

### Endpoint
/browser/list

### Response
#### Success Response (200)
- **sessions** (array) - List of active session objects.

#### Response Example
{
  "sessions": [{"id": "sess_12345", "status": "active"}]
}
```

--------------------------------

### Troubleshoot Docker Containers

Source: https://docs.firecrawl.dev/contributing/self-host

Command to inspect logs for specific Docker containers to diagnose startup failures.

```bash
docker logs [container_name]
```

--------------------------------

### Webhook Crawl Started

Source: https://docs.firecrawl.dev/zh/api-reference/endpoint/webhook-crawl-started

Documentation for the crawlStarted webhook event triggered by the Firecrawl service.

```APIDOC
## POST /webhooks/crawlStarted

### Description
This endpoint represents the webhook notification sent when a crawl job has successfully started.

### Method
POST

### Endpoint
/webhooks/crawlStarted

### Parameters
#### Request Body
- **jobId** (string) - Required - The unique identifier for the crawl job.
- **status** (string) - Required - The status of the job (e.g., "started").
- **timestamp** (string) - Required - ISO 8601 formatted time of the event.

### Request Example
{
  "jobId": "uuid-1234-5678",
  "status": "started",
  "timestamp": "2023-10-27T10:00:00Z"
}

### Response
#### Success Response (200)
- **message** (string) - Confirmation that the webhook was received.

#### Response Example
{
  "message": "Webhook received successfully"
}
```

--------------------------------

### Configure FirecrawlTools with Custom Options

Source: https://docs.firecrawl.dev/developer-guides/llm-sdks-and-frameworks/vercel-ai-sdk

Shows how to initialize `FirecrawlTools()` with custom configurations for API keys, default search options, and scrape options. It also demonstrates how to enable or disable specific tools like the browser.

```typescript
const tools = FirecrawlTools({
  apiKey: 'fc-custom-key',                // optional, defaults to env var
  search: { limit: 3, country: 'US' },    // default search options
  scrape: { onlyMainContent: true },       // default scrape options
  browser: {},                             // enable browser tool
});

const tools = FirecrawlTools({
  browser: false,   // search + scrape only
});
```

--------------------------------

### GET /team/token-usage

Source: https://docs.firecrawl.dev/api-reference/endpoint/token-usage

Retrieves the current token usage and billing cycle information for the authenticated team.

```APIDOC
## GET /team/token-usage

### Description
Fetches the remaining token balance and billing period details for the authenticated team. This endpoint is useful for monitoring usage against plan limits.

### Method
GET

### Endpoint
/team/token-usage

### Parameters
None

### Request Example
GET /v2/team/token-usage
Authorization: Bearer <YOUR_API_KEY>

### Response
#### Success Response (200)
- **success** (boolean) - Indicates if the request was successful.
- **data** (object) - Contains usage details.
  - **remainingTokens** (number) - Number of tokens remaining for the team.
  - **planTokens** (number) - Total tokens allocated in the plan (excluding coupons).
  - **billingPeriodStart** (string) - ISO 8601 timestamp for the start of the billing period.
  - **billingPeriodEnd** (string) - ISO 8601 timestamp for the end of the billing period.

#### Response Example
{
  "success": true,
  "data": {
    "remainingTokens": 1000,
    "planTokens": 500000,
    "billingPeriodStart": "2025-01-01T00:00:00Z",
    "billingPeriodEnd": "2025-01-31T23:59:59Z"
  }
}
```

--------------------------------

### Map Website Links with Options (cURL)

Source: https://docs.firecrawl.dev/advanced-scraping-guide

This snippet illustrates how to use the /v2/map endpoint to identify URLs related to a given website. It includes the target URL and optional parameters like 'search' for filtering links by text, 'limit' for the number of results, 'sitemap' for controlling sitemap usage, and 'includeSubdomains' to expand the search scope.

```bash
curl -X POST https://api.firecrawl.dev/v2/map \
    -H 'Content-Type: application/json' \
    -H 'Authorization: Bearer fc-YOUR-API-KEY' \
    -d '{
      "url": "https://docs.firecrawl.dev"
    }'
```

--------------------------------

### Scrape a single page with Firecrawl

Source: https://docs.firecrawl.dev/advanced-scraping-guide

Demonstrates how to perform a basic scrape of a URL to retrieve clean markdown content. Requires an API key and the respective SDK or HTTP client.

```python
# pip install firecrawl-py

from firecrawl import Firecrawl

firecrawl = Firecrawl(api_key="fc-YOUR-API-KEY")

doc = firecrawl.scrape("https://firecrawl.dev")

print(doc.markdown)
```

```javascript
// npm install @mendable/firecrawl-js

import { Firecrawl } from 'firecrawl-js';

const firecrawl = new Firecrawl({ apiKey: 'fc-YOUR-API-KEY' });

const doc = await firecrawl.scrape('https://firecrawl.dev');

console.log(doc.markdown);
```

```bash
curl -X POST https://api.firecrawl.dev/v2/scrape \
    -H 'Content-Type: application/json' \
    -H 'Authorization: Bearer fc-YOUR-API-KEY' \
    -d '{
      "url": "https://docs.firecrawl.dev"
    }'
```

--------------------------------

### Configure PDF parsing options

Source: https://docs.firecrawl.dev/advanced-scraping-guide

Shows how to define the parsers configuration object to enable PDF processing with specific modes like 'fast' or 'ocr' and page limits.

```json
"parsers": [{ "type": "pdf", "mode": "fast", "maxPages": 50 }]
```

--------------------------------

### Crawl a Website with Options using Firecrawl Node SDK

Source: https://docs.firecrawl.dev/sdks/node

Demonstrates how to initiate a website crawl using the `crawl` method in the Firecrawl Node.js SDK. It allows setting parameters like crawl limit, polling interval, and timeout for the crawl job.

```javascript
const job = await firecrawl.crawl('https://docs.firecrawl.dev', { limit: 5, pollInterval: 1, timeout: 120 });
console.log(job.status);
```

--------------------------------

### GET /v2/browser

Source: https://docs.firecrawl.dev/features/browser

Retrieves a list of active or all browser sessions associated with the API key.

```APIDOC
## GET /v2/browser

### Description
List all browser sessions. Optionally filter by status.

### Method
GET

### Endpoint
/v2/browser

### Parameters
#### Query Parameters
- **status** (string) - Optional - Filter sessions by status (e.g., "active")

### Request Example
curl -X GET "https://api.firecrawl.dev/v2/browser?status=active" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY"

### Response
#### Success Response (200)
- **success** (boolean) - Indicates request success
- **sessions** (array) - List of session objects

#### Response Example
{
  "success": true,
  "sessions": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "status": "active",
      "cdpUrl": "wss://cdp-proxy.firecrawl.dev/cdp/550e8400-e29b-41d4-a716-446655440000",
      "liveViewUrl": "https://liveview.firecrawl.dev/550e8400-e29b-41d4-a716-446655440000"
    }
  ]
}
```

--------------------------------

### Manage Crawl Jobs in Java

Source: https://docs.firecrawl.dev/sdks/java

Demonstrates starting a crawl asynchronously, checking its status via job ID, and cancelling an active crawl job.

```Java
CrawlParams crawlParams = new CrawlParams();
crawlParams.setLimit(100);

CrawlResponse start = client.startCrawl("https://firecrawl.dev", crawlParams);
System.out.println("Job ID: " + start.getId());

CrawlStatusResponse status = client.getCrawlStatus(start.getId());
System.out.println("Status: " + status.getStatus());

CancelCrawlJobResponse result = client.cancelCrawlJob(start.getId());
System.out.println(result);
```

--------------------------------

### GET /llms.txt

Source: https://docs.firecrawl.dev/pt-BR/api-reference/endpoint/webhook-agent-started

Retrieves the complete documentation index for Firecrawl, useful for discovering available pages and API endpoints.

```APIDOC
## GET /llms.txt

### Description
Fetches the complete documentation index for the Firecrawl platform. This file serves as a sitemap for LLMs to discover all available documentation pages.

### Method
GET

### Endpoint
https://docs.firecrawl.dev/llms.txt

### Response
#### Success Response (200)
- **content** (text/plain) - The full list of documentation URLs available in the Firecrawl knowledge base.
```

--------------------------------

### Batch Scraping Started Event

Source: https://docs.firecrawl.dev/pt-BR/api-reference/endpoint/webhook-batch-scrape-started

This event is triggered when a batch scraping operation has been initiated.

```APIDOC
## POST /batchScrapeStarted

### Description
This endpoint is called when a batch scraping process begins. It is part of the webhook system to notify about the start of large scraping tasks.

### Method
POST

### Endpoint
/batchScrapeStarted

### Parameters
#### Request Body
- **event_id** (string) - Required - Unique identifier for the event.
- **timestamp** (string) - Required - The time when the event occurred (ISO 8601 format).
- **data** (object) - Required - Contains details about the batch scraping job.
  - **job_id** (string) - Required - Identifier for the batch scraping job.
  - **status** (string) - Required - Current status of the job (e.g., 'started').

### Request Example
```json
{
  "example": {
    "event_id": "evt_abc123",
    "timestamp": "2023-10-27T10:00:00Z",
    "data": {
      "job_id": "job_xyz789",
      "status": "started"
    }
  }
}
```

### Response
#### Success Response (200)
- **message** (string) - Confirmation message.

#### Response Example
```json
{
  "example": {
    "message": "Batch scraping started event received."
  }
}
```
```

--------------------------------

### Crawling a Website

Source: https://docs.firecrawl.dev/sdks/node

Crawl a website starting from a given URL, with options to limit the crawl depth and specify output formats.

```APIDOC
## Crawl Website

Crawl a website starting from a given URL. This method allows for deep crawling and content extraction.

### Method

`POST`

### Endpoint

`/v1/crawl

### Parameters

#### Request Body

- **url** (string) - Required - The starting URL for the crawl.
- **limit** (integer) - Optional - The maximum number of pages to crawl. Defaults to 100.
- **page_wait_time** (integer) - Optional - Time in milliseconds to wait between page loads. Defaults to 1000.
- **crawl_type** (string) - Optional - Type of crawl. Can be `web` or `sitemap`. Defaults to `web`.
- **sitemap** (string) - Optional - If `sitemap: 'only'`, only sitemap URLs will be crawled. Requires `crawl_type: 'sitemap'`.
- **scrape_options** (object) - Optional - Options for scraping individual pages during the crawl.
  - **formats** (array) - Optional - Formats to scrape (e.g., `['markdown', 'html']`).
  - **include_links** (boolean) - Optional - Whether to include links.

### Request Example

```json
{
  "url": "https://docs.firecrawl.dev",
  "limit": 5,
  "scrape_options": {
    "formats": ["markdown", "html"]
  }
}
```

### Response

#### Success Response (200)

- **status** (string) - The status of the crawl job (e.g., 'completed', 'running').
- **data** (array) - An array of scraped data objects for each crawled page.

#### Response Example

```json
{
  "status": "completed",
  "data": [
    {
      "url": "https://docs.firecrawl.dev/",
      "content": "# Firecrawl Docs\n..."
    },
    {
      "url": "https://docs.firecrawl.dev/api",
      "content": "# API Reference\n..."
    }
  ]
}
```
```

--------------------------------

### Browser Actions API

Source: https://docs.firecrawl.dev/advanced-scraping-guide

This section details the available actions that can be executed before scraping a webpage. These actions allow for dynamic content interaction, navigation, and preparation of the page for scraping.

```APIDOC
## POST /v2/scrape

### Description
Run browser actions before scraping. This is useful for dynamic content, navigation, or user-gated pages. You can include up to 50 actions per request, and the combined wait time across all `wait` actions and `waitFor` must not exceed 60 seconds.

### Method
POST

### Endpoint
/v2/scrape

### Parameters
#### Query Parameters
- **url** (string) - Required - The URL of the website to scrape.
- **actions** (array) - Optional - An array of actions to perform before scraping.
  - **type** (string) - Required - The type of action to perform. Possible values: `wait`, `click`, `write`, `press`, `scroll`, `screenshot`, `scrape`, `executeJavascript`, `pdf`.
  - **milliseconds** (number) - Optional - For `wait` action, wait for a fixed duration in milliseconds.
  - **selector** (string) - Optional - For `wait` and `click` actions, the CSS selector of the element to interact with. For `wait` with a selector, it times out after 30 seconds.
  - **all** (boolean) - Optional - For `click` action, set to `true` to click every matching element.
  - **text** (string) - Optional - For `write` action, the text to type into the focused field.
  - **key** (string) - Optional - For `press` action, the keyboard key to press (e.g., `"Enter"`, `"Tab"`, `"Escape"`).
  - **direction** (string) - Optional - For `scroll` action, the direction to scroll (`"up"` or `"down"`). Defaults to `"down"`.
  - **fullPage** (boolean) - Optional - For `screenshot` action, capture the full page.
  - **quality** (number) - Optional - For `screenshot` action, the quality of the screenshot (0-100).
  - **viewport** (object) - Optional - For `screenshot` action, the viewport dimensions (`{ width, height }`). Max resolution is 7680x4320.
  - **script** (string) - Optional - For `executeJavascript` action, the JavaScript code to execute.
  - **format** (string) - Optional - For `pdf` action, the PDF format (e.g., `"A4"`, `"Letter"`). Defaults to `"Letter"`.
  - **landscape** (boolean) - Optional - For `pdf` action, set to `true` for landscape orientation.
  - **scale** (number) - Optional - For `pdf` action, the scale of the PDF.
- **formats** (array) - Optional - An array of desired output formats (e.g., `["markdown"]`).

### Request Example
```json
{
  "url": "https://example.com",
  "actions": [
    { "type": "wait", "milliseconds": 1000 },
    { "type": "click", "selector": "#accept" },
    { "type": "scroll", "direction": "down" },
    { "type": "click", "selector": "#q" },
    { "type": "write", "text": "firecrawl" },
    { "type": "press", "key": "Enter" },
    { "type": "wait", "milliseconds": 2000 }
  ],
  "formats": ["markdown"]
}
```

### Response
#### Success Response (200)
- **markdown** (string) - The scraped content in markdown format.
- **html** (string) - The scraped content in HTML format.
- **screenshot** (string) - Base64 encoded screenshot.
- **pdf** (string) - Base64 encoded PDF.
- **javascript_result** (object) - The result of `executeJavascript` action.

#### Response Example
```json
{
  "markdown": "# Scraped Content\nThis is an example of scraped content."
}
```
```

--------------------------------

### GET /v2/agent/{jobId} - Get Agent Job Status

Source: https://docs.firecrawl.dev/features/agent

Retrieves the current status and results of an asynchronous agent job using its Job ID. Results are available for 24 hours after completion.

```APIDOC
## GET /v2/agent/{jobId}

### Description
Polls the status of an asynchronous agent job using its unique Job ID. If the job is completed, the results are returned.

### Method
GET

### Endpoint
/v2/agent/{jobId}

#### Path Parameters
* **jobId** (string) - Required - The ID of the agent job to check.

### Response
#### Success Response (200)
- **success** (boolean) - Indicates if the operation was successful.
- **status** (string) - The current status of the job (`processing`, `completed`, `failed`).
- **data** (object) - The extracted data, only present if `status` is `completed`.
- **expiresAt** (string) - The timestamp when the results will expire.
- **creditsUsed** (integer) - The number of credits consumed by the job.

#### Response Example (Processing)
```json
{
  "success": true,
  "status": "processing",
  "expiresAt": "2024-12-15T00:00:00.000Z"
}
```

#### Response Example (Completed)
```json
{
  "success": true,
  "status": "completed",
  "data": {
    "founders": [
      {
        "name": "Eric Ciarla",
        "role": "Co-founder"
      }
    ]
  },
  "expiresAt": "2024-12-15T00:00:00.000Z",
  "creditsUsed": 15
}
```
```

--------------------------------

### Browser Sandbox Session Management and Execution (Node.js, Python, cURL)

Source: https://docs.firecrawl.dev/features/browser

Demonstrates how to launch, execute code within, and close a browser sandbox session using Firecrawl. Supports Node.js, Python, and cURL for interaction. Requires API key and SDK installation.

```javascript
// npm install @mendable/firecrawl-js
import Firecrawl from '@mendable/firecrawl-js';

const firecrawl = new Firecrawl({ apiKey: "fc-YOUR-API-KEY" });

// 1. Launch a session
const session = await firecrawl.browser();
console.log(session.cdpUrl); // wss://cdp-proxy.firecrawl.dev/cdp/...

// 2. Execute code
const result = await firecrawl.browserExecute(session.id, {
  code: `
    await page.goto("https://news.ycombinator.com");
    const title = await page.title();
    console.log(title);
  `,
  language: "node",
});
console.log(result.result); // "Hacker News"

// 3. Close
await firecrawl.deleteBrowser(session.id);
```

```python
# pip install firecrawl
from firecrawl import Firecrawl

app = Firecrawl(api_key="fc-YOUR-API-KEY")

# 1. Launch a session
session = app.browser()
print(session.cdp_url)  # wss://cdp-proxy.firecrawl.dev/cdp/...

# 2. Execute code
result = app.browser_execute(
    session.id,
    code='await page.goto("https://news.ycombinator.com")\ntitle = await page.title()\nprint(title)',
    language="python",
)
print(result.result)  # "Hacker News"

# 3. Close
app.delete_browser(session.id)
```

```bash
# Install the Firecrawl CLI
npm install -g firecrawl-cli

# Shorthand - auto-launches a session, no "execute" needed
firecrawl browser "open https://news.ycombinator.com"
firecrawl browser "snapshot"
firecrawl browser "scrape"

# Close when done
firecrawl browser close
```

```bash
# 1. Launch a session
curl -X POST "https://api.firecrawl.dev/v2/browser" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -H "Content-Type: application/json"

# 2. Execute code
curl -X POST "https://api.firecrawl.dev/v2/browser/YOUR_SESSION_ID/execute" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "await page.goto(\"https://news.ycombinator.com\")\ntitle = await page.title()\nprint(title)"
    "language": "bash"
  }'

# 3. Close
curl -X DELETE "https://api.firecrawl.dev/v2/browser/YOUR_SESSION_ID" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY"
```

--------------------------------

### POST /v1/browser

Source: https://docs.firecrawl.dev/features/browser

Initializes a new browser session, returning a session ID and a CDP WebSocket URL for direct browser control.

```APIDOC
## POST /v1/browser

### Description
Creates a new isolated browser session. This session provides a CDP (Chrome DevTools Protocol) URL that can be used with tools like Playwright to perform complex interactions.

### Method
POST

### Endpoint
/v1/browser

### Parameters
#### Request Body
- **headless** (boolean) - Optional - Whether to run the browser in headless mode.

### Request Example
{
  "headless": true
}

### Response
#### Success Response (200)
- **id** (string) - The unique identifier for the browser session.
- **cdpUrl** (string) - The WebSocket URL used to connect to the browser instance.

#### Response Example
{
  "id": "sess-12345",
  "cdpUrl": "wss://browser.firecrawl.dev?token=..."
}
```

--------------------------------

### Perform Sequential Browser Actions with cURL

Source: https://docs.firecrawl.dev/advanced-scraping-guide

Demonstrates how to execute sequential browser actions such as clicking elements, waiting, and taking screenshots using the Firecrawl scrape API.

```bash
curl -X POST https://api.firecrawl.dev/v2/scrape \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer fc-YOUR-API-KEY' \
  -d '{
    "url": "https://example.com",
    "actions": [
      { "type": "click", "selector": "#load-more" },
      { "type": "wait", "milliseconds": 1000 },
      { "type": "screenshot", "fullPage": true, "quality": 80 }
    ]
  }'
```

--------------------------------

### GET /llms.txt

Source: https://docs.firecrawl.dev/es/api-reference/endpoint/webhook-agent-failed

Retrieves the complete documentation index for Firecrawl to facilitate discovery of available API pages.

```APIDOC
## GET /llms.txt

### Description
Fetches the complete documentation index for the Firecrawl platform. This is useful for LLMs and automated tools to discover all available documentation pages.

### Method
GET

### Endpoint
https://docs.firecrawl.dev/llms.txt

### Response
#### Success Response (200)
- **content** (text/plain) - A list of all available documentation URLs.

#### Response Example
https://docs.firecrawl.dev/introduction
https://docs.firecrawl.dev/api-reference/webhooks
```

--------------------------------

### GET /v1/scrape/analysis

Source: https://docs.firecrawl.dev/api-reference/endpoint/scrape

Retrieves the comparison results between two page versions and extracts branding information from the crawled content.

```APIDOC
## GET /v1/scrape/analysis

### Description
Retrieves the comparison results between two page versions and extracts branding information from the crawled content.

### Method
GET

### Endpoint
/v1/scrape/analysis

### Parameters
#### Query Parameters
- **mode** (string) - Optional - Comparison mode ('git-diff' or 'json').
- **formats** (array) - Optional - Formats to include in response (e.g., 'branding').

### Request Example
{
  "mode": "json",
  "formats": ["branding"]
}

### Response
#### Success Response (200)
- **status** (string) - The result of the comparison (same, changed, removed, new).
- **visibility** (string) - Page visibility (visible, hidden).
- **diff** (string) - Git-style diff of changes.
- **json** (object) - JSON comparison results.
- **branding** (object) - Extracted branding information including colors, fonts, and typography.

#### Response Example
{
  "status": "changed",
  "visibility": "visible",
  "branding": {
    "colorScheme": "light",
    "colors": {
      "primary": "#000000",
      "secondary": "#ffffff"
    },
    "fonts": [{"family": "Inter"}]
  }
}
```

--------------------------------

### GET /crawl/active

Source: https://docs.firecrawl.dev/api-reference/endpoint/crawl-active

Retrieves a list of all currently active crawl jobs associated with the authenticated team.

```APIDOC
## GET /crawl/active

### Description
Retrieves a list of all active crawl jobs for the authenticated team. This is useful for monitoring the status and progress of ongoing scraping tasks.

### Method
GET

### Endpoint
https://api.firecrawl.dev/v2/crawl/active

### Parameters
None

### Request Example
```json
{}
```

### Response
#### Success Response (200)
- **success** (boolean) - Indicates if the request was successful.
- **crawls** (array) - A list of active crawl objects.
  - **id** (uuid) - The unique identifier of the crawl.
  - **teamId** (string) - The ID of the team that owns the crawl.
  - **url** (string) - The origin URL of the crawl.
  - **options** (object) - The crawler options used for this crawl.

#### Response Example
```json
{
  "success": true,
  "crawls": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "teamId": "team_123",
      "url": "https://example.com",
      "options": {
        "onlyMainContent": true
      }
    }
  ]
}
```
```

--------------------------------

### POST /v2/map

Source: https://docs.firecrawl.dev/advanced-scraping-guide

Identify and retrieve a list of URLs related to a given website.

```APIDOC
## POST /v2/map

### Description
Maps the link structure of a website to identify related URLs based on provided filters.

### Method
POST

### Endpoint
https://api.firecrawl.dev/v2/map

### Request Body
- **url** (string) - Required - The website URL to map.
- **search** (string) - Optional - Filter links by text match.
- **limit** (integer) - Optional - Max links to return.

### Request Example
{
  "url": "https://docs.firecrawl.dev"
}
```

--------------------------------

### POST /v2/scrape

Source: https://docs.firecrawl.dev/advanced-scraping-guide

Scrape web pages, execute browser actions like clicking or scrolling, and extract structured data or media such as screenshots and PDFs.

```APIDOC
## POST /v2/scrape

### Description
Scrapes a target URL and optionally performs browser actions or extracts specific formats like markdown, HTML, or JSON.

### Method
POST

### Endpoint
https://api.firecrawl.dev/v2/scrape

### Parameters
#### Request Body
- **url** (string) - Required - The URL to scrape.
- **actions** (array) - Optional - List of sequential browser actions (e.g., click, scroll, wait, screenshot, pdf).
- **formats** (array) - Optional - Desired output formats (markdown, html, links, json, etc.).
- **includeTags** (array) - Optional - CSS selectors to include.
- **excludeTags** (array) - Optional - CSS selectors to exclude.

### Request Example
{
  "url": "https://example.com",
  "actions": [
    { "type": "click", "selector": "#load-more" },
    { "type": "wait", "milliseconds": 1000 }
  ]
}

### Response
#### Success Response (200)
- **data** (object) - The scraped content or extracted data.

#### Response Example
{
  "success": true,
  "data": {
    "markdown": "# Example Content..."
  }
}
```

--------------------------------

### WebSocket Crawl Watcher

Source: https://docs.firecrawl.dev/sdks/node

Start a crawl job and watch its progress in real-time using WebSockets.

```APIDOC
## WebSocket Crawl Watcher

Start a crawl job and monitor its progress using a WebSocket connection. This allows for real-time updates on scraped documents and job status.

### Method

`POST` (for starting the crawl) and WebSocket connection (for watching)

### Endpoint

`/v1/crawl/start` (to get job ID)
WebSocket endpoint (provided upon successful job start)

### Parameters

#### Initial Crawl Start Parameters (same as `Start Crawl Job`)

- **url** (string) - Required - The starting URL.
- **limit** (integer) - Optional - Max pages to crawl.
- **exclude_paths** (array) - Optional - Paths to exclude.

#### Watcher Options

- **kind** (string) - Required - Type of watcher, should be `'crawl'`.
- **pollInterval** (integer) - Optional - Interval in seconds to poll for updates if WebSocket fails.
- **timeout** (integer) - Optional - Timeout in seconds for the watcher.

### Request Example (Starting the crawl)

```javascript
import Firecrawl from '@mendable/firecrawl-js';

const firecrawl = new Firecrawl({ apiKey: 'fc-YOUR-API-KEY' });

const { id } = await firecrawl.startCrawl('https://mendable.ai', {
  excludePaths: ['blog/*'],
  limit: 5,
});
console.log('Crawl Job ID:', id);
```

### WebSocket Events

- **`document`**: Emitted when a new document is successfully scraped.
  - `doc` (object) - The scraped document data.
- **`error`**: Emitted when an error occurs.
  - `err` (object) - The error object.
- **`done`**: Emitted when the crawl job is completed.
  - `state` (object) - The final state of the job, including `status`.

### WebSocket Example (Watching the crawl)

```javascript
const watcher = firecrawl.watcher(id, { kind: 'crawl', pollInterval: 2, timeout: 120 });

watcher.on('document', (doc) => {
  console.log('DOC:', doc);
});

watcher.on('error', (err) => {
  console.error('ERR:', err?.error || err);
});

watcher.on('done', (state) => {
  console.log('DONE:', state.status);
});

// Begin watching (WS with HTTP fallback)
await watcher.start();
```
```

--------------------------------

### Use OpenAI Responses API with Firecrawl as MCP Server

Source: https://docs.firecrawl.dev/developer-guides/llm-sdks-and-frameworks/openai

Illustrates how to use OpenAI's Responses API, configuring Firecrawl as a Model Context Protocol (MCP) server to fetch and process information from the web. This example requires the 'openai' npm package and an OpenAI API key.

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const response = await openai.responses.create({
    model: 'gpt-5-nano',
    tools: [
        {
            type: 'mcp',
            server_label: 'firecrawl',
            server_description: 'A web search and scraping MCP server to scrape and extract content from websites.',
            server_url: `https://mcp.firecrawl.dev/${process.env.FIRECRAWL_API_KEY}/v2/mcp`,
            require_approval: 'never'
        }
    ],
    input: 'Find out what the top stories on Hacker News are and the latest blog post on OpenAI and summarize them in a bullet point format'
});

console.log('Response:', JSON.stringify(response.output, null, 2));
```

--------------------------------

### GET /team/queue-status

Source: https://docs.firecrawl.dev/api-reference/endpoint/queue-status

Retrieves real-time metrics regarding the scrape queue for your team, including active, waiting, and total jobs.

```APIDOC
## GET /team/queue-status

### Description
Retrieves metrics about your team's scrape queue, including the number of active and waiting jobs, along with your plan's concurrency limits.

### Method
GET

### Endpoint
/team/queue-status

### Parameters
None

### Request Example
GET /v2/team/queue-status
Authorization: Bearer <your_api_key>

### Response
#### Success Response (200)
- **success** (boolean) - Indicates if the request was successful.
- **jobsInQueue** (number) - Number of jobs currently in your queue.
- **activeJobsInQueue** (number) - Number of jobs currently active.
- **waitingJobsInQueue** (number) - Number of jobs currently waiting.
- **maxConcurrency** (number) - Maximum number of concurrent active jobs based on your plan.
- **mostRecentSuccess** (string) - Timestamp of the most recent successful job.

#### Response Example
{
  "success": true,
  "jobsInQueue": 5,
  "activeJobsInQueue": 2,
  "waitingJobsInQueue": 3,
  "maxConcurrency": 10,
  "mostRecentSuccess": "2023-10-27T10:00:00Z"
}
```

--------------------------------

### New Summary Format

Source: https://docs.firecrawl.dev/migrate-to-v2

How to use the new 'summary' format for concise page content.

```APIDOC
## New Summary Format

### Description
Specify `"summary"` as a format to directly receive a concise summary of the page content.

### Method
POST

### Endpoint
`/v2/scrape` (example)

### Parameters
#### Request Body
- **format** (string) - Required - Set to `"summary"` to get a summarized output.
- **url** (string) - Required - The URL to scrape.

### Request Example
```json
{
  "url": "https://example.com",
  "format": "summary"
}
```

### Response
#### Success Response (200)
- **content** (string) - The summarized content of the page.

#### Response Example
```json
{
  "content": "This is a summary of the page content."
}
```
```

--------------------------------

### Interact with Web Browser using Firecrawl CLI

Source: https://docs.firecrawl.dev/introduction

The Firecrawl CLI provides a simplified interface for browser automation. After installation, it allows direct execution of browser commands such as opening URLs, taking snapshots, or scraping content. The 'firecrawl browser' command offers shorthand for common tasks and session management.

```bash
# Install the Firecrawl CLI
npm install -g firecrawl-cli

# Shorthand - auto-launches a session, no "execute" needed
firecrawl browser "open https://news.ycombinator.com"
firecrawl browser "snapshot"
firecrawl browser "scrape"

# Close when done
firecrawl browser close
```

--------------------------------

### Search the Web

Source: https://docs.firecrawl.dev/api-reference/v2-introduction

Search the web and get full page content in any format.

```APIDOC
## POST /v2/search

### Description
Searches the web for a given query and returns the full content of the relevant pages.

### Method
POST

### Endpoint
https://api.firecrawl.dev/v2/search

### Parameters
#### Request Body
- **query** (string) - Required - The search query.
- **format** (string) - Optional - The desired output format ('markdown' or 'json'). Defaults to 'markdown'.

### Request Example
```json
{
  "query": "latest AI news",
  "format": "json"
}
```

### Response
#### Success Response (200)
- **results** (array) - An array of search results, where each result contains the page URL and its content.

#### Response Example
```json
{
  "results": [
    {
      "url": "https://example.com/news/ai-update",
      "content": "Latest updates on AI..."
    }
  ]
}
```
```

--------------------------------

### Page Actions Configuration

Source: https://docs.firecrawl.dev/api-reference/endpoint/crawl-active

This section outlines the actions that can be performed on a web page before content is scraped, including waiting for a specified duration or for a specific element to appear, and taking screenshots.

```APIDOC
## Page Actions Configuration

### Description
Define a sequence of actions to perform on a web page before scraping content. Actions include waiting for specific durations or elements, and capturing screenshots.

### Method
N/A (Configuration parameters for scraping endpoints)

### Endpoint
N/A

### Parameters
#### Query Parameters
- **actions** (array) - Optional - Actions to perform on the page before grabbing the content.
  - **type** (string) - Required - The type of action. Enum: ["wait", "screenshot"]
  - **milliseconds** (integer) - Required for 'wait' type - Number of milliseconds to wait. (minimum: 1)
  - **selector** (string) - Required for 'wait' type - CSS selector to wait for. (example: '#my-element')
  - **fullPage** (boolean) - Optional for 'screenshot' type - Whether to capture a full-page screenshot (ignores viewport.height) or limit to the current viewport. (default: false)
  - **quality** (integer) - Optional for 'screenshot' type - The quality of the screenshot (e.g., 0-100).

### Request Example
```json
{
  "actions": [
    {
      "type": "wait",
      "milliseconds": 3000
    },
    {
      "type": "wait",
      "selector": ".important-data"
    },
    {
      "type": "screenshot",
      "fullPage": true,
      "quality": 80
    }
  ]
}
```

### Response
N/A (These are configuration parameters, not a direct response)

### Error Handling
N/A
```

--------------------------------

### Map Website URLs

Source: https://docs.firecrawl.dev/api-reference/v2-introduction

Get a complete list of URLs from any website quickly and reliably.

```APIDOC
## POST /v2/map

### Description
Retrieves a complete list of URLs from a given website.

### Method
POST

### Endpoint
https://api.firecrawl.dev/v2/map

### Parameters
#### Request Body
- **url** (string) - Required - The URL of the website to map.

### Request Example
```json
{
  "url": "https://example.com"
}
```

### Response
#### Success Response (200)
- **urls** (array) - An array of URLs found on the website.

#### Response Example
```json
{
  "urls": [
    "https://example.com/",
    "https://example.com/about"
  ]
}
```
```

--------------------------------

### GET /agent/{jobId}

Source: https://docs.firecrawl.dev/api-reference/endpoint/agent-get

Retrieves the current status, progress, and results of a specific agent job by its unique identifier.

```APIDOC
## GET /agent/{jobId}

### Description
Retrieves the status of an agent job. This endpoint allows you to poll for completion and retrieve extracted data once the job is finished.

### Method
GET

### Endpoint
/agent/{jobId}

### Parameters
#### Path Parameters
- **jobId** (string) - Required - The unique UUID of the agent job.

### Request Example
GET /agent/550e8400-e29b-41d4-a716-446655440000

### Response
#### Success Response (200)
- **success** (boolean) - Indicates if the request was successful.
- **status** (string) - Current status of the job (processing, completed, failed).
- **data** (object) - The extracted data (returned only when status is 'completed').
- **model** (string) - The model preset used (e.g., spark-1-pro).
- **error** (string) - Error message (returned only when status is 'failed').
- **expiresAt** (string) - ISO date-time string for when the job data expires.
- **creditsUsed** (number) - Total credits consumed by the job.

#### Response Example
{
  "success": true,
  "status": "completed",
  "data": { "content": "..." },
  "model": "spark-1-pro",
  "expiresAt": "2023-12-01T12:00:00Z",
  "creditsUsed": 1.5
}
```

--------------------------------

### Get Extract Status

Source: https://docs.firecrawl.dev/api-reference/endpoint/extract-get

Retrieves the status of a web scraping or crawling job using its unique ID.

```APIDOC
## GET /extract/{id}

### Description
Fetches the current status of a specific extract job identified by its ID. This endpoint allows you to monitor the progress and completion of scraping or crawling tasks.

### Method
GET

### Endpoint
/extract/{id}

### Parameters
#### Path Parameters
- **id** (string) - Required - The ID of the extract job (UUID format).

### Response
#### Success Response (200)
- **success** (boolean) - Indicates if the request was successful.
- **data** (object) - Contains the extracted data if the job is completed.
- **status** (string) - Enum: `completed`, `processing`, `failed`, `cancelled` - The current status of the extract job.
- **expiresAt** (string) - Date-time string indicating when the job results will expire.
- **tokensUsed** (integer) - The number of tokens used by the extract job (only available if the job is completed).

#### Response Example
```json
{
  "success": true,
  "data": {},
  "status": "completed",
  "expiresAt": "2024-03-15T10:00:00Z",
  "tokensUsed": 150
}
```
```

--------------------------------

### POST /batch/scrape

Source: https://docs.firecrawl.dev/api-reference/endpoint/batch-scrape

Initiates a batch scraping process for a list of URLs, with support for LLM-based extraction and webhook callbacks.

```APIDOC
## POST /batch/scrape

### Description
Scrape multiple URLs and optionally extract information using an LLM. This endpoint allows for concurrent processing and webhook-based status updates.

### Method
POST

### Endpoint
/batch/scrape

### Parameters
#### Request Body
- **urls** (array of strings) - Required - The list of URLs to scrape.
- **webhook** (object) - Optional - Configuration for webhook notifications (url, headers, metadata, events).
- **maxConcurrency** (integer) - Optional - Maximum number of concurrent scrapes.
- **ignoreInvalidURLs** (boolean) - Optional - If true, ignores invalid URLs instead of failing the request.
- **zeroDataRetention** (boolean) - Optional - If true, enables zero data retention for this batch.

### Request Example
{
  "urls": ["https://example.com", "https://firecrawl.dev"],
  "maxConcurrency": 2,
  "ignoreInvalidURLs": true
}

### Response
#### Success Response (200)
- **id** (string) - The ID of the batch scrape job.
- **status** (string) - The current status of the job.

#### Response Example
{
  "id": "job-123-abc",
  "status": "pending"
}
```

--------------------------------

### GET /team/token-usage/historical

Source: https://docs.firecrawl.dev/api-reference/endpoint/token-usage-historical

Retrieves the historical token usage for the authenticated team on a month-by-month basis. Supports optional filtering by API key.

```APIDOC
## GET /team/token-usage/historical

### Description
Returns historical token usage on a month-by-month basis for the authenticated team. Optionally, usage can be broken down by individual API keys.

### Method
GET

### Endpoint
/team/token-usage/historical

### Parameters
#### Query Parameters
- **byApiKey** (boolean) - Optional - If true, returns usage broken down by API key. Defaults to false.

### Request Example
GET /team/token-usage/historical?byApiKey=false

### Response
#### Success Response (200)
- **success** (boolean) - Indicates if the request was successful.
- **periods** (array) - List of billing periods containing usage data.
  - **startDate** (string) - Start date of the billing period.
  - **endDate** (string) - End date of the billing period.
  - **apiKey** (string) - Name of the API key used (null if byApiKey is false).
  - **totalTokens** (integer) - Total number of tokens used in the billing period.

#### Response Example
{
  "success": true,
  "periods": [
    {
      "startDate": "2025-01-01T00:00:00Z",
      "endDate": "2025-01-31T23:59:59Z",
      "apiKey": null,
      "totalTokens": 1000
    }
  ]
}
```

--------------------------------

### Environment Variable Configuration

Source: https://docs.firecrawl.dev/developer-guides/cookbooks/ai-research-assistant-cookbook

Sets the required API keys for OpenAI and Firecrawl in the local environment configuration file.

```env
OPENAI_API_KEY=sk-your-openai-api-key
FIRECRAWL_API_KEY=fc-your-firecrawl-api-key
```

--------------------------------

### Press Key Action

Source: https://docs.firecrawl.dev/api-reference/endpoint/scrape

Simulates pressing a key on the page. Refer to the provided URL for key codes.

```APIDOC
## POST /websites/firecrawl_dev/actions

### Description
Simulates pressing a key on the page. Refer to the provided URL for key codes.

### Method
POST

### Endpoint
/websites/firecrawl_dev/actions

### Parameters
#### Request Body
- **type** (string) - Required - Must be 'press'.
- **key** (string) - Required - Key to press (e.g., 'Enter', 'ArrowDown').

### Request Example
```json
{
  "actions": [
    {
      "type": "press",
      "key": "Enter"
    }
  ]
}
```

### Response
#### Success Response (200)
- **pdfs** (array) - Array of generated PDF objects.
- **actions** (object) - Object containing results of performed actions.

#### Response Example
```json
{
  "pdfs": [],
  "actions": {
    "press": [
      {
        "key": "Enter"
      }
    ]
  }
}
```
```

--------------------------------

### POST /crawl/params-preview

Source: https://docs.firecrawl.dev/api-reference/endpoint/crawl-params-preview

Preview crawl parameters generated from a natural language prompt to configure web scraping tasks.

```APIDOC
## POST /crawl/params-preview

### Description
Generates structured crawl parameters based on a natural language prompt and a target URL. This helps in configuring complex crawling tasks without manual parameter tuning.

### Method
POST

### Endpoint
/crawl/params-preview

### Parameters
#### Request Body
- **url** (string) - Required - The URL to crawl
- **prompt** (string) - Required - Natural language prompt describing what you want to crawl

### Request Example
{
  "url": "https://example.com",
  "prompt": "Crawl all blog posts and exclude images"
}

### Response
#### Success Response (200)
- **success** (boolean) - Indicates if the request was successful
- **data** (object) - The generated crawl configuration parameters including includePaths, excludePaths, maxDepth, and more.

#### Response Example
{
  "success": true,
  "data": {
    "url": "https://example.com",
    "includePaths": ["/blog/*"],
    "excludePaths": ["/images/*"],
    "maxDepth": 2
  }
}
```

--------------------------------

### GET /v2/browser

Source: https://docs.firecrawl.dev/api-reference/endpoint/browser-list

Retrieves a list of all browser sessions, with an optional filter for session status.

```APIDOC
## GET /v2/browser

### Description
Retrieve a list of all browser sessions, optionally filtered by status. This endpoint requires an Authorization header with a Bearer token.

### Method
GET

### Endpoint
https://api.firecrawl.dev/v2/browser

### Parameters
#### Query Parameters
- **status** (string) - Optional - Filter by session status: "active" or "destroyed"

### Request Example
```bash
curl -X GET "https://api.firecrawl.dev/v2/browser?status=active" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY"
```

### Response
#### Success Response (200)
- **success** (boolean) - Whether the request succeeded
- **sessions** (array) - List of session objects

#### Session Object Fields
- **id** (string) - Unique session identifier
- **status** (string) - Current session status ("active" or "destroyed")
- **cdpUrl** (string) - WebSocket URL for CDP connections
- **liveViewUrl** (string) - URL to watch the session in real time
- **interactiveLiveViewUrl** (string) - URL to interact with the session in real time
- **createdAt** (string) - ISO 8601 timestamp of session creation
- **lastActivity** (string) - ISO 8601 timestamp of last activity

#### Response Example
{
  "success": true,
  "sessions": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "status": "active",
      "cdpUrl": "wss://cdp-proxy.firecrawl.dev/cdp/550e8400-e29b-41d4-a716-446655440000",
      "liveViewUrl": "https://liveview.firecrawl.dev/550e8400-e29b-41d4-a716-446655440000",
      "interactiveLiveViewUrl": "https://liveview.firecrawl.dev/550e8400-e29b-41d4-a716-446655440000?interactive=true",
      "createdAt": "2025-06-01T12:00:00Z",
      "lastActivity": "2025-06-01T12:05:30Z"
    }
  ]
}
```

--------------------------------

### POST /v2/agent

Source: https://docs.firecrawl.dev/advanced-scraping-guide

Initiates an autonomous, multi-page data extraction job. This endpoint operates asynchronously, requiring polling for results.

```APIDOC
## POST /v2/agent

### Description
Starts an autonomous agent job to crawl and extract data across multiple pages.

### Method
POST

### Endpoint
https://api.firecrawl.dev/v2/agent

### Parameters
#### Request Body
- **url** (string) - Required - The starting URL for the agent.
- **prompt** (string) - Required - Instructions for the agent on what to extract.

### Request Example
{
  "url": "https://docs.firecrawl.dev",
  "prompt": "Extract all documentation headings and links."
}

### Response
#### Success Response (200)
- **jobId** (string) - The unique identifier for the asynchronous job.

#### Response Example
{
  "jobId": "abc-123-xyz"
}
```

--------------------------------

### Agent-Browser Shorthand Commands (Bash)

Source: https://docs.firecrawl.dev/features/browser

Provides a simplified way to interact with agent-browser, a headless browser CLI. These commands are sent directly to agent-browser, automatically injecting necessary flags and launching a session if needed. Useful for quick browser interactions.

```bash
firecrawl browser "open https://example.com"
firecrawl browser "snapshot"
firecrawl browser "click @e5"
```

--------------------------------

### Check Firecrawl CLI Status

Source: https://docs.firecrawl.dev/sdks/cli

Verifies the installation and authentication status of the Firecrawl CLI, and displays rate limit information such as concurrency and remaining credits.

```bash
firecrawl --status
```

--------------------------------

### GET /scrape-metadata

Source: https://docs.firecrawl.dev/api-reference/endpoint/batch-scrape-get

Describes the metadata structure returned when scraping a webpage, including URL details, status codes, and extracted content.

```APIDOC
## GET /scrape-metadata

### Description
Returns the metadata associated with a scraped webpage, including the final URL, status codes, and extracted page attributes.

### Method
GET

### Endpoint
/scrape-metadata

### Parameters
#### Response Body
- **language** (string/array) - Optional - Language extracted from the page.
- **sourceURL** (string) - Required - The original URL requested.
- **url** (string) - Required - The final URL after redirects.
- **keywords** (string/array) - Optional - Keywords extracted from the page.
- **ogLocaleAlternate** (array) - Optional - Alternative locales for the page.
- **statusCode** (integer) - Required - The HTTP status code of the page.
- **error** (string) - Optional - Error message if the request failed.

### Response Example
{
  "url": "https://example.com",
  "statusCode": 200,
  "language": "en",
  "keywords": ["api", "documentation"]
}
```

--------------------------------

### Launch Browser Session with Firecrawl

Source: https://docs.firecrawl.dev/features/browser

Launches a new browser session, returning a session ID, CDP URL, and live view URL. Requires an API key. Supports custom time-to-live (TTL) for the session and its activity.

```javascript
import Firecrawl from '@mendable/firecrawl-js';

const firecrawl = new Firecrawl({ apiKey: "fc-YOUR-API-KEY" });

const session = await firecrawl.browser({
  ttl: 120,
  activityTtl: 60,
});

console.log(session.id);
console.log(session.cdpUrl);      // wss://cdp-proxy.firecrawl.dev/cdp/...
console.log(session.liveViewUrl); // https://liveview.firecrawl.dev/...
```

```python
from firecrawl import Firecrawl

app = Firecrawl(api_key="fc-YOUR-API-KEY")

session = app.browser(
    ttl=120,
    activity_ttl=60,
)

print(session.id)
print(session.cdp_url)        # wss://cdp-proxy.firecrawl.dev/cdp/...
print(session.live_view_url)  # https://liveview.firecrawl.dev/...
```

```bash
# Launch with live view and custom TTL
firecrawl browser launch-session --stream --ttl 120 --ttl-inactivity 60

# Launch and save session info to file
firecrawl browser launch-session -o session.json --json
```

```curl
curl -X POST "https://api.firecrawl.dev/v2/browser" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "ttl": 120,
    "activityTtl": 60
  }'
```

--------------------------------

### Specify Proxy Location

Source: https://docs.firecrawl.dev/features/proxies

You can request a specific proxy location by setting the `location.country` parameter in your request. For example, to use a Brazilian proxy, set `location.country` to `BR`.

```APIDOC
## POST /v2/scrape

### Description
Scrapes a given URL and returns the content in the specified format, with options for proxy location and type.

### Method
POST

### Endpoint
/v2/scrape

### Parameters
#### Query Parameters
None

#### Request Body
- **url** (string) - Required - The URL to scrape.
- **formats** (array of strings) - Optional - The desired output format(s) (e.g., "markdown", "html").
- **location** (object) - Optional - Specifies the desired proxy location.
  - **country** (string) - Required if location is specified - The ISO 3166-1 alpha-2 country code for the proxy location (e.g., "US", "BR").
  - **languages** (array of strings) - Optional - A list of preferred browser languages.
- **proxy** (string) - Optional - The type of proxy to use: "basic", "enhanced", or "auto". Defaults to "basic".

### Request Example
```json
{
  "url": "https://example.com",
  "formats": ["markdown"],
  "location": {
    "country": "US",
    "languages": ["en"]
  },
  "proxy": "basic"
}
```

### Response
#### Success Response (200)
- **content** (string) - The scraped content in the specified format.
- **metadata** (object) - Contains metadata about the scrape, such as the URL and format.

#### Response Example
```json
{
  "content": "# Scraped Content\nThis is the content from the website.",
  "metadata": {
    "url": "https://example.com",
    "format": "markdown"
  }
}
```

### Error Handling
- If a requested country does not have an available proxy, Firecrawl will use the closest available region (EU or US) and set the browser location to the requested country.
- If the `proxy` type is set to `auto` and the basic proxy fails, Firecrawl will retry with an enhanced proxy, which will incur an additional credit cost if successful.
```

--------------------------------

### Map a URL (Rust)

Source: https://docs.firecrawl.dev/sdks/rust

Maps all associated links from a specified starting URL. The `map_url` method returns the mapped data or an error if the mapping process fails.

```rust
let map_result = app.map_url("https://firecrawl.dev", None).await;

match map_result {
    Ok(data) => println!("Mapped URLs: {:#?}", data),
    Err(e) => eprintln!("Map failed: {}", e),
}
```

--------------------------------

### Map URL

Source: https://docs.firecrawl.dev/sdks/rust

Maps all associated links from a given starting URL. This is useful for discovering related pages within a website.

```APIDOC
## POST /map_url

### Description
Maps all associated links from a specified starting URL.

### Method
POST

### Endpoint
/map_url

### Parameters
#### Query Parameters
- **url** (string) - Required - The starting URL to map links from.
- **map_options** (object) - Optional - Options for mapping, such as depth or specific filters.

### Request Body
```json
{
  "url": "https://firecrawl.dev",
  "map_options": null
}
```

### Response
#### Success Response (200)
- (object) - An object containing the mapped URLs.

#### Response Example
```json
{
  "mapped_urls": [
    "https://firecrawl.dev/page1",
    "https://firecrawl.dev/page2"
  ]
}
```
```

--------------------------------

### Handle CLI Output

Source: https://docs.firecrawl.dev/sdks/cli

Demonstrates how to pipe, redirect, and format output from the CLI to files or other command-line tools.

```bash
# Pipe markdown to another command
firecrawl https://example.com | head -50

# Redirect to a file
firecrawl https://example.com > output.md

# Save JSON with pretty formatting
firecrawl https://example.com --format markdown,links --pretty -o data.json
```

--------------------------------

### POST /v2/crawl/params-preview

Source: https://docs.firecrawl.dev/pt-BR/migrate-to-v2

This endpoint allows you to preview the results of a crawl with specific parameters. It takes a URL and a prompt to guide the extraction.

```APIDOC
## POST /v2/crawl/params-preview

### Description
This endpoint allows you to preview the results of a crawl with specific parameters. It takes a URL and a prompt to guide the extraction.

### Method
POST

### Endpoint
/v2/crawl/params-preview

### Parameters
#### Query Parameters
None

#### Request Body
- **url** (string) - Required - The URL to crawl.
- **prompt** (string) - Required - The prompt to guide content extraction.

### Request Example
```json
{
  "url": "https://docs.firecrawl.dev",
  "prompt": "Extrair docs e blog"
}
```

### Response
#### Success Response (200)
- **content** (string) - The extracted content based on the prompt.
- **url** (string) - The URL that was crawled.

#### Response Example
```json
{
  "content": "Extracted documentation and blog content from the provided URL.",
  "url": "https://docs.firecrawl.dev"
}
```
```

--------------------------------

### GET /crawl/{id}/errors

Source: https://docs.firecrawl.dev/api-reference/endpoint/crawl-get-errors

Retrieves the errors and robots.txt blocked URLs associated with a specific crawl job ID.

```APIDOC
## GET /crawl/{id}/errors

### Description
Fetches a list of errors encountered during a crawl job, including specific scrape job failures and URLs blocked by robots.txt.

### Method
GET

### Endpoint
/crawl/{id}/errors

### Parameters
#### Path Parameters
- **id** (string, uuid) - Required - The unique identifier of the crawl job.

### Request Example
GET https://api.firecrawl.dev/v2/crawl/550e8400-e29b-41d4-a716-446655440000/errors

### Response
#### Success Response (200)
- **errors** (array) - List of errored scrape jobs and error details.
- **robotsBlocked** (array) - List of URLs blocked by robots.txt.

#### Response Example
{
  "errors": [
    {
      "id": "job_123",
      "timestamp": "2023-10-27T10:00:00Z",
      "url": "https://example.com/page",
      "error": "Timeout error"
    }
  ],
  "robotsBlocked": ["https://example.com/private"]
}
```

--------------------------------

### Scraping API

Source: https://docs.firecrawl.dev/introduction

Scrape any URL and get its content in markdown, HTML, or other formats. See the Scrape feature docs for all options.

```APIDOC
## POST /v2/scrape

### Description
Scrapes a given URL and returns its content in specified formats.

### Method
POST

### Endpoint
/v2/scrape

### Parameters
#### Request Body
- **url** (string) - Required - The URL to scrape.
- **formats** (array of strings) - Optional - An array of desired output formats (e.g., "markdown", "html", "links"). Defaults to ["markdown"].
- **include_links** (boolean) - Optional - Whether to include extracted links in the response.
- **include_images** (boolean) - Optional - Whether to include extracted image URLs in the response.
- **pretty** (boolean) - Optional - Whether to return pretty-printed JSON for CLI usage.

### Request Example
```json
{
  "url": "https://firecrawl.dev",
  "formats": ["markdown", "html"]
}
```

### Response
#### Success Response (200)
- **success** (boolean) - Indicates if the operation was successful.
- **data** (object) - Contains the scraped content in the requested formats.
  - **markdown** (string) - The content in markdown format.
  - **html** (string) - The content in HTML format.
  - **links** (array of strings) - Extracted links from the page.
  - **images** (array of strings) - Extracted image URLs from the page.
  - **metadata** (object) - Metadata about the scraped page.
    - **title** (string) - The title of the page.
    - **description** (string) - The meta description of the page.
    - **language** (string) - The language of the page.
    - **keywords** (string) - Keywords associated with the page.
    - **robots** (string) - The robots meta tag content.
    - **ogTitle** (string) - The Open Graph title.
    - **ogDescription** (string) - The Open Graph description.
    - **ogUrl** (string) - The Open Graph URL.
    - **ogImage** (string) - The Open Graph image URL.
    - **ogLocaleAlternate** (array of strings) - Alternate locales for Open Graph.
    - **ogSiteName** (string) - The Open Graph site name.
    - **sourceURL** (string) - The original URL that was scraped.
    - **statusCode** (integer) - The HTTP status code of the original request.

#### Response Example
```json
{
  "success": true,
  "data" : {
    "markdown": "Launch Week I is here! [See our Day 2 Release 🚀](https://www.firecrawl.dev/blog/launch-week-i-day-2-doubled-rate-limits)[💥 Get 2 months free...",
    "html": "<!DOCTYPE html><html lang=\"en\" class=\"light\" style=\"color-scheme: light;"><body class=\"__variable_36bd41 __variable_d7dc5d font-inter ...",
    "metadata": {
      "title": "Home - Firecrawl",
      "description": "Firecrawl crawls and converts any website into clean markdown.",
      "language": "en",
      "keywords": "Firecrawl,Markdown,Data,Mendable,Langchain",
      "robots": "follow, index",
      "ogTitle": "Firecrawl",
      "ogDescription": "Turn any website into LLM-ready data.",
      "ogUrl": "https://www.firecrawl.dev/",
      "ogImage": "https://www.firecrawl.dev/og.png?123",
      "ogLocaleAlternate": [],
      "ogSiteName": "Firecrawl",
      "sourceURL": "https://firecrawl.dev",
      "statusCode": 200
    }
  }
}
```
```

--------------------------------

### Implement RAG with Vector Search using TypeScript

Source: https://docs.firecrawl.dev/developer-guides/llm-sdks-and-frameworks/llamaindex

A complete TypeScript example demonstrating how to crawl a website using Firecrawl, convert the output into LlamaIndex documents, and index them for vector-based querying with OpenAI models.

```typescript
import Firecrawl from '@mendable/firecrawl-js';
import { Document, VectorStoreIndex, Settings } from 'llamaindex';
import { OpenAI, OpenAIEmbedding } from '@llamaindex/openai';

Settings.llm = new OpenAI({ model: "gpt-4o" });
Settings.embedModel = new OpenAIEmbedding({ model: "text-embedding-3-small" });

const firecrawl = new Firecrawl({ apiKey: process.env.FIRECRAWL_API_KEY });
const crawlResult = await firecrawl.crawl('https://firecrawl.dev', {
  limit: 10,
  scrapeOptions: { formats: ['markdown'] }
});
console.log(`Crawled ${crawlResult.data.length } pages`);

const documents = crawlResult.data.map((page: any, i: number) =>
  new Document({
    text: page.markdown,
    id_: `page-${i}`,
    metadata: { url: page.metadata?.sourceURL }
  })
);

const index = await VectorStoreIndex.fromDocuments(documents);
console.log('Vector index created with embeddings');

const queryEngine = index.asQueryEngine();
const response = await queryEngine.query({ query: 'What is Firecrawl and how does it work?' });

console.log('\nAnswer:', response.toString());
```

--------------------------------

### Generate PDF from Page

Source: https://docs.firecrawl.dev/api-reference/endpoint/batch-scrape

Generates a PDF document from the current web page. You can specify the page size (e.g., 'A4', 'Letter'), orientation (landscape), and scale. The PDF is returned in the `actions.pdfs` array of the response.

```json
{
  "type": "pdf",
  "format": "A4",
  "landscape": true,
  "scale": 0.8
}
```

--------------------------------

### Scrape Website using Firecrawl CLI

Source: https://docs.firecrawl.dev/introduction

This command-line interface command scrapes a website directly. It's a quick way to get website content in markdown format without writing any code. Simply provide the URL as an argument.

```bash
firecrawl https://example.com
```

--------------------------------

### POST /map

Source: https://docs.firecrawl.dev/api-reference/endpoint/map

Maps multiple URLs from a base URL based on provided configuration options.

```APIDOC
## POST /map

### Description
Maps a website to discover URLs. This endpoint allows for deep customization of the crawling process, including sitemap integration, subdomain inclusion, and geographic location settings.

### Method
POST

### Endpoint
/map

### Parameters
#### Request Body
- **url** (string) - Required - The base URL to start crawling from.
- **search** (string) - Optional - A search query to order results by relevance.
- **sitemap** (string) - Optional - Sitemap mode: 'skip', 'include', or 'only'. Default: 'include'.
- **includeSubdomains** (boolean) - Optional - Whether to include subdomains. Default: true.
- **ignoreQueryParameters** (boolean) - Optional - Whether to exclude URLs with query parameters. Default: true.
- **ignoreCache** (boolean) - Optional - Bypass sitemap cache. Default: false.
- **limit** (integer) - Optional - Max number of links to return. Default: 5000.
- **timeout** (integer) - Optional - Timeout in milliseconds.
- **location** (object) - Optional - Proxy and locale settings (country, languages).

### Request Example
{
  "url": "https://example.com",
  "search": "blog",
  "sitemap": "include",
  "includeSubdomains": true,
  "limit": 5000
}

### Response
#### Success Response (200)
- **success** (boolean) - Indicates if the request was successful.
- **links** (array) - List of discovered URLs.

#### Response Example
{
  "success": true,
  "links": ["https://example.com/blog", "https://example.com/about"]
}
```

--------------------------------

### Preview Crawl Parameters with Python

Source: https://docs.firecrawl.dev/es/migrate-to-v2

This snippet demonstrates how to use the `firecrawl.crawl_params_preview` function in Python to preview the results of a web crawl. It takes a URL and a prompt as input and prints the preview. Ensure the firecrawl library is installed.

```python
preview = firecrawl.crawl_params_preview(url='https://docs.firecrawl.dev', prompt='Extract docs and blog')
print(preview)
```

--------------------------------

### POST /v2/scrape

Source: https://docs.firecrawl.dev/advanced-scraping-guide

Scrapes a single URL and returns content in various formats including markdown, HTML, screenshots, and structured JSON data.

```APIDOC
## POST /v2/scrape

### Description
Scrapes a web page and returns the content processed into the requested formats. Supports advanced options like PDF parsing, screenshot capture, and LLM-based structured data extraction.

### Method
POST

### Endpoint
https://api.firecrawl.dev/v2/scrape

### Parameters
#### Request Body
- **url** (string) - Required - The URL of the page to scrape.
- **formats** (array) - Optional - List of output formats (markdown, html, rawHtml, links, images, summary, branding, json, screenshot, changeTracking, attributes).
- **parsers** (array) - Optional - Configuration for specific file types like PDFs (e.g., { "type": "pdf", "mode": "auto" }).

### Request Example
{
  "url": "https://docs.firecrawl.dev",
  "formats": ["markdown", "screenshot"]
}

### Response
#### Success Response (200)
- **data** (object) - The scraped content and metadata.
- **markdown** (string) - The page content converted to clean Markdown.

#### Response Example
{
  "success": true,
  "data": {
    "markdown": "# Welcome to Firecrawl...",
    "metadata": { "title": "Firecrawl Docs" }
  }
}
```

--------------------------------

### Setup Local MCP Server with Firecrawl ADK

Source: https://docs.firecrawl.dev/developer-guides/llm-sdks-and-frameworks/google-adk

This Python code snippet shows how to set up a local MCP server connection to Firecrawl using Google's ADK. It configures the agent to run Firecrawl as a local process, requiring the Firecrawl API key to be set in the environment.

```python
from google.adk.agents.llm_agent import Agent
from google.adk.tools.mcp_tool.mcp_session_manager import StdioConnectionParams
from google.adk.tools.mcp_tool.mcp_toolset import MCPToolset
from mcp import StdioServerParameters

root_agent = Agent(
    model='gemini-2.5-pro',
    name='firecrawl_agent',
    description='A helpful assistant for scraping websites with Firecrawl',
    instruction='Help the user search for website content',
    tools=[
        MCPToolset(
            connection_params=StdioConnectionParams(
                server_params = StdioServerParameters(
                    command='npx',
                    args=[
                        "-y",
                        "firecrawl-mcp",
                    ],
                    env={
                        "FIRECRAWL_API_KEY": "YOUR-API-KEY",
                    }
                ),
                timeout=30,
            ),
        )
    ],
)
```

--------------------------------

### Crawling API (v2)

Source: https://docs.firecrawl.dev/migrate-to-v2

Endpoints for managing asynchronous crawl jobs, including starting, checking status, and canceling crawls.

```APIDOC
## POST /v2/crawl

### Description
Initiates a crawl job for a given URL.

### Method
POST

### Endpoint
https://api.firecrawl.dev/v2/crawl

### Request Body
- **url** (string) - Required - The starting URL for the crawl.
- **maxDiscoveryDepth** (integer) - Optional - Maximum depth to crawl.

## GET /v2/crawl/{job_id}

### Description
Retrieves the status of a specific crawl job.

### Method
GET

### Endpoint
https://api.firecrawl.dev/v2/crawl/{job_id}

### Parameters
#### Path Parameters
- **job_id** (string) - Required - The unique identifier for the crawl job.
```

--------------------------------

### Search and Analyze Web Content with Firecrawl and OpenAI

Source: https://docs.firecrawl.dev/developer-guides/llm-sdks-and-frameworks/openai

Combines Firecrawl's search functionality to find relevant web pages with OpenAI's analysis capabilities to summarize the extracted content. This example uses 'firecrawl-js' and 'openai' npm packages.

```typescript
import FirecrawlApp from '@mendable/firecrawl-js';
import OpenAI from 'openai';

const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Search for relevant information
const searchResult = await firecrawl.search('Next.js 16 new features', {
    limit: 3,
    sources: [{ type: 'web' }], // Other sources: { type: 'news' }, { type: 'images' }
    scrapeOptions: { formats: ['markdown'] }
});

console.log('Search results:', searchResult.web?.length, 'pages found');

// Analyze and summarize the key features
const analysis = await openai.chat.completions.create({
    model: 'gpt-5-nano',
    messages: [{
        role: 'user',
        content: `Summarize the key features: ${JSON.stringify(searchResult)}`
    }]
});

console.log('Analysis:', analysis.choices[0]?.message?.content);
```

--------------------------------

### Browser Sandbox - Create Session

Source: https://docs.firecrawl.dev/sdks/java

Initiates a new browser session within the sandbox environment.

```APIDOC
## Browser Sandbox - Create Session

### Description
Creates a new browser session. This session can then be used to execute code or navigate web pages.

### Method
POST

### Endpoint
/v2/browser

### Parameters
#### Request Body
- **ttl** (integer) - Optional - Time-to-live for the session in seconds. Default is 120 seconds.
- **activityTtl** (integer) - Optional - Time-to-live for user activity within the session in seconds. Default is 60 seconds.

### Request Example
```java
HttpClient http = HttpClient.newHttpClient();

HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://api.firecrawl.dev/v2/browser"))
    .header("Authorization", "Bearer " + System.getenv("FIRECRAWL_API_KEY"))
    .header("Content-Type", "application/json")
    .POST(HttpRequest.BodyPublishers.ofString("{\"ttl\":120,\"activityTtl\":60}"))
    .build();

HttpResponse<String> response = http.send(request, HttpResponse.BodyHandlers.ofString());
System.out.println(response.body()); // contains session id, cdpUrl, liveViewUrl
```

### Response
#### Success Response (200)
- **sessionId** (string) - The unique identifier for the created session.
- **cdpUrl** (string) - The Chrome DevTools Protocol URL for the session.
- **liveViewUrl** (string) - A URL to view the browser session live.

#### Response Example
```json
{
  "sessionId": "sess_abc123",
  "cdpUrl": "ws://localhost:9222/devtools/page/...,
  "liveViewUrl": "https://firecrawl.dev/live/sess_abc123"
}
```
```

--------------------------------

### Configure Playwright Service in Docker Compose

Source: https://docs.firecrawl.dev/contributing/self-host

Instructions for switching the Playwright service build target from the default to the TypeScript version within the docker-compose.yml file.

```plaintext
build: apps/playwright-service-ts
```

--------------------------------

### POST /v2/agent

Source: https://docs.firecrawl.dev/advanced-scraping-guide

Initiates an agent job to extract structured data from specified URLs based on a provided prompt and JSON schema.

```APIDOC
## POST /v2/agent

### Description
Starts an asynchronous agent job to crawl and extract data from the web.

### Method
POST

### Endpoint
/v2/agent

### Parameters
#### Request Body
- **prompt** (string) - Required - Natural-language instructions for data extraction.
- **urls** (array) - Optional - List of URLs to constrain the agent.
- **schema** (object) - Optional - JSON schema defining the structure of the output.
- **maxCredits** (number) - Optional - Maximum credits to spend (default: 2500).
- **strictConstrainToURLs** (boolean) - Optional - If true, only visits provided URLs.
- **model** (string) - Optional - AI model to use (default: "spark-1-mini").

### Request Example
{
  "prompt": "Extract the title and description",
  "urls": ["https://docs.firecrawl.dev"],
  "schema": {"type": "object", "properties": {"title": {"type": "string"}, "description": {"type": "string"}}, "required": ["title"]}
}

### Response
#### Success Response (200)
- **id** (string) - The unique identifier for the agent job.

#### Response Example
{
  "id": "1234-5678-9101"
}
```

--------------------------------

### Crawl Wikipedia Categories

Source: https://docs.firecrawl.dev/developer-guides/common-sites/wikipedia

Crawl multiple pages starting from a Wikipedia portal or category URL to aggregate content.

```typescript
import FirecrawlApp from '@mendable/firecrawl-js';

const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });

const crawlResult = await firecrawl.crawl('https://en.wikipedia.org/wiki/Portal:Artificial_intelligence', {
    limit: 10,
    scrapeOptions: {
        formats: ['markdown']
    }
});

console.log(crawlResult.data);
```

--------------------------------

### GET /team/credit-usage/historical

Source: https://docs.firecrawl.dev/api-reference/endpoint/credit-usage-historical

Retrieves the historical credit usage for the authenticated team, optionally segmented by individual API keys.

```APIDOC
## GET /team/credit-usage/historical

### Description
Returns historical credit usage on a month-by-month basis. The endpoint can optionally break down usage by API key.

### Method
GET

### Endpoint
/team/credit-usage/historical

### Parameters
#### Query Parameters
- **byApiKey** (boolean) - Optional - Get historical credit usage by API key. Defaults to false.

### Request Example
GET /v2/team/credit-usage/historical?byApiKey=false

### Response
#### Success Response (200)
- **success** (boolean) - Indicates if the request was successful.
- **periods** (array) - List of billing periods.
  - **startDate** (string) - Start date of the billing period.
  - **endDate** (string) - End date of the billing period.
  - **apiKey** (string) - Name of the API key used (null if byApiKey is false).
  - **totalCredits** (integer) - Total number of credits used in the billing period.

#### Response Example
{
  "success": true,
  "periods": [
    {
      "startDate": "2025-01-01T00:00:00Z",
      "endDate": "2025-01-31T23:59:59Z",
      "apiKey": null,
      "totalCredits": 1000
    }
  ]
}
```

--------------------------------

### List and Close Firecrawl Browser Sessions

Source: https://docs.firecrawl.dev/sdks/python

Provides code examples for listing all active browser sessions and for closing a specific browser session managed by Firecrawl. This helps in managing cloud resources effectively. Requires the 'firecrawl' library.

```python
# List active sessions
sessions = app.list_browsers(status="active")
for s in sessions.sessions:
    print(s.id, s.status, s.created_at)

# Close a session
app.delete_browser(session.id)
```

--------------------------------

### GET /batch/scrape/{id}/errors

Source: https://docs.firecrawl.dev/api-reference/endpoint/batch-scrape-get-errors

Retrieves a list of errors and blocked URLs associated with a specific batch scrape job identified by its UUID.

```APIDOC
## GET /batch/scrape/{id}/errors

### Description
Fetches error details and robots.txt blocked URLs for a specific batch scraping job.

### Method
GET

### Endpoint
/batch/scrape/{id}/errors

### Parameters
#### Path Parameters
- **id** (string, uuid) - Required - The unique identifier of the batch scrape job.

### Response
#### Success Response (200)
- **errors** (array) - List of objects containing id, timestamp, url, and error message.
- **robotsBlocked** (array) - List of URLs blocked by robots.txt.

#### Response Example
{
  "errors": [
    {
      "id": "job-123",
      "timestamp": "2023-10-27T10:00:00Z",
      "url": "https://example.com",
      "error": "Connection timeout"
    }
  ],
  "robotsBlocked": ["https://example.com/private"]
}
```

--------------------------------

### Search API with Location Customization

Source: https://docs.firecrawl.dev/features/search

Demonstrates how to perform a search using the Firecrawl API and customize the search location. Examples are provided for Python, Node.js, cURL, and CLI.

```APIDOC
## POST /v2/search

### Description
Performs a search query on the web and returns relevant results, with options to customize location.

### Method
POST

### Endpoint
https://api.firecrawl.dev/v2/search

### Parameters
#### Query Parameters
- **query** (string) - Required - The search query string.
- **limit** (integer) - Optional - The maximum number of results to return.
- **location** (string) - Optional - Specifies the geographical location for the search (e.g., "Germany", "San Francisco,California,United States").
- **country** (string) - Optional - Specifies the country code for the search (e.g., "US").

#### Request Body
- **query** (string) - Required - The search query string.
- **limit** (integer) - Optional - The maximum number of results to return.
- **location** (string) - Optional - Specifies the geographical location for the search.

### Request Example (cURL)
```bash
curl -X POST https://api.firecrawl.dev/v2/search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer fc-YOUR_API_KEY" \
  -d '{ "query": "web scraping tools", "limit": 5, "location": "Germany" }'
```

### Response
#### Success Response (200)
- **success** (boolean) - Indicates if the request was successful.
- **data** (array) - An array of search result objects, each containing:
  - **title** (string) - The title of the scraped page.
  - **description** (string) - A brief description of the scraped page.
  - **url** (string) - The URL of the scraped page.
  - **markdown** (string) - The content of the scraped page in Markdown format.
  - **links** (array) - An array of links found on the page.
  - **metadata** (object) - Metadata about the scraped page:
    - **title** (string) - The title of the page.
    - **description** (string) - The description of the page.
    - **sourceURL** (string) - The original URL of the page.
    - **statusCode** (integer) - The HTTP status code of the page.

#### Response Example
```json
{
  "success": true,
  "data": [
    {
      "title": "Firecrawl - The Ultimate Web Scraping API",
      "description": "Firecrawl is a powerful web scraping API that turns any website into clean, structured data for AI and analysis.",
      "url": "https://firecrawl.dev/",
      "markdown": "# Firecrawl\n\nThe Ultimate Web Scraping API\n\n## Turn any website into clean, structured data\n\nFirecrawl makes it easy to extract data from websites for AI applications, market research, content aggregation, and more...",
      "links": [
        "https://firecrawl.dev/pricing",
        "https://firecrawl.dev/docs",
        "https://firecrawl.dev/guides"
      ],
      "metadata": {
        "title": "Firecrawl - The Ultimate Web Scraping API",
        "description": "Firecrawl is a powerful web scraping API that turns any website into clean, structured data for AI and analysis.",
        "sourceURL": "https://firecrawl.dev/",
        "statusCode": 200
      }
    }
  ]
}
```
```

--------------------------------

### Scrape and Crawl Websites with Firecrawl Node SDK

Source: https://docs.firecrawl.dev/sdks/node

Demonstrates how to use the Firecrawl Node.js SDK to scrape a single URL and crawl a website. It shows how to specify desired formats like markdown and HTML, and set crawl limits.

```javascript
import Firecrawl from '@mendable/firecrawl-js';

const firecrawl = new Firecrawl({apiKey: "fc-YOUR_API_KEY"});

// Scrape a website
const scrapeResponse = await firecrawl.scrape('https://firecrawl.dev', {
  formats: ['markdown', 'html'],
});

console.log(scrapeResponse)

// Crawl a website
const crawlResponse = await firecrawl.crawl('https://firecrawl.dev', {
  limit: 100,
  scrapeOptions: {
    formats: ['markdown', 'html'],
  }
});

console.log(crawlResponse)
```

--------------------------------

### Set Custom Cache Freshness Window

Source: https://docs.firecrawl.dev/features/scrape

Define a custom cache freshness window in milliseconds using the maxAge parameter. This example demonstrates setting a 10-minute (600,000 ms) window to optimize performance while maintaining acceptable data freshness.

```python
from firecrawl import Firecrawl
firecrawl = Firecrawl(api_key='fc-YOUR_API_KEY')

doc = firecrawl.scrape(url='https://example.com', max_age=600000, formats=['markdown', 'html'])
print(doc)
```

```js
const firecrawl = new Firecrawl({ apiKey: "fc-YOUR-API-KEY" });

const doc = await firecrawl.scrape('https://example.com', { maxAge: 600000, formats: ['markdown', 'html'] });
console.log(doc);
```

```bash
curl -s -X POST "https://api.firecrawl.dev/v2/scrape" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "maxAge": 600000,
    "formats": ["markdown", "html"]
  }'
```

--------------------------------

### Start Crawl Asynchronously (Python, Node.js, cURL, CLI)

Source: https://docs.firecrawl.dev/features/crawl

The `startCrawl` or `start_crawl` method initiates a crawl job immediately and returns a crawl ID, allowing for asynchronous processing. This is useful for long-running crawls or when custom polling logic is needed. The status can then be retrieved using `getCrawlStatus` or `get_crawl_status` with the provided job ID.

```python
from firecrawl import Firecrawl

firecrawl = Firecrawl(api_key="fc-YOUR-API-KEY")

job = firecrawl.start_crawl(url="https://docs.firecrawl.dev", limit=10)
print(job)

# Check the status of the crawl
status = firecrawl.get_crawl_status(job.id)
print(status)
```

```javascript
import Firecrawl from '@mendable/firecrawl-js';

const firecrawl = new Firecrawl({ apiKey: "fc-YOUR-API-KEY" });

const { id } = await firecrawl.startCrawl('https://docs.firecrawl.dev', { limit: 10 });
console.log(id);

// Check the status of the crawl
const status = await firecrawl.getCrawlStatus(id);
console.log(status);
```

```bash
curl -s -X POST "https://api.firecrawl.dev/v2/crawl" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://docs.firecrawl.dev",
    "limit": 10
  }'
```

```bash
# Start crawl (async, returns job ID immediately)
firecrawl crawl https://firecrawl.dev --limit 100

# Then check status later
firecrawl crawl <job-id>
```

--------------------------------

### Scrape website with timing information

Source: https://docs.firecrawl.dev/sdks/cli

Demonstrates how to initiate a web scrape using the Firecrawl CLI while enabling the timing flag to display request performance metrics.

```bash
firecrawl https://example.com --timing
```

--------------------------------

### Category Response Format Example

Source: https://docs.firecrawl.dev/features/search

Illustrates the structure of the response from a categorized search, including the 'category' field which indicates the source of each search result.

```json
{
  "success": true,
  "data": {
    "web": [
      {
        "url": "https://github.com/example/neural-network",
        "title": "Neural Network Implementation",
        "description": "A PyTorch implementation of neural networks",
        "category": "github"
      },
      {
        "url": "https://arxiv.org/abs/2024.12345",
        "title": "Advances in Neural Network Architecture",
        "description": "Research paper on neural network improvements",
        "category": "research"
      }
    ]
  }
}
```

--------------------------------

### Configure FirecrawlClient with Custom Options (Java)

Source: https://docs.firecrawl.dev/sdks/java

Shows how to instantiate the FirecrawlClient with custom API key, API URL, and HTTP request timeout. This allows for flexible configuration beyond environment variables and default settings.

```java
import java.time.Duration;

FirecrawlClient client = new FirecrawlClient(
    System.getenv("FIRECRAWL_API_KEY"),
    "https://api.firecrawl.dev",
    Duration.ofSeconds(300)
);

```

--------------------------------

### Timing and Cache Parameters

Source: https://docs.firecrawl.dev/advanced-scraping-guide

Manage request timing and caching behavior. Set `waitFor` for additional delays, `maxAge` to control cache freshness, and `timeout` to limit request duration.

```APIDOC
## Timing and Cache

### Description
Manage request timing and caching behavior. Set `waitFor` for additional delays, `maxAge` to control cache freshness, and `timeout` to limit request duration.

### Parameters
#### Query Parameters
- **waitFor** (integer) - Optional - Extra wait time in milliseconds before scraping, on top of smart-wait. Use sparingly.
- **maxAge** (integer) - Optional - Return a cached version if fresher than this value in milliseconds (default is 2 days). Set `0` to always fetch fresh.
- **timeout** (integer) - Optional - Max request duration in milliseconds before aborting (default is 30 seconds).
```

--------------------------------

### POST /v2/crawl (Asynchronous)

Source: https://docs.firecrawl.dev/features/crawl

Starts a crawl job and returns a job ID immediately, allowing for manual status polling for long-running tasks.

```APIDOC
## POST /v2/crawl (Async)

### Description
Starts an asynchronous crawl job. Returns a job ID that can be used to poll for status updates later.

### Method
POST

### Endpoint
/v2/crawl

### Parameters
#### Request Body
- **url** (string) - Required - The base URL to start crawling from.
- **limit** (integer) - Optional - Maximum number of pages to crawl.

### Request Example
{
  "url": "https://docs.firecrawl.dev",
  "limit": 10
}

### Response
#### Success Response (200)
- **success** (boolean) - Indicates if the request was successful.
- **id** (string) - The unique identifier for the crawl job.
- **url** (string) - The status endpoint URL for this specific job.

#### Response Example
{
  "success": true,
  "id": "123-456-789",
  "url": "https://api.firecrawl.dev/v2/crawl/123-456-789"
}
```

--------------------------------

### Analyze Website Content with Gemini Multi-turn Conversation

Source: https://docs.firecrawl.dev/developer-guides/llm-sdks-and-frameworks/gemini

Shows how to scrape a website and then use Gemini's chat capabilities for multi-turn analysis. This example extracts the top stories from Hacker News in two separate conversational turns.

```typescript
import FirecrawlApp from '@mendable/firecrawl-js';
import { GoogleGenAI } from '@google/genai';

const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const scrapeResult = await firecrawl.scrape('https://news.ycombinator.com/', {
    formats: ['markdown']
});

console.log('Scraped content length:', scrapeResult.markdown?.length);

const chat = ai.chats.create({
    model: 'gemini-2.5-flash'
});

// Ask for the top 3 stories on Hacker News
const result1 = await chat.sendMessage({
    message: `Based on this website content from Hacker News, what are the top 3 stories right now?\n\n${scrapeResult.markdown}`
});
console.log('Top 3 Stories:', result1.text);

// Ask for the 4th and 5th stories on Hacker News
const result2 = await chat.sendMessage({
    message: `Now, what are the 4th and 5th top stories on Hacker News from the same content?`
});
console.log('4th and 5th Stories:', result2.text);
```

--------------------------------

### Client Configuration

Source: https://docs.firecrawl.dev/sdks/java

Details on how to configure the Firecrawl client with API keys, URLs, and timeouts.

```APIDOC
## Client Configuration

### Description
Explains the available options for configuring the `FirecrawlClient` constructor, including API key, API URL, and request timeout.

### Parameters
#### Constructor Options
- **apiKey** (String) - Optional - Your Firecrawl API key. Defaults to the `FIRECRAWL_API_KEY` environment variable.
- **apiUrl** (String) - Optional - The base URL for the Firecrawl API. Defaults to `https://api.firecrawl.dev` or the `FIRECRAWL_API_URL` environment variable.
- **timeout** (Duration) - Optional - Sets the HTTP request timeout. Defaults to `null` (no specific timeout).

### Request Example
```java
import java.time.Duration;

FirecrawlClient client = new FirecrawlClient(
    System.getenv("FIRECRAWL_API_KEY"),
    "https://api.firecrawl.dev",
    Duration.ofSeconds(300)
);
```
```

--------------------------------

### Scrape and Extract Structured Data with TypeScript

Source: https://docs.firecrawl.dev/developer-guides/llm-sdks-and-frameworks/langchain

This TypeScript example shows how to use Firecrawl to scrape a website and then leverage LangChain's structured output capabilities with a Zod schema to extract specific company information from the scraped content. It requires Firecrawl and OpenAI API keys.

```typescript
import FirecrawlApp from '@mendable/firecrawl-js';
import { ChatOpenAI } from '@langchain/openai';
import { z } from 'zod';

const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });

const scrapeResult = await firecrawl.scrape('https://stripe.com', {
    formats: ['markdown']
});

console.log('Scraped content length:', scrapeResult.markdown?.length);

const CompanyInfoSchema = z.object({
    name: z.string(),
    industry: z.string(),
    description: z.string(),
    products: z.array(z.string())
});

const model = new ChatOpenAI({
    model: 'gpt-5-nano',
    apiKey: process.env.OPENAI_API_KEY
}).withStructuredOutput(CompanyInfoSchema);

const companyInfo = await model.invoke([
    {
        role: 'system',
        content: 'Extract company information from website content.'
    },
    {
        role: 'user',
        content: `Extract data: ${scrapeResult.markdown}`
    }
]);

console.log('Extracted company info:', companyInfo);
```

--------------------------------

### POST /v2/browser

Source: https://docs.firecrawl.dev/introduction

Initializes a new secure browser session and returns session details including the CDP URL.

```APIDOC
## POST /v2/browser

### Description
Launches a new browser session for remote interaction.

### Method
POST

### Endpoint
https://api.firecrawl.dev/v2/browser

### Request Body
- **Authorization** (header) - Required - Bearer token

### Response
#### Success Response (200)
- **id** (string) - Unique session identifier
- **cdpUrl** (string) - WebSocket URL for CDP access
- **liveViewUrl** (string) - URL for viewing the browser session

#### Response Example
{
  "success": true,
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "cdpUrl": "wss://cdp-proxy.firecrawl.dev/cdp/550e8400-...",
  "liveViewUrl": "https://liveview.firecrawl.dev/550e8400-..."
}
```

--------------------------------

### GET /v2/batch/scrape/{id}

Source: https://docs.firecrawl.dev/features/scrape

Retrieves the status and results of a previously submitted batch scrape job using the job ID.

```APIDOC
## GET /v2/batch/scrape/{id}

### Description
Checks the status of an asynchronous batch scrape job. Returns the current status, progress, and data if completed.

### Method
GET

### Endpoint
https://api.firecrawl.dev/v2/batch/scrape/{id}

### Parameters
#### Path Parameters
- **id** (string) - Required - The unique job ID returned from the initial POST request.

### Response
#### Success Response (200)
- **status** (string) - Current status of the job (e.g., "completed").
- **total** (integer) - Total number of URLs in the batch.
- **completed** (integer) - Number of URLs successfully scraped.
- **data** (array) - List of scraped content objects.

#### Response Example
{
  "status": "completed",
  "total": 36,
  "completed": 36,
  "data": [
    {
      "markdown": "[Firecrawl Docs home page...",
      "metadata": {
        "title": "Build a 'Chat with website' using Groq Llama 3 | Firecrawl",
        "sourceURL": "https://docs.firecrawl.dev/learn/rag-llama3",
        "statusCode": 200
      }
    }
  ]
}
```

--------------------------------

### Content Filtering Parameters

Source: https://docs.firecrawl.dev/advanced-scraping-guide

Control which parts of a webpage are included in the output. Parameters like `onlyMainContent`, `includeTags`, and `excludeTags` allow for precise content selection.

```APIDOC
## Content Filtering

### Description
These parameters control which parts of the page appear in the output. `onlyMainContent` runs first to strip boilerplate (nav, footer, etc.), then `includeTags` and `excludeTags` further narrow the result. If you set `onlyMainContent: false`, the full page HTML is used as the starting point for tag filtering.

### Parameters
#### Query Parameters
- **onlyMainContent** (boolean) - Optional - Return only the main content. Set `false` for the full page.
- **includeTags** (array) - Optional - HTML tags, classes, or IDs to include (e.g. `["h1", "p", ".main-content"]`).
- **excludeTags** (array) - Optional - HTML tags, classes, or IDs to exclude (e.g. `["#ad", "#footer"]`).
```

--------------------------------

### POST /v1/batch-scrape

Source: https://docs.firecrawl.dev/api-reference/endpoint/batch-scrape

Initiates a batch scraping process for multiple URLs with support for various output formats and custom scraping configurations.

```APIDOC
## POST /v1/batch-scrape

### Description
Initiates a batch scrape job for a list of URLs. Supports various output formats including Markdown, HTML, JSON, and screenshots.

### Method
POST

### Endpoint
/v1/batch-scrape

### Parameters
#### Request Body
- **urls** (array) - Required - List of URLs to scrape.
- **formats** (array) - Optional - List of output formats (markdown, html, json, screenshot, etc.).
- **storeInCache** (boolean) - Optional - Whether to store the page in the Firecrawl index. Default: true.
- **proxy** (string) - Optional - Proxy configuration (e.g., "auto"). Default: "auto".

### Request Example
{
  "urls": ["https://example.com", "https://docs.firecrawl.dev"],
  "formats": [{"type": "markdown"}, {"type": "json", "prompt": "Extract main content"}],
  "storeInCache": true
}

### Response
#### Success Response (200)
- **success** (boolean) - Indicates if the request was accepted.
- **id** (string) - The unique identifier for the batch job.
- **url** (string) - The status URL for the job.
- **invalidURLs** (array) - List of URLs that failed validation (if ignoreInvalidURLs is true).

#### Response Example
{
  "success": true,
  "id": "job-123-abc",
  "url": "https://api.firecrawl.dev/v1/batch/job-123-abc",
  "invalidURLs": []
}
```

--------------------------------

### Specify extraction model in Firecrawl agent

Source: https://docs.firecrawl.dev/features/models

Demonstrates how to pass the 'model' parameter to the Firecrawl agent to choose between 'spark-1-mini' and 'spark-1-pro' for data extraction tasks.

```python
from firecrawl import Firecrawl

app = Firecrawl(api_key="fc-YOUR_API_KEY")

# Using Spark 1 Mini (default - can be omitted)
result = app.agent(
    prompt="Find the pricing of Firecrawl",
    model="spark-1-mini"
)

# Using Spark 1 Pro for complex tasks
result = app.agent(
    prompt="Compare all enterprise features and pricing across Firecrawl, Apify, and ScrapingBee",
    model="spark-1-pro"
)

print(result.data)
```

```javascript
import Firecrawl from '@mendable/firecrawl-js';

const firecrawl = new Firecrawl({ apiKey: "fc-YOUR_API_KEY" });

// Using Spark 1 Mini (default - can be omitted)
const result = await firecrawl.agent({
  prompt: "Find the pricing of Firecrawl",
  model: "spark-1-mini"
});

// Using Spark 1 Pro for complex tasks
const resultPro = await firecrawl.agent({
  prompt: "Compare all enterprise features and pricing across Firecrawl, Apify, and ScrapingBee",
  model: "spark-1-pro"
});

console.log(result.data);
```

```bash
# Using Spark 1 Mini (default)
curl -X POST "https://api.firecrawl.dev/v2/agent" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Find the pricing of Firecrawl",
    "model": "spark-1-mini"
  }'

# Using Spark 1 Pro for complex tasks
curl -X POST "https://api.firecrawl.dev/v2/agent" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Compare all enterprise features and pricing across Firecrawl, Apify, and ScrapingBee",
    "model": "spark-1-pro"
  }'
```

--------------------------------

### POST /scrape

Source: https://docs.firecrawl.dev/api-reference/endpoint/batch-scrape

Configures and executes a web scraping request using the ScrapeOptions schema to define how content is retrieved and processed.

```APIDOC
## POST /scrape

### Description
This endpoint initiates a scraping job. It accepts a variety of options to control content extraction, such as filtering tags, handling PDFs, and managing cache settings.

### Method
POST

### Endpoint
/scrape

### Parameters
#### Request Body
- **onlyMainContent** (boolean) - Optional - Only return the main content of the page excluding headers, navs, footers, etc. (Default: true)
- **includeTags** (array) - Optional - Tags to include in the output.
- **excludeTags** (array) - Optional - Tags to exclude from the output.
- **maxAge** (integer) - Optional - Returns a cached version of the page if younger than this age in ms. (Default: 172800000)
- **minAge** (integer) - Optional - If set, only checks cache; returns 404 if no cache found.
- **headers** (object) - Optional - Custom headers to send with the request.
- **waitFor** (integer) - Optional - Delay in ms before fetching content. (Default: 0)
- **mobile** (boolean) - Optional - Emulate mobile device scraping. (Default: false)
- **skipTlsVerification** (boolean) - Optional - Skip TLS certificate verification. (Default: true)
- **timeout** (integer) - Optional - Request timeout in ms. Max 300000. (Default: 30000)
- **parsers** (array) - Optional - Configuration for file processing, specifically PDF parsing modes.

### Request Example
{
  "onlyMainContent": true,
  "mobile": false,
  "timeout": 30000
}

### Response
#### Success Response (200)
- **data** (object) - The scraped content in the requested format.

#### Error Response (429)
- **error** (string) - Request rate limit exceeded.

#### Error Response (500)
- **error** (string) - An unexpected error occurred on the server.
```

--------------------------------

### GET /v2/batch/scrape/{id}

Source: https://docs.firecrawl.dev/features/batch-scrape

Retrieves the status and results of a previously initiated batch scrape job using its unique job ID.

```APIDOC
## GET /v2/batch/scrape/{id}

### Description
Polls the status of a batch scrape job and retrieves the scraped data once the job is completed.

### Method
GET

### Endpoint
https://api.firecrawl.dev/v2/batch/scrape/{id}

### Parameters
#### Path Parameters
- **id** (string) - Required - The unique job ID returned by the initial POST request.

### Response
#### Success Response (200)
- **status** (string) - Current status of the job (e.g., "completed").
- **total** (integer) - Total number of URLs in the batch.
- **completed** (integer) - Number of URLs successfully processed.
- **data** (array) - The scraped content for each URL.

#### Response Example
{
  "status": "completed",
  "total": 36,
  "completed": 36,
  "data": [
    {
      "markdown": "...",
      "metadata": {
        "title": "Example Page",
        "sourceURL": "https://example.com",
        "statusCode": 200
      }
    }
  ]
}
```

--------------------------------

### Crawl Events

Source: https://docs.firecrawl.dev/webhooks/events

Events related to the crawl process, including when a crawl job starts, when a page is scraped, and when a crawl job is completed.

```APIDOC
## Crawl Events

### `crawl.started`

Sent when the crawl job begins processing.

### Response Example
```json
{
  "success": true,
  "type": "crawl.started",
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "data": [],
  "metadata": {}
}
```

### `crawl.page`

Sent for each page scraped. The `data` array contains the page content and metadata.

### Response Example
```json
{
  "success": true,
  "type": "crawl.page",
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "data": [
    {
      "markdown": "# Page content...",
      "metadata": {
        "title": "Page Title",
        "description": "Page description",
        "url": "https://example.com/page",
        "statusCode": 200,
        "contentType": "text/html",
        "scrapeId": "550e8400-e29b-41d4-a716-446655440001",
        "sourceURL": "https://example.com/page",
        "proxyUsed": "basic",
        "cacheState": "hit",
        "cachedAt": "2025-09-03T21:11:25.636Z",
        "creditsUsed": 1
      }
    }
  ],
  "metadata": {}
}
```

### `crawl.completed`

Sent when the crawl job finishes and all pages have been processed.

### Response Example
```json
{
  "success": true,
  "type": "crawl.completed",
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "data": [],
  "metadata": {}
}
```
```

--------------------------------

### Extract Events

Source: https://docs.firecrawl.dev/webhooks/events

Events related to data extraction jobs, covering the start, successful completion with extracted data, and failure scenarios.

```APIDOC
## Extract Events

### `extract.started`

Sent when the extract job begins processing.

### Response Example
```json
{
  "success": true,
  "type": "extract.started",
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "data": [],
  "metadata": {}
}
```

### `extract.completed`

Sent when extraction finishes successfully. The `data` array contains the extracted data and usage info.

### Response Example
```json
{
  "success": true,
  "type": "extract.completed",
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "data": [
    {
      "success": true,
      "data": { "siteName": "Example Site", "category": "Technology" },
      "extractId": "550e8400-e29b-41d4-a716-446655440000",
      "llmUsage": 0.0020118,
      "totalUrlsScraped": 1,
      "sources": {
        "siteName": ["https://example.com"],
        "category": ["https://example.com"]
      }
    }
  ],
  "metadata": {}
}
```

### `extract.failed`

Sent when extraction fails. The `error` field contains the failure reason.

### Response Example
```json
{
  "success": false,
  "type": "extract.failed",
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "data": [],
  "error": "Failed to extract data: timeout exceeded",
  "metadata": {}
}
```
```

--------------------------------

### Scrape and Crawl Websites with Firecrawl Python SDK

Source: https://docs.firecrawl.dev/sdks/python

Demonstrates basic usage of the Firecrawl Python SDK to scrape a single URL and crawl a website. It shows how to specify output formats like markdown and HTML.

```python
from firecrawl import Firecrawl

firecrawl = Firecrawl(api_key="fc-YOUR_API_KEY")

# Scrape a website:
scrape_status = firecrawl.scrape(
  'https://firecrawl.dev', 
  formats=['markdown', 'html']
)
print(scrape_status)

# Crawl a website:
crawl_status = firecrawl.crawl(
  'https://firecrawl.dev', 
  limit=100, 
  scrape_options={
    'formats': ['markdown', 'html']
  }
)
print(crawl_status)
```

--------------------------------

### Batch Scrape Response Formats

Source: https://docs.firecrawl.dev/features/scrape

Example JSON responses for batch scrape operations. Includes the structure for a completed job containing scraped data and the structure for an asynchronous job initiation.

```json
{
  "status": "completed",
  "total": 36,
  "completed": 36,
  "creditsUsed": 36,
  "expiresAt": "2024-00-00T00:00:00.000Z",
  "next": "https://api.firecrawl.dev/v2/batch/scrape/123-456-789?skip=26",
  "data": [
    {
      "markdown": "...",
      "html": "...",
      "metadata": {
        "title": "Build a 'Chat with website' using Groq Llama 3 | Firecrawl",
        "language": "en",
        "sourceURL": "https://docs.firecrawl.dev/learn/rag-llama3",
        "statusCode": 200
      }
    }
  ]
}
```

```json
{
  "success": true,
  "id": "123-456-789",
  "url": "https://api.firecrawl.dev/v2/batch/scrape/123-456-789"
}
```

--------------------------------

### GET /page-metadata

Source: https://docs.firecrawl.dev/api-reference/endpoint/crawl-get

Retrieves the metadata associated with a crawled web page, including final URLs, status codes, and extracted content properties.

```APIDOC
## GET /page-metadata

### Description
Returns the metadata object for a requested URL, including the final destination URL, status codes, and extracted page attributes.

### Method
GET

### Endpoint
/page-metadata

### Parameters
#### Query Parameters
- **url** (string) - Required - The URL to retrieve metadata for.

### Response
#### Success Response (200)
- **sourceURL** (string) - The original URL requested.
- **url** (string) - The final URL after redirects.
- **statusCode** (integer) - The HTTP status code of the page.
- **keywords** (string/array) - Keywords extracted from the page.
- **ogLocaleAlternate** (array) - Alternative locales for the page.
- **error** (string) - Error message if the request failed.

#### Response Example
{
  "sourceURL": "https://example.com",
  "url": "https://example.com/home",
  "statusCode": 200,
  "keywords": ["tech", "web"],
  "ogLocaleAlternate": ["en-GB"],
  "error": null
}
```

--------------------------------

### Capture File Downloads as Base64 (Python)

Source: https://docs.firecrawl.dev/features/browser

Captures files downloaded during a Playwright session and returns their content as a base64 encoded string. This requires Playwright to be installed and configured. The code clicks a download link, waits for the download to complete, reads the file path, and then encodes the file content.

```python
import base64

async with page.expect_download() as download_info:
    await page.click('a#download-link')  # Click the element that triggers the download

download = download_info.value
path = await download.path()

# Optionally save to a known path
# await download.save_as('/tmp/myfile.pdf')

# Read and output file content as base64
with open(path, "rb") as f:
    content = base64.b64encode(f.read()).decode()
    print(content)
```

--------------------------------

### Frontend Chat Interface with AI SDK and AI Elements

Source: https://docs.firecrawl.dev/developer-guides/cookbooks/ai-research-assistant-cookbook

Implements the main chat interface for an AI assistant using React, AI SDK hooks (`useChat`), and AI Elements UI components. It includes state management for user input, model selection, and web search functionality, along with imports for various UI components.

```typescript
"use client";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputButton,
  PromptInputHeader,
  type PromptInputMessage,
  PromptInputSelect,
  PromptInputSelectContent,
  PromptInputSelectItem,
  PromptInputSelectTrigger,
  PromptInputSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import {
  MessageResponse,
  Message,
  MessageContent,
  MessageActions,
  MessageAction,
} from "@/components/ai-elements/message";

import { Fragment, useState } from "react";
import { useChat } from "@ai-sdk/react";
import type { ToolUIPart } from "ai";
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "@/components/ai-elements/tool";

import { CopyIcon, GlobeIcon, RefreshCcwIcon } from "lucide-react";
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from "@/components/ai-elements/sources";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { Loader } from "@/components/ai-elements/loader";

const models = [
  {
    name: "GPT 5 Mini (Thinking)",
    value: "gpt-5-mini",
  },
  {
    name: "GPT 4o Mini",
    value: "gpt-4o-mini",
  },
];

const ChatBotDemo = () => {
  const [input, setInput] = useState("");
  const [model, setModel] = useState<string>(models[0].value);
  const [webSearch, setWebSearch] = useState(false);

```

--------------------------------

### Agent Job Status Responses

Source: https://docs.firecrawl.dev/features/agent

Example JSON structures for agent job status updates, showing both processing and completed states with extracted data.

```json
{
  "success": true,
  "status": "processing",
  "expiresAt": "2024-12-15T00:00:00.000Z"
}
```

```json
{
  "success": true,
  "status": "completed",
  "data": {
    "founders": [
      { "name": "Eric Ciarla", "role": "Co-founder" },
      { "name": "Nicolas Camara", "role": "Co-founder" },
      { "name": "Caleb Peffer", "role": "Co-founder" }
    ]
  },
  "expiresAt": "2024-12-15T00:00:00.000Z",
  "creditsUsed": 15
}
```

--------------------------------

### Configure Firecrawl MCP in Windsurf

Source: https://docs.firecrawl.dev/developer-guides/mcp-setup-guides/windsurf

This JSON configuration defines the MCP server settings for Firecrawl within the Windsurf IDE. It requires the installation of the firecrawl-mcp package via npx and a valid Firecrawl API key provided through environment variables.

```json
{
  "mcpServers": {
    "firecrawl": {
      "command": "npx",
      "args": ["-y", "firecrawl-mcp"],
      "env": {
        "FIRECRAWL_API_KEY": "YOUR_API_KEY"
      }
    }
  }
}
```

--------------------------------

### Swap AI Model Provider

Source: https://docs.firecrawl.dev/developer-guides/cookbooks/ai-research-assistant-cookbook

Demonstrates how to replace the default OpenAI provider with an alternative provider like Anthropic using the AI SDK's streamText function. This allows for flexible model switching while maintaining the same API structure.

```typescript
import { anthropic } from "@ai-sdk/anthropic";

const result = streamText({
  model: anthropic("claude-4.5-sonnet"),
  // ... rest of config
});
```

--------------------------------

### Scrape and Crawl Methods

Source: https://docs.firecrawl.dev/sdks/go

Individual methods for scraping a single URL, crawling a website, checking job status, and mapping website structure.

```go
// Scrape a website
scrapeResult, err := app.ScrapeUrl("https://firecrawl.dev", map[string]any{
  "formats": []string{"markdown", "html"},
})

// Crawl a website
crawlStatus, err := app.CrawlUrl("https://firecrawl.dev", map[string]any{
  "limit": 100,
  "scrapeOptions": map[string]any{
    "formats": []string{"markdown", "html"},
  },
})

// Get crawl status
crawlStatus, err := app.CheckCrawlStatus("<crawl_id>")

// Map a website
mapResult, err := app.MapUrl("https://firecrawl.dev", nil)
```

--------------------------------

### Extract Started Event Payload (JSON)

Source: https://docs.firecrawl.dev/webhooks/events

Details the payload for an 'extract.started' event, indicating the beginning of an extraction job. The 'data' field is typically empty.

```json
{
  "success": true,
  "type": "extract.started",
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "data": [],
  "metadata": {}
}
```

--------------------------------

### Scrape Single GitHub Page

Source: https://docs.firecrawl.dev/developer-guides/common-sites/github

Retrieve the content of a single GitHub URL in markdown format. This is the simplest way to get raw content from a repository or issue page.

```typescript
import FirecrawlApp from '@mendable/firecrawl-js';

const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });

const result = await firecrawl.scrape('https://github.com/firecrawl/firecrawl', {
    formats: ['markdown']
});

console.log(result);
```

--------------------------------

### Batch Scrape Events

Source: https://docs.firecrawl.dev/webhooks/events

Events related to batch scraping operations, indicating the start, progress per URL, and completion of the batch job.

```APIDOC
## Batch Scrape Events

### `batch_scrape.started`

Sent when the batch scrape job begins processing.

### Response Example
```json
{
  "success": true,
  "type": "batch_scrape.started",
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "data": [],
  "metadata": {}
}
```

### `batch_scrape.page`

Sent for each URL scraped. The `data` array contains the page content and metadata.

### Response Example
```json
{
  "success": true,
  "type": "batch_scrape.page",
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "data": [
    {
      "markdown": "# Page content...",
      "metadata": {
        "title": "Page Title",
        "description": "Page description",
        "url": "https://example.com",
        "statusCode": 200,
        "contentType": "text/html",
        "scrapeId": "550e8400-e29b-41d4-a716-446655440001",
        "sourceURL": "https://example.com",
        "proxyUsed": "basic",
        "cacheState": "miss",
        "cachedAt": "2025-09-03T23:30:53.434Z",
        "creditsUsed": 1
      }
    }
  ],
  "metadata": {}
}
```

### `batch_scrape.completed`

Sent when all URLs in the batch have been processed.

### Response Example
```json
{
  "success": true,
  "type": "batch_scrape.completed",
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "data": [],
  "metadata": {}
}
```
```

--------------------------------

### GET /watcher

Source: https://docs.firecrawl.dev/features/crawl

The watcher method allows clients to subscribe to real-time updates for a specific crawl job, providing snapshots of the crawl status until completion.

```APIDOC
## GET /watcher

### Description
Subscribes to real-time updates for a crawl job using WebSockets with HTTP fallback. It emits events as pages are processed.

### Method
GET

### Endpoint
/watcher/{id}

### Parameters
#### Path Parameters
- **id** (string) - Required - The unique identifier of the crawl job.

#### Query Parameters
- **kind** (string) - Required - The type of job to watch (e.g., "crawl").
- **poll_interval** (integer) - Optional - Frequency of polling in seconds.
- **timeout** (integer) - Optional - Maximum duration to wait for completion in seconds.

### Response
#### Success Response (200)
- **status** (string) - Current status of the crawl (e.g., "completed", "failed").
- **data** (array) - List of scraped documents.
- **completed** (integer) - Number of pages completed.
- **total** (integer) - Total number of pages to crawl.
```

--------------------------------

### Browser Execution API Responses

Source: https://docs.firecrawl.dev/api-reference/endpoint/browser-execute

Example JSON structures for successful and failed browser code execution attempts, detailing the stdout, exit codes, and error messages.

```json
{
  "success": true,
  "result": "Example Domain"
}
```

```json
{
  "success": true,
  "error": "TimeoutError: page.goto: Timeout 30000ms exceeded."
}
```

--------------------------------

### Agent Started Event Payload (JSON)

Source: https://docs.firecrawl.dev/webhooks/events

Shows the payload for an 'agent.started' event, sent when an agent job commences processing. The 'data' field is usually empty.

```json
{
  "success": true,
  "type": "agent.started",
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "data": [],
  "metadata": {}
}
```

--------------------------------

### Browser Action: Scrape

Source: https://docs.firecrawl.dev/api-reference/endpoint/batch-scrape

Scrapes the current page content and returns the URL and the HTML.

```APIDOC
## POST /actions/scrape

### Description
Scrapes the current page content, returning the URL and the HTML.

### Method
POST

### Endpoint
/actions/scrape

### Parameters
#### Request Body
- **type** (string) - Required - Must be 'scrape'

### Request Example
{
  "type": "scrape"
}
```

--------------------------------

### Execute Playwright Python Code

Source: https://docs.firecrawl.dev/sdks/cli

Executes provided Python code within a Playwright browser context. Requires Playwright to be installed. Accepts Python code as a string argument.

```bash
firecrawl browser execute --python 'await page.goto("https://example.com")
print(await page.title())'
```

```python
await page.goto("https://news.ycombinator.com")
items = await page.query_selector_all(".titleline > a")
for item in items[:5]:
    print(await item.text_content())
```

--------------------------------

### Using Individual Firecrawl Tools Directly

Source: https://docs.firecrawl.dev/developer-guides/llm-sdks-and-frameworks/vercel-ai-sdk

Illustrates how to use individual Firecrawl tools like `scrape` and `search` directly within the `generateText` function. It also shows how to create custom configurations for these tools by calling them as factories.

```typescript
import { scrape, search } from 'firecrawl-aisdk';

// Use directly - reads FIRECRAWL_API_KEY from env
const { text } = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  tools: { scrape, search },
  prompt: '...',
});

// Or call as factory for custom config
const customScrape = scrape({ apiKey: 'fc-custom-key' });
const { text } = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  tools: { scrape: customScrape },
  prompt: '...',
});
```

--------------------------------

### Extract Structured Data via JSON Formats

Source: https://docs.firecrawl.dev/advanced-scraping-guide

Shows how to use the JSON format object to extract specific data based on a prompt and schema. Supports Python, Node.js, and cURL.

```python
from firecrawl import Firecrawl

firecrawl = Firecrawl(api_key='fc-YOUR-API-KEY')

doc = firecrawl.scrape('https://firecrawl.dev', {
  'formats': [{
    'type': 'json',
    'prompt': 'Extract the features of the product',
    'schema': {
      'type': 'object',
      'properties': { 'features': { 'type': 'object' } },
      'required': ['features']
    }
  }]
})

print(doc.json)
```

```javascript
import { Firecrawl } from 'firecrawl-js';

const firecrawl = new Firecrawl({ apiKey: 'fc-YOUR-API-KEY' });

const doc = await firecrawl.scrape('https://firecrawl.dev', {
  formats: [{
    type: 'json',
    prompt: 'Extract the features of the product',
    schema: {
      type: 'object',
      properties: { features: { type: 'object' } },
      required: ['features']
    }
  }]
});

console.log(doc.json);
```

```bash
curl -X POST https://api.firecrawl.dev/v2/scrape \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer fc-YOUR-API-KEY' \
  -d '{
    "url": "https://firecrawl.dev",
    "formats": [{
      "type": "json",
      "prompt": "Extract the features of the product",
      "schema": {"type": "object", "properties": {"features": {"type": "object"}}, "required": ["features"]}
    }]
  }'
```

--------------------------------

### Crawl with Scrape Options

Source: https://docs.firecrawl.dev/features/crawl

Perform a website crawl while applying specific scrape options to each page. This includes format selection (markdown, JSON with schema), proxy settings, caching, and content filtering. Examples for Python and Node.js.

```python
from firecrawl import Firecrawl

firecrawl = Firecrawl(api_key='fc-YOUR_API_KEY')

# Crawl with scrape options
response = firecrawl.crawl('https://example.com',
    limit=100,
    scrape_options={
        'formats': [
            'markdown',
            { 'type': 'json', 'schema': { 'type': 'object', 'properties': { 'title': { 'type': 'string' } } } }
        ],
        'proxy': 'auto',
        'max_age': 600000,
        'only_main_content': True
    }
)
```

```javascript
import Firecrawl from '@mendable/firecrawl-js';

const firecrawl = new Firecrawl({ apiKey: 'fc-YOUR_API_KEY' });

// Crawl with scrape options
const crawlResponse = await firecrawl.crawl('https://example.com', {
  limit: 100,
  scrapeOptions: {
    formats: [
      'markdown',
      {
        type: 'json',
        schema: { type: 'object', properties: { title: { type: 'string' } } },
      },
    ],
    proxy: 'auto',
    maxAge: 600000,
    onlyMainContent: true,
  },
});
```

--------------------------------

### Batch Scrape Started Event Payload (JSON)

Source: https://docs.firecrawl.dev/webhooks/events

Shows the payload for a 'batch_scrape.started' event, sent when a batch scrape job initiates. The 'data' field is usually empty.

```json
{
  "success": true,
  "type": "batch_scrape.started",
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "data": [],
  "metadata": {}
}
```

--------------------------------

### POST /v2/agent

Source: https://docs.firecrawl.dev/features/models

The agent endpoint processes a natural language prompt to extract data from the web. Users can specify the model to balance between cost-efficiency (Spark 1 Mini) and high-accuracy reasoning (Spark 1 Pro).

```APIDOC
## POST /v2/agent

### Description
Executes an agent-based extraction task based on a provided prompt. The model parameter allows selection between 'spark-1-mini' for standard tasks and 'spark-1-pro' for complex reasoning.

### Method
POST

### Endpoint
https://api.firecrawl.dev/v2/agent

### Parameters
#### Request Body
- **prompt** (string) - Required - The natural language instruction for the extraction task.
- **model** (string) - Optional - The model to use. Options: 'spark-1-mini' (default), 'spark-1-pro'.

### Request Example
{
  "prompt": "Find the pricing of Firecrawl",
  "model": "spark-1-mini"
}

### Response
#### Success Response (200)
- **data** (object) - The extracted information based on the prompt.

#### Response Example
{
  "data": {
    "pricing": "$XX per month"
  }
}
```

--------------------------------

### Multi-Step AI Workflow with Firecrawl and Mastra

Source: https://docs.firecrawl.dev/developer-guides/llm-sdks-and-frameworks/mastra

Demonstrates a complete AI workflow using Mastra and Firecrawl. It includes steps for searching documentation, scraping content, and summarizing it using an AI agent. Requires Node.js and the specified npm packages.

```typescript
import { createWorkflow, createStep } from "@mastra/core/workflows";
import { z } from "zod";
import Firecrawl from "@mendable/firecrawl-js";
import { Agent } from "@mastra/core/agent";

const firecrawl = new Firecrawl({
  apiKey: process.env.FIRECRAWL_API_API_KEY || "fc-YOUR_API_KEY"
});

const agent = new Agent({
  name: "summarizer",
  instructions: "You are a helpful assistant that creates concise summaries of documentation.",
  model: "openai/gpt-5-nano",
});

// Step 1: Search with Firecrawl SDK
const searchStep = createStep({
  id: "search",
  inputSchema: z.object({
    query: z.string(),
  }),
  outputSchema: z.object({
    url: z.string(),
    title: z.string(),
  }),
  execute: async ({ inputData }: { inputData: { query: string } }) => {
    console.log(`Searching: ${inputData.query}`);
    const searchResults = await firecrawl.search(inputData.query, { limit: 1 });
    const webResults = (searchResults as any)?.web;

    if (!webResults || !Array.isArray(webResults) || webResults.length === 0) {
      throw new Error("No search results found");
    }

    const firstResult = webResults[0];
    console.log(`Found: ${firstResult.title}`);
    return {
      url: firstResult.url,
      title: firstResult.title,
    };
  },
});

// Step 2: Scrape the URL with Firecrawl SDK
const scrapeStep = createStep({
  id: "scrape",
  inputSchema: z.object({
    url: z.string(),
    title: z.string(),
  }),
  outputSchema: z.object({
    markdown: z.string(),
    title: z.string(),
  }),
  execute: async ({ inputData }: { inputData: { url: string; title: string } }) => {
    console.log(`Scraping: ${inputData.url}`);
    const scrapeResult = await firecrawl.scrape(inputData.url, {
      formats: ["markdown"],
    });

    console.log(`Scraped: ${scrapeResult.markdown?.length || 0} characters`);
    return {
      markdown: scrapeResult.markdown || "",
      title: inputData.title,
    };
  },
});

// Step 3: Summarize with Claude
const summarizeStep = createStep({
  id: "summarize",
  inputSchema: z.object({
    markdown: z.string(),
    title: z.string(),
  }),
  outputSchema: z.object({
    summary: z.string(),
  }),
  execute: async ({ inputData }: { inputData: { markdown: string; title: string } }) => {
    console.log(`Summarizing: ${inputData.title}`);

    const prompt = `Summarize the following documentation in 2-3 sentences:\n\nTitle: ${inputData.title}\n\n${inputData.markdown}`;
    const result = await agent.generate(prompt);

    console.log(`Summary generated`);
    return { summary: result.text };
  },
});

// Create workflow
export const workflow = createWorkflow({
  id: "firecrawl-workflow",
  inputSchema: z.object({
    query: z.string(),
  }),
  outputSchema: z.object({
    summary: z.string(),
  }),
  steps: [searchStep, scrapeStep, summarizeStep],
})
  .then(searchStep)
  .then(scrapeStep)
  .then(summarizeStep)
  .commit();

async function testWorkflow() {
  const run = await workflow.createRunAsync();
  const result = await run.start({
    inputData: { query: "Firecrawl documentation" }
  });

  if (result.status === "success") {
    const { summarize } = result.steps;

    if (summarize.status === "success") {
      console.log(`\n${summarize.output.summary}`);
    }
  } else {
    console.error("Workflow failed:", result.status);
  }
}

testWorkflow().catch(console.error);

```

--------------------------------

### Combine Search and Scrape with Firecrawl

Source: https://docs.firecrawl.dev/developer-guides/llm-sdks-and-frameworks/vercel-ai-sdk

Illustrates how to use both the `search` and `scrape` tools together to find relevant information on the web, scrape the top result, and then summarize it.

```typescript
import { generateText } from 'ai';
import { search, scrape } from 'firecrawl-aisdk';

const { text } = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Search for Firecrawl, scrape the top result, and explain what it does',
  tools: { search, scrape },
});
```

--------------------------------

### Manage Asynchronous Agent Jobs

Source: https://docs.firecrawl.dev/features/agent

Start an agent job to receive a Job ID, then poll the status endpoint to retrieve results asynchronously. This is useful for long-running tasks.

```python
from firecrawl import Firecrawl

app = Firecrawl(api_key="fc-YOUR_API_KEY")

# Start an agent job
agent_job = app.start_agent(
    prompt="Find the founders of Firecrawl"
)

# Check the status
status = app.get_agent_status(agent_job.id)

print(status)
```

```javascript
import Firecrawl from '@mendable/firecrawl-js';

const firecrawl = new Firecrawl({ apiKey: "fc-YOUR_API_KEY" });

// Start an agent job
const started = await firecrawl.startAgent({
  prompt: "Find the founders of Firecrawl"
});

// Check the status
if (started.id) {
  const status = await firecrawl.getAgentStatus(started.id);
  console.log(status.status, status.data);
}
```

```bash
curl -X GET "https://api.firecrawl.dev/v2/agent/<jobId>" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY"
```

--------------------------------

### Configure PDF parsing options

Source: https://docs.firecrawl.dev/advanced-scraping-guide

Defines the JSON structure for PDF parsing configuration. It allows specifying the extraction mode (fast, auto, or ocr) and limiting the number of pages processed.

```json
{
  "type": "pdf",
  "mode": "auto",
  "maxPages": 10
}
```

--------------------------------

### Test Firecrawl API Health Check

Source: https://docs.firecrawl.dev/contributing/guide

Sends a GET request to the /test endpoint of the Firecrawl API to verify that the server is running and accessible. A successful response should return 'Hello, world!'.

```bash
curl -X GET http://localhost:3002/test
```

--------------------------------

### POST /v2/agent - Execute Agent with URLs

Source: https://docs.firecrawl.dev/features/agent

Initiates an agent job to process specified URLs and return results based on a given prompt. This method can be used directly to get the final results.

```APIDOC
## POST /v2/agent

### Description
Executes the Firecrawl agent on a list of provided URLs with a specific prompt. This is a synchronous call that returns the final data upon completion.

### Method
POST

### Endpoint
/v2/agent

#### Query Parameters
* **urls** (array[string]) - Required - A list of URLs to scrape and process.
* **prompt** (string) - Required - The instruction for the agent to follow.
* **model** (string) - Optional - The AI model to use. Options: `spark-1-mini` (default), `spark-1-pro`.

### Request Body
```json
{
  "urls": [
    "https://docs.firecrawl.dev",
    "https://firecrawl.dev/pricing"
  ],
  "prompt": "Compare the features and pricing information from these pages",
  "model": "spark-1-mini"
}
```

### Response
#### Success Response (200)
- **success** (boolean) - Indicates if the operation was successful.
- **status** (string) - The status of the agent job (e.g., `completed`).
- **data** (object) - The extracted data based on the prompt.
- **expiresAt** (string) - The timestamp when the results will expire.
- **creditsUsed** (integer) - The number of credits consumed by the job.

#### Response Example
```json
{
  "success": true,
  "status": "completed",
  "data": {
    "comparison": "..."
  },
  "expiresAt": "2024-12-15T00:00:00.000Z",
  "creditsUsed": 10
}
```
```

--------------------------------

### GET /batch/scrape/{id}

Source: https://docs.firecrawl.dev/api-reference/endpoint/batch-scrape-get

Retrieves the status and results of a batch web scraping job using its unique ID. This endpoint allows you to monitor the progress of scraping tasks and access the scraped data once completed.

```APIDOC
## GET /batch/scrape/{id}

### Description
Retrieves the status and results of a batch web scraping job using its unique ID. This endpoint allows you to monitor the progress of scraping tasks and access the scraped data once completed.

### Method
GET

### Endpoint
/batch/scrape/{id}

### Parameters
#### Path Parameters
- **id** (string) - Required - The ID of the batch scrape job

### Response
#### Success Response (200)
- **status** (string) - The current status of the batch scrape. Can be `scraping`, `completed`, or `failed`.
- **total** (integer) - The total number of pages that were attempted to be scraped.
- **completed** (integer) - The number of pages that have been successfully scraped.
- **creditsUsed** (integer) - The number of credits used for the batch scrape.
- **expiresAt** (string) - The date and time when the batch scrape will expire.
- **next** (string) - The URL to retrieve the next 10MB of data. Returned if the batch scrape is not completed or if the response is larger than 10MB.
- **data** (array) - The data of the batch scrape.
  - **markdown** (string) - Scraped content in markdown format.
  - **html** (string) - Scraped content in HTML format (optional).
  - **rawHtml** (string) - Raw HTML content of the page (optional).
  - **links** (array) - List of links found on the page (optional).
  - **screenshot** (string) - Screenshot of the page (optional).
  - **metadata** (object) - Metadata extracted from the page.
    - **title** (string or array of strings) - Title extracted from the page.
    - **description** (string or array of strings) - Description extracted from the page.
    - **language** (string or array of strings) - Language of the page content (optional).

#### Error Response (402)
- **error** (string) - Payment required to access this resource.

#### Error Response (429)
- **error** (string) - Request rate limit exceeded. Please wait and try again later.

#### Error Response (500)
- **error** (string) - An unexpected error occurred on the server.

### Response Example
```json
{
  "status": "completed",
  "total": 100,
  "completed": 100,
  "creditsUsed": 50,
  "expiresAt": "2024-01-01T12:00:00Z",
  "next": null,
  "data": [
    {
      "markdown": "# Example Page\nThis is an example page.",
      "html": "<h1>Example Page</h1><p>This is an example page.</p>",
      "links": ["http://example.com"],
      "metadata": {
        "title": "Example Page",
        "description": "An example page for testing.",
        "language": "en"
      }
    }
  ]
}
```
```

--------------------------------

### Extract Data with FIRE-1 Agent (Python, Node.js, cURL)

Source: https://docs.firecrawl.dev/agents/fire-1

Demonstrates how to use the FIRE-1 agent for complex extraction tasks requiring navigation and interaction. It shows examples of extracting user comments from a forum thread with a specified schema using Python, Node.js, and cURL.

```python
from firecrawl import FirecrawlApp

app = FirecrawlApp(api_key="fc-YOUR_API_KEY")

# Extract data from a website:
extract_result = app.extract(['firecrawl.dev'],
  prompt="Extract all user comments from this forum thread.",
  schema={
    "type": "object",
    "properties": {
      "comments": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "author": {"type": "string"},
            "comment_text": {"type": "string"}
          },
          "required": ["author", "comment_text"]
        }
      }
    },
    "required": ["comments"]
  },
  agent={
    "model": "FIRE-1"
  }
)

print(extract_result)
```

```javascript
import FirecrawlApp, { ExtractResponse } from '@mendable/firecrawl-js';

const app = new FirecrawlApp({apiKey: "fc-YOUR_API_KEY"});

// Extract from a website using schema and prompt:
const extractResult = await app.extract(['https://example-forum.com/topic/123'], {
  prompt: "Extract all user comments from this forum thread.",
  schema: {
    type: "object",
    properties: {
      comments: {
        type: "array",
        items: {
          type: "object",
          properties: {
            author: {type: "string"},
            comment_text: {type: "string"}
          },
          required: ["author", "comment_text"]
        }
      }
    },
    required: ["comments"]
  },
  agent: {
    model: 'FIRE-1'
  }
}) as ExtractResponse;

if (!extractResult.success) {
  throw new Error(`Failed to extract: ${extractResult.error}`)
}

console.log(extractResult)
```

```bash
curl -X POST https://api.firecrawl.dev/v1/extract \
    -H 'Content-Type: application/json' \
    -H 'Authorization: Bearer YOUR_API_KEY' \
    -d '{
      "urls": ["https://example-forum.com/topic/123"],
      "prompt": "Extract all user comments from this forum thread.",
      "schema": {
        "type": "object",
        "properties": {
          "comments": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "author": {"type": "string"},
                "comment_text": {"type": "string"}
              },
              "required": ["author", "comment_text"]
            }
          }
        },
        "required": ["comments"]
      },
      "agent": {
        "model": "FIRE-1"
      }
    }'
```

--------------------------------

### Crawl Started Event Payload (JSON)

Source: https://docs.firecrawl.dev/webhooks/events

Represents the payload for a 'crawl.started' event, sent when a crawl job begins. The 'data' field is typically empty for this event type.

```json
{
  "success": true,
  "type": "crawl.started",
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "data": [],
  "metadata": {}
}
```

--------------------------------

### Asynchronous Web Scraping with CompletableFuture (Java)

Source: https://docs.firecrawl.dev/sdks/java

Demonstrates how to perform web scraping asynchronously using Java's CompletableFuture. This allows non-blocking operations by wrapping synchronous client calls. It scrapes a URL and prints the markdown content.

```java
import java.util.concurrent.CompletableFuture;

CompletableFuture<FirecrawlDocument> future = CompletableFuture.supplyAsync(() -> {
    try {
        ScrapeParams params = new ScrapeParams();
        params.setFormats(new String[]{"markdown"});
        return client.scrapeURL("https://firecrawl.dev", params);
    } catch (Exception e) {
        throw new RuntimeException(e);
    }
});

future.thenAccept(doc -> System.out.println(doc.getMarkdown()));
```

--------------------------------

### Set Environment Variables for Playwright

Source: https://docs.firecrawl.dev/contributing/self-host

Configuring the microservice URL in the .env file to point to the local Playwright instance.

```plaintext
PLAYWRIGHT_MICROSERVICE_URL=http://localhost:3000/scrape
```

--------------------------------

### PDF Parsing Parameters

Source: https://docs.firecrawl.dev/advanced-scraping-guide

Configure PDF processing. The `parsers` parameter controls PDF handling, with options to skip parsing or specify parsing modes like 'fast', 'auto', or 'ocr'.

```APIDOC
## PDF Parsing

### Description
Configure PDF processing. The `parsers` parameter controls PDF handling, with options to skip parsing or specify parsing modes like 'fast', 'auto', or 'ocr'.

### Parameters
#### Query Parameters
- **parsers** (array) - Optional - Controls PDF processing. `[]` to skip parsing and return base64 (1 credit flat). Example: `["pdf"]`.

### Request Body
#### PDF Parser Configuration
- **type** (string) - Required - Must be `"pdf"`.
- **mode** (string) - Optional - Specifies the parsing mode. Can be `"fast"` (text-based extraction only), `"auto"` (fast with OCR fallback), or `"ocr"` (force OCR). Defaults to `"auto"`.
- **maxPages** (integer) - Optional - Caps the number of pages to parse.
```

--------------------------------

### Configure Webhooks for Asynchronous Crawling

Source: https://docs.firecrawl.dev/features/change-tracking

Demonstrates how to initiate a crawl job with webhook integration to receive change tracking updates asynchronously across different platforms.

```python
job = firecrawl.start_crawl(
    "https://example.com",
    limit=50,
    scrape_options={
        "formats": [
            "markdown",
            {"type": "changeTracking", "modes": ["git-diff"]}
        ]
    },
    webhook={
        "url": "https://your-server.com/firecrawl-webhook",
        "headers": {"Authorization": "Bearer your-webhook-secret"},
        "events": ["crawl.page", "crawl.completed"]
    }
)
```

```javascript
const { id } = await firecrawl.startCrawl('https://example.com', {
  limit: 50,
  scrapeOptions: {
    formats: [
      'markdown',
      { type: 'changeTracking', modes: ['git-diff'] }
    ]
  },
  webhook: {
    url: 'https://your-server.com/firecrawl-webhook',
    headers: { Authorization: 'Bearer your-webhook-secret' },
    events: ['crawl.page', 'crawl.completed']
  }
});
```

```bash
curl -s -X POST "https://api.firecrawl.dev/v2/crawl" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "limit": 50,
    "scrapeOptions": {
      "formats": [
        "markdown",
        { "type": "changeTracking", "modes": ["git-diff"] }
      ]
    },
    "webhook": {
      "url": "https://your-server.com/firecrawl-webhook",
      "headers": { "Authorization": "Bearer your-webhook-secret" },
      "events": ["crawl.page", "crawl.completed"]
    }
  }'
```

--------------------------------

### Check Crawl Job Status with Firecrawl Python SDK

Source: https://docs.firecrawl.dev/sdks/python

Shows how to retrieve the current status of a previously started crawl job using the `get_crawl_status` method, which requires the job ID.

```python
status = firecrawl.get_crawl_status("<crawl-id>")
print(status)
```

--------------------------------

### POST /v2/scrape - Git-diff Mode

Source: https://docs.firecrawl.dev/features/change-tracking

Utilize the 'git-diff' mode within the changeTracking format to get line-by-line differences between the current and previous scrape of a URL. This mode is useful for visualizing textual changes.

```APIDOC
## POST /v2/scrape - Git-diff Mode

### Description
Returns line-by-line changes in a format similar to `git diff`. Pass an object in the `formats` array with `modes: ["git-diff"]`.

### Method
POST

### Endpoint
/v2/scrape

### Parameters
#### Query Parameters
None

#### Request Body
- **url** (string) - Required - The URL to scrape.
- **formats** (array) - Required - An array specifying the desired output formats. For git-diff mode, include `{"type": "changeTracking", "modes": ["git-diff"]}`.

### Request Example
```json
{
  "url": "https://example.com/pricing",
  "formats": [
    "markdown",
    {
      "type": "changeTracking",
      "modes": ["git-diff"]
    }
  ]
}
```

### Response
#### Success Response (200)
- **changeTracking** (object) - Contains information about the change tracking results.
  - **previousScrapeAt** (string) - The timestamp of the previous scrape.
  - **changeStatus** (string) - The status of the change ('changed', 'unchanged').
  - **visibility** (string) - Visibility status of the changes.
  - **diff** (object) - The difference object.
    - **text** (string) - The plain-text diff.
    - **json** (object) - A structured JSON representation of the diff, including files, chunks, and changes.

#### Response Example
```json
{
  "changeTracking": {
    "previousScrapeAt": "2025-06-01T10:00:00.000+00:00",
    "changeStatus": "changed",
    "visibility": "visible",
    "diff": {
      "text": "@@ -1,3 +1,3 @@\n # Pricing\n-Starter: $9/mo\n-Pro: $29/mo\n+Starter: $12/mo\n+Pro: $39/mo",
      "json": {
        "files": [
          {
            "chunks": [
              {
                "content": "@@ -1,3 +1,3 @@",
                "changes": [
                  { "type": "normal", "content": "# Pricing" },
                  { "type": "del", "ln": 2, "content": "Starter: $9/mo" },
                  { "type": "del", "ln": 3, "content": "Pro: $29/mo" },
                  { "type": "add", "ln": 2, "content": "Starter: $12/mo" },
                  { "type": "add", "ln": 3, "content": "Pro: $39/mo" }
                ]
              }
            ]
          }
        ]
      }
    }
  }
}
```
```

--------------------------------

### POST /scrape

Source: https://docs.firecrawl.dev/api-reference/endpoint/scrape

Scrape a single URL and optionally extract information using an LLM. This endpoint allows you to fetch content from a given URL and process it further with advanced options.

```APIDOC
## POST /scrape

### Description
Scrape a single URL and optionally extract information using an LLM. This endpoint allows you to fetch content from a given URL and process it further with advanced options.

### Method
POST

### Endpoint
/v2/scrape

### Parameters
#### Query Parameters
- **url** (string) - Required - The URL to scrape

#### Request Body
- **url** (string) - Required - The URL to scrape
- **formats** (object) - Optional - Specifies the desired output formats.
- **onlyMainContent** (boolean) - Optional - Only return the main content of the page excluding headers, navs, footers, etc. Defaults to true.
- **includeTags** (array[string]) - Optional - Tags to include in the output.
- **excludeTags** (array[string]) - Optional - Tags to exclude from the output.
- **maxAge** (integer) - Optional - Returns a cached version of the page if it is younger than this age in milliseconds. Defaults to 172800000 (2 days).
- **minAge** (integer) - Optional - When set, the request only checks the cache and never triggers a fresh scrape. The value is in milliseconds and specifies the minimum age the cached data must be.
- **headers** (object) - Optional - Headers to send with the request. Can be used to send cookies, user-agent, etc.
- **waitFor** (integer) - Optional - Specify a delay in milliseconds before fetching the content, allowing the page sufficient time to load. Defaults to 0.
- **mobile** (boolean) - Optional - Use mobile emulation for scraping.
- **zeroDataRetention** (boolean) - Optional - If true, this will enable zero data retention for this scrape. To enable this feature, please contact help@firecrawl.dev. Defaults to false.

### Request Example
```json
{
  "url": "https://example.com",
  "onlyMainContent": true,
  "maxAge": 86400000
}
```

### Response
#### Success Response (200)
- **ScrapeResponse** (object) - The response containing the scraped content and metadata.

#### Response Example
```json
{
  "url": "https://example.com",
  "title": "Example Domain",
  "full_content": "<html>...</html>",
  "main_content": "The main content of the page.",
  "metadata": {
    "statusCode": 200,
    "headers": { ... },
    "contentType": "text/html"
  }
}
```

#### Error Responses
- **402** - Payment required.
- **429** - Too many requests.
- **500** - Server error.
```

--------------------------------

### Map Website Structure with Firecrawl

Source: https://docs.firecrawl.dev/developer-guides/llm-sdks-and-frameworks/vercel-ai-sdk

Demonstrates the use of the `map` tool to traverse a website's structure and list its main sections, useful for understanding site organization.

```typescript
import { generateText } from 'ai';
import { map } from 'firecrawl-aisdk';

const { text } = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Map https://docs.firecrawl.dev and list the main sections',
  tools: { map },
});
```

--------------------------------

### Real-time Crawl Updates via WebSocket (Python)

Source: https://docs.firecrawl.dev/features/crawl

This Python snippet demonstrates how to use the AsyncFirecrawl library to start a crawl and then subscribe to real-time updates using the watcher method. It processes snapshots until the crawl is completed or fails, printing status and document information. Requires the `firecrawl` library.

```python
import asyncio
from firecrawl import AsyncFirecrawl

async def main():
    firecrawl = AsyncFirecrawl(api_key="fc-YOUR-API-KEY")

    # Start a crawl first
    started = await firecrawl.start_crawl("https://firecrawl.dev", limit=5)

    # Watch updates (snapshots) until terminal status
    async for snapshot in firecrawl.watcher(started.id, kind="crawl", poll_interval=2, timeout=120):
        if snapshot.status == "completed":
            print("DONE", snapshot.status)
            for doc in snapshot.data:
                print("DOC", doc.metadata.source_url if doc.metadata else None)
        elif snapshot.status == "failed":
            print("ERR", snapshot.status)
        else:
            print("STATUS", snapshot.status, snapshot.completed, "/", snapshot.total)

asyncio.run(main())
```

--------------------------------

### Setup Remote MCP Server with Firecrawl ADK

Source: https://docs.firecrawl.dev/developer-guides/llm-sdks-and-frameworks/google-adk

This Python code snippet demonstrates how to set up a remote MCP server connection to Firecrawl within Google's ADK. It requires your Firecrawl API key and configures an agent to use Firecrawl for web scraping tasks.

```python
from google.adk.agents.llm_agent import Agent
from google.adk.tools.mcp_tool.mcp_session_manager import StreamableHTTPServerParams
from google.adk.tools.mcp_tool.mcp_toolset import MCPToolset

FIRECRAWL_API_KEY = "YOUR-API-KEY"

root_agent = Agent(
    model="gemini-2.5-pro",
    name="firecrawl_agent",
    description='A helpful assistant for scraping websites with Firecrawl',
    instruction='Help the user search for website content',
    tools=[
        MCPToolset(
            connection_params=StreamableHTTPServerParams(
                url=f"https://mcp.firecrawl.dev/{FIRECRAWL_API_KEY}/v2/mcp",
            ),
        )
    ],
)
```

--------------------------------

### Agent API - Model Specification

Source: https://docs.firecrawl.dev/features/agent

This section details how to use the Firecrawl Agent API and specify different models for data extraction. It includes examples for Spark 1 Mini (default) and Spark 1 Pro for more complex tasks.

```APIDOC
## POST /v2/agent

### Description
This endpoint allows you to use the Firecrawl agent to extract information based on a given prompt. You can specify different models to tailor the extraction process for your needs.

### Method
POST

### Endpoint
/v2/agent

### Parameters
#### Query Parameters
- **model** (string) - Optional - Specifies the extraction model to use. Available options are `spark-1-mini` (default) and `spark-1-pro`.

#### Request Body
- **prompt** (string) - Required - The natural language prompt describing the data to extract.
- **model** (string) - Optional - Specifies the extraction model to use. If omitted, `spark-1-mini` is used by default.

### Request Example
```json
{
  "prompt": "Find the pricing of Firecrawl",
  "model": "spark-1-mini"
}
```

```json
{
  "prompt": "Compare all enterprise features and pricing across Firecrawl, Apify, and ScrapingBee",
  "model": "spark-1-pro"
}
```

### Response
#### Success Response (200)
- **data** (object) - The extracted data based on the prompt and selected model.

#### Response Example
```json
{
  "data": {
    "pricing": "..."
  }
}
```
```

--------------------------------

### GET /crawl/{id}

Source: https://docs.firecrawl.dev/api-reference/endpoint/crawl-get

Retrieves the status and results of a specific web crawl job. This endpoint allows you to check the progress, completion status, and data collected for a crawl initiated previously.

```APIDOC
## GET /crawl/{id}

### Description
Retrieves the status and results of a specific web crawl job. This endpoint allows you to check the progress, completion status, and data collected for a crawl initiated previously.

### Method
GET

### Endpoint
/crawl/{id}

### Parameters
#### Path Parameters
- **id** (string) - Required - The ID of the crawl job

### Request Example
```json
{
  "example": "GET /v2/crawl/your-crawl-id"
}
```

### Response
#### Success Response (200)
- **status** (string) - The current status of the crawl. Can be `scraping`, `completed`, or `failed`.
- **total** (integer) - The total number of pages that were attempted to be crawled.
- **completed** (integer) - The number of pages that have been successfully crawled.
- **creditsUsed** (integer) - The number of credits used for the crawl.
- **expiresAt** (string) - The date and time when the crawl will expire.
- **next** (string) - The URL to retrieve the next 10MB of data. Returned if the crawl is not completed or if the response is larger than 10MB.
- **data** (array) - The data of the crawl.
  - **markdown** (string) - Markdown content of the page.
  - **html** (string) - HTML version of the content on page if `includeHtml` is true.
  - **rawHtml** (string) - Raw HTML content of the page if `includeRawHtml` is true.
  - **links** (array) - List of links on the page if `includeLinks` is true.
  - **screenshot** (string) - Screenshot of the page if `includeScreenshot` is true.
  - **metadata** (object) - Metadata extracted from the page.
    - **title** (string or array of strings) - Title extracted from the page.
    - **description** (string or array of strings) - Description extracted from the page.
    - **language** (string or array of strings) - Language of the page content.

#### Error Response (402)
- **error** (string) - Payment required to access this resource.

#### Error Response (429)
- **error** (string) - Request rate limit exceeded. Please wait and try again later.

#### Error Response (500)
- **error** (string) - An unexpected error occurred on the server.

#### Response Example
```json
{
  "status": "completed",
  "total": 100,
  "completed": 100,
  "creditsUsed": 10,
  "expiresAt": "2024-07-26T10:00:00Z",
  "next": null,
  "data": [
    {
      "markdown": "# Example Page\nThis is an example page.",
      "html": "<h1>Example Page</h1><p>This is an example page.</p>",
      "rawHtml": "<html><body><h1>Example Page</h1><p>This is an example page.</p></body></html>",
      "links": ["https://example.com"],
      "screenshot": "base64encodedstring",
      "metadata": {
        "title": "Example Page",
        "description": "A sample page for demonstration.",
        "language": "en"
      }
    }
  ]
}
```
```

--------------------------------

### POST /scrape

Source: https://docs.firecrawl.dev/api-reference/endpoint/extract

Configures and executes a web scraping request with options for browser emulation, content waiting, and advanced PDF parsing.

```APIDOC
## POST /scrape

### Description
Initiates a scrape request with customizable browser behavior, caching policies, and file parsing settings.

### Method
POST

### Endpoint
/scrape

### Parameters
#### Request Body
- **cache** (integer) - Optional - Minimum age of cached data in milliseconds. Returns 404 if no cache found.
- **headers** (object) - Optional - Custom headers (e.g., cookies, user-agent).
- **waitFor** (integer) - Optional - Delay in milliseconds before fetching content. Default: 0.
- **mobile** (boolean) - Optional - Emulate mobile device scraping. Default: false.
- **skipTlsVerification** (boolean) - Optional - Skip TLS certificate verification. Default: true.
- **timeout** (integer) - Optional - Request timeout in milliseconds (max 300,000). Default: 30,000.
- **parsers** (array) - Optional - Configuration for file processing (e.g., PDF extraction modes).
- **actions** (array) - Optional - Sequence of browser actions (wait, screenshot) to execute before extraction.

### Request Example
{
  "mobile": true,
  "timeout": 5000,
  "parsers": [{"type": "pdf", "mode": "auto"}],
  "actions": [{"type": "wait", "milliseconds": 1000}]
}

### Response
#### Success Response (200)
- **data** (object) - The scraped content or file data.

#### Response Example
{
  "success": true,
  "data": {
    "markdown": "# Scraped Content..."
  }
}
```

--------------------------------

### Implement Chat Message Submission and UI Rendering

Source: https://docs.firecrawl.dev/developer-guides/cookbooks/ai-research-assistant-cookbook

Handles the submission of text and file attachments via the useChat hook and renders conversation messages. It includes logic for displaying source URLs, reasoning blocks, and interactive message actions like retry and copy.

```typescript
const { messages, sendMessage, status, regenerate } = useChat();

const handleSubmit = (message: PromptInputMessage) => {
  const hasText = Boolean(message.text);
  const hasAttachments = Boolean(message.files?.length);

  if (!(hasText || hasAttachments)) {
    return;
  }

  sendMessage(
    {
      text: message.text || "Sent with attachments",
      files: message.files,
    },
    {
      body: {
        model: model,
        webSearch: webSearch,
      },
    }
  );
  setInput("");
};

return (
  <div className="max-w-4xl mx-auto p-6 relative size-full h-screen">
    <div className="flex flex-col h-full">
      <Conversation className="h-full">
        <ConversationContent>
          {messages.map((message) => (
            <div key={message.id}>
              {message.role === "assistant" &&
                message.parts.filter((part) => part.type === "source-url")
                  .length > 0 && (
                  <Sources>
                    <SourcesTrigger
                      count={
                        message.parts.filter(
                          (part) => part.type === "source-url"
                        ).length
                      }
                    />
                    {message.parts
                      .filter((part) => part.type === "source-url")
                      .map((part, i) => (
                        <SourcesContent key={`${message.id}-${i}`}>
                          <Source
                            key={`${message.id}-${i}`}
                            href={part.url}
                            title={part.url}
                          />
                        </SourcesContent>
                      ))}
                  </Sources>
                )}
              {message.parts.map((part, i) => {
                switch (part.type) {
                  case "text":
                    return (
                      <Fragment key={`${message.id}-${i}`}>
                        <Message from={message.role}>
                          <MessageContent>
                            <MessageResponse>{part.text}</MessageResponse>
                          </MessageContent>
                        </Message>
                        {message.role === "assistant" &&
                          i === messages.length - 1 && (
                            <MessageActions className="mt-2">
                              <MessageAction
                                onClick={() => regenerate()}
                                label="Retry"
                              >
                                <RefreshCcwIcon className="size-3" />
                              </MessageAction>
                              <MessageAction
                                onClick={() =>
                                  navigator.clipboard.writeText(part.text)
                                }
                                label="Copy"
                              >
                                <CopyIcon className="size-3" />
                              </MessageAction>
                            </MessageActions>
                          )}
                      </Fragment>
                    );
                  case "reasoning":
                    return (
                      <Reasoning
                        key={`${message.id}-${i}`}
                        className="w-full"
                        isStreaming={
                          status === "streaming" &&
                          i === message.parts.length - 1 &&
                          message.id === messages.at(-1)?.id
                        }
                      >
                        <ReasoningTrigger />
                        <ReasoningContent>{part.text}</ReasoningContent>
                      </Reasoning>
                    );
                  default: {
                    if (part.type.startsWith("tool-")) {
                      const toolPart = part as ToolUIPart;
                    }
                  }
                }
              })}
            </div>
          ))}
        </ConversationContent>
      </Conversation>
    </div>
  </div>
);
```

--------------------------------

### Claude Tool Use for Dynamic Web Scraping

Source: https://docs.firecrawl.dev/developer-guides/llm-sdks-and-frameworks/anthropic

Enables Claude to decide when to scrape websites based on user requests by defining a 'scrape_website' tool. This example uses Zod for schema definition and integrates with Firecrawl for scraping.

```typescript
import FirecrawlApp from '@mendable/firecrawl-js';
import { Anthropic } from '@anthropic-ai/sdk';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

const firecrawl = new FirecrawlApp({
    apiKey: process.env.FIRECRAWL_API_KEY
});

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
});

const ScrapeArgsSchema = z.object({
    url: z.string()
});

console.log("Sending user message to Claude and requesting tool use if necessary...");
const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 1024,
    tools: [{
        name: 'scrape_website',
        description: 'Scrape and extract markdown content from a website URL',
        input_schema: zodToJsonSchema(ScrapeArgsSchema, 'ScrapeArgsSchema') as any
    }],
    messages: [{
        role: 'user',
        content: 'What is Firecrawl? Check firecrawl.dev'
    }]
});

const toolUse = response.content.find(block => block.type === 'tool_use');

if (toolUse && toolUse.type === 'tool_use') {
    const input = toolUse.input as { url: string };
    console.log(`Calling tool: ${toolUse.name} | URL: ${input.url}`);

    const result = await firecrawl.scrape(input.url, {
        formats: ['markdown']
    });

    console.log(`Scraped content preview: ${result.markdown?.substring(0, 300)}...`);
    // Continue with the conversation or process the scraped content as needed
}
```

--------------------------------

### Create and Manage Browser Sessions with Firecrawl

Source: https://docs.firecrawl.dev/sdks/python

Shows how to create, manage, and interact with cloud browser sessions using the Firecrawl class. This includes obtaining session IDs, CDP URLs, and live view URLs. Requires the 'firecrawl' library and an API key.

```python
from firecrawl import Firecrawl

app = Firecrawl(api_key="fc-YOUR-API-KEY")

session = app.browser()
print(session.id)             # session ID
print(session.cdp_url)        # wss://cdp-proxy.firecrawl.dev/cdp/...
print(session.live_view_url)  # https://liveview.firecrawl.dev/...
```

--------------------------------

### Crawl Multiple Amazon Pages

Source: https://docs.firecrawl.dev/developer-guides/common-sites/amazon

Crawls multiple pages starting from an Amazon search results URL. It allows setting a limit for the number of pages to crawl and specifies the format for the scraped content.

```typescript
import FirecrawlApp from '@mendable/firecrawl-js';

const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });

const crawlResult = await firecrawl.crawl('https://www.amazon.com/s?k=mechanical+keyboards', {
    limit: 10,
    scrapeOptions: {
        formats: ['markdown']
    }
});

console.log(crawlResult.data);
```

--------------------------------

### Use Firecrawl Agent for Autonomous Data Gathering

Source: https://docs.firecrawl.dev/introduction

This snippet shows how to use the Firecrawl Agent, an autonomous tool for gathering web data. You provide a prompt describing the data needed, and the agent searches, navigates, and extracts the information. Examples are provided for cURL, Python, and Node.js.

```bash
curl -X POST 'https://api.firecrawl.dev/v2/agent' \
    -H 'Authorization: Bearer fc-YOUR-API-KEY' \
    -H 'Content-Type: application/json' \
    -d '{
      "prompt": "Find the pricing plans for Notion"
    }'
```

```python
from firecrawl import Firecrawl

app = Firecrawl(api_key="fc-YOUR-API-KEY")
result = app.agent("Find the pricing plans for Notion")
print(result)
```

```javascript
import Firecrawl from '@mendable/firecrawl-js';

const app = new Firecrawl({ apiKey: "fc-YOUR-API-KEY" });
const result = await app.agent("Find the pricing plans for Notion");
console.log(result);
```

--------------------------------

### Crawl Multiple Pages from Etsy

Source: https://docs.firecrawl.dev/developer-guides/common-sites/etsy

Crawls multiple pages starting from an Etsy shop or category URL. Allows setting a limit for the number of pages to crawl and specifying the format of the scraped content. Returns an array of data objects for each crawled page.

```typescript
import FirecrawlApp from '@mendable/firecrawl-js';

const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });

const crawlResult = await firecrawl.crawl('https://www.etsy.com/c/jewelry', {
    limit: 10,
    scrapeOptions: {
        formats: ['markdown']
    }
});

console.log(crawlResult.data);
```

--------------------------------

### Configure Firecrawl MCP with Remote Hosted URL

Source: https://docs.firecrawl.dev/developer-guides/mcp-setup-guides/cursor

This JSON configuration uses a remote hosted URL for Firecrawl MCP, eliminating the need for local Node.js installation. Replace `YOUR-API-KEY` with your actual Firecrawl API key.

```json
{
  "mcpServers": {
    "firecrawl": {
      "url": "https://mcp.firecrawl.dev/YOUR-API-KEY/v2/mcp"
    }
  }
}
```

--------------------------------

### Manage Cloud Browser Sessions

Source: https://docs.firecrawl.dev/sdks/cli

Launches and interacts with a secure cloud-based Chromium browser instance. Allows execution of agent-browser commands such as opening URLs, taking snapshots, and scraping content.

```bash
# Launch a cloud browser session
firecrawl browser launch-session

# Execute agent-browser commands (default - "agent-browser" is auto-prefixed)
firecrawl browser execute "open https://example.com"
firecrawl browser execute "snapshot"
firecrawl browser execute "click @e5"
firecrawl browser execute "scrape"
```

--------------------------------

### POST /crawl

Source: https://docs.firecrawl.dev/sdks/java

Initiates a crawl job for a website to process multiple pages.

```APIDOC
## POST /crawl

### Description
Initiates a crawl job for a given URL. Returns a job ID that can be used to track the status of the crawl.

### Method
POST

### Endpoint
/crawl

### Parameters
#### Request Body
- **url** (string) - Required - The root URL to start crawling.
- **limit** (integer) - Optional - Maximum number of pages to crawl.

### Request Example
{
  "url": "https://firecrawl.dev",
  "limit": 5
}

### Response
#### Success Response (200)
- **id** (string) - The unique job ID.
- **status** (string) - The current status of the crawl job.

#### Response Example
{
  "id": "uuid-1234-5678",
  "status": "completed"
}
```

--------------------------------

### Build AI Chat API Route with Vercel AI SDK

Source: https://docs.firecrawl.dev/developer-guides/cookbooks/ai-research-assistant-cookbook

Creates a POST endpoint that handles streaming chat messages using OpenAI models. It utilizes the Vercel AI SDK to stream responses and include sources and reasoning.

```typescript
import { streamText, UIMessage, convertToModelMessages } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export const maxDuration = 300;

export async function POST(req: Request) {
  const { messages, model, webSearch } = await req.json();

  const result = streamText({
    model: openai(model),
    messages: convertToModelMessages(messages),
    system: "You are a helpful assistant that can answer questions and help with tasks.",
  });

  return result.toUIMessageStreamResponse({
    sendSources: true,
    sendReasoning: true,
  });
}
```

--------------------------------

### Check Firecrawl Agent Job Status (cURL)

Source: https://docs.firecrawl.dev/advanced-scraping-guide

Polls the Firecrawl API to check the status of an agent job using its unique job ID. The response indicates if the job is 'processing', 'completed', or 'failed'.

```bash
curl -X GET https://api.firecrawl.dev/v2/agent/YOUR-JOB-ID \
  -H 'Authorization: Bearer fc-YOUR-API-KEY'
```

--------------------------------

### GET /v2/crawl/{jobId}

Source: https://docs.firecrawl.dev/features/crawl

Poll for the crawl status and retrieve results using the job ID. The response varies based on the crawl's status, and pagination is handled via the `next` parameter for large responses.

```APIDOC
## GET /v2/crawl/{jobId}

### Description
Use the job ID to poll for the crawl status and retrieve results. Job results are available via the API for 24 hours after completion.

### Method
GET

### Endpoint
`/v2/crawl/{jobId}`

### Parameters
#### Query Parameters
- **skip** (integer) - Optional - Used for pagination to retrieve subsequent chunks of data. Only relevant when hitting the API directly.

### Request Example
```bash
curl -s -X GET "https://api.firecrawl.dev/v2/crawl/<jobId>" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY"
```

### Response
#### Success Response (200)
- **status** (string) - The current status of the crawl (e.g., "scraping", "completed").
- **total** (integer) - The total number of pages to be crawled.
- **completed** (integer) - The number of pages completed so far.
- **creditsUsed** (integer) - The number of credits used for the crawl.
- **expiresAt** (string) - The timestamp when the crawl results will expire.
- **next** (string) - A URL parameter for retrieving the next chunk of data if the response exceeds 10MB. Absent if all data has been retrieved.
- **data** (array) - An array of scraped page objects. Each object contains `markdown`, `html`, and `metadata`.
  - **metadata** (object) - Metadata about the scraped page.
    - **title** (string) - The title of the page.
    - **language** (string) - The detected language of the page.
    - **sourceURL** (string) - The URL of the scraped page.
    - **description** (string) - The meta description of the page.
    - **ogLocaleAlternate** (array) - Alternate Open Graph locales.
    - **statusCode** (integer) - The HTTP status code returned by the target site for this page.

#### Response Example (Scraping)
```json
{
  "status": "scraping",
  "total": 36,
  "completed": 10,
  "creditsUsed": 10,
  "expiresAt": "2024-00-00T00:00:00.000Z",
  "next": "https://api.firecrawl.dev/v2/crawl/123-456-789?skip=10",
  "data": [
    {
      "markdown": "[Firecrawl Docs home page![light logo](https://mintlify.s3-us-west-1.amazonaws.com/firecrawl/logo/light.svg)!...",
      "html": "<!DOCTYPE html><html lang=\"en\" class=\"js-focus-visible lg:[--scroll-mt:9.5rem]\" data-js-focus-visible=\""...",
      "metadata": {
        "title": "Build a 'Chat with website' using Groq Llama 3 | Firecrawl",
        "language": "en",
        "sourceURL": "https://docs.firecrawl.dev/learn/rag-llama3",
        "description": "Learn how to use Firecrawl, Groq Llama 3, and Langchain to build a 'Chat with your website' bot.",
        "ogLocaleAlternate": [],
        "statusCode": 200
      }
    },
    ...
  ]
}
```

#### Response Example (Completed)
```json
{
  "status": "completed",
  "total": 36,
  "completed": 36,
  "creditsUsed": 36,
  "expiresAt": "2024-00-00T00:00:00.000Z",
  "next": "https://api.firecrawl.dev/v2/crawl/123-456-789?skip=26",
  "data": [
    {
      "markdown": "[Firecrawl Docs home page![light logo](https://mintlify.s3-us-west-1.amazonaws.com/firecrawl/logo/light.svg)!...",
      "html": "<!DOCTYPE html><html lang=\"en\" class=\"js-focus-visible lg:[--scroll-mt:9.5rem]\" data-js-focus-visible=\""...",
      "metadata": {
        "title": "Build a 'Chat with website' using Groq Llama 3 | Firecrawl",
        "language": "en",
        "sourceURL": "https://docs.firecrawl.dev/learn/rag-llama3",
        "description": "Learn how to use Firecrawl, Groq Llama 3, and Langchain to build a 'Chat with your website' bot.",
        "ogLocaleAlternate": [],
        "statusCode": 200
      }
    },
    ...
  ]
}
```
```

--------------------------------

### Process scraped data using LangChain chains

Source: https://docs.firecrawl.dev/developer-guides/llm-sdks-and-frameworks/langchain

Shows how to build a structured processing chain to extract specific information like company names and products from scraped website content.

```typescript
import FirecrawlApp from '@mendable/firecrawl-js';
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });
const model = new ChatOpenAI({
    model: 'gpt-5-nano',
    apiKey: process.env.OPENAI_API_KEY
});

const scrapeResult = await firecrawl.scrape('https://stripe.com', {
    formats: ['markdown']
});

const prompt = ChatPromptTemplate.fromMessages([
    ['system', 'You are an expert at analyzing company websites.'],
    ['user', 'Extract the company name and main products from: {content}']
]);

const chain = prompt.pipe(model).pipe(new StringOutputParser());

const result = await chain.invoke({
    content: scrapeResult.markdown
});

console.log('Chain result:', result);
```

--------------------------------

### Map a Website Structure with Firecrawl Node SDK

Source: https://docs.firecrawl.dev/sdks/node

Illustrates how to use the `map` method in the Firecrawl Node.js SDK to map the structure of a website. It returns a dictionary containing information about the website's links and structure.

```javascript
const res = await firecrawl.map('https://firecrawl.dev', { limit: 10 });
console.log(res.links);
```

--------------------------------

### Poll Crawl Status with SDKs and CLI

Source: https://docs.firecrawl.dev/features/crawl

Check the status of a Firecrawl job using its ID. Examples are provided for Python and Node.js SDKs, cURL for direct API interaction, and the Firecrawl CLI. The job ID is essential for polling.

```python
status = firecrawl.get_crawl_status("<crawl-id>")
print(status)
```

```javascript
const status = await firecrawl.getCrawlStatus("<crawl-id>");
console.log(status);
```

```bash
# After starting a crawl, poll status by jobId
curl -s -X GET "https://api.firecrawl.dev/v2/crawl/<jobId>" \
    -H "Authorization: Bearer $FIRECRAWL_API_KEY"
```

```bash
# Check crawl status using job ID
firecrawl crawl <job-id>
```

--------------------------------

### Scrape and Summarize Web Content with TypeScript

Source: https://docs.firecrawl.dev/developer-guides/llm-sdks-and-frameworks/openai

Demonstrates how to fetch website content as markdown using Firecrawl and pass it to an OpenAI model for summarization.

```typescript
import FirecrawlApp from '@mendable/firecrawl-js';
import OpenAI from 'openai';

const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const scrapeResult = await firecrawl.scrape('https://firecrawl.dev', {
    formats: ['markdown']
});

const completion = await openai.chat.completions.create({
    model: 'gpt-5-nano',
    messages: [
        { role: 'user', content: `Summarize: ${scrapeResult.markdown}` }
    ]
});

console.log('Summary:', completion.choices[0]?.message.content);
```

--------------------------------

### View Firecrawl CLI Configuration

Source: https://docs.firecrawl.dev/sdks/cli

Displays the current configuration and authentication status of the Firecrawl CLI. This helps in verifying that the CLI is set up correctly.

```bash
# View current configuration and authentication status
firecrawl view-config
```

--------------------------------

### Check Firecrawl Crawl Job Status (cURL)

Source: https://docs.firecrawl.dev/advanced-scraping-guide

Retrieves the status and results of a Firecrawl crawl job using its job ID. If the results are large or the job is ongoing, a 'next' URL may be provided for paginated results.

```bash
curl -X GET https://api.firecrawl.dev/v2/crawl/1234-5678-9101 \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer fc-YOUR-API-KEY'
```

--------------------------------

### Scrape with Change Tracking and Tags (Python, Node.js, cURL)

Source: https://docs.firecrawl.dev/features/change-tracking

Demonstrates how to use the changeTracking format with specific tags for hourly and daily monitoring. This allows for maintaining separate tracking histories for the same URL based on different scraping intervals. The output includes markdown and change tracking information.

```python
result = firecrawl.scrape(
    "https://example.com/pricing",
    formats=[
        "markdown",
        { "type": "changeTracking", "tag": "hourly" }
    ]
)

result = firecrawl.scrape(
    "https://example.com/pricing",
    formats=[
        "markdown",
        { "type": "changeTracking", "tag": "daily" }
    ]
)
```

```javascript
const result = await firecrawl.scrape('https://example.com/pricing', {
    formats: [
      'markdown',
      { type: 'changeTracking', tag: 'hourly' }
    ]
  });

  const result2 = await firecrawl.scrape('https://example.com/pricing', {
    formats: [
      'markdown',
      { type: 'changeTracking', tag: 'daily' }
    ]
  });
```

```bash
curl -s -X POST "https://api.firecrawl.dev/v2/scrape" \
    -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "url": "https://example.com/pricing",
      "formats": [
        "markdown",
        { "type": "changeTracking", "tag": "hourly" }
      ]
    }'
```

--------------------------------

### Crawl Websites via CLI

Source: https://docs.firecrawl.dev/sdks/cli

Initiate and monitor website crawls. These commands support synchronous waiting, progress tracking, and job status verification using unique job IDs.

```bash
# Start a crawl (returns job ID immediately)
firecrawl crawl https://example.com

# Wait for crawl to complete
firecrawl crawl https://example.com --wait

# Wait with progress indicator
firecrawl crawl https://example.com --wait --progress

# Check crawl status using job ID
firecrawl crawl <job-id>
```

--------------------------------

### POST /scrape

Source: https://docs.firecrawl.dev/sdks/java

Scrapes a single URL and returns the content in specified formats like markdown or HTML.

```APIDOC
## POST /scrape

### Description
Scrapes a single URL and returns the content in specified formats. Supports options like extracting only main content and waiting for dynamic content to load.

### Method
POST

### Endpoint
/scrape

### Parameters
#### Request Body
- **url** (string) - Required - The URL to scrape.
- **formats** (array) - Optional - List of formats (e.g., ["markdown", "html"]).
- **onlyMainContent** (boolean) - Optional - If true, extracts only the main content.
- **waitFor** (integer) - Optional - Time in milliseconds to wait for page load.

### Request Example
{
  "url": "https://firecrawl.dev",
  "formats": ["markdown"],
  "onlyMainContent": true
}

### Response
#### Success Response (200)
- **markdown** (string) - The scraped content in markdown format.
- **metadata** (object) - Metadata associated with the page.

#### Response Example
{
  "markdown": "# Welcome to Firecrawl...",
  "metadata": { "title": "Firecrawl" }
}
```

--------------------------------

### Retrieve Crawl Job Status via OpenAPI

Source: https://docs.firecrawl.dev/api-reference/endpoint/crawl-get

Defines the GET endpoint for fetching the status and data of a specific crawl job using its UUID. It includes schema definitions for response objects, error handling, and data structures like markdown, HTML, and metadata.

```yaml
paths:
  /crawl/{id}:
    parameters:
      - name: id
        in: path
        description: The ID of the crawl job
        required: true
        schema:
          type: string
          format: uuid
    get:
      tags:
        - Crawling
      summary: Get the status of a crawl job
      operationId: getCrawlStatus
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CrawlStatusResponseObj'
```

--------------------------------

### Run PostgreSQL Docker Container

Source: https://docs.firecrawl.dev/contributing/guide

Runs a Docker container for PostgreSQL, mapping the host port to the container port and persisting data. This command assumes the Docker image 'nuq-postgres' has already been built.

```bash
docker run --name nuqdb \
  -e POSTGRES_PASSWORD=postgres \
  -p 5433:5432 \
  -v nuq-data:/var/lib/postgresql/data \
  -d nuq-postgres
```

--------------------------------

### POST /scrape

Source: https://docs.firecrawl.dev/api-reference/endpoint/scrape

Configures and executes a scraping request with advanced options for content parsing and browser interaction.

```APIDOC
## POST /scrape

### Description
Initiates a scraping job with customizable parameters including mobile emulation, PDF parsing strategies, and browser-based actions.

### Method
POST

### Endpoint
/scrape

### Parameters
#### Request Body
- **mobile** (boolean) - Optional - Set to true to emulate scraping from a mobile device.
- **skipTlsVerification** (boolean) - Optional - Skip TLS certificate verification. Default: true.
- **timeout** (integer) - Optional - Request timeout in milliseconds (30000-300000). Default: 30000.
- **parsers** (array) - Optional - Controls file processing. Default: [{"type": "pdf"}].
- **actions** (array) - Optional - List of browser actions to perform (wait, screenshot).

### Request Example
{
  "mobile": false,
  "timeout": 30000,
  "parsers": [{"type": "pdf", "mode": "auto"}],
  "actions": [
    {"type": "wait", "milliseconds": 1000},
    {"type": "screenshot", "fullPage": true}
  ]
}

### Response
#### Success Response (200)
- **success** (boolean) - Indicates if the request was processed successfully.
- **data** (object) - The scraped content and action results.

#### Response Example
{
  "success": true,
  "data": {
    "content": "...",
    "actions": {
      "screenshots": ["https://example.com/screenshot.png"]
    }
  }
}
```

--------------------------------

### Verify Firecrawl Webhook Signature in Python

Source: https://docs.firecrawl.dev/webhooks/security

This Python/Flask example shows how to verify Firecrawl webhook signatures using HMAC-SHA256. It utilizes the `hmac`, `hashlib`, and `flask` libraries. The code retrieves the signature from headers, computes the expected signature using the webhook secret and raw request data, and performs a timing-safe comparison using `hmac.compare_digest`.

```python
import hmac
import hashlib
from flask import Flask, request, abort

app = Flask(__name__)

WEBHOOK_SECRET = 'your-webhook-secret-here'  # Get from Firecrawl dashboard

@app.post('/webhook/firecrawl')
def webhook():
    signature = request.headers.get('X-Firecrawl-Signature')
    
    if not signature:
        abort(401, 'Missing signature header')
    
    # Extract hash from signature header
    try:
        algorithm, hash_value = signature.split('=', 1)
        if algorithm != 'sha256':
            abort(401, 'Invalid signature algorithm')
    except ValueError:
        abort(401, 'Invalid signature format')
    
    # Compute expected signature
    expected_signature = hmac.new(
        WEBHOOK_SECRET.encode('utf-8'),
        request.data,
        hashlib.sha256
    ).hexdigest()
    
    # Verify signature using timing-safe comparison
    if not hmac.compare_digest(hash_value, expected_signature):
        abort(401, 'Invalid signature')
    
    # Parse and process verified webhook
    event = request.get_json(force=True)
    print('Verified Firecrawl webhook:', event)
    
    return 'ok', 200

if __name__ == '__main__':
    app.run(port=3000)
```

--------------------------------

### Crawl with Cached Scraping (Python, JavaScript, cURL)

Source: https://docs.firecrawl.dev/features/fast-scraping

This snippet demonstrates how to perform a web crawl using Firecrawl with caching enabled via the `maxAge` option. By setting `maxAge`, the crawler can reuse recent cached data, leading to a substantial speed improvement (up to 500%) for pages that have been scraped recently. The examples show how to configure `maxAge` and process the results, extracting URLs and content snippets.

```python
from firecrawl import Firecrawl
from firecrawl.v2.types import ScrapeOptions

firecrawl = Firecrawl(api_key="fc-YOUR_API_KEY")

# Crawl with cached scraping - 500% faster for pages we've seen recently
crawl_result = firecrawl.crawl(
    'https://firecrawl.dev',
    limit=100,
    scrape_options=ScrapeOptions(
        formats=['markdown'],
        max_age=3600000  # Use cached data if less than 1 hour old
    )
)

for page in crawl_result.data:
    print(f"URL: {page.metadata.source_url}")
    print(f"Content: {page.markdown[:200]}...")
```

```javascript
import Firecrawl from '@mendable/firecrawl-js';

const firecrawl = new Firecrawl({ apiKey: "fc-YOUR_API_KEY" });

// Crawl with cached scraping - 500% faster for pages we've seen recently
const crawlResult = await firecrawl.crawl('https://firecrawl.dev', {
  limit: 100,
  scrapeOptions: {
    formats: ['markdown'],
    maxAge: 3600000 // Use cached data if less than 1 hour old
  }
});

crawlResult.data.forEach(page => {
  console.log(`URL: ${page.metadata.sourceURL}`);
  console.log(`Content: ${page.markdown.substring(0, 200)}...`);
});
```

```bash
curl -X POST https://api.firecrawl.dev/v2/crawl \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer fc-YOUR_API_KEY' \
  -d '{
    "url": "https://firecrawl.dev",
    "limit": 100,
    "scrapeOptions": {
      "formats": ["markdown"],
      "maxAge": 3600000
    }
  }'
```

--------------------------------

### Interact with Web Browser using Python

Source: https://docs.firecrawl.dev/introduction

This Python snippet demonstrates browser automation with the 'firecrawl' library. It shows how to initialize the Firecrawl client with an API key, launch a browser session, execute Python code within the browser context to interact with web pages, and subsequently close the session. The 'browser_execute' function allows for page navigation and data extraction.

```python
# pip install firecrawl
from firecrawl import Firecrawl

app = Firecrawl(api_key="fc-YOUR-API-KEY")

# 1. Launch a session
session = app.browser()
print(session.cdp_url)  # wss://cdp-proxy.firecrawl.dev/cdp/...

# 2. Execute code
result = app.browser_execute(
    session.id,
    code='await page.goto("https://news.ycombinator.com")\ntitle = await page.title()\nprint(title)',
    language="python",
)
print(result.result)  # "Hacker News"

# 3. Close
app.delete_browser(session.id)
```

--------------------------------

### Agent-Browser CLI Commands (Bash)

Source: https://docs.firecrawl.dev/features/browser

Uses the explicit `execute` command to send instructions to agent-browser. This method ensures commands are sent to the active session without needing to prefix with `agent-browser` or use `--bash`. Supports navigation, interaction, and scraping.

```bash
firecrawl browser execute "open https://example.com"
firecrawl browser execute "snapshot"
```

```bash
firecrawl browser execute "click @e5"
firecrawl browser execute "fill @e3 'search query'"
firecrawl browser execute "scrape"
```

--------------------------------

### Initialize Firecrawl Client (Python)

Source: https://docs.firecrawl.dev/migrate-to-v2

Shows how to initialize the Firecrawl client in Python for v2. This involves creating a new instance of the Firecrawl class with your API key.

```python
firecrawl = Firecrawl(api_key='fc-YOUR-API-KEY')
```

--------------------------------

### Verify Firecrawl Webhook Signature in Node.js

Source: https://docs.firecrawl.dev/webhooks/security

This Node.js/Express example demonstrates how to verify the HMAC-SHA256 signature of incoming Firecrawl webhook requests. It requires the `crypto` module and uses `express.raw` to access the raw request body for signature computation. The function extracts the signature, computes the expected signature using the webhook secret, and performs a timing-safe comparison.

```javascript
import crypto from 'crypto';
import express from 'express';

const app = express();

// Use raw body parser for signature verification
app.use('/webhook/firecrawl', express.raw({ type: 'application/json' }));

app.post('/webhook/firecrawl', (req, res) => {
  const signature = req.get('X-Firecrawl-Signature');
  const webhookSecret = process.env.FIRECRAWL_WEBHOOK_SECRET;
  
  if (!signature || !webhookSecret) {
    return res.status(401).send('Unauthorized');
  }
  
  // Extract hash from signature header
  const [algorithm, hash] = signature.split('=');
  if (algorithm !== 'sha256') {
    return res.status(401).send('Invalid signature algorithm');
  }
  
  // Compute expected signature
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(req.body)
    .digest('hex');
  
  // Verify signature using timing-safe comparison
  if (!crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(expectedSignature, 'hex'))) {
    return res.status(401).send('Invalid signature');
  }
  
  // Parse and process verified webhook
  const event = JSON.parse(req.body);
  console.log('Verified Firecrawl webhook:', event);
  
  res.status(200).send('ok');
});

app.listen(3000, () => console.log('Listening on 3000'));
```

--------------------------------

### Scrape and summarize website content with LangChain

Source: https://docs.firecrawl.dev/developer-guides/llm-sdks-and-frameworks/langchain

Demonstrates how to fetch website content in markdown format using Firecrawl and pass it to a Large Language Model via LangChain for summarization.

```typescript
import FirecrawlApp from '@mendable/firecrawl-js';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage } from '@langchain/core/messages';

const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });
const chat = new ChatOpenAI({
    model: 'gpt-5-nano',
    apiKey: process.env.OPENAI_API_KEY
});

const scrapeResult = await firecrawl.scrape('https://firecrawl.dev', {
    formats: ['markdown']
});

console.log('Scraped content length:', scrapeResult.markdown?.length);

const response = await chat.invoke([
    new HumanMessage(`Summarize: ${scrapeResult.markdown}`)
]);

console.log('Summary:', response.content);
```

--------------------------------

### Apply Pagination Limits to Crawl Jobs in Python

Source: https://docs.firecrawl.dev/sdks/python

Shows how to use PaginationConfig with auto-pagination enabled to enforce early exit conditions. This is useful for limiting the volume or duration of data collection.

```python
status = client.get_crawl_status(
    crawl_job.id,
    pagination_config=PaginationConfig(max_pages=2, max_results=50, max_wait_time=15),
)
print("crawl limited:", status.status, "docs:", len(status.data), "next:", status.next)
```

--------------------------------

### Configure Batch Scrape Webhooks via cURL

Source: https://docs.firecrawl.dev/features/batch-scrape

This snippet demonstrates how to initiate a batch scrape job with a webhook configuration using the Firecrawl API. It includes the target URLs, the callback URL, and the specific events to trigger notifications.

```bash
curl -X POST https://api.firecrawl.dev/v2/batch/scrape \
    -H 'Content-Type: application/json' \
    -H 'Authorization: Bearer YOUR_API_KEY' \
    -d '{
      "urls": [
        "https://example.com/page1",
        "https://example.com/page2",
        "https://example.com/page3"
      ],
      "webhook": {
        "url": "https://your-domain.com/webhook",
        "metadata": {
          "any_key": "any_value"
        },
        "events": ["started", "page", "completed"]
      }
    }'
```

--------------------------------

### Enhanced Screenshot Options

Source: https://docs.firecrawl.dev/migrate-to-v2

Using the new object format for screenshot options.

```APIDOC
## Enhanced Screenshot Options

### Description
Use the object form `{ type: "screenshot", fullPage, quality, viewport }` for enhanced screenshot options.

### Method
POST

### Endpoint
`/v2/scrape` (example)

### Parameters
#### Request Body
- **url** (string) - Required - The URL to capture a screenshot of.
- **format** (object) - Required - Screenshot options.
  - **type** (string) - Required - Set to `"screenshot"`.
  - **fullPage** (boolean) - Optional - Whether to capture the full page. Defaults to `false`.
  - **quality** (integer) - Optional - The quality of the screenshot (0-100). Defaults to `80`.
  - **viewport** (object) - Optional - Viewport dimensions.
    - **width** (integer) - Optional - Viewport width.
    - **height** (integer) - Optional - Viewport height.

### Request Example
```json
{
  "url": "https://example.com",
  "format": {
    "type": "screenshot",
    "fullPage": true,
    "quality": 90,
    "viewport": {
      "width": 1920,
      "height": 1080
    }
  }
}
```

### Response
#### Success Response (200)
- **data** (string) - Base64 encoded image data of the screenshot.

#### Response Example
```json
{
  "data": "iVBORw0KGgoAAAANSUhEUgAA..."
}
```
```

--------------------------------

### Perform Quick Scrapes

Source: https://docs.firecrawl.dev/sdks/cli

Basic commands to extract markdown or HTML content from a specific URL.

```bash
# Get markdown content from a URL (use --only-main-content for clean output)
firecrawl https://docs.firecrawl.dev --only-main-content

# Get HTML content
firecrawl https://example.com --html -o page.html
```

--------------------------------

### Scrape Web Content with Firecrawl

Source: https://docs.firecrawl.dev/developer-guides/llm-sdks-and-frameworks/vercel-ai-sdk

Demonstrates how to use the `scrape` tool from the Firecrawl SDK to fetch and summarize content from a given URL within an AI application.

```typescript
import { generateText } from 'ai';
import { scrape } from 'firecrawl-aisdk';

const { text } = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Scrape https://firecrawl.dev and summarize what it does',
  tools: { scrape },
});
```

--------------------------------

### Batch Scrape with Change Tracking and Git-Diff Mode (Python, Node.js, cURL)

Source: https://docs.firecrawl.dev/features/change-tracking

Illustrates how to use batch scraping with change tracking enabled, specifically utilizing the `git-diff` mode. This is useful for monitoring a predefined list of URLs for changes. The `formats` parameter is configured within the batch scrape options.

```python
result = firecrawl.batch_scrape(
    [
        "https://example.com/pricing",
        "https://example.com/product/widget",
        "https://example.com/blog/latest"
    ],
    formats=["markdown", {"type": "changeTracking", "modes": ["git-diff"]}]
)
```

```javascript
const result = await firecrawl.batchScrape([
    'https://example.com/pricing',
    'https://example.com/product/widget',
    'https://example.com/blog/latest'
  ], {
    options: {
      formats: ['markdown', { type: 'changeTracking', modes: ['git-diff'] }]
    }
  });
```

```bash
curl -s -X POST "https://api.firecrawl.dev/v2/batch/scrape" \
    -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "urls": [
        "https://example.com/pricing",
        "https://example.com/product/widget",
        "https://example.com/blog/latest"
      ],
      "formats": [
        "markdown",
        { "type": "changeTracking", "modes": ["git-diff"] }
      ]
    }'
```

--------------------------------

### Usage & Metrics

Source: https://docs.firecrawl.dev/sdks/java

Retrieve account credit and token usage information.

```APIDOC
## Usage & Metrics

### Description
Check your credit and token usage.

### Method
GET

### Endpoint
/usage

### Parameters
None

### Request Example
```java
AccountCreditUsageResponse credits = client.getCreditUsage();
System.out.println("Remaining credits: " + credits.getData().getRemainingCredits());

AccountTokenUsageResponse tokens = client.getTokenUsage();
System.out.println("Remaining tokens: " + tokens.getData().getRemainingTokens());
```

### Response
#### Success Response (200)
- **data** (object) - Usage data containing remaining credits and tokens.
  - **remainingCredits** (integer) - The number of credits remaining.
  - **remainingTokens** (integer) - The number of tokens remaining.

#### Response Example
```json
{
  "data": {
    "remainingCredits": 1000,
    "remainingTokens": 50000
  }
}
```
```

--------------------------------

### Manage Browser Sessions via CLI

Source: https://docs.firecrawl.dev/sdks/cli

Commands to list, launch, and interact with cloud-based browser sessions. Users can filter sessions by status or output results in JSON format.

```bash
firecrawl browser list
firecrawl browser list active --json
```

--------------------------------

### Async Web Scraping, Searching, and Crawling with Firecrawl

Source: https://docs.firecrawl.dev/sdks/python

Demonstrates asynchronous operations using the AsyncFirecrawl class. This includes scraping web pages, searching for content, initiating and checking crawl statuses, and performing batch scrapes. Requires the 'firecrawl' library and an API key.

```python
import asyncio
from firecrawl import AsyncFirecrawl

async def main():
    firecrawl = AsyncFirecrawl(api_key="fc-YOUR-API-KEY")

    # Scrape
    doc = await firecrawl.scrape("https://firecrawl.dev", formats=["markdown"])
    print(doc.get("markdown"))

    # Search
    results = await firecrawl.search("firecrawl", limit=2)
    print(results.get("web", []))

    # Crawl (start + status)
    started = await firecrawl.start_crawl("https://docs.firecrawl.dev", limit=3)
    status = await firecrawl.get_crawl_status(started.id)
    print(status.status)

    # Batch scrape (wait)
    job = await firecrawl.batch_scrape([
        "https://firecrawl.dev",
        "https://docs.firecrawl.dev",
    ], formats=["markdown"], poll_interval=1, timeout=60)
    print(job.status, job.completed, job.total)

asyncio.run(main())
```

--------------------------------

### Browser Action: Generate PDF

Source: https://docs.firecrawl.dev/api-reference/endpoint/batch-scrape

Generates a PDF of the current page with configurable formatting options.

```APIDOC
## POST /actions/pdf

### Description
Generates a PDF of the current page. The result is returned in the `actions.pdfs` array.

### Method
POST

### Endpoint
/actions/pdf

### Parameters
#### Request Body
- **type** (string) - Required - Must be 'pdf'
- **format** (string) - Optional - Page size (A0-A6, Letter, Legal, etc.). Default: 'Letter'
- **landscape** (boolean) - Optional - Whether to use landscape orientation. Default: false
- **scale** (number) - Optional - Scale multiplier. Default: 1

### Request Example
{
  "type": "pdf",
  "format": "A4",
  "landscape": false
}
```

--------------------------------

### Execute Full Site Crawl

Source: https://docs.firecrawl.dev/sdks/cli

Crawls an entire website with configurable depth and concurrency limits.

```bash
firecrawl crawl https://docs.example.com --limit 50 --max-depth 2 --wait --progress -o docs.json
```

--------------------------------

### Output Formats Configuration

Source: https://docs.firecrawl.dev/api-reference/endpoint/scrape

This section details the configuration options for various output formats available in the Firecrawl Dev API. You can specify formats as simple strings or as objects with additional parameters for more granular control.

```APIDOC
## Output Formats

### Description

Output formats to include in the response. You can specify one or more formats, either as strings (e.g., `'markdown'`) or as objects with additional options (e.g., `{ type: 'json', schema: {...} }`). Some formats require specific options to be set.

### Supported Formats

- **Links**: Extracts all links from the page.
  - `type`: `"links"`

- **Images**: Extracts all image URLs from the page.
  - `type`: `"images"`

- **Screenshot**: Captures a screenshot of the page.
  - `type`: `"screenshot"`
  - `fullPage` (boolean, Optional, default: `false`): Whether to capture a full-page screenshot or limit to the current viewport.
  - `quality` (integer, Optional): The quality of the screenshot, from 1 to 100.
  - `viewport` (object, Required if `fullPage` is false):
    - `width` (integer, Required): The width of the viewport in pixels.
    - `height` (integer, Required): The height of the viewport in pixels.

- **JSON**: Extracts data based on a provided JSON schema.
  - `type`: `"json"`
  - `schema` (object, Required): The JSON schema to use for the output. Must conform to JSON Schema specifications.
  - `prompt` (string, Optional): The prompt to guide the JSON extraction.

- **Change Tracking**: Tracks changes in scraped content.
  - `type`: `"changeTracking"`
  - `modes` (array of strings, Required): The mode(s) for change tracking. Supported modes: `"git-diff"`, `"json"`.
  - `schema` (object, Required if `modes` includes `"json"`): Schema for JSON extraction when using 'json' mode.
  - `prompt` (string, Optional): Prompt to use for 'json' mode change tracking.
  - `tag` (string, Nullable, Optional, default: `null`): Tag to separate change tracking history.

- **Branding**: Extracts branding information.
  - `type`: `"branding"`

### Default Value

- `['markdown']`
```

--------------------------------

### Click Action

Source: https://docs.firecrawl.dev/api-reference/endpoint/scrape

Simulates a click event on a specified element. Can optionally click all matching elements.

```APIDOC
## POST /websites/firecrawl_dev/actions

### Description
Simulates a click event on a specified element. Can optionally click all matching elements.

### Method
POST

### Endpoint
/websites/firecrawl_dev/actions

### Parameters
#### Request Body
- **type** (string) - Required - Must be 'click'.
- **selector** (string) - Required - Query selector to find the element by.
- **all** (boolean) - Optional - Clicks all elements matched by the selector, not just the first one. Defaults to false.

### Request Example
```json
{
  "actions": [
    {
      "type": "click",
      "selector": "#load-more-button",
      "all": true
    }
  ]
}
```

### Response
#### Success Response (200)
- **pdfs** (array) - Array of generated PDF objects.
- **actions** (object) - Object containing results of performed actions.

#### Response Example
```json
{
  "pdfs": [],
  "actions": {
    "click": [
      {
        "selector": "#load-more-button",
        "clicked": 1
      }
    ]
  }
}
```
```

--------------------------------

### New Search Sources

Source: https://docs.firecrawl.dev/migrate-to-v2

How to specify new search sources like 'news' and 'images'.

```APIDOC
## New Search Sources

### Description
Search across `"news"` and `"images"` in addition to web results by setting the `sources` parameter.

### Method
GET

### Endpoint
`/v2/search`

### Parameters
#### Query Parameters
- **query** (string) - Required - The search query.
- **sources** (array of strings) - Optional - An array of sources to search. Possible values: `"web"`, `"news"`, `"images"`. Defaults to `["web"]`.

### Request Example
```
GET /v2/search?query=latest+AI+news&sources[]=news&sources[]=web
```

### Response
#### Success Response (200)
- **results** (array) - An array of search results.
  - **title** (string) - Title of the search result.
  - **url** (string) - URL of the search result.
  - **snippet** (string) - A short snippet of the content.
  - **source** (string) - The source of the result (e.g., "web", "news").

#### Response Example
```json
{
  "results": [
    {
      "title": "Latest AI Breakthroughs",
      "url": "https://news.example.com/ai",
      "snippet": "Recent advancements in artificial intelligence...",
      "source": "news"
    }
  ]
}
```
```

--------------------------------

### POST /batch/scrape

Source: https://docs.firecrawl.dev/ja/api-reference/endpoint/webhook-batch-scrape-started

Initiates a batch scraping process to crawl multiple URLs or websites simultaneously.

```APIDOC
## POST /batch/scrape

### Description
Initiates a batch scraping job. This endpoint allows users to submit multiple URLs for processing in a single request.

### Method
POST

### Endpoint
/batch/scrape

### Parameters
#### Request Body
- **urls** (array) - Required - A list of URLs to be scraped.
- **options** (object) - Optional - Configuration options for the scrape job (e.g., formats, wait times).

### Request Example
{
  "urls": ["https://example.com", "https://docs.firecrawl.dev"],
  "options": {
    "formats": ["markdown"]
  }
}

### Response
#### Success Response (200)
- **id** (string) - The unique identifier for the batch scrape job.
- **status** (string) - The initial status of the job (e.g., "pending").

#### Response Example
{
  "id": "job_12345",
  "status": "pending"
}
```

--------------------------------

### Scrape Action

Source: https://docs.firecrawl.dev/api-reference/endpoint/scrape

Scrapes the current page content, returning the URL and HTML.

```APIDOC
## POST /websites/firecrawl_dev/actions

### Description
Scrapes the current page content, returning the URL and HTML.

### Method
POST

### Endpoint
/websites/firecrawl_dev/actions

### Parameters
#### Request Body
- **type** (string) - Required - Must be 'scrape'.

### Request Example
```json
{
  "actions": [
    {
      "type": "scrape"
    }
  ]
}
```

### Response
#### Success Response (200)
- **url** (string) - The URL of the scraped page.
- **html** (string) - The HTML content of the page.
- **pdfs** (array) - Array of generated PDF objects.
- **actions** (object) - Object containing results of performed actions.

#### Response Example
```json
{
  "url": "http://example.com",
  "html": "<!DOCTYPE html><html>...</html>",
  "pdfs": [],
  "actions": {
    "scrape": [
      {
        "url": "http://example.com"
      }
    ]
  }
}
```
```

--------------------------------

### Scrape URL with Parameters using Firecrawl Java SDK

Source: https://docs.firecrawl.dev/sdks/java

Demonstrates how to scrape a single URL using the `scrapeURL` method with specific parameters like format, main content extraction, and wait time. It returns the scraped data as a `FirecrawlDocument`.

```java
ScrapeParams params = new ScrapeParams();
params.setFormats(new String[]{"markdown", "html"});
params.setOnlyMainContent(true);
params.setWaitFor(5000);

FirecrawlDocument doc = client.scrapeURL("https://firecrawl.dev", params);

System.out.println(doc.getMarkdown());
System.out.println(doc.getMetadata().get("title"));
```

--------------------------------

### Scrape URL with Firecrawl Rust SDK

Source: https://docs.firecrawl.dev/sdks/rust

Demonstrates the usage of the `scrape_url` method from the Firecrawl Rust SDK to fetch content from a given URL. It specifies the desired output formats (Markdown and HTML) and handles potential errors.

```rust
let options = ScrapeOptions {
    formats: vec![ScrapeFormats::Markdown, ScrapeFormats::HTML].into(),
    ..Default::default()
};

let scrape_result = app.scrape_url("https://firecrawl.dev", options).await;

match scrape_result {
    Ok(data) => println!("Scrape Result:\n{}", data.markdown.unwrap()),
    Err(e) => eprintln!("Map failed: {}", e),
}
```

--------------------------------

### Use Browser Tool for Web Scraping with AI

Source: https://docs.firecrawl.dev/developer-guides/llm-sdks-and-frameworks/vercel-ai-sdk

Demonstrates how to use the browser tool within an AI model to scrape information from a given URL. The tool automatically manages cloud sessions and cleans up resources upon process exit. It requires the 'ai' and 'firecrawl-aisdk' libraries.

```typescript
import { generateText, stepCountIs } from 'ai';
import { browser } from 'firecrawl-aisdk';

const { text } = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  tools: { browser: browser() },
  stopWhen: stepCountIs(25),
  prompt: 'Go to https://news.ycombinator.com and get the top 3 stories.',
});
```

--------------------------------

### Scrape Documents with Firecrawl Node.js SDK

Source: https://docs.firecrawl.dev/features/document-parsing

Shows how to initialize the Firecrawl client and scrape content from Excel or Word documents. The output is returned as structured markdown.

```javascript
import Firecrawl from '@mendable/firecrawl-js';

const firecrawl = new Firecrawl({ apiKey: "fc-YOUR-API-KEY" });

const doc = await firecrawl.scrape('https://example.com/data.xlsx');

console.log(doc.markdown);
```

```javascript
import Firecrawl from '@mendable/firecrawl-js';

const firecrawl = new Firecrawl({ apiKey: "fc-YOUR-API-KEY" });

const doc = await firecrawl.scrape('https://example.com/data.docx');

console.log(doc.markdown);
```

--------------------------------

### Importing All Firecrawl SDK Exports

Source: https://docs.firecrawl.dev/developer-guides/llm-sdks-and-frameworks/vercel-ai-sdk

Provides a comprehensive list of all available tools and utilities that can be imported from the 'firecrawl-aisdk' library. This includes direct tools, factory functions, job management utilities, and helper functions for logging and statistics.

```typescript
import {
  scrape,
  search,
  map,
  crawl,
  batchScrape,
  agent,
  extract,
  poll,
  status,
  cancel,
  browser,
  FirecrawlTools,
  stepLogger,
  logStep,
} from 'firecrawl-aisdk';
```

--------------------------------

### Scrape Website and Summarize with Claude

Source: https://docs.firecrawl.dev/developer-guides/llm-sdks-and-frameworks/anthropic

Demonstrates a basic workflow to scrape a website using Firecrawl and then summarize the extracted markdown content using Anthropic's Claude model. Requires Firecrawl and Anthropic API keys.

```typescript
import FirecrawlApp from '@mendable/firecrawl-js';
import Anthropic from '@anthropic-ai/sdk';

const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const scrapeResult = await firecrawl.scrape('https://firecrawl.dev', {
    formats: ['markdown']
});

console.log('Scraped content length:', scrapeResult.markdown?.length);

const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 1024,
    messages: [
        { role: 'user', content: `Summarize in 100 words: ${scrapeResult.markdown}` }
    ]
});

console.log('Response:', message);
```

--------------------------------

### Execute Agent-Browser Commands via API/SDK (Node.js)

Source: https://docs.firecrawl.dev/features/browser

Shows how to run agent-browser commands programmatically using the Firecrawl SDK in Node.js. The `browserExecute` method takes the session ID and an object containing the command code and language.

```javascript
const result = await app.browserExecute(sessionId, {
    code: "agent-browser snapshot",
    language: "bash",
  });
```

--------------------------------

### Configure screenshot scraping format

Source: https://docs.firecrawl.dev/migrate-to-v2

Shows how to configure the screenshot format, including options for full-page capture, quality, and viewport dimensions. This is applicable for Node.js, Python, and cURL.

```js
const formats = [ { "type": "screenshot", "fullPage": true, "quality": 80, "viewport": { "width": 1280, "height": 800 } } ];

doc = firecrawl.scrape(url, { formats });
```

```python
formats = [ { "type": "screenshot", "fullPage": true, "quality": 80, "viewport": { "width": 1280, "height": 800 } } ];
doc = firecrawl.scrape(url, formats=formats);
```

```bash
curl -X POST https://api.firecrawl.dev/v2/scrape \
    -H 'Content-Type: application/json' \
    -H 'Authorization: Bearer YOUR_API_KEY' \
    -d '{
      "url": "https://docs.firecrawl.dev/",
      "formats": [{
        "type": "screenshot",
        "fullPage": true,
        "quality": 80,
        "viewport": { "width": 1280, "height": 800 }
      }]
    }'
```

--------------------------------

### Cloud Browser Session Management and Execution

Source: https://docs.firecrawl.dev/sdks/node

Covers initializing a cloud browser session, executing remote code in Python, Node, or Bash, and managing session state via profiles.

```javascript
import Firecrawl from '@mendable/firecrawl-js';

const firecrawl = new Firecrawl({ apiKey: "fc-YOUR-API-KEY" });

const session = await firecrawl.browser({ ttl: 600 });

const result = await firecrawl.browserExecute(session.id, {
  code: 'await page.goto("https://news.ycombinator.com")\ntitle = await page.title()\nprint(title)',
});

const nodeResult = await firecrawl.browserExecute(session.id, {
  code: 'await page.goto("https://example.com"); const t = await page.title(); console.log(t);',
  language: "node",
});

const bashResult = await firecrawl.browserExecute(session.id, {
  code: "agent-browser open https://example.com && agent-browser snapshot",
  language: "bash",
});

const profileSession = await firecrawl.browser({
  ttl: 600,
  profile: {
    name: "my-profile",
    saveChanges: true,
  },
});
```

--------------------------------

### Extract data using natural language prompts

Source: https://docs.firecrawl.dev/features/scrape

Shows how to extract information from a webpage without a predefined schema by providing a prompt. The LLM interprets the request and structures the output automatically.

```python
from firecrawl import Firecrawl

app = Firecrawl(api_key="fc-YOUR-API-KEY")

result = app.scrape(
    'https://firecrawl.dev',
    formats=[{
      "type": "json",
      "prompt": "Extract the company mission from the page."
    }],
    only_main_content=False,
    timeout=120000
)

print(result)
```

```javascript
import Firecrawl from "@mendable/firecrawl-js";

const app = new Firecrawl({
  apiKey: "fc-YOUR_API_KEY"
});

const result = await app.scrape("https://firecrawl.dev", {
  formats: [{
    type: "json",
    prompt: "Extract the company mission from the page."
  }]
});

console.log(result);
```

```bash
curl -X POST https://api.firecrawl.dev/v2/scrape \
    -H 'Content-Type: application/json' \
    -H 'Authorization: Bearer YOUR_API_KEY' \
    -d '{
      "url": "https://firecrawl.dev",
      "formats": [{
        "type": "json",
        "prompt": "Extract the company mission from the page."
      }]
    }'
```

--------------------------------

### Discover Site Content

Source: https://docs.firecrawl.dev/sdks/cli

Maps a website to find specific content based on search queries.

```bash
firecrawl map https://example.com --search "blog" -o blog-urls.txt
```

--------------------------------

### Initialize Firecrawl Client (JavaScript/TypeScript)

Source: https://docs.firecrawl.dev/migrate-to-v2

Demonstrates how to initialize the Firecrawl client in JavaScript/TypeScript for v2. This involves creating a new instance of the Firecrawl class with your API key.

```javascript
const firecrawl = new Firecrawl({ apiKey: 'fc-YOUR-API-KEY' });
```

--------------------------------

### Mapping a Website

Source: https://docs.firecrawl.dev/sdks/node

Map a website to extract its structure and links, useful for understanding site hierarchy.

```APIDOC
## Map Website

Map a website to extract its structure and links.

### Method

`POST`

### Endpoint

`/v1/map

### Parameters

#### Request Body

- **url** (string) - Required - The starting URL for the mapping.
- **limit** (integer) - Optional - The maximum number of pages to map. Defaults to 100.

### Request Example

```json
{
  "url": "https://firecrawl.dev",
  "limit": 10
}
```

### Response

#### Success Response (200)

- **links** (array) - An array of objects, where each object represents a link found on the website and its associated data.

#### Response Example

```json
{
  "links": [
    {
      "url": "https://firecrawl.dev/api",
      "title": "API Documentation",
      "description": "Details about the Firecrawl API."
    },
    {
      "url": "https://firecrawl.dev/sdk",
      "title": "SDKs",
      "description": "Information about available SDKs."
    }
  ]
}
```
```

--------------------------------

### Crawl a Website (Rust)

Source: https://docs.firecrawl.dev/sdks/rust

Crawls a given URL and waits for the process to complete. It accepts `CrawlOptions` to configure scraping and limits. The result includes data and credits used, or an error if the crawl fails.

```rust
let crawl_options = CrawlOptions {
    scrape_options: CrawlScrapeOptions {
        formats: vec![ CrawlScrapeFormats::Markdown, CrawlScrapeFormats::HTML ].into(),
        ..Default::default()
    }.into(),
    limit: 100.into(),
    ..Default::default()
};

let crawl_result = app
    .crawl_url("https://mendable.ai", crawl_options)
    .await;

match crawl_result {
    Ok(data) => println!("Crawl Result (used {} credits):\n{:#?}", data.credits_used, data.data),
    Err(e) => eprintln!("Crawl failed: {}", e),
}
```

--------------------------------

### Browser Automation Actions

Source: https://docs.firecrawl.dev/api-reference/endpoint/batch-scrape

A collection of actions that can be performed during a browser session, including navigation, interaction, and capture.

```APIDOC
## Action: Wait

### Description
Pauses execution for a specified duration or waits for a specific element to appear.

### Parameters
#### Request Body
- **type** (string) - Required - Must be 'wait'
- **milliseconds** (integer) - Optional - Number of milliseconds to wait
- **selector** (string) - Optional - CSS selector to wait for

### Request Example
{
  "type": "wait",
  "milliseconds": 500
}

---

## Action: Screenshot

### Description
Captures a screenshot of the current page state.

### Parameters
#### Request Body
- **type** (string) - Required - Must be 'screenshot'
- **fullPage** (boolean) - Optional - Capture full page or viewport
- **quality** (integer) - Optional - Quality from 1-100
- **viewport** (object) - Optional - {width: integer, height: integer}

### Request Example
{
  "type": "screenshot",
  "fullPage": true
}

---

## Action: Click

### Description
Simulates a mouse click on a specific element identified by a CSS selector.

### Parameters
#### Request Body
- **type** (string) - Required - Must be 'click'
- **selector** (string) - Required - CSS selector
- **all** (boolean) - Optional - Click all matching elements

### Request Example
{
  "type": "click",
  "selector": "#submit-button"
}

---

## Action: Write

### Description
Types text into an input field. Note: Element must be focused first.

### Parameters
#### Request Body
- **type** (string) - Required - Must be 'write'
- **text** (string) - Required - The text to type

### Request Example
{
  "type": "write",
  "text": "Hello, world!"
}

---

## Action: Press

### Description
Simulates a keyboard key press.

### Parameters
#### Request Body
- **type** (string) - Required - Must be 'press'
- **key** (string) - Required - The key to press (e.g., 'Enter')

### Request Example
{
  "type": "press",
  "key": "Enter"
}
```

--------------------------------

### POST /browser/execute

Source: https://docs.firecrawl.dev/sdks/cli

Executes Python, Node.js, or agent-browser commands within an active browser session.

```APIDOC
## POST /browser/execute

### Description
Runs code or automation commands in the sandbox environment of a specific browser session.

### Method
POST

### Endpoint
/browser/execute

### Parameters
#### Request Body
- **session** (string) - Optional - The ID of the session to target.
- **python** (string) - Optional - Playwright Python code to execute.
- **node** (string) - Optional - Playwright JavaScript code to execute.
- **bash** (string) - Optional - Agent-browser command to execute.

### Request Example
{
  "session": "sess_12345",
  "python": "print(await page.title())"
}

### Response
#### Success Response (200)
- **output** (string) - The stdout/result of the executed code.

#### Response Example
{
  "output": "Example Domain"
}
```

--------------------------------

### Scrape URL content using Firecrawl Java SDK

Source: https://docs.firecrawl.dev/pt-BR/sdks/java

Demonstrates how to initialize ScrapeParams, set output formats to markdown, and execute a scrape request against a target URL. It includes comprehensive exception handling for API status codes, network issues, and Firecrawl-specific errors.

```java
import dev.firecrawl.exception.FirecrawlException;

try {
    ScrapeParams params = new ScrapeParams();
    params.setFormats(new String[]{"markdown"});
    FirecrawlDocument doc = client.scrapeURL("https://firecrawl.dev", params);
} catch (ApiException e) {
    System.err.println("API error " + e.getStatusCode() + ": " + e.getResponseBody());
} catch (FirecrawlException e) {
    System.err.println("Firecrawl error: " + e.getMessage());
} catch (IOException e) {
    System.err.println("Network error: " + e.getMessage());
}
```

--------------------------------

### Basic LangGraph Workflow: Scrape and Analyze Website

Source: https://docs.firecrawl.dev/developer-guides/llm-sdks-and-frameworks/langgraph

Demonstrates a simple LangGraph workflow that uses Firecrawl to scrape a website and OpenAI (via LangChain) to analyze the scraped content. It initializes Firecrawl and an LLM, defines scrape and analyze nodes, builds the graph, and invokes it.

```typescript
import FirecrawlApp from '@mendable/firecrawl-js';
import { ChatOpenAI } from '@langchain/openai';
import { StateGraph, MessagesAnnotation, START, END } from '@langchain/langgraph';

// Initialize Firecrawl
const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });

// Initialize LLM
const llm = new ChatOpenAI({
    model: "gpt-5-nano",
    apiKey: process.env.OPENAI_API_KEY
});

// Define the scrape node
async function scrapeNode(state: typeof MessagesAnnotation.State) {
    console.log('Scraping...');
    const result = await firecrawl.scrape('https://firecrawl.dev', { formats: ['markdown'] });
    return {
        messages: [{
            role: "system",
            content: `Scraped content: ${result.markdown}`
        }]
    };
}

// Define the analyze node
async function analyzeNode(state: typeof MessagesAnnotation.State) {
    console.log('Analyzing...');
    const response = await llm.invoke(state.messages);
    return { messages: [response] };
}

// Build the graph
const graph = new StateGraph(MessagesAnnotation)
    .addNode("scrape", scrapeNode)
    .addNode("analyze", analyzeNode)
    .addEdge(START, "scrape")
    .addEdge("scrape", "analyze")
    .addEdge("analyze", END);

// Compile the graph
const app = graph.compile();

// Run the workflow
const result = await app.invoke({
    messages: [{ role: "user", content: "Summarize the website" }]
});

console.log(JSON.stringify(result, null, 2));

```

--------------------------------

### Environment Variables for Firecrawl Self-hosting

Source: https://docs.firecrawl.dev/contributing/self-host

This snippet shows essential environment variables to configure for self-hosting Firecrawl. It includes settings for the API port, host, database authentication, AI features (OpenAI, Ollama, or other compatible APIs), proxy settings, and search engine configuration.

```env
# .env

# ===== Required ENVS ======
PORT=3002
HOST=0.0.0.0

# Note: PORT is used by both the main API server and worker liveness check endpoint

# To turn on DB authentication, you need to set up Supabase.
USE_DB_AUTHENTICATION=false

# ===== Optional ENVS ======

## === AI features (JSON format on scrape, /extract API) ===
# Provide your OpenAI API key here to enable AI features
# OPENAI_API_KEY=

# Experimental: Use Ollama
# OLLAMA_BASE_URL=http://localhost:11434/api
# MODEL_NAME=deepseek-r1:7b
# MODEL_EMBEDDING_NAME=nomic-embed-text

# Experimental: Use any OpenAI-compatible API
# OPENAI_BASE_URL=https://example.com/v1
# OPENAI_API_KEY=

## === Proxy ===
# PROXY_SERVER can be a full URL (e.g. http://0.1.2.3:1234) or just an IP and port combo (e.g. 0.1.2.3:1234)
# Do not uncomment PROXY_USERNAME and PROXY_PASSWORD if your proxy is unauthenticated
# PROXY_SERVER=
# PROXY_USERNAME=
# PROXY_PASSWORD=

## === /search API ===

# You can specify a SearXNG server with the JSON format enabled, if you'd like to use that instead of direct Google.
# You can also customize the engines and categories parameters, but the defaults should also work just fine.
# SEARXNG_ENDPOINT=http://your.searxng.server
# SEARXNG_ENGINES=
# SEARXNG_CATEGORIES=

## === Other ===

```

--------------------------------

### Initialize browser session with firecrawl_browser_create

Source: https://docs.firecrawl.dev/mcp-server

Creates a persistent browser session for advanced automation and code execution via the Chrome DevTools Protocol.

```json
{
  "name": "firecrawl_browser_create",
  "arguments": {
    "ttl": 120,
    "activityTtl": 60
  }
}
```

--------------------------------

### POST /scrape

Source: https://docs.firecrawl.dev/api-reference/endpoint/batch-scrape

Configures the output format and extraction parameters for web scraping tasks, including JSON schema definitions and change tracking tags.

```APIDOC
## POST /scrape

### Description
Defines the output formats for scraping operations. Supports 'markdown' or 'json' modes with custom schema validation and branching via tags.

### Method
POST

### Endpoint
/scrape

### Parameters
#### Request Body
- **formats** (array) - Optional - List of output formats. Can be strings like 'markdown' or objects defining 'json' extraction.
- **schema** (object) - Optional - JSON Schema definition for 'json' mode extraction.
- **prompt** (string) - Optional - Custom prompt for change tracking.
- **tag** (string) - Optional - Identifier for branching change tracking history.

### Request Example
{
  "formats": [
    "markdown",
    {
      "type": "json",
      "schema": { "type": "object", "properties": { "title": { "type": "string" } } }
    }
  ],
  "tag": "v1-branch"
}

### Response
#### Success Response (200)
- **data** (object) - The extracted content based on requested formats.

#### Response Example
{
  "data": {
    "markdown": "# Page Title",
    "json": { "title": "Page Title" }
  }
}
```

--------------------------------

### Execute Agent-Browser Commands via API/SDK (cURL)

Source: https://docs.firecrawl.dev/features/browser

Demonstrates how to execute agent-browser commands using cURL against the Firecrawl API. This requires specifying the session ID, API key, and the command with `language: "bash"` in the request body.

```bash
curl -X POST "https://api.firecrawl.dev/v2/browser/YOUR_SESSION_ID/execute" \
    -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "code": "agent-browser snapshot",
      "language": "bash"
    }'
```

--------------------------------

### POST /scrape/formats

Source: https://docs.firecrawl.dev/api-reference/endpoint/crawl-active

Defines the output format configuration for a scraping request. This endpoint accepts various format types including screenshots, JSON extraction, change tracking, and branding.

```APIDOC
## POST /scrape/formats

### Description
Configures the output format for the scraping process. Supports multiple formats simultaneously by passing an array of objects.

### Method
POST

### Endpoint
/scrape/formats

### Request Body
- **formats** (array) - Required - A list of format objects or strings. Supported types: 'screenshot', 'json', 'changeTracking', 'branding'.

#### Screenshot Configuration
- **type** (string) - Required - Must be 'screenshot'.
- **fullPage** (boolean) - Optional - Whether to capture the full page. Default: false.
- **quality** (integer) - Optional - Quality from 1 to 100.
- **viewport** (object) - Optional - Viewport dimensions (width, height).

#### JSON Configuration
- **type** (string) - Required - Must be 'json'.
- **schema** (object) - Optional - JSON Schema definition.
- **prompt** (string) - Optional - Prompt for extraction.

#### Change Tracking Configuration
- **type** (string) - Required - Must be 'changeTracking'.
- **modes** (array) - Optional - 'git-diff' or 'json'.
- **schema** (object) - Optional - Schema for JSON mode.
- **tag** (string) - Optional - Tag for tracking history.

### Request Example
{
  "formats": [
    "markdown",
    {
      "type": "json",
      "schema": { "type": "object" },
      "prompt": "Extract product names"
    }
  ]
}

### Response
#### Success Response (200)
- **status** (string) - Success status of the operation.

#### Response Example
{
  "status": "success",
  "data": { ... }
}
```

--------------------------------

### Configure Image and Ad Handling

Source: https://docs.firecrawl.dev/api-reference/endpoint/batch-scrape

Controls how images and advertisements are handled during scraping. `removeBase64Images` prevents large base64 encoded images from cluttering the output, while `blockAds` enables ad and cookie popup blocking.

```json
{
  "removeBase64Images": false,
  "blockAds": false
}
```

--------------------------------

### Execute Agent-Browser Commands via API/SDK (Python)

Source: https://docs.firecrawl.dev/features/browser

Illustrates executing agent-browser commands using the Firecrawl SDK in Python. The `browser_execute` function requires the session ID and parameters for the command code and language.

```python
result = app.browser_execute(
      session_id,
      code="agent-browser snapshot",
      language="bash",
  )
```

--------------------------------

### Create Browser Session with Profile

Source: https://docs.firecrawl.dev/features/browser

This endpoint allows you to create a new browser session, optionally persisting its state using a profile. You can specify a profile name and whether to save changes back to the profile upon session closure.

```APIDOC
## POST /v2/browser

### Description
Creates a new browser session. If a `profile` is provided, the session state can be saved and reused across multiple sessions.

### Method
POST

### Endpoint
/v2/browser

### Parameters
#### Request Body
- **ttl** (integer) - Optional - The time-to-live for the session in seconds.
- **profile** (object) - Optional - Configuration for persistent session state.
  - **name** (string) - Required - A name for the persistent profile. Sessions with the same name share storage.
  - **saveChanges** (boolean) - Optional - Defaults to `true`. When `true`, browser state is saved back to the profile on close. Set to `false` to load existing data without writing.

### Request Example
```json
{
  "ttl": 600,
  "profile": {
    "name": "my-profile",
    "saveChanges": true
  }
}
```

### Response
#### Success Response (200)
- **sessionId** (string) - The ID of the newly created browser session.
- **profile** (object) - Information about the profile used.
  - **name** (string) - The name of the profile.
  - **saveChanges** (boolean) - Whether changes are saved to the profile.

#### Response Example
```json
{
  "sessionId": "sess_abc123",
  "profile": {
    "name": "my-profile",
    "saveChanges": true
  }
}
```

#### Error Response (409 Conflict)
- **message** (string) - Indicates that another session is currently saving to the same profile.
```

--------------------------------

### List Browser Sessions

Source: https://docs.firecrawl.dev/features/browser

Retrieves a list of active or all browser sessions. Supports filtering by status and returns session metadata including IDs and live view URLs.

```javascript
import Firecrawl from '@mendable/firecrawl-js';

const firecrawl = new Firecrawl({ apiKey: "fc-YOUR-API-KEY" });

const { sessions } = await firecrawl.listBrowsers();
console.log(sessions);

// Filter by status
const { sessions: active } = await firecrawl.listBrowsers({ status: "active" });
console.log(active);
```

```python
from firecrawl import Firecrawl

app = Firecrawl(api_key="fc-YOUR-API-KEY")

response = app.list_browsers()
print(response.sessions)
```

```bash
firecrawl browser list
firecrawl browser list active
```

```curl
curl -X GET "https://api.firecrawl.dev/v2/browser" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY"

# Filter by status
curl -X GET "https://api.firecrawl.dev/v2/browser?status=active" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY"
```

--------------------------------

### Multi-Step LangGraph Workflow: Scrape Multiple URLs and Summarize

Source: https://docs.firecrawl.dev/developer-guides/llm-sdks-and-frameworks/langgraph

Illustrates a more advanced LangGraph workflow for scraping multiple URLs concurrently and then summarizing the combined content. It defines a custom state, scrape and summarize nodes, and builds a sequential graph.

```typescript
import FirecrawlApp from '@mendable/firecrawl-js';
import { ChatOpenAI } from '@langchain/openai';
import { StateGraph, Annotation, START, END } from '@langchain/langgraph';

const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });
const llm = new ChatOpenAI({ model: "gpt-5-nano", apiKey: process.env.OPENAI_API_KEY });

// Define custom state
const WorkflowState = Annotation.Root({
    urls: Annotation<string[]>(),
    scrapedData: Annotation<Array<{ url: string; content: string }>>(),
    summary: Annotation<string>()
});

// Scrape multiple URLs
async function scrapeMultiple(state: typeof WorkflowState.State) {
    const scrapedData = [];
    for (const url of state.urls) {
        const result = await firecrawl.scrape(url, { formats: ['markdown'] });
        scrapedData.push({ url, content: result.markdown || '' });
    }
    return { scrapedData };
}

// Summarize all scraped content
async function summarizeAll(state: typeof WorkflowState.State) {
    const combinedContent = state.scrapedData
        .map(item => `Content from ${item.url}:\n${item.content}`)
        .join('\n\n');

    const response = await llm.invoke([
        { role: "user", content: `Summarize these websites:\n${combinedContent}` }
    ]);

    return { summary: response.content as string };
}

// Build the workflow graph
const workflow = new StateGraph(WorkflowState)
    .addNode("scrape", scrapeMultiple)
    .addNode("summarize", summarizeAll)
    .addEdge(START, "scrape")
    .addEdge("scrape", "summarize")
    .addEdge("summarize", END);

const app = workflow.compile();

// Execute workflow
const result = await app.invoke({
    urls: ["https://firecrawl.dev", "https://firecrawl.dev/pricing"]
});

console.log(result.summary);

```

--------------------------------

### Configure Pagination Settings in Python

Source: https://docs.firecrawl.dev/sdks/python

Import the PaginationConfig class to define how crawl and batch scrape results are retrieved. This configuration allows toggling auto-pagination and setting constraints like max_pages, max_results, and max_wait_time.

```python
from firecrawl.v2.types import PaginationConfig
```

--------------------------------

### Implement Web Research Agent with Google ADK and Firecrawl

Source: https://docs.firecrawl.dev/developer-guides/llm-sdks-and-frameworks/google-adk

This Python snippet demonstrates how to initialize an AI agent using the Google Agent Development Kit (ADK) and connect it to Firecrawl via the Model Context Protocol (MCP). It configures the agent with specific instructions for web research and executes a query to retrieve information.

```python
from google.adk.agents.llm_agent import Agent
from google.adk.tools.mcp_tool.mcp_session_manager import StreamableHTTPServerParams
from google.adk.tools.mcp_tool.mcp_toolset import MCPToolset

FIRECRAWL_API_KEY = "YOUR-API-KEY"

# Create a research agent
research_agent = Agent(
    model="gemini-2.5-pro",
    name="research_agent",
    description='An AI agent that researches topics by scraping and analyzing web content',
    instruction='''You are a research assistant. When given a topic or question:
    1. Use the search tool to find relevant websites
    2. Scrape the most relevant pages for detailed information
    3. Extract structured data when needed
    4. Provide comprehensive, well-sourced answers''',
    tools=[
        MCPToolset(
            connection_params=StreamableHTTPServerParams(
                url=f"https://mcp.firecrawl.dev/{FIRECRAWL_API_KEY}/v2/mcp",
            ),
        )
    ],
)

# Use the agent
response = research_agent.run("What are the latest features in Python 3.13?")
print(response)
```

--------------------------------

### Configure Output Formats

Source: https://docs.firecrawl.dev/sdks/cli

Specifies how to request raw content or structured JSON output using the format flag.

```bash
# Raw markdown output
firecrawl https://example.com --format markdown

# JSON output with multiple formats
firecrawl https://example.com --format markdown,links
```

--------------------------------

### Mapping a Website

Source: https://docs.firecrawl.dev/sdks/java

Discovers and maps all discoverable URLs within a given website. Allows filtering by search terms and setting limits.

```APIDOC
## POST /mapURL

### Description
Maps a website by discovering all discoverable URLs starting from the given URL. Supports filtering and limits.

### Method
POST

### Endpoint
/mapURL

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **url** (string) - Required - The starting URL of the website to map.
- **mapParams** (object) - Optional - Parameters for controlling the mapping process.
  - **limit** (integer) - Optional - Maximum number of links to return.
  - **search** (string) - Optional - A search term to filter discovered links.

### Request Example
```json
{
  "url": "https://firecrawl.dev",
  "mapParams": {
    "limit": 100,
    "search": "blog"
  }
}
```

### Response
#### Success Response (200)
- **links** (array of strings) - An array of discovered URLs.

#### Response Example
```json
{
  "links": [
    "https://firecrawl.dev/blog/post1",
    "https://firecrawl.dev/about"
  ]
}
```
```

--------------------------------

### Create Browser Session

Source: https://docs.firecrawl.dev/api-reference/endpoint/browser-create

Launches a new cloud browser session in a sandboxed environment. This is useful for automated web scraping and interaction.

```APIDOC
## POST /v2/browser

### Description
Launch a new cloud browser session in a sandboxed environment.

### Method
POST

### Endpoint
https://api.firecrawl.dev/v2/browser

### Headers
- **Authorization** (string) - Required - `Bearer <API_KEY>`
- **Content-Type** (string) - Required - `application/json`

### Request Body
- **ttl** (number) - Optional - Default: 600 - Total session lifetime in seconds (30-3600).
- **activityTtl** (number) - Optional - Default: 300 - Seconds of inactivity before session is destroyed (10-3600).
- **profile** (object) - Optional - Enable persistent storage across sessions.
  - **profile.name** (string) - Required* - Name for the profile (1-128 chars). Sessions with the same name share storage.
  - **profile.saveChanges** (boolean) - Optional - Default: `true` - When `true`, browser state is saved back to the profile on close. Set to `false` to load existing data without writing. Only one saver is allowed at a time.

### Request Example
```bash
curl -X POST "https://api.firecrawl.dev/v2/browser" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{ 
    "ttl": 120 
  }'
```

### Response
#### Success Response (200)
- **success** (boolean) - Whether the session was created.
- **id** (string) - Unique session identifier.
- **cdpUrl** (string) - WebSocket URL for CDP connections.
- **liveViewUrl** (string) - URL to watch the session in real time.
- **interactiveLiveViewUrl** (string) - URL to interact with the session in real time (click, type, scroll).
- **expiresAt** (string) - When the session will expire based on TTL.

#### Response Example
```json
{
  "success": true,
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "cdpUrl": "wss://cdp-proxy.firecrawl.dev/cdp/550e8400-e29b-41d4-a716-446655440000",
  "liveViewUrl": "https://liveview.firecrawl.dev/550e8400-e29b-41d4-a716-446655440000",
  "interactiveLiveViewUrl": "https://liveview.firecrawl.dev/550e8400-e29b-41d4-a716-446655440000?interactive=true"
}
```
```

--------------------------------

### POST /v2/batch/scrape

Source: https://docs.firecrawl.dev/features/batch-scrape

Initiates a batch scrape job for a list of provided URLs. This endpoint supports both synchronous processing (waiting for results) and asynchronous processing (returning a job ID).

```APIDOC
## POST /v2/batch/scrape

### Description
Initiates a batch scrape job for a list of URLs. The service processes these URLs concurrently based on the provided configuration.

### Method
POST

### Endpoint
https://api.firecrawl.dev/v2/batch/scrape

### Parameters
#### Request Body
- **urls** (array) - Required - A list of URLs to scrape.
- **formats** (array) - Optional - The output formats requested (e.g., ["markdown", "html"]).
- **maxConcurrency** (integer) - Optional - Limits the number of simultaneous scrapes for this job.

### Request Example
{
  "urls": ["https://firecrawl.dev", "https://docs.firecrawl.dev"],
  "formats": ["markdown"]
}

### Response
#### Success Response (200)
- **success** (boolean) - Indicates if the job was successfully started.
- **id** (string) - The unique identifier for the batch job.
- **url** (string) - The endpoint to poll for status updates.

#### Response Example
{
  "success": true,
  "id": "123-456-789",
  "url": "https://api.firecrawl.dev/v2/batch/scrape/123-456-789"
}
```

--------------------------------

### Map Website URLs with Firecrawl CLI

Source: https://docs.firecrawl.dev/sdks/cli

Discovers all URLs on a given website. Provides options to filter by search query, include subdomains, manage sitemap usage, and deduplicate URLs by ignoring query parameters.

```bash
# Discover all URLs on a website
firecrawl map https://example.com

# Output as JSON
firecrawl map https://example.com --json

# Limit number of URLs
firecrawl map https://example.com --limit 500

# Filter URLs by search query
firecrawl map https://example.com --search "blog"

# Include subdomains
firecrawl map https://example.com --include-subdomains

# Control sitemap usage
firecrawl map https://example.com --sitemap include   # Use sitemap
firecrawl map https://example.com --sitemap skip      # Skip sitemap
firecrawl map https://example.com --sitemap only      # Only use sitemap

# Ignore query parameters (dedupe URLs)
firecrawl map https://example.com --ignore-query-parameters

# Wait for map to complete with timeout
firecrawl map https://example.com --wait --timeout 60

# Save to file
firecrawl map https://example.com -o urls.txt
firecrawl map https://example.com --json --pretty -o urls.json
```

--------------------------------

### Apply Pagination Limits to Batch Scrape Jobs in Python

Source: https://docs.firecrawl.dev/sdks/python

Demonstrates applying constraints to batch scrape operations while keeping auto-pagination active. This ensures the job stops once specified limits are reached.

```python
status = client.get_batch_scrape_status(
    batch_job.id,
    pagination_config=PaginationConfig(max_pages=2, max_results=100, max_wait_time=20),
)
print("batch limited:", status.status, "docs:", len(status.data), "next:", status.next)
```

--------------------------------

### POST /browser

Source: https://docs.firecrawl.dev/api-reference/endpoint/browser-create

Creates a new browser session with configurable TTL, activity timeouts, and optional persistent profiles for state management.

```APIDOC
## POST /browser

### Description
Creates a new browser session. This endpoint allows you to configure session duration, inactivity timeouts, and persistent storage profiles for complex scraping tasks.

### Method
POST

### Endpoint
/v2/browser

### Parameters
#### Request Body
- **ttl** (integer) - Optional - Total time-to-live in seconds (30-3600, default: 300).
- **activityTtl** (integer) - Optional - Time in seconds before session destruction due to inactivity (10-3600).
- **streamWebView** (boolean) - Optional - Whether to stream a live view of the browser (default: true).
- **profile** (object) - Optional - Configuration for persistent storage.
  - **name** (string) - Required - Unique name for the profile.
  - **saveChanges** (boolean) - Optional - Whether to save browser state back to the profile (default: true).

### Request Example
{
  "ttl": 600,
  "profile": {
    "name": "my-scraping-profile",
    "saveChanges": true
  }
}

### Response
#### Success Response (200)
- **success** (boolean) - Operation status.
- **id** (string) - Unique session identifier.
- **cdpUrl** (string) - WebSocket URL for Chrome DevTools Protocol access.
- **liveViewUrl** (string) - URL to view the browser session in real time.
- **interactiveLiveViewUrl** (string) - URL to interact with the browser session.
- **expiresAt** (string) - ISO 8601 timestamp of session expiration.

#### Response Example
{
  "success": true,
  "id": "sess_123456789",
  "cdpUrl": "wss://api.firecrawl.dev/v2/cdp/sess_123456789",
  "liveViewUrl": "https://api.firecrawl.dev/v2/live/sess_123456789",
  "expiresAt": "2023-10-27T10:00:00Z"
}
```

--------------------------------

### Documentation Index

Source: https://docs.firecrawl.dev/api-reference/endpoint/webhook-crawl-completed

Fetch the complete documentation index to discover all available pages.

```APIDOC
## GET /websites/firecrawl_dev/documentation/index

### Description
Fetches the complete documentation index for the Firecrawl project. This index can be used to discover all available documentation pages.

### Method
GET

### Endpoint
/websites/firecrawl_dev/documentation/index

### Parameters
#### Query Parameters
- **url** (string) - Required - The URL to fetch the documentation index from. Example: https://docs.firecrawl.dev/llms.txt

### Response
#### Success Response (200)
- **documentation_index** (string) - The content of the documentation index file.

#### Response Example
```json
{
  "documentation_index": "# Documentation Index\nFetch the complete documentation index at: https://docs.firecrawl.dev/llms.txt\nUse this file to discover all available pages before exploring further.\n\n# Crawl Completed\n\n... (rest of the documentation index content)"
}
```
```

--------------------------------

### Advanced Agent Options for Model, Credits, and Output

Source: https://docs.firecrawl.dev/sdks/cli

This showcases advanced `firecrawl agent` options, including selecting different models (`spark-1-pro` for higher accuracy), setting a maximum credit limit (`--max-credits`), and saving the output to a file (`-o` or `--output`) with pretty printing (`--pretty`). It also covers checking job status and custom polling intervals.

```bash
# Use Spark 1 Pro for higher accuracy
firecrawl agent "Competitive analysis across multiple domains" --model spark-1-pro --wait

# Set max credits to limit costs
firecrawl agent "Gather contact information from company websites" --max-credits 100 --wait

# Check status of an existing job
firecrawl agent <job-id> --status

# Custom polling interval and timeout
firecrawl agent "Summarize recent blog posts" --wait --poll-interval 10 --timeout 300

# Save output to file
firecrawl agent "Find pricing information" --urls https://example.com --wait -o pricing.json --pretty
```

--------------------------------

### Browser Session Management

Source: https://docs.firecrawl.dev/sdks/cli

Endpoints and commands for launching, listing, executing code within, and closing cloud browser sessions.

```APIDOC
## POST /browser/launch

### Description
Launches a new cloud browser session.

### Method
POST

### Endpoint
`firecrawl browser launch-session`

### Parameters
#### Query Parameters
- **ttl** (integer) - Optional - Total session TTL (30-3600s).
- **ttl-inactivity** (integer) - Optional - Auto-close after inactivity (10-3600s).
- **profile** (string) - Optional - Name for a profile to reuse state.
- **stream** (boolean) - Optional - Enable live view streaming.

### Response
#### Success Response (200)
- **session_id** (string) - Unique identifier for the session.
- **cdp_url** (string) - Chrome DevTools Protocol URL.
- **live_view_url** (string) - URL for live session monitoring.

---

## POST /browser/execute

### Description
Executes Playwright code or bash commands within a specific browser session.

### Method
POST

### Endpoint
`firecrawl browser execute <code>`

### Parameters
#### Query Parameters
- **bash** (flag) - Optional - Execute as bash command.
- **python** (flag) - Optional - Execute as Playwright Python.
- **node** (flag) - Optional - Execute as Playwright JS.
- **session** (string) - Required - Target session ID.

### Request Example
`firecrawl browser execute "await page.goto('https://example.com')" --python --session <id>`
```

--------------------------------

### Create Browser Session (firecrawl_browser_create)

Source: https://docs.firecrawl.dev/mcp-server

Create a persistent browser session for code execution via CDP (Chrome DevTools Protocol).

```APIDOC
## POST /api/browser/create

### Description
Create a persistent browser session for code execution via CDP (Chrome DevTools Protocol).

### Method
POST

### Endpoint
/api/browser/create

### Parameters
#### Request Body
- **ttl** (integer) - Optional - Total session lifetime in seconds (30-3600)
- **activityTtl** (integer) - Optional - Idle timeout in seconds (10-3600)

### Request Example
```json
{
  "ttl": 120,
  "activityTtl": 60
}
```

### Response
#### Success Response (200)
- **sessionId** (string) - The ID of the browser session
- **cdpUrl** (string) - The Chrome DevTools Protocol URL
- **liveViewUrl** (string) - The live view URL of the browser session

#### Response Example
```json
{
  "sessionId": "session-12345",
  "cdpUrl": "ws://localhost:9222/devtools/page/session-12345",
  "liveViewUrl": "http://localhost:9222/devtools/page/session-12345"
}
```
```

--------------------------------

### Execute Agent-Browser Commands

Source: https://docs.firecrawl.dev/sdks/cli

Executes commands directly for the agent-browser, such as opening URLs, taking snapshots, clicking elements, or scraping content. Commands are provided as strings.

```bash
firecrawl browser execute "open https://news.ycombinator.com"
```

```bash
firecrawl browser execute "snapshot"
```

```bash
firecrawl browser execute "click @e3"
```

```bash
firecrawl browser execute "scrape"
```

--------------------------------

### POST /v2/scrape

Source: https://docs.firecrawl.dev/introduction

Scrapes a target URL and returns the content in LLM-ready markdown format along with page metadata.

```APIDOC
## POST /v2/scrape

### Description
Scrapes the provided URL and converts the web content into clean, LLM-ready markdown. This endpoint handles JavaScript rendering and anti-bot measures automatically.

### Method
POST

### Endpoint
https://api.firecrawl.dev/v2/scrape

### Parameters
#### Request Body
- **url** (string) - Required - The URL of the website to scrape.

### Request Example
{
  "url": "https://example.com"
}

### Response
#### Success Response (200)
- **success** (boolean) - Indicates if the request was successful.
- **data** (object) - The extracted content.
  - **markdown** (string) - The scraped content in markdown format.
  - **metadata** (object) - Page metadata including title and sourceURL.

#### Response Example
{
  "success": true,
  "data": {
    "markdown": "# Example Domain\n\nThis domain is for use in illustrative examples...",
    "metadata": {
      "title": "Example Domain",
      "sourceURL": "https://example.com"
    }
  }
}
```

--------------------------------

### Implement dynamic web scraping tools for LLMs

Source: https://docs.firecrawl.dev/developer-guides/llm-sdks-and-frameworks/langchain

Configures a custom LangChain tool that allows an LLM to autonomously trigger web scraping tasks when needed to answer user queries.

```typescript
import FirecrawlApp from '@mendable/firecrawl-js';
import { ChatOpenAI } from '@langchain/openai';
import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';

const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });

const scrapeWebsiteTool = new DynamicStructuredTool({
    name: 'scrape_website',
    description: 'Scrape content from any website URL',
    schema: z.object({
        url: z.string().url().describe('The URL to scrape')
    }),
    func: async ({ url }) => {
        const result = await firecrawl.scrape(url, {
            formats: ['markdown']
        });
        return result.markdown || 'No content scraped';
    }
});

const model = new ChatOpenAI({
    model: 'gpt-5-nano',
    apiKey: process.env.OPENAI_API_KEY
}).bindTools([scrapeWebsiteTool]);

const response = await model.invoke('What is Firecrawl? Visit firecrawl.dev and tell me about it.');

console.log('Response:', response.content);
```

--------------------------------

### Search Web Content with Firecrawl

Source: https://docs.firecrawl.dev/developer-guides/llm-sdks-and-frameworks/vercel-ai-sdk

Shows how to utilize the `search` tool from the Firecrawl SDK to perform a web search and summarize the findings within an AI application.

```typescript
import { generateText } from 'ai';
import { search } from 'firecrawl-aisdk';

const { text } = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Search for Firecrawl and summarize what you find',
  tools: { search },
});
```

--------------------------------

### Select Proxy Type

Source: https://docs.firecrawl.dev/api-reference/endpoint/batch-scrape

Specifies the type of proxy to use for requests. Options include 'basic' for sites with minimal anti-bot measures, 'enhanced' for more robust protection (at a higher cost), and 'auto' to let the system decide.

```json
{
  "proxy": "enhanced"
}
```

--------------------------------

### Execute Agent Tasks with URLs

Source: https://docs.firecrawl.dev/features/agent

Initiate an agent task by providing a list of target URLs and a prompt. This allows the agent to focus its research or extraction capabilities on specific web pages.

```python
from firecrawl import Firecrawl

app = Firecrawl(api_key="fc-YOUR_API_KEY")

result = app.agent(
    urls=["https://docs.firecrawl.dev", "https://firecrawl.dev/pricing"],
    prompt="Compare the features and pricing information from these pages"
)

print(result.data)
```

```javascript
import Firecrawl from '@mendable/firecrawl-js';

const firecrawl = new Firecrawl({ apiKey: "fc-YOUR_API_KEY" });

const result = await firecrawl.agent({
  urls: ["https://docs.firecrawl.dev", "https://firecrawl.dev/pricing"],
  prompt: "Compare the features and pricing information from these pages"
});

console.log(result.data);
```

```bash
curl -X POST "https://api.firecrawl.dev/v2/agent" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "urls": [
      "https://docs.firecrawl.dev",
      "https://firecrawl.dev/pricing"
    ],
    "prompt": "Compare the features and pricing information from these pages"
  }'
```

--------------------------------

### Manual Pagination Control for Crawl and Batch Scrape

Source: https://docs.firecrawl.dev/sdks/node

Demonstrates how to disable auto-pagination to fetch data page-by-page or apply limits to automated jobs. This approach provides granular control over memory and execution time for large-scale scraping tasks.

```javascript
const crawlStart = await firecrawl.startCrawl('https://docs.firecrawl.dev', { limit: 5 });
const crawlJobId = crawlStart.id;

const crawlSingle = await firecrawl.getCrawlStatus(crawlJobId, { autoPaginate: false });
console.log('crawl single page:', crawlSingle.status, 'docs:', crawlSingle.data.length, 'next:', crawlSingle.next);

const crawlLimited = await firecrawl.getCrawlStatus(crawlJobId, {
  autoPaginate: true,
  maxPages: 2,
  maxResults: 50,
  maxWaitTime: 15,
});
console.log('crawl limited:', crawlLimited.status, 'docs:', crawlLimited.data.length, 'next:', crawlLimited.next);

const batchStart = await firecrawl.startBatchScrape([
  'https://docs.firecrawl.dev',
  'https://firecrawl.dev',
], { options: { formats: ['markdown'] } });
const batchJobId = batchStart.id;

const batchSingle = await firecrawl.getBatchScrapeStatus(batchJobId, { autoPaginate: false });
console.log('batch single page:', batchSingle.status, 'docs:', batchSingle.data.length, 'next:', batchSingle.next);

const batchLimited = await firecrawl.getBatchScrapeStatus(batchJobId, {
  autoPaginate: true,
  maxPages: 2,
  maxResults: 100,
  maxWaitTime: 20,
});
console.log('batch limited:', batchLimited.status, 'docs:', batchLimited.data.length, 'next:', batchLimited.next);
```

--------------------------------

### POST /v2/batch/scrape

Source: https://docs.firecrawl.dev/features/batch-scrape

Initiates a batch scrape job with webhook notifications enabled to receive real-time updates for each URL processed.

```APIDOC
## POST /v2/batch/scrape

### Description
Initiates a batch scraping job. By providing a webhook configuration, the API will send real-time notifications to your specified endpoint as events occur.

### Method
POST

### Endpoint
https://api.firecrawl.dev/v2/batch/scrape

### Parameters
#### Request Body
- **urls** (array) - Required - List of URLs to scrape.
- **webhook** (object) - Optional - Configuration for webhook notifications.
  - **url** (string) - Required - The destination URL for notifications.
  - **metadata** (object) - Optional - Custom key-value pairs to include in the payload.
  - **events** (array) - Optional - List of events to subscribe to (e.g., "started", "page", "completed").

### Request Example
{
  "urls": ["https://example.com/page1"],
  "webhook": {
    "url": "https://your-domain.com/webhook",
    "metadata": { "user_id": "123" },
    "events": ["started", "page", "completed"]
  }
}

### Response
#### Success Response (200)
- **success** (boolean) - Indicates if the request was accepted.
- **id** (string) - The unique identifier for the batch job.

### Response Example
{
  "success": true,
  "id": "batch-job-id"
}
```

--------------------------------

### Implement OpenAI Function Calling for Web Scraping

Source: https://docs.firecrawl.dev/developer-guides/llm-sdks-and-frameworks/openai

Shows how to define a tool for OpenAI that allows the model to trigger a Firecrawl scrape operation dynamically based on user input.

```typescript
import FirecrawlApp from '@mendable/firecrawl-js';
import OpenAI from 'openai';
import { z } from 'zod';

const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const ScrapeArgsSchema = z.object({
    url: z.string().describe('The URL of the website to scrape')
});

const tools = [{
    type: 'function' as const,
    function: {
        name: 'scrape_website',
        description: 'Scrape content from any website URL',
        parameters: z.toJSONSchema(ScrapeArgsSchema)
    }
}];

const response = await openai.chat.completions.create({
    model: 'gpt-5-nano',
    messages: [{ role: 'user', content: 'What is Firecrawl? Visit firecrawl.dev and tell me about it.' }],
    tools
});

const message = response.choices[0]?.message;
if (message?.tool_calls) {
    // Logic to parse arguments, call firecrawl.scrape, and return final response
}
```

--------------------------------

### Run Firecrawl MCP with Streamable HTTP

Source: https://docs.firecrawl.dev/mcp-server

Command to launch the Firecrawl MCP server using streamable HTTP transport instead of the default stdio transport. This is useful for specific integration requirements.

```bash
env HTTP_STREAMABLE_SERVER=true FIRECRAWL_API_KEY=fc-YOUR_API_KEY npx -y firecrawl-mcp
```

--------------------------------

### Extract Data with Prompt and Schema (Python, Node.js, cURL)

Source: https://docs.firecrawl.dev/features/extract

Extract structured data using a prompt without requiring specific URLs, ideal for research or when exact URLs are unknown. This feature is currently in Alpha and requires defining a schema for the expected output. Initialization requires an API key.

```python
from pydantic import BaseModel

class ExtractSchema(BaseModel):
    company_mission: str


# Define the prompt for extraction
prompt = 'Extract the company mission from Firecrawl\'s website.'

# Perform the extraction
scrape_result = firecrawl.extract(prompt=prompt, schema=ExtractSchema)

print(scrape_result)
```

```javascript
import { z } from "zod";

// Define schema to extract contents into
const schema = z.object({
  company_mission: z.string(),
});

const scrapeResult = await firecrawl.extract([], {
  prompt: "Extract the company mission from Firecrawl's website.",
  schema: schema
});

console.log(scrapeResult);
```

```bash
curl -X POST https://api.firecrawl.dev/v2/extract \
    -H 'Content-Type: application/json' \
    -H 'Authorization: Bearer YOUR_API_KEY' \
    -d '{
        "urls": [],
        "prompt": "Extract the company mission from the Firecrawl's website.",
        "schema": {
          "type": "object",
          "properties": {
            "company_mission": {
              "type": "string"
            }
          },
          "required": ["company_mission"]
        }
      }'
```

--------------------------------

### Migrate from /extract to /agent in Python

Source: https://docs.firecrawl.dev/developer-guides/usage-guides/choosing-the-data-extractor

Demonstrates the code change required to migrate from the /extract endpoint to the /agent endpoint. The /agent endpoint allows for more flexibility by optionally omitting URLs and specifying a model.

```python
app.extract(
    urls=["https://example.com/*"],
    prompt="Extract product information",
    schema=schema
)
```

```python
app.agent(
    urls=["https://example.com"],  # Optional - can omit entirely
    prompt="Extract product information from example.com",
    schema=schema,
    model="spark-1-mini"  # or "spark-1-pro" for higher accuracy
)
```

--------------------------------

### POST /v2/browser/{id}/execute

Source: https://docs.firecrawl.dev/introduction

Executes custom code within an active browser session.

```APIDOC
## POST /v2/browser/{id}/execute

### Description
Runs provided code snippets inside the specified browser session.

### Method
POST

### Endpoint
https://api.firecrawl.dev/v2/browser/{id}/execute

### Parameters
#### Path Parameters
- **id** (string) - Required - The session ID returned from the launch endpoint

#### Request Body
- **code** (string) - Required - The script to execute in the browser

### Request Example
{
  "code": "await page.goto(\"https://news.ycombinator.com\"); const title = await page.title(); console.log(title);"
}

### Response
#### Success Response (200)
- **result** (string) - The output or result of the executed code
```

--------------------------------

### Execute JavaScript Action

Source: https://docs.firecrawl.dev/api-reference/endpoint/scrape

Executes arbitrary JavaScript code on the page.

```APIDOC
## POST /websites/firecrawl_dev/actions

### Description
Executes arbitrary JavaScript code on the page.

### Method
POST

### Endpoint
/websites/firecrawl_dev/actions

### Parameters
#### Request Body
- **type** (string) - Required - Must be 'executeJavascript'.
- **script** (string) - Required - The JavaScript code to execute.

### Request Example
```json
{
  "actions": [
    {
      "type": "executeJavascript",
      "script": "document.querySelector('.my-button').click();"
    }
  ]
}
```

### Response
#### Success Response (200)
- **pdfs** (array) - Array of generated PDF objects.
- **actions** (object) - Object containing results of performed actions.

#### Response Example
```json
{
  "pdfs": [],
  "actions": {
    "executeJavascript": [
      {
        "script": "document.querySelector('.my-button').click();"
      }
    ]
  }
}
```
```

--------------------------------

### Batch Scrape with Change Tracking

Source: https://docs.firecrawl.dev/features/change-tracking

Explains how to perform a batch scrape of multiple URLs while enabling change tracking, including options like 'git-diff' mode.

```APIDOC
## POST /v2/batch/scrape

### Description
Scrapes a list of URLs in a single request, allowing for batch processing and applying common options like change tracking.

### Method
POST

### Endpoint
/v2/batch/scrape

### Parameters
#### Request Body
- **urls** (array of strings) - Required - A list of URLs to scrape.
- **formats** (array) - Optional - An array of formats to return for each scraped URL. Can include 'markdown' and change tracking options.
  - **type** (string) - Required - Must be 'changeTracking'.
  - **modes** (array of strings) - Optional - Specifies modes for change tracking, e.g., ['git-diff'].

### Request Example
```json
{
  "urls": [
    "https://example.com/pricing",
    "https://example.com/product/widget",
    "https://example.com/blog/latest"
  ],
  "formats": [
    "markdown",
    { "type": "changeTracking", "modes": ["git-diff"] }
  ]
}
```

### Response
#### Success Response (200)
Returns results for each URL scraped, including content and change tracking information.
```json
{
  "results": [
    {
      "url": "https://example.com/pricing",
      "changeTracking": {
        "changeStatus": "changed",
        "diff": "...git-diff output..."
      },
      "markdown": "Pricing page content..."
    },
    {
      "url": "https://example.com/product/widget",
      "changeTracking": {
        "changeStatus": "no change"
      },
      "markdown": "Widget page content..."
    }
  ]
}
```
```

--------------------------------

### Batch Scrape URLs via SDK and API

Source: https://docs.firecrawl.dev/features/scrape

Initiate a batch scrape job for multiple URLs. Supports synchronous execution for immediate results or asynchronous execution returning a job ID for status tracking.

```python
from firecrawl import Firecrawl

firecrawl = Firecrawl(api_key="fc-YOUR-API-KEY")

job = firecrawl.batch_scrape([
    "https://firecrawl.dev",
    "https://docs.firecrawl.dev",
], formats=["markdown"], poll_interval=2, wait_timeout=120)

print(job)
```

```javascript
import Firecrawl from '@mendable/firecrawl-js';

const firecrawl = new Firecrawl({ apiKey: "fc-YOUR-API-KEY" });

const job = await firecrawl.batchScrape([
  'https://firecrawl.dev',
  'https://docs.firecrawl.dev',
], { options: { formats: ['markdown'] }, pollInterval: 2, timeout: 120 });

console.log(job);
```

```bash
curl -s -X POST "https://api.firecrawl.dev/v2/batch/scrape" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "urls": ["https://firecrawl.dev", "https://docs.firecrawl.dev"],
    "formats": ["markdown"]
  }'
```

--------------------------------

### Browser Sandbox - List & Close Sessions

Source: https://docs.firecrawl.dev/sdks/java

Manages browser sessions by listing active sessions and closing specific ones.

```APIDOC
## Browser Sandbox - List & Close Sessions

### Description
Allows you to view all currently active browser sessions and to terminate specific sessions.

### Method
GET (List Sessions), DELETE (Close Session)

### Endpoint
GET /v2/browser
DELETE /v2/browser

### Parameters
#### Query Parameters (for GET /v2/browser)
- **status** (string) - Optional - Filter sessions by status (e.g., `active`).

#### Request Body (for DELETE /v2/browser)
- **id** (string) - Required - The ID of the session to close.

### Request Example
```java
// List active sessions
HttpRequest list = HttpRequest.newBuilder()
    .uri(URI.create("https://api.firecrawl.dev/v2/browser?status=active"))
    .header("Authorization", "Bearer " + System.getenv("FIRECRAWL_API_KEY"))
    .GET()
    .build();

HttpResponse<String> listResponse = http.send(list, HttpResponse.BodyHandlers.ofString());
System.out.println(listResponse.body());

// Close a session
String sessionId = "YOUR_SESSION_ID";
HttpRequest close = HttpRequest.newBuilder()
    .uri(URI.create("https://api.firecrawl.dev/v2/browser"))
    .header("Authorization", "Bearer " + System.getenv("FIRECRAWL_API_KEY"))
    .header("Content-Type", "application/json")
    .method("DELETE", HttpRequest.BodyPublishers.ofString("{\"id\":\"" + sessionId + "\"}"))
    .build();

HttpResponse<String> closeResponse = http.send(close, HttpResponse.BodyHandlers.ofString());
System.out.println(closeResponse.body());
```

### Response
#### Success Response (200 - List)
- **sessions** (array) - A list of active browser sessions.
  - Each element is an object with session details (e.g., `sessionId`, `status`).

#### Success Response (200 - Close)
- **message** (string) - Confirmation message indicating the session was closed.

#### Response Example (List)
```json
{
  "sessions": [
    {
      "sessionId": "sess_abc123",
      "status": "active",
      "createdAt": "2023-10-27T10:00:00Z"
    }
  ]
}
```

#### Response Example (Close)
```json
{
  "message": "Session sess_abc123 closed successfully."
}
```
```

--------------------------------

### Generate PDF Action

Source: https://docs.firecrawl.dev/api-reference/endpoint/scrape

Generates a PDF of the current page with specified format and orientation.

```APIDOC
## POST /websites/firecrawl_dev/actions

### Description
Generates a PDF of the current page with specified format and orientation. The PDF will be returned in the `actions.pdfs` array of the response.

### Method
POST

### Endpoint
/websites/firecrawl_dev/actions

### Parameters
#### Request Body
- **type** (string) - Required - Must be 'pdf'.
- **format** (string) - Optional - The page size of the resulting PDF (e.g., 'A4', 'Letter'). Defaults to 'Letter'.
- **landscape** (boolean) - Optional - Whether the PDF should be in landscape orientation.

### Request Example
```json
{
  "actions": [
    {
      "type": "pdf",
      "format": "A4",
      "landscape": true
    }
  ]
}
```

### Response
#### Success Response (200)
- **pdfs** (array) - Array of generated PDF objects, each containing the PDF content.
- **actions** (object) - Object containing results of performed actions.

#### Response Example
```json
{
  "pdfs": [
    {
      "filename": "page.pdf",
      "content": "JVBERi0xLjQKJc..."
    }
  ],
  "actions": {
    "pdf": [
      {
        "format": "A4",
        "landscape": true
      }
    ]
  }
}
```
```

--------------------------------

### System Configuration Defaults (TypeScript)

Source: https://docs.firecrawl.dev/mcp-server

Defines default configuration settings for the Firecrawl server, including retry parameters for API requests and thresholds for credit usage warnings and alerts. These settings control the behavior of automatic retries and monitoring of API credit consumption.

```typescript
const CONFIG = {
  retry: {
    maxAttempts: 3, // Number of retry attempts for rate-limited requests
    initialDelay: 1000, // Initial delay before first retry (in milliseconds)
    maxDelay: 10000, // Maximum delay between retries (in milliseconds)
    backoffFactor: 2, // Multiplier for exponential backoff
  },
  credit: {
    warningThreshold: 1000, // Warn when credit usage reaches this level
    criticalThreshold: 100, // Critical alert when credit usage reaches this level
  },
};

```

--------------------------------

### Configure Base URL and Authentication

Source: https://docs.firecrawl.dev/api-reference/v2-introduction

Sets the base API endpoint and demonstrates the required Authorization header format for all API requests.

```bash
https://api.firecrawl.dev
```

```bash
Authorization: Bearer fc-YOUR-API-KEY
```

--------------------------------

### Implement Change Tracking with Firecrawl

Source: https://docs.firecrawl.dev/features/change-tracking

Demonstrates how to enable change tracking during a scrape request. This requires including 'markdown' and 'changeTracking' in the formats array to allow the system to compare content versions.

```python
from firecrawl import Firecrawl

firecrawl = Firecrawl(api_key="fc-YOUR-API-KEY")

result = firecrawl.scrape(
    "https://example.com/pricing",
    formats=["markdown", "changeTracking"]
)

print(result.changeTracking)
```

```javascript
import Firecrawl from '@mendable/firecrawl-js';

const firecrawl = new Firecrawl({ apiKey: "fc-YOUR-API-KEY" });

const result = await firecrawl.scrape('https://example.com/pricing', {
  formats: ['markdown', 'changeTracking']
});

console.log(result.changeTracking);
```

```bash
curl -s -X POST "https://api.firecrawl.dev/v2/scrape" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/pricing",
    "formats": ["markdown", "changeTracking"]
  }'
```

--------------------------------

### Configure Firecrawl MCP in IDEs

Source: https://docs.firecrawl.dev/mcp-server

JSON configuration structures for integrating the Firecrawl MCP server into IDEs like Cursor and Windsurf. These configurations define the command, arguments, and environment variables required for the server to run.

```json
{
  "mcpServers": {
    "firecrawl-mcp": {
      "command": "npx",
      "args": ["-y", "firecrawl-mcp"],
      "env": {
        "FIRECRAWL_API_KEY": "YOUR-API-KEY"
      }
    }
  }
}
```

```json
{
  "mcpServers": {
    "mcp-server-firecrawl": {
      "command": "npx",
      "args": ["-y", "firecrawl-mcp"],
      "env": {
        "FIRECRAWL_API_KEY": "YOUR_API_KEY"
      }
    }
  }
}
```

--------------------------------

### Browser Actions API

Source: https://docs.firecrawl.dev/api-reference/endpoint/extract

A collection of browser automation actions that can be performed during a scraping session.

```APIDOC
## Browser Actions Configuration

### Description
These actions are used within the `actions` array to automate browser interactions during a crawl or scrape task.

### Available Actions

#### 1. Screenshot
- **type**: `screenshot`
- **fullPage** (boolean) - Optional - Capture full page (default: false)
- **quality** (integer) - Optional - 1-100 quality scale
- **viewport** (object) - Optional - {width: integer, height: integer}

#### 2. Click
- **type**: `click`
- **selector** (string) - Required - CSS selector to click
- **all** (boolean) - Optional - Click all matches (default: false)

#### 3. Write Text
- **type**: `write`
- **text** (string) - Required - Text to input into focused element

#### 4. Press Key
- **type**: `press`
- **key** (string) - Required - Key to press (e.g., 'Enter')

#### 5. Scroll
- **type**: `scroll`
- **direction** (enum) - Optional - 'up' or 'down' (default: 'down')
- **selector** (string) - Optional - Element to scroll

#### 6. Scrape
- **type**: `scrape` - Returns current page URL and HTML

#### 7. Execute JavaScript
- **type**: `executeJavascript`
- **script** (string) - Required - JS code to run on page

### Request Example
{
  "actions": [
    { "type": "click", "selector": "#login-button" },
    { "type": "write", "text": "my-username" },
    { "type": "press", "key": "Enter" }
  ]
}
```

--------------------------------

### Searching the Web

Source: https://docs.firecrawl.dev/sdks/java

Performs a web search with a given query. Optionally scrapes the content of the search results.

```APIDOC
## POST /search

### Description
Searches the web for a given query and optionally scrapes the content of the search results.

### Method
POST

### Endpoint
/search

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **searchParams** (object) - Required - Parameters for the search query.
  - **query** (string) - Required - The search query string.
  - **limit** (integer) - Optional - Maximum number of search results to return.
  - **scrape** (boolean) - Optional - Whether to scrape the content of the search results (defaults to false).
  - **scrapeOptions** (object) - Optional - Options for scraping if `scrape` is true.
    - **formats** (array of strings) - Optional - Desired output formats (e.g., "markdown").

### Request Example
```json
{
  "searchParams": {
    "query": "firecrawl web scraping",
    "limit": 10,
    "scrape": true,
    "scrapeOptions": {
      "formats": ["markdown"]
    }
  }
}
```

### Response
#### Success Response (200)
- **results** (array of SearchResult) - An array of search results.
  - **title** (string) - The title of the search result.
  - **url** (string) - The URL of the search result.
  - **content** (string) - The scraped content of the search result, if `scrape` was true.

#### Response Example
```json
{
  "results": [
    {
      "title": "Firecrawl - Web Scraping Made Easy",
      "url": "https://firecrawl.dev",
      "content": "# Firecrawl\nFirecrawl is a powerful tool for web scraping..."
    }
  ]
}
```
```

--------------------------------

### Crawl Website (Synchronous)

Source: https://docs.firecrawl.dev/sdks/rust

This endpoint allows you to crawl a website synchronously. The method waits for the crawl to complete, which can take time depending on the URL and options. It returns the crawl results and credits used.

```APIDOC
## POST /crawl_url

### Description
Crawls a website synchronously and returns the results upon completion.

### Method
POST

### Endpoint
/crawl_url

### Parameters
#### Query Parameters
- **url** (string) - Required - The starting URL to crawl.
- **crawl_options** (object) - Optional - Options for the crawl, including scrape options, format, and limits.

### Request Body
```json
{
  "url": "https://mendable.ai",
  "crawl_options": {
    "scrape_options": {
      "formats": ["Markdown", "HTML"]
    },
    "limit": 100
  }
}
```

### Response
#### Success Response (200)
- **credits_used** (integer) - The number of credits used for the crawl.
- **data** (object) - The crawled data.

#### Response Example
```json
{
  "credits_used": 10,
  "data": { ... }
}
```
```

--------------------------------

### Integrate with External Tools

Source: https://docs.firecrawl.dev/sdks/cli

Demonstrates piping Firecrawl output into tools like jq or wc for data processing.

```bash
# Extract URLs from search results
jq -r '.data.web[].url' search-results.json

# Get titles from search results
jq -r '.data.web[] | "\(.title): \(.url)"' search-results.json

# Extract links and process with jq
firecrawl https://example.com --format links | jq '.links[].url'

# Count URLs from map
firecrawl map https://example.com | wc -l
```

--------------------------------

### Configure Environment Variables for Firecrawl and OpenAI

Source: https://docs.firecrawl.dev/developer-guides/llm-sdks-and-frameworks/mastra

Sets up the required API keys in a .env file for Firecrawl and OpenAI. This is crucial for authentication and service access.

```bash
FIRECRAWL_API_KEY=your_firecrawl_key
OPENAI_API_KEY=your_openai_key
```

--------------------------------

### Webpage Actions API

Source: https://docs.firecrawl.dev/api-reference/endpoint/search

This section details the various actions that can be performed on a webpage before content is scraped. These actions are defined in an array and can include waiting, taking screenshots, clicking elements, writing text, and pressing keys.

```APIDOC
## Actions on Webpage

### Description
Defines a list of actions to perform on a webpage before scraping content. These actions allow for dynamic interaction with web elements.

### Method
N/A (Configuration for scraping actions)

### Endpoint
N/A (Configuration for scraping actions)

### Parameters
#### Request Body
- **actions** (array) - Required - An array of actions to perform on the page.
  - **items** (oneOf) - Defines the possible action types.
    - **Wait by Duration**
      - **type** (string) - Required - Must be 'wait'.
      - **milliseconds** (integer) - Required - Number of milliseconds to wait.
    - **Wait for Element**
      - **type** (string) - Required - Must be 'wait'.
      - **selector** (string) - Required - CSS selector to wait for.
    - **Screenshot**
      - **type** (string) - Required - Must be 'screenshot'.
      - **fullPage** (boolean) - Optional - Whether to capture a full-page screenshot. Defaults to false.
      - **quality** (integer) - Optional - The quality of the screenshot (1-100).
      - **viewport** (object) - Optional - Viewport dimensions.
        - **width** (integer) - Required - Viewport width in pixels.
        - **height** (integer) - Required - Viewport height in pixels.
    - **Click**
      - **type** (string) - Required - Must be 'click'.
      - **selector** (string) - Required - CSS selector to find the element.
      - **all** (boolean) - Optional - Clicks all elements matched by the selector. Defaults to false.
    - **Write text**
      - **type** (string) - Required - Must be 'write'.
      - **text** (string) - Required - Text to type into the element.
    - **Press a key**
      - **type** (string) - Required - Must be 'press'.
      - **key** (string) - Required - Key code to press.

### Request Example
```json
{
  "actions": [
    {
      "type": "wait",
      "milliseconds": 2000
    },
    {
      "type": "screenshot",
      "fullPage": true,
      "quality": 80
    },
    {
      "type": "click",
      "selector": "#submit-button"
    },
    {
      "type": "write",
      "selector": "#username",
      "text": "testuser"
    },
    {
      "type": "press",
      "key": "Enter"
    }
  ]
}
```

### Response
#### Success Response (200)
- **screenshots** (array) - Contains information about captured screenshots if the 'screenshot' action was used.
  - **url** (string) - URL of the captured screenshot.

#### Response Example
```json
{
  "screenshots": [
    {
      "url": "https://example.com/screenshots/screenshot1.png"
    }
  ]
}
```
```

--------------------------------

### Define Write Text Action Schema

Source: https://docs.firecrawl.dev/api-reference/endpoint/crawl-active

Defines the structure for inputting text into form fields. Requires the target element to be focused first, simulating human typing behavior.

```json
{
  "type": "write",
  "text": "Hello, world!"
}
```

--------------------------------

### Configure Firecrawl CLI for Self-Hosted Instances

Source: https://docs.firecrawl.dev/sdks/cli

Configures the Firecrawl CLI to use a self-hosted or local Firecrawl instance. This bypasses the need for an API key and allows for local development.

```bash
# Use a local Firecrawl instance (no API key required)
firecrawl --api-url http://localhost:3002 scrape https://example.com

# Or set via environment variable
export FIRECRAWL_API_URL=http://localhost:3002
firecrawl scrape https://example.com

# Configure and persist the custom API URL
firecrawl config --api-url http://localhost:3002
```

--------------------------------

### Change Tracking Configuration Options

Source: https://docs.firecrawl.dev/features/change-tracking

This section outlines the parameters available for the `changeTracking` format object, detailing their types, default values, and purpose.

```APIDOC
## GET /websites/firecrawl_dev (Hypothetical Endpoint for Configuration)

### Description
This documentation describes the configuration options for the `changeTracking` feature. It details the parameters, their types, default values, and descriptions for enabling and customizing change detection during web scraping.

### Method
GET (Hypothetical - Configuration is typically part of a request object)

### Endpoint
/websites/firecrawl_dev

### Parameters
#### Query Parameters
- **changeTracking** (object) - Required - An object containing configuration for change tracking.
  - **type** (string) - Required - Must be set to `"changeTracking"`.
  - **modes** (string[]) - Optional - An array of diff modes to enable. Possible values: `"git-diff"`, `"json"`, or both.
  - **schema** (object) - Optional - A JSON Schema object used for field-level comparison. Required when `"json"` mode is enabled.
  - **prompt** (string) - Optional - A custom prompt to guide the LLM extraction process. Used with `"json"` mode.
  - **tag** (string) - Optional - An identifier to separate tracking history. Defaults to `null`.

### Request Example
```json
{
  "type": "changeTracking",
  "modes": ["git-diff", "json"],
  "schema": { ... },
  "prompt": "Extract the main article content and its publication date.",
  "tag": "article-v1"
}
```

### Response
#### Success Response (200)
- **changeTrackingResult** (object) - Contains the results of the change tracking comparison.
  - **previousScrapeAt** (string | null) - Timestamp of the previous scrape.
  - **changeStatus** (string) - Status of the change: `"new"`, `"same"`, `"changed"`, or `"removed"`.
  - **visibility** (string) - Visibility status: `"visible"` or `"hidden"`.
  - **diff** (object) - Detailed differences (text or JSON).
  - **json** (object) - Field-level JSON comparison results.

#### Response Example
```json
{
  "previousScrapeAt": "2023-10-27T10:00:00Z",
  "changeStatus": "changed",
  "visibility": "visible",
  "diff": {
    "text": "...git-like diff output..."
  },
  "json": {
    "title": {
      "previous": "Old Title",
      "current": "New Title"
    }
  }
}
```
```

--------------------------------

### POST /v2/scrape

Source: https://docs.firecrawl.dev/migrate-to-v2

Scrapes a URL and returns the content in specified formats such as markdown, JSON, or screenshots.

```APIDOC
## POST /v2/scrape

### Description
Scrapes the provided URL and returns data based on the requested formats. Supports structured JSON extraction and full-page screenshots.

### Method
POST

### Endpoint
https://api.firecrawl.dev/v2/scrape

### Request Body
- **url** (string) - Required - The URL to scrape.
- **formats** (array) - Optional - List of formats to return (e.g., "markdown", "json", "screenshot").

### Request Example
{
  "url": "https://docs.firecrawl.dev/",
  "formats": [{
    "type": "json",
    "prompt": "Extract the company mission from the page."
  }]
}

### Response
#### Success Response (200)
- **data** (object) - The scraped content in the requested format.

#### Response Example
{
  "data": {
    "mission": "To provide the best web scraping experience."
  }
}
```

--------------------------------

### Configure JSON extraction format

Source: https://docs.firecrawl.dev/migrate-to-v2

Demonstrates how to define a JSON extraction format with a specific prompt to extract data from a webpage. This configuration is compatible with Node.js, Python, and cURL requests.

```js
const formats = [ {
  "type": "json",
  "prompt": "Extract the company mission from the page."
}];

doc = firecrawl.scrape(url, { formats });
```

```python
formats = [ { "type": "json", "prompt": "Extract the company mission from the page." } ];

doc = firecrawl.scrape(url, formats=formats);
```

```bash
curl -X POST https://api.firecrawl.dev/v2/scrape \
    -H 'Content-Type: application/json' \
    -H 'Authorization: Bearer YOUR_API_KEY' \
    -d '{
      "url": "https://docs.firecrawl.dev/",
      "formats": [{
        "type": "json",
        "prompt": "Extract the company mission from the page."
      }]
    }'
```

--------------------------------

### Website Crawl API

Source: https://docs.firecrawl.dev/sdks/cli

Commands to initiate website crawls and check the status of existing crawl jobs.

```APIDOC
## POST /crawl

### Description
Starts a new crawl job for a specified URL.

### Method
POST

### Endpoint
`firecrawl crawl <url>`

### Parameters
#### Path Parameters
- **url** (string) - Required - The starting URL for the crawl.

#### Query Parameters
- **limit** (integer) - Optional - Max pages to crawl.
- **max-depth** (integer) - Optional - Maximum crawl depth.
- **wait** (flag) - Optional - Wait for completion.

### Response
#### Success Response (200)
- **job_id** (string) - The unique identifier for the crawl job.

---

## GET /crawl/{job-id}

### Description
Retrieves the status of a crawl job using its job ID.

### Method
GET

### Endpoint
`firecrawl crawl <job-id>`

### Parameters
#### Path Parameters
- **job-id** (string) - Required - The ID of the crawl job.
```

--------------------------------

### Implement Firecrawl Web Scraping and Search Tools

Source: https://docs.firecrawl.dev/developer-guides/cookbooks/ai-research-assistant-cookbook

Defines custom tools for web scraping and searching using the Firecrawl SDK. These tools are designed to be used within an AI agent workflow to provide real-time web data.

```typescript
import FirecrawlApp from "@mendable/firecrawl-js";
import { tool } from "ai";
import { z } from "zod";

const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });

export const scrapeWebsiteTool = tool({
  description: 'Scrape content from any website URL',
  inputSchema: z.object({
    url: z.string().url().describe('The URL to scrape')
  }),
  execute: async ({ url }) => {
    const result = await firecrawl.scrape(url, {
      formats: ['markdown'],
      onlyMainContent: true,
      timeout: 30000
    });
    return { content: result.markdown };
  }
});

export const searchWebTool = tool({
  description: 'Search the web using Firecrawl',
  inputSchema: z.object({
    query: z.string().describe('The search query'),
    limit: z.number().optional(),
  }),
  execute: async ({ query, limit }) => {
    return await firecrawl.search(query, { limit });
  }
});
```

--------------------------------

### POST /v2/scrape (with prompt)

Source: https://docs.firecrawl.dev/features/scrape

This endpoint allows for data extraction using a natural language prompt. The LLM determines the structure of the output based on the prompt's instructions.

```APIDOC
## POST /v2/scrape (with prompt)

### Description
Used to extract data from scraped pages by providing a natural language prompt. The LLM infers the data structure based on the prompt.

### Method
POST

### Endpoint
https://api.firecrawl.dev/v2/scrape

### Parameters
#### Request Body
- **url** (string) - Required - The URL of the web page to scrape.
- **formats** (array) - Required - An array of format objects. Each object should have:
  - **type** (string) - Required - The format type, should be 'json'.
  - **prompt** (string) - Required - A natural language prompt instructing what data to extract.
- **only_main_content** (boolean) - Optional - If true, only the main content of the page will be scraped.
- **timeout** (integer) - Optional - The timeout in milliseconds for the scraping process.

### Request Example
```json
{
  "url": "https://firecrawl.dev",
  "formats": [
    {
      "type": "json",
      "prompt": "Extract the company mission from the page."
    }
  ]
}
```

### Response
#### Success Response (200)
- **success** (boolean) - Indicates if the operation was successful.
- **data** (object) - Contains the extracted data.
  - **json** (object) - The extracted data based on the prompt.
  - **metadata** (object) - Metadata about the scraped page (title, description, etc.).

#### Response Example
```json
{
    "success": true,
    "data": {
      "json": {
        "company_mission": "AI-powered web scraping and data extraction"
      },
      "metadata": {
        "title": "Firecrawl",
        "description": "AI-powered web scraping and data extraction",
        "robots": "follow, index",
        "ogTitle": "Firecrawl",
        "ogDescription": "AI-powered web scraping and data extraction",
        "ogUrl": "https://firecrawl.dev/",
        "ogImage": "https://firecrawl.dev/og.png",
        "ogLocaleAlternate": [],
        "ogSiteName": "Firecrawl",
        "sourceURL": "https://firecrawl.dev/"
      }
    }
}
```
```

--------------------------------

### Web Scraping and Data Extraction

Source: https://docs.firecrawl.dev/api-reference/endpoint/crawl-active

This section details the parameters available for configuring web scraping requests, including options for handling cached data, setting headers, specifying delays, emulating mobile devices, and managing TLS verification and timeouts.

```APIDOC
## Web Scraping Configuration

### Description
Configure various aspects of web scraping requests, such as caching, headers, delays, device emulation, and security settings.

### Method
N/A (Configuration parameters for scraping endpoints)

### Endpoint
N/A

### Parameters
#### Query Parameters
- **headers** (object) - Optional - Headers to send with the request. Can be used to send cookies, user-agent, etc.
- **waitFor** (integer) - Optional - Specify a delay in milliseconds before fetching the content, allowing the page sufficient time to load. This waiting time is in addition to Firecrawl's smart wait feature. (default: 0)
- **mobile** (boolean) - Optional - Set to true if you want to emulate scraping from a mobile device. Useful for testing responsive pages and taking mobile screenshots. (default: false)
- **skipTlsVerification** (boolean) - Optional - Skip TLS certificate verification when making requests. (default: true)
- **timeout** (integer) - Optional - Timeout in milliseconds for the request. Default is 30000 (30 seconds). Maximum is 300000 (300 seconds). (default: 30000, maximum: 300000)

### Request Example
```json
{
  "headers": {
    "User-Agent": "MyCustomUserAgent"
  },
  "waitFor": 2000,
  "mobile": true,
  "skipTlsVerification": false,
  "timeout": 60000
}
```

### Response
N/A (These are configuration parameters, not a direct response)

### Error Handling
N/A
```

--------------------------------

### Crawl Parameters Preview (Python)

Source: https://docs.firecrawl.dev/fr/migrate-to-v2

This Python code snippet demonstrates how to use the `crawl_params_preview` method to extract content from a URL based on a provided prompt.

```APIDOC
## POST /crawl/params-preview

### Description
This endpoint allows you to preview the results of a crawl operation by providing a URL and a prompt. It extracts content based on the specified prompt.

### Method
POST

### Endpoint
/v2/crawl/params-preview

### Parameters
#### Query Parameters
None

#### Request Body
- **url** (string) - Required - The URL to crawl.
- **prompt** (string) - Required - The prompt to guide content extraction.

### Request Example
```python
from firecrawl import Firecrawl

firecrawl = Firecrawl(api_key='fc-YOUR-API-KEY')
preview = firecrawl.crawl_params_preview(url='https://docs.firecrawl.dev', prompt='Extraire la doc et le blog')
print(preview)
```

### Response
#### Success Response (200)
- **content** (string) - The extracted content based on the prompt.

#### Response Example
```json
{
  "content": "Extracted content preview..."
}
```
```

--------------------------------

### List Browser Sessions

Source: https://docs.firecrawl.dev/sdks/cli

Lists all active or destroyed browser sessions. This command helps in managing and monitoring browser instances.

```bash
firecrawl browser list
```

--------------------------------

### Crawl with Change Tracking (Python, Node.js, cURL)

Source: https://docs.firecrawl.dev/features/change-tracking

Shows how to enable change tracking for a crawl operation to monitor an entire site. The `changeTracking` format is passed within `scrapeOptions`. The output allows iterating through results to check the `changeStatus` for each page.

```python
result = firecrawl.crawl(
    "https://example.com",
    limit=50,
    scrape_options={
        "formats": ["markdown", "changeTracking"]
    }
)

for page in result.data:
    status = page.changeTracking.changeStatus
    url = page.metadata.url
    print(f"{url}: {status}")
```

```javascript
const result = await firecrawl.crawl('https://example.com', {
    limit: 50,
    scrapeOptions: {
      formats: ['markdown', 'changeTracking']
    }
  });

  for (const page of result.data) {
    console.log(`${page.metadata.url}: ${page.changeTracking.changeStatus}`);
  }
```

```bash
curl -s -X POST "https://api.firecrawl.dev/v2/crawl" \
    -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "url": "https://example.com",
      "limit": 50,
      "scrapeOptions": {
        "formats": ["markdown", "changeTracking"]
      }
    }'
```

--------------------------------

### Firecrawl CLI Authentication Commands

Source: https://docs.firecrawl.dev/sdks/cli

Commands for authenticating with the Firecrawl API. Includes interactive login, browser-based login, direct API key login, and setting the API key via environment variables.

```bash
# Interactive login (opens browser or prompts for API key)
firecrawl login

# Login with browser authentication (recommended for agents)
firecrawl login --browser

# Login with API key directly
firecrawl login --api-key fc-YOUR-API-KEY

# Or set via environment variable
export FIRECRAWL_API_KEY=fc-YOUR-API-KEY
```

--------------------------------

### POST /extract

Source: https://docs.firecrawl.dev/api-reference/endpoint/extract

Extracts structured data from one or more URLs based on a provided prompt and schema.

```APIDOC
## POST /extract

### Description
Extracts structured data from web pages using LLMs. This endpoint processes the provided URLs and returns data formatted according to the specified JSON schema.

### Method
POST

### Endpoint
/v2/extract

### Parameters
#### Request Body
- **urls** (array) - Required - The URLs to extract data from (glob format).
- **prompt** (string) - Optional - Prompt to guide the extraction process.
- **schema** (object) - Optional - JSON Schema to define the structure of the extracted data.
- **enableWebSearch** (boolean) - Optional - When true, uses web search to find additional data. Default: false.
- **ignoreSitemap** (boolean) - Optional - When true, ignores sitemap.xml files. Default: false.
- **includeSubdomains** (boolean) - Optional - When true, scans subdomains. Default: true.
- **showSources** (boolean) - Optional - When true, includes sources in the response. Default: false.
- **scrapeOptions** (object) - Optional - Configuration for scraping (formats, tags, cache settings).
- **ignoreInvalidURLs** (boolean) - Optional - If true, ignores invalid URLs instead of failing. Default: true.

### Request Example
{
  "urls": ["https://example.com"],
  "prompt": "Extract the product price and name",
  "schema": {
    "type": "object",
    "properties": {
      "name": { "type": "string" },
      "price": { "type": "number" }
    }
  }
}

### Response
#### Success Response (200)
- **data** (object) - The extracted structured data.
- **sources** (array) - List of sources used (if showSources is true).
- **invalidURLs** (array) - List of URLs that failed to process (if ignoreInvalidURLs is true).

#### Response Example
{
  "data": {
    "name": "Example Product",
    "price": 29.99
  }
}
```

--------------------------------

### Credit Usage API

Source: https://docs.firecrawl.dev/sdks/cli

This API allows you to check your team's credit balance and usage. You can view the credit usage and optionally output the information in JSON format.

```APIDOC
## GET /websites/firecrawl_dev/credit-usage

### Description
Checks your team's credit balance and usage.

### Method
GET

### Endpoint
`/websites/firecrawl_dev/credit-usage`

### Parameters
#### Query Parameters
- **json** (boolean) - Optional - Output as JSON format.
- **pretty** (boolean) - Optional - Pretty print JSON output.

### Request Example
```bash
firecrawl credit-usage
firecrawl credit-usage --json --pretty
```

### Response
#### Success Response (200)
- **balance** (number) - Current credit balance.
- **usage** (number) - Total credit usage.

#### Response Example
```json
{
  "balance": 1000,
  "usage": 50
}
```
```

--------------------------------

### Save and Reuse Browser Profiles with Firecrawl

Source: https://docs.firecrawl.dev/sdks/python

Demonstrates how to create browser sessions with persistent profiles, saving cookies and localStorage across sessions. This is useful for maintaining user states or testing logged-in scenarios. Requires the 'firecrawl' library.

```python
session = app.browser(
    ttl=600,
    profile={
        "name": "my-profile",
        "save_changes": True,
    },
)
```

--------------------------------

### POST /v2/crawl/params-preview

Source: https://docs.firecrawl.dev/es/migrate-to-v2

This endpoint allows you to preview the crawling parameters for a given URL and prompt. It helps in understanding how the API will process the content before initiating a full crawl.

```APIDOC
## POST /v2/crawl/params-preview

### Description
This endpoint allows you to preview the crawling parameters for a given URL and prompt. It helps in understanding how the API will process the content before initiating a full crawl.

### Method
POST

### Endpoint
https://api.firecrawl.dev/v2/crawl/params-preview

### Parameters
#### Query Parameters
None

#### Request Body
- **url** (string) - Required - The URL of the website to crawl.
- **prompt** (string) - Optional - The prompt to guide the content extraction.

### Request Example
```json
{
  "url": "https://docs.firecrawl.dev",
  "prompt": "Extract docs and blog"
}
```

### Response
#### Success Response (200)
- **data** (object) - Contains the previewed crawl parameters.
  - **crawl_params** (object) - The parameters used for crawling.
    - **url** (string) - The URL to be crawled.
    - **prompt** (string) - The prompt for content extraction.
    - **include_links** (boolean) - Whether to include links in the crawl.
    - **include_images** (boolean) - Whether to include images in the crawl.
    - **max_depth** (integer) - The maximum depth for crawling.
    - **max_pages** (integer) - The maximum number of pages to crawl.
    - **only_content** (boolean) - Whether to only extract content.
    - **css_selector** (string) - CSS selector to target specific content.
    - **strip_tags** (array) - List of HTML tags to strip.
    - **model** (string) - The AI model to use for extraction.
    - **temperature** (number) - The temperature setting for the AI model.
    - **stream** (boolean) - Whether to stream the results.
    - **chunk_size** (integer) - The chunk size for streaming.
    - **chunk_overlap** (integer) - The chunk overlap for streaming.
    - **skip_golden_ticket** (boolean) - Whether to skip the golden ticket.
    - **return_raw_html** (boolean) - Whether to return the raw HTML.
    - **return_page_content** (boolean) - Whether to return the page content.
    - **return_markdown** (boolean) - Whether to return the content as Markdown.
    - **return_json** (boolean) - Whether to return the content as JSON.
    - **return_xml** (boolean) - Whether to return the content as XML.
    - **return_html** (boolean) - Whether to return the content as HTML.
    - **return_text** (boolean) - Whether to return the content as plain text.
    - **return_images** (boolean) - Whether to return images.
    - **return_links** (boolean) - Whether to return links.
    - **return_headers** (boolean) - Whether to return headers.
    - **return_metadata** (boolean) - Whether to return metadata.
    - **return_title** (boolean) - Whether to return the title.
    - **return_favicon** (boolean) - Whether to return the favicon.
    - **return_description** (boolean) - Whether to return the description.
    - **return_keywords** (boolean) - Whether to return the keywords.
    - **return_author** (boolean) - Whether to return the author.
    - **return_published_date** (boolean) - Whether to return the published date.
    - **return_modified_date** (boolean) - Whether to return the modified date.
    - **return_canonical_url** (boolean) - Whether to return the canonical URL.
    - **return_locale** (boolean) - Whether to return the locale.
    - **return_type** (string) - The type of return format.
    - **return_language** (string) - The language of the returned content.
    - **return_encoding** (string) - The encoding of the returned content.
    - **return_charset** (string) - The charset of the returned content.
    - **return_content_type** (string) - The content type of the returned content.
    - **return_content_length** (integer) - The content length of the returned content.
    - **return_server** (string) - The server information.
    - **return_last_modified** (string) - The last modified date.
    - **return_etag** (string) - The ETag of the content.
    - **return_expires** (string) - The expiration date.
    - **return_retry_after** (integer) - The retry after value.
    - **return_vary** (string) - The Vary header value.
    - **return_x_frame_options** (string) - The X-Frame-Options header value.
    - **return_x_content_type_options** (string) - The X-Content-Type-Options header value.
    - **return_x_xss_protection** (string) - The X-XSS-Protection header value.
    - **return_strict_transport_security** (string) - The Strict-Transport-Security header value.
    - **return_content_security_policy** (string) - The Content-Security-Policy header value.
    - **return_referrer_policy** (string) - The Referrer-Policy header value.
    - **return_permissions_policy** (string) - The Permissions-Policy header value.
    - **return_x_robots_tag** (string) - The X-Robots-Tag header value.
    - **return_x_powered_by** (string) - The X-Powered-By header value.
    - **return_x_aspnet_version** (string) - The X-AspNet-Version header value.
    - **return_x_ua_compatible** (string) - The X-UA-Compatible header value.
    - **return_x_redirect_by** (string) - The X-Redirect-By header value.
    - **return_x_request_id** (string) - The X-Request-ID header value.
    - **return_x_correlation_id** (string) - The X-Correlation-ID header value.
    - **return_x_trace_id** (string) - The X-Trace-ID header value.
    - **return_x_amzn_trace_id** (string) - The X-Amzn-Trace-ID header value.
    - **return_x_datadog_trace_id** (string) - The X-Datadog-Trace-ID header value.
    - **return_x_datadog_parent_id** (string) - The X-Datadog-Parent-ID header value.
    - **return_x_datadog_sampling_priority** (string) - The X-Datadog-Sampling-Priority header value.
    - **return_x_datadog_origin** (string) - The X-Datadog-Origin header value.
    - **return_x_datadog_trace_sampling_decision** (string) - The X-Datadog-Trace-Sampling-Decision header value.
    - **return_x_datadog_user_ids** (string) - The X-Datadog-User-IDs header value.
    - **return_x_datadog_custom** (string) - The X-Datadog-Custom header value.
    - **return_x_datadog_tags** (string) - The X-Datadog-Tags header value.
    - **return_x_datadog_trace_request_id** (string) - The X-Datadog-Trace-Request-ID header value.
    - **return_x_datadog_trace_request_type** (string) - The X-Datadog-Trace-Request-Type header value.
    - **return_x_datadog_trace_request_method** (string) - The X-Datadog-Trace-Request-Method header value.
    - **return_x_datadog_trace_request_url** (string) - The X-Datadog-Trace-Request-URL header value.
    - **return_x_datadog_trace_request_status_code** (string) - The X-Datadog-Trace-Request-Status-Code header value.
    - **return_x_datadog_trace_request_error_message** (string) - The X-Datadog-Trace-Request-Error-Message header value.
    - **return_x_datadog_trace_request_error_type** (string) - The X-Datadog-Trace-Request-Error-Type header value.
    - **return_x_datadog_trace_request_error_stack** (string) - The X-Datadog-Trace-Request-Error-Stack header value.
    - **return_x_datadog_trace_request_error_details** (string) - The X-Datadog-Trace-Request-Error-Details header value.
    - **return_x_datadog_trace_request_error_code** (string) - The X-Datadog-Trace-Request-Error-Code header value.
    - **return_x_datadog_trace_request_error_timestamp** (string) - The X-Datadog-Trace-Request-Error-Timestamp header value.
    - **return_x_datadog_trace_request_error_trace_id** (string) - The X-Datadog-Trace-Request-Error-Trace-ID header value.
    - **return_x_datadog_trace_request_error_span_id** (string) - The X-Datadog-Trace-Request-Error-Span-ID header value.
    - **return_x_datadog_trace_request_error_parent_id** (string) - The X-Datadog-Trace-Request-Error-Parent-ID header value.
    - **return_x_datadog_trace_request_error_sampling_priority** (string) - The X-Datadog-Trace-Request-Error-Sampling-Priority header value.
    - **return_x_datadog_trace_request_error_origin** (string) - The X-Datadog-Trace-Request-Error-Origin header value.
    - **return_x_datadog_trace_request_error_trace_sampling_decision** (string) - The X-Datadog-Trace-Request-Error-Trace-Sampling-Decision header value.
    - **return_x_datadog_trace_request_error_user_ids** (string) - The X-Datadog-Trace-Request-Error-User-IDs header value.
    - **return_x_datadog_trace_request_error_custom** (string) - The X-Datadog-Trace-Request-Error-Custom header value.
    - **return_x_datadog_trace_request_error_tags** (string) - The X-Datadog-Trace-Request-Error-Tags header value.
    - **return_x_datadog_trace_request_error_trace_request_id** (string) - The X-Datadog-Trace-Request-Error-Trace-Request-ID header value.
    - **return_x_datadog_trace_request_error_trace_request_type** (string) - The X-Datadog-Trace-Request-Error-Trace-Request-Type header value.
    - **return_x_datadog_trace_request_error_trace_request_method** (string) - The X-Datadog-Trace-Request-Error-Trace-Request-Method header value.
    - **return_x_datadog_trace_request_error_trace_request_url** (string) - The X-Datadog-Trace-Request-Error-Trace-Request-URL header value.
    - **return_x_datadog_trace_request_error_trace_request_status_code** (string) - The X-Datadog-Trace-Request-Error-Trace-Request-Status-Code header value.
    - **return_x_datadog_trace_request_error_trace_request_error_message** (string) - The X-Datadog-Trace-Request-Error-Trace-Request-Error-Message header value.
    - **return_x_datadog_trace_request_error_trace_request_error_type** (string) - The X-Datadog-Trace-Request-Error-Trace-Request-Error-Type header value.
    - **return_x_datadog_trace_request_error_trace_request_error_stack** (string) - The X-Datadog-Trace-Request-Error-Trace-Request-Error-Stack header value.
    - **return_x_datadog_trace_request_error_trace_request_error_details** (string) - The X-Datadog-Trace-Request-Error-Trace-Request-Error-Details header value.
    - **return_x_datadog_trace_request_error_trace_request_error_code** (string) - The X-Datadog-Trace-Request-Error-Trace-Request-Error-Code header value.
    - **return_x_datadog_trace_request_error_trace_request_error_timestamp** (string) - The X-Datadog-Trace-Request-Error-Trace-Request-Error-Timestamp header value.
    - **return_x_datadog_trace_request_error_trace_request_error_trace_id** (string) - The X-Datadog-Trace-Request-Error-Trace-Request-Error-Trace-ID header value.
    - **return_x_datadog_trace_request_error_trace_request_error_span_id** (string) - The X-Datadog-Trace-Request-Error-Trace-Request-Error-Span-ID header value.
    - **return_x_datadog_trace_request_error_trace_request_error_parent_id** (string) - The X-Datadog-Trace-Request-Error-Trace-Request-Error-Parent-ID header value.
    - **return_x_datadog_trace_request_error_trace_request_error_sampling_priority** (string) - The X-Datadog-Trace-Request-Error-Trace-Request-Error-Sampling-Priority header value.
    - **return_x_datadog_trace_request_error_trace_request_error_origin** (string) - The X-Datadog-Trace-Request-Error-Trace-Request-Error-Origin header value.
    - **return_x_datadog_trace_request_error_trace_request_error_trace_sampling_decision** (string) - The X-Datadog-Trace-Request-Error-Trace-Request-Error-Trace-Sampling-Decision header value.
    - **return_x_datadog_trace_request_error_trace_request_error_user_ids** (string) - The X-Datadog-Trace-Request-Error-Trace-Request-Error-User-IDs header value.
    - **return_x_datadog_trace_request_error_trace_request_error_custom** (string) - The X-Datadog-Trace-Request-Error-Trace-Request-Error-Custom header value.
    - **return_x_datadog_trace_request_error_trace_request_error_tags** (string) - The X-Datadog-Trace-Request-Error-Trace-Request-Error-Tags header value.

### Response Example
```json
{
  "data": {
    "crawl_params": {
      "url": "https://docs.firecrawl.dev",
      "prompt": "Extract docs and blog",
      "include_links": false,
      "include_images": false,
      "max_depth": 2,
      "max_pages": 10,
      "only_content": false,
      "css_selector": null,
      "strip_tags": [],
      "model": "gpt-4o",
      "temperature": 0.5,
      "stream": false,
      "chunk_size": 1000,
      "chunk_overlap": 200,
      "skip_golden_ticket": false,
      "return_raw_html": false,
      "return_page_content": false,
      "return_markdown": false,
      "return_json": false,
      "return_xml": false,
      "return_html": false,
      "return_text": true,
      "return_images": false,
      "return_links": false,
      "return_headers": false,
      "return_metadata": false,
      "return_title": false,
      "return_favicon": false,
      "return_description": false,
      "return_keywords": false,
      "return_author": false,
      "return_published_date": false,
      "return_modified_date": false,
      "return_canonical_url": false,
      "return_locale": false,
      "return_type": "text",
      "return_language": "en",
      "return_encoding": "utf-8",
      "return_charset": "utf-8",
      "return_content_type": "text/plain",
      "return_content_length": 1234,
      "return_server": "nginx",
      "return_last_modified": "Wed, 21 Oct 2015 07:28:00 GMT",
      "return_etag": "\"33a64df551425fcc55e4d42a148795d9f25f89d4\"",
      "return_expires": "Thu, 01 Dec 1994 16:00:00 GMT",
      "return_retry_after": 120,
      "return_vary": "*",
      "return_x_frame_options": "DENY",
      "return_x_content_type_options": "nosniff",
      "return_x_xss_protection": "1; mode=block",
      "return_strict_transport_security": "max-age=31536000; includeSubDomains",
      "return_content_security_policy": "default-src 'self'",
      "return_referrer_policy": "strict-origin-when-cross-origin",
      "return_permissions_policy": "geolocation=()",
      "return_x_robots_tag": "index, follow",
      "return_x_powered_by": "Express",
      "return_x_aspnet_version": "4.0.30319",
      "return_x_ua_compatible": "IE=edge",
      "return_x_redirect_by": "301",
      "return_x_request_id": "req-12345",
      "return_x_correlation_id": "corr-abcde",
      "return_x_trace_id": "trace-fghij",
      "return_x_amzn_trace_id": "Root=1-5f9f9f9f-9f9f9f9f9f9f9f9f9f9f9f9f",
      "return_x_datadog_trace_id": "1234567890",
      "return_x_datadog_parent_id": "0987654321",
      "return_x_datadog_sampling_priority": "1",
      "return_x_datadog_origin": "synthetics",
      "return_x_datadog_trace_sampling_decision": "sample",
      "return_x_datadog_user_ids": "user123",
      "return_x_datadog_custom": "custom_value",
      "return_x_datadog_tags": "env:prod,service:api",
      "return_x_datadog_trace_request_id": "trace-req-123",
      "return_x_datadog_trace_request_type": "GET",
      "return_x_datadog_trace_request_method": "GET",
      "return_x_datadog_trace_request_url": "https://api.firecrawl.dev/v2/crawl/params-preview",
      "return_x_datadog_trace_request_status_code": 200,
      "return_x_datadog_trace_request_error_message": null,
      "return_x_datadog_trace_request_error_type": null,
      "return_x_datadog_trace_request_error_stack": null,
      "return_x_datadog_trace_request_error_details": null,
      "return_x_datadog_trace_request_error_code": null,
      "return_x_datadog_trace_request_error_timestamp": null,
      "return_x_datadog_trace_request_error_trace_id": null,
      "return_x_datadog_trace_request_error_span_id": null,
      "return_x_datadog_trace_request_error_parent_id": null,
      "return_x_datadog_trace_request_error_sampling_priority": null,
      "return_x_datadog_trace_request_error_origin": null,
      "return_x_datadog_trace_request_error_trace_sampling_decision": null,
      "return_x_datadog_trace_request_error_user_ids": null,
      "return_x_datadog_trace_request_error_custom": null,
      "return_x_datadog_trace_request_error_tags": null
    }
  }
}
```
```

--------------------------------

### Search with Sources using cURL

Source: https://docs.firecrawl.dev/features/search

Demonstrates searching with specific sources like 'news' or 'images'. This requires an API key and specifies the query and the desired sources.

```bash
curl -X POST https://api.firecrawl.dev/v2/search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer fc-YOUR_API_KEY" \
  -d '{
    "query": "openai",
    "sources": ["news"],
    "limit": 5
  }'
```

```bash
curl -X POST https://api.firecrawl.dev/v2/search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer fc-YOUR_API_KEY" \
  -d '{
    "query": "jupiter",
    "sources": ["images"],
    "limit": 8
  }'
```

--------------------------------

### Define Click Action Schema

Source: https://docs.firecrawl.dev/api-reference/endpoint/crawl-active

Defines the structure for a click action, allowing users to target specific elements via CSS selectors. Supports clicking all matching elements or just the first instance.

```json
{
  "type": "click",
  "selector": "#load-more-button",
  "all": false
}
```

--------------------------------

### Authentication

Source: https://docs.firecrawl.dev/api-reference/endpoint/batch-scrape-get

Details the security scheme used for authenticating API requests.

```APIDOC
## Authentication

### Description
The API uses Bearer Token authentication to secure endpoints.

### Security Scheme
- **Type**: http
- **Scheme**: bearer

### Usage
Include the following header in your requests:
`Authorization: Bearer <your_api_key>`
```

--------------------------------

### Advanced search filtering and scraping

Source: https://docs.firecrawl.dev/sdks/cli

Demonstrates advanced search functionality including source selection, category filtering, time-based constraints, location settings, and integrated scraping of search results.

```bash
# Search specific sources
firecrawl search "AI" --sources web,news,images

# Search with category filters
firecrawl search "react hooks" --categories github
firecrawl search "machine learning" --categories research,pdf

# Time-based filtering
firecrawl search "tech news" --tbs qdr:h   # Last hour
firecrawl search "tech news" --tbs qdr:d   # Last day
firecrawl search "tech news" --tbs qdr:w   # Last week
firecrawl search "tech news" --tbs qdr:m   # Last month
firecrawl search "tech news" --tbs qdr:y   # Last year

# Location-based search
firecrawl search "restaurants" --location "Berlin,Germany" --country DE

# Search and scrape results
firecrawl search "documentation" --scrape --scrape-formats markdown
```

--------------------------------

### Browser Automation

Source: https://docs.firecrawl.dev/sdks/cli

Manages browser sessions to perform complex interactions like clicking, filling forms, and taking snapshots.

```bash
firecrawl browser launch-session
firecrawl browser execute "open https://news.ycombinator.com"
firecrawl browser execute "snapshot"
firecrawl browser execute "scrape"
firecrawl browser close

# Use agent-browser via bash mode
firecrawl browser launch-session
firecrawl browser execute "open https://example.com"
firecrawl browser execute "snapshot"
firecrawl browser execute "click @e5"
firecrawl browser execute "fill @e3 'search query'"
firecrawl browser execute "scrape"
firecrawl browser execute --bash "agent-browser --help"
firecrawl browser close
```

--------------------------------

### Interact with Web Browser using cURL

Source: https://docs.firecrawl.dev/introduction

This snippet demonstrates how to launch, execute code within, and close a browser session using cURL. It requires an API key and a session ID for execution and closure. The code executed within the browser context can interact with web pages, retrieve titles, and print output.

```bash
curl -X POST "https://api.firecrawl.dev/v2/browser" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -H "Content-Type: application/json"

curl -X POST "https://api.firecrawl.dev/v2/browser/YOUR_SESSION_ID/execute" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "await page.goto(\"https://news.ycombinator.com\")\ntitle = await page.title()\nprint(title)"
}'

curl -X DELETE "https://api.firecrawl.dev/v2/browser/YOUR_SESSION_ID" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY"
```

--------------------------------

### Specify Proxy Location in Firecrawl Requests

Source: https://docs.firecrawl.dev/features/proxies

Demonstrates how to configure the proxy location to a specific country using the location parameter. This is supported across Python, Node.js, and cURL to ensure requests originate from desired geographic regions.

```python
from firecrawl import Firecrawl

firecrawl = Firecrawl(api_key="fc-YOUR-API-KEY")

doc = firecrawl.scrape('https://example.com',
    formats=['markdown'],
    location={
        'country': 'US',
        'languages': ['en']
    }
)

print(doc)
```

```javascript
import Firecrawl from '@mendable/firecrawl-js';

const firecrawl = new Firecrawl({ apiKey: "fc-YOUR-API-KEY" });

const doc = await firecrawl.scrape('https://example.com', {
  formats: ['markdown'],
  location: { country: 'US', languages: ['en'] },
});

console.log(doc.metadata);
```

```bash
curl -X POST "https://api.firecrawl.dev/v2/scrape" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "formats": ["markdown"],
    "location": { "country": "US", "languages": ["en"] }
  }'
```

--------------------------------

### POST /scrape

Source: https://docs.firecrawl.dev/api-reference/endpoint/crawl-post

Configures and executes a scraping request with optional actions like JavaScript execution or PDF generation.

```APIDOC
## POST /scrape

### Description
Executes a scraping task with support for custom actions, proxy management, and output formatting.

### Method
POST

### Endpoint
/scrape

### Parameters
#### Request Body
- **actions** (array) - Optional - List of actions to perform (e.g., executeJavascript, pdf).
- **location** (object) - Optional - Geographic and language settings for the request.
- **removeBase64Images** (boolean) - Optional - Whether to strip base64 images (default: true).
- **blockAds** (boolean) - Optional - Enables ad/cookie popup blocking (default: true).
- **proxy** (string) - Optional - Proxy type: basic, enhanced, or auto (default: auto).
- **storeInCache** (boolean) - Optional - Whether to cache the result (default: true).

### Request Example
{
  "actions": [
    {
      "type": "executeJavascript",
      "script": "document.querySelector('.button').click();"
    }
  ],
  "proxy": "auto"
}

### Response
#### Success Response (200)
- **success** (boolean) - Request status.
- **id** (string) - Unique identifier for the job.
- **url** (string) - The URL processed.

#### Response Example
{
  "success": true,
  "id": "job-123-abc",
  "url": "https://example.com"
}
```

--------------------------------

### Perform Manual Batch Scrape Pagination in Python

Source: https://docs.firecrawl.dev/sdks/python

Demonstrates manual pagination for batch scrape jobs by setting auto_paginate to False. It utilizes get_batch_scrape_status_page to retrieve subsequent pages based on the next URL.

```python
batch_job = client.start_batch_scrape(urls)

# Fetch first page
status = client.get_batch_scrape_status(
    batch_job.id,
    pagination_config=PaginationConfig(auto_paginate=False)
)
print("First page:", len(status.data), "docs")

# Fetch subsequent pages using get_batch_scrape_status_page
while status.next:
    status = client.get_batch_scrape_status_page(status.next)
    print("Next page:", len(status.data), "docs")
```

--------------------------------

### Configure Crawl Parameters

Source: https://docs.firecrawl.dev/sdks/cli

Advanced configuration options for crawling, including depth limits, path filtering, subdomain management, and rate limiting to control resource usage.

```bash
# Limit crawl depth and pages
firecrawl crawl https://example.com --limit 100 --max-depth 3 --wait

# Include only specific paths
firecrawl crawl https://example.com --include-paths /blog,/docs --wait

# Exclude specific paths
firecrawl crawl https://example.com --exclude-paths /admin,/login --wait

# Include subdomains
firecrawl crawl https://example.com --allow-subdomains --wait

# Rate limiting
firecrawl crawl https://example.com --delay 1000 --max-concurrency 2 --wait
```

--------------------------------

### Crawl a Website with Java

Source: https://docs.firecrawl.dev/sdks/java

Uses the crawlURL method to initiate a crawl job with specified limits and formats. It polls the service to retrieve and process the crawled documents.

```Java
CrawlParams crawlParams = new CrawlParams();
crawlParams.setLimit(50);
crawlParams.setMaxDiscoveryDepth(3);

ScrapeParams scrapeParams = new ScrapeParams();
scrapeParams.setFormats(new String[]{"markdown"});

crawlParams.setScrapeOptions(scrapeParams);

CrawlStatusResponse job = client.crawlURL(
    "https://firecrawl.dev",
    crawlParams,
    UUID.randomUUID().toString(),
    10
);

System.out.println("Status: " + job.getStatus());
System.out.println("Pages crawled: " + (job.getData() != null ? job.getData().length : 0));

if (job.getData() != null) {
    for (FirecrawlDocument doc : job.getData()) {
        System.out.println(doc.getMetadata().get("sourceURL"));
    }
}
```

--------------------------------

### Configure Firecrawl MCP with Full npx Path on Windows

Source: https://docs.firecrawl.dev/developer-guides/mcp-setup-guides/cursor

For Windows users encountering 'npx ENOENT' errors, this JSON configuration uses the full path to `npx.cmd`. Ensure you replace the command path with the actual output from `where npx`.

```json
{
  "mcpServers": {
    "firecrawl": {
      "command": "C:\\Program Files\\nodejs\\npx.cmd",
      "args": ["-y", "firecrawl-mcp"],
      "env": {
        "FIRECRAWL_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

--------------------------------

### POST /v2/browser/{sessionId}/execute

Source: https://docs.firecrawl.dev/features/browser

Executes a command within an active browser session. This endpoint supports running agent-browser commands by specifying the language as 'bash'.

```APIDOC
## POST /v2/browser/{sessionId}/execute

### Description
Executes a command or script within the specified browser session. Used primarily for agent-browser interactions.

### Method
POST

### Endpoint
/v2/browser/{sessionId}/execute

### Parameters
#### Path Parameters
- **sessionId** (string) - Required - The unique identifier of the active browser session.

#### Request Body
- **code** (string) - Required - The command or script to execute (e.g., "agent-browser snapshot").
- **language** (string) - Required - The language of the code, set to "bash" for agent-browser commands.

### Request Example
{
  "code": "agent-browser snapshot",
  "language": "bash"
}

### Response
#### Success Response (200)
- **result** (object) - The output or status of the executed command.

#### Response Example
{
  "result": "Snapshot captured successfully"
}
```

--------------------------------

### Scrape with Multiple Formats (Python, Node.js, cURL)

Source: https://docs.firecrawl.dev/features/scrape

Scrape a webpage and retrieve content in multiple formats including markdown, branding, and a screenshot. This function requires an API key and the URL of the target website. The output includes the requested formats as specified in the 'formats' array.

```python
from firecrawl import Firecrawl

firecrawl = Firecrawl(api_key='fc-YOUR_API_KEY')

result = firecrawl.scrape(
    url='https://firecrawl.dev',
    formats=['markdown', 'branding', 'screenshot']
)

print(result['markdown'])
print(result['branding'])
print(result['screenshot'])
```

```javascript
import Firecrawl from '@mendable/firecrawl-js';

const firecrawl = new Firecrawl({ apiKey: "fc-YOUR-API-KEY" });

const result = await firecrawl.scrape('https://firecrawl.dev', {
    formats: ['markdown', 'branding', 'screenshot']
});

console.log(result.markdown);
console.log(result.branding);
console.log(result.screenshot);
```

```bash
curl -s -X POST "https://api.firecrawl.dev/v2/scrape" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://firecrawl.dev",
    "formats": ["markdown", "branding", "screenshot"]
    }'
```

--------------------------------

### Authentication and Error Handling

Source: https://docs.firecrawl.dev/fr/api-reference/endpoint/crawl-params-preview

Details regarding the Bearer token authentication scheme and the standard error response structure for the API.

```APIDOC
## Authentication

### Description
All API requests must be authenticated using a Bearer token provided in the Authorization header.

### Security Scheme
- **Type**: http
- **Scheme**: bearer

## Error Handling

### Description
Standard error response structure when a request fails to process.

### Response Body
- **error** (string) - A description of the failure, e.g., "Failed to process natural language prompt"

### Response Example
{
  "error": "Failed to process natural language prompt"
}
```

--------------------------------

### Basic Agent Usage for Web Data Gathering

Source: https://docs.firecrawl.dev/sdks/cli

The `firecrawl agent` command allows you to search and gather data from the web using natural language prompts. The `--wait` option is crucial for ensuring the command returns results only after the agent has finished its task. URLs are optional, allowing for general web searches.

```bash
# Basic usage - URLs are optional
firecrawl agent "Find the top 5 AI startups and their funding amounts" --wait
```

--------------------------------

### Define Execute JavaScript Action Schema

Source: https://docs.firecrawl.dev/api-reference/endpoint/crawl-active

Defines the structure for executing arbitrary JavaScript code within the context of the current page. Useful for complex interactions not covered by standard actions.

```json
{
  "type": "executeJavascript",
  "script": "document.querySelector('.button').click();"
}
```

--------------------------------

### Batch Scraping

Source: https://docs.firecrawl.dev/sdks/java

Scrapes content from multiple URLs concurrently. Allows specifying desired output formats.

```APIDOC
## POST /batchScrape

### Description
Scrapes content from multiple URLs in parallel. Returns a job ID to track the batch scraping process.

### Method
POST

### Endpoint
/batchScrape

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **urls** (array of strings) - Required - An array of URLs to scrape.
- **scrapeOptions** (object) - Optional - Options for scraping content from the URLs.
  - **formats** (array of strings) - Optional - Desired output formats (e.g., "markdown").

### Request Example
```json
{
  "urls": [
    "https://firecrawl.dev",
    "https://firecrawl.dev/blog"
  ],
  "scrapeOptions": {
    "formats": ["markdown"]
  }
}
```

### Response
#### Success Response (200)
- **id** (string) - The unique identifier for the batch scraping job.

#### Response Example
```json
{
  "id": "batch-scrape-job-67890"
}
```

## GET /getBatchScrapeStatus

### Description
Retrieves the status and results of a batch scraping job using its job ID.

### Method
GET

### Endpoint
/getBatchScrapeStatus

### Parameters
#### Path Parameters
None

#### Query Parameters
- **jobId** (string) - Required - The ID of the batch scraping job.

#### Request Body
None

### Request Example
```
GET /getBatchScrapeStatus?jobId=batch-scrape-job-67890
```

### Response
#### Success Response (200)
- **data** (array of FirecrawlDocument) - An array of scraped documents.
  - **markdown** (string) - The scraped content in markdown format.

#### Response Example
```json
{
  "data": [
    {
      "markdown": "# Firecrawl\nContent from firecrawl.dev..."
    },
    {
      "markdown": "# Firecrawl Blog\nLatest posts from the blog..."
    }
  ]
}
```
```

--------------------------------

### POST /scrape

Source: https://docs.firecrawl.dev/api-reference/endpoint/search

Initiates a web scraping task with specific proxy, caching, and output format requirements.

```APIDOC
## POST /scrape

### Description
Initiates a scraping job. Allows configuration of proxy strategies, caching, and multiple output formats.

### Method
POST

### Endpoint
/scrape

### Request Body
- **proxy** (string) - Optional - Proxy strategy: 'enhanced' (advanced anti-bot, 5 credits) or 'auto' (default, automatic retry).
- **storeInCache** (boolean) - Optional - Whether to store the page in the Firecrawl index. Default: true.
- **formats** (array) - Required - List of output formats (markdown, summary, html, rawHtml, links, images, screenshot, json, changeTracking).

### Request Example
{
  "proxy": "auto",
  "storeInCache": true,
  "formats": ["markdown", "json"]
}

### Response
#### Success Response (200)
- **data** (object) - The scraped content based on requested formats.

#### Response Example
{
  "data": {
    "markdown": "# Page Title...",
    "json": { "key": "value" }
  }
}
```

--------------------------------

### Run AI Agent for Data Extraction in Java

Source: https://docs.firecrawl.dev/sdks/java

Uses the AI agent to research web content, optionally using a JSON schema to structure the extracted data.

```Java
AgentParams params = new AgentParams("Find the pricing plans for Firecrawl and compare them");

AgentResponse start = client.createAgent(params);
AgentStatusResponse result = client.getAgentStatus(start.getId());

System.out.println(result.getData());
```

```Java
AgentParams params = new AgentParams("Extract pricing plan details");
params.setUrls(new String[]{"https://firecrawl.dev"});
params.setSchema(Map.of(
    "type", "object",
    "properties", Map.of(
        "plans", Map.of(
            "type", "array",
            "items", Map.of(
                "type", "object",
                "properties", Map.of(
                    "name", Map.of("type", "string"),
                    "price", Map.of("type", "string")
                )
            )
        )
    )
));

AgentResponse start = client.createAgent(params);
AgentStatusResponse result = client.getAgentStatus(start.getId());

System.out.println(result.getData());
```

--------------------------------

### Action Types API

Source: https://docs.firecrawl.dev/api-reference/endpoint/crawl-active

This section details the different types of actions that can be performed on a web page.

```APIDOC
## Action Types

This API supports various actions that can be performed on a web page during scraping.

### Action Object Structure

Each action is defined as a JSON object with a `type` property and other type-specific properties.

### Supported Action Types

- **Screenshot**: Capture a screenshot of the page.
  - `quality` (integer) - The quality of the screenshot (1-100).

- **Click**: Click on an element.
  - `selector` (string) - Query selector to find the element.
  - `all` (boolean, optional, default: false) - Whether to click all matching elements.

- **Write text**: Write text into an input field.
  - `text` (string) - Text to type.
  - *Note*: Requires a preceding 'click' action to focus the element.

- **Press a key**: Press a key on the page.
  - `key` (string) - The key to press (e.g., 'Enter').

- **Scroll**: Scroll the page or a specific element.
  - `direction` (string, optional, default: 'down') - Direction to scroll ('up' or 'down').
  - `selector` (string, optional) - Query selector for the element to scroll.

- **Scrape**: Scrape the current page content.
  - Returns the URL and HTML of the page.

- **Execute JavaScript**: Execute custom JavaScript code.
  - `script` (string) - The JavaScript code to execute.

- **Generate PDF**: Generate a PDF of the current page.
  - *Details for PDF generation are incomplete in the provided text.*
```

--------------------------------

### POST /crawl

Source: https://docs.firecrawl.dev/api-reference/endpoint/crawl-post

Initiates a web crawl process with configurable parameters for link following, concurrency, and webhook notifications.

```APIDOC
## POST /crawl

### Description
Initiates a crawl job for a specified URL. Supports advanced configuration for link discovery, concurrency management, and webhook event notifications.

### Method
POST

### Endpoint
/crawl

### Parameters
#### Request Body
- **url** (string) - Required - The starting URL for the crawl.
- **allowExternalLinks** (boolean) - Optional - Allows the crawler to follow links to external websites. Default: false.
- **allowSubdomains** (boolean) - Optional - Allows the crawler to follow links to subdomains. Default: false.
- **delay** (number) - Optional - Delay in seconds between scrapes to respect rate limits.
- **maxConcurrency** (integer) - Optional - Maximum number of concurrent scrapes.
- **webhook** (object) - Optional - Webhook configuration object containing url, headers, metadata, and events.
- **scrapeOptions** (object) - Optional - Configuration for scraping format and content extraction.
- **zeroDataRetention** (boolean) - Optional - Enables zero data retention policy. Default: false.

### Request Example
{
  "url": "https://example.com",
  "allowExternalLinks": false,
  "maxConcurrency": 5,
  "webhook": {
    "url": "https://webhook.site/example",
    "events": ["completed", "page"]
  }
}

### Response
#### Success Response (200)
- **id** (string) - The unique identifier for the crawl job.

#### Response Example
{
  "id": "crawl-job-uuid-12345"
}
```

--------------------------------

### Scrape with Actions (Python, Node.js, cURL)

Source: https://docs.firecrawl.dev/features/scrape

Scrape a webpage after performing a series of actions, such as filling forms and clicking buttons. This method is useful for interacting with dynamic content. Ensure to use 'wait' actions to allow pages to load properly. The output can include markdown content and screenshots.

```python
from firecrawl import Firecrawl

firecrawl = Firecrawl(api_key="fc-YOUR-API-KEY")

doc = firecrawl.scrape(
    url="https://example.com/login",
    formats=["markdown"],
    actions=[
        {"type": "write", "text": "john@example.com"},
        {"type": "press", "key": "Tab"},
        {"type": "write", "text": "secret"},
        {"type": "click", "selector": 'button[type="submit"]'},
        {"type": "wait", "milliseconds": 1500},
        {"type": "screenshot", "full_page": True},
    ],
)

print(doc.markdown, doc.screenshot)
```

```javascript
import Firecrawl from '@mendable/firecrawl-js';

const firecrawl = new Firecrawl({ apiKey: "fc-YOUR-API-KEY" });

const doc = await firecrawl.scrape('https://example.com/login', {
  formats: ['markdown'],
  actions: [
    { type: 'write', text: 'john@example.com' },
    { type: 'press', key: 'Tab' },
    { type: 'write', text: 'secret' },
    { type: 'click', selector: 'button[type="submit"]' },
    { type: 'wait', milliseconds: 1500 },
    { type: 'screenshot', fullPage: true },
  ],
});

console.log(doc.markdown, doc.screenshot);
```

```bash
curl -X POST https://api.firecrawl.dev/v2/scrape \
    -H 'Content-Type: application/json' \
    -H 'Authorization: Bearer YOUR_API_KEY' \
    -d '{
      "url": "https://example.com/login",
      "formats": ["markdown"],
      "actions": [
        { "type": "write", "text": "john@example.com" },
        { "type": "press", "key": "Tab" },
        { "type": "write", "text": "secret" },
        { "type": "click", "selector": "button[type=\"submit\"]" },
        { "type": "wait", "milliseconds": 1500 },
        { "type": "screenshot", "fullPage": true },
      ],
  }'
```

--------------------------------

### Web Scraping and Navigation Actions

Source: https://docs.firecrawl.dev/api-reference/endpoint/search

This section details the various actions that can be performed on web pages, including navigating, scrolling, executing JavaScript, and scraping content.

```APIDOC
## Actions API

### Description
This API allows for a variety of actions to be performed on web pages, including navigation, scrolling, executing JavaScript, and scraping content. It also supports PDF generation and advanced request configurations.

### Method
POST

### Endpoint
/websites/firecrawl_dev

### Parameters
#### Request Body
- **actions** (array) - Required - A list of actions to perform on the page.
  - **type** (string) - Required - The type of action to perform. Possible values: `navigate`, `scroll`, `scrape`, `executeJavascript`, `pdf`.
  - **url** (string) - Optional - The URL to navigate to. Required for `navigate` action.
  - **key** (string) - Optional - The key to press for the `keypress` action.
  - **direction** (string) - Optional - The direction to scroll for the `scroll` action. Possible values: `up`, `down`. Defaults to `down`.
  - **selector** (string) - Optional - The query selector for the element to scroll for the `scroll` action.
  - **script** (string) - Optional - The JavaScript code to execute for the `executeJavascript` action. Required for `executeJavascript` action.
  - **format** (string) - Optional - The page size of the resulting PDF for the `pdf` action. Possible values: `A0`, `A1`, `A2`, `A3`, `A4`, `A5`, `A6`, `Letter`, `Legal`, `Tabloid`, `Ledger`. Defaults to `Letter`.
  - **landscape** (boolean) - Optional - Whether to generate the PDF in landscape orientation for the `pdf` action. Defaults to `false`.
  - **scale** (number) - Optional - The scale multiplier of the resulting PDF for the `pdf` action. Defaults to `1`.

- **location** (object) - Optional - Location settings for the request.
  - **country** (string) - Optional - ISO 3166-1 alpha-2 country code. Defaults to `US`.
  - **languages** (array) - Optional - Preferred languages and locales for the request. Defaults to the language of the specified location.

- **removeBase64Images** (boolean) - Optional - Removes all base 64 images from the output. Defaults to `true`.
- **blockAds** (boolean) - Optional - Enables ad-blocking and cookie popup blocking. Defaults to `true`.
- **proxy** (string) - Optional - Specifies the type of proxy to use. Possible values: `basic`, `enhanced`, `auto`.

### Request Example
```json
{
  "actions": [
    {
      "type": "navigate",
      "url": "https://example.com"
    },
    {
      "type": "scroll",
      "direction": "down"
    },
    {
      "type": "executeJavascript",
      "script": "document.querySelector('.button').click();"
    },
    {
      "type": "pdf",
      "format": "A4",
      "landscape": true
    }
  ],
  "location": {
    "country": "US",
    "languages": ["en-US"]
  },
  "removeBase64Images": false,
  "blockAds": false,
  "proxy": "basic"
}
```

### Response
#### Success Response (200)
- **actions** (array) - A list of results corresponding to the actions performed.
  - **type** (string) - The type of action performed.
  - **url** (string) - The URL of the page.
  - **html** (string) - The HTML content of the page (for `scrape` action).
  - **pdfs** (array) - A list of generated PDFs (for `pdf` action).

#### Response Example
```json
{
  "actions": [
    {
      "type": "navigate",
      "url": "https://example.com"
    },
    {
      "type": "scroll",
      "url": "https://example.com"
    },
    {
      "type": "executeJavascript",
      "url": "https://example.com"
    },
    {
      "type": "pdf",
      "url": "https://example.com",
      "pdfs": ["base64_encoded_pdf_content"]
    }
  ]
}
```
```

--------------------------------

### Scrape Website and Summarize Content with Gemini

Source: https://docs.firecrawl.dev/developer-guides/llm-sdks-and-frameworks/gemini

Demonstrates a workflow to scrape a website using Firecrawl, retrieve content in markdown format, and then use Google Gemini to summarize the scraped content. Requires Firecrawl and Gemini API keys.

```typescript
import FirecrawlApp from '@mendable/firecrawl-js';
import { GoogleGenAI } from '@google/genai';

const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const scrapeResult = await firecrawl.scrape('https://firecrawl.dev', {
    formats: ['markdown']
});

console.log('Scraped content length:', scrapeResult.markdown?.length);

const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Summarize: ${scrapeResult.markdown}`,
});

console.log('Summary:', response.text);
```

--------------------------------

### PDF Parsing Options

Source: https://docs.firecrawl.dev/api-reference/endpoint/crawl-active

This section describes how to control PDF processing during scraping, including options for extracting content as markdown or returning the file in base64 encoding, and specifying parsing modes and page limits.

```APIDOC
## PDF Parsing Configuration

### Description
Control how PDF files are processed during scraping. Options include extracting content to markdown or returning the raw file, with configurable parsing modes and page limits.

### Method
N/A (Configuration parameters for scraping endpoints)

### Endpoint
N/A

### Parameters
#### Query Parameters
- **parsers** (array) - Optional - Controls how files are processed during scraping. When "pdf" is included (default), the PDF content is extracted and converted to markdown format, with billing based on the number of pages (1 credit per page). When an empty array is passed, the PDF file is returned in base64 encoding with a flat rate of 1 credit for the entire PDF. (default: [{"type": "pdf"}])
  - **items** (object) - Configuration for a specific parser.
    - **type** (string) - Required - The type of parser. Enum: ["pdf"]
    - **mode** (string) - Optional - PDF parsing mode. "fast": text-based extraction only (embedded text, fastest). "auto" (default): attempts fast extraction first, falls back to OCR if needed. "ocr": forces OCR parsing on every page. (default: "auto")
    - **maxPages** (integer) - Optional - Maximum number of pages to parse from the PDF. Must be a positive integer up to 10000. (minimum: 1, maximum: 10000)

### Request Example
```json
{
  "parsers": [
    {
      "type": "pdf",
      "mode": "ocr",
      "maxPages": 50
    }
  ]
}
```
```json
{
  "parsers": []
}
```

### Response
N/A (These are configuration parameters, not a direct response)

### Error Handling
N/A
```

--------------------------------

### POST /extract

Source: https://docs.firecrawl.dev/sdks/java

Extracts structured data from a website based on a provided JSON schema.

```APIDOC
## POST /extract

### Description
Uses AI to extract specific structured data from a URL based on a user-defined JSON schema and prompt.

### Method
POST

### Endpoint
/extract

### Parameters
#### Request Body
- **urls** (array) - Required - List of URLs to extract data from.
- **prompt** (string) - Required - Instructions for the extraction.
- **schema** (object) - Required - JSON schema defining the output structure.

### Request Example
{
  "urls": ["https://firecrawl.dev"],
  "prompt": "Extract product name and price",
  "schema": { "type": "object", "properties": { "name": { "type": "string" } } }
}

### Response
#### Success Response (200)
- **id** (string) - The extraction job ID.

#### Response Example
{
  "id": "extract-job-id"
}
```

--------------------------------

### Scrape URL with Different Output Formats

Source: https://docs.firecrawl.dev/sdks/cli

Extracts content from a URL in various specified formats. This includes HTML, markdown, links, images, summaries, and change tracking information. Multiple formats can be requested, resulting in JSON output.

```bash
# Get HTML output
firecrawl https://example.com --html

# Multiple formats (returns JSON)
firecrawl https://example.com --format markdown,links

# Get images from a page
firecrawl https://example.com --format images

# Get a summary of the page content
firecrawl https://example.com --format summary

# Track changes on a page
firecrawl https://example.com --format changeTracking

# Available formats: markdown, html, rawHtml, links, screenshot, json, images, summary, changeTracking, attributes, branding
```

--------------------------------

### Browser Session Management

Source: https://docs.firecrawl.dev/sdks/python

Manage cloud browser sessions for remote code execution and state persistence.

```APIDOC
## POST /browser

### Description
Creates a new cloud browser session.

### Method
POST

### Parameters
#### Request Body
- **ttl** (integer) - Optional - Time to live in seconds
- **profile** (object) - Optional - Configuration for session persistence

### Response
#### Success Response (200)
- **id** (string) - Session ID
- **cdp_url** (string) - WebSocket URL for CDP connection
- **live_view_url** (string) - URL for live browser monitoring

## POST /browser/execute

### Description
Executes code within an active browser session.

### Method
POST

### Parameters
#### Request Body
- **session_id** (string) - Required - The ID of the active session
- **code** (string) - Required - The script to execute
- **language** (string) - Required - "python" or "node"

### Response
#### Success Response (200)
- **result** (any) - The output of the executed code
```

--------------------------------

### Crawl Tool Arguments (JSON)

Source: https://docs.firecrawl.dev/mcp-server

Outlines the arguments for the `firecrawl_crawl` tool, which initiates an asynchronous web crawl. Options include setting discovery depth, URL limits, and controlling external link allowance and URL deduplication.

```json
{
  "name": "firecrawl_crawl",
  "arguments": {
    "url": "https://example.com",
    "maxDiscoveryDepth": 2,
    "limit": 100,
    "allowExternalLinks": false,
    "deduplicateSimilarURLs": true
  }
}

```

--------------------------------

### JavaScript SDK Method Changes (v1 -> v2)

Source: https://docs.firecrawl.dev/migrate-to-v2

Mapping of method name changes from the v1 JavaScript SDK to the v2 JavaScript SDK.

```APIDOC
## JavaScript SDK Method Changes (v1 → v2)

### Description
This section details the method name changes between the v1 and v2 JavaScript SDKs for various functionalities.

### Method
N/A (Documentation of SDK changes)

### Endpoint
N/A

### Parameters
N/A

### Request Example
N/A

### Response
#### Success Response (200)
N/A

#### Response Example
N/A

---

### Scrape, Search, and Map

| v1 (FirecrawlApp)     | v2 (Firecrawl)            |
| --------------------- | ------------------------- |
| `scrapeUrl(url, ...)` | `scrape(url, options?)`   |
| `search(query, ...)`  | `search(query, options?)` |
| `mapUrl(url, ...)`    | `map(url, options?)`      |

---

### Crawling

| v1                          | v2                              |
| --------------------------- | ------------------------------- |
| `crawlUrl(url, ...)`        | `crawl(url, options?)` (waiter) |
| `asyncCrawlUrl(url, ...)`   | `startCrawl(url, options?)`     |
| `checkCrawlStatus(id, ...)` | `getCrawlStatus(id)`            |
| `cancelCrawl(id)`           | `cancelCrawl(id)`               |
| `checkCrawlErrors(id)`      | `getCrawlErrors(id)`            |

---

### Batch Scraping

| v1                                | v2                                  |
| --------------------------------- | ----------------------------------- |
| `batchScrapeUrls(urls, ...)`      | `batchScrape(urls, opts?)` (waiter) |
| `asyncBatchScrapeUrls(urls, ...)` | `startBatchScrape(urls, opts?)`     |
| `checkBatchScrapeStatus(id, ...)` | `getBatchScrapeStatus(id)`          |
| `checkBatchScrapeErrors(id)`      | `getBatchScrapeErrors(id)`          |

---

### Extraction

| v1                            | v2                     |
| ----------------------------- | ---------------------- |
| `extract(urls?, params?)`     | `extract(args)`        |
| `asyncExtract(urls, params?)` | `startExtract(args)`   |
| `getExtractStatus(id)`        | `getExtractStatus(id)` |

---

### Other / Removed

| v1                                | v2                    |
| --------------------------------- | --------------------- |
| `generateLLMsText(...)`           | (not in v2 SDK)       |
| `checkGenerateLLMsTextStatus(id)` | (not in v2 SDK)       |
| `crawlUrlAndWatch(...)`           | `watcher(jobId, ...)` |
| `batchScrapeUrlsAndWatch(...)`    | `watcher(jobId, ...)` |
```

--------------------------------

### Browser Action: Execute JavaScript

Source: https://docs.firecrawl.dev/api-reference/endpoint/batch-scrape

Executes custom JavaScript code within the context of the current page.

```APIDOC
## POST /actions/executeJavascript

### Description
Executes arbitrary JavaScript code on the page.

### Method
POST

### Endpoint
/actions/executeJavascript

### Parameters
#### Request Body
- **type** (string) - Required - Must be 'executeJavascript'
- **script** (string) - Required - The JavaScript code to execute.

### Request Example
{
  "type": "executeJavascript",
  "script": "document.querySelector('.button').click();"
}
```

--------------------------------

### Search GitHub Repositories

Source: https://docs.firecrawl.dev/developer-guides/common-sites/github

Perform a search query on GitHub and retrieve results in markdown format. Useful for discovering repositories or issues related to specific topics.

```typescript
import FirecrawlApp from '@mendable/firecrawl-js';

const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });

const searchResult = await firecrawl.search('machine learning site:github.com', {
    limit: 10,
    sources: [{ type: 'web' }],
    scrapeOptions: {
        formats: ['markdown']
    }
});

console.log(searchResult);
```

--------------------------------

### Create Browser Session via REST API (Java)

Source: https://docs.firecrawl.dev/sdks/java

Initiates a new browser session using the Firecrawl Browser Sandbox REST API. It sends a POST request with session configuration (ttl, activityTtl) and requires the FIRECRAWL_API_KEY environment variable for authentication. The response contains session details like sessionId, cdpUrl, and liveViewUrl.

```java
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

HttpClient http = HttpClient.newHttpClient();

HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://api.firecrawl.dev/v2/browser"))
    .header("Authorization", "Bearer " + System.getenv("FIRECRAWL_API_KEY"))
    .header("Content-Type", "application/json")
    .POST(HttpRequest.BodyPublishers.ofString("{\"ttl\":120,\"activityTtl\":60}"))
    .build();

HttpResponse<String> response = http.send(request, HttpResponse.BodyHandlers.ofString());
System.out.println(response.body()); // contains session id, cdpUrl, liveViewUrl
```

--------------------------------

### Configure Firecrawl MCP Server in Cursor

Source: https://docs.firecrawl.dev/developer-guides/mcp-setup-guides/cursor

This JSON configuration snippet allows you to set up Firecrawl MCP within Cursor. It specifies the command to run, arguments, and environment variables, including your Firecrawl API key.

```json
{
  "mcpServers": {
    "firecrawl": {
      "command": "npx",
      "args": ["-y", "firecrawl-mcp"],
      "env": {
        "FIRECRAWL_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

--------------------------------

### Authentication and Error Handling

Source: https://docs.firecrawl.dev/pt-BR/api-reference/endpoint/crawl-params-preview

Details regarding the Bearer token authentication scheme and the standard error response format used by the API.

```APIDOC
## Authentication

### Description
This API uses Bearer Token authentication. Include your API key in the Authorization header.

### Security Scheme
- **Type**: http
- **Scheme**: bearer

---

## Error Handling

### Description
Standard error response format when a request fails to process.

### Response Structure
- **error** (string) - A description of the failure, e.g., "Failed to process natural language prompt"

### Response Example
{
  "error": "Failed to process natural language prompt"
}
```