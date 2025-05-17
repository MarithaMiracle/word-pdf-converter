import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Provider from "./components/Provider";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "MARIPDF",
    description: "A website built by Maritha to convert your files to PDF with ease.",
    icons: {
        icon: "/Screenshot 2025-05-17 at 02.38.16.png",
        shortcut: "/Screenshot 2025-05-17 at 02.38.16.png",
        apple: "/Screenshot 2025-05-17 at 02.38.16.png",
    },
};

export default function RootLayout({ children }) {
    return ( <html lang = "en"
        suppressHydrationWarning>
        <body className = "some-classname">
        <Provider>
         { children } </Provider> </body> 
        </html>
    );
}