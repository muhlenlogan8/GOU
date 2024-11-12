import { motion } from "framer-motion";
import { useRef } from "react";
import TestimonialCard from "./subcomponents/TestimonialCard";
import LoganImage from "../assets/Logan.jpg";
import CameranImage from "../assets/Cameran.jpg";
import AndyImage from "../assets/Andy.jpg";

const Testimonial = () => {
	const testimonials = [
		{
			imageSrc: LoganImage,
			name: "Logan Muhlen",
			title: "Computer Engineering Student",
			testimonial:
				"I'm a fourth-year computer engineering student who loves doing personal projects, hackathons, and indoor soccer. This is my 3th hackathon with this team and we are really excited with how this turned out.",
			linkedInUrl: "https://www.linkedin.com/in/logan-muhlen-54a53b131/",
		},
		{
			imageSrc: CameranImage,
			name: "Cameran Beason",
			title: "Mechanical Engineering Student",
			testimonial:
				"I'm a fourth-year mechanical engineering student with work experience in data analysis, embedded firmware, and controls.  My hobbies include finance, spending time with friends and family, and playing video games.",
			linkedInUrl: "https://www.linkedin.com/in/cameran-beason/",
		},
		{
			imageSrc: AndyImage,
			name: "Andy Au",
			title: "Cybersecurity Student",
			testimonial:
				"I'm a fourth year cybersecurity (IT) major, and this is my third Hackathon. I like Jiu-jitsu, video games, hanging out with my friends, and I have goals to join the military in the future.",
			linkedInUrl: "https://www.linkedin.com/in/andyau107/",
		},
	];

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
		<div id="meet-the-team" className="py-12 px-4 bg-blue-50">
			<div className="max-w-7xl mx-auto text-center">
				{/* Title */}
				<h2 className="text-2xl sm:text-3xl lg:text-4xl text-black font-semibold">
					Meet the Team!
				</h2>
			</div>

			{/* Grid of Testimonial Cards */}
			<div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="flex flex-col"
          >
            <TestimonialCard
              imageSrc={testimonial.imageSrc}
              name={testimonial.name}
              title={testimonial.title}
              testimonial={testimonial.testimonial}
              linkedInUrl={testimonial.linkedInUrl}
            />
          </motion.div>
        ))}
      </div>
		</div>
	);
};

export default Testimonial;
