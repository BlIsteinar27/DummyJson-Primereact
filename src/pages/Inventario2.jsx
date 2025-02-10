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

const API = "http://localhost/inventarios/back/api/productos/getProductos.php";
const POST_API = 'http://localhost/inventarios/back/api/productos/postProducto.php';

const Inventario2 = () => {
    const [productos, setProductos] = useState([]);
    const [producto, setProducto] = useState({ nombre: '', categoria: '', precio: '', descuento: '', rating: '', stock: '', marca: '' });
    const [cargando, setCargando] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
    const [productoToDelete, setProductoToDelete] = useState(null);
    const toast = useRef(null);
    const [visible, setVisible] = useState(false);

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

    const saveProducto = async (event) => {
        event.preventDefault();
        const method = isEditing ? 'PUT' : 'POST';
        const url = isEditing
            ? `http://localhost/inventarios/back/api/productos/updateProducto2.php?id=${producto.id}`
            : POST_API;

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(producto), // Enviar los datos como JSON
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

    return (
        <>
            <Toast ref={toast} />
            <div className='container'>
                <h2 className='text-center py-3'>Inventario 2</h2>
                <div className='card'>
                    {cargando ? (
                        <Skeleton height="200px" />
                    ) : productos.length === 0 ? (
                        <p>No hay productos disponibles.</p>
                    ) : (
                        <>
                            <Button label="Nuevo Producto" onClick={openNew} />
                            <DataTable value={productos} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]}>
                                <Column field="nombre" header="Nombre" />
                                <Column field="categoria" header="Categoría" />
                                <Column field="precio" header="Precio" />
                                <Column field="stock" header="Stock" />
                                <Column header="Acciones" body={(rowData) => (
                                    <>
                                        <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editProducto(rowData)} />
                                        <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => confirmDelete(rowData.id)} />
                                    </>
                                )} />
                            </DataTable>
                        </>
                    )}
                </div>
                <Dialog visible={visible} onHide={() => setVisible(false)} header={isEditing ? "Editar Producto" : "Nuevo Producto"}>
                    <form onSubmit={saveProducto}>
                        <div className="p-fluid">
                            {['nombre', 'categoria', 'precio', 'descuento', 'rating', 'stock', 'marca'].map((field) => (
                                <div className="p-field" key={field}>
                                    <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                                    <InputText
                                        id={field}
                                        value={producto[field]}
                                        onChange={(e) => setProducto({ ...producto, [field]: e.target.value })}
                                        required
                                    />
                                </div>
                            ))}
                            <Button type="submit" label={isEditing ? "Actualizar" : "Guardar"} />
                        </div>
                    </form>
                </Dialog>
                <Dialog visible={confirmDeleteVisible} onHide={() => setConfirmDeleteVisible(false)}>
                    <p>¿Estás seguro de que deseas eliminar este producto?</p>
                    <Button label="Cancelar" onClick={() => setConfirmDeleteVisible(false)} />
                    <Button label="Eliminar" onClick={deleteProducto} className="p-button-danger" />
                </Dialog>
            </div>
        </>
    );
};

export default Inventario2;