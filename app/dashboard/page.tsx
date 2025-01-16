"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth";
import { useTodoStore } from "@/store/todos";
import { useUserStore } from "@/store/users";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { todos, loading: todosLoading, fetchTodos } = useTodoStore();
  const { currentUser, loading: userLoading, fetchCurrentUser } = useUserStore();

  useEffect(() => {
    fetchTodos();
    fetchCurrentUser();
  }, [fetchTodos, fetchCurrentUser]);

  const activeTodos = todos.filter(todo => todo.status === 'active');
  const completedTodos = todos.filter(todo => todo.status === 'inactive');

  if (todosLoading || userLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex-1 space-y-4 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Willkommen, {currentUser?.user_metadata?.name || currentUser?.email || 'Benutzer'}
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border bg-card text-card-foreground shadow">
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">Aktive Aufgaben</h3>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2v20M2 12h20" />
              </svg>
            </div>
            <div className="p-6 pt-0">
              <div className="text-2xl font-bold">{activeTodos.length}</div>
            </div>
          </div>
          <div className="rounded-xl border bg-card text-card-foreground shadow">
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">Erledigte Aufgaben</h3>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div className="p-6 pt-0">
              <div className="text-2xl font-bold">{completedTodos.length}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
