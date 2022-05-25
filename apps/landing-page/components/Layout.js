const Layout = ({ children }) => {
  return (
    <div className={`w-full bg-primary flex flex-col h-screen font-sans`}>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
};

export default Layout;
