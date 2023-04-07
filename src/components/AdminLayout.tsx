import Link from "next/link";
import { type ReactElement } from "react";
import { RiArrowLeftLine } from "react-icons/ri";
import { Route } from "~/utils/constant";

interface AdminLayoutProps {
  title: string;
  children: ReactElement;
  showBackButton?: boolean;
}

const AdminLayout = ({ title, children, showBackButton }: AdminLayoutProps) => {
  const hideClass = showBackButton ? "" : "opacity-0 pointer-events-none w-0 px-0";

  return (
    <div className="relative flex w-full grow flex-col gap-5 bg-lgp-background">
      <div className="fixed left-0 top-0 right-0 z-10 bg-white shadow-sm">
        <div className="m-auto flex w-full items-center px-3 lg:max-w-xl">
          <Link href={Route.ADMIN_PANEL} className={`p-4 ${hideClass}`}>
            <RiArrowLeftLine className="h-8 w-8" />
          </Link>

          <h3 className="text-lg font-semibold tracking-wide">{title}</h3>
        </div>
      </div>

      {children}
    </div>
  );
};

export default AdminLayout;
