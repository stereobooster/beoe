---
title: vizdom
---

## rehype-plugin

### works with dark mode

```vizdom
digraph TD {
    cluster=true
    node [shape=box]
    subgraph Watcher {
        label="watch"
        Watch [label="FS Notifier" URL="https://example.com"]
    }
    Watch -> TailW [label="*.rs & input.css"]
    Watch -> Sass [label="*.sass & *.scss"]
    Watch -> Append [label="*.css"]
    Watch -> WASM [label="*.rs"]
    Watch -> BIN [label="*.rs"]
    Watch -> Mirror [label="assets/**"]
    subgraph style {
        label=style
        TailW [label="Tailwind CSS"]
        Sass
        CSSProc [label="CSS Processor\nLightning CSS"]
        Append [label="append"]
    }
    TailW -> Append
    Sass -> Append
    Append -> CSSProc
    subgraph rust {
        label=rust
        WASM [label="Client WASM"]
        BIN [label="Server BIN"]
    }
    subgraph asset {
        label=asset
        Mirror
    }
    subgraph update {
        label=update
        WOC [label="target/site/\nWrite-on-change FS"]
        Live [label="Live Reload"]
        Server
    }
    Mirror -> WOC [label="site/**"]
    WASM -> WOC [label="site/pkg/app.wasm"]
    BIN -> WOC [label="server/app"]
    CSSProc -> WOC [label="site/pkg/app.css"]
    Live -> Server [label="Port scan", style=dashed]
    WOC -> Server [label="target/server/app\nsite/**"]
    WOC -> Live [label="site/pkg/app.css,\nclient & server change"]
    Live -> Browser [label="Reload all or\nupdate app.css"]
    Browser[URL="https://example.com"];
    Server -> Browser [style=dashed, arrowhead=none]
}
```

### doesn't work with dark mode

```vizdom
digraph Twelve_colors {
    label="Twelve colors. Neato layout"
    labelloc="b"
    layout=neato
    fontname=Arial
    node [shape=circle width=1.5 color="#00000088" style=filled fontname="Helvetica,Arial,sans-serif"]
    edge [len=2 penwidth=1.5 arrowhead=open]
    start=regular
    normalize=0
    green -> { white yellow cyan yellowgreen springgreen } [color=green]
    green [fillcolor=green fontcolor=white]
    white [fillcolor=white]
    blue [fillcolor=blue fontcolor=white]
    red [fillcolor=red fontcolor=white]
    red -> { white yellow magenta orange deeppink } [color=red]
    yellow [fillcolor=yellow]
    yellow -> { orange yellowgreen } [color=yellow]
    blue -> { white cyan magenta deepskyblue purple } [color=blue]
    cyan [fillcolor=cyan]
    magenta [fillcolor=magenta fontcolor=white]
    deepskyblue [fillcolor=deepskyblue]
    cyan -> { springgreen deepskyblue } [color=cyan]
    orange [fillcolor=orange]
    yellowgreen [fillcolor=yellowgreen]
    deeppink [fillcolor=deeppink fontcolor=white]
    magenta -> { deeppink purple } [color=magenta]
    purple [fillcolor=purple fontcolor=white]
    springgreen [fillcolor=springgreen]
    // © 2022 Costa Shulyupin, licensed under EPL
}
```

