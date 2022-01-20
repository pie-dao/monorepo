import Image from "next/image";
import styles from "../styles/Layout.module.css";
import { Logo } from "@piedao/ui-components";

const Layout = ({ children }) => {
  return (
    <body className={`bg-primary flex flex-col min-h-screen justify-between`}>
      <header className="bg-primary p-6 h-[92px] grid content-around justify-center">
        <Logo size="large" />
      </header>

      <main className="w-full">{children}</main>

      <footer className="bg-primary p-6 h-[92px] grid content-around justify-center">
        <Logo size="medium" />
      </footer>
    </body>
  );
};

export default Layout;
