import Image from "next/image";
import styles from "../styles/Layout.module.css";
import { Logo } from "@piedao/ui-components";

const Layout = ({ children }) => {
  return (
    <div className={`bg-primary flex flex-col h-screen justify-between`}>
      <header className="h-[92px] grid content-around justify-center">
        <Logo size="large" />
      </header>

      <main className="h-screen w-full">{children}</main>

      <footer className="h-[92px] grid content-around justify-center">
        <Logo size="medium" />
      </footer>
    </div>
  );
};

export default Layout;
