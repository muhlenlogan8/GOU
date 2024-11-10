import { FaBrain, FaHandsHelping } from 'react-icons/fa';

const Mission = () => {
  return (
    <section id="our-mission" className="py-12 px-4 bg-blue-50">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl text-black font-semibold">
          Our Mission
        </h2>
        <p className="mt-4 text-lg text-gray-700">
          Uni-Guesser aims to create an accessible, immersive, and engaging campus exploration game that tackles both educational and social issues within our campus community.
        </p>
      </div>

      {/* 2x1 Grid for Mission Cards */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-8">
        {/* Education Card */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-start gap-6">
            {/* Larger Icon */}
            <FaBrain className="text-9xl text-pink-600" />
            <div className="flex flex-col justify-center">
              {/* Title */}
              <h3 className="text-xl font-semibold text-gray-900">Transforming Education</h3>
              {/* Description */}
              <p className="mt-4 text-gray-700">
                Uni-Guesser enhances the student learning experience by introducing campus resources. It helps students discover new academic and mental health resources through interactive and immersive gameplay.
              </p>
            </div>
          </div>
        </div>

        {/* Social Issues Card */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-start gap-6">
            {/* New Icon for Social Issues */}
            <FaHandsHelping className="text-9xl text-green-600" />
            <div className="flex flex-col justify-center">
              {/* Title */}
              <h3 className="text-xl font-semibold text-gray-900">Addressing Social Issues</h3>
              {/* Description */}
              <p className="mt-4 text-gray-700">
                Uni-Guesser encourages students to compete with others on their knowledge of various campus locations, leading to exploration.  Overall, it fosters a more connected and supportive university environment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mission;
