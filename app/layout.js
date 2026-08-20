import './globals.css';
import Nav from '../components/Nav';
export const metadata={title:'Park Now',description:'Real-time parking availability prototype'};
export default function RootLayout({children}){return <html lang="en"><body><Nav/><main>{children}</main></body></html>}
