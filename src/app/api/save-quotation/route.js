import { NextResponse } from "next/server";
import { getDbPool } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function normalizeCustomerType(type) {
  const value = String(type || "").toLowerCase();
  if (["general", "retail", "wholesale"].includes(value)) return value;
  return "retail";
}

export async function POST(request) {
  const db = getDbPool();
  const connection = await db.getConnection();

  try {
    const { sale, cart } = await request.json();
    const items = Array.isArray(cart) ? cart : [];

    if (!sale || !items.length) {
      return NextResponse.json(
        { error: true, message: "Quotation item is required" },
        { status: 400 },
      );
    }

    await connection.beginTransaction();

    const [saleIdRows] = await connection.execute(
      "SELECT COALESCE(MAX(sale_id), 0) + 1 AS nextSaleId FROM tbl_quotation_master FOR UPDATE",
    );
    const [detailIdRows] = await connection.execute(
      "SELECT COALESCE(MAX(sale_d_id), 0) + 1 AS nextDetailId FROM tbl_quotation_details FOR UPDATE",
    );

    const saleId = Number(saleIdRows?.[0]?.nextSaleId || 1);
    let nextDetailId = Number(detailIdRows?.[0]?.nextDetailId || 1);
    const saleInvoice = sale.sale_invoice || `Q-${new Date().getFullYear()}-${saleId}`;
    const createdIso = sale.created_isodt || new Date().toISOString();

    await connection.execute(
      `INSERT INTO tbl_quotation_master
        (sale_id, sale_invoice, sale_cus_type, sale_pay_method, sale_bank_id,
         sale_customer_id, sale_emp_id, sale_note, sale_total_amount,
         sale_discount_amount, sale_transport_cost, sale_vat_amount,
         sale_subtotal_amount, sale_paid_amount, sale_due_amount,
         sale_previous_due, sale_branch_id, sale_created_isodt,
         sale_updated_isodt, sale_created_by, sale_status, sale_updated_by,
         sale_vat_percent, sale_ait_amount, sale_ait_percent,
         sale_discount_percent, checkbox_options)
       VALUES
        (:sale_id, :sale_invoice, :sale_cus_type, 'cash', 0,
         :sale_customer_id, :sale_emp_id, :sale_note, :sale_total_amount,
         :sale_discount_amount, :sale_transport_cost, :sale_vat_amount,
         :sale_subtotal_amount, 0, :sale_due_amount,
         :sale_previous_due, 1, :sale_created_isodt,
         NULL, :sale_created_by, 'a', 0,
         :sale_vat_percent, :sale_ait_amount, :sale_ait_percent,
         :sale_discount_percent, :checkbox_options)`,
      {
        sale_id: saleId,
        sale_invoice: saleInvoice,
        sale_cus_type: normalizeCustomerType(sale.sale_cus_type),
        sale_customer_id: Number(sale.customer_id || sale.sale_customer_id || 0),
        sale_emp_id: Number(sale.sale_emp_id || 0),
        sale_note: sale.sale_note || "",
        sale_total_amount: Number(sale.total_amount || sale.sale_total_amount || 0),
        sale_discount_amount: Number(sale.discount || sale.sale_discount_amount || 0),
        sale_transport_cost: Number(sale.sale_transport_cost || 0),
        sale_vat_amount: Number(sale.vat || sale.sale_vat_amount || 0),
        sale_subtotal_amount: Number(sale.sub_total || sale.sale_subtotal_amount || 0),
        sale_due_amount: Number(sale.total_amount || sale.sale_total_amount || 0),
        sale_previous_due: Number(sale.previous_due || 0),
        sale_created_isodt: createdIso,
        sale_created_by: Number(sale.sale_created_by || 0),
        sale_vat_percent: Number(sale.vat_percent || sale.sale_vat_percent || 0),
        sale_ait_amount: Number(sale.ait || sale.sale_ait_amount || 0),
        sale_ait_percent: Number(sale.ait_percent || sale.sale_ait_percent || 0),
        sale_discount_percent: Number(sale.discount_percent || sale.sale_discount_percent || 0),
        checkbox_options: JSON.stringify(sale.checkbox_values || []),
      },
    );

    for (const item of items) {
      const qty = Number(item.prod_qty || item.qty || 0);
      const rate = Number(item.prod_sale_rate || item.rate || 0);

      await connection.execute(
        `INSERT INTO tbl_quotation_details
          (sale_d_id, sale_id, sale_prod_id, sale_d_branch_id, sale_qty,
           sale_prod_purchase_rate, sale_rate, sale_prod_total,
           sale_prod_discount, sale_d_status, prod_cat_name,
           prod_brand_name, prod_unit_name, prod_set_no, prod_set_qty,
           entered_set_no)
         VALUES
          (:sale_d_id, :sale_id, :sale_prod_id, 1, :sale_qty,
           :sale_prod_purchase_rate, :sale_rate, :sale_prod_total,
           0, 'a', :prod_cat_name,
           :prod_brand_name, :prod_unit_name, :prod_set_no, :prod_set_qty,
           :entered_set_no)`,
        {
          sale_d_id: nextDetailId,
          sale_id: saleId,
          sale_prod_id: Number(item.prod_id || item.productId || 0),
          sale_qty: qty,
          sale_prod_purchase_rate: Number(item.prod_purchase_rate || 0),
          sale_rate: rate,
          sale_prod_total: Number(item.prod_total || qty * rate || 0),
          prod_cat_name: item.prod_cat_name || null,
          prod_brand_name: item.prod_brand_name || null,
          prod_unit_name: item.prod_unit_name || null,
          prod_set_no: item.prod_set_no || null,
          prod_set_qty: Number(item.prod_set_qty || 0),
          entered_set_no: item.entered_set_no || null,
        },
      );

      nextDetailId += 1;
    }

    await connection.commit();

    return NextResponse.json({
      error: false,
      message: {
        msg: "Quotation saved successfully",
        sale_id: saleId,
        sale_invoice: saleInvoice,
      },
    });
  } catch (error) {
    await connection.rollback();
    console.error("[api] save-quotation failed", error);
    return NextResponse.json(
      { error: true, message: "Quotation save failed" },
      { status: 500 },
    );
  } finally {
    connection.release();
  }
}
