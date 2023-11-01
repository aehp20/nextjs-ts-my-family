interface NodePersonRelation {
  id: string
  type: string
}

export interface NodePerson {
  id: string
  label: string
  parents: NodePersonRelation[]
  siblings: NodePersonRelation[]
  spouses: NodePersonRelation[]
  children: NodePersonRelation[]
}
