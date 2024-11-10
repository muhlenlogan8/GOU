import TestimonialCard from "./subComponents/TestimonialCard";
import LoganImage from "../assets/Logan.JPG";
import CameranImage from "../assets/Cameran.JPG";

import AndyImage from "../assets/Andy.JPG";

const Testimonial = () => {
  const testimonials = [
    {
      imageSrc: LoganImage,
      name: "Logan Muhlen",
      title: "Computer Engineering Student",
      testimonial:
        "Logan",
      linkedInUrl: "https://www.linkedin.com/in/logan-muhlen-54a53b131/",
    },
    {
        imageSrc: CameranImage,
        name: "Cameran Beason",
        title: "Mechanical Engineering Student",
        testimonial:
          "Cameran",
        linkedInUrl: "https://www.linkedin.com/in/cameran-beason/",
      },
      {
        imageSrc: AndyImage,
        name: "Andy Au",
        title: "Cybersecurity Student",
        testimonial:
          "Andy",
        linkedInUrl: "https://www.linkedin.com/in/andyau107/",
      },
  ];

  return (
    <div id="meet-the-team" className="overflow-hidden bg-n-15">
      <div className="relative max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        {/* Center the title text */}
        <div className="flex justify-center mb-6 sm:mb-10 md:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl text-black font-semibold">
            Meet the Team!
          </h2>
        </div>
  
        {/* Grid of team members */}
        <div className="grid sm:grid-cols-3 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              imageSrc={testimonial.imageSrc}
              name={testimonial.name}
              title={testimonial.title}
              testimonial={testimonial.testimonial}
              linkedInUrl={testimonial.linkedInUrl}
            />
          ))}
        </div>
      </div>
    </div>
  );
  
};  

export default Testimonial;