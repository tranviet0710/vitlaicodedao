import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-2 group-[.toaster]:border-black group-[.toaster]:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:border-2 group-[.toast]:border-black group-[.toast]:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:border-2 group-[.toast]:border-black group-[.toast]:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
