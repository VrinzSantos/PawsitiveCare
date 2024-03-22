import React from 'react';

const ReceiptPrinter = React.forwardRef(({ orderData }, ref) => {
    if (!orderData) {
        return null; // Add this line to handle the case when orderData is null
      }
  const { customerName, totalAmount, products, orderDate } = orderData || {};

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <table className="body-wrap">
        <tbody>
          <tr>
            <td></td>
            <td className="container" width="600">
              <div className="content">
                <table className=   "main" width="100%" cellPadding="0" cellSpacing="0">
                  <tbody>
                    <tr>
                      <td className="content-wrap aligncenter">
                        <table width="100%" cellPadding="0" cellSpacing="0">
                          <tbody>
                            <tr>
                              <td className="content-block">
                                <h2>Receipt</h2>
                              </td>
                            </tr>
                            <tr>
                              <td className="content-block">
                                <table className="invoice">
                                  <tbody>
                                    <tr>
                                      <td>
                                        {customerName}<br />
                                        Invoice #{orderData._id}<br />
                                        {new Date(orderDate).toLocaleDateString()}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <table className="invoice-items" cellPadding="0" cellSpacing="0">
                                          <tbody>
                                            {products.map((product) => (
                                              <tr key={product.product._id}>
                                                <td>{product.product.productName}</td>
                                                <td className="alignright">
                                                  $ {product.product.productPrice.toFixed(2)}
                                                </td>
                                              </tr>
                                            ))}
                                            <tr className="total">
                                              <td className="alignright" width="80%">Total</td>
                                              <td className="alignright">
                                                $ {typeof totalAmount === 'number' ? `$ ${totalAmount.toFixed(2)}` : 'Invalid Total'}
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                            <tr>
                              <td className="content-block">
                              </td>
                            </tr>
                            <tr>
                              <td className="content-block">
                                Company Inc. 123 Van Ness, San Francisco 94102
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="footer">
                  <table width="100%">
                    <tbody>
                      <tr>
                        <td className="aligncenter content-block">
                          <button onClick={handlePrint} style={{ marginTop: '10px' }}>
                            Print
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td className="aligncenter content-block">
                          Questions? Email <a href="mailto:support@company.inc">support@company.inc</a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
});

export default ReceiptPrinter;
