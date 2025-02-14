import Image from "next/image";
import React from "react";

const ImageUploadModal = ({ handleProductSelect }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-body p-5">
          <div className="search mb-4">
            <input
              type="text"
              className="form-control border-dark w-100 mb-5"
              placeholder="Search"
            />
            <ul
              className="flex flex-wrap gap-5 list-unstyled"
              style={{ cursor: "pointer" }}
            >
              <li onClick={() => handleProductSelect("product-1")}>
                <Image
                  src="/Screenshot 2024-07-22 180735 1.png"
                  alt="Vercel Logo"
                  className="dark:invert"
                  width={180}
                  height={180}
                  priority
                />
              </li>
              <li onClick={() => handleProductSelect("product-2")}>
                <Image
                  src="/Screenshot 2024-07-22 180807 1.png"
                  alt="Vercel Logo"
                  className="dark:invert"
                  width={180}
                  height={180}
                  priority
                />
              </li>
              <li onClick={() => handleProductSelect("product-3")}>
                <Image
                  src="/Screenshot 2024-07-22 180845 1.png"
                  alt="Vercel Logo"
                  className="dark:invert"
                  width={180}
                  height={180}
                  priority
                />
              </li>
              <li onClick={() => handleProductSelect("product-4")}>
                <Image
                  src="/Screenshot 2024-07-22 180937 1.png"
                  alt="Vercel Logo"
                  className="dark:invert"
                  width={180}
                  height={180}
                  priority
                />
              </li>
              <li onClick={() => handleProductSelect("product-5")}>
                <Image
                  src="/Screenshot 2024-07-22 181057 1.png"
                  alt="Vercel Logo"
                  className="dark:invert"
                  width={180}
                  height={180}
                  priority
                />
              </li>
            </ul>
          </div>
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
            <div>
              <button className="btn btn-dark text-white px-4">Continue</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadModal;
