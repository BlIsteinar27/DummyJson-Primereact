import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Skeleton } from 'primereact/skeleton';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';

const API = "http://localhost/pedidos/pedidosback/api/productos/getProductos.php"

const Inventario2 = () => {
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [statuses] = useState(['INSTOCK', 'LOWSTOCK', 'OUTOFSTOCK']);

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await fetch(API);
                const data = await response.json();
                setProductos(data);
            } catch (error) {
                console.error(error);
            } finally {
                setCargando(false);
            }
        };
        fetchProductos();
    }, []);

    const MensajeNoProductos = () => (
        <div className="text-center">
            <p>No hay productos disponibles.</p>
        </div>
    );

    const getSeverity = (value) => {
        switch (value) {
            case 'INSTOCK':
                return 'success';

            case 'LOWSTOCK':
                return 'warning';

            case 'OUTOFSTOCK':
                return 'danger';

            default:
                return null;
        }
    };

    const onRowEditComplete = (e) => {
        let _productos = [...productos];
        let { newData, index } = e;

        _productos[index] = newData;

        setProductos(_productos);
    };

    const textEditor = (options) => {
        return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
    };

    const statusEditor = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={statuses}
                onChange={(e) => options.editorCallback(e.value)}
                placeholder="Select a Status"
                itemTemplate={(option) => {
                    return <Tag value={option} severity={getSeverity(option)}></Tag>;
                }}
            />
        );
    };

    const allowEdit = (rowData) => {
        return rowData.nombre !== 'Blue Band';
    };

    return (
        <div className='container'>
            <h2 className='text-center py-3'>Inventario 2</h2>
            <div className='card'>
                {cargando ? (
                    <DataTable value={Array.from({ length: 5 }, (v, i) => i)} className="p-datatable-striped">
                        <Column field="id" header="Id" style={{ width: '20%' }} body={<Skeleton width="100%" height="2rem" />} />
                        <Column field="nombre" header="Nombre" style={{ width: '20%' }} body={<Skeleton width="100%" height="2rem" />} />
                        <Column field="categoria" header="Categoria" style={{ width: '20%' }} body={<Skeleton width="100%" height="2rem" />} />
                        <Column header="Estado" style={{ width: '20%' }} body={<Skeleton width="100%" height="2rem" />} />
                        <Column header="Editar" style={{ width: '20%' }} body={<Skeleton width="100%" height="2rem" />} />
                    </DataTable>
                ) : (
                    productos.length === 0 ? (
                        <MensajeNoProductos />
                    ) : (
                        <DataTable value={productos} editMode="row" dataKey="id" onRowEditComplete={onRowEditComplete} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}>
                            <Column field="id" header="Id" editor={(options) => textEditor(options)} style={{ width: '20%' }}></Column>
                            <Column field="nombre" header="Nombre" editor={(options) => textEditor(options)} style={{ width: '20%' }}></Column>
                            <Column field="categoria" header="Categoria" editor={(options) => textEditor(options)} style={{ width: '20%' }}></Column>
                            <Column field="inventoryStatus" header="Estado" editor={(options) => statusEditor(options)} style={{ width: '20%' }}></Column>
                            <Column rowEditor={allowEdit} header="Editar" headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
                            <Column header="Acciones" body={(rowData) => (
                                <div>
                                    <Button
                                        icon="pi pi-pencil"
                                        className="p-button-info p-mr-2"
                                    />
                                    <Button
                                        icon="pi pi-trash"
                                        className="p-button-danger"
                                    />
                                </div>
                            )}></Column>
                        </DataTable>
                    )
                )}
            </div>
        </div>
    );
};

export default Inventario2;
