---
title: d2 test
draft: true
---

## options

### sketch

```d2 sketch
direction: right
a -> b -> c -> d -> e
```

### layout

```d2 layout=elk
direction: right
a -> b -> c -> f
b -> d -> e -> f
```

### theme

```d2 theme=101
direction: right
a1 -> b -> c -> d -> e
```

### pad

```d2 pad=1
direction: right
a2 -> b -> c -> d -> e
```

### `strategy=inline`

```d2 strategy=inline
direction: right
a -> b -> c -> d -> e
```

## containers

```d2
server

# Declares a shape inside of another shape

server.process

# Can declare the container and child in same line

im a parent.im a child

# Since connections can also declare keys, this works too

apartment.Bedroom.Bathroom -> office.Spare Room.Bathroom: Portal
```

## Icons

```d2
vpc: VPC 1 10.1.0.0./16 {
  icon: https://icons.terrastruct.com/aws%2F_Group%20Icons%2FVirtual-private-cloud-VPC_light-bg.svg

  style: {
    stroke: green
    font-color: green
    fill: white
  }

  az: Availability Zone A {
    style: {
      stroke: blue
      font-color: blue
      stroke-dash: 3
      fill: white
    }

    firewall: Firewall Subnet A {
      icon: https://icons.terrastruct.com/aws%2FNetworking%20&%20Content%20Delivery%2FAmazon-Route-53_Hosted-Zone_light-bg.svg

      style: {
        stroke: purple
        font-color: purple
        fill: "#e1d5e7"
      }

      ec2: EC2 Instance {
        icon: https://icons.terrastruct.com/aws%2FCompute%2F_Instance%2FAmazon-EC2_C4-Instance_light-bg.svg
      }
    }
  }
}
```

## ER diagram

```d2
objects: {
  shape: sql_table

  id: int {constraint: primary_key}
  disk: int {constraint: foreign_key}

  json: jsonb {constraint: unique}
  last_updated: timestamp with time zone
}


disks: {
  shape: sql_table
  id: int {constraint: primary_key}
}

objects.disk -> disks.id
```

## UML class

```d2
DebitCard: Debit card {
  shape: class
  +cardno
  +ownedBy

  +access()
}

Bank: {
  shape: class
  +code
  +address

  +manages()
  +maintains()
}

ATMInfo: ATM info {
  shape: class
  +location
  +manageBy

  +identifies()
  +transactions()
}

Customer: {
  shape: class
  +name
  +address
  +dob

  +owns()
}

Account: {
  shape: class
  +type
  +owner
}

ATMTransaction: ATM Transaction {
  shape: class
  +transactionId
  +date
  +type

  +modifies()
}

CurrentAccount: Current account {
  shape: class
  +accountNo
  +balance

  +debit()
  +credit()
}

SavingAccount: Saving account {
  shape: class
  +accountNo
  +balance

  +debit()
  +credit()
}

WidthdrawlTransaction: Withdrawl transaction {
  shape: class
  +amount

  +Withdrawl()
}

QueryTransaction: Query transaction {
  shape: class
  +query
  +type

  +queryProcessing()
}

TransferTransaction: Transfer transaction {
  shape: class
  +account
  +accountNo
}

PinValidation: Pin validation transaction {
  shape: class
  +oldPin
  +newPin

  +pinChange()
}

DebitCard -- Bank: manages {
  source-arrowhead: 1..*
  target-arrowhead: 1
}

Bank -- ATMInfo: maintains {
  source-arrowhead: 1
  target-arrowhead: 1
}

Bank -- Customer: +has {
  source-arrowhead: 1
  target-arrowhead: 1
}

DebitCard -- Customer: +owns {
  source-arrowhead: 0..*
  target-arrowhead: 1..*
}

DebitCard -- Account: +provides access to {
  source-arrowhead: *
  target-arrowhead: 1..*
}

Customer -- Account: owns {
  source-arrowhead: 1..*
  target-arrowhead: 1..*
}

ATMInfo -- ATMTransaction: +identifies {
  source-arrowhead: 1
  target-arrowhead: *
}

ATMTransaction -> Account: modifies {
  source-arrowhead: *
  target-arrowhead: 1
}

CurrentAccount -> Account: {
  target-arrowhead.shape: triangle
  target-arrowhead.style.filled: false
}

SavingAccount -> Account: {
  target-arrowhead.shape: triangle
  target-arrowhead.style.filled: false
}

WidthdrawlTransaction -> ATMTransaction: {
  target-arrowhead.shape: triangle
  target-arrowhead.style.filled: false
}
QueryTransaction -> ATMTransaction: {
  target-arrowhead.shape: triangle
  target-arrowhead.style.filled: false
}
TransferTransaction -> ATMTransaction: {
  target-arrowhead.shape: triangle
  target-arrowhead.style.filled: false
}
PinValidation -> ATMTransaction: {
  target-arrowhead.shape: triangle
  target-arrowhead.style.filled: false
}
```

