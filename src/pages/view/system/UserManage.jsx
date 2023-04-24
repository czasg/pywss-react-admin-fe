import React, {useEffect, useState} from "react";
import TableSearch from "../../../components/antd/TableSearch";
import {Divider, Tag, Space, Table, message, Button, Switch} from "antd";
import UserAPI from "../../../api/system/user";

const searchFields = [
    {
        type: 'text',
        name: 'username',
        label: '英文名',
        rules: [
            {
                required: false,
            }
        ],
        placeholder: '请输入英文名',
    },
    {
        type: 'text',
        name: 'alias',
        label: '中文名',
        rules: [
            {
                required: false,
            }
        ],
        placeholder: '请输入中文名',
    },
];

// const columns = [
//     {
//         title: 'ID',
//         dataIndex: 'id',
//     },
//     {
//         title: '英文名',
//         dataIndex: 'username',
//     },
//     {
//         title: '中文名',
//         dataIndex: 'alias',
//     },
//     {
//         title: '角色',
//         dataIndex: 'roles',
//         render: (_, record) => {
//             return <Space wrap>
//                 {
//                     record.roles.map(role => {
//                         return <Tag color="blue">{role.alias}/{role.name}</Tag>
//                     })
//                 }
//             </Space>
//         }
//     },
//     {
//         title: '创建时间',
//         dataIndex: 'created_at',
//     },
//     {
//         title: '更新时间',
//         dataIndex: 'updated_at',
//     },
//     {
//         title: '创建者',
//         dataIndex: 'created_by',
//     },
//     {
//         title: '允许登录',
//         dataIndex: 'enable',
//         render: (_, record) => (
//             <Space size="middle">
//                 <Switch
//                     checked={record.enable}
//                 />
//             </Space>
//         ),
//     },
// ].map((item, idx) => {
//     return {
//         ...item,
//         key: idx,
//         align: 'center',
//     }
// });

export default function UserManage() {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [pageInfo, setPageInfo] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const [query, setQuery] = useState({});
    const pageSize = pageInfo.pageSize;
    const pageNum = pageInfo.current - 1;
    const get_users = () => {
        setLoading(true);
        UserAPI.get_users({...query, pageSize, pageNum}).then(data => data.data).then(data => {
            setLoading(false);
            if (data.code !== 0) {
                message.open({
                    type: 'error',
                    content: `获取用户列表异常：${data.message}`,
                    duration: 2,
                });
                return
            }
            const users = data.data.data.map(user => {
                return {
                    ...user, key: user.id,
                }
            });
            setUsers(users);
            setPageInfo({
                current: pageInfo.current,
                pageSize: pageInfo.pageSize,
                total: data.data.total,
            })
        }).catch((e) => {
            setLoading(false);
            message.open({
                type: 'error',
                content: `获取用户列表异常：${e.message}`,
                duration: 3,
            })
        })
    };
    useEffect(() => {
        get_users();
    }, [query, pageSize, pageNum]);
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: '英文名',
            dataIndex: 'username',
        },
        {
            title: '中文名',
            dataIndex: 'alias',
        },
        {
            title: '角色',
            dataIndex: 'roles',
            render: (_, record) => {
                return <Space wrap>
                    {
                        record.roles.map(role => {
                            return <Tag color="blue">{role.alias}/{role.name}</Tag>
                        })
                    }
                </Space>
            }
        },
        {
            title: '创建时间',
            dataIndex: 'created_at',
        },
        {
            title: '更新时间',
            dataIndex: 'updated_at',
        },
        {
            title: '创建者',
            dataIndex: 'created_by',
        },
        {
            title: '允许登录',
            dataIndex: 'enable',
            render: (_, record) => (
                <Space size="middle">
                    <Switch
                        checked={record.enable}
                        onClick={(v) => {
                            record.enable = !record.enable;
                            console.log(v);
                            UserAPI.update_user(record.id, {
                                type: 'enable',
                                enable: v,
                            }).then(() => {
                                get_users();
                            })
                        }}
                    />
                </Space>
            ),
        },
    ].map((item, idx) => {
        return {
            ...item,
            key: idx,
            align: 'center',
        }
    });
    return <>
        <div className="p-3">
            <TableSearch
                onFinish={(values) => setQuery(values)}
                fields={searchFields}
            />
            <Divider/>
            <Table
                loading={loading}
                columns={columns}
                dataSource={users}
                size="middle"
                pagination={{
                    ...pageInfo,
                    showSizeChanger: true,
                    showQuickJumper: false,
                    onChange: (page, pageSize) => {
                        setPageInfo({
                            current: page,
                            pageSize: pageSize,
                            total: pageInfo.total,
                        })
                    }
                }}
            />
        </div>
    </>
}
