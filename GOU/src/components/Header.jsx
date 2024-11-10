import React from "react";

const Header = () => {
	return (
		<header className="sticky top-0 inset-x-0 flex flex-wrap md:justify-start md:flex-nowrap z-50 w-full text-sm">
			<nav
				aria-label="Global"
				className="mt-4 relative max-w-2xl w-full bg-white border border-gray-200 rounded-[2rem] mx-2 py-2.5 md:flex md:items-center md:justify-between md:py-0 md:px-4 md:mx-auto dark:bg-neutral-900 dark:border-neutral-700"
			>
				<div className="lg:flex lg:flex-1 lg:justify-start z-20">
					<h1 className="text-3xl font-bold">Name</h1>
				</div>
				<div className="lg:flex lg:flex-1 lg:justify-end z-20">
					<p className="text-2xl font-bold">Score: 0</p>
				</div>
			</nav>
		</header>
	);
};

export default Header;