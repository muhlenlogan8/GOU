import { useState } from "react";
import Devpost from "../assets/devpost.svg";
import DevpostHover from "../assets/devpostHover.svg";

const Footer = () => {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<footer className="w-full py-3 px-4 sm:px-6 lg:px-8 bg-n-6 border-t border-n-4">
			<div className="flex flex-col items-center text-center">
				<div className="mt-2 flex">
					<p className="mr-2 text-white">Developed For MakeUC 2024</p>
					<a
						href="https://devpost.com/software/uni-guesser"
						target="_blank"
						rel="noopener noreferrer"
						className="-m-1 p-1"
					>
						<span className="sr-only">Devpost</span>
            {/* On hover change image to hovered version of image */}
						<img
							width={20}
							height={20}
							src={isHovered ? DevpostHover : Devpost}
							alt="Devpost"
							onMouseEnter={() => setIsHovered(true)}
							onMouseLeave={() => setIsHovered(false)}
						/>
					</a>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
