import { NextResponse } from "next/server";
import { getDbPool } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const db = getDbPool();
    const [rows] = await db.execute(
      `SELECT *
       FROM tbl_customers
       WHERE customer_status = 'active'
       ORDER BY customer_name ASC`,
    );
    return NextResponse.json({ message: rows });
  } catch (error) {
    console.error("[api] get-customers failed", error);
    return NextResponse.json({ message: [] }, { status: 500 });
  }
}
