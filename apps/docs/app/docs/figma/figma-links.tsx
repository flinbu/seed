import { Button } from "@flinbu/seed";
import { Download, ExternalLink } from "lucide-react";

export const FIGMA_URL = "https://www.figma.com/community/file/1694480861909658527";

export function FigmaLinks() {
  return (
    <div className="my-base flex flex-wrap gap-xs">
      <Button asChild>
        <a href={FIGMA_URL} target="_blank" rel="noreferrer">
          Open in Figma
          <ExternalLink size={16} aria-hidden />
        </a>
      </Button>
      <Button variant="secondary" asChild>
        <a href="https://github.com/flinbu/seed/tree/main/fonts/fenly-serif" target="_blank" rel="noreferrer">
          <Download size={16} aria-hidden />
          Fenly Serif fonts
        </a>
      </Button>
    </div>
  );
}
