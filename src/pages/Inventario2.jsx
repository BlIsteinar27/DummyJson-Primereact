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


const API = "http://localhost/inventarios/back/api/productos/getProductos.php"

const Inventario2 = () => {
    const [productos, setProductos] = useState([]);
    const [producto, setProducto] = useState({ nombre: '', categoria: '', precio: '', descuento: '', rating: '', stock: '', marca: '' });
    const [miniatura, setMiniatura] = useState(null);

    const [cargando, setCargando] = useState(true);
    const [statuses] = useState(['INSTOCK', 'LOWSTOCK', 'OUTOFSTOCK']);

    const [isEditing, setIsEditing] = useState(false);
    const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
    const [productoToDelete, setProductoToDelete] = useState(null);
    const toast = useRef(null);

    const [visible, setVisible] = useState(false);

    const POST_API = 'http://localhost/inventarios/back/api/productos/postProducto.php';


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

    const openNew = () => {
        setProducto({ nombre: '', categoria: '', precio: '', descuento: '', rating: '', stock: '', marca: '' });
        setIsEditing(false);
        setVisible(true);
    };
    const editProducto = (producto) => {
        setProducto(producto);
        setIsEditing(true);
        setVisible(true);
    };

    // Función para manejar el clic en el botón
    const saveProducto = async (event) => {
        event.preventDefault();
        const method = isEditing ? 'PUT' : 'POST';
        const url = isEditing ? `http://localhost/inventarios/back/api/productos/updateProducto.php?id=${producto.id}` : POST_API;

        try {
            const formData = new FormData();
            formData.append('nombre', producto.nombre);
            formData.append('categoria', producto.categoria);
            formData.append('precio', producto.precio);
            formData.append('descuento', producto.descuento);
            formData.append('rating', producto.rating);
            formData.append('stock', producto.stock);
            formData.append('marca', producto.marca);
            if (miniatura && miniatura.length > 0) {
                formData.append('miniatura', miniatura[0]); // Solo se envía una imagen
            }

            const response = await fetch(url, {
                method: method,
                body: formData, // No se necesita especificar el Content-Type
            });

            const result = await response.json();

            if (response.ok) {
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: `Producto ${isEditing ? 'actualizado' : 'inscrito'} correctamente.`, life: 3000 });
                setVisible(false);
                fetchProductos();
            } else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: result.message || 'Error desconocido', life: 3000 });
            }
        } catch (error) {
            console.error('Error al enviar los datos:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al enviar los datos.', life: 3000 });
        }
    };


    const confirmDelete = (id) => {
        setProductoToDelete(id);
        setConfirmDeleteVisible(true);
    };

    const deleteProducto = async () => {
        try {
            const response = await fetch(`http://localhost/inventarios/back/api/productos/deleteProducto.php?id=${productoToDelete}`, {
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

    const footer = (
        <div>
            <Button label="Cancelar" icon="pi pi-times p-button-danger" onClick={() => setVisible(false)} />
            <Button label="Agregar" icon="pi pi-check p-button-success" onClick={saveProducto} />
        </div>
    );

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
                            <div>
                                <Button icon="pi pi-plus" label="Agregar Producto" className='p-button-success' onClick={openNew} />
                                <DataTable value={productos}  editMode="row" dataKey="id" onRowEditComplete={onRowEditComplete} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}>
                                    <Column field="id" sortable header="Id" editor={(options) => textEditor(options)} style={{ width: '20%' }}></Column>
                                    <Column field="nombre" header="Nombre" editor={(options) => textEditor(options)} style={{ width: '20%' }}></Column>
                                    <Column field="categoria" header="Categoria" editor={(options) => textEditor(options)} style={{ width: '20%' }}></Column>
                                    <Column field="inventoryStatus" header="Estado" editor={(options) => statusEditor(options)} style={{ width: '20%' }}></Column>
                                    <Column rowEditor={allowEdit} header="Editar" headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
                                    <Column header="Acciones" body={(rowData) => (
                                        <div>
                                            <Button
                                                icon="pi pi-pencil"
                                                className="p-button-info p-mr-2"
                                                onClick={() => editProducto(rowData)}
                                            />
                                            <Button
                                                icon="pi pi-trash"
                                                className="p-button-danger"
                                                onClick={() => confirmDelete(rowData.id)}
                                            />
                                        </div>
                                    )}></Column>
                                </DataTable>

                            </div>
                        )
                    )}
                </div>
                <Dialog header="Editar Producto" visible={visible} footer={footer} onHide={() => setVisible(false)} style={{ width: '50vw' }}>
                    <form className="p-fluid" encType='multipart/form-data'>
                        <div className="mb-3">
                            <label htmlFor="nombre" className="form-label">Nombre del producto</label>
                            <InputText
                                id="nombre"
                                className="w-full"
                                value={producto.nombre}
                                onChange={(e) => setProducto({ ...producto, nombre: e.target.value })}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="categoria" className="form-label">Categoria</label>
                            <InputText
                                id="categoria"
                                className="w-full"
                                value={producto.categoria}
                                onChange={(e) => setProducto({ ...producto, categoria: e.target.value })}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="precio" className="form-label">Precio</label>
                            <InputText
                                id="precio"
                                className="w-full"
                                value={producto.precio}
                                onChange={(e) => setProducto({ ...producto, precio: e.target.value })}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="descuento" className="form-label">Descuento</label>
                            <InputText
                                id="descuento"
                                className="w-full"
                                value={producto.descuento}
                                onChange={(e) => setProducto({ ...producto, descuento: e.target.value })}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="rating" className="form-label">Rating</label>
                            <InputText
                                id="rating"
                                className="w-full"
                                value={producto.rating}
                                onChange={(e) => setProducto({ ...producto, rating: e.target.value })}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="stock" className="form-label">Stock</label>
                            <InputText
                                id="stock"
                                className="w-full"
                                value={producto.stock}
                                onChange={(e) => setProducto({ ...producto, stock: e.target.value })}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="marca" className="form-label">Marca del producto</label>
                            <InputText
                                id="marca"
                                className="w-full"
                                value={producto.marca}
                                onChange={(e) => setProducto({ ...producto, marca: e.target.value })}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="miniatura" className="form-label">Miniatura</label>
                            <input
                                type="file"
                                className="form-control"
                                id="miniatura"
                                accept="image/*"
                                onChange={(e) => setMiniatura(Array.from(e.target.files))}
                                required
                            />

                        </div>
                    </form>
                </Dialog>
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
