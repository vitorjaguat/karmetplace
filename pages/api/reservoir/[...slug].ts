import { setParams } from '@reservoir0x/reservoir-sdk'
import type { NextApiRequest, NextApiResponse } from 'next'
import supportedChains, { DefaultChain } from 'utils/chains'
import { arbitrum, goerli, mainnet, optimism, zora } from 'wagmi/chains'
import wrappedContracts from 'utils/wrappedContracts'
import { zeroAddress } from 'viem'

// Add CORS headers function
function setCorsHeaders(res: NextApiResponse, origin?: string) {
  // Allow specific origins
  const allowedOrigins = [
    'https://karmetplace.thesphere.as',
    'https://karmetplace.vercel.app',
    'http://localhost:3000', // for development
    'http://localhost:3001', // if you use different ports
    'http://localhost:3002',
  ]

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  } else if (!origin) {
    // Fallback for requests without origin header
    res.setHeader(
      'Access-Control-Allow-Origin',
      'https://karmetplace.thesphere.as'
    )
  }

  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  )
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, x-api-key, x-rkc-version, x-rkui-version'
  )
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Max-Age', '86400') // 24 hours
}

// Request queue implementation
class RequestQueue {
  private queue: Array<{
    request: () => Promise<any>
    resolve: (value: any) => void
    reject: (error: any) => void
  }> = []
  private processing = false
  private lastRequestTime = 0
  private readonly RATE_LIMIT_DELAY = 500 // 500ms between requests (2 req/sec)

  async add<T>(requestFn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push({
        request: requestFn,
        resolve,
        reject,
      })
      this.processQueue()
    })
  }

  private async processQueue() {
    if (this.processing || this.queue.length === 0) return

    this.processing = true

    while (this.queue.length > 0) {
      const { request, resolve, reject } = this.queue.shift()!

      try {
        // Ensure we respect rate limits
        const now = Date.now()
        const timeSinceLastRequest = now - this.lastRequestTime

        if (timeSinceLastRequest < this.RATE_LIMIT_DELAY) {
          await this.sleep(this.RATE_LIMIT_DELAY - timeSinceLastRequest)
        }

        this.lastRequestTime = Date.now()
        const result = await request()
        resolve(result)
      } catch (error) {
        reject(error)
      }
    }

    this.processing = false
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}

// Global request queue instance
const requestQueue = new RequestQueue()

// Retry logic with exponential backoff
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries = 3,
  baseDelay = 1000
): Promise<Response> {
  let lastError: any

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options)

      // If rate limited (429) or server error (5xx), retry
      if (response.status === 429 || response.status >= 500) {
        if (attempt === maxRetries) {
          throw new Error(
            `Request failed after ${maxRetries + 1} attempts: ${
              response.status
            } ${response.statusText}`
          )
        }

        // Exponential backoff with jitter
        const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000
        console.warn(
          `Request failed (${
            response.status
          }), retrying in ${delay}ms... (attempt ${attempt + 1}/${
            maxRetries + 1
          })`
        )
        await new Promise((resolve) => setTimeout(resolve, delay))
        continue
      }

      return response
    } catch (error) {
      lastError = error

      if (attempt === maxRetries) {
        throw lastError
      }

      // Exponential backoff with jitter for network errors
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000
      console.warn(
        `Network error, retrying in ${delay}ms... (attempt ${attempt + 1}/${
          maxRetries + 1
        })`
      )
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  throw lastError
}

const allowedDomains = process.env.ALLOWED_API_DOMAINS
  ? process.env.ALLOWED_API_DOMAINS.split(',')
  : null

