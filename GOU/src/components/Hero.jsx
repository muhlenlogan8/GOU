import React from "react";

const Hero = () => {
	return (
		<div className="border-b border-n-14 relative overflow-hidden sm:h-180">
			<div className="relative isolate px-6 pt-14 lg:px-8">
				<div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-58">
					<div className="text-center">
						<h1 className="text-4xl font-bold">GOU</h1>
						<p className="mt-4 text-lg">
							Geoguesser for campus, buildings, companies, other locations
						</p>
						<div className="mt-10 flex items-center justify-center gap-x-6">
							<a
								href="/play"
								className="rounded-lg bg-slate-600 px-3.5 py-2.5 text-sm font-semibold text-n-14 shadow-sm hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
							>
								Start Now
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Hero;
