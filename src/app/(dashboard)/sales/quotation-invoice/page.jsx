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
  const selectedBrand = optionGroupB;
  const showBrandHeaderFooter = selectedBrand === "SKF" || selectedBrand === "NTN";
  const termColumns = useMemo(() => {
    if (!termsAndConditions.length) return [[], []];
    if (!showBrandHeaderFooter || termsAndConditions.length < 4) return [termsAndConditions, []];
    const midpoint = Math.ceil(termsAndConditions.length / 2);
    return [termsAndConditions.slice(0, midpoint), termsAndConditions.slice(midpoint)];
  }, [termsAndConditions, showBrandHeaderFooter]);
  const assetBase = typeof window !== "undefined" ? window.location.origin : "";
  const brandMeta = {
    SKF: {
      logo: `${assetBase}/skf-logo.svg`,
      footerLine: "SKF Authorized Industrial Distributor",
    },
    NTN: {
      logo: `${assetBase}/ntn-middle-east.svg`,
      footerLine: "NTN Authorized Industrial Distributor",
    },
  };
  const activeBrand = showBrandHeaderFooter ? brandMeta[selectedBrand] : null;
  const institutionName = "SHARIF BEARING & MACHINERIES";
  const institutionTaglineBn = "শরিফ বিয়ারিং এন্ড মেশিনারিজ";
  const institutionBusinessLine =
    "Importer, Wholesaler & Retailer of all kinds of Ball, Taper and Roller Bearings";
  const institutionAddressLine = "Address: 89 Nawabpur Road, Nawabpur, Dhaka-1100, Bangladesh";
  const institutionPhoneLine =
    "Telephone: +88-02-47117674, 223386738, Mobile: +88 01711-843583, +88 01300-027111";
  const institutionEmailLine = "Email: nawabpur.sharifbearing@gmail.com";
  const headerLogoSrc = `${assetBase}/sbm-header-logo.svg`;

  const renderBrandHeader = (isPdf = false, className = "") =>
    showBrandHeaderFooter ? (
      <Box className={className} sx={{ mb: 1.5 }}>
        <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start", pb: 1 }}>
          <Box
            sx={{
              width: 84,
              height: 84,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box component="img" src={headerLogoSrc} alt="SBM" crossOrigin="anonymous" sx={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </Box>
          <Box sx={{ flex: 1, textAlign: "center", pr: isPdf ? 10 : { xs: 0, md: 10 }, pt: 0.25 }}>
            {!!institutionTaglineBn && (
              <Typography sx={{ fontSize: 20, fontWeight: 700, lineHeight: 1.05, mb: 0.25 }}>
                {institutionTaglineBn}
              </Typography>
            )}
            <Typography sx={{ fontWeight: 800, color: "#5d8f43", fontSize: isPdf ? 30 : { xs: 24, md: 34 }, lineHeight: 1.05, letterSpacing: 0.6 }}>
              {institutionName}
            </Typography>
            <Typography sx={{ fontSize: 12, lineHeight: 1.15 }}>{institutionBusinessLine}</Typography>
            <Typography sx={{ fontSize: 12, lineHeight: 1.15 }}>{institutionAddressLine}</Typography>
            <Typography sx={{ fontSize: 12, lineHeight: 1.15 }}>{institutionPhoneLine}</Typography>
            <Typography sx={{ fontSize: 12, lineHeight: 1.15 }}>{institutionEmailLine}</Typography>
          </Box>
        </Box>
        <Divider sx={{ borderColor: "#3f6db5", borderBottomWidth: 2 }} />
        <Typography sx={{ textAlign: "center", fontWeight: 700, fontSize: 48 / 2, textDecoration: "underline", mt: 1, mb: 1.5 }}>
          Quotation
        </Typography>
      </Box>
    ) : null;

  const renderBrandFooter = (className = "") =>
    showBrandHeaderFooter ? (
      <Box
        className={className}
        sx={{
          mt: "auto",
          mb: "5px",
          border: "1px solid #9db3de",
          borderRadius: 1,
          overflow: "hidden",
          display: "grid",
          gridTemplateColumns: "170px 1fr",
          pageBreakInside: "avoid",
          breakInside: "avoid",
          breakBefore: "avoid-page",
          WebkitPrintColorAdjust: "exact",
          printColorAdjust: "exact",
        }}
      >
        <Box
          sx={{
            background: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 1.5,
            borderRight: "1px solid #9db3de",
            WebkitPrintColorAdjust: "exact",
            printColorAdjust: "exact",
          }}
        >
          <Box component="img" src={activeBrand?.logo} alt={selectedBrand} crossOrigin="anonymous" sx={{ maxWidth: "100%", maxHeight: 44, objectFit: "contain" }} />
        </Box>
        <Box>
          <Box
            sx={{
              py: 1,
              px: 2,
              textAlign: "center",
              background: "#8fa6d0",
              WebkitPrintColorAdjust: "exact",
              printColorAdjust: "exact",
            }}
          >
            <Typography sx={{ fontWeight: 700, color: "#173361" }}>{institutionName}</Typography>
          </Box>
          <Box
            sx={{
              py: 1,
              px: 2,
              textAlign: "center",
              background: "#5d74be",
              WebkitPrintColorAdjust: "exact",
              printColorAdjust: "exact",
            }}
          >
            <Typography sx={{ fontWeight: 700, color: "#fff" }}>{activeBrand?.footerLine}</Typography>
          </Box>
        </Box>
      </Box>
    ) : null;

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

  const buildPdfDocument = async () => {
      const target = pdfRef.current || invoiceRef.current;
      if (!target) return null;

      await loadScript("https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js");
      await loadScript("https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js");

      const html2canvasFn = window.html2canvas;
      const jsPDFCtor = window?.jspdf?.jsPDF;
      if (!html2canvasFn || !jsPDFCtor) {
        alert("PDF libraries failed to load.");
        return null;
      }

      const pdf = new jsPDFCtor("p", "pt", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const marginX = 16;
      const marginY = 16;
      const contentWidth = pageWidth - marginX * 2;

      const waitForImages = async (el) => {
        const imgs = Array.from(el?.querySelectorAll?.("img") || []);
        if (!imgs.length) return;
        await Promise.all(
          imgs.map(
            (img) =>
              new Promise((resolve) => {
                if (img.complete) resolve();
                else {
                  img.onload = () => resolve();
                  img.onerror = () => resolve();
                }
              })
          )
        );
      };
      await waitForImages(target);

      const headerEl = target.querySelector(".pdf-header");
      const footerEl = target.querySelector(".pdf-footer");
      const bodyEl = target.querySelector(".pdf-body-wrapper") || target;

      const [bodyCanvas, headerCanvas, footerCanvas] = await Promise.all([
        html2canvasFn(bodyEl, { scale: 2, useCORS: true, backgroundColor: "#ffffff" }),
        showBrandHeaderFooter && headerEl
          ? html2canvasFn(headerEl, { scale: 2, useCORS: true, backgroundColor: "#ffffff" })
          : Promise.resolve(null),
        showBrandHeaderFooter && footerEl
          ? html2canvasFn(footerEl, { scale: 2, useCORS: true, backgroundColor: "#ffffff" })
          : Promise.resolve(null),
      ]);

      const bodyImg = bodyCanvas.toDataURL("image/png");
      const headerImg = headerCanvas ? headerCanvas.toDataURL("image/png") : null;
      const footerImg = footerCanvas ? footerCanvas.toDataURL("image/png") : null;

      const headerHeight = headerCanvas ? (headerCanvas.height * contentWidth) / headerCanvas.width : 0;
      const footerHeight = footerCanvas ? (footerCanvas.height * contentWidth) / footerCanvas.width : 0;
      const bodyTop = marginY + (showBrandHeaderFooter ? headerHeight + 8 : 0);
      const bodyBottom = pageHeight - marginY - (showBrandHeaderFooter ? footerHeight + 8 : 0);
      const bodyPageHeight = Math.max(120, bodyBottom - bodyTop);
      const bodyRenderHeight = (bodyCanvas.height * contentWidth) / bodyCanvas.width;

      const drawPageShell = () => {
        if (!showBrandHeaderFooter) return;
        if (headerImg) pdf.addImage(headerImg, "PNG", marginX, marginY, contentWidth, headerHeight);
        if (footerImg) pdf.addImage(footerImg, "PNG", marginX, pageHeight - marginY - footerHeight, contentWidth, footerHeight);
      };

      let remaining = bodyRenderHeight;
      let position = bodyTop;
      drawPageShell();
      pdf.addImage(bodyImg, "PNG", marginX, position, contentWidth, bodyRenderHeight);
      remaining -= bodyPageHeight;

      while (remaining > 0) {
        position = remaining - bodyRenderHeight + bodyTop;
        pdf.addPage();
        drawPageShell();
        pdf.addImage(bodyImg, "PNG", marginX, position, contentWidth, bodyRenderHeight);
        remaining -= bodyPageHeight;
      }

      return pdf;
    };

  const handlePrint = () => {
    buildPdfDocument()
      .then((pdf) => {
        if (!pdf) return;
        pdf.autoPrint();
        const blobUrl = pdf.output("bloburl");
        window.open(blobUrl, "_blank");
      })
      .catch((error) => {
        console.error("[QuotationInvoice] PDF print failed", error);
        alert("Failed to print PDF.");
      });
  };

  const handleDownloadPdf = () => {
    const run = async () => {
      const pdf = await buildPdfDocument();
      if (!pdf) return;
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

        <Box
          ref={invoiceRef}
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
        {renderBrandHeader(false)}
        <Box>
        {showOptionATemplate ? (
          <>
            <Box sx={{ mt: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 3, flexWrap: { xs: "wrap", md: "nowrap" } }}>
              <Box sx={{ width: { xs: "100%", md: "48%" } }}>
                <Typography><b>Customer ID :</b> {quotationData?.customer_code || quotationData?.customer_id || "-"}</Typography>
                <Typography><b>Customer Name :</b> {quotationData?.customer_name || "-"}</Typography>
                <Typography><b>Institution Name :</b> {quotationData?.customer_institution_name || institutionData?.institution_name || "-"}</Typography>
                <Typography><b>Customer Address :</b> {quotationData?.customer_address || "-"}</Typography>
                <Typography><b>Customer Mobile :</b> {quotationData?.customer_mobile_no || "-"}</Typography>
              </Box>

              <Box sx={{ width: { xs: "100%", md: "48%" }, ml: { xs: 0, md: "auto" }, textAlign: { xs: "left", md: "right" } }}>
                <Typography><b>Quotation By :</b> {quotationData?.user_full_name || quotationData?.employee_name || "-"}</Typography>
                <Typography><b>Invoice No :</b> {quotationData?.sale_invoice || invoiceNo || "-"}</Typography>
                <Typography><b>Date & Time :</b> {dateTimeText}</Typography>
              </Box>
            </Box>

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
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: showBrandHeaderFooter ? "1fr 1fr" : "1fr" }, columnGap: 3, rowGap: 1 }}>
                <Typography>In Word : Twelve Thousand Five Hundred and only</Typography>
                <Typography>Note : N/A</Typography>
              </Box>
              {!!termsAndConditions.length && (
                <Box sx={{ mt: 2 }}>
                  <Typography sx={{ fontWeight: 700 }}>Terms & Conditions:</Typography>
                  <Box sx={{ display: "grid", gridTemplateColumns: showBrandHeaderFooter && termColumns[1].length ? "1fr 1fr" : "1fr", columnGap: 4 }}>
                    <Box component="ul" sx={{ m: 0, pl: 3 }}>
                      {termColumns[0].map((term, idx) => (
                        <Box component="li" key={`a-left-${idx}-${term}`} sx={{ mb: 0.25 }}>
                          <Typography sx={{ lineHeight: 1.4 }}>{term}</Typography>
                        </Box>
                      ))}
                    </Box>
                    {!!termColumns[1].length && (
                      <Box component="ul" sx={{ m: 0, pl: 3 }}>
                        {termColumns[1].map((term, idx) => (
                          <Box component="li" key={`a-right-${idx}-${term}`} sx={{ mb: 0.25 }}>
                            <Typography sx={{ lineHeight: 1.4 }}>{term}</Typography>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>
                </Box>
              )}
            </Box>
          </>
        ) : (
          <>
            <Box sx={{ mt: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 3, flexWrap: { xs: "wrap", md: "nowrap" } }}>
              <Box sx={{ width: { xs: "100%", md: "48%" } }}>
                <Typography><b>Customer ID :</b> {quotationData?.customer_code || quotationData?.customer_id || "-"}</Typography>
                <Typography><b>Customer Name :</b> {quotationData?.customer_name || "-"}</Typography>
                <Typography><b>Institution Name :</b> {quotationData?.customer_institution_name || institutionData?.institution_name || "-"}</Typography>
                <Typography><b>Customer Address :</b> {quotationData?.customer_address || "-"}</Typography>
                <Typography><b>Customer Mobile :</b> {quotationData?.customer_mobile_no || "-"}</Typography>
              </Box>

              <Box sx={{ width: { xs: "100%", md: "48%" }, ml: { xs: 0, md: "auto" }, textAlign: { xs: "left", md: "right" } }}>
                <Typography><b>Quotation By :</b> {quotationData?.user_full_name || quotationData?.employee_name || "-"}</Typography>
                <Typography><b>Invoice No :</b> {quotationData?.sale_invoice || invoiceNo || "-"}</Typography>
                <Typography><b>Date & Time :</b> {dateTimeText}</Typography>
              </Box>
            </Box>

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

            <Box className="print-avoid-break" sx={{ width: { xs: "100%", md: "50%" }, ml: "auto", mt: 1 }}>
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

            <Box className="print-avoid-break" sx={{ mt: 3 }}>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: showBrandHeaderFooter ? "1fr 1fr" : "1fr" }, columnGap: 3, rowGap: 1 }}>
                <Typography>In Word : Twelve Thousand Five Hundred and only</Typography>
                <Typography>Note : N/A</Typography>
              </Box>
              {!!termsAndConditions.length && (
                <Box sx={{ mt: 2 }}>
                  <Typography sx={{ fontWeight: 700 }}>Terms & Conditions:</Typography>
                  <Box sx={{ display: "grid", gridTemplateColumns: showBrandHeaderFooter && termColumns[1].length ? "1fr 1fr" : "1fr", columnGap: 4 }}>
                    <Box component="ul" sx={{ m: 0, pl: 3 }}>
                      {termColumns[0].map((term, idx) => (
                        <Box component="li" key={`b-left-${idx}-${term}`} sx={{ mb: 0.25 }}>
                          <Typography sx={{ lineHeight: 1.4 }}>{term}</Typography>
                        </Box>
                      ))}
                    </Box>
                    {!!termColumns[1].length && (
                      <Box component="ul" sx={{ m: 0, pl: 3 }}>
                        {termColumns[1].map((term, idx) => (
                          <Box component="li" key={`b-right-${idx}-${term}`} sx={{ mb: 0.25 }}>
                            <Typography sx={{ lineHeight: 1.4 }}>{term}</Typography>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>
                </Box>
              )}
            </Box>

          </>
        )}
        </Box>
        {renderBrandFooter()}
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
            display: "flex",
            flexDirection: "column",
          }}
        >
          {renderBrandHeader(true, "pdf-header")}
          {!showBrandHeaderFooter && (
            <Typography sx={{ textAlign: "center", fontWeight: 700, fontSize: 28, mb: 2 }}>
              Quotation Invoice
            </Typography>
          )}
          <Box className="pdf-body-wrapper">
          <Box sx={{ mt: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 3 }}>
            <Box sx={{ width: "48%" }}>
              <Typography><b>Customer ID :</b> {quotationData?.customer_code || quotationData?.customer_id || "-"}</Typography>
              <Typography><b>Customer Name :</b> {quotationData?.customer_name || "-"}</Typography>
              <Typography><b>Institution Name :</b> {quotationData?.customer_institution_name || institutionData?.institution_name || "-"}</Typography>
              <Typography><b>Customer Address :</b> {quotationData?.customer_address || "-"}</Typography>
              <Typography><b>Customer Mobile :</b> {quotationData?.customer_mobile_no || "-"}</Typography>
            </Box>
            <Box sx={{ width: "48%", ml: "auto", textAlign: "right" }}>
              <Typography><b>Quotation By :</b> {quotationData?.user_full_name || quotationData?.employee_name || "-"}</Typography>
              <Typography><b>Invoice No :</b> {quotationData?.sale_invoice || invoiceNo || "-"}</Typography>
              <Typography><b>Date & Time :</b> {dateTimeText}</Typography>
            </Box>
          </Box>

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

          <Box className="print-avoid-break" sx={{ width: "50%", ml: "auto", mt: 1 }}>
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

          <Box className="print-avoid-break" sx={{ mt: 3 }}>
            <Box sx={{ display: "grid", gridTemplateColumns: showBrandHeaderFooter ? "1fr 1fr" : "1fr", columnGap: 3, rowGap: 1 }}>
              <Typography>In Word : Twelve Thousand Five Hundred and only</Typography>
              <Typography>Note : N/A</Typography>
            </Box>
            {!!termsAndConditions.length && (
              <Box sx={{ mt: 2 }}>
                <Typography sx={{ fontWeight: 700 }}>Terms & Conditions:</Typography>
                <Box sx={{ display: "grid", gridTemplateColumns: showBrandHeaderFooter && termColumns[1].length ? "1fr 1fr" : "1fr", columnGap: 4 }}>
                  <Box component="ul" sx={{ m: 0, pl: 3 }}>
                    {termColumns[0].map((term, idx) => (
                      <Box component="li" key={`pdf-left-${idx}-${term}`} sx={{ mb: 0.25 }}>
                        <Typography sx={{ lineHeight: 1.4 }}>{term}</Typography>
                      </Box>
                    ))}
                  </Box>
                  {!!termColumns[1].length && (
                    <Box component="ul" sx={{ m: 0, pl: 3 }}>
                      {termColumns[1].map((term, idx) => (
                        <Box component="li" key={`pdf-right-${idx}-${term}`} sx={{ mb: 0.25 }}>
                          <Typography sx={{ lineHeight: 1.4 }}>{term}</Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              </Box>
            )}
          </Box>
          </Box>
          {renderBrandFooter("pdf-footer")}
        </Box>
      </Paper>
    </Box>
  );
};

export default QuotationInvoice;
