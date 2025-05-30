import { SysMenuEntity } from 'src/modules/system/menu/entities/menu.entity';

export function generatorRouters(menus: SysMenuEntity[]) {
  return filterAsyncRoutes(menus, null);
}

export function generatorMenuList(menus: SysMenuEntity[]) {
  return filterAsyncMenus(menus, null);
}

export const filterAsyncRoutes = (
  menus: SysMenuEntity[],
  parentId: number | null,
) => {
  // 过滤掉禁用的菜单和按钮
  menus = menus.filter((menu) => menu.status !== 0 && menu.type !== 2);

  const result: any[] = [];
  const menuMap = new Map();

  // 先将所有菜单项放入 map 中
  menus.forEach((menu) => {
    menuMap.set(menu.id, {
      title: menu.name,
      ...menu,
      children: [],
    });
  });

  // 构建树形结构
  menus.forEach((menu) => {
    const node = menuMap.get(menu.id);
    if (menu.parentId === 0) {
      // 根节点
      result.push(node);
    } else {
      // 将当前节点添加到父节点的 children 中
      const parentNode = menuMap.get(menu.parentId);
      if (parentNode) {
        parentNode.children.push(node);
      } else {
        // 如果找不到父节点，说明父节点可能被过滤掉了，此时将其作为根节点
        result.push(node);
      }
    }
  });

  // 清理空的 children 数组
  const cleanEmptyChildren = (nodes: any[]) => {
    nodes.forEach((node) => {
      if (node.children.length === 0) {
        delete node.children;
      } else {
        cleanEmptyChildren(node.children);
      }
    });
  };

  cleanEmptyChildren(result);
  return result;
};

function filterAsyncMenus(menus: SysMenuEntity[], parentId: number | null) {
  // 过滤掉禁用的菜单
  menus = menus.filter((menu) => menu.status !== 0);
  const result: any[] = [];
  const menuMap = new Map();

  // 先将所有菜单项放入 map 中
  menus.forEach((menu) => {
    menuMap.set(menu.id, {
      title: menu.name,
      ...menu,
      children: [],
    });
  });

  // 构建树形结构
  menus.forEach((menu) => {
    const node = menuMap.get(menu.id);
    if (menu.parentId === 0) {
      // 根节点
      result.push(node);
    } else {
      // 将当前节点添加到父节点的 children 中
      const parentNode = menuMap.get(menu.parentId);
      if (parentNode) {
        parentNode.children.push(node);
      } else {
        // 如果找不到父节点，说明父节点可能被过滤掉了，此时将其作为根节点
        result.push(node);
      }
    }
  });

  // 清理空的 children 数组
  const cleanEmptyChildren = (nodes: any[]) => {
    nodes.forEach((node) => {
      if (node.children.length === 0) {
        delete node.children;
      } else {
        cleanEmptyChildren(node.children);
      }
    });
  };

  cleanEmptyChildren(result);
  return result;
}

export function buildTree(menus: SysMenuEntity[]) {
  // 过滤掉禁用的菜单
  menus = menus.filter((menu) => menu.status !== 0);
  const result: any[] = [];
  const menuMap = new Map();

  // 先将所有菜单项放入 map 中
  menus.forEach((menu) => {
    menuMap.set(menu.id, {
      title: menu.name,
      key: menu.id,
      children: [],
    });
  });

  // 构建树形结构
  menus.forEach((menu) => {
    const node: any = menuMap.get(menu.id);
    if (menu.parentId === 0) {
      // 根节点
      result.push(node);
    } else {
      // 将当前节点添加到父节点的 children 中
      const parentNode = menuMap.get(menu.parentId);
      if (parentNode) {
        parentNode.children.push(node);
      }
    }
  });

  return result;
}

export function buildTreeList(menus: SysMenuEntity[]) {
  if (!menus?.length) return [];

  const menuMap = new Map();
  const result: any[] = [];

  // 先将所有菜单项放入 map 中
  menus.forEach((menu) => {
    menuMap.set(menu.id, {
      ...menu,
      children: [],
    });
  });

  // 构建树形结构
  menus.forEach((menu) => {
    const node = menuMap.get(menu.id);
    if (!menu.parentId || menu.parentId === 0) {
      result.push(node);
    } else {
      const parentNode = menuMap.get(menu.parentId);
      if (parentNode) {
        parentNode.children.push(node);
      } else {
        // 如果找不到父节点，将其作为根节点
        result.push(node);
      }
    }
  });

  // 清理空的 children 数组
  const cleanEmptyChildren = (nodes: any[]) => {
    nodes.forEach((node) => {
      if (node.children.length === 0) {
        delete node.children;
      } else {
        cleanEmptyChildren(node.children);
      }
    });
  };

  cleanEmptyChildren(result);
  return result;
}
