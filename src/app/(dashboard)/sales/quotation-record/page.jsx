"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import useAuth from "@/hooks/useAuth";
import {
  Box,
  Paper,
  Grid,
  TextField,
  MenuItem,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PrintIcon from "@mui/icons-material/Print";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const SEARCH_TYPES = [
  { searchType: "All" },
  { searchType: "By Customer" },
  { searchType: "By Employee" },
  { searchType: "By Category" },
  { searchType: "By Product" },
  { searchType: "By User" },
];

const RECORD_TYPES = [
  { recordType: "Without Details" },
  { recordType: "With Details" },
];

const toDateInput = (d = new Date()) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const money = (n) =>
  Number(n || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default function QuotationRecord() {
  const authInfo = useAuth();
  const API_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const token = authInfo?.token || authInfo?.accessToken;

  const [selectedSearchType, setSelectedSearchType] = useState("All");
  const [selectedRecordType, setSelectedRecordType] = useState("Without Details");
  const [fromDate, setFromDate] = useState(toDateInput());
  const [toDate, setToDate] = useState(toDateInput());
  const [selectedFilterValue, setSelectedFilterValue] = useState("");

  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);

  const [searchResult, searchResultSet] = useState([]);
  const [searchResultDetails, searchResultDetailsSet] = useState([]);
  const [saleProductDetail, saleProductDetailSet] = useState([]);
  const [saleProdCatDetail, saleProdCatDetailSet] = useState([]);

  const [loading, setLoading] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);
  const [bootLoaded, setBootLoaded] = useState(false);

  const requestConfig = useMemo(
    () => ({
      headers: {
        "auth-token": token || "",
      },
    }),
    [token]
  );

  const filterOptions = useMemo(() => {
    if (selectedSearchType === "By Customer") {
      return customers.map((r) => ({
        value: String(r?.customer_id ?? r?.id ?? ""),
        label: r?.display_text || r?.customer_name || r?.name || "Customer",
      }));
    }
    if (selectedSearchType === "By Product") {
      return products.map((r) => ({
        value: String(r?.prod_id ?? r?.id ?? ""),
        label:
          r?.prod_name ||
          `${r?.prod_code || ""} - ${r?.prod_brand_name || ""}`.trim() ||
          r?.name ||
          "Product",
      }));
    }
    if (selectedSearchType === "By Employee") {
      return employees.map((r) => ({
        value: String(r?.employee_id ?? r?.id ?? ""),
        label: r?.employee_name || r?.name || "Employee",
      }));
    }
    if (selectedSearchType === "By Category") {
      return categories.map((r) => ({
        value: String(r?.prod_cat_id ?? r?.category_id ?? r?.cat_id ?? r?.id ?? ""),
        label: r?.prod_cat_name || r?.category_name || r?.name || "Category",
      }));
    }
    if (selectedSearchType === "By User") {
      return users.map((r) => ({
        value: String(r?.user_id ?? r?.id ?? ""),
        label: r?.user_name || r?.name || r?.email || "User",
      }));
    }
    return [];
  }, [selectedSearchType, customers, products, employees, categories, users]);

  const loadFilterData = useCallback(async () => {
    if (!API_URL || !token || selectedSearchType === "All") return;

    setFilterLoading(true);
    try {
      if (selectedSearchType === "By Customer") {
        const res = await axios.post(
          `${API_URL}/api/get-customers`,
          { "select-type": "active" },
          requestConfig
        );
        setCustomers(res?.data?.message || []);
      } else if (selectedSearchType === "By Product") {
        const res = await axios.post(
          `${API_URL}/api/get-individual-products`,
          { "select-type": "active" },
          requestConfig
        );
        setProducts(res?.data?.message || []);
      } else if (selectedSearchType === "By Employee") {
        const res = await axios.post(
          `${API_URL}/api/get-employees`,
          { "select-type": "active" },
          requestConfig
        );
        setEmployees(res?.data?.message || []);
      } else if (selectedSearchType === "By Category") {
        const res = await axios.post(
          `${API_URL}/api/get-categories`,
          { "select-type": "active" },
          requestConfig
        );
        setCategories(res?.data?.message || []);
      } else if (selectedSearchType === "By User") {
        const res = await axios.post(
          `${API_URL}/api/get-users`,
          { "select-type": "active" },
          requestConfig
        );
        setUsers(res?.data?.message || []);
      }
    } catch (error) {
      console.error("Filter list load failed", error);
    } finally {
      setFilterLoading(false);
    }
  }, [API_URL, token, selectedSearchType, requestConfig]);

  useEffect(() => {
    setSelectedFilterValue("");
    loadFilterData();
  }, [selectedSearchType, loadFilterData]);

  const getSearchResult = useCallback(async () => {
    if (!API_URL || !token) {
      alert("Authentication invalid. Please login again.");
      return;
    }

    const reqPayload = { fromDate, toDate };

    if (selectedSearchType === "By Customer" && selectedFilterValue) {
      reqPayload.customerId = Number(selectedFilterValue);
    }
    if (selectedSearchType === "By Product" && selectedFilterValue) {
      reqPayload.productId = Number(selectedFilterValue);
    }
    if (selectedSearchType === "By Employee" && selectedFilterValue) {
      reqPayload.employeeId = Number(selectedFilterValue);
    }
    if (selectedSearchType === "By Category" && selectedFilterValue) {
      reqPayload.categoryId = Number(selectedFilterValue);
    }
    if (selectedSearchType === "By User" && selectedFilterValue) {
      reqPayload.userId = Number(selectedFilterValue);
    }

    let url =
      selectedRecordType === "Without Details"
        ? `${API_URL}/api/get-quotations`
        : `${API_URL}/api/get-quotation-with-details`;

    if (selectedSearchType === "By Product" || selectedSearchType === "By Category") {
      url = `${API_URL}/api/get-quotation-details`;
    }

    setLoading(true);
    try {
      const res = await axios.post(url, { reqPayload }, requestConfig);
      const message = res?.data?.message || res?.data?.data || [];

      searchResultSet([]);
      searchResultDetailsSet([]);
      saleProductDetailSet([]);
      saleProdCatDetailSet([]);

      if (selectedSearchType === "By Product") {
        saleProductDetailSet(message);
      } else if (selectedSearchType === "By Category") {
        const grouped = (message || []).reduce((acc, item) => {
          const key =
            item?.prod_cat_name || item?.category_name || item?.cat_name || "Unknown Category";
          if (!acc[key]) acc[key] = [];
          acc[key].push(item);
          return acc;
        }, {});

        const records = Object.entries(grouped).map(([category, items]) => ({
          category,
          items,
          subtotal: items.reduce(
            (sum, item) =>
              sum + Number(item?.sale_prod_total ?? item?.subtotal ?? item?.sale_total_amount ?? 0),
            0
          ),
        }));
        saleProdCatDetailSet(records);
      } else if (selectedRecordType === "With Details") {
        searchResultDetailsSet(message);
      } else {
        searchResultSet(message);
      }
    } catch (error) {
      console.error("Search failed", error);
      alert(error?.response?.data?.message || "Failed to load report data.");
    } finally {
      setLoading(false);
    }
  }, [
    API_URL,
    token,
    fromDate,
    toDate,
    selectedSearchType,
    selectedRecordType,
    selectedFilterValue,
    requestConfig,
  ]);

  useEffect(() => {
    if (!API_URL || !token || bootLoaded) return;
    setBootLoaded(true);
    getSearchResult();
  }, [API_URL, token, bootLoaded, getSearchResult]);

  const handleDelete = async (row) => {
    const saleId = row?.sale_id || row?.id || row?.saleId || row?.quotation_id || null;
    if (!saleId) {
      alert("Quotation id not found.");
      return;
    }

    const confirmed = window.confirm("Are you sure you want to delete this quotation?");
    if (!confirmed) return;

    try {
      await axios.post(
        `${API_URL}/api/quotation-delete`,
        { saleId: Number(saleId) },
        requestConfig
      );
      await getSearchResult();
    } catch (error) {
      console.error("Delete failed", error);
      alert(error?.response?.data?.message || "Delete failed");
    }
  };

  const tableRows = useMemo(() => {
    if (selectedSearchType === "By Product") return saleProductDetail;
    if (selectedSearchType === "By Category") return saleProdCatDetail;
    if (selectedRecordType === "With Details") return searchResultDetails;
    return searchResult;
  }, [
    selectedSearchType,
    selectedRecordType,
    saleProductDetail,
    saleProdCatDetail,
    searchResultDetails,
    searchResult,
  ]);

  const totals = useMemo(() => {
    if (selectedSearchType === "By Category") {
      return tableRows.reduce(
        (acc, row) => {
          acc.subtotal += Number(row?.subtotal || 0);
          acc.total += Number(row?.subtotal || 0);
          return acc;
        },
        { subtotal: 0, discount: 0, vat: 0, transport: 0, total: 0 }
      );
    }

    return tableRows.reduce(
      (acc, row) => {
        acc.subtotal += Number(row?.sale_subtotal_amount ?? row?.subtotal ?? row?.sale_prod_total ?? 0);
        acc.discount += Number(row?.sale_discount_amount ?? row?.discount ?? 0);
        acc.vat += Number(row?.sale_vat_amount ?? row?.vat ?? 0);
        acc.transport += Number(row?.sale_transport_cost ?? row?.transport ?? 0);
        acc.total += Number(row?.sale_total_amount ?? row?.total ?? row?.sale_prod_total ?? 0);
        return acc;
      },
      { subtotal: 0, discount: 0, vat: 0, transport: 0, total: 0 }
    );
  }, [selectedSearchType, tableRows]);

  const showFilterDropdown = selectedSearchType !== "All";

  return (
    <Box sx={{ p: 2, background: "#f5f6f8", minHeight: "100vh" }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
          Quotation Record
        </Typography>

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="Search Type"
              select
              value={selectedSearchType}
              onChange={(e) => setSelectedSearchType(e.target.value)}
            >
              {SEARCH_TYPES.map((type) => (
                <MenuItem key={type.searchType} value={type.searchType}>
                  {type.searchType}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {showFilterDropdown && (
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label={selectedSearchType}
                select
                value={selectedFilterValue}
                onChange={(e) => setSelectedFilterValue(e.target.value)}
                disabled={filterLoading}
              >
                {filterOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          )}

          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="Record Type"
              select
              value={selectedRecordType}
              onChange={(e) => setSelectedRecordType(e.target.value)}
            >
              {RECORD_TYPES.map((type) => (
                <MenuItem key={type.recordType} value={type.recordType}>
                  {type.recordType}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="From Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="To Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={1}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={getSearchResult}
              disabled={loading}
              sx={{
                py: 1.8,
                background: "#9ee4ef",
                color: "#325d2a",
                "&:hover": { background: "#88d9e7" },
              }}
            >
              {loading ? "..." : "GO"}
            </Button>
          </Grid>
        </Grid>

        <Box sx={{ mt: 1, borderTop: "1px solid #d7d7d7", borderBottom: "1px solid #d7d7d7", py: 0.5 }}>
          <IconButton size="small">
            <PrintIcon />
          </IconButton>
        </Box>

        <Table size="small" sx={{ mt: 1 }}>
          <TableHead>
            <TableRow>
              <TableCell>SL</TableCell>
              <TableCell>INVOICE NO</TableCell>
              <TableCell>DATE & TIME</TableCell>
              <TableCell>CUSTOMER / GROUP</TableCell>
              <TableCell align="right">SUB TOTAL</TableCell>
              <TableCell align="right">DISCOUNT</TableCell>
              <TableCell align="right">VAT</TableCell>
              <TableCell align="right">TRANSPORT</TableCell>
              <TableCell align="right">TOTAL</TableCell>
              <TableCell align="center">ACTIONS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!tableRows.length && (
              <TableRow>
                <TableCell align="center" colSpan={10}>
                  No data found.
                </TableCell>
              </TableRow>
            )}

            {tableRows.map((row, idx) => {
              const subtotal =
                selectedSearchType === "By Category"
                  ? Number(row?.subtotal || 0)
                  : Number(row?.sale_subtotal_amount ?? row?.subtotal ?? row?.sale_prod_total ?? 0);
              const discount = Number(row?.sale_discount_amount ?? row?.discount ?? 0);
              const vat = Number(row?.sale_vat_amount ?? row?.vat ?? 0);
              const transport = Number(row?.sale_transport_cost ?? row?.transport ?? 0);
              const total =
                selectedSearchType === "By Category"
                  ? Number(row?.subtotal || 0)
                  : Number(row?.sale_total_amount ?? row?.total ?? row?.sale_prod_total ?? 0);

              return (
                <TableRow key={`${idx}-${row?.sale_id ?? row?.id ?? row?.category ?? "row"}`}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>{row?.sale_invoice || row?.invoice || "-"}</TableCell>
                  <TableCell>{row?.sale_created_isodt || row?.datetime || row?.date_time || "-"}</TableCell>
                  <TableCell>{row?.customer_name || row?.sale_customer_name || row?.customer || row?.category || "-"}</TableCell>
                  <TableCell align="right">{money(subtotal)}</TableCell>
                  <TableCell align="right">{money(discount)}</TableCell>
                  <TableCell align="right">{money(vat)}</TableCell>
                  <TableCell align="right">{money(transport)}</TableCell>
                  <TableCell align="right">{money(total)}</TableCell>
                  <TableCell align="center">
                    <IconButton size="small" disabled={selectedSearchType === "By Category"}>
                      <ReceiptLongIcon />
                    </IconButton>
                    <IconButton size="small" sx={{ color: "#5a8f1a" }} disabled={selectedSearchType === "By Category"}>
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      sx={{ color: "#e22f1f" }}
                      disabled={selectedSearchType === "By Category"}
                      onClick={() => handleDelete(row)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}

            {!!tableRows.length && (
              <TableRow>
                <TableCell colSpan={4} />
                <TableCell align="right" sx={{ fontWeight: 700 }}>{money(totals.subtotal)}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>{money(totals.discount)}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>{money(totals.vat)}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>{money(totals.transport)}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>{money(totals.total)}</TableCell>
                <TableCell />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
