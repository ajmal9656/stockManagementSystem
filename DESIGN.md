# Design

## Data Model

The application uses four collections.

### User

- name
- email
- password
- role (admin / shopper)

### Product

- name
- sku
- description
- status

### Store

- name
- description
- status

### Stock

- store (ObjectId → Store)
- product (ObjectId → Product)
- quantity

A unique compound index is used on **(store, product)** so that the same product cannot be assigned to the same store more than once.

---

## Preventing Negative Stock

When decreasing stock, I use MongoDB's atomic update operation instead of first reading and then updating the document.

The stock is updated only if enough quantity is available. Since the condition check and the update happen together, concurrent requests cannot reduce the stock below zero.

---

## Atomic Stock Transfers

A stock transfer involves two operations:

- Decrease the quantity from the source store.
- Increase the quantity in the destination store (or create a new stock record if it does not already exist).

Since both operations must succeed together, I use a MongoDB transaction with a session.

If any step fails during the transfer, the transaction is aborted.

This ensures that keeping the stock data consistent.