```vizdom
digraph "[stackcollapse]" {
    fontname="Helvetica,Arial,sans-serif"
    node [fontname="Helvetica,Arial,sans-serif"]
    edge [fontname="Helvetica,Arial,sans-serif"]
    node [style=filled fillcolor="#f8f8f8"]
    subgraph cluster_L {
        "File: [stackcollapse]" [shape=box fontsize=16 label="File: [stackcollapse]\n\nShowing nodes accounting for 380, 90.48% of 420 total\nDropped 120 nodes (cum <= 2)\nShowing top 20 nodes out of 110\n\nSee https://git.io/JfYMW for how to read the graph\n" tooltip="[stackcollapse]"]
    }
    N1 [label="deflate\n62 (14.76%)\nof 384 (91.43%)" id="node1" fontsize=18 shape=box tooltip="deflate (384)" color="#b20400" fillcolor="#edd6d5"]
    N2 [label="gzip\n0 of 409 (97.38%)" id="node2" fontsize=8 shape=box tooltip="gzip (409)" color="#b20100" fillcolor="#edd5d5"]
    N3 [label="longest_match\n178 (42.38%)" id="node3" fontsize=24 shape=box tooltip="longest_match (178)" color="#b22800" fillcolor="#eddad5"]
    N4 [label="fill_window\n41 (9.76%)\nof 102 (24.29%)" id="node4" fontsize=16 shape=box tooltip="fill_window (102)" color="#b23d00" fillcolor="#edddd5"]
    N5 [label="updcrc\n46 (10.95%)\nof 48 (11.43%)" id="node5" fontsize=17 shape=box tooltip="updcrc (48)" color="#b27d4c" fillcolor="#ede6df"]
    N6 [label="file_read\n0 of 62 (14.76%)" id="node6" fontsize=8 shape=box tooltip="file_read (62)" color="#b2682e" fillcolor="#ede3db"]
    N7 [label="entry_SYSCALL_64_after_hwframe\n0 of 34 (8.10%)" id="node7" fontsize=8 shape=box tooltip="entry_SYSCALL_64_after_hwframe (34)" color="#b2906a" fillcolor="#ede8e3"]
    N8 [label="compress_block\n14 (3.33%)\nof 25 (5.95%)" id="node8" fontsize=13 shape=box tooltip="compress_block (25)" color="#b29b7d" fillcolor="#edeae6"]
    N9 [label="send_bits\n13 (3.10%)\nof 16 (3.81%)" id="node9" fontsize=13 shape=box tooltip="send_bits (16)" color="#b2a590" fillcolor="#edebe8"]
    N10 [label="ct_tally\n13 (3.10%)" id="node10" fontsize=13 shape=box tooltip="ct_tally (13)" color="#b2a896" fillcolor="#edebe9"]
    N11 [label="do_syscall_64\n0 of 33 (7.86%)" id="node11" fontsize=8 shape=box tooltip="do_syscall_64 (33)" color="#b2916c" fillcolor="#ede8e3"]
    N12 [label="_start\n0 of 393 (93.57%)" id="node12" fontsize=8 shape=box tooltip="_start (393)" color="#b20300" fillcolor="#edd5d5"]
    N13 [label="zip\n0 of 386 (91.90%)" id="node13" fontsize=8 shape=box tooltip="zip (386)" color="#b20400" fillcolor="#edd6d5"]
    N14 [label="native_write_msr\n9 (2.14%)" id="node14" fontsize=12 shape=box tooltip="native_write_msr (9)" color="#b2ac9f" fillcolor="#edecea"]
    N15 [label="treat_file\n0 of 389 (92.62%)" id="node15" fontsize=8 shape=box tooltip="treat_file (389)" color="#b20400" fillcolor="#edd5d5"]
    N16 [label="[unknown]\n0 of 10 (2.38%)" id="node16" fontsize=8 shape=box tooltip="[unknown] (10)" color="#b2ab9d" fillcolor="#edecea"]
    N17 [label="page_cache_ra_unbounded\n2 (0.48%)\nof 13 (3.10%)" id="node17" fontsize=10 shape=box tooltip="page_cache_ra_unbounded (13)" color="#b2a896" fillcolor="#edebe9"]
    N18 [label="asm_exc_page_fault\n1 (0.24%)\nof 5 (1.19%)" id="node18" fontsize=10 shape=box tooltip="asm_exc_page_fault (5)" color="#b2afa7" fillcolor="#edeceb"]
    N19 [label="__x64_sys_read\n1 (0.24%)\nof 15 (3.57%)" id="node19" fontsize=10 shape=box tooltip="__x64_sys_read (15)" color="#b2a692" fillcolor="#edebe8"]
    N20 [label="flush_block\n0 of 27 (6.43%)" id="node20" fontsize=8 shape=box tooltip="flush_block (27)" color="#b29979" fillcolor="#ede9e5"]
    N2 -> N12 [label=" 393" weight=94 penwidth=5 color="#b20300" tooltip="gzip -> _start (393)" labeltooltip="gzip -> _start (393)"]
    N12 -> N15 [label=" 389" weight=93 penwidth=5 color="#b20400" tooltip="_start ... treat_file (389)" labeltooltip="_start ... treat_file (389)" style="dotted"]
    N15 -> N13 [label=" 386" weight=92 penwidth=5 color="#b20400" tooltip="treat_file -> zip (386)" labeltooltip="treat_file -> zip (386)"]
    N13 -> N1 [label=" 384" weight=92 penwidth=5 color="#b20400" tooltip="zip -> deflate (384)" labeltooltip="zip -> deflate (384)"]
    N1 -> N3 [label=" 176" weight=42 penwidth=3 color="#b22800" tooltip="deflate -> longest_match (176)" labeltooltip="deflate -> longest_match (176)"]
    N1 -> N4 [label=" 102" weight=25 penwidth=2 color="#b23d00" tooltip="deflate -> fill_window (102)" labeltooltip="deflate -> fill_window (102)"]
    N4 -> N6 [label=" 58" weight=14 color="#b26e37" tooltip="fill_window -> file_read (58)" labeltooltip="fill_window -> file_read (58)"]
    N6 -> N5 [label=" 48" weight=12 color="#b27d4c" tooltip="file_read -> updcrc (48)" labeltooltip="file_read -> updcrc (48)"]
    N7 -> N11 [label=" 33" weight=8 color="#b2916c" tooltip="entry_SYSCALL_64_after_hwframe -> do_syscall_64 (33)" labeltooltip="entry_SYSCALL_64_after_hwframe -> do_syscall_64 (33)"]
    N1 -> N20 [label=" 26" weight=7 color="#b29a7b" tooltip="deflate -> flush_block (26)" labeltooltip="deflate -> flush_block (26)"]
    N20 -> N8 [label=" 23" weight=6 color="#b29e81" tooltip="flush_block -> compress_block (23)" labeltooltip="flush_block -> compress_block (23)"]
    N11 -> N19 [label=" 14" weight=4 color="#b2a794" tooltip="do_syscall_64 -> __x64_sys_read (14)" labeltooltip="do_syscall_64 -> __x64_sys_read (14)"]
    N6 -> N7 [label=" 14" weight=4 color="#b2a794" tooltip="file_read ... entry_SYSCALL_64_after_hwframe (14)" labeltooltip="file_read ... entry_SYSCALL_64_after_hwframe (14)" style="dotted"]
    N19 -> N17 [label=" 13" weight=4 color="#b2a896" tooltip="__x64_sys_read ... page_cache_ra_unbounded (13)" labeltooltip="__x64_sys_read ... page_cache_ra_unbounded (13)" style="dotted"]
    N1 -> N10 [label=" 12" weight=3 color="#b2a999" tooltip="deflate -> ct_tally (12)" labeltooltip="deflate -> ct_tally (12)"]
    N8 -> N9 [label=" 11" weight=3 color="#b2aa9b" tooltip="compress_block -> send_bits (11)" labeltooltip="compress_block -> send_bits (11)"]
    N2 -> N16 [label=" 10" weight=3 color="#b2ab9d" tooltip="gzip -> [unknown] (10)" labeltooltip="gzip -> [unknown] (10)"]
    N11 -> N14 [label=" 9" weight=3 color="#b2ac9f" tooltip="do_syscall_64 ... native_write_msr (9)" labeltooltip="do_syscall_64 ... native_write_msr (9)" style="dotted"]
    N16 -> N9 [label=" 5" weight=2 color="#b2afa7" tooltip="[unknown] -> send_bits (5)" labeltooltip="[unknown] -> send_bits (5)"]
    N2 -> N7 [label=" 4" color="#b2b0aa" tooltip="gzip -> entry_SYSCALL_64_after_hwframe (4)" labeltooltip="gzip -> entry_SYSCALL_64_after_hwframe (4)"]
    N16 -> N8 [label=" 2" color="#b2b1ae" tooltip="[unknown] -> compress_block (2)" labeltooltip="[unknown] -> compress_block (2)"]
    N16 -> N3 [label=" 2" color="#b2b1ae" tooltip="[unknown] -> longest_match (2)" labeltooltip="[unknown] -> longest_match (2)"]
    N2 -> N18 [label=" 2" color="#b2b1ae" tooltip="gzip ... asm_exc_page_fault (2)" labeltooltip="gzip ... asm_exc_page_fault (2)" style="dotted"]
    N9 -> N18 [label=" 2" color="#b2b1ae" tooltip="send_bits -> asm_exc_page_fault (2)" labeltooltip="send_bits -> asm_exc_page_fault (2)"]
    N16 -> N10 [label=" 1" color="#b2b2b0" tooltip="[unknown] -> ct_tally (1)" labeltooltip="[unknown] -> ct_tally (1)"]
    N7 -> N19 [label=" 1" color="#b2b2b0" tooltip="entry_SYSCALL_64_after_hwframe -> __x64_sys_read (1)" labeltooltip="entry_SYSCALL_64_after_hwframe -> __x64_sys_read (1)"]
    N9 -> N7 [label=" 1" color="#b2b2b0" tooltip="send_bits ... entry_SYSCALL_64_after_hwframe (1)" labeltooltip="send_bits ... entry_SYSCALL_64_after_hwframe (1)" style="dotted"]
    N13 -> N20 [label=" 1" color="#b2b2b0" tooltip="zip -> flush_block (1)" labeltooltip="zip -> flush_block (1)"]
}
```

