import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import "../../styles/store/Store.css";
import {
  addStore,
  getStores,
} from "../../services/storeService";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";



function Store() {
  const [showModal, setShowModal] = useState(false);
  const [stores, setStores] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const fetchStores = async (currentPage = page) => {
    try {
      const response = await getStores(currentPage);

      setStores(response.data);
      setTotalPages(response.totalPages);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to fetch stores"
      );
    }
  };

  useEffect(() => {
    fetchStores(page);
  }, [page]);

  const onSubmit = async (data) => {
    try {
      const response = await addStore(data);

      toast.success(response.message);

      if (page === 1) {
        fetchStores(1);
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
    <div className="store-page">
      <div className="store-header">
        <h2>Stores</h2>

        {user?.role === "admin" && (
  <button onClick={() => setShowModal(true)}>
    Add Store
  </button>
)}
      </div>

      <table className="store-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {stores.length > 0 ? (
            stores.map((store) => (
              <tr key={store._id}>
                <td>{store.name}</td>
                <td>{store.description}</td>
                <td>{store.status}</td>
                <td>
  <button
    onClick={() =>{
      console.log(store._id);
    console.log(`/store/stocks/${store._id}`);
      navigate(`/store/stocks/${store._id}`)}
    }
  >
    {user?.role === "admin"
    ? "Manage Stocks"
    : "View Stocks"}
  </button>
</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No stores found.</td>
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
            <h3>Add Store</h3>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-group">
                <label>Store Name</label>

                <input
                  type="text"
                  placeholder="Enter store name"
                  {...register("name", {
                    required: "store name is required",
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

export default Store;