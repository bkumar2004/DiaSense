import './globals.css';

export const metadata = {
  title: 'DiaSense — Diabetes Risk Prediction',
  description: 'AI-powered diabetes risk prediction platform with 98% confidence.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
