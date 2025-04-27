import * as dotenv from 'dotenv';
import axios from 'axios';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

// Load environment variables
dotenv.config();

// Debug: print environment variables
console.error('Environment variables:');
console.error(`SHOPIFY_STORE_URL: "${process.env.SHOPIFY_STORE_URL}"`);
console.error(`SHOPIFY_API_VERSION: "${process.env.SHOPIFY_API_VERSION}"`);
console.error(`SHOPIFY_ACCESS_TOKEN: "${process.env.SHOPIFY_ACCESS_TOKEN?.substring(0, 5)}..."`);

// You should create a .env file with these values
const SHOPIFY_STORE_URL = process.env.SHOPIFY_STORE_URL || '';
const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION || '2024-04';
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN || '';

// Debug: print base URL
const baseURL = `https://${SHOPIFY_STORE_URL}/admin/api/${SHOPIFY_API_VERSION}`;
console.error(`Base URL: "${baseURL}"`);

// Create a new MCP server
const server = new McpServer({
  name: 'shopify-mcp-server-node',
  version: '1.0.0'
});

// Setup Shopify API client
const shopifyClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN
  }
});

// Shopify Tools

// Get Products
server.tool(
  'get_products',
  'Get a list of products from the Shopify store',
  {
    limit: z.number().describe('Maximum number of products to return (default: 50)').default(50).optional(),
  },
  async ({ limit }) => {
    try {
      const endpoint = `products.json?limit=${limit || 50}`;
      console.error(`Requesting: ${baseURL}/${endpoint}`);
      console.error(`Corrected URL: ${baseURL}${endpoint}`);
      const response = await shopifyClient.get(endpoint);
      console.error(`Response status: ${response.status}`);
      return {
        content: [{ type: 'text', text: JSON.stringify(response.data.products, null, 2) }]
      };
    } catch (error) {
      console.error(`Error details:`, error);
      const errorMessage = axios.isAxiosError(error) 
        ? `Error fetching products: ${error.message}` 
        : `Unknown error occurred: ${String(error)}`;
      
      return { content: [{ type: 'text', text: errorMessage }], isError: true };
    }
  }
);

// Get Product Details
server.tool(
  'get_product_details',
  'Get detailed information about a specific product',
  {
    product_id: z.string().describe('ID of the product to fetch')
  },
  async ({ product_id }) => {
    try {
      const endpoint = `products/${product_id}.json`;
      console.error(`Requesting: ${baseURL}/${endpoint}`);
      const response = await shopifyClient.get(endpoint);
      return {
        content: [{ type: 'text', text: JSON.stringify(response.data.product, null, 2) }]
      };
    } catch (error) {
      const errorMessage = axios.isAxiosError(error) 
        ? `Error fetching product: ${error.message}` 
        : `Unknown error occurred: ${String(error)}`;
      
      return { content: [{ type: 'text', text: errorMessage }], isError: true };
    }
  }
);

// Get Orders
server.tool(
  'get_orders',
  'Get a list of orders from the Shopify store',
  {
    limit: z.number().describe('Maximum number of orders to return (default: 50)').default(50).optional(),
    status: z.string().describe('Filter orders by status (open, closed, cancelled, any)').optional()
  },
  async ({ limit, status }) => {
    try {
      let endpoint = `orders.json?limit=${limit || 50}`;
      
      if (status) {
        endpoint += `&status=${status}`;
      }
      
      console.error(`Requesting: ${baseURL}/${endpoint}`);
      const response = await shopifyClient.get(endpoint);
      return {
        content: [{ type: 'text', text: JSON.stringify(response.data.orders, null, 2) }]
      };
    } catch (error) {
      const errorMessage = axios.isAxiosError(error) 
        ? `Error fetching orders: ${error.message}` 
        : `Unknown error occurred: ${String(error)}`;
      
      return { content: [{ type: 'text', text: errorMessage }], isError: true };
    }
  }
);

// Get Customers
server.tool(
  'get_customers',
  'Get a list of customers from the Shopify store',
  {
    limit: z.number().describe('Maximum number of customers to return (default: 50)').default(50).optional()
  },
  async ({ limit }) => {
    try {
      const endpoint = `customers.json?limit=${limit || 50}`;
      console.error(`Requesting: ${baseURL}/${endpoint}`);
      const response = await shopifyClient.get(endpoint);
      return {
        content: [{ type: 'text', text: JSON.stringify(response.data.customers, null, 2) }]
      };
    } catch (error) {
      const errorMessage = axios.isAxiosError(error) 
        ? `Error fetching customers: ${error.message}` 
        : `Unknown error occurred: ${String(error)}`;
      
      return { content: [{ type: 'text', text: errorMessage }], isError: true };
    }
  }
);

// Search Products
server.tool(
  'search_products',
  'Search for products by title, vendor, or tags',
  {
    query: z.string().describe('Search query to find products'),
    limit: z.number().describe('Maximum number of products to return (default: 50)').default(50).optional()
  },
  async ({ query, limit }) => {
    try {
      const endpoint = `products.json?limit=${limit || 50}&title=${encodeURIComponent(query)}`;
      console.error(`Requesting: ${baseURL}/${endpoint}`);
      const response = await shopifyClient.get(endpoint);
      return {
        content: [{ type: 'text', text: JSON.stringify(response.data.products, null, 2) }]
      };
    } catch (error) {
      const errorMessage = axios.isAxiosError(error) 
        ? `Error searching products: ${error.message}` 
        : `Unknown error occurred: ${String(error)}`;
      
      return { content: [{ type: 'text', text: errorMessage }], isError: true };
    }
  }
);

// Start the server with stdio transport
const transport = new StdioServerTransport();
server.connect(transport);

console.error('Shopify MCP Server started');
