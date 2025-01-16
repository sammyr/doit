"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/users";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function LogoutPage() {
  const router = useRouter();
  const { clearUser } = useUserStore();

  useEffect(() => {
    const logout = async () => {
      clearUser();
      router.push("/login");
    };

    logout();
  }, [clearUser, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Logging out...</h1>
        <p className="text-muted-foreground mb-6">
          You are being redirected to the login page.
        </p>
        <Button variant="outline" onClick={() => router.push("/login")}>
          Click here if you are not redirected
        </Button>
      </Card>
    </div>
  );
}
