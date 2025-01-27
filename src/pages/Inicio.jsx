import React, { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Paginator } from 'primereact/paginator';
import { Dialog } from 'primereact/dialog';

const API = 'https://dummyjson.com/products';

const Inicio = () => {

    const [datos, setDatos] = useState([]);
    const [visible, setVisible] = useState(false);

    const getDatos = async () => {
        try {
            const response = await fetch(API);
            const data = await response.json();
            setDatos(data.products);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getDatos();
    }, []);

    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);

    const onPageChange = (event) => {
        setFirst(event.first);
        setRows(event.rows);
    };

    const indexOfLastItem = first + rows;
    const indexOfFirstItem = first;
    const currentItems = datos.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <>
            <div className='container'>
                <h2 className='text-center py-3'>Todos los productos ({datos.length})</h2>
                <Paginator first={first} rows={rows} totalRecords={datos.length} rowsPerPageOptions={[8, 16]} onPageChange={onPageChange} />
                <div className="row">
                    {currentItems && currentItems.map((item) => (
                        <div key={item.id} className='col-md-3 mb-5'>
                            <Card
                                title={item.title}
                                subTitle={item.category}
                                className="md:w-20rem me-5 mb-5 text-center h-100"
                                footer={
                                    <div className='d-flex justify-content-center align-items-center'>
                                        <Button label="info" icon="pi pi-info" onClick={() => setVisible(true)} />
                                    </div>
                                }
                                header={<img alt={item.title} src={item.thumbnail} />}
                            >
                                <p className="m-0 text-danger">
                                    {item.price} $ <br />
                                </p>
                            </Card>
                            
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Inicio;
