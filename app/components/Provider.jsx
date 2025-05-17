import React from 'react';
import { ThemeProvider } from "next-themes";

const Provider = ({children}) => {

  return (
    <ThemeProvider attribute="class" enableSystem defaultTheme="dark">
        {children}
    </ThemeProvider>
  )
}

export default Provider;