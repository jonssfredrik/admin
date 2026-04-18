export type UserStatus = "active" | "invited" | "suspended";
export type UserRole = "Admin" | "Editor" | "Viewer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastActive: string;
}

export const users: User[] = [
  { id: "1", name: "Astrid Lindgren", email: "astrid@company.se", role: "Admin", status: "active", lastActive: "2 min sedan" },
  { id: "2", name: "Olof Palme", email: "olof@company.se", role: "Editor", status: "active", lastActive: "14 min sedan" },
  { id: "3", name: "Greta Thunberg", email: "greta@company.se", role: "Editor", status: "active", lastActive: "1 tim sedan" },
  { id: "4", name: "Zlatan Ibrahimović", email: "zlatan@company.se", role: "Viewer", status: "suspended", lastActive: "3 dagar sedan" },
  { id: "5", name: "Selma Lagerlöf", email: "selma@company.se", role: "Editor", status: "active", lastActive: "igår" },
  { id: "6", name: "Alfred Nobel", email: "alfred@company.se", role: "Admin", status: "active", lastActive: "5 min sedan" },
  { id: "7", name: "Ingmar Bergman", email: "ingmar@company.se", role: "Viewer", status: "invited", lastActive: "—" },
  { id: "8", name: "Björn Borg", email: "bjorn@company.se", role: "Viewer", status: "active", lastActive: "2 tim sedan" },
  { id: "9", name: "Annika Sörenstam", email: "annika@company.se", role: "Editor", status: "invited", lastActive: "—" },
  { id: "10", name: "Ingvar Kamprad", email: "ingvar@company.se", role: "Admin", status: "active", lastActive: "30 min sedan" },
];
