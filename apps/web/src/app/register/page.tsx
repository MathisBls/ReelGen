"use client";
import { useForm } from "react-hook-form";
import Input from "@/components/input";
import Button from "@/components/button";
import { signup } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<{ email: string; password: string }>();
  const router = useRouter();
  return (
    <div className="mx-auto mt-16 max-w-md space-y-6">
      <h1 className="text-2xl font-semibold">Créer un compte</h1>
      <form
        className="space-y-4"
        onSubmit={handleSubmit(async (v) => {
          await signup(v);
          router.push("/media");
        })}
      >
        <div>
          <label className="text-sm">Email</label>
          <Input type="email" {...register("email", { required: true })} />
        </div>
        <div>
          <label className="text-sm">Mot de passe</label>
          <Input
            type="password"
            {...register("password", { required: true })}
          />
        </div>
        <Button disabled={isSubmitting} type="submit">
          S’inscrire
        </Button>
      </form>
    </div>
  );
}
