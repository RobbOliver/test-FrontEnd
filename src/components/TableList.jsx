import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { Card, Col, Row, Statistic, Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { Sparklines, SparklinesLine } from "react-sparklines";

import api from "../services/api";

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const columns = [
  {
    title: "Rank",
    dataIndex: "rank",
    key: "rank",
    render: (rank) => `#${rank}`,
  },
  {
    title: "Icon",
    dataIndex: "iconUrl",
    key: "iconUrl",
    render: (iconUrl) => <img width={32} src={iconUrl} />,
  },
  {
    title: "Name",
    key: "name",
    render: ({ name, coinrankingUrl }) => (
      <a href={coinrankingUrl} target="_blank">
        {name}
      </a>
    ),
  },
  {
    title: "Symbol",
    dataIndex: "symbol",
    key: "symbol",
  },
  {
    title: "Price to USD",
    key: "price",
    render: ({ price, color }) => (
      <Tag color={color}>{priceFormatter.format(price)}</Tag>
    ),
  },
  {
    title: "24H",
    key: "change",
    render: ({ change, sparkline, color }) => (
      <>
        {change > 0 ? (
          <Tag icon={<ArrowUpOutlined />} color="success">
            {change}%
          </Tag>
        ) : (
          <Tag icon={<ArrowDownOutlined />} color="error">
            {change}%
          </Tag>
        )}
        <Sparklines
          data={sparkline}
          limit={5}
          width={100}
          height={40}
          margin={5}
        >
          <SparklinesLine color={color} />
        </Sparklines>
      </>
    ),
  },

];

const TableList = () => {
    
  const [coins, setCoins] = useState([]);

  const [firstCoin, setFirstCoin] = useState({});

  const [stats, setStats] = useState({});

  const [searchParams, setSearchParams] = useState({
    limit: 10,
  });

  const [loading, setLoading] = useState(false);

  const getCoins = async (params) => {
    setLoading(true);

    try {
      const response = await api.get(`/coins`, { params: params });

      setCoins(response.data.data.coins);
      setStats(response.data.data.stats);
    } catch (error) {
      console.error("ops! ocorreu um erro" + error);
    }

    setLoading(false);
  };

  const getFirstCoin = async () => {
    setLoading(true);

    try {
      const response = await api.get(`/coins`, { params: { limit: 1 } });
      setFirstCoin(response.data.data.coins[0]);
    } catch (error) {
      console.error("ops! ocorreu um erro" + error);
    }

    setLoading(false);
  };

  const handleTableChange = (pagination, filters, sorter) => {
    if (pagination) {
      const offset = pagination.pageSize * pagination.current - pagination.pageSize;
      
      const limit = pagination.pageSize;

      setSearchParams({
        ...searchParams,
        limit,
        offset,
      });
    }
  };

  useEffect(() => {
    getFirstCoin();
  }, []);

  useEffect(() => {
    getCoins(searchParams);
  }, [searchParams]);

  return (
    <Row gutter={16}>

      <Col span={12}>
        <Card style={{ padding: "30px", background: "#ececec" }}>
          <Statistic title="Total Coins" value={stats?.totalCoins} />
        </Card>
      </Col>

      <Col span={12}>
        <Card style={{ padding: "30px", background: "#ececec" }}>
          <Statistic
            title={`#${firstCoin?.rank} coin`}
            value={firstCoin?.name}
          />
        </Card>
      </Col>

      <Col span={24}>
        <Table
          rowKey={({ uuid }) => uuid}
          columns={columns}
          dataSource={coins}
          loading={loading}
          pagination={{
            total: stats.total
          }}
          onChange={handleTableChange}
        />
      </Col>
    </Row>
  );
};

export default TableList;
