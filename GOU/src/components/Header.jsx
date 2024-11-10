import React from "react";

const Header = () => {
	return (
		<header className="top-0 left-0 right-0 border-b border-white/10 z-10 bg-blue-100">
			<nav
				aria-label="Global"
				className="mx-auto flex max-w-7xl items-center justify-between p-3 lg:px-8"
			>
				<div className="absolute inset-x-0 flex justify-center items-center">
					<h1 className="text-3xl font-bold text-black">GOU</h1>
				</div>
				<div className="lg:flex lg:flex-1 lg:justify-start z-20">
					<p className="text-lg font-semibold leading-6 text-black">Score: 0</p>
				</div>
				<div className="lg:flex lg:flex-1 lg:justify-end z-20">
					<a
						href="/"
						className="rounded-lg bg-slate-600 px-3.5 py-2.5 text-sm font-semibold text-n-14 shadow-sm hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
					>
						home
					</a>
				</div>
			</nav>
		</header>
	);
};

export default Header;
