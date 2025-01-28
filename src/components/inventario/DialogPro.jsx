import { Dialog } from 'primereact/dialog';

const DialogPro = ({ producto, visible, onHide }) => {
    return (
        <>
            <Dialog

                header={producto.nombre}
                visible={visible}
                style={{ width: '50vw' }}
                modal={true}
                onHide={onHide}>
                <div className='d-flex justify-content-center align-items-center'>
                    <div>
                        <img alt={producto.nombre} src={producto.miniatura} />
                    </div>
                    <div>
                        <p>{producto.descripcion}</p>
                        <p>Precio: {producto.precio} $</p>
                        <p>Categoría: {producto.categoria}</p>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

export default DialogPro