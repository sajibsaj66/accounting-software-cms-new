import crypto from "crypto";

function timingSafeEqualText(left, right) {
  const leftBuffer = Buffer.from(String(left));
  const rightBuffer = Buffer.from(String(right));

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

export function verifyPassword(password, storedPassword) {
  if (!password || !storedPassword) return false;

  if (!storedPassword.includes(".")) {
    return timingSafeEqualText(password, storedPassword);
  }

  const [salt, hash] = storedPassword.split(".");
  if (!salt || !hash) return false;

  const derivedHash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");

  return timingSafeEqualText(derivedHash, hash);
}
