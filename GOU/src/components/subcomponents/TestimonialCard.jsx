import { useState } from "react";
import linkedIn from "../../assets/linkedIn.svg";
import linkedInHover from "../../assets/linkedInHover.svg";

const TestimonialCard = ({ imageSrc, name, title, testimonial, linkedInUrl }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex flex-col bg-gray-100 rounded-xl h-auto shadow-md">
      {/* Name, Title, and Image side by side with LinkedIn icon aligned to the right */}
      <div className="flex items-center gap-x-4 p-4">
        <img
          className="h-[4rem] w-[4rem] rounded-full object-cover"
          src={imageSrc}
          alt={`${name}'s avatar`}
        />
        <div className="flex flex-col justify-center">
          <p className="text-sm sm:text-base font-semibold text-black">{name}</p>
          <p className="text-xs text-gray-500">{title}</p>
        </div>
        {/* LinkedIn icon aligned to the right */}
        <a
          href={linkedInUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto p-1"
        >
          <img
            width={50}
            height={50}
            src={isHovered ? linkedIn : linkedInHover} // Use hover state
            alt="LinkedIn icon"
            className="transition-transform duration-300 ease-in-out transform hover:scale-110" // Enlarge on hover
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          />
        </a>
      </div>

      {/* Testimonial Text */}
      <div className="p-4 md:p-6">
        <p className="text-base italic md:text-lg text-gray-700">{testimonial}</p>
      </div>
    </div>
  );
};

export default TestimonialCard;
