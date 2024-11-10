import { useState } from "react";
import linkedIn from "../../assets/linkedIn.svg";
import linkedInHover from "../../assets/linkedInHover.svg";

const TestimonialCard = ({ imageSrc, name, title, testimonial, linkedInUrl }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex flex-col bg-gray-100 rounded-xl h-auto">
      {/* Name, Title, and Image side by side with LinkedIn icon aligned to the right */}
      <div className="flex items-center gap-x-4 p-4">
        <img
          className="size-8 sm:h-[4rem] sm:w-[4rem] rounded-full"
          src={imageSrc}
          alt={`${name}'s avatar`}
        />
        <div className="flex items-center gap-x-4 flex-grow">
          <div>
            <p className="text-sm sm:text-base font-semibold text-black">{name}</p>
            <p className="text-xs text-n-2">{title}</p>
          </div>
        </div>
        {/* LinkedIn icon aligned to the right */}
        <a
          href={linkedInUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1 ml-auto"
        >
          <span className="sr-only">{`${name} LinkedIn`}</span>
          <img
            width={50}
            height={50}
            src={isHovered ? linkedInHover : linkedIn}
            alt="LinkedIn icon"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          />
        </a>
      </div>

      {/* Testimonial Text */}
      <div className="p-4 md:p-6">
        <p className="text-base italic md:text-lg text-n-1">{testimonial}</p>
      </div>
    </div>
  );
};

export default TestimonialCard;
