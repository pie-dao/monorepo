import Image from "next/image";
import styles from "../styles/Layout.module.css";
import { Logo } from "@piedao/ui-components";

const Layout = ({ children }) => {
  return (
    <div className={`w-full bg-primary flex flex-col h-screen`}>
      <header className="w-full bg-primary p-6 grid content-around justify-center">
        <Logo size="large" />
      </header>

      <main className="flex-1 overflow-y-auto">{children}</main>

      <footer className="bg-primary p-6 grid content-around justify-center">
        <Logo size="medium" />
      </footer>
    </div>
  );
};

export default Layout;
