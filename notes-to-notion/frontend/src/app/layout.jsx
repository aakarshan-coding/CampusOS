import { Metadata } from 'next';
import '../styles/globals.css';

export const metadata = {
  title: 'Notes to Notion',
  description: 'Convert Apple Notes to Notion pages',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}