```vizdom
digraph rusty {
    rankdir=LR
    cluster=true
    bgcolor=black
    fillcolor=black
    color=white
    node [style=filled, fillcolor=black, fontcolor=white, shape=box]
    edge [fontcolor=white, color=white]
    subgraph consts {
        style=dashed
        ref_t [label="&T ≈ *const T", shape=plaintext]
        ref_mut_t [label="&mut T ≈ *mut T", shape=plaintext]
    }
    subgraph out {
        style=filled
        dummy3 [style=invis]
        subgraph types {
            style=dashed
            t [label="T or mut", shape=plaintext]
            cell_t [label="Cell<T>", shape=plaintext]
            refcell_t [label="RefCell<T>", shape=plaintext]
            box_t [label="Box<T>", shape=plaintext]
            rc_t [label="Rc<T>", shape=plaintext]
            rc_cell_t [label="Rc<Cell<T>>", shape=plaintext]
            rc_refcell_t [label="Rc<RefCell<T>>", shape=plaintext]
            atomic_t [label="AtomicT", shape=plaintext]
            mutex_t [label="Mutex<T>", shape=plaintext]
            rwlock_t [label="RwLock<T>", shape=plaintext]
            arc_t [label="Arc<T>", shape=plaintext]
            arc_atomic_t [label="Arc<AtomicT>", shape=plaintext]
            arc_mutex_t [label="Arc<Mutex<T>>", shape=plaintext]
            arc_rwlock_t [label="Arc<RwLock<T>>", shape=plaintext]
        }
    }
    dummy2 [label="<&ref|*deref>", shape=plaintext]
    ref_t -> dummy2 [label="<immutable>", style=dashed, dir=back]
    ref_mut_t -> dummy2 [label="<mut>", style=dashed, dir=back]
    dummy2 -> dummy3 [style=dashed]
    threads [label=Threads, color=green]
    ownership1 [label="Ownership", color=brown]
    threads -> ownership1 [label="<single>"]
    allocate [label=Allocate, color=orange]
    ownership1 -> allocate [label="<unique>"]
    interior_mut [label="Interior-mutability", color=gold]
    allocate -> interior_mut [label="<stack>"]
    interior_mut -> t [label="<not needed>"]
    type1 [label=Type, color=blue]
    interior_mut -> type1 [label="<need>", fontcolor=gold, color=gold]
    type1 -> cell_t [label="<Copy|move>", fontcolor=blue, color=blue]
    type1 -> refcell_t [label="<& reference>"]
    allocate -> box_t [label="<heap>", fontcolor=orange, color=orange]
    mutable1 [label=Mutable, color=gold]
    ownership1 -> mutable1 [label="<shared>", fontcolor=brown, color=brown]
    mutable1 -> rc_t [label="<immutable>"]
    type2 [label=Type, color=blue]
    mutable1 -> type2 [label="<mut>", color=gold]
    type2 -> rc_cell_t [label="<Copy|move>", fontcolor=blue, color=blue]
    type2 -> rc_refcell_t [label="<& reference>"]
    ownership2 [label="Ownership", color=brown]
    threads -> ownership2 [label="<multiple>", fontcolor=green, color=green]
    rw1 [label="R/W", color=red]
    ownership2 -> rw1 [label="<unique>"]
    type3 [label=Type, color=blue]
    rw1 -> type3 [label="<reader/writer>"]
    type3 -> atomic_t [label="<bool|int>", fontcolor=blue, color=blue]
    type3 -> mutex_t [label="<any>"]
    rw1 -> rwlock_t [label="<readers/writer>", fontcolor=red, color=red]
    mutable2 [label=Mutable, color=gold]
    ownership2 -> mutable2 [label="<shared>", fontcolor=brown, color=brown]
    mutable2 -> arc_t [label="<immutable>"]
    rw2 [label="R/W", color=red]
    mutable2 -> rw2 [label="<mut>", fontcolor=gold, color=gold]
    type4 [label=Type, color=blue]
    rw2 -> type4 [label="<reader/writer>"]
    type4 -> arc_atomic_t [label="<bool|int>", fontcolor=blue, color=blue]
    type4 -> arc_mutex_t [label="<any>"]
    rw2 -> arc_rwlock_t [label="<readers/writer>", fontcolor=red, color=red]
}
```

