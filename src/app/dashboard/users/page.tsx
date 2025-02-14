"use client";

import { Card } from "@/components/card";
import { Plus } from "lucide-react";

export default function Users() {
  return (
    <Card
      title="Users"
      description="List of users"
      IconButton={Plus}
      textButton="Create User"
    >
      <p>Users Page</p>
    </Card>
  );
}
