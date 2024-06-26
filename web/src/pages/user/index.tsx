import { Button, Dropdown, Input, Notification, Switch, Table, Tag, Tooltip } from "@douyinfe/semi-ui";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { enable, getUsers, Remove } from "../../services/UserService";
import { renderQuota } from "../../uitls/render";
import { IconClose, IconTick } from "@douyinfe/semi-icons";
import CreateUser from "./features/CreateUser";

const Header = styled.header`

`
export default function Channel() {
    const [data, setData] = useState<any[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [createVisible, setCreateVisible] = useState<boolean>(false);
    const [input, setInput] = useState({
        page: 1,
        pageSize: 10,
        keyword: ''
    });

    const columns = [
        {
            title: '名称',
            dataIndex: 'userName',
            key: 'userName'
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            key: 'email'
        },
        {
            title: '角色',
            dataIndex: 'role',
            key: 'role'
        },
        {
            title: '状态',
            dataIndex: 'isDisabled',
            key: 'isDisabled',
            render: (value: any, item: any) => {
                return <Switch size='large'
                    defaultChecked={!value} onChange={() => {
                        enable(item.id)
                            .then((item) => {
                                item.success ? Notification.success({
                                    title: '操作成功',
                                }) : Notification.error({
                                    title: '操作失败',
                                });
                                loadData();
                            }), () => Notification.error({
                                title: '操作失败',
                            });
                    }} checkedText={<IconTick />} uncheckedText={<IconClose />} style={{
                        width: '50px',
                    }} aria-label="a switch for semi demo"></Switch>
            }
        },
        {
            title: '统计',
            dataIndex: 'statics',
            key: 'statics',
            render: (_value: any, item: any) => {
                return <>
                    <Tooltip content="消耗的token">
                        <Tag size='large' type='ghost' color='blue' style={{
                            marginRight: '0.5rem'
                        }}>{item.consumeToken}</Tag>
                    </Tooltip>
                    <Tooltip content="请求总数">
                        <Tag size='large' type='ghost' color='blue' style={{
                            marginRight: '0.5rem'
                        }}>{item.requestCount}</Tag>
                    </Tooltip>
                    <Tooltip content="剩余额度">
                        <Tag size='large' type='ghost' color='blue' style={{
                            marginRight: '0.5rem'
                        }}>{renderQuota(item.residualCredit, 6)}</Tag>
                    </Tooltip>
                </>;
            }
        },
        {
            title: '创建时间',
            dataIndex: 'createdAt',
            key: 'createdAt'
        },
        {
            title: '操作',
            key: 'action',
            render: (_text: any, item: any) => (
                <Dropdown
                    render={
                        <Dropdown.Menu>
                            <Dropdown.Item style={{
                                color: 'red',
                            }} onClick={() => removeUser(item.id)}>删除</Dropdown.Item>
                        </Dropdown.Menu>
                    }
                >
                    <Button theme='borderless'>操作</Button>
                </Dropdown>
            ),
        }
    ]

    function removeUser(id: string) {
        Remove(id).then((res) => {
            if (res.success) {
                loadData();
            } else {
                Notification.error({
                    title: '删除失败',
                    content: res.message
                });
            }
        }
        )
    }

    function loadData() {
        setLoading(true);
        getUsers(input.page, input.pageSize, input.keyword)
            .then((res) => {
                if (res.success) {
                    setData(res.data.items);
                    setTotal(res.data.total);
                }
            })
            .finally(() => setLoading(false));

        setLoading(false);
    }

    useEffect(() => {
        loadData();
    }, [input]);

    return (
        <div style={{
            margin: '20px'
        }}>
            <Header>
                <span style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                }}>
                    用户管理
                </span>

                <Dropdown
                    render={
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => setCreateVisible(true)}>创建用户</Dropdown.Item>
                        </Dropdown.Menu>
                    }
                >
                    <Button style={{
                        float: 'right',
                    }}>操作</Button>
                </Dropdown>
                <Button style={{
                    marginRight: '0.5rem',
                    float: 'right',
                }}>搜索</Button>
                <Input value={input.keyword} onChange={(v) => {
                    setInput({
                        ...input,
                        keyword: v,
                    });
                }} style={{
                    width: '150px',
                    float: 'right',
                    marginRight: '1rem',
                }} placeholder='搜索关键字'></Input>
            </Header>
            <Table loading={loading} style={{
                marginTop: '1rem',
            }} columns={columns} dataSource={data} pagination={{
                total: total,
                pageSize: input.pageSize,
                currentPage: input.page,
                onChange: (page, pageSize) => {
                    setInput({
                        ...input,
                        page,
                        pageSize,
                    });
                },

            }} />
            <CreateUser onSuccess={() => {
                setCreateVisible(false);
                loadData();
            }} visible={createVisible} onCancel={() => {
                setCreateVisible(false);
            }
            } />

        </div>
    )
}