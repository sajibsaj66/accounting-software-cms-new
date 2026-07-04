import { NextResponse } from "next/server";
import { getDbPool } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function addFilters(reqPayload, where, params) {
  const fromDate = reqPayload?.fromDate || "";
  const toDate = reqPayload?.toDate || "";

  if (fromDate) {
    where.push("qm.sale_created_isodt >= :fromDate");
    params.fromDate = `${fromDate}T00:00:00.000Z`;
  }

  if (toDate) {
    where.push("qm.sale_created_isodt <= :toDate");
    params.toDate = `${toDate}T23:59:59.999Z`;
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
    const db = getDbPool();
    const where = ["qm.sale_status <> 'd'"];
    const params = {};
    addFilters(reqPayload, where, params);

    const [rows] = await db.execute(
      `SELECT
         qm.*,
         COALESCE(c.customer_name, 'General customer') AS customer_name,
         e.employee_name
       FROM tbl_quotation_master qm
       LEFT JOIN tbl_customers c ON c.customer_id = qm.sale_customer_id
       LEFT JOIN tbl_employees e ON e.employee_id = qm.sale_emp_id
       WHERE ${where.join(" AND ")}
       ORDER BY qm.sale_id DESC`,
      params,
    );

    return NextResponse.json({ message: rows });
  } catch (error) {
    console.error("[api] get-quotations failed", error);
    return NextResponse.json(
      { message: [], error: "Failed to load quotations" },
      { status: 500 },
    );
  }
}
