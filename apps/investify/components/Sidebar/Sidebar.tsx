import SidebarContent from './SidebarContent';

export default function Sidebar() {
  return (
    <aside className="h-screen hidden md:block md:w-2/5 max-w-sm px-4 py-5 pl-0 overflow-hidden relative">
      <SidebarContent />
    </aside>
  );
}
