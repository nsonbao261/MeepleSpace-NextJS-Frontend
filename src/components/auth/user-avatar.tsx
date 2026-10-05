"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type UserAvatarProps = {
  avatarUrl: string | null;
  firstName: string;
  lastName: string;
  size?: "sm" | "default" | "lg";
  className?: string;
};

function initials(firstName: string, lastName: string): string {
  return `${firstName.slice(0, 1)}${lastName.slice(0, 1)}`.toUpperCase();
}

export function UserAvatar({
  avatarUrl,
  firstName,
  lastName,
  size = "default",
  className,
}: UserAvatarProps) {
  return (
    <Avatar size={size} className={className}>
      {}
      {avatarUrl === null ? null : <AvatarImage src={avatarUrl} alt="" />}

      {}
      <AvatarFallback>{initials(firstName, lastName)}</AvatarFallback>
    </Avatar>
  );
}
