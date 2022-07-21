import { motion } from "framer-motion";

interface ILoaderProps {
  size?: number;
  small?: boolean;
  big?: boolean;
  white?: boolean;
  animate?: boolean;
}

export default function Loader({
  size,
  small,
  big,
  white,
  animate,
}: ILoaderProps) {
  function getSize() {
    if (size) return size;
    if (small) return 1.25;
    if (big) return 3;
    return 2;
  }

  return (
    <motion.svg
      initial={animate ? { scale: 0, opacity: 0 } : {}}
      animate={{
        scale: 1,
        opacity: 1,
        rotate: "360deg",
        transition: {
          rotate: {
            repeat: Infinity,
            duration: 0.5,
            ease: "linear",
          },
        },
      }}
      exit={animate ? { scale: 0, opacity: 0 } : {}}
      transition={animate ? { duration: 0.2 } : { duration: 0 }}
      style={{
        width: getSize() + "rem",
        height: getSize() + "rem",
      }}
      className={`mx-auto !origin-center text-white`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className={`opacity-25 ${white ? "text-white" : "text-brand"}`}
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth={"4"}
      ></circle>
      <path
        className={`opacity-75 ${white ? "text-white" : "text-brand"}`}
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </motion.svg>
  );
}
