(module
  (func $log (import "imports" "logFn") (param i32))

  (memory (export "mem") 1)
  (data (i32.const 0x0) "Hello World")

  (func $how_old (param $year_born i32) (param $year_now i32) (result i32)
    	local.get $year_now
    	local.get $year_born
    	i32.sub
    )

  (func $log_how_old (param $year_born i32) (param $year_now i32)
    local.get $year_now
    local.get $year_born
    call $how_old
    call $log
    )

  	(export "howOld" (func $how_old))
  	(export "logHowOld" (func $log_how_old))
  )
