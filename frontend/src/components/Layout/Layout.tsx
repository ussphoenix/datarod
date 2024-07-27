import { useContext, useState } from "react";

import constants from "@constants";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from "@headlessui/react";
import {
  Bars3Icon,
  HashtagIcon,
  TagIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { MeContext } from "@providers/MeProvider";
import clsx from "clsx";
import { NavLink } from "react-router-dom";
import { Outlet } from "react-router-dom";

interface LayoutProps {
  children?: React.ReactNode;
}

const navigation = [
  ...Object.values(constants.TAG_INFO),
  {
    name: "All Channels",
    rootPath: constants.ROUTES.CHANNELS,
    icon: HashtagIcon,
  },
];

export default function Layout(props: LayoutProps) {
  const { children } = props;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { me } = useContext(MeContext);

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
                  <NavLink
                    className="font-title text-lg tracking-wide text-white"
                    to={constants.ROUTES.HOME}
                  >
                    Phoenix Archive
                  </NavLink>
                </div>
                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" className="-mx-2 space-y-1">
                        {navigation.map((item) => (
                          <li key={item.name}>
                            <NavLink
                              to={item.rootPath}
                              className={({ isActive }) =>
                                clsx(
                                  isActive
                                    ? "bg-lcarsPurple-500 text-white"
                                    : "text-gray-400 hover:bg-lcarsOrange-200 hover:text-white",
                                  "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                                )
                              }
                            >
                              <item.icon
                                aria-hidden="true"
                                className="h-6 w-6 shrink-0"
                              />
                              {item.name}
                            </NavLink>
                          </li>
                        ))}
                        {me?.isStaff && (
                          <li>
                            <NavLink
                              to={constants.ROUTES.ADMIN_TAGS}
                              className={({ isActive }) =>
                                clsx(
                                  isActive
                                    ? "bg-lcarsPurple-500 text-white"
                                    : "text-gray-400 hover:bg-lcarsOrange-200 hover:text-white",
                                  "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                                )
                              }
                            >
                              <TagIcon
                                className="size-6 shrink-0"
                                aria-hidden
                              />
                              Tag Management
                            </NavLink>
                          </li>
                        )}
                      </ul>
                    </li>

                    {me?.logoutUrl && me?.isAuthenticated && (
                      <li className="mt-auto">
                        <NavLink
                          to={me?.logoutUrl}
                          className="rounded-md bg-lcarsBlue-600 px-4 py-2 text-sm hover:bg-lcarsPurple-100"
                        >
                          Logout
                        </NavLink>
                      </li>
                    )}
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        {/* Static sidebar menu */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-30 lg:flex lg:w-72 lg:flex-col">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-slate-900 px-6 py-4">
            <div className="flex h-16 shrink-0 items-center justify-center">
              <NavLink
                className="font-title text-2xl tracking-wide text-white"
                to={constants.ROUTES.HOME}
              >
                Phoenix Archive
              </NavLink>
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <NavLink
                          to={item.rootPath}
                          className={({ isActive }) =>
                            clsx(
                              isActive
                                ? "bg-lcarsPurple-500 text-white"
                                : "text-gray-400 hover:bg-lcarsOrange-200 hover:text-white",
                              "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                            )
                          }
                        >
                          <item.icon
                            aria-hidden="true"
                            className="h-6 w-6 shrink-0"
                          />
                          {item.name}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </li>

                {/* <li>
                  <ul>
                    <li>Recent Channels</li>
                    <li className="text-gray-500">Coming Soon</li>
                  </ul>
                </li> */}

                {me?.isStaff && (
                  <li>
                    <ul>
                      <li>Admin</li>
                      <li>
                        <NavLink
                          to={constants.ROUTES.ADMIN_TAGS}
                          className={({ isActive }) =>
                            clsx(
                              isActive
                                ? "bg-lcarsPurple-500 text-white"
                                : "text-gray-400 hover:bg-lcarsOrange-200 hover:text-white",
                              "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                            )
                          }
                        >
                          <TagIcon className="size-6 shrink-0" aria-hidden />
                          Tag Management
                        </NavLink>
                      </li>
                    </ul>
                  </li>
                )}

                {me?.logoutUrl && me?.isAuthenticated && (
                  <li className="mt-auto">
                    <NavLink
                      to={me?.logoutUrl}
                      className="rounded-md bg-lcarsBlue-600 px-4 py-2 text-sm hover:bg-lcarsPurple-100"
                    >
                      Logout
                    </NavLink>
                  </li>
                )}
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
          <NavLink
            className="font-title text-lg tracking-wide text-white"
            to={constants.ROUTES.HOME}
          >
            Phoenix Archive
          </NavLink>
        </div>

        {/* Content section */}
        <div className="lg:pl-72">
          <main className="py-5">
            <div className="px-4 sm:px-6 lg:px-8">
              {children ? children : <Outlet />}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
