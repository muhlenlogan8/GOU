import { useState } from "react";
import linkedIn from "../../assets/linkedIn.svg";
import linkedInHover from "../../assets/linkedInHover.svg";

const MissionCard = ({ imageSrc, name, title, testimonial, linkedInUrl }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div id="testimonials" className="bg-n-15 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-bold tracking-tight text-color-8 sm:text-4xl">
            What Our Clients Say
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Hear from those who have experienced it
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {/* Testimonial Card for each person */}
            <div key={name} className="relative pl-16">
              <dt className="text-base font-semibold leading-7 text-white">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center">
                  <img
                    className="h-10 w-10 rounded-full object-cover"
                    src={imageSrc}
                    alt={`${name}'s avatar`}
                  />
                </div>
                {name} - {title}
              </dt>
              <dd className="mt-2 text-base leading-7 text-n-3">
                <p className="italic">{testimonial}</p>
                {/* LinkedIn Icon with hover effect */}
                <a
                  href={linkedInUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto p-1 mt-4 inline-block"
                >
                  <img
                    width={50}
                    height={50}
                    src={isHovered ? linkedIn : linkedInHover}
                    alt="LinkedIn icon"
                    className="transition-transform duration-300 ease-in-out transform hover:scale-110"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  />
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default MissionCard;
