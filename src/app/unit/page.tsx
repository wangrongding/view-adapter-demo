import Image from 'next/image'
import styles from './page.module.scss'

export default function Unit() {
  return (
    <div className={styles.container}>
      <h1>Welcome to Next.js!</h1>
      <div className={styles.list}>
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className={styles.listItem}>
            <Image src='/ww.jpg' className={styles.logo} alt='Next.js logo' width={100} height={20} priority />
            <div>
              <p className={styles.title}>Hello World</p>
              <p className={styles.description}>This is a sample Next.js page.</p>
              <p className={styles.description}>This is a sample Next.js page.</p>
              <p className={styles.description}>This is a sample Next.js page.</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
