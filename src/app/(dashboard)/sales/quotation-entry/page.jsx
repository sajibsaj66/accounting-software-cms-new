"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  TextField,
  Button,
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
import axios from "axios";
import useAuth from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";

export default function QuotationEntry() {
  const authInfo = useAuth();
  const API_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const optionItems = [
    {
      key: "offerValidity",
      label: "Offer Validity: 20 Days from quotation issue date",
    },
    {
      key: "excludeDelivery",
      label: "Price quoted excluding delivery charge",
    },
    {
      key: "validForQuantity",
      label: "Quotation is only valid for the above quantity",
    },
    {
      key: "vatAitRules",
      label: "Including VAT & AIT per government's rules",
    },
    {
      key: "stockAvailable",
      label: "Our stock is available",
    },
  ];
  

  // ---------------- States ----------------

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [rate, setRate] = useState(0);
  const [qty, setQty] = useState("");
  const [cart, setCart] = useState([]);

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

  // ---------------- Calculations ----------------

  useEffect(() => {
    const subtotal = cart.reduce(
      (sum, item) => sum + item.rate * item.qty,
      0
    );
    setSubTotal(subtotal);
  }, [cart]);

  useEffect(() => {
    const toNum = (v) => Number(v) || 0;
    const grand =
      subTotal +
      toNum(currentDue) -
      toNum(discount) +
      toNum(vat) +
      toNum(ait) +
      toNum(transport);
    setTotal(grand);
  }, [subTotal, currentDue, discount, vat, ait, transport]);

  // ---------------- Functions ----------------

  const addToCart = () => {
    if (!selectedProduct || !qty) return;

    const qtyNum = Number(qty);
    const rateNum = Number(rate);
    if (!qtyNum || qtyNum <= 0) return;

    setCart([
      ...cart,
      {
        productId: selectedProduct?.prod_id || selectedProduct?.id,
        prod_id: selectedProduct?.prod_id || selectedProduct?.id,
        name:
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
      },
    ]);

    setSelectedProduct(null);
    setRate(0);
    setQty("");
  };

  const removeItem = (index) => {
    const updated = [...cart];
    updated.splice(index, 1);
    setCart(updated);
  };

  const round2 = (value) => Math.round((Number(value) || 0) * 100) / 100;

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

  const clearQuotation = () => {
    setCart([]);
    setSelectedProduct(null);
    setQty("");
    setRate(0);
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
    setSelectedOptions(
      optionItems.reduce((acc, item) => ({ ...acc, [item.key]: false }), {})
    );
  };

  const toggleOption = (key) => {
    setSelectedOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const selectedOptionLabels = optionItems
    .filter((item) => selectedOptions[item.key])
    .map((item) => item.label);

  const handleQuotationSubmit = async () => {
    if (!cart.length) {
      alert("Please add at least one product to cart.");
      return;
    }

    if (!API_URL || !authInfo?.token) {
      alert("Authentication not valid, please login!");
      return;
    }

    if (!selectedEmployee?.employee_id) {
      alert("Quotation By (employee) select please");
      return;
    }

    if (!selectedCustomer?.customer_id) {
      alert("Customer select please");
      return;
    }

    const sale = {
      sale_emp_id: selectedEmployee.employee_id,
      customer_id: String(selectedCustomer.customer_id),
      customer_name: selectedCustomer.customer_name || "",
      customer_mobile_no: selectedCustomer.customer_mobile_no || "",
      customer_address: selectedCustomer.customer_address || "",
      sale_cus_type: selectedCustomer.customer_type || "regular",
      sale_pay_method: "cash",
      sale_bank_id: null,
      created_isodt: new Date().toISOString(),
      sub_total: Number(subTotal) || 0,
      sale_transport_cost: Number(transport) || 0,
      vat: Number(vat) || 0,
      vat_percent: Number(vatPercent) || 0,
      ait: Number(ait) || 0,
      ait_percent: Number(aitPercent) || 0,
      previous_due: Number(currentDue) || 0,
      discount: Number(discount) || 0,
      discount_percent: Number(discountPercent) || 0,
      total_amount: Number(total) || 0,
      paid: 0,
      due: Number(total) || 0,
      note: "",
      checkbox_values: selectedOptionLabels,
    };

    const cartPayload = cart.map((item) => ({
      prod_id: item.prod_id || item.productId,
      prod_sale_rate: Number(item.prod_sale_rate ?? item.rate) || 0,
      prod_purchase_rate: Number(item.prod_purchase_rate) || 0,
      prod_qty: Number(item.prod_qty ?? item.qty) || 0,
      prod_total:
        Number(item.prod_total) ||
        (Number(item.prod_sale_rate ?? item.rate) || 0) * (Number(item.prod_qty ?? item.qty) || 0),
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
        alert(res?.data?.message?.msg || "Quotation save failed");
        return;
      }

      alert(res?.data?.message?.msg || "Quotation saved successfully");
      clearQuotation();
      getInvoice();
    } catch (error) {
      console.error("Save quotation failed", error);
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
    } catch (error) {
      console.error("Failed to fetch quotation invoice", error);
      setSaleInvoice("");
    }
  };

  useEffect(() => {
    getInvoice();
  }, [API_URL, authInfo?.token]);


  const { data: employesData } = useQuery({
     queryKey: ["employees"],
    queryFn: async () => {
      const res = await axios.post(`${API_URL}/api/get-employees`, { "select-type": "active" }, {
        headers: {
          "auth-token": authInfo?.token, 
        },
      } );
      return res.data;
    },
    enabled: Boolean(API_URL && authInfo?.token),
  })

  const employes = employesData?.message ?? [];

  
  const { data: CustomersData } = useQuery({
     queryKey: ["customers"],
    queryFn: async () => {
      const res = await axios.post(`${API_URL}/api/get-customers`, { "select-type": "active" }, {
        headers: {
          "auth-token": authInfo?.token, 
        },
      } );
      return res?.data;
    },
    enabled: Boolean(API_URL && authInfo?.token),
  })
  const Customers = CustomersData?.message ?? [];
  const getCustomerLabel = (option) =>
    option?.customer_name || option?.display_text || option?.name || "";


  
  const { data: ProductsData } = useQuery({
     queryKey: ["products"],
    queryFn: async () => {
      const res = await axios.post(`${API_URL}/api/get-individual-products`, { "select-type": "active" }, {
        headers: {
          "auth-token": authInfo?.token, 
        },
      } );
      return res?.data;
    },
    enabled: Boolean(API_URL && authInfo?.token),
  })

  const Products = ProductsData?.message ?? [];

   const getProductLabel = (option) =>
    `${option?.prod_code || ""} - ${option?.prod_brand_name || ""} - ${option?.prod_color_name || ""}`.trim();
  

  // ---------------- UI ----------------

  return (
    <Box sx={{ p: 3, background: "#f5f6f8", minHeight: "100vh" }}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">Quotation Entry</Typography>

        <Grid container spacing={3} mt={1}>
          <Grid item xs={12} md={3}>
              <TextField
                label="Invoice No"
                value={saleInvoice}
                fullWidth
                disabled
              />
          </Grid>

          <Grid item xs={8} md={6}>
            <Autocomplete
              options={employes}
              getOptionLabel={(option) => option?.employee_name || ""}
              value={selectedEmployee}
              onChange={(e, value) => setSelectedEmployee(value)}
              isOptionEqualToValue={(option, value) =>
                option?.employee_id === value?.employee_id
              }
              sx={{ minWidth: 200 }}
              renderInput={(params) => (
                <TextField {...params} label="Quotation By" fullWidth />
              )}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              type="date"
              label="Quotation Date"
              InputLabelProps={{ shrink: true }}
              value="2026-03-01"
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
            <Typography variant="subtitle1">
              Customer & Product Information
            </Typography>

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
                  options={Customers}
                  getOptionLabel={getCustomerLabel}
                  value={selectedCustomer}
                  onChange={(e, value) => setSelectedCustomer(value)}
                  isOptionEqualToValue={(option, value) =>
                    option?.customer_id === value?.customer_id
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Choose Customer" />
                  )}
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
                  options={Products}
                  getOptionLabel={getProductLabel}
                  value={selectedProduct}
                  onChange={(e, value) => {
                    setSelectedProduct(value);
                    setRate(value?.prod_rate || value?.prod_sale_rate || value?.rate || 0);
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option?.prod_id === value?.prod_id
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Choose Product" />
                  )}
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

                <TextField
                  label="Total"
                  value={rate * qty}
                  fullWidth
                  sx={{ mt: 1 }}
                  disabled
                />

                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={addToCart}
                  sx={{ mt: 2 }}
                >
                  ADD TO CART
                </Button>
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
                    <TableCell>{item.rate * item.qty}</TableCell>
                    <TableCell>
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
              <Button
                variant="outlined"
                fullWidth
                onClick={clearQuotation}
                sx={{ mt: 1 }}
              >
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
