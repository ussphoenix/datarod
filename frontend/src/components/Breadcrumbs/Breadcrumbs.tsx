import { ChevronRightIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import Skeleton from "react-loading-skeleton";
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
interface BreadcrumbPropsWithBreadcrumbs {
  breadcrumbs: Breadcrumb[];
  loading?: never;
}
interface BreadcrumbPropsWithLoading {
  breadcrumbs?: never;
  loading: boolean;
}

type BreadcrumbProps =
  | BreadcrumbPropsWithBreadcrumbs
  | BreadcrumbPropsWithLoading;

export default function Breadcrumbs(props: BreadcrumbProps): React.JSX.Element {
  const { breadcrumbs, loading } = props;
  return (
    <div className="text-x mb-6 flex items-center space-x-3 border-b border-gray-700 pb-2 text-lg">
      {loading ? (
        <Skeleton className="h-5 w-16" />
      ) : (
        breadcrumbs?.map((item, index) => (
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
        ))
      )}
    </div>
  );
}
