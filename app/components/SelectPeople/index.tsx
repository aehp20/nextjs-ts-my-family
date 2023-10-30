'use client'

import { useState, useMemo, useRef } from 'react'
import { Form, Select, Spin, Modal } from 'antd'
import { FormInstance } from 'antd/es/form'

import debounce from 'lodash/debounce'

import FormPerson from '@/app/people/add/FormPerson'
import type { Person } from '@/app/people/types'

async function fetchPeople(searchValue: string) {
  const response = await fetch(`/api/people/search?value=${searchValue}`)
  const people = await response.json()

  return people
}

const getPersonLabel = (person: Person) =>
  `${person.first_name} ${person.father_last_name} ${person.mother_last_name}`

interface OptionProps {
  value: string
  label: string
}

function SelectPeople({
  name,
  label,
  required = false,
  form,
}: {
  name: string
  label: string
  required?: boolean
  form: FormInstance
}) {
  const debounceTimeout = 500
  const NEW_ITEM = 'NEW_ITEM'

  const [fetching, setFetching] = useState(false)
  const [options, setOptions] = useState<OptionProps[]>([])
  const fetchRef = useRef(0)
  const [value, setValue] = useState<string>()
  const [isModalOpen, setIsModalOpen] = useState(false)

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
                label: getPersonLabel(person),
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
      form.setFieldsValue({ [name]: value })
    } else {
      form.setFieldsValue({ [name]: '' })
      showModal()
    }
  }

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const handleOnSuccess = (person: Person) => {
    setOptions([
      {
        value: person.person_id,
        label: getPersonLabel(person),
      },
      ...options,
    ])

    form.setFieldsValue({ [name]: person.person_id })

    handleOk()
  }

  const renderOptions = options.map(
    (option: { value: string; label: string }) => (
      <Select.Option key={option.value} value={option.value}>
        {option.label}
      </Select.Option>
    )
  )

  return (
    <>
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
      {isModalOpen && (
        <Modal
          title="Add a new person"
          open={isModalOpen}
          onCancel={handleCancel}
          footer={null}
        >
          <FormPerson onSuccess={handleOnSuccess} />
        </Modal>
      )}
    </>
  )
}

export default SelectPeople
