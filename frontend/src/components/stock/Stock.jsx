import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import "../../styles/stock/Stock.css";
import { getAvailableProducts, getAvailableStores, getStocksByStore } from "../../services/stockService";
import AssignProductModal from "./AssignProductModal";
import AdjustStockModal from "./AdjustStockModal";
import TransferStockModal from "./TransferStockModal";

function Stock() {

  const { storeId } = useParams();

  const { user } = useSelector((state) => state.auth);

  const [storeName, setStoreName] = useState("");
  const [stocks, setStocks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [threshold, setThreshold] = useState("");
  const [showAssignModal, setShowAssignModal] = useState(false);
const [products, setProducts] = useState([]);
const [showAdjustModal, setShowAdjustModal] = useState(false);
const [selectedStock, setSelectedStock] = useState(null);
const [showTransferModal, setShowTransferModal] = useState(false);
const [availableStores, setAvailableStores] = useState([]);

  const fetchStocks = async (
    currentPage = page,
    currentThreshold = threshold
  ) => {
    try {
      const response = await getStocksByStore(
        storeId,
        currentPage,
        5,
        currentThreshold
      );

      setStoreName(response.data.storeName);
setStocks(response.data.stocks);
      
      setTotalPages(response.totalPages);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to fetch stocks"
      );
    }
  };

  useEffect(() => {
    fetchStocks(page, threshold);
  }, [page]);

  return (
    <div className="stock-page">

      <div className="stock-header">

        <h2>Store Name : {storeName} </h2>

        {user?.role === "admin" && (
          <button
  onClick={async () => {
    try {
      const response =
        await getAvailableProducts(storeId);

      setProducts(response.data);

      setShowAssignModal(true);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to fetch products"
      );
    }
  }}
>
  Assign Product
</button>
        )}

      </div>

      <div className="stock-filter">

        <input
          type="number"
          placeholder="Low stock threshold"
          value={threshold}
          onChange={(e) =>
            setThreshold(e.target.value)
          }
        />

        <button
          onClick={() => {
            setPage(1);
            fetchStocks(1, threshold);
          }}
        >
          Filter
        </button>

        <button
          onClick={() => {
            setThreshold("");
            setPage(1);
            fetchStocks(1, "");
          }}
        >
          Clear
        </button>

      </div>

      <table className="stock-table">

        <thead>
          <tr>
            <th>Product</th>
            <th>SKU</th>
            <th>Quantity</th>

            {user?.role === "admin" && (
              <th>Action</th>
            )}

          </tr>
        </thead>

        <tbody>

          {stocks.length > 0 ? (
            stocks.map((stock) => (
              <tr key={stock._id}>

                <td>{stock.product.name}</td>

                <td>{stock.product.sku}</td>

                <td>{stock.quantity}</td>

                {user?.role === "admin" && (
                  <td>

                    <button
  onClick={() => {
    setSelectedStock({
      ...stock,
      storeName,
    });
    setShowAdjustModal(true);
  }}
>
  Adjust
</button>

                    <button
  onClick={async () => {
    try {
      const response = await getAvailableStores(
        stock._id
      );

      setAvailableStores(response.data);

      setSelectedStock({
        ...stock,
        storeName,
      });

      setShowTransferModal(true);

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to fetch stores"
      );
    }
  }}
>
  Transfer
</button>

                  </td>
                )}

              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={
                  user?.role === "admin"
                    ? 4
                    : 3
                }
              >
                No stocks found.
              </td>
            </tr>
          )}

        </tbody>

      </table>

      <div className="pagination">

        <button
          disabled={page === 1}
          onClick={() =>
            setPage((prev) => prev - 1)
          }
        >
          Prev
        </button>

        <span>
          {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() =>
            setPage((prev) => prev + 1)
          }
        >
          Next
        </button>

      </div>
      {showAssignModal && (
  <AssignProductModal
    onClose={() => setShowAssignModal(false)}
    storeId={storeId}
    storeName={storeName}
    products={products}
    fetchStocks={fetchStocks}
    page={page}
    setPage={setPage}
  />
)}
{showAdjustModal && (
  <AdjustStockModal
    onClose={() => setShowAdjustModal(false)}
    stock={selectedStock}
    fetchStocks={fetchStocks}
    page={page}
    setPage={setPage}
  />
)}
{showTransferModal && (
  <TransferStockModal
    onClose={() => setShowTransferModal(false)}
    stock={selectedStock}
    stores={availableStores}
    fetchStocks={fetchStocks}
    page={page}
    setPage={setPage}
  />
)}

    </div>
  );
}

export default Stock;