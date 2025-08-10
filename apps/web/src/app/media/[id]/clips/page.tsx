"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import Button from "@/components/button";
import Link from "next/link";

export default function MediaListPage() {
  const qc = useQueryClient();
  const mediaQuery = useQuery({
    queryKey: ["media"],
    queryFn: async () => (await api.get("/media")).data as any[],
  });

  const ingest = useMutation({
    mutationFn: async (id: number) =>
      (await api.post(`/media/${id}/ingest`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["media"] }),
  });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Mes médias</h1>
      {mediaQuery.isLoading ? (
        <p>Chargement…</p>
      ) : (
        <div className="grid gap-4">
          {mediaQuery.data?.map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between rounded-md border p-3"
            >
              <div>
                <div className="font-medium">{m.filename}</div>
                <div className="text-xs text-neutral-500">
                  status: {m.status} • id: {m.id}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  onClick={() => ingest.mutate(m.id)}
                  disabled={ingest.isPending}
                >
                  Ingest
                </Button>
                <Link href={`/media/${m.id}/clips`}>
                  <Button>Clips</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
