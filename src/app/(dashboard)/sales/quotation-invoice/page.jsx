"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import useAuth from "@/hooks/useAuth";
import {
  Box,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Divider,
  FormControlLabel,
  Radio,
  RadioGroup,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  IconButton,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import DownloadIcon from "@mui/icons-material/Download";

const QuotationInvoice = () => {
  const authInfo = useAuth();
  const API_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const token = authInfo?.token || authInfo?.accessToken;
  const [invoiceNo, setInvoiceNo] = useState("");
  const [selectedSaleId, setSelectedSaleId] = useState("");
  const [invoiceOptions, setInvoiceOptions] = useState([]);
  const [quotationData, setQuotationData] = useState(null);
  const [institutionData, setInstitutionData] = useState(null);
  const [loadingInvoice, setLoadingInvoice] = useState(false);
  const [optionGroupA, setOptionGroupA] = useState("Option B");
  const [optionGroupB, setOptionGroupB] = useState("SKF");
  const showOptionATemplate = optionGroupA === "Option A";
  const invoiceRef = useRef(null);
  const pdfRef = useRef(null);
  const requestConfig = useMemo(
    () => ({
      headers: {
        "auth-token": token || "",
      },
    }),
    [token]
  );

  useEffect(() => {
    if (!API_URL || !token) return;
    const loadInvoices = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/quotation-invoices`, requestConfig);
        const rows = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.data?.message)
          ? res.data.message
          : [];
        setInvoiceOptions(rows);
        if (rows.length > 0) {
          setInvoiceNo((prev) => prev || String(rows[0]?.sale_invoice || ""));
          setSelectedSaleId((prev) => prev || String(rows[0]?.sale_id || ""));
        }
      } catch (error) {
        console.error("[QuotationInvoice] /api/quotation-invoices failed", error);
      }
    };
    loadInvoices();
  }, [API_URL, token, requestConfig]);

  useEffect(() => {
    if (!API_URL || !token) return;
    const loadInstitution = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/get-institution`, requestConfig);
        const rows = Array.isArray(res?.data?.message)
          ? res.data.message
          : Array.isArray(res?.data)
          ? res.data
          : [];
        setInstitutionData(rows[0] || null);
      } catch (error) {
        console.error("[QuotationInvoice] /api/get-institution failed", error);
      }
    };
    loadInstitution();
  }, [API_URL, token, requestConfig]);

  useEffect(() => {
    if (!API_URL || !token || !selectedSaleId) return;
    const loadQuotationInvoice = async () => {
      setLoadingInvoice(true);
      try {
        const res = await axios.post(
          `${API_URL}/api/get-quotation-with-details`,
          { reqPayload: { saleId: Number(selectedSaleId), from: "invoice" } },
          requestConfig
        );
        const rows = Array.isArray(res?.data?.message)
          ? res.data.message
          : Array.isArray(res?.data?.data)
          ? res.data.data
          : [];
        setQuotationData(rows[0] || null);
      } catch (error) {
        console.error("[QuotationInvoice] /api/get-quotation-with-details failed", error);
      } finally {
        setLoadingInvoice(false);
      }
    };
    loadQuotationInvoice();
  }, [API_URL, token, selectedSaleId, requestConfig]);

  const details = Array.isArray(quotationData?.details) ? quotationData.details : [];
  const money = (n) =>
    Number(n || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  const termsAndConditions = useMemo(() => {
    const raw = quotationData?.checkbox_options;
    if (!raw) return [];
    if (Array.isArray(raw)) return raw.filter(Boolean).map((t) => String(t));
    if (typeof raw === "string") {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed.filter(Boolean).map((t) => String(t));
        if (typeof parsed === "string" && parsed.trim()) return [parsed.trim()];
        return [];
      } catch (_err) {
        // fallback: support comma separated old values
        return raw
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean);
      }
    }
    return [];
  }, [quotationData?.checkbox_options]);
  const dateTimeText = quotationData?.sale_created_isodt
    ? new Date(quotationData.sale_created_isodt).toLocaleString()
    : "-";

  const handlePrint = () => {
    const target = invoiceRef.current;
    if (!target) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    const headStyles = Array.from(
      document.querySelectorAll("style, link[rel='stylesheet']")
    )
      .map((node) => node.outerHTML)
      .join("\n");
    printWindow.document.write(`
      <html>
        <head>
          <title>${quotationData?.sale_invoice || "quotation-invoice"}</title>
          ${headStyles}
          <style>
            body { font-family: Arial, sans-serif; margin: 24px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #d5d5d5; padding: 6px; font-size: 12px; }
          </style>
        </head>
        <body>${target.innerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const handleDownloadPdf = () => {
    const loadScript = (src) =>
      new Promise((resolve, reject) => {
        const existing = document.querySelector(`script[src="${src}"]`);
        if (existing) {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.body.appendChild(script);
      });

    const run = async () => {
      const target = pdfRef.current || invoiceRef.current;
      if (!target) return;

      await loadScript("https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js");
      await loadScript("https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js");

      const html2canvasFn = window.html2canvas;
      const jsPDFCtor = window?.jspdf?.jsPDF;
      if (!html2canvasFn || !jsPDFCtor) {
        alert("PDF libraries failed to load.");
        return;
      }

      const canvas = await html2canvasFn(target, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDFCtor("p", "pt", "a4");

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 16;
      const contentWidth = pageWidth - margin * 2;
      const contentHeight = (canvas.height * contentWidth) / canvas.width;

      let heightLeft = contentHeight;
      const pageContentHeight = pageHeight - margin * 2;
      let position = margin;

      pdf.addImage(imgData, "PNG", margin, position, contentWidth, contentHeight);
      heightLeft -= pageContentHeight;

      while (heightLeft > 0) {
        position = heightLeft - contentHeight + margin;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", margin, position, contentWidth, contentHeight);
        heightLeft -= pageContentHeight;
      }

      pdf.save(`${quotationData?.sale_invoice || "quotation-invoice"}.pdf`);
    };

    run().catch((error) => {
      console.error("[QuotationInvoice] PDF download failed", error);
      alert("Failed to download PDF.");
    });
  };

  return (
    <Box sx={{ p: 2, background: "#f5f6f8", minHeight: "100vh" }}>
      <Paper sx={{ p: 3, border: "1px solid #d8d8d8" }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "80px 1fr 80px" },
            alignItems: "flex-start",
            columnGap: 1,
            rowGap: 1,
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, width: 80 }}>
            <Box>
              <IconButton size="small" onClick={handlePrint}>
                <PrintIcon />
              </IconButton>
              <IconButton size="small" onClick={handleDownloadPdf}>
                <DownloadIcon />
              </IconButton>
            </Box>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <FormControl size="small" sx={{ width: { xs: "100%", sm: 480, md: 560 }, maxWidth: "30%" }}>
              <InputLabel>Choose Quotation Invoice</InputLabel>
              <Select
                value={selectedSaleId}
                label="Choose Quotation Invoice"
                onChange={(e) => {
                  const saleId = String(e.target.value);
                  setSelectedSaleId(saleId);
                  const selected = invoiceOptions.find((o) => String(o?.sale_id) === saleId);
                  setInvoiceNo(String(selected?.sale_invoice || ""));
                }}
                MenuProps={{
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "left",
                  },
                  transformOrigin: {
                    vertical: "top",
                    horizontal: "left",
                  },
                  PaperProps: {
                    sx: {
                      maxHeight: 320,
                    },
                  },
                }}
              >
                {invoiceOptions.map((option) => (
                  <MenuItem
                    key={option?.sale_id ?? option?.sale_invoice}
                    value={String(option?.sale_id || "")}
                  >
                    {option?.sale_invoice || ""}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ width: 80 }} />
        </Box>

        <Divider sx={{ my: 2 }} />
        <Typography sx={{ textAlign: "center", fontWeight: 700, fontSize: 28, mb: 2 }}>
          Quotation Invoice
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <RadioGroup row value={optionGroupA} onChange={(e) => setOptionGroupA(e.target.value)}>
          <FormControlLabel value="Option A" control={<Radio />} label="Option A" />
          <FormControlLabel value="Option B" control={<Radio />} label="Option B" />
        </RadioGroup>

        <RadioGroup row value={optionGroupB} onChange={(e) => setOptionGroupB(e.target.value)}>
          <FormControlLabel value="None" control={<Radio />} label="None" />
          <FormControlLabel value="SKF" control={<Radio />} label="SKF" />
          <FormControlLabel value="NTN" control={<Radio />} label="NTN" />
        </RadioGroup>
        {loadingInvoice && (
          <Typography sx={{ mt: 1, fontSize: 13, color: "#666" }}>Loading invoice data...</Typography>
        )}

        <Box ref={invoiceRef}>
        {showOptionATemplate ? (
          <>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Typography><b>Customer ID :</b> {quotationData?.customer_code || quotationData?.customer_id || "-"}</Typography>
                <Typography><b>Customer Name :</b> {quotationData?.customer_name || "-"}</Typography>
                <Typography><b>Institution Name :</b> {quotationData?.customer_institution_name || institutionData?.institution_name || "-"}</Typography>
                <Typography><b>Customer Address :</b> {quotationData?.customer_address || "-"}</Typography>
                <Typography><b>Customer Mobile :</b> {quotationData?.customer_mobile_no || "-"}</Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography><b>Quotation By :</b> {quotationData?.user_full_name || quotationData?.employee_name || "-"}</Typography>
                <Typography><b>Invoice No :</b> {quotationData?.sale_invoice || invoiceNo || "-"}</Typography>
                <Typography><b>Date & Time :</b> {dateTimeText}</Typography>
              </Grid>
            </Grid>

            <Table size="small" sx={{ mt: 2, border: "1px solid #d5d5d5" }}>
              <TableHead sx={{ background: "#eceff3" }}>
                <TableRow>
                  <TableCell>SL</TableCell>
                  <TableCell>CATEGORY</TableCell>
                  <TableCell>PRODUCT</TableCell>
                  <TableCell>BRAND</TableCell>
                  <TableCell>UNIT</TableCell>
                  <TableCell align="right">UNIT PRICE IN BDT</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {details.length ? (
                  details.map((d, i) => (
                    <TableRow key={d?.sale_details_id ?? i}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{d?.prod_cat_name || "-"}</TableCell>
                      <TableCell>{d?.prod_name || "-"}</TableCell>
                      <TableCell>{d?.prod_brand_name || "-"}</TableCell>
                      <TableCell>{d?.prod_unit_name || "-"}</TableCell>
                      <TableCell align="right">{money(d?.sale_rate)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell align="center" colSpan={6}>No item found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <Box sx={{ mt: 3 }}>
              <Typography>In Word : Twelve Thousand Five Hundred and only</Typography>
              <Typography sx={{ mt: 2 }}>Note : N/A</Typography>
              {!!termsAndConditions.length && (
                <Box sx={{ mt: 2 }}>
                  <Typography sx={{ fontWeight: 700 }}>Terms & Conditions:</Typography>
                  <Box component="ul" sx={{ m: 0, pl: 3 }}>
                    {termsAndConditions.map((term, idx) => (
                      <Box component="li" key={`${idx}-${term}`}>
                        <Typography>{term}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          </>
        ) : (
          <>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Typography><b>Customer ID :</b> {quotationData?.customer_code || quotationData?.customer_id || "-"}</Typography>
                <Typography><b>Customer Name :</b> {quotationData?.customer_name || "-"}</Typography>
                <Typography><b>Institution Name :</b> {quotationData?.customer_institution_name || institutionData?.institution_name || "-"}</Typography>
                <Typography><b>Customer Address :</b> {quotationData?.customer_address || "-"}</Typography>
                <Typography><b>Customer Mobile :</b> {quotationData?.customer_mobile_no || "-"}</Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography><b>Quotation By :</b> {quotationData?.user_full_name || quotationData?.employee_name || "-"}</Typography>
                <Typography><b>Invoice No :</b> {quotationData?.sale_invoice || invoiceNo || "-"}</Typography>
                <Typography><b>Date & Time :</b> {dateTimeText}</Typography>
              </Grid>
            </Grid>

            <Table size="small" sx={{ mt: 2, border: "1px solid #d5d5d5" }}>
              <TableHead sx={{ background: "#eceff3" }}>
                <TableRow>
                  <TableCell>SL</TableCell>
                  <TableCell>CATEGORY</TableCell>
                  <TableCell>PRODUCT</TableCell>
                  <TableCell>BRAND</TableCell>
                  <TableCell>UNIT</TableCell>
                  <TableCell align="right">UNIT PRICE IN BDT</TableCell>
                  <TableCell align="right">QTY</TableCell>
                  <TableCell align="right">TOTAL</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {details.length ? (
                  details.map((d, i) => (
                    <TableRow key={d?.sale_details_id ?? i}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{d?.prod_cat_name || "-"}</TableCell>
                      <TableCell>{d?.prod_name || "-"}</TableCell>
                      <TableCell>{d?.prod_brand_name || "-"}</TableCell>
                      <TableCell>{d?.prod_unit_name || "-"}</TableCell>
                      <TableCell align="right">{money(d?.sale_rate)}</TableCell>
                      <TableCell align="right">{Number(d?.sale_qty || 0).toLocaleString()}</TableCell>
                      <TableCell align="right">{money(d?.sale_prod_total)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell align="center" colSpan={8}>No item found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <Box sx={{ width: { xs: "100%", md: "50%" }, ml: "auto", mt: 1 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", p: 1.5, borderBottom: "1px solid #e1e1e1" }}>
                <Typography>Sub Total :</Typography>
                <Typography>{money(quotationData?.sale_subtotal_amount)}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", p: 1.5, borderBottom: "1px solid #e1e1e1" }}>
                <Typography>Transport Cost :</Typography>
                <Typography>{money(quotationData?.sale_transport_cost)}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", p: 1.5, borderBottom: "1px solid #e1e1e1" }}>
                <Typography>Vat :</Typography>
                <Typography>{money(quotationData?.sale_vat_amount)}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", p: 1.5, borderBottom: "1px solid #e1e1e1" }}>
                <Typography>Discount :</Typography>
                <Typography>{money(quotationData?.sale_discount_amount)}</Typography>
              </Box>
              <Box sx={{ height: 28, background: "#cfcfcf", my: 1 }} />
              <Box sx={{ display: "flex", justifyContent: "space-between", p: 1.5 }}>
                <Typography sx={{ fontWeight: 700 }}>Total :</Typography>
                <Typography sx={{ fontWeight: 700 }}>{money(quotationData?.sale_total_amount)}</Typography>
              </Box>
            </Box>

            <Box sx={{ mt: 3 }}>
              <Typography>In Word : Twelve Thousand Five Hundred and only</Typography>
              <Typography sx={{ mt: 2 }}>Note : N/A</Typography>
              {!!termsAndConditions.length && (
                <Box sx={{ mt: 2 }}>
                  <Typography sx={{ fontWeight: 700 }}>Terms & Conditions:</Typography>
                  <Box component="ul" sx={{ m: 0, pl: 3 }}>
                    {termsAndConditions.map((term, idx) => (
                      <Box component="li" key={`${idx}-${term}`}>
                        <Typography>{term}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </Box>

            
          </>
        )}
        </Box>
        <Box
          ref={pdfRef}
          sx={{
            position: "fixed",
            left: "-10000px",
            top: 0,
            width: 1100,
            background: "#fff",
            p: 3,
          }}
        >
          <Typography sx={{ textAlign: "center", fontWeight: 700, fontSize: 28, mb: 2 }}>
            Quotation Invoice
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <Typography><b>Customer ID :</b> {quotationData?.customer_code || quotationData?.customer_id || "-"}</Typography>
              <Typography><b>Customer Name :</b> {quotationData?.customer_name || "-"}</Typography>
              <Typography><b>Institution Name :</b> {quotationData?.customer_institution_name || institutionData?.institution_name || "-"}</Typography>
              <Typography><b>Customer Address :</b> {quotationData?.customer_address || "-"}</Typography>
              <Typography><b>Customer Mobile :</b> {quotationData?.customer_mobile_no || "-"}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography><b>Quotation By :</b> {quotationData?.user_full_name || quotationData?.employee_name || "-"}</Typography>
              <Typography><b>Invoice No :</b> {quotationData?.sale_invoice || invoiceNo || "-"}</Typography>
              <Typography><b>Date & Time :</b> {dateTimeText}</Typography>
            </Grid>
          </Grid>

          <Table size="small" sx={{ mt: 2, border: "1px solid #d5d5d5" }}>
            <TableHead sx={{ background: "#eceff3" }}>
              <TableRow>
                <TableCell>SL</TableCell>
                <TableCell>CATEGORY</TableCell>
                <TableCell>PRODUCT</TableCell>
                <TableCell>BRAND</TableCell>
                <TableCell>UNIT</TableCell>
                <TableCell align="right">UNIT PRICE IN BDT</TableCell>
                <TableCell align="right">QTY</TableCell>
                <TableCell align="right">TOTAL</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {details.length ? (
                details.map((d, i) => (
                  <TableRow key={`pdf-${d?.sale_details_id ?? i}`}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{d?.prod_cat_name || "-"}</TableCell>
                    <TableCell>{d?.prod_name || "-"}</TableCell>
                    <TableCell>{d?.prod_brand_name || "-"}</TableCell>
                    <TableCell>{d?.prod_unit_name || "-"}</TableCell>
                    <TableCell align="right">{money(d?.sale_rate)}</TableCell>
                    <TableCell align="right">{Number(d?.sale_qty || 0).toLocaleString()}</TableCell>
                    <TableCell align="right">{money(d?.sale_prod_total)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell align="center" colSpan={8}>No item found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <Box sx={{ width: "50%", ml: "auto", mt: 1 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", p: 1.5, borderBottom: "1px solid #e1e1e1" }}>
              <Typography>Sub Total :</Typography>
              <Typography>{money(quotationData?.sale_subtotal_amount)}</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", p: 1.5, borderBottom: "1px solid #e1e1e1" }}>
              <Typography>Transport Cost :</Typography>
              <Typography>{money(quotationData?.sale_transport_cost)}</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", p: 1.5, borderBottom: "1px solid #e1e1e1" }}>
              <Typography>Vat :</Typography>
              <Typography>{money(quotationData?.sale_vat_amount)}</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", p: 1.5, borderBottom: "1px solid #e1e1e1" }}>
              <Typography>Discount :</Typography>
              <Typography>{money(quotationData?.sale_discount_amount)}</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", p: 1.5 }}>
              <Typography sx={{ fontWeight: 700 }}>Total :</Typography>
              <Typography sx={{ fontWeight: 700 }}>{money(quotationData?.sale_total_amount)}</Typography>
            </Box>
          </Box>

          <Box sx={{ mt: 3 }}>
            <Typography>In Word : Twelve Thousand Five Hundred and only</Typography>
            <Typography sx={{ mt: 2 }}>Note : N/A</Typography>
            {!!termsAndConditions.length && (
              <Box sx={{ mt: 2 }}>
                <Typography sx={{ fontWeight: 700 }}>Terms & Conditions:</Typography>
                <Box component="ul" sx={{ m: 0, pl: 3 }}>
                  {termsAndConditions.map((term, idx) => (
                    <Box component="li" key={`pdf-term-${idx}-${term}`}>
                      <Typography>{term}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default QuotationInvoice;
