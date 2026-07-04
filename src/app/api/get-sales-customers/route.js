import { NextResponse } from "next/server";
import { getDbPool } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = getDbPool();
    const [rows] = await db.execute(
      `SELECT *
       FROM tbl_crm_sales_customers
       ORDER BY customer_name ASC, id DESC`,
    );

    return NextResponse.json({ data: rows });
  } catch (error) {
    console.error("[api] get-sales-customers failed", error);
    return NextResponse.json(
      { data: [], error: "Failed to load sales customers" },
      { status: 500 },
    );
  }
}
