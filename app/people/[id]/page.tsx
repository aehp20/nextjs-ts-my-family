'use client'

import FormPerson from '../add/page'

function EditPeople({ params }: { params: { id: string } }) {
  return <FormPerson params={params} />
}

export default EditPeople
