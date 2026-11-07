// Hypothetical experiment designs. No test has been run and no results exist.
export const RESULTS_NOTICE =
  'Results are hypothetical until actual testing occurs. No real visitors, clicks, or conversions have been measured.';

export const experiments = [
  {
    id: 'exp-a',
    name: 'Experiment A: Driver headline',
    audience: 'driver',
    audienceLabel: 'Drivers (free)',
    hypothesis:
      'A headline that names the driver pain (circling) will earn more clicks to /parking than a headline that names the feature (lot map).',
    variants: {
      A: { label: 'Variant A', text: 'Stop circling. See open spaces before you arrive.' },
      B: { label: 'Variant B', text: 'A simple lot map of open and taken spaces. Free for drivers.' },
    },
    successMetric: 'Click-through rate from the headline to /parking (higher is better).',
  },
  {
    id: 'exp-b',
    name: 'Experiment B: Owner call to action',
    audience: 'owner',
    audienceLabel: 'Lot owners (paid)',
    hypothesis:
      'A low-commitment call to action (try the simulator) will lead more lot owners to open /pricing than a direct subscription call to action.',
    variants: {
      A: { label: 'Variant A', text: 'Try the pricing simulator' },
      B: { label: 'Variant B', text: 'Subscribe as a lot owner' },
    },
    successMetric: 'Share of owner-audience visitors who open /pricing and use the simulator (higher is better).',
  },
];
