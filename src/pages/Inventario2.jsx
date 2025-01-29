import React, { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Skeleton } from 'primereact/skeleton';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';


const API = "http://localhost/productos/api/productos/getProductos.php"

const Inventario2 = () => {
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [statuses] = useState(['INSTOCK', 'LOWSTOCK', 'OUTOFSTOCK']);

    const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
    const [productoToDelete, setProductoToDelete] = useState(null);
    const toast = useRef(null);

    useEffect(() => {
        fetchProductos();
    }, []);
    
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

    const confirmDelete = (id) => {
        setProductoToDelete(id);
        setConfirmDeleteVisible(true);
    };

    const deleteProducto = async () => {
        try {
            const response = await fetch(`http://localhost/productos/api/productos/deleteProducto.php?id=${productoToDelete}`, {
                method: 'DELETE',
            });

            const result = await response.json();

            if (response.ok) {
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Producto eliminado correctamente.', life: 3000 });
                fetchProductos();
            } else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: result.message || 'Error desconocido', life: 3000 });
            }
        } catch (error) {
            console.error('Error al eliminar el Producto:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el producto.', life: 3000 });
        } finally {
            setConfirmDeleteVisible(false);
            setProductoToDelete(null);
        }
    };

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
        <>
            <Toast ref={toast} />
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
                                            onClick={() => console.log('Editar producto:', rowData.id)}
                                        />
                                        <Button
                                            icon="pi pi-trash"
                                            className="p-button-danger"
                                            onClick={() => confirmDelete(rowData.id)}
                                        />
                                    </div>
                                )}></Column>
                            </DataTable>
                        )
                    )}
                </div>
                <Dialog header="Confirmar Eliminación" visible={confirmDeleteVisible} footer={
                    <div>
                        <Button label="No" icon="pi pi-times" onClick={() => setConfirmDeleteVisible(false)} />
                        <Button label="Sí" icon="pi pi-check" onClick={deleteProducto} />
                    </div>
                } onHide={() => setConfirmDeleteVisible(false)}>
                    <p>¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.</p>
                </Dialog>
            </div>
        </>
    );
};


export default Inventario2;
