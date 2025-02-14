import React from "react";

const ProductCard = ({ item }) => {
  return (
    <div className={"box"}>
      <div style={{ paddingTop: 20 }}></div>
      <div>
        <img
          src={item?.node?.images?.edges?.[0]?.node?.url}
          className="product-image"
        />
      </div>
      <div className="product-title ">{item.node.title}</div>
      <div className="rowCard">
        <div className="marginTop">
          Price: {item.node.priceRangeV2.minVariantPrice.amount}
        </div>
        <div className="marginTop">Quanility: {item.node.totalInventory}</div>
      </div>
    </div>
  );
};

export default ProductCard;
