import { NextResponse } from "next/server";
import { getDbPool } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = getDbPool();
    const [rows] = await db.execute(
      `SELECT *
       FROM tbl_crm_sales_customer_visit_reports
       ORDER BY visit_date DESC, id DESC`,
    );

    return NextResponse.json({ data: rows });
  } catch (error) {
    console.error("[api] get-sales-customer-visit-reports failed", error);
    return NextResponse.json(
      { data: [], error: "Failed to load sales visit reports" },
      { status: 500 },
    );
  }
}
