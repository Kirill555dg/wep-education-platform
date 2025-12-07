/**
 * Error State Component
 * Modern error display with retry functionality
 */
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "./button";
import { Card, CardContent } from "./card";
import { Alert, AlertDescription, AlertTitle } from "./alert";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  variant?: "inline" | "page" | "card";
}

export function ErrorState({
  title = "Что-то пошло не так",
  message,
  onRetry,
  variant = "card",
}: ErrorStateProps) {
  if (variant === "inline") {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription className="flex items-center justify-between">
          <span>{message}</span>
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="ml-4"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Повторить
            </Button>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  if (variant === "page") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] px-4">
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <AlertCircle className="w-10 h-10 text-red-600" />
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-6 text-center max-w-md">
          {message}
        </p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Попробовать снова
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card className="border-destructive">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-sm">
            {message}
          </p>
          {onRetry && (
            <Button onClick={onRetry} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Повторить попытку
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

