import { adminClient, inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { ac, admin, employee } from "./permission";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_SERVER_URL,
  fetchOptions: {
    credentials: "include",
  },

  plugins: [
    inferAdditionalFields({
      user: {
        isPasswordChanged: {
          type: "boolean",
        },
        departmentId: {
          type: "string",
          required: false,
        },
        phone: {
          type: "string",
          required: false,
        },
        salary: {
          type: "number",
          required: false,
        },
        address: {
          type: "string",
          required: false,
        },
        isProfileCompleted: {
          type: "boolean",
          required: false,
        },
        uniqueId: {
          type: "string",
          required: false,
        },
        githubUrl: {
          type: "string",
          required: false,
        },
        linkedinUrl: {
          type: "string",
          required: false,
        },
      },
    }),
    adminClient({
      ac,
      roles: {
        admin,
        employee,
      },
    }),
  ],
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  forgetPassword,
  resetPassword,
  verifyEmail,
  changePassword,
  updateUser,
} = authClient;

export type Session = {
  session: {
    id: string;
    userId: string;
    expiresAt: string;
    token: string;
  };
  user: {
    id: string;
    uniqueId?: string;
    name: string;
    email: string;
    emailVerified: boolean;
    role?: string;
    image?: string | null;
    departmentId?: string | null;
    isPasswordChanged: boolean;
    phone?: string | null;
    address?: string | null;
    salary?: number | null;
    isProfileCompleted?: boolean;
    githubUrl: string | null;
    linkedinUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
    banned?: boolean | null;
    banReason?: string | null;
    banExpires?: Date | null;
  };
};