// https://nextjs.org/docs/api-routes/dynamic-api-routes#catch-all-api-routes
const proxy = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query, body, method, headers: reqHeaders } = req

  // Set CORS headers for all requests
  setCorsHeaders(res, req.headers.origin)

  // Handle preflight requests
  if (method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (allowedDomains && allowedDomains.length > 0) {
    let origin = req.headers.origin || req.headers.referer || ''
    try {
      origin = new URL(origin).origin
    } catch (e) {
      console.error('Invalid origin:', e)
      res.status(403).json({ error: 'Access forbidden' })
      return
    }
    if (!origin.length || !allowedDomains.includes(origin)) {
      res.status(403).json({ error: 'Access forbidden' })
      return
    }
  }

  const { slug } = query
  // Isolate the query object
  delete query.slug

  let endpoint: string = ''

  // convert the slug array into a path string: [a, b] -> 'a/b'
  if (typeof slug === 'string') {
    endpoint = slug
  } else {
    endpoint = (slug || ['']).join('/')
  }

  const chainPrefix = endpoint.split('/')[0]
  const chain =
    supportedChains.find((chain) => chain.routePrefix === chainPrefix) ||
    DefaultChain

  const url = new URL(endpoint.replace(chainPrefix, ''), chain.reservoirBaseUrl)
  setParams(url, query)

  if (endpoint.includes('redirect/')) {
    // Redirect eth and weth currency icons to self-hosted
    // versions without any padding
    endpoint = endpoint.toLowerCase()
    if (
      [
        mainnet.id as number,
        goerli.id,
        zora.id,
        optimism.id,
        arbitrum.id,
      ].includes(chain.id) &&
      endpoint.includes('currency')
    ) {
      if (endpoint.includes(zeroAddress)) {
        res.redirect('/icons/currency/no-padding-eth.png')
        return
      } else if (
        endpoint.includes(wrappedContracts['1'].toLowerCase()) ||
        endpoint.includes(wrappedContracts['5'].toLowerCase())
      ) {
        res.redirect('/icons/currency/no-padding-weth.png')
        return
      }
    }
    res.redirect(url.href)
    return
  } else if (endpoint.match(/\/users\/(\w+)\/tokens\/v7/g)) {
    if (url.searchParams.get('limit') === '198') {
      res.status(403).json({ error: 'Access forbidden' })
      return
    }
  }

  try {
    // Queue the request to respect rate limits
    const result = await requestQueue.add(async () => {
      const options: RequestInit = {
        method,
      }

      const headers = new Headers({
        Referrer: reqHeaders['referer'] || reqHeaders['origin'] || '',
        Origin: 'https://explorer-proxy.reservoir.tools',
      })

      if (process.env.RESERVOIR_API_KEY)
        headers.set('x-api-key', process.env.RESERVOIR_API_KEY)

      if (typeof body === 'object') {
        headers.set('Content-Type', 'application/json')
        options.body = JSON.stringify(body)
      }

      if (
        reqHeaders['x-rkc-version'] &&
        typeof reqHeaders['x-rkc-version'] === 'string'
      ) {
        headers.set('x-rkc-version', reqHeaders['x-rkc-version'])
      }

      if (
        reqHeaders['x-rkui-version'] &&
        typeof reqHeaders['x-rkui-version'] === 'string'
      ) {
        headers.set('x-rkui-version', reqHeaders['x-rkui-version'])
      }

      options.headers = headers

      // Use retry logic for the actual fetch
      const response = await fetchWithRetry(url.href, options, 3, 1000)

      let data: any
      const contentType = response.headers.get('content-type')
      const cacheControl = response.headers.get('cache-control')

      if (contentType?.includes('application/json')) {
        data = await response.json()
      } else {
        data = await response.text()
      }

      if (!response.ok) throw data

      return {
        data,
        contentType,
        cacheControl,
        status: response.status,
      }
    })

    // Set cache control header if present
    if (result.cacheControl) {
      res.setHeader('cache-control', result.cacheControl)
    }

    if (result.contentType?.includes('image/')) {
      res.setHeader('Content-Type', 'text/html')
      res.status(result.status).send(Buffer.from(result.data))
    } else {
      res.status(result.status).json(result.data)
    }
  } catch (error: any) {
    console.error('Reservoir API error:', error)

    // Handle specific error types
    if (
      (error?.message &&
        (error?.message?.includes('429') ||
          error?.message?.includes('rate limit'))) ||
      error?.message?.includes('many requests')
    ) {
      res.status(429).json({
        error: 'Rate limit exceeded. Please try again later.',
        retryAfter: 2, // seconds
      })
    } else {
      res.status(400).json(error)
    }
  }
}

export default proxy
