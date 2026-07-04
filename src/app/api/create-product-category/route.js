import { NextResponse } from "next/server";
import { getDbPool } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const payload = await request.json();
    const categoryName = String(payload?.category_name || "").trim();

    if (!categoryName) {
      return NextResponse.json(
        { error: true, message: "Category name is required" },
        { status: 400 },
      );
    }

    const db = getDbPool();
    const [existingRows] = await db.execute(
      `SELECT id, category_name, status
       FROM tbl_crm_sales_product_categories
       WHERE LOWER(category_name) = LOWER(:categoryName)
       LIMIT 1`,
      { categoryName },
    );

    if (existingRows[0]) {
      return NextResponse.json({
        error: false,
        message: "Category already exists",
        data: existingRows[0],
      });
    }

    const [result] = await db.execute(
      `INSERT INTO tbl_crm_sales_product_categories (category_name, status)
       VALUES (:categoryName, :status)`,
      {
        categoryName,
        status: payload?.status === "inactive" ? "inactive" : "active",
      },
    );

    return NextResponse.json({
      error: false,
      message: "Category created successfully",
      data: {
        id: result.insertId,
        category_name: categoryName,
        status: payload?.status === "inactive" ? "inactive" : "active",
      },
    });
  } catch (error) {
    console.error("[api] create-product-category failed", error);
    return NextResponse.json(
      { error: true, message: "Failed to create product category" },
      { status: 500 },
    );
  }
}
