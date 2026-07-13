import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { assignProduct } from "../../services/stockService";

function AssignProductModal({
  onClose,
  storeId,
  storeName,
  products,
  fetchStocks,
  page,
  setPage,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await assignProduct({
        ...data,
        storeId,
      });

      toast.success(response.message);

      reset();
      onClose();

      if (page === 1) {
        fetchStocks(1);
      } else {
        setPage(1);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.errors?.[0]?.msg ||
          error.response?.data?.message ||
          "Something went wrong",
      );
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Assign Product</h3>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>Store</label>

            <input type="text" value={storeName} disabled />
          </div>

          <div className="form-group">
            <label>Product</label>
            {products.length > 0 ? (
              <>
                <select
                  defaultValue=""
                  {...register("productId", {
                    required: "Product is required",
                  })}
                >
                  <option value="">Select Product</option>

                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name} ({product.sku})
                    </option>
                  ))}
                </select>

                <small className="error-text">
                  {errors.productId?.message}
                </small>
              </>
            ) : (
              <p>No available products to assign.</p>
            )}
          </div>

          <div className="form-group">
            <label>Quantity</label>

            <input
              type="number"
              placeholder="Enter quantity"
              disabled={products.length === 0}
              {...register("quantity", {
                required: "Quantity is required",
                valueAsNumber: true,
                min: {
                  value: 1,
                  message: "Quantity must be greater than 0",
                },
              })}
            />

            <small className="error-text">{errors.quantity?.message}</small>
          </div>

          <div className="modal-buttons">
            <button type="submit" disabled={products.length === 0}>
              Save
            </button>

            <button
              type="button"
              onClick={() => {
                reset();
                onClose();
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AssignProductModal;
