import { useState, useEffect } from "react";
import logo from "../assets/UniGuesser_Logo.png";

const Header = ({ handlePlayClick }) => {
	const [textColor, setTextColor] = useState("rgb(255, 255, 255)");

	// Change text color based on scroll position
	useEffect(() => {
		const handleScroll = () => {
			const scrollTop = window.scrollY;
			const maxScroll =
				document.documentElement.scrollHeight - window.innerHeight;

			const gradientStart = maxScroll / 3;
			const gradientEnd = (maxScroll * 2) / 3;
			const adjustedScroll = Math.max(0, scrollTop - gradientStart);
			const gradientRange = gradientEnd - gradientStart;
			const scrollPercentage = Math.min(adjustedScroll / gradientRange, 1);

			const grayValue = Math.floor(255 - scrollPercentage * 255);
			const color = `rgb(${grayValue}, ${grayValue}, ${grayValue})`;
			setTextColor(color);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// Smooth scroll to anchor links and add offset
	const handleAnchorClick = (e, targetId) => {
		e.preventDefault();
		const targetElement = document.getElementById(targetId);
		if (targetElement) {
			const headerOffset = 80;
			const elementPosition = targetElement.getBoundingClientRect().top;
			const offsetPosition = elementPosition + window.scrollY - headerOffset;

			window.scrollTo({
				top: offsetPosition,
				behavior: "smooth",
			});
		}
	};

	return (
		<header
			className="fixed top-0 left-0 right-0 backdrop-blur-2xl border-b border-gray-300 bg-transparent z-20"
			style={{ color: textColor }}
		>
			<nav
				aria-label="Global"
				className="mx-auto flex max-w-7xl items-center justify-between p-3 lg:px-8"
			>
				<div className="flex items-center">
					<a href="#" className="-m-1.5 p-1.5">
						<span className="sr-only">Uni-Guesser</span>
						<img width={40} height={40} src={logo} alt="Uni-Guesser Logo" />
					</a>
				</div>

				{/* Links for larger screens */}
				<div className="hidden md:flex flex-1 justify-center gap-x-12">
					<a
						href="#our-mission"
						onClick={(e) => handleAnchorClick(e, "our-mission")}
						className="text-xl font-semibold leading-6 hover:text-n-5 hover:underline"
					>
						Our Mission
					</a>
					<a
						href="#meet-the-team"
						onClick={(e) => handleAnchorClick(e, "meet-the-team")}
						className="text-xl font-semibold leading-6 hover:text-n-5 hover:underline"
					>
						Meet the Team
					</a>
				</div>

				{/* Play Game button - always visible */}
				<div className="flex items-center justify-end flex-1 md:flex-none">
					<button
						onClick={handlePlayClick}
						className="text-xl font-semibold leading-6 hover:text-n-5 hover:underline"
					>
						Play Game
					</button>
				</div>
			</nav>
		</header>
	);
};

export default Header;
