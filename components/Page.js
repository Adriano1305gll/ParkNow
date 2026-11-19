export default function Page({ eyebrow, title, subtitle, children }) {
	return (
		<section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-14">
			<p className="mb-3 text-sm font-semibold uppercase tracking-[.2em] text-emerald-400">
				{eyebrow}
			</p>
			<h1 className="max-w-4xl text-3xl font-bold tracking-tight sm:text-4xl md:text-6xl">{title}</h1>
			{subtitle && <p className="mt-4 max-w-3xl text-base sm:text-lg text-slate-300">{subtitle}</p>}
			<div className="mt-6 sm:mt-8 text-slate-300">{children}</div>
		</section>
	);
}
