export default [
  // '0x69b377c8dddc25ae26c422d39b45744bb67aab4b', //Spherical GeNFT (mainnet)
  // '0xe27f011e8eb90b4d42fa7658fbe44e240d9c5f03', // GRAFS (Zora)
  // '0x01a8c25b7f28443875d982c8236c59699ce70dd9', // A test for The Sphere (Goerli)
  // '0x9523e213d3929be2c6f48e5dafe2b8a3d4fd3e39', // sapo (mainnet)
  // '0x95520e629368c3a08ec6b4d070a130ee72f6e471', // THE SPHERE KARMIC OBJECTS — FIRST CYCLE (mainnet) (OLD)
  // '0xfc599d7ad9255f7d60f84b4ab64ef8080453b767', // THE ANARCHIVING GAME (zora) (OLD)
  '0x39f7e5bdfb46bf321b8df7803070d27d79361400', // THE SPHERE KARMIC OBJECTS — FIRST CYCLE (mainnet) (NEW)
  // '0xe5a192aaf911c35fb47de1342e768ef01c84fa09', // THE ANARCHIVING GAME (zora) (NEW)
  // '0xf4a007c9f55F2a619002397338091e6D3f3F3453', // Faucet TEST
]
const msg = `
Hi folks,

We were surprised to hear that the Reservoir NFT Explorer will be sunset soon — thank you for all the amazing work so far.

In the meantime, we’re continuing to use Reservoir as the backbone of our marketplace, Karmetplace (https://karmetplace.thesphere.as), and we’re currently preparing for a few events in the coming weeks that might bring increased user activity — including listing, browsing, and (hopefully) purchasing NFTs.

We’ve noticed that the current request rate limit on the free tier (2 requests/sec) is causing some issues, particularly with the BuyModal component. Often, users see the message “Selected item is no longer available” even when the item is still live, and we’ve traced this to a 404 error in the DevTools console that reads:

“This request was blocked as you have sent too many requests within the specified time. Max 2 requests in 1 s.”

The failed request points to this endpoint:
https://karmetplace.thesphere.as/api/reservoir/ethereum/execute/buy/v7

We understand that higher tiers are available — but at the moment, our small-scale project isn’t able to meet the cost of the Pro plan. That said, we’d be extremely grateful if there’s any possibility of temporarily increasing our rate limit — or alternatively, if you could advise us on a possible workaround to prevent this error programmatically. Any guidance or suggestions that could help us ensure a smoother experience for our users during this active period would be deeply appreciated. Our codebase: https://github.com/vitorjaguat/karmetplace 

Thanks so much in advance, and please let us know if any other information is needed from our side.

All the best,
Vitor Jaguat and The Sphere Team
`
