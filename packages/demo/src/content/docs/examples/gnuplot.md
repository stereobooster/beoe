---
title: gnuplot
draft: true
---

## rehype-gnuplot

```gnuplot
set key fixed left top vertical Right noreverse enhanced autotitle box lt black linewidth 1.000 dashtype solid
set title "Simple Plots"
set title  font ",20" textcolor lt -1 norotate
set xrange [ * : * ] noreverse writeback
set x2range [ * : * ] noreverse writeback
set yrange [ * : * ] noreverse writeback
set y2range [ * : * ] noreverse writeback
set zrange [ * : * ] noreverse writeback
set cbrange [ * : * ] noreverse writeback
set rrange [ * : * ] noreverse writeback
set colorbox vertical origin screen 0.9, 0.2 size screen 0.05, 0.6 front  noinvert bdefault
NO_ANIMATION = 1
plot [-10:10] sin(x),atan(x),cos(atan(x))
```

```gnuplot
set grid nopolar
set grid xtics nomxtics ytics nomytics noztics nomztics nortics nomrtics \
 nox2tics nomx2tics noy2tics nomy2tics nocbtics nomcbtics
set grid layerdefault   lt 0 linecolor 0 linewidth 0.500,  lt 0 linecolor 0 linewidth 0.500
set samples 21, 21
set isosamples 11, 11
set style data lines
set title "3D surface from a function"
set xlabel "X axis"
set xlabel  offset character -3, -2, 0 font "" textcolor lt -1 norotate
set xrange [ -10.0000 : 10.0000 ] noreverse nowriteback
set x2range [ * : * ] noreverse writeback
set ylabel "Y axis"
set ylabel  offset character 3, -2, 0 font "" textcolor lt -1 rotate
set yrange [ -10.0000 : 10.0000 ] noreverse nowriteback
set y2range [ * : * ] noreverse writeback
set zlabel "Z axis"
set zlabel  offset character -5, 0, 0 font "" textcolor lt -1 norotate
set zrange [ * : * ] noreverse writeback
set cbrange [ * : * ] noreverse writeback
set rrange [ * : * ] noreverse writeback
set colorbox vertical origin screen 0.9, 0.2 size screen 0.05, 0.6 front  noinvert bdefault
NO_ANIMATION = 1
## Last datafile plotted: "$grid"
splot x**2+y**2, x**2-y**2
```

