'use client';

import Link from 'next/link';

const groups = [
	{
		label: 'Explore',
		links: [['/', 'Home'], ['/parking', 'Live Parking'], ['/research', 'Research']],
	},
	{
		label: 'Plan',
		links: [['/product', 'Product'], ['/pricing', 'Pricing'], ['/core', 'Plan a trip']],
	},
	{
		label: 'Operate',
		links: [['/dashboard', 'Dashboard'], ['/assistant', 'Assistant']],
	},
	{
		label: 'Learn',
		links: [['/marketing', 'Marketing'], ['/docs', 'Docs'], ['/demo', 'Demo']],
	},
];

export default function Nav() {
	return (
		<header className="site-header">
			<div className="nav-shell">
				<Link href="/" className="brand" aria-label="Park Now home">
					PARK <span>NOW</span>
				</Link>
				<div className="nav-groups" role="navigation" aria-label="Primary navigation">
					{groups.map((group) => (
						<div className="nav-group" key={group.label}>
							<span className="nav-group-label">{group.label}</span>
							<div className="nav-links">
								{group.links.map(([href, label]) => (
									<Link key={href} href={href}>
										{label}
									</Link>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</header>
	);
}
