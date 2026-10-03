"use client"

import { searchCategoriesEndpoint } from '@/constants/api';
import { isRequestError } from '@/lib/error';
import { CategoryData } from '@/types/category/category'
import { Select } from 'antd'
import { useEffect, useState } from 'react'
import { Spinner } from '../ui/spinner';
import { debounce } from 'lodash';

interface Params {
  selected: CategoryData[],
  onChange: (category: CategoryData[]) => void,
}

function CategoriesSelect({ selected, onChange }: Params) {
  const [options, setOptions] = useState<CategoryData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchCategories = async (searchToken: string) => {
    setOptions([]);
    setIsLoading(true);
    const base = "http://text";
    const url = new URL(searchCategoriesEndpoint, base);
    url.searchParams.append("searchToken", searchToken);
    const requestUrl = url.toString().slice(base.length);
    const res = await fetch(requestUrl, {
      method: "GET",
    });
    if (!isRequestError(res)) {
      const categories: CategoryData[] = await res.json();
      setOptions(categories);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    searchCategories('');
  }, []);

  return (
    <Select
      mode="multiple"
      style={{ width: '100%' }}
      placeholder="Select categories"
      loading={isLoading}
      showSearch={{
        autoClearSearchValue: false,
        filterOption: false,
        onSearch: debounce(searchCategories, 300),
      }}
      notFoundContent={
        isLoading ?
          <div className="w-full h-full flex justify-center items-center">
            <Spinner className="size-8" />
          </div> : <span>Not found</span>
      }
      allowClear
      onChange={(value) => {
        onChange(value);
      }}
      fieldNames={{
        label: "name",
        value: "id",
      }}
      options={options}
      value={selected}
      optionRender={(option) => (
        <div key={option.value}>{option.label}</div>
      )}
    />
  )
}

export default CategoriesSelect