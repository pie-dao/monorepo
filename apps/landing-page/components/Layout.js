import Image from 'next/image'
import styles from '../styles/Layout.module.css'
import { Button, Logo } from '../../../libs/ui-components/lib'

const Layout = ({ children }) => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
      <Button label="test" size="large" />
      <Logo size="small" />
        {/* <a
          href="https://piedao.org"
          target="_blank"
          rel="piedao"
        >
          <span className={styles.logo}>
            <Image src="/DOUGH2v.png" alt="Vercel Logo" width={50} height={50} />
          </span>
        </a> */}
      </header>

      <main className={styles.main}>
        {children}
      </main>

      <footer className={styles.footer}>
        <a
          href="https://piedao.org"
          target="_blank"
          rel="piedao"
        >
          <span className={styles.logo}>
            <Image src="/DOUGH2v.png" alt="Vercel Logo" width={50} height={50} />
          </span>
        </a>
      </footer>
    </div>
  )
}

export default Layout
