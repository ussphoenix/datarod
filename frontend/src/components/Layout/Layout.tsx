import { useState } from "react";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
} from "@headlessui/react";
import { HashtagIcon } from "@heroicons/react/20/solid";
import {
  Bars3Icon,
  CalendarIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";

const navigation = [
  { name: "Events", href: "#", icon: CalendarIcon, current: true },
  { name: "Crew Quarters", href: "#", icon: UsersIcon, current: false },
  { name: "All Channels", href: "#", icon: HashtagIcon, current: false },
];

export default function Example() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <div>
        {/* Mobile sidebar menu */}
        <Dialog
          open={sidebarOpen}
          onClose={setSidebarOpen}
          className="relative z-50 lg:hidden"
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
          />

          <div className="fixed inset-0 flex">
            <DialogPanel
              transition
              className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
            >
              <TransitionChild>
                <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    className="-m-2.5 p-2.5"
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon
                      aria-hidden="true"
                      className="h-6 w-6 text-white"
                    />
                  </button>
                </div>
              </TransitionChild>
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4 ring-1 ring-white/10">
                <div className="flex h-16 shrink-0 items-center">
                  <span className="text-xl font-bold text-white">
                    Phoenix Archive
                  </span>
                </div>
                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" className="-mx-2 space-y-1">
                        {navigation.map((item) => (
                          <li key={item.name}>
                            <a
                              href={item.href}
                              className={clsx(
                                item.current
                                  ? "bg-lcarsPurple-500 text-white"
                                  : "text-gray-400 hover:bg-lcarsOrange-200 hover:text-white",
                                "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                              )}
                            >
                              <item.icon
                                aria-hidden="true"
                                className="h-6 w-6 shrink-0"
                              />
                              {item.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </li>
                    <li className="mt-auto">
                      <Menu as="div">
                        <MenuButton className="group flex w-full items-center gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-lcarsRed hover:text-white">
                          <img
                            alt=""
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                            className="h-8 w-8 rounded-full bg-gray-800"
                          />
                          <span aria-hidden="true">User Name</span>
                        </MenuButton>
                        <MenuItems
                          transition
                          anchor="top start"
                          className="z-40 rounded-md bg-lcarsPurple-200 px-6 py-2 text-white"
                        >
                          <MenuItem>
                            <a
                              className="block hover:text-gray-900"
                              href="/settings"
                            >
                              Log Out
                            </a>
                          </MenuItem>
                        </MenuItems>
                      </Menu>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        {/* Static sidebar menu */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-30 lg:flex lg:w-72 lg:flex-col">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-slate-900 px-6 pb-4">
            <div className="flex h-16 shrink-0 items-center">
              <span className="text-2xl font-bold text-white">
                Phoenix Archive
              </span>
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <a
                          href={item.href}
                          className={clsx(
                            item.current
                              ? "bg-lcarsPurple-500 text-white"
                              : "text-gray-400 hover:bg-lcarsOrange-200 hover:text-white",
                            "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                          )}
                        >
                          <item.icon
                            aria-hidden="true"
                            className="h-6 w-6 shrink-0"
                          />
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>

                {/* User account menu */}
                <li className="mt-auto">
                  <Menu as="div">
                    <MenuButton className="group flex w-full items-center gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-lcarsRed hover:text-white">
                      <img
                        alt=""
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        className="h-8 w-8 rounded-full bg-gray-800"
                      />
                      <span aria-hidden="true">User Name</span>
                    </MenuButton>
                    <MenuItems
                      transition
                      anchor="top start"
                      className="z-40 rounded-md bg-lcarsPurple-200 px-6 py-2 text-white"
                    >
                      <MenuItem>
                        <a
                          className="block hover:text-gray-900"
                          href="/settings"
                        >
                          Log Out
                        </a>
                      </MenuItem>
                    </MenuItems>
                  </Menu>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Static mobile header  */}
        <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-slate-900 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="-m-2.5 p-2.5 text-indigo-200 lg:hidden"
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon aria-hidden="true" className="h-6 w-6" />
          </button>
          <div className="text-xl font-semibold">Phoenix Archive</div>
        </div>

        {/* Content section */}
        <div className="lg:pl-72">
          <main className="py-10">
            <div className="px-4 sm:px-6 lg:px-8">Content</div>
          </main>
        </div>
      </div>
    </>
  );
}
