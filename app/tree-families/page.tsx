'use client'

import ReactFamilyTree from 'react-family-tree'
import { memo, useCallback, useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import styled, { css } from 'styled-components'

import { fetchFamilies } from '@/app/families/utils'
import type { Family } from '@/app/families/types'
import type { Person } from '@/app/people/types'
import type { NodePerson } from '@/app/tree-families/types'

export const NODE_WIDTH = 100
export const NODE_HEIGHT = 100

export declare const enum Gender {
  male = 'man',
  woman = 'woman',
  other = 'other',
}
export declare const enum RelType {
  blood = 'blood',
  married = 'married',
  divorced = 'divorced',
  adopted = 'adopted',
  half = 'half',
}
export declare type Relation = Readonly<{
  id: string
  type: RelType
}>
export declare type Node = Readonly<{
  id: string
  label: string
  gender: Gender
  parents: readonly Relation[]
  children: readonly Relation[]
  siblings: readonly Relation[]
  spouses: readonly Relation[]
  placeholder?: boolean
}>
export declare type ExtNode = Node &
  Readonly<{
    top: number
    left: number
    hasSubTree: boolean
  }>

export function getLabel(person: Person): string {
  return `${person.first_name} ${person.father_last_name ?? ''} ${
    person.mother_last_name ?? ''
  }`
}

export function getNodeStyle({ left, top }: Readonly<ExtNode>): CSSProperties {
  return {
    width: NODE_WIDTH,
    height: NODE_HEIGHT,
    transform: `translate(${left * (NODE_WIDTH / 2)}px, ${
      top * (NODE_HEIGHT / 2)
    }px)`,
  }
}

interface FamilyNodeProps {
  node: ExtNode
  isRoot: boolean
  isHover?: boolean
  onClick: (id: string) => void
  onSubClick: (id: string) => void
  style?: React.CSSProperties
}

export const FamilyNode = memo(function FamilyNode({
  node,
  isRoot,
  onClick,
  onSubClick,
  style,
}: FamilyNodeProps) {
  const clickHandler = useCallback(() => onClick(node.id), [node.id, onClick])
  const clickSubHandler = useCallback(
    () => onSubClick(node.id),
    [node.id, onSubClick]
  )

  return (
    <DivRoot style={style}>
      <DivInner $isRoot={isRoot} onClick={clickHandler}>
        <DivId>{node.label}</DivId>
      </DivInner>
      {node.hasSubTree && <DivSub onClick={clickSubHandler} />}
    </DivRoot>
  )
})

const DivSub = styled.div`
  position: absolute;
  top: 6px;
  right: 18px;
  width: 18px;
  height: 10px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 4px 0;
  background: #3a8fba;
  cursor: pointer;
`

const DivRoot = styled.div`
  position: absolute;
  display: flex;
  padding: 10px;
`

const DivInner = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  background: #a4ecff;
  padding: 4px;

  ${(props: { $isRoot: boolean }) =>
    props.$isRoot &&
    css`
      border-color: rgba(0, 0, 0, 0.8);
    `}

  &:hover {
    border-color: rgba(0, 0, 0, 0.8);
  }
`

const DivId = styled.div`
  font-size: 14px;
  line-height: 1;
  opacity: 0.7;
`

function TreeFamilies() {
  const [nodePeople, setNodePeople] = useState<NodePerson[]>([])
  const [isFetching, setIsFetching] = useState(false)
  const [rootId, setRootId] = useState<string>()

  const fetchData = useCallback(
    (currentPage: number, currentPageSize: number) => {
      setIsFetching(true)
      fetchFamilies(currentPage, currentPageSize)
        .then(({ items: families }) => {
          const copyNodePeople: { [key: string]: NodePerson } = {}
          families.forEach((family: Family) => {
            const { father, mother, children } = family
            copyNodePeople[father.person_id] = {
              id: father.person_id,
              label: getLabel(father),
              parents: [...(copyNodePeople[father.person_id]?.parents || [])],
              siblings: [...(copyNodePeople[father.person_id]?.siblings || [])],
              children: [
                ...(copyNodePeople[father.person_id]?.children || []),
                ...children.map((child: Person) => ({
                  id: child.person_id,
                  type: 'blood',
                })),
              ],
              spouses: [
                ...(copyNodePeople[father.person_id]?.spouses || []),
                {
                  id: mother.person_id,
                  type: 'blood',
                },
              ],
            }
            copyNodePeople[mother.person_id] = {
              id: mother.person_id,
              label: getLabel(mother),
              parents: [...(copyNodePeople[mother.person_id]?.parents || [])],
              siblings: [...(copyNodePeople[mother.person_id]?.siblings || [])],
              children: [
                ...(copyNodePeople[mother.person_id]?.children || []),
                ...children.map((child: Person) => ({
                  id: child.person_id,
                  type: 'blood',
                })),
              ],
              spouses: [
                ...(copyNodePeople[mother.person_id]?.spouses || []),
                {
                  id: father.person_id,
                  type: 'blood',
                },
              ],
            }

            children.forEach((child: Person) => {
              copyNodePeople[child.person_id] = {
                id: child.person_id,
                label: getLabel(child),
                parents: [
                  ...(copyNodePeople[child.person_id]?.parents || []),
                  {
                    id: father.person_id,
                    type: 'blood',
                  },
                  {
                    id: mother.person_id,
                    type: 'blood',
                  },
                ],
                siblings: [
                  ...(copyNodePeople[child.person_id]?.siblings || []),
                ],
                children: [
                  ...(copyNodePeople[child.person_id]?.children || []),
                ],
                spouses: [...(copyNodePeople[child.person_id]?.spouses || [])],
              }
            })
          })
          const nodes = Object.values(copyNodePeople)
          setNodePeople(nodes)
          setRootId(nodes[0].id)
        })
        .finally(() => setIsFetching(false))
    },
    []
  )

  useEffect(() => {
    fetchData(1, 500)
  }, [])

  return (
    <>
      <div>Family Tree</div>
      {!isFetching && nodePeople.length > 0 ? (
        <ReactFamilyTree
          nodes={nodePeople}
          rootId={rootId}
          width={NODE_WIDTH}
          height={NODE_HEIGHT}
          renderNode={(node: Readonly<ExtNode>) => (
            <FamilyNode
              key={node.id}
              node={node}
              isRoot={node.id === rootId}
              onClick={() => console.log('use setSelectId to display details')}
              onSubClick={setRootId}
              style={getNodeStyle(node)}
            />
          )}
        />
      ) : null}
    </>
  )
}

export default TreeFamilies
