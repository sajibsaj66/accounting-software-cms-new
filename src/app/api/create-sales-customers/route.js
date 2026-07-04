import { NextResponse } from "next/server";
import { getDbPool } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function requiredText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export async function POST(request) {
  try {
    const payload = await request.json();

    if (
      !requiredText(payload.customer_name) ||
      !requiredText(payload.customer_area) ||
      !requiredText(payload.customer_email) ||
      !requiredText(payload.customer_phone) ||
      !requiredText(payload.customer_type) ||
      !requiredText(payload.customer_priority) ||
      !requiredText(payload.last_visit) ||
      !requiredText(payload.next_followup) ||
      !requiredText(payload.status)
    ) {
      return NextResponse.json(
        { error: true, message: "Required customer fields are missing" },
        { status: 400 },
      );
    }

    const db = getDbPool();
    const [result] = await db.execute(
      `INSERT INTO tbl_crm_sales_customers
        (customer_name, customer_area, customer_email, customer_phone, customer_type,
         customer_priority, last_visit, next_followup, status, assigned_sales_person_id,
         created_at, updated_at)
       VALUES
        (:customer_name, :customer_area, :customer_email, :customer_phone, :customer_type,
         :customer_priority, :last_visit, :next_followup, :status, :assigned_sales_person_id,
         NOW(), NOW())`,
      {
        customer_name: payload.customer_name.trim(),
        customer_area: payload.customer_area.trim(),
        customer_email: payload.customer_email.trim(),
        customer_phone: payload.customer_phone.trim(),
        customer_type: payload.customer_type,
        customer_priority: payload.customer_priority,
        last_visit: payload.last_visit,
        next_followup: payload.next_followup,
        status: payload.status,
        assigned_sales_person_id: Number(payload.assigned_sales_person_id || 0),
      },
    );

    return NextResponse.json({
      error: false,
      message: "Customer created successfully",
      data: { id: result.insertId, ...payload },
    });
  } catch (error) {
    console.error("[api] create-sales-customers failed", error);
    return NextResponse.json(
      { error: true, message: "Failed to create customer" },
      { status: 500 },
    );
  }
}