```vizdom
digraph axionalterm {
    rankdir="LR"
    node [shape="box", fontsize="12", style="filled", fillcolor="#FAFAFA"];
    edge [style="dashed"];
    subgraph cluster_user {
        label="User"
        style="filled"
        fillcolor="#EEEEEE"
        shape="polygon"
        origin
    }
    subgraph cluster_frontend {
        label="Terminal Server"
        style="filled"
        fillcolor="#EEEEEE"
        newrank="true"
        form
        term
        eval
        parser1
        parser2
        LOCAL
        value
        subgraph cluster_vars {
            style="filled"
            fillcolor="#CFD8DC"
            label="Form Variables"
            rank="same"
            subgraph cluster_UEL_SQL_DATA {
                style="filled"
                fillcolor="#FAFAFA"
                label="UEL/SQLDATA"
                col_default
            }
            subgraph cluster_UEL_SQL_EXPR {
                style="filled"
                fillcolor="#FAFAFA"
                label="UEL/SQLEXPR"
                col_check_exp
            }
            subgraph cluster_SQL_EXISTS {
                style="filled"
                fillcolor="#FAFAFA"
                label="SQLEXISTS"
                sref_help_cond
            }
            subgraph cluster_UEL {
                style="filled"
                fillcolor="#FAFAFA"
                label="UEL"
                button_cond
                group_cond
                col_hide_cond
            }
            subgraph cluster_SQL_XSQL {
                style="filled"
                fillcolor="#FAFAFA"
                label="SQL/XSQL"
                col_after_sql
                button_action
                sql_action_exec
                sql_action_cancel
            }
        }
    }
    subgraph cluster_backend {
        style="filled"
        fillcolor="#EEEEEE"
        label="Backend Server"
        newrank="true"
        soap
        jdbc
    }
    origin [style="invis"]
    form [label="Form - UI"]
    term [label="Terminal\nEngine", shape="cylinder"]
    eval [label="Eval\nExpression", shape="circle"]
    col_hide_cond [label="Hide Condition \napps_wms_formatl \ncol_hide_cond", style="filled", fillcolor="#90CAF9"]
    group_cond [label="Hide Condition\napps_wms_formatg\ngroup_cond", style="filled", fillcolor="#B39DDB"]
    button_cond [label="Button condition\napps_wms_formatg_buttons\nbutton_cond", style="filled", fillcolor="#EF9A9A"]
    sql_action_exec [label="Statements \napps_wms_formath\nsql_action_exec", style="filled", fillcolor="#80CBC4"]
    sql_action_cancel [label="Interrupt \napps_wms_formath\nsql_action_cancel", style="filled", fillcolor="#80CBC4"]
    col_after_sql [label="Interrupt \napps_wms_formatl\ncol_after_sql", style="filled", fillcolor="#90CAF9"]
    col_default [label="Default value \napps_wms_formatl \ncol_default", style="filled", fillcolor="#90CAF9"]
    sref_help_cond [label="Validate Condition\napps_wms_formatl \nsref_help_cond", style="filled", fillcolor="#90CAF9"]
    col_check_exp [label="Check Condition\napps_wms_formatl \ncol_check_exp", style="filled", fillcolor="#90CAF9"]
    button_action [label="Button action\napps_wms_formatg_buttons\n button_action", style="filled", fillcolor="#EF9A9A"]
    parser1 [label="Variable Parser\nEngine", shape="cylinder"]
    parser2 [label="Variable Parser\nEngine\n@", shape="cylinder"]
    soap [label="http/SOAP"]
    jdbc [label="JDBC", shape="cylinder", style="filled", fillcolor="#0277BD", fontcolor="#FFFFFF"]
    LOCAL [label="LOCAL/JAVA-UEL"]
    value [label="Value"]
    origin -> form [label="User input"]
    form -> term
    term -> eval
    eval -> sref_help_cond [lhead="cluster_SQL_EXISTS"]
    eval -> sql_action_exec [lhead="cluster_SQL_XSQL"]
    eval -> group_cond [lhead="cluster_UEL"]
    eval -> col_default [lhead="cluster_UEL_SQL_DATA"]
    eval -> col_check_exp [lhead="cluster_UEL_SQL_EXPR"]
    sql_action_exec -> parser2 [ltail="cluster_SQL_XSQL", color="#FF0000"]
    group_cond -> parser1 [ltail="cluster_UEL" color="#0000FF"]
    sref_help_cond -> parser2 [color="#FF0000"]
    col_check_exp -> parser1 [color="#0000FF"]
    col_check_exp -> parser2 [color="#FF0000"]
    col_default -> parser1 [color="#0000FF"]
    col_default -> parser2 [color="#FF0000"]
    parser1 -> LOCAL [color="#0000FF"]
    parser2 -> soap [color="#FF0000"]
    soap -> jdbc [color="#FF0000"]
    LOCAL -> value
    jdbc -> value
    value -> term
    term -> form
}
```
