import { useState } from "react";
import logo from "../assets/UniGuesser_Logo.png";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Dialog, DialogPanel, PopoverGroup } from "@headlessui/react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isHover, setIsHovered] = useState(false);

  return (
    <header className="fixed z-20 top-0 left-0 right-0 bg-blue-300 backdrop-blur-2xl border-b border-gray-300 bg-transparent">
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-7xl items-center justify-between p-3 lg:px-8"
      >
        {/* Logo aligned to the left and pushed to the left end */}
        <div className="flex flex-1 items-center justify-start">
          <a href="#" className="-m-1.5 p-1.5">
            <span className="sr-only">Uni-Guesser</span>
            <img
              width={40}
              height={40}
              src={logo}
              alt=""
              href="#"
            />
          </a>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-100"
          >
            <span className="sr-only">Open Main Menu</span>
            <Bars3Icon
              aria-hidden="true"
              className="h-6 w-6"
              style={{ color: "white" }}
            />
          </button>
        </div>

        {/* Menu items for larger screens */}
        <PopoverGroup className="hidden lg:flex lg:gap-x-12">
          <a
            href="#our-mission"
            className="text-lg font-semibold leading-6 text-gray-100 hover:text-indigo-400 hover:underline"
          >
            Our Mission
          </a>
          <a
            href="#meet-the-team"
            className="text-lg font-semibold leading-6 text-gray-100 hover:text-indigo-400 hover:underline"
          >
            Meet the Team
          </a>
        </PopoverGroup>

        {/* Start Now button aligned to the right end */}
        <div className="flex items-center justify-end flex-1">
          <a
            href="/play"
            className="text-lg font-semibold leading-6 text-gray-100 hover:text-indigo-400 hover:underline"
          >
            Start Now
          </a>
        </div>
      </nav>

      {/* Mobile Menu */}
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-10">
          <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-blue-300 px-6 py-3 sm:max-w-sm border-l border-[#87CEEB]">
            <div className="flex justify-between items-center">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Uni-Guesser</span>
                <img
                  width={50}
                  height={40}
                  src={logo}
                  alt=""
                  href="#"
                />
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
                    className="-mx-3 block rounded-lg px-3 py-4 text-3xl font-semibold leading-7 text-gray-100 hover:text-indigo-400 hover:underline"
                  >
                    Our Mission
                  </a>
                  <a
                    href="#meet-the-team"
                    className="-mx-3 block rounded-lg px-3 py-4 text-3xl font-semibold leading-7 text-gray-100 hover:text-indigo-400 hover:underline"
                  >
                    Meet the Team
                  </a>
                  <a
                    href="/play"
                    className="-mx-3 block rounded-lg px-3 py-4 text-3xl font-semibold leading-7 text-gray-100 hover:text-indigo-400 hover:underline"
                  >
                    Start Now
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
