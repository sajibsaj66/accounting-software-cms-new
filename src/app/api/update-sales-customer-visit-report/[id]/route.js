import { NextResponse } from "next/server";
import { getDbPool } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function toJson(value) {
  return JSON.stringify(Array.isArray(value) ? value : []);
}

export async function PATCH(request, { params }) {
  try {
    const { id: rawId } = await params;
    const id = Number(rawId);
    const payload = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: true, message: "Valid visit report id is required" },
        { status: 400 },
      );
    }

    const db = getDbPool();
    await db.execute(
      `UPDATE tbl_crm_sales_customer_visit_reports
       SET visit_date = :visit_date,
           sales_person_name = :sales_person_name,
           customer_assignment = :customer_assignment,
           customer_name = :customer_name,
           customer_phone = :customer_phone,
           customer_area = :customer_area,
           customer_type = :customer_type,
           last_po_reference = :last_po_reference,
           competitor = :competitor,
           product_category_id = :product_category_id,
           customer_priority = :customer_priority,
           visit_agenda = :visit_agenda,
           meeting_persons_details = :meeting_persons_details,
           previous_feedback = :previous_feedback,
           next_action_plan = :next_action_plan,
           next_followup_date = :next_followup_date,
           status = :status,
           updated_at = NOW()
       WHERE id = :id`,
      {
        id,
        visit_date: payload.visit_date,
        sales_person_name: payload.sales_person_name,
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
      message: "Visit report updated successfully",
      data: { id, ...payload },
    });
  } catch (error) {
    console.error("[api] update-sales-customer-visit-report failed", error);
    return NextResponse.json(
      { error: true, message: "Failed to update visit report" },
      { status: 500 },
    );
  }
}
