import { FaBrain, FaHandsHelping } from "react-icons/fa";
import { motion } from "framer-motion";
import { useRef } from "react";

const Mission = () => {
	const educationRef = useRef(null);
	const socialRef = useRef(null);

	// Card Animation Variants
	const cardVariants = {
		hidden: {
			opacity: 0,
			y: 50,
		},
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.6,
				ease: "easeOut",
			},
		},
	};

	return (
		<section id="our-mission" className="py-12 px-4 bg-blue-50">
			<div className="max-w-7xl mx-auto text-center">
				<h2 className="text-2xl sm:text-3xl lg:text-4xl text-black font-semibold">
					Our Mission
				</h2>
				<p className="mt-4 text-lg text-gray-700">
					Uni-Guesser aims to create an accessible, immersive, and engaging
					campus exploration game that tackles both educational and social
					issues within our campus community.
				</p>
			</div>

			<div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-8">
				{/* Education Card Animated */}
				<motion.div
					ref={educationRef}
					variants={cardVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-100px" }}
					className="bg-white p-6 rounded-lg shadow-lg"
				>
					{/* Actual html to be animated */}
					<div className="flex items-center justify-start gap-6">
						<FaBrain className="text-9xl text-pink-600" />
						<div className="flex flex-col justify-center">
							<h3 className="text-xl font-semibold text-gray-900">
								Transforming Education
							</h3>
							<p className="mt-4 text-gray-700">
								Uni-Guesser enhances the student learning experience by
								introducing campus resources. It helps students discover new
								academic and mental health resources through interactive and
								immersive gameplay.
							</p>
						</div>
					</div>
				</motion.div>
				{/* Social Issues Card Animated */}
				<motion.div
					ref={socialRef}
					variants={cardVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-100px" }}
					className="bg-white p-6 rounded-lg shadow-lg"
				>
					{/* Actual html to be animated */}
					<div className="flex items-center justify-start gap-6">
						<FaHandsHelping className="text-9xl text-green-600" />
						<div className="flex flex-col justify-center">
							<h3 className="text-xl font-semibold text-gray-900">
								Addressing Social Issues
							</h3>
							<p className="mt-4 text-gray-700">
								Uni-Guesser encourages students to compete with others on their
								knowledge of various campus locations, leading to exploration.
								Overall, it fosters a more connected and supportive university
								environment.
							</p>
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
};

export default Mission;
