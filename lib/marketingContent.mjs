// Launch copy for the prototype. No customer results or live-data guarantees are claimed.
export const audiences = {
  driver: { label: 'Drivers', note: 'Free to use' },
  owner: { label: 'Lot owners', note: 'Paid subscription' },
};

export const posts = [
  {
    id: 'ig-1', platform: 'Instagram', audience: 'driver',
    title: 'Circling is optional',
    body: "Circling the block for a spot is nobody's favorite part of the day.\n\nParkNow shows a lot map with available and occupied spaces so you can pick a lot with a plan. Free for drivers.\n\nPrototype note: occupancy shown is simulated until sensors are connected.\n\n#ParkNow #Parking #CommuteSmarter",
  },
  {
    id: 'ig-2', platform: 'Instagram', audience: 'owner',
    title: 'Price with a plan',
    body: "Lot owners: before you change a rate, test it.\n\nThe ParkNow pricing simulator lets you compare scenarios side by side so decisions are not guesses. Owner plans are subscription-based.\n\nSee Pricing on the ParkNow site.\n\n#ParkingBusiness #SmallBusiness #ParkNow",
  },
  {
    id: 'fb-1', platform: 'Facebook', audience: 'driver',
    title: 'Know before you go',
    body: "Heading downtown? Check the lot first.\n\nParkNow gives drivers a simple visual of open and taken spaces, and it costs drivers nothing. We are an early prototype, so lot data is simulated for now.\n\nTry it: open the Live Parking page.",
  },
  {
    id: 'fb-2', platform: 'Facebook', audience: 'owner',
    title: 'Run your lot with clarity',
    body: "Own or manage a parking lot?\n\nParkNow helps you show drivers where space is available and explore pricing scenarios before committing to changes. Drivers use it free; lot owners subscribe.\n\nWe are building with early lot operators. Want to talk? Message us.",
  },
  {
    id: 'li-1', platform: 'LinkedIn', audience: 'owner',
    title: 'Parking is an operations problem',
    body: "Parking lot revenue depends on two things: how full the lot is and what you charge.\n\nParkNow is a student-built prototype that pairs a driver-facing lot view with an owner-facing pricing simulator. Drivers use it free. Owners pay for the subscription tools.\n\nWe have not published customer results because we are still in the prototype stage. We are looking for lot operators willing to give feedback.\n\n#Parking #SmallBusiness #Startups",
  },
  {
    id: 'li-2', platform: 'LinkedIn', audience: 'driver',
    title: 'Campus and office commuters',
    body: "For campuses and offices, parking uncertainty is a daily friction for commuters.\n\nParkNow is exploring a free driver experience: a clear view of open and occupied spaces in a lot, built on simulated data for now and designed to connect to real sensors later.\n\nFeedback from facility teams is welcome.\n\n#Commuting #Campus #Workplace",
  },
  {
    id: 'tt-1', platform: 'TikTok', audience: 'driver',
    title: 'POV: you found a spot',
    body: "POV: you checked the lot before you left.\n\nNo circling. No stress. ParkNow is free for drivers.\n\nDemo uses simulated data.\n\n#parking #commute #ParkNow #citylife",
  },
  {
    id: 'tt-2', platform: 'TikTok', audience: 'owner',
    title: 'Lot owner reality check',
    body: "Still setting parking prices by gut feeling?\n\nTest scenarios in the ParkNow pricing simulator first. Subscription for lot owners, free for drivers.\n\n#smallbusiness #parkinglot #pricing #ParkNow",
  },
  {
    id: 'ig-3', platform: 'Instagram', audience: 'driver',
    title: 'Green = go',
    body: "Green means open. Red means taken.\n\nThat is the whole idea behind the ParkNow lot map. Simple, visual, free for drivers.\n\n(Simulated sample data in this prototype.)\n\n#ParkNow #ParkingMadeEasy",
  },
  {
    id: 'li-3', platform: 'LinkedIn', audience: 'owner',
    title: 'Two audiences, one model',
    body: "Our model is simple: drivers use ParkNow for free, which gives lots a reason to be listed and visible. Lot owners pay a subscription for the tools that help them manage and price their lot.\n\nIf you operate a lot and want to try the pricing simulator, we would like your feedback.\n\n#BusinessModel #Parking #Startups",
  },
];

export const scripts = [
  {
    id: 'v-1', audience: 'driver', title: 'Stop circling', length: '20-25 sec',
    hook: 'You have been circling this block for ten minutes. There is a better way.',
    scenes: [
      'Driver glances at the clock while passing full lots.',
      'Phone screen shows the ParkNow lot map: green open spaces, red taken ones.',
      'Driver turns into the lot with open spaces and parks.',
    ],
    narration: 'Parking should not be a guessing game. ParkNow shows open and taken spaces on a lot map, so you can head to a lot with a plan. Free for drivers. This demo uses simulated data.',
    cta: 'Open ParkNow and find parking. Free for drivers.',
  },
  {
    id: 'v-2', audience: 'owner', title: 'Test your prices', length: '25-30 sec',
    hook: 'Changing your parking rates? Do not guess.',
    scenes: [
      'Lot owner at a desk looking at a notebook of rates.',
      'Screen recording of the pricing simulator comparing scenarios.',
      'Owner nods and writes down the chosen scenario.',
    ],
    narration: 'The ParkNow pricing simulator lets you compare scenarios before you change anything. Results are projections based on the numbers you enter, not guarantees. Owner plans are a subscription.',
    cta: 'Visit the ParkNow pricing page and try the simulator.',
  },
  {
    id: 'v-3', audience: 'both', title: 'Free for drivers, built for owners', length: '30 sec',
    hook: 'One app. Two sides of the parking lot.',
    scenes: [
      'Split screen: driver on the left, lot owner on the right.',
      'Left: driver views the lot map. Right: owner reviews the dashboard.',
      'Both screens merge into the ParkNow logo.',
    ],
    narration: 'Drivers use ParkNow free to see open spaces. Lot owners subscribe for tools that help them manage and price their lot. We are an early prototype, and lot data is simulated for now.',
    cta: 'Drivers: find parking. Owners: see pricing. Both at ParkNow.',
  },
];
