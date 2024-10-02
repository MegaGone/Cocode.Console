import { FuseNavigationItem } from '@fuse/components/navigation';

export const getMainRoute = (): string => {
    try {
        const menu: FuseNavigationItem[] =
            JSON.parse(localStorage.getItem('menu')) || [];

        return !menu.length ? 'home' : menu[0].children[0].link;
    } catch (error) {
        return 'home';
    }
};
