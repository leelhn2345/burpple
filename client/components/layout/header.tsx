import { ThemeDropDownMenu } from "./theme-menu";

export function Header() {
  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/90
        backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex h-14 justify-between max-sm:px-4">
        <div className="flex items-center">Burpple</div>
        <div className="flex items-center gap-x-2">
          <ThemeDropDownMenu />
        </div>
      </div>
    </header>
  );
}
