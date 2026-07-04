import { NextResponse } from "next/server";
import { getDbPool } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const db = getDbPool();
    const [rows] = await db.execute(
      `SELECT user_id, user_full_name, user_name, user_email, user_role, user_status
       FROM tbl_users
       WHERE user_status = 'active'
       ORDER BY user_name ASC`,
    );
    return NextResponse.json({ message: rows });
  } catch (error) {
    console.error("[api] get-users failed", error);
    return NextResponse.json({ message: [] }, { status: 500 });
  }
}
