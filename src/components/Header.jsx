import { Menubar } from 'primereact/menubar';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';



const Header = () => {

    const items = [
        {
            label: 'Inicio',
            icon: 'pi pi-home',
            url: '/inicio'
        },
        {
            label: 'Paginas',
            icon: 'pi pi-search',
            items: [
                {
                    label: 'Components',
                    icon: 'pi pi-bolt'
                },
               
                {
                    label: 'UI Kit',
                    icon: 'pi pi-pencil'
                },
                {
                    label: 'Inventarios',
                    icon: 'pi pi-box',
                    items: [
                        {
                            label: 'Inventario',
                            icon: 'pi pi-image',
                            url: '/inventario'
                        },
                        {
                            label: 'Inventario II',
                            icon: 'pi pi-pencil',
                            url: '/inventario2'
                        }
                    ]
                }
            ]
        },
        {
            label: 'Contacto',
            icon: 'pi pi-envelope',
            url: '/contacto'
        }
    ];
        const endContent = (
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                <InputText placeholder="Buscar" />
            </IconField>
        );
        

    return (
        <>
            <div className="card">
                <Menubar model={items} end={endContent} />
            </div>
        </>
    )
}

export default Header