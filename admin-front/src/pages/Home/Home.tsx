import { Button, Container, Form, Modal } from "react-bootstrap";
import "./Home.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Product from "../../type/Product";
const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditProduct, setIsEditProduct] = useState(false);
  const [editedProduct, setEditedProduct] = useState<Product>({
    title: "",
    image: "",
    likes: 0,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8001/api/products");
      setProducts(response.data.data);
    } catch (error) {
      console.log("Error fetching products:", error);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    try {
      await axios.delete(`http://localhost:8001/api/products/${productId}`);
      fetchProducts(); // Refresh the product list after deletion
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleSaveProduct = async () => {
    try {
      if (isEditProduct) {
        await axios.put(
          `http://localhost:8001/api/products/${editedProduct.id}`,
          editedProduct
        );
      } else {
        await axios.post("http://localhost:8001/api/products", editedProduct);
      }

      setShowModal(false);
      fetchProducts(); // Refresh the product list after creating/editing
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditedProduct({ ...product });
    setIsEditProduct(true);
    setShowModal(true);
  };

  const handleAddProduct = () => {
    setEditedProduct({
      title: "",
      image: "",
      likes: 0,
    });
    setIsEditProduct(false);
    setShowModal(true);
  };

  return (
    <div>
      <Container>
        <div className="mb-4 title_product d-flex justify-content-between align-items-center">
          <h2>Add New Product</h2>
          <Button onClick={handleAddProduct} variant="outline-primary">
            Add New Product
          </Button>
        </div>

        <div className="table-container">
          <div className="row">
            <div className="col-12">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Image</th>
                    <th scope="col">Title</th>
                    <th scope="col">Likes</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={index}>
                      <th scope="row">{index + 1}</th>
                      <td>
                        <img
                          src={product.image}
                          alt="..."
                          className="img-thumbnail my-img"
                        />
                      </td>
                      <td>{product.title}</td>
                      <td>{product.likes}</td>
                      <td className="d-flex gap-3">
                        <Button
                          onClick={() => handleEditProduct(product)}
                          type="button"
                          variant="primary">
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDeleteProduct(product.id!)}
                          type="button"
                          variant="danger">
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Container>

      {/* Create/Edit Product Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditProduct ? "Edit Product" : "Create Product"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                value={editedProduct.title}
                onChange={(e) =>
                  setEditedProduct({
                    ...editedProduct,
                    title: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formImage">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter image URL"
                value={editedProduct.image}
                onChange={(e) =>
                  setEditedProduct({
                    ...editedProduct,
                    image: e.target.value,
                  })
                }
              />
            </Form.Group>
            {/* Add more form fields as needed */}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveProduct}>
            {isEditProduct ? "Save Changes" : "Create"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default Home;
