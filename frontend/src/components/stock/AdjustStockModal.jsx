import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { adjustStock } from "../../services/stockService";

function AdjustStockModal({
  onClose,
  stock,
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
      const response = await adjustStock({
        stockId: stock._id,
        quantity: Number(data.quantity),
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
          "Something went wrong"
      );
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Adjust Stock</h3>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>Store</label>

            <input
              type="text"
              value={stock.storeName}
              disabled
            />
          </div>

          <div className="form-group">
            <label>Product</label>

            <input
              type="text"
              value={`${stock.product.name} (${stock.product.sku})`}
              disabled
            />
          </div>

          <div className="form-group">
            <label>Current Quantity</label>

            <input
              type="number"
              value={stock.quantity}
              disabled
            />
          </div>

          <div className="form-group">
            <label>Add Quantity</label>

            <input
              type="number"
              placeholder="Enter quantity"
              {...register("quantity", {
                required: "Quantity is required",
                valueAsNumber: true,
                min: {
                  value: 1,
                  message: "Quantity must be greater than 0",
                },
              })}
            />

            <small className="error-text">
              {errors.quantity?.message}
            </small>
          </div>

          <div className="modal-buttons">
            <button type="submit">
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

export default AdjustStockModal;