import { Component, type ErrorInfo, type ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/Icon";
import { faRotateLeft, faTriangleExclamation } from "@/lib/icons";
import * as Sentry from "@sentry/react";
import { isChunkLoadError } from "@/lib/preload-error-handler";

interface ChunkLoadErrorBoundaryProps {
  children: ReactNode;
}

interface ChunkLoadErrorBoundaryState {
  error: Error | null;
}

export class ChunkLoadErrorBoundary extends Component<
  ChunkLoadErrorBoundaryProps,
  ChunkLoadErrorBoundaryState
> {
  state: ChunkLoadErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ChunkLoadErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    Sentry.captureException(error, {
      tags: { kind: isChunkLoadError(error) ? "chunk-load" : "render" },
      extra: { componentStack: info.componentStack },
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReport = () => {
    Sentry.getFeedback()?.createWidget().appendToDom();
  };

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    const chunkLoad = isChunkLoadError(error);

    return (
      <div className="flex min-h-dvh items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Icon
                icon={faTriangleExclamation}
                className="h-5 w-5 shrink-0 text-destructive"
              />
              <CardTitle>
                {chunkLoad ? "Couldn't load this page" : "Something went wrong"}
              </CardTitle>
            </div>
            <CardDescription>
              {chunkLoad
                ? "A part of the app failed to download. This is usually temporary, but a network blocker or an unstable connection can also cause it."
                : "An unexpected error occurred while rendering this page."}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button size="sm" onClick={this.handleReload}>
              <Icon icon={faRotateLeft} className="mr-2 h-3.5 w-3.5" />
              Reload
            </Button>
            <Button size="sm" variant="outline" onClick={this.handleReport}>
              Report this
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
}
