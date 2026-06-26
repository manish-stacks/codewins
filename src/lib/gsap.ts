"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export const EASE = "power3.out";
export const EASE_INOUT = "power2.inOut";

export { gsap, ScrollTrigger, useGSAP };
