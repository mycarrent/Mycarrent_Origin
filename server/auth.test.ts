import { describe, it, expect, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import type { User } from "../drizzle/schema";

describe("Authentication", () => {
  describe("auth.me", () => {
    it("should return null when user is not authenticated", async () => {
      const ctx: TrpcContext = {
        req: {
          headers: {},
          cookies: {},
        } as any,
        res: {} as any,
        user: null,
      };

      const caller = appRouter.createCaller(ctx);
      const result = await caller.auth.me();

      expect(result).toBeNull();
    });

    it("should return user data when authenticated", async () => {
      const mockUser: User = {
        id: "test-user-123",
        email: "test@example.com",
        name: "Test User",
        openId: "test-open-id",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const ctx: TrpcContext = {
        req: {
          headers: {},
          cookies: {
            "manus-session": "valid-session-token",
          },
        } as any,
        res: {} as any,
        user: mockUser,
      };

      const caller = appRouter.createCaller(ctx);
      const result = await caller.auth.me();

      expect(result).toEqual(mockUser);
    });
  });

  describe("auth.logout", () => {
    it("should throw error when user is not authenticated", async () => {
      const ctx: TrpcContext = {
        req: {
          headers: {},
          cookies: {},
        } as any,
        res: {
          setHeader: vi.fn(),
          removeHeader: vi.fn(),
        } as any,
        user: null,
      };

      const caller = appRouter.createCaller(ctx);

      await expect(caller.auth.logout()).rejects.toThrow();
    });
  });
});
