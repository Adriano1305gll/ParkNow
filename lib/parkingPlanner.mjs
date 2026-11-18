const parkingOptions = [
  {
    name: 'Central Garage',
    costPerHour: 3,
    walkingMinutes: 6,
    accessible: true,
    capacity: 'high',
  },
  {
    name: 'Market Street Lot',
    costPerHour: 2,
    walkingMinutes: 11,
    accessible: true,
    capacity: 'medium',
  },
  {
    name: 'Riverside Overflow',
    costPerHour: 1,
    walkingMinutes: 18,
    accessible: false,
    capacity: 'low',
  },
];

export function getEstimatedCost(option, duration) {
  return Math.ceil(duration / 60) * option.costPerHour;
}

export function isPositiveNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0;
}

export function buildPlan(form) {
  const duration = Number(form.duration);
  const walkingTime = Number(form.walkingTime);
  const budget = Number(form.budget);
  const accessibleOnly = form.accessibility !== 'None';

  const eligibleOptions = parkingOptions.filter((option) => {
    return (
      option.walkingMinutes <= walkingTime &&
      getEstimatedCost(option, duration) <= budget &&
      (!accessibleOnly || option.accessible)
    );
  });

  const rankedOptions = [...eligibleOptions].sort((first, second) => {
    const firstScore =
      first.walkingMinutes + getEstimatedCost(first, duration) * 2;
    const secondScore =
      second.walkingMinutes + getEstimatedCost(second, duration) * 2;
    return firstScore - secondScore;
  });

  const bestOption = rankedOptions[0];
  const backupOption = rankedOptions[1] || parkingOptions.find(
    (option) => option.name !== bestOption?.name
  );

  if (!bestOption) {
    return {
      unavailable: true,
      backupOption,
      risks: [
        'No simulated option meets every constraint.',
        'Try increasing the budget or maximum walking time.',
      ],
    };
  }

  const reasons = [
    `${bestOption.walkingMinutes} minutes from your destination`,
    `$${getEstimatedCost(bestOption, duration)} estimated cost`,
  ];

  if (accessibleOnly) {
    reasons.push('matches your accessibility requirement');
  }

  return {
    bestOption,
    backupOption,
    estimatedCost: getEstimatedCost(bestOption, duration),
    walkingMinutes: bestOption.walkingMinutes,
    why: `It fits because it offers ${reasons.join(', ')}.`,
    risks: [
      bestOption.capacity === 'low'
        ? 'Lower simulated capacity may make this option less reliable.'
        : 'Availability may change before arrival.',
      'Travel time and final parking charges are not simulated.',
    ],
  };
}
