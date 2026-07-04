import { NextResponse } from "next/server";
import { getDbPool } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = getDbPool();
    const [rows] = await db.execute(
      `SELECT id, category_name, status
       FROM tbl_crm_sales_product_categories
       ORDER BY category_name ASC`,
    );

    return NextResponse.json({ data: rows });
  } catch (error) {
    console.error("[api] get-product-categories failed", error);
    return NextResponse.json(
      { data: [], error: "Failed to load product categories" },
      { status: 500 },
    );
  }
}
