'use client'

import { useState, useMemo, useRef } from 'react'
import { Form, Select, Spin } from 'antd'
import debounce from 'lodash/debounce'

async function fetchPeople(searchValue: string) {
  const response = await fetch(`/api/people/search?value=${searchValue}`)
  const people = await response.json()

  return people
}

function SelectPeople({
  name,
  label,
  required = false,
}: {
  name: string
  label: string
  required?: boolean
}) {
  const debounceTimeout = 500
  const NEW_ITEM = 'NEW_ITEM'

  const [fetching, setFetching] = useState(false)
  const [options, setOptions] = useState([])
  const fetchRef = useRef(0)
  const [value, setValue] = useState<string>()

  const debounceFetcher = useMemo(() => {
    const loadOptions = (searchValue: string) => {
      fetchRef.current += 1
      const fetchId = fetchRef.current

      setOptions([])
      setFetching(true)

      fetchPeople(searchValue)
        .then((newOptions) => {
          if (fetchId !== fetchRef.current) {
            // for fetch callback order
            return
          }

          setOptions(
            newOptions.items.map(
              (person: {
                person_id: string
                first_name: string
                father_last_name: string
                mother_last_name: string
              }) => ({
                value: person.person_id,
                label: `${person.first_name} ${person.father_last_name} ${person.mother_last_name}`,
              })
            )
          )
        })
        .finally(() => setFetching(false))
    }

    return debounce(loadOptions, debounceTimeout)
  }, [debounceTimeout])

  const handleOnChange = (value: string) => {
    if (value !== NEW_ITEM) {
      setValue(value)
    } else {
      console.log('value', value)
      // this.setState({ showList1: true });
    }
  }

  const renderOptions = options.map(
    (option: { value: string; label: string }) => (
      <Select.Option key={option.value} value={option.value}>
        {option.label}
      </Select.Option>
    )
  )

  return (
    <Form.Item name={name} label={label} rules={[{ required }]}>
      <Select
        allowClear
        showSearch
        value={value}
        filterOption={false}
        onSearch={debounceFetcher}
        notFoundContent={fetching ? <Spin size="small" /> : null}
        onChange={handleOnChange}
      >
        {renderOptions}
        <Select.Option value={NEW_ITEM}>+ New Item</Select.Option>
      </Select>
    </Form.Item>
  )
}

export default SelectPeople
