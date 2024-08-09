"use server";

import { Restaurant } from "@/components/table/table-column";
import { revalidatePath } from "next/cache";

export async function handleDeleteRow(id: number, pathname: string) {
  const res = await fetch(`${process.env.BACKEND_URL}/restaurants/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) return { error: "can't delete" };
  revalidatePath(pathname);
}

export async function updateRestaurant(
  id: number,
  restaurant: Restaurant,
  pathname: string,
) {
  const res = await fetch(`${process.env.BACKEND_URL}/restaurants/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(restaurant),
  });
  if (!res.ok) return { error: "can't update" };
  revalidatePath(pathname);
}

export async function newRestaurant(
  restaurant: Record<string, string | number | boolean>,
  pathname: string,
) {
  const res = await fetch(`${process.env.BACKEND_URL}/restaurants`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(restaurant),
  });
  if (!res.ok) return { error: "can't create" };
  revalidatePath(pathname);
}
