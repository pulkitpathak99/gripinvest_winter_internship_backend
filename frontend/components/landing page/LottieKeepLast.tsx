"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function LottieKeepLast({ animationData }: { animationData: any }) {
  const lottieRef = useRef<any>(null);

  useEffect(() => {
    const ref = lottieRef.current;
    if (!ref) return;

    const onComplete = () => {
      try {
        const duration = ref?.getDuration?.(true);
        if (duration) {
          ref.goToAndStop(duration - 1, true);
        } else {
          ref.pause?.();
        }
      } catch (e) { /* silent fail */ }
    };

    ref?.addEventListener?.("complete", onComplete);
    return () => {
      ref?.removeEventListener?.("complete", onComplete);
    };
  }, []);

  return (
    // @ts-ignore: lottieRef typing differences can be tricky
    <Lottie animationData={animationData} lottieRef={lottieRef} loop={false} autoplay className="mx-auto" />
  );
}