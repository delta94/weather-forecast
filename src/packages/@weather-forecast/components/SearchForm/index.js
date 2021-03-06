import React from 'react';
import { Select, Spin, Typography } from 'antd';
import { Root } from './styled';
import container from './container';

const SearchForm = (props) => {
  const {
    locationsError,
    locationsLoading,
    weatherDaysLoading,
    locations,
    handleSearch,
    handleChange,
  } = props;

  let notFoundContent = null;

  if (locationsLoading) {
    notFoundContent = (
      <div style={{ textAlign: 'center' }}>
        <Spin />
      </div>
    );
  } else if (locations && !locations.length) {
    notFoundContent = `Not found. (Please try with another name)`;
  } else if (locationsError) {
    notFoundContent = (
      <Typography.Text type={'danger'}>Error: {locationsError}</Typography.Text>
    );
  }

  return (
    <Root>
      <Select
        showSearch
        allowClear
        loading={weatherDaysLoading}
        placeholder="Enter a location name. Example: San Francisco"
        notFoundContent={notFoundContent}
        filterOption={false}
        onSearch={handleSearch}
        onChange={handleChange}
      >
        {(locations || []).map((item) => (
          <Select.Option key={item.id} value={item.id}>
            {item.title}
          </Select.Option>
        ))}
      </Select>
    </Root>
  );
};

export default container(SearchForm);
