import type { Metadata } from 'next';
export const metadata:Metadata={title:'Corner to Empire · D6X8',description:'Store and city simulation with shared player presence.'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body style={{margin:0}}>{children}</body></html>}
