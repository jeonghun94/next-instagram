// import { User } from "@prisma/client";
import { Feeds } from "@/types";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useSWR from "swr";

interface UserProps {
  user: {
    id: number;
    email: string;
    name: string;
    username: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    color: string;
    avatarUrl: string | null;
    backgroundUrl: string | null;
    feeds: Feeds[];
    _count: {
      followers: number;
      following: number;
      feeds: number;
      likes: number;
      replys: number;
    };
  };
  isLoading: boolean;
}

export default function useUser(): UserProps {
  const { data, error } = useSWR("/api/me");
  const router = useRouter();
  useEffect(() => {
    if (data && !data.ok) {
      router.replace("/");
    }
  }, [data, router]);
  return { user: data?.profile, isLoading: !data && !error };
}
