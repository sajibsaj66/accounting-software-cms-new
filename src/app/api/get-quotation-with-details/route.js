import { NextResponse } from "next/server";
import { getDbPool } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function addMasterFilters(reqPayload, where, params) {
  if (reqPayload?.saleId) {
    where.push("qm.sale_id = :saleId");
    params.saleId = Number(reqPayload.saleId);
  }
  if (reqPayload?.invoice) {
    where.push("qm.sale_invoice = :invoice");
    params.invoice = String(reqPayload.invoice);
  }
  if (reqPayload?.fromDate) {
    where.push("qm.sale_created_isodt >= :fromDate");
    params.fromDate = `${reqPayload.fromDate}T00:00:00.000Z`;
  }
  if (reqPayload?.toDate) {
    where.push("qm.sale_created_isodt <= :toDate");
    params.toDate = `${reqPayload.toDate}T23:59:59.999Z`;
  }
  if (reqPayload?.customerId) {
    where.push("qm.sale_customer_id = :customerId");
    params.customerId = Number(reqPayload.customerId);
  }
  if (reqPayload?.employeeId) {
    where.push("qm.sale_emp_id = :employeeId");
    params.employeeId = Number(reqPayload.employeeId);
  }
  if (reqPayload?.userId) {
    where.push("qm.sale_created_by = :userId");
    params.userId = Number(reqPayload.userId);
  }
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const reqPayload = body?.reqPayload || {};
    const where = ["qm.sale_status <> 'd'"];
    const params = {};
    addMasterFilters(reqPayload, where, params);

    const db = getDbPool();
    const [rows] = await db.execute(
      `SELECT
         qm.*,
         COALESCE(c.customer_name, 'General customer') AS customer_name,
         c.customer_code,
         c.customer_institution_name,
         c.customer_address,
         c.customer_mobile_no,
         e.employee_name,
         qd.sale_d_id,
         qd.sale_prod_id,
         qd.sale_qty,
         qd.sale_rate,
         qd.sale_prod_total,
         COALESCE(qd.prod_brand_name, pb.prod_brand_name) AS prod_brand_name,
         COALESCE(qd.prod_unit_name, p.prod_unit_name, pu.prod_unit_name) AS prod_unit_name,
         COALESCE(NULLIF(TRIM(pn.prod_name), '0'), p.prod_code, qd.sale_prod_id) AS prod_name,
         COALESCE(qd.prod_cat_name, pc.prod_cat_name) AS prod_cat_name
       FROM tbl_quotation_master qm
       LEFT JOIN tbl_customers c ON c.customer_id = qm.sale_customer_id
       LEFT JOIN tbl_employees e ON e.employee_id = qm.sale_emp_id
       LEFT JOIN tbl_quotation_details qd ON qd.sale_id = qm.sale_id AND qd.sale_d_status <> 'd'
       LEFT JOIN tbl_products p ON p.prod_id = qd.sale_prod_id
       LEFT JOIN tbl_products_names pn ON pn.prod_name_id = p.prod_name_id
       LEFT JOIN tbl_product_categories pc ON pc.prod_cat_id = p.prod_cat_id
       LEFT JOIN tbl_product_brands pb ON pb.prod_brand_id = p.prod_brand_id
       LEFT JOIN tbl_product_units pu ON pu.prod_unit_id = p.prod_unit_id
       WHERE ${where.join(" AND ")}
       ORDER BY qm.sale_id DESC, qd.sale_d_id ASC`,
      params,
    );

    const grouped = new Map();
    for (const row of rows) {
      const key = row.sale_id;
      if (!grouped.has(key)) {
        grouped.set(key, {
          sale_id: row.sale_id,
          sale_invoice: row.sale_invoice,
          sale_created_isodt: row.sale_created_isodt,
          customer_id: row.sale_customer_id,
          customer_code: row.customer_code,
          customer_name: row.customer_name,
          customer_institution_name: row.customer_institution_name,
          customer_address: row.customer_address,
          customer_mobile_no: row.customer_mobile_no,
          employee_name: row.employee_name,
          sale_subtotal_amount: row.sale_subtotal_amount,
          sale_discount_amount: row.sale_discount_amount,
          sale_vat_amount: row.sale_vat_amount,
          sale_transport_cost: row.sale_transport_cost,
          sale_total_amount: row.sale_total_amount,
          details: [],
        });
      }

      if (row.sale_d_id) {
        grouped.get(key).details.push({
          sale_d_id: row.sale_d_id,
          sale_prod_id: row.sale_prod_id,
          sale_qty: row.sale_qty,
          sale_rate: row.sale_rate,
          sale_prod_total: row.sale_prod_total,
          prod_name: row.prod_name,
          prod_cat_name: row.prod_cat_name,
          prod_brand_name: row.prod_brand_name,
          prod_unit_name: row.prod_unit_name,
        });
      }
    }

    return NextResponse.json({ message: Array.from(grouped.values()) });
  } catch (error) {
    console.error("[api] get-quotation-with-details failed", error);
    return NextResponse.json(
      { message: [], error: "Failed to load quotation details" },
      { status: 500 },
    );
  }
}
