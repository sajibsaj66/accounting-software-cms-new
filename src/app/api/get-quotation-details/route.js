import { NextResponse } from "next/server";
import { getDbPool } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const reqPayload = body?.reqPayload || {};
    const where = ["qm.sale_status <> 'd'", "qd.sale_d_status <> 'd'"];
    const params = {};

    if (reqPayload?.fromDate) {
      where.push("qm.sale_created_isodt >= :fromDate");
      params.fromDate = `${reqPayload.fromDate}T00:00:00.000Z`;
    }
    if (reqPayload?.toDate) {
      where.push("qm.sale_created_isodt <= :toDate");
      params.toDate = `${reqPayload.toDate}T23:59:59.999Z`;
    }
    if (reqPayload?.productId) {
      where.push("qd.sale_prod_id = :productId");
      params.productId = Number(reqPayload.productId);
    }
    if (reqPayload?.categoryId) {
      where.push("p.prod_cat_id = :categoryId");
      params.categoryId = Number(reqPayload.categoryId);
    }

    const db = getDbPool();
    const [rows] = await db.execute(
      `SELECT
         qm.sale_id,
         qm.sale_invoice,
         qm.sale_created_isodt,
         COALESCE(c.customer_name, 'General customer') AS customer_name,
         qd.sale_d_id,
         qd.sale_prod_id,
         qd.sale_qty,
         qd.sale_rate,
         qd.sale_prod_total,
         pn.prod_name,
         pc.prod_cat_name
       FROM tbl_quotation_details qd
       INNER JOIN tbl_quotation_master qm ON qm.sale_id = qd.sale_id
       LEFT JOIN tbl_customers c ON c.customer_id = qm.sale_customer_id
       LEFT JOIN tbl_products p ON p.prod_id = qd.sale_prod_id
       LEFT JOIN tbl_products_names pn ON pn.prod_name_id = p.prod_name_id
       LEFT JOIN tbl_product_categories pc ON pc.prod_cat_id = p.prod_cat_id
       WHERE ${where.join(" AND ")}
       ORDER BY qm.sale_id DESC, qd.sale_d_id ASC`,
      params,
    );

    return NextResponse.json({ message: rows });
  } catch (error) {
    console.error("[api] get-quotation-details failed", error);
    return NextResponse.json(
      { message: [], error: "Failed to load quotation product details" },
      { status: 500 },
    );
  }
}
