import { SysMenuEntity } from 'src/modules/system/menu/entities/menu.entity';

export function generatorRouters(menus: SysMenuEntity[]) {
  console.log('menus=111222===>', menus);
  return filterAsyncRoutes(menus, null);
}

function filterAsyncRoutes(menus: SysMenuEntity[], parentId: number | null) {
  const res: any[] = [];
  // 过滤掉禁用的菜单
  menus = menus.filter((menu) => menu.status !== 0);

  menus.forEach((menu) => {
    // 先处理parentId为null的根节点
    if (parentId === null && menu.parentId === 0) {
      const tmp: any = {
        title: menu.name,
        ...menu,
      };

      // 如果是目录,需要递归处理子菜单
      if (menu.type === 0) {
        const children = filterAsyncRoutes(menus, menu.id);
        if (children.length) {
          tmp.children = children;
        }
      }

      // 只添加目录和菜单,不添加按钮权限
      if (menu.type === 0 || menu.type === 1) {
        res.push(tmp);
      }
    }
    // 处理有parentId的子节点
    else if (parentId !== null && menu.parentId === parentId) {
      const tmp: any = {
        title: menu.name,
        ...menu,
      };

      // 如果是目录,需要递归处理子菜单
      if (menu.type === 0) {
        const children = filterAsyncRoutes(menus, menu.id);
        if (children.length) {
          tmp.children = children;
        }
      }

      // 只添加目录和菜单,不添加按钮权限
      if (menu.type === 0 || menu.type === 1) {
        res.push(tmp);
      }
    }
  });

  return res;
}
