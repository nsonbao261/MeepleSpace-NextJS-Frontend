import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function AccountPlaceholder({ title, description }: { title: string; description: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">This feature is coming soon.</p>
      </CardContent>
    </Card>
  );
}
