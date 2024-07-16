"use server";

import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import dayjs from "dayjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import client from "./mongodb";

const secretKey = process.env.SECRET_KEY ?? "Very_secret_key";
const key = new TextEncoder().encode(secretKey);

/**
 * Encrypts the given payload using JWT encryption with the HS256 algorithm.
 *
 * @param {any} payload - The payload to be encrypted.
 * @return {Promise<string>} The encrypted payload.
 */
export async function encrypt(payload: any): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(dayjs().add(1, "day").toDate())
    .sign(key);
}

/**
 * Decrypts the given input using JWT encryption with the HS256 algorithm.
 *
 * @param {string} input - The encrypted input to be decrypted.
 * @return {Promise<any>} The decrypted payload.
 */
export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

/**
 * Creates a session for the user with the provided data, encrypts it, and saves it in a cookie.
 *
 * @param {Object} data - The data to create the session with.
 */
export async function createSession(data: { [key: string]: any }) {
  const session = await encrypt(data);

  const date = new Date();
  date.setDate(date.getDate() + 1);

  // Save the session in a cookie
  cookies().set("session", session, {
    httpOnly: true,
    expires: date,
  });
}

/**
 * Authenticates a user by verifying their credentials and creating a session.
 *
 * @param {FormData} formData - The form data containing the user's email and password.
 * @return {Promise<WithId<Document> | null>} A promise that resolves to the user data if the login is successful, or null if the login fails.
 */
export async function login(
  state: LoginState | undefined,
  formData: FormData
): Promise<LoginState> {
  // Verify credentials && get the user
  const user = {
    email: formData.get("email")!.toString(),
    password: formData.get("password")!.toString(),
  };

  const db = (await client.connect()).db("taskManager");
  const userData = await db.collection("users").findOne({ email: user.email });

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
      uid: userData._id,
      name: userData.name,
    });
    redirect("/");
  }
  return { password: true };
}

export async function signUp(
  state: SignUpState | undefined,
  formData: FormData
): Promise<SignUpState> {
  const db = (await client.connect()).db("taskManager");
  const oldUser = await db
    .collection("users")
    .findOne({ email: formData.get("email") });
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
    64
  ).toString("hex");

  const data = await db.collection("users").insertOne({
    email: formData.get("email"),
    name: fullname,
    password: `${hashedPassword}:${salt}`,
    createdAt: new Date(),
  });
  await createSession({
    email: formData.get("email"),
    name: fullname,
    uid: data.insertedId,
  });
  redirect("/");
}

export async function logout() {
  cookies().delete("session");
}

/**
 * Retrieves the session from the cookies.
 *
 * @return {Promise<string | null>} The decrypted session value or null if session is not found.
 */
export async function getSession(): Promise<{ [key: string]: any } | null> {
  const session = cookies().get("session")?.value;
  if (!session) {
    redirect("/login");
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
