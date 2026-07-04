import { NextResponse } from "next/server";
import { getDbPool } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const db = getDbPool();
    const [rows] = await db.execute(
      `SELECT *
       FROM tbl_employees
       WHERE employee_status = 'active'
       ORDER BY employee_name ASC`,
    );
    return NextResponse.json({ message: rows });
  } catch (error) {
    console.error("[api] get-employees failed", error);
    return NextResponse.json({ message: [] }, { status: 500 });
  }
}
