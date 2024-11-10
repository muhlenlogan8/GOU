import { useState, useEffect } from "react";
import logo from "../assets/UniGuesser_Logo.png";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Dialog, DialogPanel, PopoverGroup } from "@headlessui/react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [textColor, setTextColor] = useState("rgb(255, 255, 255)");

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

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

  // Smooth scroll and offset handling
  const handleAnchorClick = (e, targetId) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const headerOffset = 80; // Adjust based on header height
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <header
      className="fixed z-20 top-0 left-0 right-0 backdrop-blur-2xl border-b border-gray-300 bg-transparent"
      style={{ color: textColor }}
    >
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-7xl items-center justify-between p-3 lg:px-8"
      >
        {/* Logo aligned to the left */}
        <div className="flex flex-1 items-center justify-start">
          <a href="#" className="-m-1.5 p-1.5">
            <span className="sr-only">Uni-Guesser</span>
            <img width={40} height={40} src={logo} alt="Uni-Guesser Logo" />
          </a>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5"
            style={{ color: textColor }}
          >
            <span className="sr-only">Open Main Menu</span>
            <Bars3Icon aria-hidden="true" className="h-6 w-6" />
          </button>
        </div>

        {/* Menu items for larger screens */}
        <PopoverGroup className="hidden lg:flex lg:gap-x-12">
          <a
            href="#our-mission"
            onClick={(e) => handleAnchorClick(e, "our-mission")}
            className="text-lg font-semibold leading-6 hover:text-indigo-400 hover:underline"
            style={{ color: textColor }}
          >
            Our Mission
          </a>
          <a
            href="#meet-the-team"
            onClick={(e) => handleAnchorClick(e, "meet-the-team")}
            className="text-lg font-semibold leading-6 hover:text-indigo-400 hover:underline"
            style={{ color: textColor }}
          >
            Meet the Team
          </a>
        </PopoverGroup>

        {/* Start Now button */}
        <div className="flex items-center justify-end flex-1">
          <a
            href="/play"
            className="text-lg font-semibold leading-6 hover:text-indigo-400 hover:underline"
            style={{ color: textColor }}
          >
            Play Now
          </a>
        </div>
      </nav>

      {/* Mobile Menu */}
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-10">
          <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-blue-300 px-6 py-3 sm:max-w-sm border-l border-[#87CEEB]">
            <div className="flex justify-between items-center">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Uni-Guesser</span>
                <img width={50} height={40} src={logo} alt="Uni-Guesser Logo" />
              </a>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-white"
              >
                <span className="sr-only">Close Menu</span>
                <XMarkIcon aria-hidden="true" className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-6 flow-root text-center">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  <a
                    href="#our-mission"
                    onClick={(e) => {
                      handleAnchorClick(e, "our-mission");
                      setMobileMenuOpen(false);
                    }}
                    className="-mx-3 block rounded-lg px-3 py-4 text-3xl font-semibold leading-7 hover:text-indigo-400 hover:underline"
                  >
                    Our Mission
                  </a>
                  <a
                    href="#meet-the-team"
                    onClick={(e) => {
                      handleAnchorClick(e, "meet-the-team");
                      setMobileMenuOpen(false);
                    }}
                    className="-mx-3 block rounded-lg px-3 py-4 text-3xl font-semibold leading-7 hover:text-indigo-400 hover:underline"
                  >
                    Meet the Team
                  </a>
                  <a
                    href="/play"
                    className="-mx-3 block rounded-lg px-3 py-4 text-3xl font-semibold leading-7 hover:text-indigo-400 hover:underline"
                  >
                    Play Now
                  </a>
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </header>
  );
};

export default Header;
