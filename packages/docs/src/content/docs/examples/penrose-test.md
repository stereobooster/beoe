---
title: penrose
draft: true
---

```penrose style="euclidean.style" domain="euclidean.domain" width=800 height=800
Plane P
Point p, q, r, s
In(p, P)
In(q, P)
In(r, P)
In(s, P)
Let a := Segment(p, q)
Let b := Segment(p, r)
Point m := Midpoint(a)
In(m, P)
Angle theta := InteriorAngle(q, p, r)
Let t := Triangle(p, r, s)
Ray w := Bisector(theta)
Segment h := PerpendicularBisector(a, m)
AutoLabel p, q, r, s, m
Label P $E^2$
```
