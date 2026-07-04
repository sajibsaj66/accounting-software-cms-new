import { NextResponse } from "next/server";
import { getDbPool } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = getDbPool();
    const [rows] = await db.execute(
      `SELECT MAX(sale_id) AS maxSaleId
       FROM tbl_quotation_master`,
    );
    const nextId = Number(rows?.[0]?.maxSaleId || 0) + 1;
    const year = new Date().getFullYear();

    return NextResponse.json({ message: `Q-${year}-${nextId}` });
  } catch (error) {
    console.error("[api] get-quotation-invoice failed", error);
    return NextResponse.json(
      { message: "", error: "Failed to generate quotation invoice" },
      { status: 500 },
    );
  }
}
