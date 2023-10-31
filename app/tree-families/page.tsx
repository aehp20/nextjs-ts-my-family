'use client'

import ReactFamilyTree from 'react-family-tree'
import { memo, useCallback } from 'react'
import type { CSSProperties } from 'react'
import styled from 'styled-components'

const data = [
  {
    id: 'Aron',
    label: 'Aron Elias Herrera Ponte',
    gender: 'male',
    parents: [
      {
        id: 'Herlinda',
        type: 'blood',
      },
    ],
    siblings: [],
    spouses: [
      {
        id: 'Sandra',
        type: 'blood',
      },
    ],
    children: [
      {
        id: 'Germain',
        type: 'blood',
      },
    ],
  },
  {
    id: 'Sandra',
    label: 'Sandra Cristina De Oliveira Rocha',
    gender: 'female',
    parents: [],
    siblings: [],
    spouses: [],
    children: [
      {
        id: 'Germain',
        type: 'blood',
      },
    ],
  },
  {
    id: 'Germain',
    label: 'Germain David',
    gender: 'male',
    parents: [],
    siblings: [],
    spouses: [],
    children: [],
  },
  {
    id: 'Herlinda',
    label: 'Herliquita',
    gender: 'female',
    parents: [],
    siblings: [],
    spouses: [],
    children: [
      {
        id: 'Aron',
        type: 'blood',
      },
      {
        id: 'Lita',
        type: 'blood',
      },
    ],
  },
  {
    id: 'Lita',
    label: 'Lita Herlinda Herrera Ponte',
    gender: 'female',
    parents: [
      {
        id: 'Herlinda',
        type: 'blood',
      },
    ],
    siblings: [],
    spouses: [],
    children: [],
  },
]

export const NODE_WIDTH = 80
export const NODE_HEIGHT = 80

export declare const enum Gender {
  male = 'male',
  female = 'female',
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
  isHover,
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
      <DivInner onClick={clickHandler}>
        <DivId>{node.label}</DivId>
      </DivInner>
      {/* {node.hasSubTree && (
        <div
          className={classNames(css.sub, css[node.gender])}
          onClick={clickSubHandler}
        />
      )} */}
    </DivRoot>
  )
})

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
`

const DivId = styled.div`
  font-size: 10px;
  line-height: 1;
  opacity: 0.5;
`

function TreeFamilies() {
  return (
    <>
      <div>TreeFamilies</div>
      <ReactFamilyTree
        nodes={data}
        rootId={data[0].id}
        width={NODE_WIDTH}
        height={NODE_HEIGHT}
        // className={css.tree}
        renderNode={(node: Readonly<ExtNode>) => (
          <FamilyNode
            key={node.id}
            node={node}
            // isRoot={node.id === rootId}
            // isHover={node.id === hoverId}
            // onClick={setSelectId}
            // onSubClick={setRootId}
            style={getNodeStyle(node)}
          />
        )}
      />
    </>
  )
}

export default TreeFamilies