```gnuplot
unset border
set grid nopolar
set grid noxtics nomxtics noytics nomytics noztics nomztics nortics nomrtics \
 nox2tics nomx2tics noy2tics nomy2tics nocbtics nomcbtics
set grid back   linecolor rgb "grey"  linewidth 0.500 dashtype solid,  linecolor rgb "grey"  linewidth 0.500 dashtype solid
set key fixed right top vertical Right reverse enhanced noautotitle nobox
set spiderplot
set style spiderplot  linewidth 1.000 dashtype solid pointtype 6 pointsize 2.000
set style spiderplot fillstyle  transparent solid 0.20 border
set size ratio 1 1,1
set style data spiderplot
unset xtics
unset ytics
unset ztics
unset cbtics
unset rtics
set paxis 1 tics axis in scale 1,0.5 nomirror norotate  autojustify
set paxis 1 tics  norangelimit autofreq  font ",9"
set paxis 2 tics axis in scale 1,0.5 nomirror norotate  autojustify
set paxis 2 tics  norangelimit autofreq  font ",9"
set paxis 3 tics axis in scale 1,0.5 nomirror norotate  autojustify
set paxis 3 tics  norangelimit autofreq  font ",9"
set paxis 4 tics axis in scale 1,0.5 nomirror norotate  autojustify
set paxis 4 tics  norangelimit autofreq  font ",9"
set paxis 5 tics axis in scale 1,0.5 nomirror norotate  autojustify
set paxis 5 tics  norangelimit autofreq  font ",9"
set paxis 6 tics axis in scale 1,0.5 nomirror norotate  autojustify
set paxis 6 tics  norangelimit autofreq
unset paxis 7 tics
unset paxis 8 tics
unset paxis 9 tics
unset paxis 10 tics
set title "To plot from 2 different files or arrays, use 'newspiderplot'"
set xrange [ * : * ] noreverse writeback
set x2range [ * : * ] noreverse writeback
set yrange [ * : * ] noreverse writeback
set y2range [ * : * ] noreverse writeback
set zrange [ * : * ] noreverse writeback
set cbrange [ * : * ] noreverse writeback
set rrange [ * : * ] noreverse writeback
set paxis 1 range [ 0.00000 : 100.000 ]  noextend
set paxis 1 label "Scale 1"
set paxis 1 label  font "" textcolor lt -1 norotate
set paxis 2 range [ 0.00000 : 100.000 ]  noextend
set paxis 2 label "Scale 2"
set paxis 2 label  font "" textcolor lt -1 norotate
set paxis 3 range [ 0.00000 : 100.000 ]  noextend
set paxis 3 label "Scale 3"
set paxis 3 label  font "" textcolor lt -1 norotate
set paxis 4 range [ 0.00000 : 100.000 ]  noextend
set paxis 4 label "Scale 4"
set paxis 4 label  font "" textcolor lt -1 norotate
set paxis 5 range [ 0.00000 : 100.000 ]  noextend
set paxis 5 label "Scale 5"
set paxis 5 label  font "" textcolor lt -1 norotate
set paxis 6 range [ 0.00000 : 100.000 ]  noextend
set paxis 6 label "Scale 6"
set paxis 6 label  font "" textcolor lt -1 norotate
set paxis 7 range [ 0.00000 : 100.000 ]  noextend
set paxis 8 range [ 0.00000 : 100.000 ]  noextend
set paxis 9 range [ 0.00000 : 100.000 ]  noextend
set paxis 10 range [ 0.00000 : 100.000 ]  noextend
set colorbox vertical origin screen 0.9, 0.2 size screen 0.05, 0.6 front  noinvert bdefault
NO_ANIMATION = 1
array Array1[6] = [15,75,20,43,90,50]
array Array2[6] = [25,25,50,50,75,50]
## Last datafile plotted: "@@"
plot      keyentry with spiderplot lc 3 lw 3 title "Array #1",      for [i=1:|Array1|] Array1 using (Array1[i]) lc 3 lw 3 title sprintf("Scale %d",i),      newspiderplot,      keyentry with spiderplot lc 4 lw 2 title "Array #2",      for [j=1:|Array2|] Array2 using (Array2[j]) lc 4 lw 2 notitle
```

```gnuplot
unset border
set style fill  transparent solid 0.30 border
set dummy u, v
unset key
set object  1 rect from screen 0, 0 to screen 1, 1
set object  1 behind clip lw 1.0  dashtype solid fc  rgb "gray"  fillstyle   solid 1.00 border lt -1
set parametric
set view 64, 345, 1.24375, 0.995902
set isosamples 50, 20
set style data lines
unset xtics
unset ytics
unset ztics
set title "Interlocking Tori - PM3D surface with depth sorting and transparency"
set urange [ -3.14159 : 3.14159 ] noreverse nowriteback
set vrange [ -3.14159 : 3.14159 ] noreverse nowriteback
set xrange [ * : * ] noreverse writeback
set x2range [ * : * ] noreverse writeback
set yrange [ * : * ] noreverse writeback
set y2range [ * : * ] noreverse writeback
set zrange [ * : * ] noreverse writeback
set cbrange [ * : * ] noreverse writeback
set rrange [ * : * ] noreverse writeback
set pm3d depthorder
set pm3d interpolate 1,1 flush begin noftriangles border linecolor rgb "#a0a0f0"  linewidth 0.500 dashtype solid corners2color mean
set palette rgbformulae 8, 9, 7
set colorbox vertical origin screen 0.9, 0.2 size screen 0.05, 0.6 front  noinvert bdefault
NO_ANIMATION = 1
splot cos(u)+.5*cos(u)*cos(v),sin(u)+.5*sin(u)*cos(v),.5*sin(v) with pm3d,     1+cos(u)+.5*cos(u)*cos(v),.5*sin(v),sin(u)+.5*sin(u)*cos(v) with pm3d
```

More examples here: https://gnuplot.sourceforge.net/demo_svg_5.4/
