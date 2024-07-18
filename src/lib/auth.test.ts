// @v// @vitest-environment node

import { scryptSync } from "crypto";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { createSession, decrypt, encrypt, login, logout, signUp } from "./auth";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connect } from "mongoose";

vi.mock("next/headers", () => ({
  cookies: vi.fn(() => ({
    set: vi.fn(),
    get: vi.fn(() => ({ value: "mocked_value" })),
    delete: vi.fn(),
  })),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

const secretKey = process.env.SECRET_KEY ?? "Very_secret_key";
const key = new TextEncoder().encode(secretKey);

describe("Auth Functions", () => {
  beforeAll(async () => {
    const uri = process.env.MONGO_URL ?? "mongodb://localhost:27017";
    await connect(`${uri}/taskManager`);
  });
  describe("encrypt", () => {
    it("should encrypt the payload", async () => {
      const payload = { data: "test" };
      const token = await encrypt(payload);
      const { payload: decodedPayload } = await jwtVerify(token, key, {
        algorithms: ["HS256"],
      });
      expect(decodedPayload.data).toBeDefined();
    });
  });
  //
  describe("decrypt", () => {
    it("should decrypt the token", async () => {
      const payload = { data: "test" };
      const token = await encrypt(payload);
      const decodedPayload = await decrypt(token);
      expect(decodedPayload.data).toBe(payload.data);
    });
  });
  //
  describe("createSession", () => {
    it("should create a session cookie", async () => {
      const data = { email: "newuser@example.com", uid: "123", name: "Test User" };
      await createSession(data);
      expect(cookies).toHaveBeenCalled();
    });
  });

  describe("login", () => {
    it("should login a user with correct credentials", async () => {
      const formData = new FormData();
      formData.append("email", "newuser@example.com");
      formData.append("password", "password123");

      const result = await login(undefined, formData);
      expect(result.email).not.toEqual(true);
    });

    it("should return error if email not found", async () => {
      const formData = new FormData();
      formData.append("email", "nonexistent@example.com");
      formData.append("password", "password123");

      const result = await login(undefined, formData);
      expect(result).toEqual({ email: true });
    });

    it("should return error if password is incorrect", async () => {
      const formData = new FormData();
      formData.append("email", "newuser@example.com");
      formData.append("password", "wrongpassword");

      const result = await login(undefined, formData);
      expect(result.password).toBe(true);
    });
  });

  describe("signUp", () => {
    it("should sign up a new user", async () => {
      const formData = new FormData();
      formData.append("email", "newuser@example.com");
      formData.append("password", "password123");
      formData.append("confirmPassword", "password123");
      formData.append("fullname", "New User");

      const result = await signUp(undefined, formData);
      expect(redirect).toHaveBeenCalled();
    });

    it("should return error if email already exists", async () => {
      const formData = new FormData();
      formData.append("email", "existinguser@example.com");
      formData.append("password", "password123");
      formData.append("confirmPassword", "password123");
      formData.append("fullname", "Existing User");

      const result = await signUp(undefined, formData);
      expect(result).toEqual({ email: true });
    });

    it("should return error if passwords do not match", async () => {
      const formData = new FormData();
      formData.append("email", "newuser@example.com");
      formData.append("password", "password123");
      formData.append("confirmPassword", "differentpassword");
      formData.append("fullname", "New User");

      const result = await signUp(undefined, formData);
      expect(result).toEqual({ match: true });
    });

    it("should return error if full name is invalid", async () => {
      const formData = new FormData();
      formData.append("email", "newuser@example.com");
      formData.append("password", "password123");
      formData.append("confirmPassword", "password123");
      formData.append("fullname", "User");

      const result = await signUp(undefined, formData);
      expect(result).toEqual({ name: true });
    });
  });

  describe("logout", () => {
    it("should delete the session cookie", async () => {
      await logout();
      expect(cookies).toHaveBeenCalled();
    });
  });
});
