import { LoaderCircle, Play } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Props {
  title: string;
  description: string;
  actionLabel: string;
  onRun: () => void;
  running?: boolean;
}

export function StepCardHeader({
  title,
  description,
  actionLabel,
  onRun,
  running = false,
}: Props) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
        <p className="text-xs text-muted">{description}</p>
      </div>
      <Button
        variant="secondary"
        className="gap-1.5"
        onClick={onRun}
        disabled={running}
      >
        {running ? <LoaderCircle size={14} className="animate-spin" /> : <Play size={14} />}
        {running ? "Kör..." : actionLabel}
      </Button>
    </div>
  );
}
