import { useState, useRef, useEffect } from "react";
import { useTranslation } from "@/i18n/useTranslation";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";

interface CollapsibleContentProps {
  content: string;
  hasMedia: boolean;
}

export function CollapsibleContent({ content, hasMedia }: CollapsibleContentProps) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const contentRef = useRef<HTMLParagraphElement>(null);

  const lineClampClass = hasMedia ? "line-clamp-2" : "line-clamp-10";

  useEffect(() => {
    const checkTruncation = () => {
      if (contentRef.current) {
        const { scrollHeight, clientHeight } = contentRef.current;
        setIsTruncated(scrollHeight > clientHeight);
      }
    };

    // Check on mount and when content changes
    checkTruncation();

    // Also check after fonts load
    if (document.fonts?.ready) {
      document.fonts.ready.then(checkTruncation);
    }
  }, [content, hasMedia]);

  return (
    <div className="mb-4">
      <p
        ref={contentRef}
        className={cn(
          "text-foreground leading-relaxed whitespace-pre-wrap",
          !isExpanded && lineClampClass
        )}
      >
        {content}
      </p>

      {isTruncated && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          {isExpanded ? (
            <>
              {t('socialFeed.showLess')}
              <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              {t('socialFeed.readMore')}
              <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>
      )}
    </div>
  );
}
