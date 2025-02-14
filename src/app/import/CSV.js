"use client"

import React, { useState } from 'react';
import Papa from 'papaparse';
import CustomLayout from '../layout/layout';
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { RiLoader4Fill } from 'react-icons/ri'; 

const CSVImporter = ({session, store}) => {

  const [csvData, setCSVData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [mappings, setMappings] = useState({});
  const [error, setError] = useState('');
  const [processedData, setProcessedData] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const requiredFields = ["Product Name", "Product Description", "Featured Image", "Product Price", "Product Link"];

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    Papa.parse(file, {
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          setHeaders(results.data[0]);
          setCSVData(results.data.slice(1));
          setMappings({});
          setError('');
          console.log('CSV Headers:', results.data[0]);
        } else {
          setError('The CSV file appears to be empty or invalid.');
        }
      },
      header: false,
      skipEmptyLines: true,
      error: (error) => {
        setError(`Error parsing CSV: ${error.message}`);
      }
    });
  };

  const handleMapping = (field, header) => {
    setMappings(prev => {
      const newMappings = { ...prev, [field]: header };
      console.log('Updated Mappings:', newMappings);
      return newMappings;
    });
  };

  const validateMappings = () => {
    const missingFields = requiredFields.filter(field => !mappings[field]);
    if (missingFields.length > 0) {
      setError(`Please map the following required fields: ${missingFields.join(', ')}`);
      return false;
    }
    setError('');
    return true;
  };

  const processCSVData = () => {
    return csvData.map((row, index) => {
      const processedRow = {};
      for (const [field, header] of Object.entries(mappings)) {
        const headerIndex = headers.indexOf(header);
        if (headerIndex !== -1) {
          processedRow[field.toLowerCase().replace(/\s+/g, '')] = row[headerIndex];
        } else {
          console.error(`Header "${header}" not found for field "${field}" in row ${index + 1}`);
        }
      }
      console.log(`Processed Row ${index + 1}:`, processedRow);
      return processedRow;
    });
  };

  const handleSubmit = () => {
    if (validateMappings()) {
      const processed = processCSVData();
      setProcessedData(processed);
      setOpenPopup(true);
      console.log('All Processed Data:', processed);
    }
  };

  // {
  //   "name": "Product 1",
  //   "description": "Description for product 1",
  //   "price": 19.99,
  //   "image": "https://example.com/product1.jpg",
  //   "link": "https://example.com/product1",
  //   "sku": "SKU001",
  //   "active": true
  // },

  async function importData() {
    setLoading(true);

    function extractNumber(str) {
      const result = str.match(/\d+/);
      return result ? parseFloat(result[0]) : null;
    }

    const uploadableData = processedData.map(data => {
      return {
        name: data.productname,
        description: data.productdescription,
        price: extractNumber(data.productprice),
        image: data.featuredimage,
        link: data.productlink,
        sku: data?.sku ? data.sku : null,
        active: true
      }
    }
    )

    const response = await fetch('/api/admin/product/bulk-upload-products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ storeId: store?.id, products: uploadableData })
    });

    if (response.ok) {
      setLoading(false);
      console.log('Data imported successfully');
      setCSVData([]);
      setHeaders([]);
      setMappings({});
      setProcessedData([]);
      setOpenPopup(false);
    } else {
      setLoading(false);
      console.error('Error importing data:', response.statusText);
    }
    
  }  

  return (
    <>
      <Dialog open={openPopup} onOpenChange={setOpenPopup}>
      {openPopup && <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Import Preview</DialogTitle>
          <DialogDescription>
            <div className='w-full max-h-[400px] overflow-y-scroll flex justify-center flex-wrap gap-2'>
            {processedData.length > 0 && processedData.map((data, index) => {
              return (
                <div key={index} className="flex items-start border border-gray-400 flex-col w-[30.33%] p-2">
                  <img src={data.featuredimage} alt={data.productname} className="w-full h-full object-cover rounded" />
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-normal text-left text-black mt-2 ">{data.productname}</p>
                    <p className="text-xs text-left text-black">{data.productdescription.length > 10 ? data.productdescription.substring(0, 40) + '...' : data.productdescription}</p>
                  </div>
                  {data.productprice ? <p className="text-sm font-semibold text-left text-black">${data.productprice}</p>: "No Price"}
                </div>
              )
            })}
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className='flex items-center justify-between w-full'>
            <span className='text-xs text-left text-black pr-5'>Does the data look correct? If yes then please continue with import.</span>
          <Button onClick={() => importData()} type="submit" className="bg-black text-white flex items-center justify-center gap-2">Finish Import <RiLoader4Fill fontSize={20}  className={`spinner ${loading ? 'block' : 'hidden'}`} /></Button>
          </div>
        </DialogFooter>
      </DialogContent>}
    </Dialog>
      <h1 className="text-xl font-bold mb-4 mt-5">Import CSV</h1>
      
      <div className="mb-4">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="hidden"
          id="csv-upload"
        />
        <label htmlFor="csv-upload" className="cursor-pointer block p-8 border-2 border-dashed border-gray-300 rounded-lg text-center">
          <div>
            <span className="block mb-2">📁</span>
            <span className="font-semibold">
              Upload CSV file
            </span>
          </div>
        </label>
      </div>

      {headers.length > 0 && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Map Fields</h2>
          {requiredFields.map(field => (
            <div key={field} className="mb-2 flex items-center justify-between">
              <label className="block mb-1 text-sm font-medium">{field}:</label>
              <select 
                onChange={(e) => handleMapping(field, e.target.value)}
                className="w-2/4 p-2 rounded border border-gray-300"
              >
                <option value="">Select a column</option>
                {headers.map(header => (
                  <option key={header} value={header}>{header}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 rounded p-4 mb-4">
          <p className="text-red-700 font-bold">Error</p>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <button 
        onClick={handleSubmit} 
        disabled={headers.length === 0}
        className={`px-3 py-2 rounded bg-black text-white`}
      >
        Import Data
      </button>
    </>
  );
};

export default CSVImporter;