'use client'

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const FallingLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const shapes = ["#icon-feuille1", "#icon-feuille2", "#icon-feuille3"];
  const colors = ["#b16f22", "#ab8f0f", "#788418"];
  const sizes = [36, 45, 54, 63];
  const numberOfLeaves = 8;

  // Initialize leaves
  useEffect(() => {
    const initialLeaves = Array.from({ length: numberOfLeaves }, (_, i) => createLeaf(i));
    setLeaves(initialLeaves);
  }, []);

  // Create a single leaf
  const createLeaf = (id) => {
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = sizes[Math.floor(Math.random() * sizes.length)];
    const left = Math.random() * 100; // Random left position (in %)
    const delay = Math.random() * 5; // Random delay for staggered animation

    return { id, shape, color, size, left, delay };
  };

  // Handle leaf animation completion (loop the animation)
  const handleAnimationComplete = (id) => {
    setLeaves((prevLeaves) =>
      prevLeaves.map((leaf) =>
        leaf.id === id ? createLeaf(id) : leaf
      )
    );
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <svg className="hidden">
        <defs>
          <symbol id="icon-feuille1" viewBox="0 0 1024 1024">
            <path d="M222.72 40.96c-15.36 140.8-248.32 394.24 268.8 563.2 304.64 94.72 322.56 404.48 322.56 404.48s135.68-227.84 97.28-419.84c-61.44-320-686.080-563.2-688.64-547.84z"></path>
          </symbol>
          <symbol id="icon-feuille2" viewBox="0 0 1024 1024">
            <path d="M1018.88 243.2c-79.36 104.96-89.6 348.16-527.36 330.24-256-12.8-463.36 202.24-463.36 202.24s56.32-199.68 199.68-325.12c243.2-215.040 801.28-220.16 791.040-207.36z"></path>
          </symbol>
          <symbol id="icon-feuille3" viewBox="0 0 1024 1024">
            <path d="M168.96 327.68c0 0-94.72-69.12-51.2-153.6s84.48-33.28 120.32-7.68c33.28 25.6 102.4 102.4 120.32 25.6s145.92-102.4 135.68 17.92c-7.68 120.32 33.28 135.68 69.12 94.72 33.28-43.52 197.12-120.32 186.88 84.48-7.68 204.8-7.68 161.28 33.28 161.28 43.52 0 110.080 102.4 76.8 204.8s51.2 161.28 84.48 186.88c33.28 25.6 33.28 25.6-238.080-33.28-273.92-58.88-299.52-84.48-238.080-153.6 58.88-69.12 7.68-69.12-43.52-58.88-51.2 7.68-179.2 43.52-161.28-69.12 0 0 17.92 0 33.28-69.12 17.92-69.12 51.2-17.92-51.2-17.92s-153.6-51.2-102.4-120.32c51.2-66.56 84.48-40.96 25.6-92.16z"></path>
          </symbol>
        </defs>
      </svg>
      {leaves.map((leaf) => (
        <motion.svg
          key={leaf.id}
          initial={{
            opacity: 0,
            y: -50,
            x: `${leaf.left}%`,
          }}
          animate={{
            opacity: 4,
            y: "100vh",
          }}
          transition={{
            duration: Math.random() * 15 + 12, // Random duration between 5 and 13 seconds
            delay: leaf.delay,
            ease: "linear",
            repeat: Infinity
          }}
          onAnimationComplete={() => handleAnimationComplete(leaf.id)}
          className="absolute"
          style={{
            fill: leaf.color,
            width: `${leaf.size}px`,
            height: `${leaf.size}px`,
            left: `${leaf.left}%`,
          }}
        >
          <use href={leaf.shape} />
        </motion.svg>
      ))}
    </div>
  );
};

export default FallingLeaves;
