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
                    label: 'Blocks',
                    icon: 'pi pi-server'
                },
                {
                    label: 'UI Kit',
                    icon: 'pi pi-pencil'
                },
                {
                    label: 'Inventarios',
                    icon: 'pi pi-palette',
                    items: [
                        {
                            label: 'Inventario',
                            icon: 'pi pi-palette',
                            url: '/inventario'
                        },
                        {
                            label: 'Inventario II',
                            icon: 'pi pi-palette',
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