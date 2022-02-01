import { Logo } from "@piedao/ui-components";

const Layout = ({ children }) => {
  return (
    <div className={`w-full bg-primary flex flex-col h-screen font-sans`}>
      <main className="flex-1 overflow-y-auto">{children}</main>

      <footer className="bg-primary p-6 grid content-around justify-center">
        <Logo size="medium" />
      </footer>
    </div>
  );
};

export default Layout;
