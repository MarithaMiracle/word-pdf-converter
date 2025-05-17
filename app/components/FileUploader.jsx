"use client";

import React, { useState, useEffect, useRef } from "react";
import ThemeToggler from "./ThemeToggler";

const Confetti = ({ show }) => {
  const confettiCount = 120;
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!show) {
      setParticles([]);
      return;
    }

    const colors = [
      "#FFC4D6", "#B0E0E6", "#D1C4E9", "#FFDAB9", "#B2DFDB",
      "#F8BBD0", "#BBDEFB", "#C8E6C9", "#FFF9C4", "#E1BEE7"
    ];

    const newParticles = Array.from({ length: confettiCount }).map(() => ({
      id: Math.random().toString(36).substr(2, 9),
      x: Math.random() * window.innerWidth,
      y: Math.random() * -window.innerHeight,
      rotation: Math.random() * 360,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 8 + Math.random() * 10,
      speed: 2 + Math.random() * 4,
      opacity: 0.8 + Math.random() * 0.2,
    }));

    setParticles(newParticles);
  }, [show]);

  useEffect(() => {
    if (!show) return;

    let animationFrameId;

    const animate = () => {
      setParticles((oldParticles) =>
        oldParticles
          .map((p) => ({
            ...p,
            y: p.y + p.speed,
            rotation: p.rotation + p.speed * 2,
          }))
          .filter((p) => p.y < window.innerHeight + 40)
      );

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationFrameId);
  }, [show]);

  if (!show) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 9999,
      }}
    >
      {particles.map(({ id, x, y, rotation, color, size, opacity }) => (
        <div
          key={id}
          style={{
            position: "absolute",
            left: x,
            top: y,
            width: size,
            height: size * 0.4,
            backgroundColor: color,
            opacity,
            transform: `rotate(${rotation}deg)`,
            borderRadius: "2px",
            filter: "drop-shadow(0 0 3px rgba(0,0,0,0.1))",
          }}
        />
      ))}
    </div>
  );
};

<ThemeToggler />;

const FileUploader = () => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState("");
  const [message, setMessage] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [theme, setTheme] = useState("light");
  const fileInputRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    handleFileSelect(droppedFile);
  };

  const handleFileChange = (e) => {
    handleFileSelect(e.target.files[0]);
  };

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;

    const ext = selectedFile.name.split(".").pop().toLowerCase();
    if (!["docx", "doc", "pdf"].includes(ext)) {
      setMessage("Unsupported file type. Please upload a DOC, DOCX, or PDF.");
      return;
    }

    const url = URL.createObjectURL(selectedFile);
    setFile(selectedFile);
    setPreviewUrl(url);
    setMessage("");
    setProgress(0);
    setShowConfetti(false);
  };

  const handleConvert = async () => {
    if (!file) {
      setMessage("Please select or drop a file to convert.");
      return;
    }

    const ext = file.name.split(".").pop().toLowerCase();
    let endpoint = "";

    if (ext === "docx") endpoint = "docx/to/pdf";
    else if (ext === "doc") endpoint = "doc/to/pdf";
    else if (ext === "pdf") endpoint = "pdf/to/docx";
    else {
      setMessage("Unsupported file type.");
      return;
    }

    const formData = new FormData();
    formData.append("inputFile", file);

    setIsConverting(true);
    setProgress(0);
    setMessage("Converting...");
    setShowConfetti(false);

    try {
      const xhr = new XMLHttpRequest();
      const apiUrl = `https://api.cloudmersive.com/convert/${endpoint}`;

      xhr.open("POST", apiUrl);
      xhr.setRequestHeader(
        "Apikey",
        process.env.NEXT_PUBLIC_CLOUDMERSIVE_API_KEY
      );

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          setProgress(percent);
        }
      };

      xhr.responseType = "blob";

      xhr.onload = () => {
        if (xhr.status === 200) {
          const url = window.URL.createObjectURL(xhr.response);
          const a = document.createElement("a");
          a.href = url;
          a.download =
            file.name.replace(/\.(docx|doc|pdf)$/i, "") +
            (ext === "pdf" ? ".docx" : ".pdf");
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(url);
          setMessage("Conversion successful!");
          setShowConfetti(true);

          const audio = new Audio("/clapping.wav");
          audio.volume = 0.8;
          audio.play();
        } else {
          setMessage("Conversion failed. Please try again.");
          setShowConfetti(false);
        }
        setIsConverting(false);
      };

      xhr.onerror = () => {
        setIsConverting(false);
        setMessage("An error occurred during conversion.");
        setShowConfetti(false);
      };

      xhr.send(formData);
    } catch (error) {
      setIsConverting(false);
      setMessage("An error occurred: " + error.message);
      setShowConfetti(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center text-center px-4 relative overflow-hidden bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <Confetti show={showConfetti} />

      <h1 className="text-5xl font-extrabold text-black dark:text-white">
        Welcome to MARIPDF
      </h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-4 max-w-2xl z-10">
        Convert your <strong>DOC or DOCX</strong> to <strong>PDF</strong> files with ease. Fast, free, and flawless.
      </p>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl w-full max-w-2xl z-10">
        <h2 className="text-2xl font-semibold text-blue-700 dark:text-blue-300 mb-4">
          Drag & drop your file here or click to select
        </h2>

        <div
          className="border-4 border-dashed border-blue-300 dark:border-blue-600 p-6 rounded-xl mb-4 cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700 transition"
          onClick={() => fileInputRef.current.click()}
        >
          <p className="text-gray-600 dark:text-gray-200">
            Supported: DOC, DOCX
          </p>
          <input
            type="file"
            accept=".doc,.docx,.pdf"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </div>

        {file && (
          <div className="mb-4 text-sm text-gray-700 dark:text-gray-300">
            Selected file: <strong>{file.name}</strong>
          </div>
        )}

        {file && (
          <div className="w-full h-64 mb-4 border rounded-xl overflow-hidden">
            {file.name.endsWith(".pdf") ? (
              <iframe
                src={previewUrl}
                title="PDF Preview"
                className="w-full h-full"
              />
            ) : (
              <iframe
                src={`https://docs.google.com/gview?url=${encodeURIComponent(
                  previewUrl
                )}&embedded=true`}
                title="Word Preview"
                className="w-full h-full"
              />
            )}
          </div>
        )}

        <button
          onClick={handleConvert}
          disabled={isConverting || !file}
          className="relative w-full bg-gradient-to-r from-pink-600 to-blue-700 hover:from-pink-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition disabled:opacity-50 overflow-hidden"
        >
          {isConverting && (
            <div
              className="absolute top-0 left-0 h-full bg-blue-400 opacity-50 rounded-xl transition-all duration-300"
              style={{ width: `${progress}%`, zIndex: 0 }}
            />
          )}
          <span className="relative z-10">
            {isConverting ? `Converting... ${progress}%` : "Convert File"}
          </span>
        </button>

        {message && (
          <p className="mt-4 text-sm text-blue-700 dark:text-blue-300">{message}</p>
        )}
      </div>

      <footer className="mt-8 text-lg text-gray-500 dark:text-gray-400 z-10">
        Built by Maritha | ©2025 MARIPDF
      </footer>
    </div>
  );
};

export default FileUploader;
