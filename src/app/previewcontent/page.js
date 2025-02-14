import Navbar from "@/components/Navbar/page";
import Sidebar from "@/components/sidebar/page";
import Image from "next/image";
import React from "react";

const PreviewContent = () => {
  return (
    <>
      <Navbar />
      <div className="container-fluid">
        <div className="row">
          <Sidebar activeLink={"/dashboard"} />
          <div className="col-md-11">
            <div className="row page_padding">
              <div style={{ cursor: "pointer" }}>
                <Image
                  src="/left arrow.svg"
                  alt="Vercel Logo"
                  className="dark:invert"
                  width={65}
                  height={39}
                  priority
                />
              </div>
              <div className="col-md-6 col-sm-12">
                <div className="row ms-md-4 ms-sm-0 mb-5">
                  <div className="col-12">
                    <label
                      htmlFor="storeName"
                      className="form-label font-bold"
                      style={{ fontSize: 14 }}
                    >
                      Campaign Name
                    </label>
                    <input
                      type="text"
                      className="form-control border-dark w-100"
                      id="storeName"
                      style={{ fontSize: 14 }}
                      placeholder=""
                    />
                  </div>
                </div>
                <div className="row ms-md-4 ms-sm-0 mb-5">
                  <div className="col-md-8 col-sm-12">
                    <label htmlFor="storeName" className="form-label font-bold">
                      Campaign Date
                    </label>
                    <div className="flex position-relative">
                      <input
                        type="text"
                        className="form-control border-dark w-100"
                        placeholder=""
                      />
                      <Image
                        src="/Calendar.svg"
                        alt="Vercel Logo"
                        className="dark:invert position-absolute end-0 me-3 mt-1"
                        width={30}
                        height={30}
                        priority
                      />
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-12 mt-md-0 mt-sm-5">
                    <label htmlFor="storeName" className="form-label font-bold">
                      Time
                    </label>
                    <div className="flex position-relative">
                      <input
                        type="text"
                        className="form-control border-dark w-100"
                        placeholder=""
                      />
                      <Image
                        src="/Clock.svg"
                        alt="Vercel Logo"
                        className="dark:invert position-absolute end-0 me-3 mt-1"
                        width={30}
                        height={30}
                        priority
                      />
                    </div>
                  </div>
                </div>
                <div className="row ms-md-4 ms-sm-0 mb-5">
                  <div className="col-12">
                    <label htmlFor="storeName" className="form-label font-bold">
                      Customer Segment
                    </label>
                    <div className="flex position-relative">
                      <input
                        type="text"
                        className="form-control border-dark w-100"
                        placeholder=""
                      />
                      <Image
                        src="/Circle Chart.svg"
                        alt="Vercel Logo"
                        className="dark:invert position-absolute end-0 me-3 mt-1"
                        width={30}
                        height={30}
                        priority
                      />
                    </div>
                  </div>
                </div>
                <div className="row ms-md-4 ms-sm-0 mb-5">
                  <div className="col-12">
                    <label htmlFor="storeName" className="form-label font-bold">
                      Exclude Segment
                    </label>
                    <div className="flex position-relative">
                      <input
                        type="text"
                        className="form-control border-dark w-100"
                        placeholder=""
                      />
                      <Image
                        src="/Circle Chart.svg"
                        alt="Vercel Logo"
                        className="dark:invert position-absolute end-0 me-3 mt-1"
                        width={30}
                        height={30}
                        priority
                      />
                    </div>
                  </div>
                </div>
                <div className="row my-5">
                  <div className="col-md-6 col-sm-12 flex justify-content-md-end justify-content-sm-center mb-md-0 mb-sm-5">
                    <button className="btn btn-dark border_btn px-5 mx-5">
                      Edit
                    </button>
                  </div>
                  <div className="col-md-6 col-sm-12 flex justify-content-md-start justify-content-sm-center">
                    <button className="btn btn-dark border_btn px-5">
                      Publish
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-sm-12">
                <p style={{ fontSize: 14 }} className="font-bold margin_start">
                  Preview Content
                </p>
                <div className="fathers-card mx-auto flex justify-content-center  items-center">
                  <Image
                    src="/image 1.svg"
                    alt=""
                    className="dark:invert w_father_img"
                    width={400}
                    height={500}
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PreviewContent;