## Sequence Diagrams

```d2
shape: sequence_diagram
alice -> bob: What does it mean\nto be well-adjusted?
bob -> alice: The ability to play bridge or\ngolf as if they were games.
```

## Grid Diagrams

```d2
grid-rows: 4
grid-columns: 5
horizontal-gap: 20
vertical-gap: 5

*.class: [text; blue]

0,0: {
  label: "npm i -g\n@forge/cli"
  style: {
    fill: "#30304c"
    stroke: transparent
    font-color: white
    font: mono
    font-size: 10
    bold: false
  }
}
0,1: {
  label: "Set up an\nAtlassian site"
  class: [text; gray]
}
0,2.class: empty
0,3: {
  label: "View the hello\nworld app"
  class: [text; gray]
}
0,4: forge\ntunnel

1*.class: note
1*.label: ""
1,0
1,1
1,2
1,3
1,4

2,0: forge\nlogin
2,1: forge\ncreate
2,2: forge\ndeploy
2,3: forge\ninstall
2,4: {
  shape: diamond
  label: "Hot reload\nchanges?"
  class: [text; gray]
}

3*.class: note
3,0: Step 1
3,1: Step 2
3,2: Step 3
3,3: Step 4
3,4: ""

4,0: "" {
  grid-rows: 3
  grid-columns: 1
  grid-gap: 0

  class: []

  style: {
    fill: transparent
    stroke: transparent
  }

  *.style: {
    fill: transparent
    stroke: transparent
    font-color: "#30304c"
    font-size: 10
    bold: false
  }
  *.label.near: center-left
  *.height: 20
  a: ⬤ Forge CLI {
    style.font-color: "#0033cc"
  }

  b: ⬤ Required {
    style.font-color: "#30304c"
  }
  c: ⬤ Optional {
    style.font-color: "#cecece"
  }
}
4,1.class: empty
4,2.class: empty
4,3.class: empty
4,4: forge\ndeploy

0,0 -> 2,0 -> 2,1 -> 2,2 -> 2,3 -> 2,4: {
  class: arrow
}
2,1 -> 0,1: {
  class: arrow
  style.stroke: "#cecece"
}
2,3 -> 0,3: {
  class: arrow
  style.stroke: "#cecece"
}
2,4 -> 0,4: Yes {
  class: arrow
  style.font-size: 10
}
2,4 -> 4,4: No {
  class: arrow
  style.font-size: 10
}

classes: {
  text.style: {
    stroke: transparent
    font-color: white
    font: mono
    font-size: 10
    bold: false
  }
  text: {
    width: 100
    height: 60
  }
  blue.style: {
    fill: "#0033cc"
    stroke: "#0033cc"
    border-radius: 10
  }
  gray.style: {
    fill: "#cecece"
    stroke: "#cecece"
    border-radius: 10
  }
  note: {
    height: 30
    label.near: top-center
    style: {
      font-size: 10
      bold: false
      fill: transparent
      stroke: transparent
    }
  }
  empty: {
    label: ""
    width: 50
    height: 50
    style: {
      fill: transparent
      stroke: transparent
    }
  }
  arrow: {
    target-arrowhead.shape: arrow
    style: {
      stroke: black
      stroke-width: 2
    }
  }
}
```
