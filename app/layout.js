import './globals.css';
import Nav from '../components/Nav';
export const metadata={title:'Park Now',description:'Real-time parking availability prototype'};
export default function RootLayout({children}){return <html lang="en"><body><a className="skip-link" href="#main-content">Skip to main content</a><Nav/><main id="main-content" tabIndex={-1}>{children}</main></body></html>}
