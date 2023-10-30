'use client'

import { Button, Form, message, Space } from 'antd'
import { useRouter } from 'next/navigation'

import SelectPeople from '@/app/components/SelectPeople'
import type { FamilyFormProps } from '@/app/families/types'

function FormFamily({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [form] = Form.useForm<FamilyFormProps>()

  const onFinish = async (values: {}) => {
    console.log('onfinish', values)
    // let data
    // if (values.birthday) {
    //   data = { ...values, birthday: dayjs(values.birthday).toISOString() }
    // } else {
    //   data = values
    // }
    // const response = await fetch(
    //   `/api/people${params?.id ? `/${params.id}` : ''}`,
    //   {
    //     method: params?.id ? 'PUT' : 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(data),
    //   }
    // )
    // const person = await response.json()
    // if (person) {
    //   message.success('Submit success!')
    //   router.push('/people')
    // }
  }

  const onFinishFailed = () => {
    message.error('Submit failed!')
  }

  return (
    <div>
      <div>{params?.id ? 'Edit' : 'Add'} People</div>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        // initialValues={{ gender: 'm' }}
      >
        <SelectPeople name="father" label="Father" required form={form} />
        <SelectPeople name="mother" label="Mother" required form={form} />
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  )
}

export default FormFamily
