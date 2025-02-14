import Image from "next/image";
import React from "react";

const ImagesModal = ({ handleProductSelect }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-body p-5">
          <div className="search">
            <input
              type="text"
              className="form-control border-dark w-100 mb-5"
              placeholder="Search"
            />
            <ul className="flex flex-wrap gap-5 list-unstyled">
              <li onClick={() => handleProductSelect("product-1")}>
                <div className="product-card flex justify-content-center">
                  <div className="flex flex-col justify-content-center  items-center">
                    <Image
                      src="/commuter-mobile 1.png"
                      alt="Vercel Logo"
                      className="dark:invert"
                      width={160}
                      height={160}
                      priority
                    />
                    <p className="heading_product text-center m-0 mt-2">
                      Monument Grey Tech Chino
                    </p>
                  </div>
                </div>
              </li>
              <li onClick={() => handleProductSelect("product-2")}>
                <div className="product-card flex justify-content-center">
                  <div className="flex flex-col justify-content-center  items-center">
                    <Image
                      src="/DSC_0035 (2) 1.png"
                      alt="Vercel Logo"
                      className="dark:invert"
                      width={160}
                      height={160}
                      priority
                    />
                    <p className="heading_product text-center m-0 mt-2">
                      Monument Grey Tech Chino
                    </p>
                  </div>
                </div>
              </li>
              <li onClick={() => handleProductSelect("product-3")}>
                <div className="product-card flex justify-content-center">
                  <div className="flex flex-col justify-content-center  items-center">
                    <Image
                      src="/Blue_Horizon_Tech_Chinos_2 1.png"
                      alt="Vercel Logo"
                      className="dark:invert"
                      width={160}
                      height={160}
                      priority
                    />
                    <p className="heading_product text-center m-0 mt-2">
                      Monument Grey Tech Chino
                    </p>
                  </div>
                </div>
              </li>
            </ul>
            <div className="flex justify-content-between">
              <div className="flex justify-content-center gap-3">
                <Image
                  src="/Less Than.svg"
                  alt="Vercel Logo"
                  className="dark:invert"
                  width={20}
                  height={20}
                  priority
                />
                <p className="slide_num text-white text-center m-0">1</p>
                <Image
                  src="/More Than.svg"
                  alt="Vercel Logo"
                  className="dark:invert"
                  width={20}
                  height={20}
                  priority
                />
              </div>
              <div className="flex flex-col gap-3">
                <button className="btn btn-dark text-white px-4">Upload</button>
                <button className="btn btn-dark text-white px-4">
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagesModal;
