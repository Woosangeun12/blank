import React, { useEffect, useState } from "react";
import ProductCard from "./LandingPage/components/ProductCard";
import { Row, Col, Container } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductList } from "../features/product/productSlice";
import Footer from "../common/component/Footer";
import SearchBox from "../common/component/SearchBox";
import "../App.css";

const ShopPage = () => {
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.product.productList);
  const [query, setQuery] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState({
    name: query.get("name") || "",
  });
  const name = query.get("name");

  useEffect(() => {
    dispatch(getProductList({ name }));
  }, [query, dispatch]);

  useEffect(() => {
    if (searchQuery.name) {
      setQuery(searchQuery);
    } else {
      setQuery({});
    }
  }, [searchQuery, setQuery]);

  return (
    <div>
      <div className="search-box-container">
        <SearchBox
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholder="Search"
          field="name"
          className="search-box-custom"
        />
      </div>

      <Container className="mt-4">
        <Row className="mt-4">
          {productList.length > 0 ? (
            productList.map((item) => (
              <Col md={3} sm={12} key={item._id}>
                <ProductCard item={item} />
              </Col>
            ))
          ) : (
            <div className="text-align-center empty-bag">
              {name === "" ? (
                <h2>등록된 상품이 없습니다!</h2>
              ) : (
                <h2>{name}과 일치한 상품이 없습니다!</h2>
              )}
            </div>
          )}
        </Row>
      </Container>

      <Footer />
    </div>
  );
};

export default ShopPage;
