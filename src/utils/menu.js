class MenuTool {

    sideItem(key, label, icon, children, enable) {
        return {
            key,
            label,
            icon,
            children,
            enable,
        }
    }

    sideItemsFromAppComponents(values, prefix = "") {
        return values.map((value) => {
            let key = [prefix, value.path].filter(v => v).join("/");
            let item = this.sideItem(key, value.label, value.icon, undefined, value.enable);
            if (value.sideIgnore) {
                return undefined;
            }
            if (value.children !== undefined) {
                if (value.childrenIgnore) {
                    item.children = undefined
                } else {
                    item.children = this.sideItemsFromAppComponents(value.children, key)
                }
            }
            return item
        });
    }

    appComponentsMap(values, prefix = "") {
        let resp = {};
        values.forEach(value => {
            let key = [prefix, value.path].filter(v => v).join("/");
            resp[key] = value
            if (value.children !== undefined) {
                resp = {
                    ...resp,
                    ...this.appComponentsMap(value.children, key)
                }
            }
        });
        return resp;
    }

    sideItemsFilterByAuthority(values, permissions = []) {
        let resp = [];
        values.forEach(value => {
            if (value === undefined) {
                return
            }
            if (value.children !== undefined) {
                const children = this.sideItemsFilterByAuthority(value.children, permissions)
                if (children.length > 0) {
                    resp.push({...value, children: children});
                    return
                }
            }
            if (permissions.indexOf(value.key) !== -1) {
                resp.push({...value});
            }
        })
        return resp
    }

    treeItemFromAppComponents(values, prefix = "") {
        let resp = [];
        for (let value of values) {
            let key = [prefix, value.path].filter(v => v).join("/");
            let item = {
                title: value.label,
                key: key,
                children: undefined,
            }
            if (key === "system") {
                resp.push({
                    ...item,
                    disabled: true,
                })
                continue
            }
            if (value.sideIgnore === true) {
                continue
            }
            if (value.children !== undefined) {
                if (value.childrenIgnore) {
                    item.children = undefined
                } else {
                    item.children = this.treeItemFromAppComponents(value.children, key)
                }
            }
            resp.push(item);
        }
        return resp
    }
}

export default new MenuTool();
