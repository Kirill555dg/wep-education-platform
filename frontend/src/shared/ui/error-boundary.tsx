import React from "react";

import { logger } from "@/shared/lib/logger";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
  message: string | null;
};

export class ErrorBoundary extends React.Component<Props, State> {
  public override state: State = { hasError: false, message: null };

  public static getDerivedStateFromError(error: unknown): State {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return { hasError: true, message };
  }

  public override componentDidCatch(error: unknown, info: React.ErrorInfo) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error("react_error_boundary", { message, componentStack: info.componentStack });
  }

  public override render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="max-w-lg w-full">
          <CardHeader>
            <CardTitle>Что-то пошло не так</CardTitle>
            <CardDescription>Попробуйте перезагрузить страницу. Если ошибка повторяется — сообщите нам.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {this.state.message ? <div className="text-sm text-muted-foreground">{this.state.message}</div> : null}
            <Button
              onClick={() => {
                window.location.reload();
              }}
            >
              Перезагрузить
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
}


