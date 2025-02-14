import React, { useRef, useEffect } from 'react';

const PreviewTemplate = ({ htmlTemplate }) => {
  const iframeRef = useRef(null);

  const containerStyles = {
    width: '300px', // Common mobile screen width
    height: '600px', // Common mobile screen height (iPhone 8)
    margin: '0 auto',
    border: '1px solid #000',
    borderRadius: '5px',
    overflow: 'hidden',
    position: 'relative',
  };

  const iframeStyles = {
    width: '100%',
    height: '100%',
    border: 'none',
    overflow: 'hidden', // Hide scrollbar
  };


  useEffect(() => {
    if (iframeRef.current) {
      const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
      iframeDoc.open();
      iframeDoc.write(`
        <style>
          body::-webkit-scrollbar {
            display: none;
          }
          body {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        </style>
        ${htmlTemplate}
      `);
      iframeDoc.close();
    }
  }, [htmlTemplate]);

  return (
    <div style={containerStyles}>
      <iframe ref={iframeRef} style={iframeStyles} title="Email Preview" />
    </div>
  );
};

export default PreviewTemplate;