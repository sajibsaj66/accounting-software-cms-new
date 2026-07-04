import { NextResponse } from "next/server";
import { getDbPool } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const db = getDbPool();
    const [rows] = await db.execute(
      `SELECT
         p.*,
         COALESCE(NULLIF(TRIM(pn.prod_name), '0'), p.prod_code) AS prod_name,
         pc.prod_cat_name,
         pb.prod_brand_name,
         COALESCE(p.prod_unit_name, pu.prod_unit_name) AS prod_unit_name
       FROM tbl_products p
       LEFT JOIN tbl_products_names pn ON pn.prod_name_id = p.prod_name_id
       LEFT JOIN tbl_product_categories pc ON pc.prod_cat_id = p.prod_cat_id
       LEFT JOIN tbl_product_brands pb ON pb.prod_brand_id = p.prod_brand_id
       LEFT JOIN tbl_product_units pu ON pu.prod_unit_id = p.prod_unit_id
       WHERE p.prod_status = 'active'
       ORDER BY pn.prod_name ASC, p.prod_code ASC`,
    );
    return NextResponse.json({ message: rows });
  } catch (error) {
    console.error("[api] get-individual-products failed", error);
    return NextResponse.json({ message: [] }, { status: 500 });
  }
}
