"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Check } from "lucide-react";

const plans = [
  {
    name: "Basic",
    price: "9.99",
    features: ["5 Projects", "Basic Support", "1GB Storage"],
    recommended: false,
  },
  {
    name: "Pro",
    price: "19.99",
    features: ["Unlimited Projects", "Priority Support", "10GB Storage", "Team Collaboration"],
    recommended: true,
  },
  {
    name: "Enterprise",
    price: "49.99",
    features: ["Custom Solutions", "24/7 Support", "Unlimited Storage", "Advanced Analytics"],
    recommended: false,
  },
];

export default function BillingPage() {
  return (
    <div className="max-w-[2000px] mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Billing & Subscription</h2>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <CreditCard className="h-6 w-6" />
              <div>
                <p className="font-medium">Pro Plan</p>
                <p className="text-sm text-muted-foreground">Billing cycle: Monthly</p>
              </div>
            </div>
            <Button variant="outline">Manage Subscription</Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card key={plan.name} className={plan.recommended ? "border-primary" : ""}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  {plan.name}
                  {plan.recommended && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      Recommended
                    </span>
                  )}
                </CardTitle>
                <div className="text-2xl font-bold">${plan.price}<span className="text-sm font-normal">/month</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm">
                      <Check className="h-4 w-4 mr-2 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className="w-full mt-4" variant={plan.recommended ? "default" : "outline"}>
                  {plan.recommended ? "Upgrade to Pro" : "Select Plan"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <CreditCard className="h-6 w-6" />
              <div>
                <p className="font-medium">•••• •••• •••• 4242</p>
                <p className="text-sm text-muted-foreground">Expires 12/2024</p>
              </div>
            </div>
            <Button variant="outline">Update Payment Method</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
