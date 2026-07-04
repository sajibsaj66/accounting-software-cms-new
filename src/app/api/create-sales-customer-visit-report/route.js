import { NextResponse } from "next/server";
import { getDbPool } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function toJson(value) {
  return JSON.stringify(Array.isArray(value) ? value : []);
}

export async function POST(request) {
  try {
    const payload = await request.json();

    if (!payload?.visit_date || !payload?.sales_person_name || !payload?.customer_name) {
      return NextResponse.json(
        { error: true, message: "Required visit fields are missing" },
        { status: 400 },
      );
    }

    const db = getDbPool();
    const [result] = await db.execute(
      `INSERT INTO tbl_crm_sales_customer_visit_reports
        (visit_date, sales_person_name, assigned_sales_person_id, customer_assignment,
         customer_name, customer_phone, customer_area, customer_type, last_po_reference,
         competitor, product_category_id, customer_priority, visit_agenda,
         meeting_persons_details, previous_feedback, next_action_plan,
         next_followup_date, status, created_at, updated_at)
       VALUES
        (:visit_date, :sales_person_name, :assigned_sales_person_id, :customer_assignment,
         :customer_name, :customer_phone, :customer_area, :customer_type, :last_po_reference,
         :competitor, :product_category_id, :customer_priority, :visit_agenda,
         :meeting_persons_details, :previous_feedback, :next_action_plan,
         :next_followup_date, :status, NOW(), NOW())`,
      {
        visit_date: payload.visit_date,
        sales_person_name: payload.sales_person_name,
        assigned_sales_person_id: Number(payload.assigned_sales_person_id || 0),
        customer_assignment: payload.customer_assignment || "Self",
        customer_name: payload.customer_name,
        customer_phone: payload.customer_phone || "",
        customer_area: payload.customer_area || "",
        customer_type: payload.customer_type || "Existing",
        last_po_reference: payload.last_po_reference || "",
        competitor: payload.competitor || "",
        product_category_id: payload.product_category_id || null,
        customer_priority: payload.customer_priority || "A",
        visit_agenda: toJson(payload.visit_agenda),
        meeting_persons_details: toJson(payload.meeting_persons_details),
        previous_feedback: payload.previous_feedback || "",
        next_action_plan: payload.next_action_plan || "Follow-up",
        next_followup_date: payload.next_followup_date,
        status: payload.status || "Reschedule",
      },
    );

    return NextResponse.json({
      error: false,
      message: "Visit report created successfully",
      data: { id: result.insertId, ...payload },
    });
  } catch (error) {
    console.error("[api] create-sales-customer-visit-report failed", error);
    return NextResponse.json(
      { error: true, message: "Failed to create visit report" },
      { status: 500 },
    );
  }
}
