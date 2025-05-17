'use client';
import ThemeToggler from './components/ThemeToggler';
import FileUploader from './components/FileUploader';

export default function Page() {
    return ( <main className = "min-h-screen w-full bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
        
        <FileUploader />
        <ThemeToggler/>

        </main>
    );
}