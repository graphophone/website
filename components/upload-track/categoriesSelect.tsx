"use client"

import { searchCategoriesEndpoint } from '@/constants/api';
import { isRequestError } from '@/lib/error';
import { CategoryData } from '@/types/category/category'
import { Select } from 'antd'
import { useEffect, useState } from 'react'
import { Spinner } from '../ui/spinner';
import { debounce } from 'lodash';

interface Props {
  selected: CategoryData[],
  invalid: boolean,
  onChange: (category: CategoryData[]) => void,
  onBlur: () => void,
}

function CategoriesSelect({ selected, invalid, onBlur, onChange }: Props) {
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
      labelInValue
      mode="multiple"
      onBlur={onBlur}
      status={invalid ? "error" : undefined}
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
      onChange={value => {
        const categories = value.map(v => ({
          id: v.value,
          name: v.label,
        }));
        onChange(categories);
      }}
      fieldNames={{
        label: "name",
        value: "id",
      }}
      options={options}
      value={selected.map(c => ({ label: c.name, value: c.id }))}
      optionRender={(option) => (
        <div key={option.value}>{option.label}</div>
      )}
    />
  )
}

export default CategoriesSelect