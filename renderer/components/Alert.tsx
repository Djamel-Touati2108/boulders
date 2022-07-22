import { ReactElement } from "react";
import cn from "../util/class";

interface IAlertProps {
  type: "ERROR" | "SUCCESS" | "WARN";
  text?: string;
}

export default function Alert({ type, text }: IAlertProps): ReactElement {
  if (!text) return null;
  return (
    <>
      <div
        className={cn`
          mt-3 w-full rounded-md border px-3 py-2
          ${
            type == "ERROR"
              ? cn`border-red-500/30 bg-red-500/10`
              : type == "WARN"
              ? cn`border-yellow-500/30 bg-yellow-500/10`
              : cn`border-green-500/30 bg-green-500/10`
          } 
        `}
      >
        <p
          className={cn`
            text-sm
            ${
              type == "ERROR"
                ? "text-red-500"
                : type == "WARN"
                ? "text-yellow-500"
                : "text-green-500"
            }
          `}
        >
          {text}
        </p>
      </div>
    </>
  );
}
