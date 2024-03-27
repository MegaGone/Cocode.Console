import { FuseNavigationItem } from "@fuse/components/navigation";

export const getMainRoute = (): string => {
    try {
        const menu: FuseNavigationItem[] = JSON.parse(localStorage.getItem('menu')) || [];

        return (!menu.length) ? 'auth' : menu[0].children[0].link
    } catch (error) {
        return 'auth'
    }
};