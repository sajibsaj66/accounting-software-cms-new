import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

import axios from 'axios';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import DateFnsUtils from '@date-io/date-fns';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import swal from 'sweetalert';

import commaNumber from 'comma-number';
let format = commaNumber.bindWith(',', '.')

const QuotationEntryStandalone = ({ apiBaseUrl, authToken, quotationId = null, onNavigate = null, onSaved = null }) => {
    const classes = useStyles();
    const [selectedDate, handleDateChangeSet] = useState(new Date());
    // States 
    // State
    const [cart, cartSet] = useState([]);
    const [employees, employeesSet] = useState([]);
    const [customers, customersSet] = useState([]);
    const [products, productsSet] = useState([]);
    const [units, unitsSet] = useState([]);
    const [productUnitById, productUnitByIdSet] = useState({});
    const [checkboxOptions, checkboxOptionsSet] = useState([]);
    const [selectedCheckboxes, selectedCheckboxesSet] = useState([]);

    const [selectedEmployee, selectedEmployeeSet] = useState(null);
    const [selectedCustomer, selectedCustomerSet] = useState(null);
    const [selectedProduct, selectedProductSet] = useState(null);

    const [saveAction, saveActionSet] = useState(false);
    const [sale_invoice, sale_invoice_set] = useState('');
    const [customer_name, customer_name_set] = useState('');
    const [customer_mobile_no, customer_mobile_no_set] = useState('');
    const [customer_address, customer_address_set] = useState('');
    const [customer_email, customer_email_set] = useState('');
    const [product_rate, product_rate_set] = useState(0);
    const [product_qty, product_qty_set] = useState('');
    const [product_total, product_total_set] = useState(0);
    const [product_stock_qty, product_stock_qty_set] = useState('stock qty');
    const [general_customer, general_customer_set] = useState(false);

    // Amount States
    const [sub_total, sub_total_set] = useState(0);
    const [vat, vat_set] = useState(0);
    const [vat_percent, vat_percent_set] = useState(0);
    const [ait, ait_set] = useState(0);
    const [ait_percent, ait_percent_set] = useState(0);
    const [discount, discount_set] = useState(0);
    const [discount_percent, discount_percent_set] = useState(0);
    const [total_amount, total_amount_set] = useState(0);
    const [transport_cost, transport_cost_set] = useState(0);

    // Calculation Modes
    const [vatMode, vatModeSet] = useState("percent");
    const [aitMode, aitModeSet] = useState("percent");
    const [discountMode, discountModeSet] = useState("percent");

    const [saleAction, saleActionSet] = useState('create');
    const [saleId, saleIdSet] = useState(0);

    // Refs
    const employeeRef = useRef(null);
    const dateRef = useRef(null);
    const customerRef = useRef(null);
    const productRef = useRef(null);
    const rateRef = useRef(null);
    const qtyRef = useRef(null);
    const addToCartRef = useRef(null);

    const vatRef = useRef(null);
    const vatPercentRef = useRef(null);
    const aitRef = useRef(null);
    const aitPercentRef = useRef(null);
    const discountRef = useRef(null);
    const discountPercentRef = useRef(null);
    const transportRef = useRef(null);
    const saleRef = useRef(null);

    // Helpers
    const num = (v) => {
        let n = parseFloat(v);
        return isNaN(n) ? 0 : n;
    };

    const round2 = (x) => {
        return Math.round(x * 100) / 100;
    };

    const stopEnter = (e) => {
        if (e.key === "Enter") e.preventDefault();
    };

    useEffect(() => {
                getInvoice()
        getEmployees()
        getCustomers()
        getProducts()
        getUnits()
        getCheckboxOptions()

        if (quotationId != null) {
            saleActionSet('update');
            saleIdSet(parseFloat(quotationId));
            getSales(quotationId);
        }
    }, [])

    const getCheckboxOptions = async () => {
        try {
            const response = await axios.post(`${apiBaseUrl}/api/get-checkbox-values`, {}, {
                headers: { 'auth-token': authToken }
            });
            checkboxOptionsSet(response.data.message);
        } catch (error) {
            console.error("Error fetching checkbox options:", error);
        }
    }

    const getUnits = async () => {
        await axios.post(`${apiBaseUrl}/api/get-units`, { 'select-type': 'active' }, { headers: { 'auth-token': authToken } }).then(res => {
            unitsSet(res.data.message || [])
        }).catch(() => {
            unitsSet([])
        })
    }

    const resolveUnitName = (product) => {
        const toText = (value) => String(value ?? '').trim();
        const isNumeric = (value) => /^\d+$/.test(value);

        const pid = product?.prod_id ?? product?.product_id ?? product?.id;
        const productFromList = products.find((p) => {
            const listPid = p?.prod_id ?? p?.product_id ?? p?.id;
            return String(listPid) === String(pid);
        });

        const mapUnit = toText(productUnitById[String(pid)]);

        const rawUnit =
            product?.prod_unit_name ??
            product?.prod_unit ??
            product?.prod_unit_id ??
            product?.unit_name ??
            product?.unit ??
            product?.unit_id ??
            product?.product_unit ??
            product?.product_unit_name ??
            product?.material_unit_name ??
            product?.material_unit_id ??
            product?.prod_set_no ??
            '';

        const fallbackUnit =
            productFromList?.prod_unit_name ??
            productFromList?.prod_unit ??
            productFromList?.prod_unit_id ??
            productFromList?.unit_name ??
            productFromList?.unit ??
            productFromList?.unit_id ??
            productFromList?.product_unit ??
            productFromList?.product_unit_name ??
            productFromList?.material_unit_name ??
            productFromList?.material_unit_id ??
            productFromList?.prod_set_no ??
            '';
        const rawText = toText(rawUnit) || toText(fallbackUnit) || mapUnit;

        if (!rawText) return '';
        if (!isNumeric(rawText)) return rawText;

        const matched = units.find((u) => {
            const uid = u?.prod_unit_id ?? u?.unit_id ?? u?.id;
            return String(uid) === rawText;
        });
        const matchedName = matched?.prod_unit_name ?? matched?.unit_name ?? matched?.name ?? '';
        return toText(matchedName) || toText(productFromList?.prod_unit_name) || mapUnit || rawText;
    }

    const extractUnitLabel = (row) => {
        if (!row) return '';
        const direct =
            row.prod_unit_name ??
            row.unit_name ??
            row.product_unit_name ??
            row.material_unit_name ??
            row.prod_unit ??
            row.unit;

        const nested =
            row.prod_unit?.prod_unit_name ??
            row.unit?.prod_unit_name ??
            row.unit?.unit_name;

        const text = String(direct ?? nested ?? '').trim();
        return /^\d+$/.test(text) ? '' : text;
    }

    const getProductDetails = async (product) => {
        if (!product) return null;
        const productId = product?.prod_id ?? product?.product_id ?? product?.id;
        if (!productId) return product;

        try {
            const res = await axios.post(
                `${apiBaseUrl}/api/get-individual-products`,
                { productId },
                { headers: { 'auth-token': authToken } }
            );

            const detailedProduct = res?.data?.message?.[0];
            if (!detailedProduct) return product;
            return { ...product, ...detailedProduct };
        } catch {
            return product;
        }
    }

    useEffect(() => {
        if (products.length === 0) return;

        let changedProducts = false;
        const mappedProducts = products.map((item) => {
            const unitName = resolveUnitName(item);
            if (unitName !== (item.prod_unit_name || '')) {
                changedProducts = true;
                return { ...item, prod_unit_name: unitName };
            }
            return item;
        });

        if (changedProducts) productsSet(mappedProducts);
    }, [units, products]);

    useEffect(() => {
        if (units.length === 0 || cart.length === 0) return;

        let changed = false;
        const mappedCart = cart.map((item) => {
            const unitName = resolveUnitName(item);
            if (unitName !== item.prod_unit_name) {
                changed = true;
                return { ...item, prod_unit_name: unitName };
            }
            return item;
        });

        if (changed) cartSet(mappedCart);
    }, [units, products, cart]);

    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;
        if (checked) {
            selectedCheckboxesSet([...selectedCheckboxes, value]);
        } else {
            selectedCheckboxesSet(selectedCheckboxes.filter(item => item !== value));
        }
    }

    let getSales = async (id) => {
        await axios.post(`${apiBaseUrl}/api/get-quotation-with-details`, { reqPayload: { saleId: parseFloat(id) } }, { headers: { 'auth-token': authToken } }).then(async (res) => {
            let sale = res.data.message[0];
            let cart = res.data.message[0].details;

            sale_invoice_set(sale.sale_invoice);
            selectedEmployeeSet({ employee_id: sale.sale_emp_id, employee_name: sale.employee_name });
            handleDateChangeSet(sale.sale_created_isodt);
            selectedCustomerSet({ customer_name: sale.customer_name, customer_id: sale.customer_id })
            customer_name_set(sale.customer_name)
            customer_mobile_no_set(sale.customer_mobile_no)
            customer_address_set(sale.customer_address)
            customer_email_set(sale.customer_email)

            discount_set(sale.sale_discount_amount);
            discount_percent_set(sale.sale_discount_percent);
            vat_set(sale.sale_vat_amount);
            vat_percent_set(sale.sale_vat_percent);
            ait_set(sale.sale_ait_amount);
            ait_percent_set(sale.sale_ait_percent);
            transport_cost_set(sale.sale_transport_cost);
            total_amount_set(sale.sale_total_amount);

            let newCart = cart.map((ele) => {
                let product = {
                    prod_id: ele.sale_prod_id,
                    prod_name: ele.prod_name,
                    prod_cat_name: ele.prod_cat_name,
                    prod_brand_name: ele.prod_brand_name,
                    prod_unit_name: resolveUnitName(ele),
                    prod_sale_rate: ele.sale_rate,
                    prod_qty: ele.sale_qty,
                    prod_purchase_rate: ele.sale_prod_purchase_rate,
                    prod_total: ele.sale_prod_total
                }
                return product;
            })
            cartSet(newCart);
        });
    }

    // --- Calculators ---

    useEffect(() => {
        let subTotal = cart.reduce((prev, curr) => {
            return prev + num(curr.prod_total);
        }, 0);
        sub_total_set(round2(subTotal));
    }, [cart]);

    // Calculate Discount
    useEffect(() => {
        if (discountMode === "percent") {
            const discountAmount = (num(sub_total) * num(discount_percent)) / 100;
            discount_set(round2(discountAmount));
        } else {
            const discountPercent = sub_total > 0 ? (num(discount) * 100) / num(sub_total) : 0;
            discount_percent_set(round2(discountPercent));
        }
    }, [sub_total, discount_percent, discount, discountMode]);

    // Calculate VAT (on Discounted Amount)
    useEffect(() => {
        const afterDiscount = num(sub_total) - num(discount);
        if (vatMode === "percent") {
            vat_set(round2((afterDiscount * num(vat_percent)) / 100));
        } else {
            vat_percent_set(afterDiscount > 0 ? round2((num(vat) * 100) / afterDiscount) : 0);
        }
    }, [sub_total, discount, vat_percent, vat, vatMode]);

    // Calculate AIT (on Discounted Amount)
    useEffect(() => {
        const afterDiscount = num(sub_total) - num(discount);
        if (aitMode === "percent") {
            ait_set(round2((afterDiscount * num(ait_percent)) / 100));
        } else {
            ait_percent_set(afterDiscount > 0 ? round2((num(ait) * 100) / afterDiscount) : 0);
        }
    }, [sub_total, discount, ait_percent, ait, aitMode]);

    // Calculate Total
    useEffect(() => {
        const afterDiscount = num(sub_total) - num(discount);
        const total = afterDiscount + num(vat) + num(ait) + num(transport_cost);
        total_amount_set(round2(total));
    }, [sub_total, discount, vat, ait, transport_cost]);


    // Handlers
    const handleDiscountInput = (e) => {
        const { name, value } = e.target;
        if (name === "discount_percent") {
            discount_percent_set(value);
            discountModeSet("percent");
        } else {
            discount_set(value);
            discountModeSet("amount");
        }
    };

    const handleVatInput = (e) => {
        const { name, value } = e.target;
        if (name === "vat_percent") {
            vat_percent_set(value);
            vatModeSet("percent");
        } else {
            vat_set(value);
            vatModeSet("amount");
        }
    };

    const handleAitInput = (e) => {
        const { name, value } = e.target;
        if (name === "ait_percent") {
            ait_percent_set(value);
            aitModeSet("percent");
        } else {
            ait_set(value);
            aitModeSet("amount");
        }
    };

    useEffect(() => {
        product_total_set(product_rate * product_qty);
    }, [product_rate, product_qty])

    useEffect(() => {
        if (selectedProduct != null) {
            axios.post(`${apiBaseUrl}/api/get-product-current-stock`, { product_id: selectedProduct.prod_id }, { headers: { 'auth-token': authToken } }).then(res => {
                product_stock_qty_set(res.data.message)
            })
        } else {
            product_stock_qty_set('Stock Qty')
        }
    }, [selectedProduct])

    let getInvoice = async () => {
        await axios.get(`${apiBaseUrl}/api/get-quotation-invoice`, { headers: { 'auth-token': authToken } }).then(res => {
            sale_invoice_set(res.data.message);
        })
    }

    let getEmployees = async () => {
        await axios.post(`${apiBaseUrl}/api/get-employees`, { 'select-type': 'active' }, { headers: { 'auth-token': authToken } }).then(res => {
            employeesSet(res.data.message)
        })
    }

    let getCustomers = async () => {
        await axios.post(`${apiBaseUrl}/api/get-customers`, { 'select-type': 'active' }, { headers: { 'auth-token': authToken } }).then(res => {
            res.data.message.unshift({ customer_id: 0, customer_name: 'General customer', customer_mobile_no: '', customer_address: '' })
            customersSet(res.data.message)
        });
    }

    let getProducts = async () => {
        try {
            const [individualRes, allRes] = await Promise.all([
                axios.post(`${apiBaseUrl}/api/get-individual-products`, { 'select-type': 'active' }, { headers: { 'auth-token': authToken } }),
                axios.post(`${apiBaseUrl}/api/get-products`, null, { headers: { 'auth-token': authToken } })
            ]);

            const individualProducts = individualRes?.data?.message || [];
            const allProducts = allRes?.data?.message || [];

            const unitMap = {};
            [...allProducts, ...individualProducts].forEach((p) => {
                const pid = p?.prod_id ?? p?.product_id ?? p?.id;
                const unitLabel = extractUnitLabel(p);
                if (pid && unitLabel) unitMap[String(pid)] = unitLabel;
            });

            productUnitByIdSet(unitMap);

            const normalizedProducts = individualProducts.map((p) => {
                const pid = p?.prod_id ?? p?.product_id ?? p?.id;
                const mappedUnit = unitMap[String(pid)] || '';
                return {
                    ...p,
                    prod_unit_name: p?.prod_unit_name || mappedUnit
                };
            });

            productsSet(normalizedProducts);
        } catch {
            productsSet([]);
            productUnitByIdSet({});
        }
    }

    let productToCart = async () => {
        if (selectedProduct == null) {
            swal({ title: 'Select Product', icon: 'warning' }); return false;
        }
        if (parseFloat(product_rate) <= 0 || product_rate == '') {
            swal({ title: 'Sale Rate is Invalid.', icon: 'warning' }); return false;
        }
        if (parseFloat(product_qty) <= 0 || product_qty == '') {
            swal({ title: 'Quantity is Invalid ', icon: 'warning' }); return false;
        }

        const detailedProduct = await getProductDetails(selectedProduct);
        const unitName =
            resolveUnitName(detailedProduct) ||
            detailedProduct?.prod_unit_name ||
            detailedProduct?.unit_name ||
            productUnitById[String(detailedProduct?.prod_id)] ||
            detailedProduct?.prod_set_no ||
            '-';

        cartSet([...cart, {
            prod_id: detailedProduct.prod_id,
            prod_name: detailedProduct.prod_name,
            prod_cat_name: detailedProduct.prod_cat_name,
            prod_brand_name: detailedProduct.prod_brand_name,
            prod_unit_name: unitName,
            prod_sale_rate: product_rate,
            prod_qty: product_qty,
            prod_purchase_rate: detailedProduct.prod_purchase_rate,
            prod_total: product_total
        }]);
        product_rate_set(0);
        product_qty_set('');
        product_total_set(0);
        selectedProductSet(null);
        productRef.current.focus();
    }

    let cartFromRemove = (index) => {
        let hardCopy = [...cart];
        hardCopy.splice(index, 1);
        cartSet(hardCopy)
    }

    const resetForm = () => {
        cartSet([]);
        selectedCustomerSet(null);
        customer_name_set("");
        customer_mobile_no_set("");
        customer_address_set("");
        customer_email_set("");
        selectedEmployeeSet(null);
        discount_set(0);
        discount_percent_set(0);
        vat_set(0);
        vat_percent_set(0);
        ait_set(0);
        ait_percent_set(0);
        transport_cost_set(0);
        selectedCheckboxesSet([]);
        handleDateChangeSet(new Date());
        saleActionSet("save");
        saleIdSet(null);

        if (typeof onNavigate === 'function') onNavigate('/sales/quotation-entry');

        getInvoice();
    };

    let saleSaveAction = async () => {
        if (selectedCustomer == null) {
            swal({ title: 'Customer is required.', icon: 'warning' }); return false;
        }
        if (cart.length == 0) {
            swal({ title: 'Cart is Empty.', icon: 'warning' }); return false;
        }

        let sale = {
            sale_invoice,
            sale_emp_id: selectedEmployee != null ? selectedEmployee.employee_id : 0,
            created_isodt: selectedDate,
            customer_id: selectedCustomer.customer_id,
            customer_name: customer_name,
            customer_mobile_no: customer_mobile_no,
            customer_address: customer_address,
            customer_email: customer_email,
            sale_transport_cost: transport_cost,
            sale_cus_type: selectedCustomer.customer_type,
            sub_total,
            vat,
            vat_percent,
            discount,
            discount_percent,
            total_amount,
            sale_id: saleId,
            checkbox_values: selectedCheckboxes
        }

        let url = `/api/save-quotation`
        if (saleAction == 'update') {
            url = `/api/update-quotation`
        }
        console.log("I am selected chekcbox:", sale);
        saveActionSet(true)
        await axios.post(`${apiBaseUrl}${url}`, { cart, sale }, { headers: { 'auth-token': authToken } }).then(res => {
            if (!res.data.error) {
                swal({ title: `${res.data.message.msg} successfully. Do you want to view invoice?`, icon: 'success', buttons: true }).then(confirm => {
                    if (typeof onSaved === 'function') {
                        onSaved(res.data.message);
                    }
                    if (confirm) {
                        if (typeof onNavigate === 'function') { onNavigate(`/sales/quotation-invoice/${res.data.message.quotationId}`); }
                        saveActionSet(false)
                    } else {
                        resetForm()
                    }
                })
            }
        })
    }

    return (
        <div className={classes.root}>
            <Paper className={classes.paper} style={{ marginTop: '-25px', marginBottom: '5px' }}>
                <h4 style={{ textAlign: 'left', margin: 0, padding: 0, marginTop: '-10px', marginBottom: '2px' }}>Quotation Entry</h4>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={3}>
                        <TextField label="invoice no" variant="outlined" value={sale_invoice} disabled className={classes.fullWidth} onChange={(e) => sale_invoice_set(e.target.value)} name="sale_invoice" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Autocomplete
                            size="small"
                            onKeyDown={(e) => {
                                if (e.key == 'Enter') {
                                    dateRef.current.focus()
                                }
                            }}
                            value={selectedEmployee}
                            openOnFocus={true}
                            autoHighlight={true}
                            style={{ width: '100%', height: '20px' }}
                            loading={true}
                            options={employees}
                            onChange={(e, employee) => {
                                selectedEmployeeSet(employee)
                            }}
                            getOptionLabel={(option) => option.employee_name}
                            renderInput={(params) => <TextField
                                {...params}
                                label="Quotation By"
                                variant="outlined"
                            />}
                        />
                    </Grid>

                    <Grid item xs={12} sm={3}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                style={{ width: '100%', marginTop: '' }}
                                value={selectedDate}
                                inputRef={dateRef}
                                onKeyDown={(e) => {
                                    if (e.key == 'Enter') {
                                        customerRef.current.focus()
                                    }
                                }}
                                onChange={handleDateChangeSet}
                                name="sale_date"
                                label="Quotation Date"
                                format="yyyy/MM/dd"
                            />
                        </MuiPickersUtilsProvider>
                    </Grid>
                </Grid>
            </Paper>

            <Grid container spacing={3}>
                <Grid item xs={12} sm={8}>
                    <Paper className={classes.paper}>
                        <h4 style={{ textAlign: 'left', margin: 0, padding: 0, marginTop: '-10px', marginBottom: '3px' }}>Customer & product information</h4>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} className={classes.plusLinkDiv}>
                                <Autocomplete
                                    autoHighlight={true}
                                    size="small"
                                    openOnFocus={true}
                                    style={{ width: '100%' }}
                                    options={customers}
                                    value={selectedCustomer}
                                    loading={true}
                                    onChange={async (e, customer) => {
                                        selectedCustomerSet(customer)
                                        if (customer == null) {
                                            customer_name_set('')
                                            customer_mobile_no_set('')
                                            customer_address_set('')
                                            customer_email_set('')
                                            general_customer_set(false)
                                            return false;
                                        }
                                        if (customer.customer_id == 0) {
                                            general_customer_set(true)
                                        } else {
                                            general_customer_set(false)
                                        }
                                        customer_name_set(customer.customer_name)
                                        customer_mobile_no_set(customer.customer_mobile_no)
                                        customer_address_set(customer.customer_address)
                                        customer_email_set(customer.customer_email)
                                    }}
                                    getOptionLabel={(option) => option.customer_name}
                                    renderInput={(params) => <TextField
                                        inputRef={customerRef}
                                        onKeyDown={(e) => {
                                            if (e.key == 'Enter') {
                                                productRef.current.focus()
                                            }
                                        }}
                                        {...params}
                                        label="Choose a customer / Company "
                                        variant="outlined"
                                    />}
                                />

                                <TextField autoComplete="off" style={{ display: general_customer == true ? '' : 'none' }} label="customer name" variant="outlined" className={classes.inputField} value={customer_name} onChange={(e) => customer_name_set(e.target.value)} name="customer_name" />
                                <TextField autoComplete="off" disabled={general_customer == true ? false : true} label="customer mobile" variant="outlined" className={classes.inputField} value={customer_mobile_no} onChange={(e) => customer_mobile_no_set(e.target.value)} name="customer_mobile_no" />
                                <TextField autoComplete="off" disabled={general_customer == true ? false : true} label="customer address" variant="outlined" className={classes.inputField} value={customer_address} onChange={(e) => customer_address_set(e.target.value)} name="customer_address" />
                                <TextField autoComplete="off" disabled={general_customer == true ? false : true} label="customer email" variant="outlined" className={classes.inputField} value={customer_email} onChange={(e) => customer_email_set(e.target.value)} name="customer_email" />
                            </Grid>
                            <Grid item xs={12} sm={6} className={classes.plusLinkDiv}>
                                <Autocomplete
                                    openOnFocus={true}
                                    autoHighlight={true}
                                    style={{ width: '100%', height: '20px' }}
                                    options={products}
                                    value={selectedProduct}
                                    loading={true}
                                    size="small"
                                    getOptionLabel={(option) => `${option?.prod_code || ""} ${option?.prod_name || ""}`.trim()}
                                    onChange={async (e, product) => {
                                        qtyRef.current.focus();
                                        if (product == null) {
                                            product_rate_set(0);
                                            product_qty_set(0);
                                            selectedProductSet(null)
                                            return false
                                        }

                                        const detailedProduct = await getProductDetails(product);
                                        const normalizedProduct = {
                                            ...detailedProduct,
                                            prod_unit_name: resolveUnitName(detailedProduct)
                                        };

                                        product_rate_set(normalizedProduct.prod_sale_rate ?? product.prod_sale_rate ?? 0);
                                        selectedProductSet(normalizedProduct)
                                    }}
                                    renderInput={(params) => <TextField
                                        inputRef={productRef}
                                        onKeyDown={(e) => {
                                            if (e.key == 'Enter') {
                                                rateRef.current.focus();
                                            }
                                        }}
                                        {...params}
                                        label="choose a product"
                                        variant="outlined"
                                    />}
                                />
                                <br />

                                <Grid container>
                                    <Grid item xs={12} sm={6}>
                                        <TextField type="number" style={{ marginRight: '5px' }} label="sale rate" variant="outlined" className={classes.inputField}
                                            value={product_rate} onChange={(e) => { product_rate_set(e.target.value) }}
                                            inputRef={rateRef}
                                            onKeyDown={(e) => {
                                                if (e.key == 'Enter') {
                                                    qtyRef.current.focus();
                                                }
                                            }} />
                                    </Grid>
                                    <Grid item sm={1}></Grid>
                                    <Grid item xs={12} sm={5}>
                                        <TextField type="number" label="quantity" variant="outlined" className={classes.inputField}
                                            value={product_qty} onChange={(e) => { product_qty_set(e.target.value) }}
                                            inputRef={qtyRef}
                                            onKeyDown={(e) => {
                                                if (e.key == 'Enter') {
                                                    addToCartRef.current.click();
                                                }
                                            }} />
                                    </Grid>
                                </Grid>

                                <Grid container>
                                    <Grid item xs={12} sm={6}>
                                        <TextField label="total" variant="outlined" value={product_total} onChange={(e) => { product_total_set(e.target.value) }} disabled={true} className={classes.inputField} />
                                    </Grid>
                                    <Button style={{ marginTop: '5px', marginLeft: 'auto', fontSize: '10px' }}
                                        buttonRef={addToCartRef}
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        onClick={() => productToCart()}
                                        className={classes.button}
                                        startIcon={<SaveIcon />}
                                    >
                                        Add To Cart
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Paper>

                    <Grid container>
                        <Grid item xs={12}>
                            <Paper className={classes.paper} style={{ marginTop: '5px' }}>
                                <h4 style={{ textAlign: 'left', margin: 0, padding: 0, marginTop: '-10px', marginBottom: '3px' }}>Quotation Cart</h4>
                                <TableContainer>
                                    <Table className={classes.table} size="small" aria-label="a dense table">
                                        <TableHead>
                                            <TableRow style={{ backgroundColor: "#f5f5f5" }}>
                                                <TableCell align="center" style={{ fontWeight: "bold", width: "50px" }}>SL</TableCell>
                                                <TableCell align="left" style={{ fontWeight: "bold" }}>Product</TableCell>
                                                <TableCell align="left" style={{ fontWeight: "bold" }}>Brand</TableCell>
                                                <TableCell align="center" style={{ fontWeight: "bold" }}>Unit</TableCell>
                                                <TableCell align="center" style={{ fontWeight: "bold", whiteSpace: "nowrap" }}>Rate</TableCell>
                                                <TableCell align="center" style={{ fontWeight: "bold" }}>Qty</TableCell>
                                                <TableCell align="right" style={{ fontWeight: "bold" }}>Subtotal</TableCell>
                                                <TableCell align="center" style={{ fontWeight: "bold" }}>Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {cart.map((product, sl) => {
                                                const lineSubtotal = parseFloat(product.prod_total);

                                                return (
                                                    <TableRow key={parseFloat(sl) + 1}>
                                                        <TableCell align="center">{parseFloat(sl) + 1}</TableCell>
                                                        <TableCell align="left">{product.prod_name}</TableCell>
                                                        <TableCell align="left">{product.prod_brand_name}</TableCell>
                                                        <TableCell align="center">{resolveUnitName(product) || "-"}</TableCell>
                                                        <TableCell align="center">{product.prod_sale_rate}</TableCell>
                                                        <TableCell align="center">{product.prod_qty}</TableCell>
                                                        <TableCell align="right">{format(lineSubtotal.toFixed(2))}</TableCell>
                                                        <TableCell align="center">
                                                            <RemoveCircleIcon style={{ cursor: 'pointer', color: '#FF0202', marginLeft: '2px' }} onClick={() => { cartFromRemove(sl) }}></RemoveCircleIcon>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })}

                                            {cart.length != 0 ?
                                                <TableRow style={{ backgroundColor: "#fafafa" }}>
                                                    <TableCell colSpan={6} align="right" style={{ fontWeight: 'bold', fontSize: "14px" }}>Total Amount :</TableCell>
                                                    <TableCell align="right" style={{ fontWeight: 'bold', fontSize: "14px" }}>{format(parseFloat(total_amount).toFixed(2))}</TableCell>
                                                    <TableCell />
                                                </TableRow>
                                                : <TableRow><TableCell colSpan={8} align="center">Cart is empty.</TableCell></TableRow>}
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                                {cart.length !== 0 && (
                                    <TableContainer style={{ marginTop: "10px" }}>
                                        <Table className={classes.table} size="small">
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell align="right" style={{ fontWeight: "bold", border: "none", paddingRight: "20px" }}>
                                                        Subtotal:
                                                    </TableCell>
                                                    <TableCell align="right" style={{ border: "none", paddingRight: "20px", minWidth: "120px" }}>
                                                        {format(parseFloat(sub_total || 0).toFixed(2))}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell align="right" style={{ fontWeight: "bold", border: "none", paddingRight: "20px" }}>
                                                        Discount ({discount_percent}%):
                                                    </TableCell>
                                                    <TableCell align="right" style={{ border: "none", paddingRight: "20px" }}>
                                                        -{format(parseFloat(discount || 0).toFixed(2))}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell align="right" style={{ fontWeight: "bold", border: "none", paddingRight: "20px" }}>
                                                        VAT ({vat_percent}%):
                                                    </TableCell>
                                                    <TableCell align="right" style={{ border: "none", paddingRight: "20px" }}>
                                                        +{format(parseFloat(vat || 0).toFixed(2))}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell align="right" style={{ fontWeight: "bold", border: "none", paddingRight: "20px" }}>
                                                        AIT ({ait_percent}%):
                                                    </TableCell>
                                                    <TableCell align="right" style={{ border: "none", paddingRight: "20px" }}>
                                                        +{format(parseFloat(ait || 0).toFixed(2))}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell align="right" style={{ fontWeight: "bold", border: "none", paddingRight: "20px" }}>
                                                        Transport Cost:
                                                    </TableCell>
                                                    <TableCell align="right" style={{ border: "none", paddingRight: "20px" }}>
                                                        +{format(parseFloat(transport_cost || 0).toFixed(2))}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell align="right" style={{ fontWeight: "bold", fontSize: "16px", borderTop: "2px solid #333", paddingRight: "20px" }}>
                                                        Grand Total:
                                                    </TableCell>
                                                    <TableCell align="right" style={{ fontWeight: "bold", fontSize: "16px", borderTop: "2px solid #333", paddingRight: "20px" }}>
                                                        {format(parseFloat(total_amount || 0).toFixed(2))}
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}

                                {/* Checkbox Section - Only shown when cart has items */}
                                {cart.length > 0 && (
                                    <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #eee', borderRadius: '4px' }}>
                                        <h5 style={{ margin: '0 0 10px 0', textAlign: 'left' }}>Additional Options</h5>
                                        <Grid container spacing={2}>
                                            {checkboxOptions.map((option) => (
                                                <Grid item xs={12} key={option.checkbox_value}>
                                                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox
                                                                    checked={selectedCheckboxes.includes(option.checkbox_value)}
                                                                    onChange={handleCheckboxChange}
                                                                    value={option.checkbox_value}
                                                                    color="primary"
                                                                />
                                                            }
                                                            label={option.checkbox_value}
                                                        />
                                                    </div>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </div>
                                )}

                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Paper className={classes.paper}>
                        <h4 style={{ textAlign: 'left', margin: 0, padding: 0, marginTop: '-10px', marginBottom: '3px' }}>Amount Details</h4>
                        <Grid container style={{ paddingRight: '1px' }}>
                            <Grid item xs={12} sm={5}>
                                <TextField type="number" style={{ marginRight: '5px' }} label="Subtotal"
                                    size="small" disabled value={sub_total} name="sub_total"
                                    variant="outlined" className={classes.inputField}
                                />
                            </Grid>
                            <Grid item xs={0} sm={1}></Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField type="number" style={{ marginRight: '5px' }} size="small" label="Current Due" disabled variant="outlined" className={classes.inputField}
                                    value={0}
                                />
                            </Grid>
                        </Grid>

                        <Grid container style={{ paddingRight: '1px' }}>
                            <Grid item xs={12} sm={5}>
                                <TextField type="number" label="Vat (TK)"
                                    value={vat} name="vat"
                                    variant="outlined" size="small" className={classes.inputField}
                                    inputRef={vatRef}
                                    onChange={handleVatInput}
                                    onKeyDown={(e) => {
                                        if (e.key == 'Enter') {
                                            vatPercentRef.current.focus()
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={0} sm={1}></Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField type="number" label="vat (%)" variant="outlined" size="small" className={classes.inputField}
                                    value={vat_percent} name="vat_percent"
                                    onChange={handleVatInput}
                                    inputRef={vatPercentRef}
                                    onKeyDown={(e) => {
                                        if (e.key == 'Enter') {
                                            aitRef.current.focus()
                                        }
                                    }}
                                />
                            </Grid>
                        </Grid>

                        <Grid container style={{ paddingRight: '1px' }}>
                            <Grid item xs={12} sm={5}>
                                <TextField type="number" label="AIT (TK)"
                                    value={ait} name="ait"
                                    variant="outlined" size="small" className={classes.inputField}
                                    inputRef={aitRef}
                                    onChange={handleAitInput}
                                    onKeyDown={(e) => {
                                        if (e.key == 'Enter') {
                                            aitPercentRef.current.focus()
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={0} sm={1}></Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField type="number" label="AIT (%)" variant="outlined" size="small" className={classes.inputField}
                                    value={ait_percent} name="ait_percent"
                                    onChange={handleAitInput}
                                    inputRef={aitPercentRef}
                                    onKeyDown={(e) => {
                                        if (e.key == 'Enter') {
                                            discountRef.current.focus()
                                        }
                                    }}
                                />
                            </Grid>
                        </Grid>

                        <Grid container style={{ paddingRight: '1px' }}>
                            <Grid item xs={12} sm={5}>
                                <TextField type="number" style={{ marginRight: '5px' }} size="small" label="Discount(TK)" variant="outlined" className={classes.inputField}
                                    value={discount} name="discount"
                                    inputRef={discountRef}
                                    onChange={handleDiscountInput}
                                    onKeyDown={(e) => {
                                        if (e.key == 'Enter') {
                                            discountPercentRef.current.focus()
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={0} sm={1}></Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField type="number" label="Discount (%)" size="small" variant="outlined" className={classes.inputField}
                                    value={discount_percent} name="discount_percent"
                                    onChange={handleDiscountInput}
                                    inputRef={discountPercentRef}
                                    onKeyDown={(e) => {
                                        if (e.key == 'Enter') {
                                            transportRef.current.focus()
                                        }
                                    }}
                                />
                            </Grid>
                        </Grid>

                        <Grid container style={{ paddingRight: '1px' }}>
                            <Grid item xs={12} sm={5}>
                                <TextField type="number" style={{ marginRight: '5px' }} size="small" label="Total" disabled variant="outlined" className={classes.inputField}
                                    value={total_amount} name="total_amount"
                                />
                            </Grid>
                            <Grid item xs={0} sm={1}></Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField type="number" style={{ marginRight: '5px' }} size="small" label="Transport Cost" variant="outlined" className={classes.inputField}
                                    value={transport_cost} name="transport_cost" onChange={(e) => transport_cost_set(e.target.value)}
                                    inputRef={transportRef}
                                    onKeyDown={(e) => {
                                        if (e.key == 'Enter') {
                                            saleRef.current.focus()
                                        }
                                    }}
                                />
                            </Grid>
                        </Grid>

                        <Grid container style={{ paddingRight: '1px' }}>
                            <Grid item xs={12} sm={6}>
                                <Button style={{ marginTop: '5px', fontSize: '18px', float: 'left' }}
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    disabled={saveAction ? true : false}
                                    buttonRef={saleRef}
                                    onClick={() => { saleSaveAction() }}
                                    className={classes.button}
                                    startIcon={<SaveIcon />}
                                >
                                    Quotation
                                </Button>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Button
                                    style={{ marginTop: '5px', fontSize: '10px', float: 'right' }}
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    onClick={resetForm}
                                    className={classes.button}
                                    startIcon={<SaveIcon />}
                                >
                                    New Quotation
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    )
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    inputField: {
        width: '100%',
        marginTop: '5px'
    },
    plusLinkDiv: {
        position: 'relative'
    },
    plusLink: {
        margin: 0,
        padding: 0,
        marginTop: '-21px',
        fontSize: '29px',
        height: '21px',
        textAlign: 'right',
        position: 'absolute',
        right: 0,
        color: '#3e8d54'
    },
    paper: {
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}));

export default QuotationEntryStandalone;

