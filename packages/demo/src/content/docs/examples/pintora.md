---
title: pintora
---

## rehype-plugin

```pintora
activityDiagram
  title: Activity Diagram Simple Action
  :Action 1;
  :Action 2;
```

```pintora
classDiagram
  class Fruit {
    <<interface>>
    float sweetness
    -float age

    float getAge()
  }

  class Apple {
    float softness
    {static} Apple fromString(str)
  }

  %% There are so many kind of fruits
  Fruit <|-- Apple
  Fruit <|-- Kiwi
  Fruit <|-- Banana

  Fruit "many" --* "1" Bag: packed into
```

```pintora
componentDiagram
  title: Component Diagram Components and Interfaces

  component comp1
  [comp2]
  [component 3] as comp3
  component comp4 [
    This component has
    long description
  ]

  interface "I1"
  () "I2"
  () "I3" as interf3
```

```pintora
dotDiagram
  %% pintora style comment
  %% here we declare a directed graph
  digraph G {
    // specify graph attributes
    bgcolor="white"

    // specify common node attributes
    node [color="#111",bgcolor=orange]

    subgraph S1 {
      // subgraph will inherit parent attributes
      label="Sub";
      a1 [fontcolor="purple",margint=10];
    }

    /* usually we put edges at the last */
    a1 -> b1;
    n1 -> end [color="blue"];
    a2 -> end;
  }
```

```pintora
erDiagram
  title: Entity Relationship Example
  CUSTOMER {
    int id PK
    int address FK
  }
  CUSTOMER ||--o{ ORDER : places
  ORDER ||--|{ LINE-ITEM : contains
  CUSTOMER }|..|{ DELIVERY-ADDRESS : uses
  ORDER {
    int orderNumber PK
    int customer FK "customer id"
    string deliveryAddress
  }
```

```pintora
gantt
  title Gantt example

  dateFormat YYYY-MM-DDTHH
  axisFormat MM-DD
  axisInterval 1w

  section Develop Prototype
  "Write grammar"       : t-a, 2022-2-17, 2022-2-23
  "Write artist"        : t-b, 2022-2-23, 2022-3-15

  %% the day I started typing the docs
  markDate 2022-3-15T20

  section Documentation
  "Write docs"          : t-c, 2022-3-15, 5d

  section Optimize
  "Add axisInterval" : 2022-3-28, 2022-4-04

  section Release
  "Release" : milestone, 2022-4-06, 0d
```

```pintora
mindmap
title: Mind Map levels
* UML Diagrams
** Behavior Diagrams
*** Sequence Diagram
*** State Diagram
```

```pintora
sequenceDiagram
  title: Sequence Diagram Example
  autonumber
  participant [<actor> User]
  User->>Pintora: Draw me a sequence diagram（with DSL）
  activate Pintora
  Pintora->>Pintora: Parse DSL, draw diagram
  alt DSL is correct
    Pintora->>User: Return the drawn diagram
  else DSL is incorrect
    Pintora->>User: Return error message
  end
  deactivate Pintora
  @start_note left of Pintora
  Different output formats according to render targets
  1. In browser side. output SVG or Canvas
  2. In Node.js side. output PNG file
  @end_note
```
