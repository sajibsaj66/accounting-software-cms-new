"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  TextField,
  Button,
  IconButton,
  Typography,
  Autocomplete,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import useAuth from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";

const DRAFT_STORAGE_KEY = "quotation-entry-draft-v1";

export default function QuotationEntry() {
  const authInfo = useAuth();
  const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const optionItems = [
    { key: "offerValidity", label: "Offer Validity: 20 Days from quotation issue date" },
    { key: "excludeDelivery", label: "Price quoted excluding delivery charge" },
    { key: "validForQuantity", label: "Quotation is only valid for the above quantity" },
    { key: "vatAitRules", label: "Including VAT & AIT per government's rules" },
    { key: "stockAvailable", label: "Our stock is available" },
  ];

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [rate, setRate] = useState(0);
  const [qty, setQty] = useState("");
  const [cart, setCart] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  const [discount, setDiscount] = useState(0);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountMode, setDiscountMode] = useState("amount");
  const [vat, setVat] = useState(0);
  const [vatPercent, setVatPercent] = useState(0);
  const [vatMode, setVatMode] = useState("amount");
  const [ait, setAit] = useState(0);
  const [aitPercent, setAitPercent] = useState(0);
  const [aitMode, setAitMode] = useState("amount");
  const [transport, setTransport] = useState(0);
  const [currentDue, setCurrentDue] = useState(0);

  const [selectedOptions, setSelectedOptions] = useState(() =>
    optionItems.reduce((acc, item) => ({ ...acc, [item.key]: false }), {})
  );

  const [subTotal, setSubTotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [saleInvoice, setSaleInvoice] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // FIX: date state যোগ করা হয়েছে
  const [quotationDate, setQuotationDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  const round2 = (value) => Math.round((Number(value) || 0) * 100) / 100;

  const getProductLabel = (option) =>
    `${option?.prod_code || ""} - ${option?.prod_brand_name || ""} - ${option?.prod_color_name || ""}`.trim();

  const getCustomerLabel = (option) =>
    option?.customer_name || option?.display_text || option?.name || "";

  useEffect(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.rate * item.qty, 0);
    setSubTotal(subtotal);
  }, [cart]);

  useEffect(() => {
    const toNum = (v) => Number(v) || 0;
    const grand =
      toNum(subTotal) +
      toNum(currentDue) -
      toNum(discount) +
      toNum(vat) +
      toNum(ait) +
      toNum(transport);
    setTotal(round2(grand));
  }, [subTotal, currentDue, discount, vat, ait, transport]);

  useEffect(() => {
    if (discountMode === "percent") {
      const nextDiscount = subTotal > 0 ? round2((subTotal * discountPercent) / 100) : 0;
      if (nextDiscount !== discount) setDiscount(nextDiscount);
    } else {
      const nextPercent = subTotal > 0 ? round2((discount * 100) / subTotal) : 0;
      if (nextPercent !== discountPercent) setDiscountPercent(nextPercent);
    }
  }, [subTotal, discountMode, discountPercent, discount]);

  useEffect(() => {
    if (vatMode === "percent") {
      const nextVat = subTotal > 0 ? round2((subTotal * vatPercent) / 100) : 0;
      if (nextVat !== vat) setVat(nextVat);
    } else {
      const nextPercent = subTotal > 0 ? round2((vat * 100) / subTotal) : 0;
      if (nextPercent !== vatPercent) setVatPercent(nextPercent);
    }
  }, [subTotal, vatMode, vatPercent, vat]);

  useEffect(() => {
    if (aitMode === "percent") {
      const nextAit = subTotal > 0 ? round2((subTotal * aitPercent) / 100) : 0;
      if (nextAit !== ait) setAit(nextAit);
    } else {
      const nextPercent = subTotal > 0 ? round2((ait * 100) / subTotal) : 0;
      if (nextPercent !== aitPercent) setAitPercent(nextPercent);
    }
  }, [subTotal, aitMode, aitPercent, ait]);

  const addToCart = () => {
    if (!selectedProduct || !qty) return;

    const qtyNum = Number(qty);
    const rateNum = Number(rate);
    if (!qtyNum || qtyNum <= 0) return;

    const payload = {
      productId: selectedProduct?.prod_id || selectedProduct?.id,
      prod_id: selectedProduct?.prod_id || selectedProduct?.id,
      name:
        selectedProduct?.prod_name ||
        selectedProduct?.name ||
        getProductLabel(selectedProduct),
      prod_name:
        selectedProduct?.prod_name ||
        selectedProduct?.name ||
        getProductLabel(selectedProduct),
      brand: selectedProduct?.prod_brand_name || selectedProduct?.brand || "",
      unit: selectedProduct?.prod_unit_name || selectedProduct?.unit || "",
      prod_cat_name:
        selectedProduct?.prod_cat_name ||
        selectedProduct?.category_name ||
        selectedProduct?.cat_name ||
        "",
      prod_brand_name:
        selectedProduct?.prod_brand_name ||
        selectedProduct?.brand_name ||
        selectedProduct?.brand ||
        "",
      prod_unit_name:
        selectedProduct?.prod_unit_name ||
        selectedProduct?.unit_name ||
        selectedProduct?.unit ||
        "",
      prod_set_no: selectedProduct?.prod_set_no || "",
      prod_set_qty: Number(selectedProduct?.prod_set_qty) || 0,
      entered_set_no: Number(selectedProduct?.entered_set_no) || 0,
      prod_purchase_rate: Number(selectedProduct?.prod_purchase_rate) || 0,
      rate: rateNum || 0,
      prod_sale_rate: rateNum || 0,
      qty: qtyNum,
      prod_qty: qtyNum,
      prod_total: (rateNum || 0) * qtyNum,
    };

    if (editingIndex !== null) {
      setCart((prev) =>
        prev.map((item, index) => (index === editingIndex ? { ...item, ...payload } : item))
      );
    } else {
      setCart((prev) => [...prev, payload]);
    }

    setSelectedProduct(null);
    setRate(0);
    setQty("");
    setEditingIndex(null);
  };

  const removeItem = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setSelectedProduct(null);
      setRate(0);
      setQty("");
      setEditingIndex(null);
    } else if (editingIndex !== null && index < editingIndex) {
      setEditingIndex((prev) => (prev === null ? null : prev - 1));
    }
  };

  const startEditItem = (index) => {
    const item = cart[index];
    if (!item) return;

    const productId = item?.prod_id || item?.productId;
    const matchedProduct = products.find(
      (product) => String(product?.prod_id || product?.id) === String(productId)
    );

    setSelectedProduct(
      matchedProduct || {
        prod_id: productId,
        id: productId,
        prod_name: item?.prod_name || item?.name || "",
        prod_brand_name: item?.prod_brand_name || item?.brand || "",
        prod_unit_name: item?.prod_unit_name || item?.unit || "",
      }
    );
    setRate(item?.prod_sale_rate ?? item?.rate ?? 0);
    setQty(item?.prod_qty ?? item?.qty ?? "");
    setEditingIndex(index);
  };

  const cancelEdit = () => {
    setSelectedProduct(null);
    setRate(0);
    setQty("");
    setEditingIndex(null);
  };

  const handleDiscountAmount = (value) => {
    setDiscountMode("amount");
    const amount = round2(value);
    setDiscount(amount);
    setDiscountPercent(subTotal > 0 ? round2((amount * 100) / subTotal) : 0);
  };

  const handleDiscountPercent = (value) => {
    setDiscountMode("percent");
    const percent = round2(value);
    setDiscountPercent(percent);
    setDiscount(subTotal > 0 ? round2((subTotal * percent) / 100) : 0);
  };

  const handleVatAmount = (value) => {
    setVatMode("amount");
    const amount = round2(value);
    setVat(amount);
    setVatPercent(subTotal > 0 ? round2((amount * 100) / subTotal) : 0);
  };

  const handleVatPercent = (value) => {
    setVatMode("percent");
    const percent = round2(value);
    setVatPercent(percent);
    setVat(subTotal > 0 ? round2((subTotal * percent) / 100) : 0);
  };

  const handleAitAmount = (value) => {
    setAitMode("amount");
    const amount = round2(value);
    setAit(amount);
    setAitPercent(subTotal > 0 ? round2((amount * 100) / subTotal) : 0);
  };

  const handleAitPercent = (value) => {
    setAitMode("percent");
    const percent = round2(value);
    setAitPercent(percent);
    setAit(subTotal > 0 ? round2((subTotal * percent) / 100) : 0);
  };

  const clearQuotation = () => {
    setCart([]);
    setSelectedProduct(null);
    setQty("");
    setRate(0);
    setEditingIndex(null);
    setDiscount(0);
    setDiscountPercent(0);
    setDiscountMode("amount");
    setVat(0);
    setVatPercent(0);
    setVatMode("amount");
    setAit(0);
    setAitPercent(0);
    setAitMode("amount");
    setTransport(0);
    setCurrentDue(0);
    setSelectedOptions(optionItems.reduce((acc, item) => ({ ...acc, [item.key]: false }), {}));
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(DRAFT_STORAGE_KEY);
    }
  };

  const toggleOption = (key) => {
    setSelectedOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const selectedOptionLabels = optionItems
    .filter((item) => selectedOptions[item.key])
    .map((item) => item.label);

  const handleQuotationSubmit = async () => {
    if (!cart.length) return alert("Please add at least one product to cart.");
    if (!API_URL || !authInfo?.token) return alert("Authentication not valid, please login!");
    if (!selectedEmployee?.employee_id) return alert("Quotation By (employee) select please");
    if (!selectedCustomer?.customer_id) return alert("Customer select please");
    if (!saleInvoice) return alert("Invoice no পাওয়া যায়নি, refresh দিয়ে আবার try করুন");

    // FIX: old backend schema অনুযায়ী payload
    const sale = {
      sale_invoice: saleInvoice,
      sale_emp_id: selectedEmployee.employee_id,
      created_isodt: new Date(quotationDate).toISOString(),
      customer_id: Number(selectedCustomer.customer_id) || 0,
      customer_name: selectedCustomer.customer_name || "",
      customer_mobile_no: selectedCustomer.customer_mobile_no || "",
      customer_address: selectedCustomer.customer_address || "",
      customer_email: selectedCustomer.customer_email || "",
      sale_transport_cost: Number(transport) || 0,
      sale_cus_type: selectedCustomer.customer_type || "regular",
      sub_total: Number(subTotal) || 0,
      vat: Number(vat) || 0,
      vat_percent: Number(vatPercent) || 0,
      discount: Number(discount) || 0,
      discount_percent: Number(discountPercent) || 0,
      total_amount: Number(total) || 0,
      sale_id: 0,
      checkbox_values: selectedOptionLabels,
    };

    const cartPayload = cart.map((item) => ({
      prod_id: item.prod_id || item.productId,
      prod_name: item.name || item.prod_name || "", // FIX: added
      prod_sale_rate: Number(item.prod_sale_rate ?? item.rate) || 0,
      prod_purchase_rate: Number(item.prod_purchase_rate) || 0,
      prod_qty: Number(item.prod_qty ?? item.qty) || 0,
      prod_total:
        Number(item.prod_total) ||
        (Number(item.prod_sale_rate ?? item.rate) || 0) *
          (Number(item.prod_qty ?? item.qty) || 0),
      prod_cat_name: item.prod_cat_name || "",
      prod_brand_name: item.prod_brand_name || item.brand || "",
      prod_unit_name: item.prod_unit_name || item.unit || "",
      prod_set_no: item.prod_set_no || "",
      prod_set_qty: Number(item.prod_set_qty) || 0,
      entered_set_no: Number(item.entered_set_no) || 0,
    }));

    setIsSaving(true);
    try {
      const res = await axios.post(
        `${API_URL}/api/save-quotation`,
        { sale, cart: cartPayload },
        { headers: { "auth-token": authInfo.token } }
      );

      if (res?.data?.error) {
        alert(res?.data?.message?.msg || res?.data?.message || "Quotation save failed");
        return;
      }

      alert(res?.data?.message?.msg || "Quotation saved successfully");
      clearQuotation();
      getInvoice();
    } catch (error) {
      alert(error?.response?.data?.message || "Quotation save failed");
    } finally {
      setIsSaving(false);
    }
  };

  const getInvoice = async () => {
    if (!API_URL || !authInfo?.token) return;
    try {
      const res = await axios.get(`${API_URL}/api/get-quotation-invoice`, {
        headers: { "auth-token": authInfo.token },
      });
      setSaleInvoice(res?.data?.message ?? "");
    } catch {
      setSaleInvoice("");
    }
  };

  useEffect(() => {
    getInvoice();
  }, [API_URL, authInfo?.token]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
      if (!raw) return;
      const draft = JSON.parse(raw);

      setSelectedCustomer(draft?.selectedCustomer ?? null);
      setSelectedProduct(draft?.selectedProduct ?? null);
      setSelectedEmployee(draft?.selectedEmployee ?? null);
      setRate(draft?.rate ?? 0);
      setQty(draft?.qty ?? "");
      setCart(Array.isArray(draft?.cart) ? draft.cart : []);
      setEditingIndex(
        typeof draft?.editingIndex === "number" && draft.editingIndex >= 0
          ? draft.editingIndex
          : null
      );
      setDiscount(draft?.discount ?? 0);
      setDiscountPercent(draft?.discountPercent ?? 0);
      setDiscountMode(draft?.discountMode ?? "amount");
      setVat(draft?.vat ?? 0);
      setVatPercent(draft?.vatPercent ?? 0);
      setVatMode(draft?.vatMode ?? "amount");
      setAit(draft?.ait ?? 0);
      setAitPercent(draft?.aitPercent ?? 0);
      setAitMode(draft?.aitMode ?? "amount");
      setTransport(draft?.transport ?? 0);
      setCurrentDue(draft?.currentDue ?? 0);
      setQuotationDate(draft?.quotationDate || new Date().toISOString().slice(0, 10));
      setSelectedOptions((prev) => ({ ...prev, ...(draft?.selectedOptions || {}) }));
    } catch (_error) {}
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const draft = {
      selectedCustomer,
      selectedProduct,
      selectedEmployee,
      rate,
      qty,
      cart,
      editingIndex,
      discount,
      discountPercent,
      discountMode,
      vat,
      vatPercent,
      vatMode,
      ait,
      aitPercent,
      aitMode,
      transport,
      currentDue,
      quotationDate,
      selectedOptions,
    };
    window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
  }, [
    selectedCustomer,
    selectedProduct,
    selectedEmployee,
    rate,
    qty,
    cart,
    editingIndex,
    discount,
    discountPercent,
    discountMode,
    vat,
    vatPercent,
    vatMode,
    ait,
    aitPercent,
    aitMode,
    transport,
    currentDue,
    quotationDate,
    selectedOptions,
  ]);

  const { data: employeesData } = useQuery({
    queryKey: ["employees", authInfo?.token],
    queryFn: async () => {
      const res = await axios.post(
        `${API_URL}/api/get-employees`,
        { "select-type": "active" },
        { headers: { "auth-token": authInfo?.token } }
      );
      return res.data;
    },
    enabled: Boolean(API_URL && authInfo?.token),
  });

  const { data: customersData } = useQuery({
    queryKey: ["customers", authInfo?.token],
    queryFn: async () => {
      const res = await axios.post(
        `${API_URL}/api/get-customers`,
        { "select-type": "active" },
        { headers: { "auth-token": authInfo?.token } }
      );
      return res.data;
    },
    enabled: Boolean(API_URL && authInfo?.token),
  });

  const { data: productsData } = useQuery({
    queryKey: ["products", authInfo?.token],
    queryFn: async () => {
      const res = await axios.post(
        `${API_URL}/api/get-individual-products`,
        { "select-type": "active" },
        { headers: { "auth-token": authInfo?.token } }
      );
      return res.data;
    },
    enabled: Boolean(API_URL && authInfo?.token),
  });

  const employees = employeesData?.message ?? [];
  const customers = customersData?.message ?? [];
  const products = productsData?.message ?? [];

  return (
    <Box sx={{ p: 3, background: "#f5f6f8", minHeight: "100vh" }}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">Quotation Entry</Typography>

        <Grid container spacing={3} mt={1}>
          <Grid item xs={12} md={3}>
            <TextField label="Invoice No" value={saleInvoice} fullWidth disabled />
          </Grid>

          <Grid item xs={12} md={6}>
            <Autocomplete
              options={employees}
              getOptionLabel={(option) => option?.employee_name || ""}
              value={selectedEmployee}
              onChange={(_, value) => setSelectedEmployee(value)}
              isOptionEqualToValue={(option, value) => option?.employee_id === value?.employee_id}
              renderInput={(params) => <TextField {...params} label="Quotation By" fullWidth />}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              type="date"
              label="Quotation Date"
              InputLabelProps={{ shrink: true }}
              value={quotationDate}
              onChange={(e) => setQuotationDate(e.target.value)}
              fullWidth
            />
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ width: "100%", overflowX: "auto" }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: 2,
            alignItems: "start",
            minWidth: 1180,
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1">Customer & Product Information</Typography>

              <Box
                sx={{
                  mt: 2,
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 2,
                }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Autocomplete
                    options={customers}
                    getOptionLabel={getCustomerLabel}
                    value={selectedCustomer}
                    onChange={(_, value) => setSelectedCustomer(value)}
                    isOptionEqualToValue={(option, value) => option?.customer_id === value?.customer_id}
                    renderInput={(params) => <TextField {...params} label="Choose Customer" />}
                  />

                  <TextField
                    label="Customer Mobile"
                    value={selectedCustomer?.customer_mobile_no || ""}
                    InputProps={{ readOnly: true }}
                    fullWidth
                    sx={{ mt: 1 }}
                  />
                  <TextField
                    label="Customer Address"
                    value={selectedCustomer?.customer_address || ""}
                    InputProps={{ readOnly: true }}
                    fullWidth
                    sx={{ mt: 1 }}
                  />
                  <TextField
                    label="Customer Email"
                    value={selectedCustomer?.customer_email || ""}
                    InputProps={{ readOnly: true }}
                    fullWidth
                    sx={{ mt: 1 }}
                  />
                </Box>

                <Box sx={{ minWidth: 0 }}>
                  <Autocomplete
                    options={products}
                    getOptionLabel={getProductLabel}
                    value={selectedProduct}
                    onChange={(_, value) => {
                      setSelectedProduct(value);
                      setRate(value?.prod_rate || value?.prod_sale_rate || value?.rate || 0);
                    }}
                    isOptionEqualToValue={(option, value) => option?.prod_id === value?.prod_id}
                    renderInput={(params) => <TextField {...params} label="Choose Product" />}
                  />

                  <Grid container spacing={1} mt={1}>
                    <Grid item xs={6}>
                      <TextField
                        label="Sale Rate"
                        type="number"
                        value={rate}
                        onChange={(e) => setRate(e.target.value)}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Quantity"
                        type="number"
                        value={qty}
                        onChange={(e) => setQty(e.target.value)}
                        fullWidth
                      />
                    </Grid>
                  </Grid>

                  <TextField label="Total" value={Number(rate || 0) * Number(qty || 0)} fullWidth sx={{ mt: 1 }} disabled />

                  <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <Button variant="contained" startIcon={<SaveIcon />} onClick={addToCart}>
                      {editingIndex !== null ? "UPDATE CART" : "ADD TO CART"}
                    </Button>
                    {editingIndex !== null && (
                      <Button variant="outlined" onClick={cancelEdit}>
                        CANCEL EDIT
                      </Button>
                    )}
                  </Box>
                </Box>
              </Box>
            </Paper>

            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1">Quotation Cart</Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>SL</TableCell>
                    <TableCell>Product</TableCell>
                    <TableCell>Brand</TableCell>
                    <TableCell>Unit</TableCell>
                    <TableCell>Rate</TableCell>
                    <TableCell>Qty</TableCell>
                    <TableCell>Subtotal</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cart.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        Cart is empty.
                      </TableCell>
                    </TableRow>
                  )}
                  {cart.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.brand || "-"}</TableCell>
                      <TableCell>{item.unit || "-"}</TableCell>
                      <TableCell>{item.rate}</TableCell>
                      <TableCell>{item.qty}</TableCell>
                      <TableCell>{Number(item.rate || 0) * Number(item.qty || 0)}</TableCell>
                      <TableCell>
                        <IconButton size="small" color="primary" onClick={() => startEditItem(index)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <RemoveCircleIcon
                          color="error"
                          sx={{ cursor: "pointer" }}
                          onClick={() => removeItem(index)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>

            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                Additional Options
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {optionItems.map((item) => (
                  <FormControlLabel
                    key={item.key}
                    control={
                      <Checkbox
                        checked={Boolean(selectedOptions[item.key])}
                        onChange={() => toggleOption(item.key)}
                      />
                    }
                    label={item.label}
                  />
                ))}
              </Box>
            </Paper>
          </Box>

          <Paper sx={{ p: 2, minWidth: 0 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
              Amount Details
            </Typography>

            <Grid container rowSpacing={2} columnSpacing={2}>
              <Grid item xs={6}>
                <TextField label="Subtotal" value={subTotal} fullWidth disabled />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Current Due"
                  type="number"
                  value={currentDue}
                  onChange={(e) => setCurrentDue(e.target.value)}
                  fullWidth
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  label="Vat (TK)"
                  type="number"
                  value={vat}
                  onChange={(e) => handleVatAmount(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="vat (%)"
                  type="number"
                  value={vatPercent}
                  onChange={(e) => handleVatPercent(e.target.value)}
                  fullWidth
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  label="AIT (TK)"
                  type="number"
                  value={ait}
                  onChange={(e) => handleAitAmount(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="AIT (%)"
                  type="number"
                  value={aitPercent}
                  onChange={(e) => handleAitPercent(e.target.value)}
                  fullWidth
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  label="Discount(TK)"
                  type="number"
                  value={discount}
                  onChange={(e) => handleDiscountAmount(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Discount (%)"
                  type="number"
                  value={discountPercent}
                  onChange={(e) => handleDiscountPercent(e.target.value)}
                  fullWidth
                />
              </Grid>

              <Grid item xs={6}>
                <TextField label="Total" value={total} fullWidth disabled />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Transport Cost"
                  type="number"
                  value={transport}
                  onChange={(e) => setTransport(e.target.value)}
                  fullWidth
                />
              </Grid>

              <Grid item xs={6}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  fullWidth
                  disabled={isSaving}
                  onClick={handleQuotationSubmit}
                  sx={{ mt: 1 }}
                >
                  {isSaving ? "SAVING..." : "QUOTATION"}
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button variant="outlined" fullWidth onClick={clearQuotation} sx={{ mt: 1 }}>
                  NEW QUOTATION
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
