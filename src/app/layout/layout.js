import { Avatar } from "./avatar";
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from "./dropdown";
import { Navbar, NavbarItem, NavbarSection, NavbarSpacer } from "./navbar";
import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarHeading,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
  SidebarSpacer,
} from "./sidebar";
import { SidebarLayout } from "./sidebar-layout";
import {
  ArrowRightStartOnRectangleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Cog8ToothIcon,
  LightBulbIcon,
  PlusIcon,
  ShieldCheckIcon,
  UserIcon,
  PaintBrushIcon,
} from "@heroicons/react/16/solid";
import {
  Cog6ToothIcon,
  HomeIcon,
  InboxIcon,
  MagnifyingGlassIcon,
  MegaphoneIcon,
  QuestionMarkCircleIcon,
  SparklesIcon,
  Square2StackIcon,
  TicketIcon,
  ChartPieIcon,
  ChatBubbleBottomCenterTextIcon,
} from "@heroicons/react/20/solid";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

// New SubMenuItem component
const SubMenuItem = ({
  href,
  icon: Icon,
  label,
  children,
  isOpen,
  onToggle,
}) => {
  const hasChildren = children && children.length > 0;

  return (
    <div>
      <div
        className={`flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer ${
          isOpen ? "bg-gray-50" : ""
        }`}
        onClick={onToggle}
      >
        {Icon && <Icon className="h-5 w-5" />}
        <span className="flex-1 truncate no-underline ml-2 text-sm">
          {label}
        </span>
        {hasChildren && (
          <ChevronUpIcon
            className={`h-4 w-4 transition-transform ${
              isOpen ? "" : "rotate-180"
            }`}
          />
        )}
      </div>
      {isOpen && hasChildren && (
        <div className="pl-4 ml-2 border-l border-gray-200">{children}</div>
      )}
    </div>
  );
};

export default function CustomLayout({ children }) {
  const { data: session, status } = useSession();
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (menuId) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  return (
    <SidebarLayout
      navbar={
        <Navbar>
          <NavbarSpacer />
          <NavbarSection>
            <NavbarItem href="/search" aria-label="Search">
              <MagnifyingGlassIcon />
            </NavbarItem>
            <NavbarItem href="/inbox" aria-label="Inbox">
              <InboxIcon />
            </NavbarItem>
            <Dropdown>
              <DropdownButton as={NavbarItem}>
                <Avatar src="/profile-photo.jpg" square />
              </DropdownButton>
              <DropdownMenu className="min-w-64" anchor="bottom end">
                <DropdownItem href="/billing">
                  <UserIcon />
                  <DropdownLabel>My profile</DropdownLabel>
                </DropdownItem>
                <DropdownItem href="/settings">
                  <Cog8ToothIcon />
                  <DropdownLabel>Settings</DropdownLabel>
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem href="/privacy-policy">
                  <ShieldCheckIcon />
                  <DropdownLabel>Privacy policy</DropdownLabel>
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem
                  onClick={(e) => {
                    e.preventDefault();
                    signOut();
                  }}
                >
                  <ArrowRightStartOnRectangleIcon />
                  <DropdownLabel>Sign out</DropdownLabel>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarSection>
        </Navbar>
      }
      sidebar={
        <Sidebar>
          <SidebarHeader className="flex flex-row gap-2 items-center justify-center">
            <Avatar
              className="w-10 h-10"
              src="https://www.mybranz.com/logo.png"
            />
            <SidebarLabel>MyBranz Emails</SidebarLabel>
          </SidebarHeader>
          <SidebarBody>
            <SidebarSection>
              <SidebarItem href="/dashboard">
                <HomeIcon />
                <SidebarLabel>Dashboard</SidebarLabel>
              </SidebarItem>
              {/* <SidebarItem href="/calendar">
                <Square2StackIcon />
                <SidebarLabel>Calendar</SidebarLabel>
              </SidebarItem> */}

              {/* Modified Emails section with submenus */}
              <div className="relative">
                <SubMenuItem
                  icon={TicketIcon}
                  label="Campaigns"
                  isOpen={openMenus.emails}
                  onToggle={() => toggleMenu("emails")}
                >
                  {/* <SubMenuItem
                    label="Templates"
                    href="/emails/templates"
                    isOpen={openMenus.templates}
                    onToggle={() => toggleMenu("templates")}
                  > */}
                  <SidebarItem href="/calendar">
                    <SidebarLabel>Calendar</SidebarLabel>
                  </SidebarItem>

                  <SidebarItem href="/create-campaign">
                    <SidebarLabel>Emails</SidebarLabel>
                  </SidebarItem>

                  <SidebarItem href="/sms">
                    <SidebarLabel>SMS</SidebarLabel>
                  </SidebarItem>
                  <SidebarItem href="/segments">
                    <SidebarLabel>Segments</SidebarLabel>
                  </SidebarItem>

                  {/* </SubMenuItem> */}
                  {/* <SubMenuItem
                    label="Campaigns"
                    href="/emails/campaigns"
                    isOpen={openMenus.campaigns}
                    onToggle={() => toggleMenu("campaigns")}
                  >
                    <SidebarItem href="/emails/campaigns/active">
                      <SidebarLabel>Active</SidebarLabel>
                    </SidebarItem>
                    <SidebarItem href="/emails/campaigns/draft">
                      <SidebarLabel>Drafts</SidebarLabel>
                    </SidebarItem>
                    <SidebarItem href="/emails/campaigns/completed">
                      <SidebarLabel>Completed</SidebarLabel>
                    </SidebarItem>
                  </SubMenuItem> */}
                </SubMenuItem>
              </div>

              <SidebarItem href="/insights">
                <ChartPieIcon />
                <SidebarLabel>Insights</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/settings">
                <Cog6ToothIcon />
                <SidebarLabel>Brand Settings</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
            <SidebarSpacer />
            <SidebarSection>
              <SidebarItem href="/support">
                <QuestionMarkCircleIcon />
                <SidebarLabel>Support</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarBody>
          <SidebarFooter className="max-lg:hidden">
            <Dropdown>
              <DropdownButton as={SidebarItem}>
                <span className="flex min-w-0 items-center gap-3">
                  <Avatar
                    src="/profile-photo.jpg"
                    className="size-10"
                    square
                    alt=""
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white w-full">
                      {session ? (
                        session?.user?.name
                      ) : (
                        <Skeleton className="w-[200px] h-4 mb-2" />
                      )}
                    </span>
                    <span className="block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400">
                      {session ? (
                        session?.user?.email
                      ) : (
                        <Skeleton className="w-full h-4" />
                      )}
                    </span>
                  </span>
                </span>
                <ChevronUpIcon />
              </DropdownButton>
              <DropdownMenu className="min-w-64" anchor="top start">
                <DropdownItem href="/billing">
                  <UserIcon />
                  <DropdownLabel>My profile</DropdownLabel>
                </DropdownItem>
                <DropdownItem href="/settings">
                  <Cog8ToothIcon />
                  <DropdownLabel>Settings</DropdownLabel>
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem href="/privacy-policy">
                  <ShieldCheckIcon />
                  <DropdownLabel>Privacy policy</DropdownLabel>
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem
                  onClick={(e) => {
                    e.preventDefault();
                    signOut();
                  }}
                >
                  <ArrowRightStartOnRectangleIcon />
                  <DropdownLabel>Sign out</DropdownLabel>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </SidebarFooter>
        </Sidebar>
      }
    >
      {children}
    </SidebarLayout>
  );
}
