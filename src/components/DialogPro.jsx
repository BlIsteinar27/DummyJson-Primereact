import { Dialog } from 'primereact/dialog';

const DialogPro = ({ producto, visible, onHide }) => {
    return (
        <>
            <Dialog

                header={producto.title}
                visible={visible}
                style={{ width: '50vw' }}
                modal={true}
                onHide={onHide}>
                <div className='d-flex justify-content-center align-items-center'>
                    <div>
                        <img alt={producto.title} src={producto.thumbnail} />
                    </div>
                    <div>
                        <p>{producto.description}</p>
                        <p>Precio: {producto.price} $</p>
                        <p>Categoría: {producto.category}</p>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

export default DialogPro