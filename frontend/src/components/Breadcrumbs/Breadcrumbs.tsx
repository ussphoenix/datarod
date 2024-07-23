import { ChevronRightIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { NavLink } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";

export interface Breadcrumb {
  name: React.ReactNode;
  link: string;
  icon?: React.ForwardRefExoticComponent<
    Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
      title?: string;
      titleId?: string;
    } & React.RefAttributes<SVGSVGElement>
  >;
}
interface BreacrumbsProps {
  breadcrumbs: Breadcrumb[];
}

export default function Breadcrumbs(props: BreacrumbsProps): React.JSX.Element {
  const { breadcrumbs } = props;
  return (
    <div className="text-x mb-6 flex items-center space-x-3 border-b border-gray-700 pb-2 text-lg">
      {breadcrumbs.map((item, index) => (
        <Fragment key={index}>
          <div>
            <NavLink
              to={item.link}
              className={({ isActive }) =>
                clsx(
                  "flex items-center space-x-1",
                  isActive
                    ? "text-lcarsYellow-200 hover:text-white"
                    : "hover:text-lcarsBlue-300",
                )
              }
            >
              {item.icon && <item.icon className="h-4 w-4" />}
              <div>{item.name}</div>
            </NavLink>
          </div>
          {index < breadcrumbs.length - 1 && (
            <ChevronRightIcon className="h-4 w-4" />
          )}
        </Fragment>
      ))}
    </div>
  );
}
