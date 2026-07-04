import { NextResponse } from "next/server";
import { getDbPool } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();
    const saleId = Number(body?.saleId);

    if (!saleId) {
      return NextResponse.json(
        { error: true, message: "Quotation id is required" },
        { status: 400 },
      );
    }

    const db = getDbPool();
    await db.execute(
      `UPDATE tbl_quotation_master
       SET sale_status = 'd'
       WHERE sale_id = :saleId`,
      { saleId },
    );

    return NextResponse.json({ error: false, message: "Quotation deleted" });
  } catch (error) {
    console.error("[api] quotation-delete failed", error);
    return NextResponse.json(
      { error: true, message: "Delete failed" },
      { status: 500 },
    );
  }
}
