<?php
  // echo "hello";

  // $test_today = date("Y-m-d H:i:s");

  // print_r($test_today);

  // echo "\n";
  // echo (new DateTimeImmutable) ->modify('last day of') ->format('Y-m-d');
  // echo "\n";
  // echo (new DateTimeImmutable) ->modify('last day of') ->format('d');
  // echo (new DateTimeImmutable)->modify('last day of')->format('Y-m-d'); // 2021-03-31

  // $last_date =  (new DateTimeImmutable) ->modify('last day of') ->format('d');

  // $count = 1;
  // $sql;

  // while ($count <= $last_date){
  // // 実行する処理
  //   $sql = $sql ."case when t_schedule.press_date = '2021-09-" . $count . "' then t_schedule.press_quantity else '' end AS _" . $count . ",";

  // $count++;
  // }
  // echo $sql;

  $begin = new DateTime('2021-09-01');
  $end = new DateTime('2021-09-30');
  $end = $end->modify( '+1 day' );
  
  $interval = DateInterval::createFromDateString('1 day');
  $period = new DatePeriod($begin, $interval, $end);
  $sql1="SELECT 
    t_schedule.dies_id,
    m_dies.die_number, ";
  foreach ($period as $dt) {
      // echo $dt->format("Y-m-d\n");
      $di = $dt->format("Y-m-d");
    $sql1 = $sql1 ."MAX(CASE WHEN t_schedule.press_date = '" . $di . "' THEN t_schedule.press_quantity else '' END) AS '" . $di."',";
  }
  $sql2 = substr(trim($sql1), 0, -1);
  $sql2 = $sql2."
    FROM
      t_schedule
    LEFT JOIN
      m_dies ON t_schedule.dies_id = m_dies.id 
    GROUP BY dies_id 
    UNION SELECT 
      t_press.dies_id,
      m_dies.die_number, ";
      $sql3="";
    foreach ($period as $dtp) {
      // echo $dt->format("Y-m-d\n");
      $dp = $dtp->format("Y-m-d");
    $sql3 = $sql3 ."MAX(CASE WHEN t_press.`press_date_at` ='". $dp ."' THEN t_press.actual_billet_quantities else '' END) AS'". $dp."',";
  }
  $sql3 = substr(trim($sql3), 0, -1);
  $sql3 = $sql3."
    FROM
      t_press
    LEFT JOIN
      m_dies ON t_press.dies_id = m_dies.id
    GROUP BY dies_id";
  echo $sql2.$sql3;

?>
