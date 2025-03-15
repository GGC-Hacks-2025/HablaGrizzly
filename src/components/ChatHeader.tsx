"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FaLanguage } from "react-icons/fa";
import { IoMoon, IoSunny } from "react-icons/io5";
import Typewriter from "typewriter-effect";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SupportedLanguage } from "@/lib/language";
import { ChatBearIcon } from "@/components";

interface ChatHeaderProps {
  language: SupportedLanguage;
  onLanguageChange: (language: SupportedLanguage) => void;
}

export default function ChatHeader({ language, onLanguageChange }: ChatHeaderProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [headerText, setHeaderText] = useState('');

  // Update header text when language changes
  useEffect(() => {
    setHeaderText(language === "english"
      ? "Hello! Welcome to Speak Grizzly"
      : "¡Hola! Bienvenidos a Habla Grizzly");
  }, [language]);

  // Check initial dark mode setting
  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains('dark'));

    // Set up listener for theme changes
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);

    if (newDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    
    // Dispatch storage event to notify other components
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <header className="p-4 border-b border-border mb-4 flex items-center justify-between">
      <div className="flex items-center">
        <div className="mr-4">
          <ChatBearIcon size="sm" />
        </div>
        <div className="font-bold text-xl md:text-2xl">
          <span className="typewriter">
            <Typewriter
              onInit={(typewriter) => {
                typewriter
                  .typeString(headerText)
                  .start();
              }}
              options={{
                cursor: '',
                delay: 50,
              }}
            />
          </span>
        </div>
      </div>

      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? <IoSunny className="h-5 w-5" /> : <IoMoon className="h-5 w-5" />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <FaLanguage className="h-5 w-5" />
              <span className="sr-only">
                {language === "english" ? "Change language" : "Cambiar idioma"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => onLanguageChange("english")}
              className={language === "english" ? "bg-accent" : ""}
            >
              English
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onLanguageChange("spanish")}
              className={language === "spanish" ? "bg-accent" : ""}
            >
              Español
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
