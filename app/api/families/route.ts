import { NextRequest, NextResponse } from 'next/server'

import { prisma } from '../../libs/prisma'

export async function GET(request: NextRequest) {
  const page = Number(request.nextUrl.searchParams.get('page'))
  const limit = Number(request.nextUrl.searchParams.get('limit'))
  const count = await prisma.family.aggregate({
    _count: {
      family_id: true,
    },
  })
  const families = await prisma.family.findMany({
    skip: (page - 1) * limit,
    take: limit,
    select: {
      family_id: true,
      father: {
        select: {
          person_id: true,
          first_name: true,
          father_last_name: true,
          mother_last_name: true,
        },
      },
      mother: {
        select: {
          person_id: true,
          first_name: true,
          father_last_name: true,
          mother_last_name: true,
        },
      },
      children: {
        select: {
          person_id: true,
          first_name: true,
          father_last_name: true,
          mother_last_name: true,
        },
      },
    },
  })
  return NextResponse.json({ items: families, total: count._count.family_id })
}

export async function POST(request: NextRequest) {
  const { father, mother, children } = await request.json()
  const newFamily = await prisma.family.create({
    data: {
      father_id: father,
      mother_id: mother,
    },
  })
  if (children && children.length > 0) {
    children.forEach(async (person_id: string) => {
      await prisma.person.update({
        where: { person_id },
        data: {
          family_id: newFamily.family_id,
        },
      })
    })
  }
  return NextResponse.json(newFamily)
}

export async function DELETE(request: NextRequest) {
  try {
    const ids = request.nextUrl.searchParams.getAll('id')
    const result = await prisma.family.deleteMany({
      where: { family_id: { in: ids } },
    })
    return NextResponse.json(result)
  } catch (error: unknown) {
    if (error instanceof Error) return NextResponse.json(error.message)
    return NextResponse.json(String(error))
  }
}
