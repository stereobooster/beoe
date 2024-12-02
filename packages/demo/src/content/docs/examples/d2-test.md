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

```d2 strategy=inline darkScheme=false
direction: right
a -> b -> c -> d -> e
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
