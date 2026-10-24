import { Link, useLocation } from "react-router-dom";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

export default function NotFound() {
  const { pathname } = useLocation();
  return (
    <Empty className="min-h-[60dvh]">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Compass />
        </EmptyMedia>
        <EmptyTitle>Nothing at {pathname}</EmptyTitle>
        <EmptyDescription>That page doesn&apos;t exist in the hub.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button asChild>
          <Link to="/">Back to overview</Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
}
