# Mishfa Care - Complete Admin & Customer Guide

## CUSTOMER ORDERING FLOW

### 1. **Browse & Add Products**
- Visit `/products` page
- Filter by category (Women Care, Baby Care)
- Click **"Add to Cart"** button on any product
- Success message shows "Added to cart ✓"
- Cart icon in header shows item count in real-time

**Error Handling:**
- If add to cart fails, an error alert appears
- Try again or refresh and retry

### 2. **View Shopping Cart** (`/cart`)
**Features:**
- View all items with quantities and prices
- Adjust quantities using **+** and **−** buttons
- Remove items with **Trash** icon
- Real-time cart total calculation
- Tax calculation (18% GST)
- Shipping (Free)

**Buttons:**
- **Proceed to Checkout** → Goes to checkout page
- **Clear Cart** → Removes all items (with confirmation)
- **Continue Shopping** → Back to products

**Error Handling:**
- Quantity below 1 auto-removes item
- Confirm before clearing cart
- All errors show clear messages

### 3. **Checkout** (`/checkout`)
**Personal Information Section:**
- Full Name (required)
- Email (required)
- Phone Number (required)

**Delivery Address Section:**
- Street Address
- City (required)
- State (required)
- Pincode (required)

**Payment Methods:**
- Cash on Delivery (COD) - Default
- UPI Payment
- Credit/Debit Card

**Coupon System:**
- Enter coupon code and click **Apply**
- Valid coupons show green success message
- Invalid coupons show error message
- Discount automatically calculates and shows in summary
- Click **Remove** to remove applied coupon

**Order Summary:**
- Shows all items
- Subtotal + Discount - Shipping + Tax = Final Total
- Real-time calculations

**Buttons:**
- **Place Order** → Submits order to database
- **Edit Cart** → Back to cart

**Error Handling:**
- Required fields show validation error
- Coupon errors explain why (expired, min amount, invalid code)
- Order placement errors show clear message

### 4. **Order Confirmation** (`/order-confirmation/:sessionId`)
- Order ID displayed
- Status: Confirmed
- Timeline of what happens next:
  1. Order Processing (within 24 hours)
  2. Shipping (within 2-3 days)
  3. Delivery (within 5-7 days)
- Next steps checklist
- WhatsApp & Email support links

---

## ADMIN PANEL

### **Access Admin Panel**

**URL:** `/admin/login`

**Demo Credentials:**
```
Email: admin@mishfacare.com
Password: mishfa2026secure
```

**Note:** Keep these secure and change in production!

---

### **ADMIN DASHBOARD** (`/admin/dashboard`)

**Overview Section:**
- Total Orders (count)
- Total Revenue (₹)
- Average Order Value (₹)
- Pending Orders (count)

**Management Tabs:**

#### **1. Orders Tab**
**Table Columns:**
| Column | Details |
|--------|---------|
| Order ID | First 8 characters |
| Customer | Customer name |
| Amount | Order total |
| Status | Current status |
| Date | Order creation date |
| Action | Update status dropdown |

**Status Options:**
- Pending
- Confirmed
- Shipped
- Delivered

**How to Update Status:**
1. Find the order in the table
2. Click the **Status Dropdown** in Action column
3. Select new status
4. Status updates immediately in database

#### **2. Distributor Applications Tab**
**View Application Details:**
- Full Name
- Email & Phone
- City & State
- Business Name
- Business Type
- Monthly Expected Order Value
- Message (if provided)
- Application Status

#### **3. Contact Messages Tab**
**View Customer Inquiries:**
- Sender's Name
- Email & Phone
- Subject
- Full Message

**Buttons:**
- **Manage Products** → Goes to product management
- **Logout** → Logs out of admin panel

---

### **PRODUCT MANAGEMENT** (`/admin/products`)

#### **1. Add New Product**

**Button:** Click **"+ Add Product"**

**Form Fields:**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Product Name | Text | Yes | Full product name |
| SKU | Text | No | Stock Keeping Unit |
| Category | Dropdown | Yes | sanitary_pads, baby_diapers, women_care, baby_care |
| Price (₹) | Number | Yes | Selling price |
| Cost Price (₹) | Number | No | Your cost for profit calculation |
| Stock Count | Number | No | Number of units available |
| Description | Text Area | No | Product details |
| Image URL | Text | No | Link to product image |

**Process:**
1. Fill all required fields
2. Click **"Add Product"** button
3. Success message shows "Product added successfully!"
4. Product appears in list below
5. Click **Cancel** to close form

**Error Handling:**
- Required fields validation
- Error message shows what's missing
- Form stays open to fix and retry

---

#### **2. Edit Existing Product**

**Button:** Click **Edit** button on product card

**Process:**
1. Form opens with current product data
2. Change any fields
3. Click **"Update Product"**
4. Success message shows
5. List updates immediately

---

#### **3. Delete Product**

**Button:** Click **Delete** button on product card

**Process:**
1. Confirmation dialog appears: "Are you sure you want to delete this product?"
2. Click OK to confirm
3. Success message: "Product deleted successfully!"
4. Product removed from list

---

