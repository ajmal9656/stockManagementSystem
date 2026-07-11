import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";


import "../../styles/product/Product.css";
import {
  addProduct,
  getProducts,
} from "../../services/productService";

function Product() {
  const [showModal, setShowModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { user } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const fetchProducts = async (currentPage = page) => {
    try {
      const response = await getProducts(currentPage);

      setProducts(response.data);
      setTotalPages(response.totalPages);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to fetch products"
      );
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  const onSubmit = async (data) => {
    try {
      const response = await addProduct(data);

      toast.success(response.message);

      if (page === 1) {
        fetchProducts(1);
      } else {
        setPage(1);
      }

      reset();
      setShowModal(false);
    } catch (error) {
      toast.error(
        error.response?.data?.errors?.[0]?.msg ||
          error.response?.data?.message ||
          "Something went wrong"
      );
    }
  };

  return (
    <div className="product-page">
      <div className="product-header">
        <h2>Products</h2>

        {user?.role === "admin" && (
  <button onClick={() => setShowModal(true)}>
    Add Product
  </button>
)}
      </div>

      <table className="product-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>SKU</th>
            <th>Description</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>{product.sku}</td>
                <td>{product.description}</td>
                <td>{product.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No products found.</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="pagination">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          Prev
        </button>

        <span>
          {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add Product</h3>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-group">
                <label>Product Name</label>

                <input
                  type="text"
                  placeholder="Enter product name"
                  {...register("name", {
                    required: "Product name is required",
                  })}
                />

                <small className="error-text">
                  {errors.name?.message}
                </small>
              </div>

              <div className="form-group">
                <label>Description</label>

                <textarea
                  rows="4"
                  placeholder="Enter description"
                  {...register("description", {
                    required: "Description is required",
                    minLength: {
                      value: 3,
                      message: "Minimum 3 characters",
                    },
                  })}
                />

                <small className="error-text">
                  {errors.description?.message}
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
                    setShowModal(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Product;