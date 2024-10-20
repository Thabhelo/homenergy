import { Inter } from 'next/font/google'
import './globals.css'
import '@fortawesome/fontawesome-free/css/all.min.css';


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Homenergy - Your home energy management system',
  description: 'Made by Team Tornadoes for the AABE Hackathon',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}