### **DISCOUNT MANAGEMENT**

**Tab:** Click "Discounts" tab

**Currently:** Discounts can be managed via coupons (see below)

**Future Enhancement:** Direct product discounts

---

### **COUPON MANAGEMENT**

**Tab:** Click "Coupons" tab

#### **Add New Coupon**

**Button:** Click **"+ Add Coupon"**

**Form Fields:**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Coupon Code | Text | Yes | e.g., SAVE10, SUMMER2024 |
| Discount Type | Dropdown | Yes | Percentage (%) or Fixed Amount (₹) |
| Discount Value | Number | Yes | Amount or percentage |
| Valid Until | DateTime | No | Expiration date & time |
| Minimum Order Amount | Number | No | Minimum purchase required |

**Examples:**

**Example 1 - Percentage Discount:**
- Code: SAVE10
- Type: Percentage (%)
- Value: 10
- Min Order: ₹500
- Effect: 10% off on orders ≥ ₹500

**Example 2 - Fixed Discount:**
- Code: FLAT100
- Type: Fixed Amount (₹)
- Value: 100
- Min Order: ₹1000
- Effect: ₹100 off on orders ≥ ₹1000

**Process:**
1. Fill form fields
2. Click **"Add Coupon"**
3. Success message: "Coupon added successfully!"
4. Coupon appears in list below

**Error Handling:**
- Code field required
- Value field required
- Error message specifies what's missing

---

#### **View Active Coupons**

**Coupon List Shows:**
| Column | Details |
|--------|---------|
| Code | Coupon code (e.g., SAVE10) |
| Discount | ₹100 or 10% (depending on type) |
| Min Order | Minimum purchase amount |
| Status | Active / Inactive badge |
| Delete | Delete coupon button |

---

#### **Delete Coupon**

**Button:** Click **Delete** button on coupon card

**Process:**
1. Confirmation: "Are you sure you want to delete this coupon?"
2. Click OK
3. Success: "Coupon deleted successfully!"
4. Coupon removed from list

---

## **CUSTOMER SIDE - HOW COUPONS WORK**

1. Customer adds products to cart
2. Goes to checkout
3. Sees **"Apply Coupon Code"** section
4. Enters coupon code (e.g., SAVE10)
5. Clicks **Apply** button
6. If valid:
   - Green success message shows
   - Discount amount displays
   - Order total updates with discount
7. If invalid:
   - Error message explains why:
     - "Invalid coupon code"
     - "Coupon has expired"
     - "Minimum order amount is ₹X"
8. Customer completes checkout with discount applied

---

## **DATA STORED IN DATABASE**

### **Orders Table:**
```
- order_id (unique)
- customer_name
- customer_email
- customer_phone
- items (JSON - product details & qty)
- total_amount (final amount after discount & tax)
- discount_amount
- applied_coupon (code used)
- status (pending/confirmed/shipped/delivered)
- customer_session_id (order tracking)
- created_at (timestamp)
```

### **Products Table:**
```
- id
- name
- category
- price
- cost_price (for profit calculation)
- sku
- description
- image_url
- features (array)
- stock_count
- is_featured
- created_at
- updated_at
```

### **Coupons Table:**
```
- id
- code (unique)
- discount_type (percentage/fixed)
- discount_value
- max_uses
- used_count
- valid_from
- valid_until
- is_active
- min_order_amount
- created_at
```

---

## **ERROR HANDLING CHECKLIST**

All buttons have error handling:

✅ **Add to Cart**
- Product validation
- Stock check
- Error message if fails

✅ **Cart Functions**
- Quantity validation
- Delete confirmation
- Clear cart confirmation

✅ **Checkout**
- Required field validation
- Form submission errors
- Order creation errors

✅ **Coupon Application**
- Code validation
- Expiration check
- Minimum amount check
- Clear error messages

✅ **Admin Functions**
- Product CRUD errors
- Coupon CRUD errors
- Status update errors
- Database operation errors

---

## **BEST PRACTICES**

### **For Customers:**
1. Review cart before checkout
2. Check coupon validity date
3. Ensure minimum amount for coupons
4. Fill all required fields
5. Save order ID for tracking

### **For Admin:**
1. Keep credentials secure
2. Review pending orders daily
3. Update order status promptly
4. Monitor coupons (expiration)
5. Check stock levels
6. Archive old coupons
7. Backup product data regularly

---

## **TESTING CHECKLIST**

- [ ] Add product to cart
- [ ] Update cart quantities
- [ ] Remove item from cart
- [ ] Apply valid coupon
- [ ] Try expired coupon
- [ ] Try invalid coupon
- [ ] Complete checkout
- [ ] Check order in admin
- [ ] Update order status
- [ ] Add new product
- [ ] Edit product
- [ ] Delete product
- [ ] Create coupon
- [ ] Delete coupon
- [ ] View distributor apps
- [ ] View contact messages

---

## **SUPPORT**

**For Customers:**
- WhatsApp: +91 79905 07301
- Email: mishfacare@gmail.com

**For Admin Issues:**
- Check database connection
- Verify Supabase credentials
- Review browser console for errors
- Clear browser cache if needed

