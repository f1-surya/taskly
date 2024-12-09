"use server";

import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { JWTPayload, jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { addDays } from "date-fns";
import prisma from "./db";

const secretKey = process.env.SECRET_KEY ?? "Very_secret_key";
const key = new TextEncoder().encode(secretKey);

/**
 * Encrypts the given payload using JWT encryption with the HS256 algorithm.
 *
 * @param {any} payload - The payload to be encrypted.
 * @return {Promise<string>} The encrypted payload.
 */
export async function encrypt(payload: SessionPayload): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(addDays(new Date(), 1))
    .sign(key);
}

/**
 * Decrypts the given input using JWT encryption with the HS256 algorithm.
 *
 * @param {string} input - The encrypted input to be decrypted.
 * @return {Promise<any>} The decrypted payload.
 */
export async function decrypt(input: string): Promise<SessionPayload> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  // @ts-ignore
  return payload;
}

/**
 * Creates a session for the user with the provided data, encrypts it, and saves it in a cookie.
 *
 * @param {Object} data - The data to create the session with.
 */
export async function createSession(data: SessionPayload) {
  const session = await encrypt(data);

  const date = new Date();
  date.setDate(date.getDate() + 1);

  const cookieJar = await cookies();
  cookieJar.set("session", session, {
    httpOnly: true,
    expires: date,
  });
}

/**
 * Logs in a user with the provided form data. Verifies the credentials and retrieves the user data.
 * If the credentials are valid, creates a session for the user and redirects to the home page.
 *
 * @param {LoginState | undefined} state - The current login state.
 * @param {FormData} formData - The form data containing the user's email and password.
 * @return {Promise<LoginState>} The login state indicating the result of the login attempt.
 */
export async function login(
  state: LoginState | undefined,
  formData: FormData,
): Promise<LoginState> {
  // Verify credentials && get the user
  const user = {
    email: formData.get("email")!.toString(),
    password: formData.get("password")!.toString(),
  };

  const userData = await prisma.users.findUnique({
    where: {
      email: user.email,
    },
  });
  if (!userData) {
    return { email: true };
  }

  const [password, salt] = userData.password.split(":");

  const hashedBuffer = scryptSync(user.password, salt, 64);
  const keyBuffer = Buffer.from(password, "hex");
  const match = timingSafeEqual(hashedBuffer, keyBuffer);

  if (match) {
    await createSession({
      email: user.email,
      uid: userData.id,
      name: userData.name,
    });
    redirect("/");
  }
  return { password: true };
}

export async function signUp(
  state: SignUpState | undefined,
  formData: FormData,
): Promise<SignUpState> {
  const oldUser = await prisma.users.findUnique({
    where: {
      email: formData.get('email')!.toString()
    }
  });
  const fullname = formData.get("fullname")!.toString().trim();

  if (oldUser) {
    return { email: true };
  }
  if (formData.get("password") !== formData.get("confirmPassword")) {
    return { match: true };
  }
  if (fullname.split(" ").length < 2) {
    return { name: true };
  }

  const salt = randomBytes(16).toString("hex");
  const hashedPassword = scryptSync(
    formData.get("password")!.toString(),
    salt,
    64,
  ).toString("hex");

  const data = await prisma.users.create({
    data: {
      email: formData.get("email")!.toString(),
      name: fullname,
      password: `${hashedPassword}:${salt}`,
    },
  });
  await createSession({
    email: formData.get("email")!.toString(),
    name: fullname,
    uid: data.id,
  });
  redirect("/");
}

export async function logout() {
  const cookieJar = await cookies();
  cookieJar.delete("session");
}

/**
 * Retrieves the session from the cookies.
 *
 * @return {Promise<string | null>} The decrypted session value or null if session is not found.
 */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieJar = await cookies();
  const session = cookieJar.get("session")?.value;
  if (!session) {
    return null;
  }
  return await decrypt(session);
}

interface LoginState {
  email?: boolean;
  password?: boolean;
}

interface SignUpState {
  email?: boolean;
  match?: boolean;
  name?: boolean;
}

export interface SessionPayload extends JWTPayload {
  email: string;
  name: string;
  uid: string;
}
