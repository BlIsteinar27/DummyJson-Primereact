import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { FilterMatchMode } from 'primereact/api';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Skeleton } from 'primereact/skeleton';


import DialogPro from '../components/inventario/DialogPro';


const API = "http://localhost/pedidos/pedidosback/api/productos/getProductos.php"

const Inventario = () => {
    const [productos, setProductos] = useState([]);
    const [dialogoVisible, setDialogoVisible] = useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [cargando, setCargando] = useState(true);
    const op = useRef(null);

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



    const handleDialog = (producto) => {
        setDialogoVisible(true);
        setProductoSeleccionado(producto);
    };

    const handleCloseDialog = () => {
        setDialogoVisible(false);
    };

    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const MensajeCargando = () => (
        <div className="text-center">
            <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
            <p>Cargando...</p>
        </div>
    );

    const MensajeNoProductos = () => (
        <div className="text-center">
            <p>No hay productos disponibles.</p>
        </div>
    );
    const centerContent = (
        <IconField iconPosition="left">
            <InputIcon className="pi pi-search" />
            <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Filtrar por..." />
        </IconField>
    );
    const FilaConMiniatura = ({ rowData }) => {
        const op = React.createRef();

        return (
            <>
                <Button type="button" icon="pi pi-image" onClick={(e) => op.current.toggle(e)} />
                <OverlayPanel ref={op}>
                    <img src={rowData.miniatura} alt={rowData.nombre} style={{ width: '100px', height: '100px' }} />
                </OverlayPanel>
            </>
        );
    };

    return (
        <div className='container'>
        <h2 className='text-center py-4'>Inventario</h2>
        <div className="card">
            {cargando ? (
                <DataTable value={Array.from({ length: 5 }, (v, i) => i)} className="p-datatable-striped">
                    <Column field="id" header="Id" style={{ width: '20%' }} body={<Skeleton width="100%" height="2rem" />} />
                    <Column field="nombre" header="Nombre" style={{ width: '20%' }} body={<Skeleton width="100%" height="2rem" />} />
                    <Column field="miniatura" header="Miniatura" style={{ width: '20%' }} body={<Skeleton width="100%" height="2rem" />} />
                    <Column field="categoria" header="Categoria" style={{ width: '20%' }} body={<Skeleton width="100%" height="2rem" />} />
                    <Column field="detalles" header="Detalles" style={{ width: '20%' }} body={<Skeleton width="100%" height="2rem" />} />
                </DataTable>
            ) : (
                productos.length === 0 ? (
                    <MensajeNoProductos />
                ) : (
                    <DataTable value={productos} filters={filters} paginator rows={5} header={centerContent} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}>
                        <Column field="id" header="Id"></Column>
                        <Column field="nombre" header="Nombre"></Column>
                        <Column header="Miniatura" body={(rowData) => <FilaConMiniatura rowData={rowData} />}></Column>
                        <Column field="categoria" header="Categoria"></Column>
                        <Column header="Detalles" body={(rowData) => (
                            <Button
                                icon="pi pi-info"
                                onClick={() => handleDialog(rowData)}
                                className="p-button-info p-mr-2"
                            />
                        )}></Column>
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
            {productoSeleccionado && (
                <DialogPro
                    visible={dialogoVisible}
                    onHide={handleCloseDialog}
                    producto={productoSeleccionado}
                />
            )}
        </div>
    </div>
    );
};

export default Inventario;
