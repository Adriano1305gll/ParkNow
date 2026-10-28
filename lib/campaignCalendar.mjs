// Editable 14-day plan. contentRef points to an id in lib/marketingContent.js (posts or scripts).
// Messages are draft copy; parking availability is simulated and no customer results are claimed.
export const audienceLabels = {
  driver: 'Drivers (free)',
  owner: 'Lot owners (paid)',
  both: 'Drivers (free) + Lot owners (paid)',
};

export const campaignDays = [
  { day: 1, platform: 'Instagram', audience: 'driver', format: 'Image post', objective: 'Introduce ParkNow to drivers', message: 'Circling is optional: see open and taken spaces on a simulated lot map.', cta: 'Open Live Parking', href: '/parking', contentRef: 'ig-1' },
  { day: 2, platform: 'LinkedIn', audience: 'owner', format: 'Text post', objective: 'Explain the owner value and subscription model', message: 'Parking is an operations problem: lot visibility plus pricing tools for owners.', cta: 'View Pricing', href: '/pricing', contentRef: 'li-1' },
  { day: 3, platform: 'TikTok', audience: 'driver', format: 'Short video', objective: 'Reach commuters with a relatable hook', message: 'You have been circling for ten minutes. There is a better way (demo uses simulated data).', cta: 'Find Parking', href: '/parking', contentRef: 'v-1' },
  { day: 4, platform: 'Facebook', audience: 'owner', format: 'Text post', objective: 'Start conversations with lot operators', message: 'Run your lot with clarity: show drivers space and explore pricing scenarios.', cta: 'Message us to share feedback', href: '/product', contentRef: 'fb-2' },
  { day: 5, platform: 'Instagram', audience: 'driver', format: 'Image post', objective: 'Teach the green-and-red lot map', message: 'Green means open, red means taken. Simple and free for drivers.', cta: 'Find Parking', href: '/parking', contentRef: 'ig-3' },
  { day: 6, platform: 'TikTok', audience: 'owner', format: 'Text-on-video post', objective: 'Hook owners on pricing by gut feeling', message: 'Still setting parking prices by gut feeling? Test scenarios first.', cta: 'Try the pricing simulator', href: '/pricing', contentRef: 'tt-2' },
  { day: 7, platform: 'Instagram Reels', audience: 'both', format: 'Short video', objective: 'Explain the two-sided model', message: 'One app, two sides of the lot: free for drivers, subscription tools for owners.', cta: 'See how it works', href: '/product', contentRef: 'v-3' },
  { day: 8, platform: 'Facebook', audience: 'driver', format: 'Text post', objective: 'Encourage drivers to check the lot first', message: 'Heading downtown? Check the lot first. Free for drivers; data is simulated for now.', cta: 'Open Live Parking', href: '/parking', contentRef: 'fb-1' },
  { day: 9, platform: 'Instagram', audience: 'owner', format: 'Image post', objective: 'Promote the pricing simulator', message: 'Before you change a rate, test it with side-by-side scenarios.', cta: 'View Pricing', href: '/pricing', contentRef: 'ig-2' },
  { day: 10, platform: 'LinkedIn', audience: 'driver', format: 'Text post', objective: 'Reach campus and office facility teams', message: 'Parking uncertainty is daily friction for commuters; a free driver view of open spaces.', cta: 'Explore the product', href: '/product', contentRef: 'li-2' },
  { day: 11, platform: 'TikTok', audience: 'owner', format: 'Short video', objective: 'Show owners how scenario testing works', message: 'Compare pricing scenarios before changing anything. Results are projections, not guarantees.', cta: 'Try the pricing simulator', href: '/pricing', contentRef: 'v-2' },
  { day: 12, platform: 'TikTok', audience: 'driver', format: 'Short video', objective: 'Drive trial among commuters', message: 'POV: you checked the lot before you left. Demo uses simulated data.', cta: 'Find Parking', href: '/parking', contentRef: 'tt-1' },
  { day: 13, platform: 'LinkedIn', audience: 'both', format: 'Text post', objective: 'Explain why free drivers support paying owners', message: 'Drivers use ParkNow free; owners subscribe for management and pricing tools.', cta: 'See the marketing plan', href: '/marketing', contentRef: 'li-3' },
  { day: 14, platform: 'Facebook', audience: 'owner', format: 'Text post', objective: 'Close the campaign with a clear owner invitation', message: 'Own a lot? Try the pricing simulator and tell us what would make it useful.', cta: 'View Pricing', href: '/pricing', contentRef: 'fb-2' },
];
