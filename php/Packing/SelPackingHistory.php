<?php
  /* 21/08/31作成 */
  $userid = "webuser";
  $passwd = "";
//   print_r($_POST);
  
  try {
      $dbh = new PDO(
          'mysql:host=localhost; dbname=extrusion; charset=utf8',
          $userid,
          $passwd,
          array(
          PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
          PDO::ATTR_EMULATE_PREPARES => false
          )
      );

      $sql = "
        SELECT
          t_packing.id,
          DATE_FORMAT(t_packing.packing_date, '%m-%d') AS packing_date,
          TIME_FORMAT(t_packing.packing_start, '%H:%i') AS packing_start,
          TIME_FORMAT(t_packing.packing_end, '%H:%i') AS packing_end,
          (
            SELECT
              COUNT(*)
            FROM
              t_packing_worker
            WHERE
              t_packing_worker.t_packing_id = t_packing.id
          ) AS number_of_worker,
          (
            SELECT
              COUNT(DISTINCT t_packing_box.box_number_id)
            FROM
              t_packing_box
            WHERE
              t_packing_box.packing_id = t_packing.id
          ) AS number_of_making_box
        FROM
          t_packing 
        ORDER BY t_packing.packing_date DESC
       ";
      $prepare = $dbh->prepare($sql);

      // $prepare->bindValue(':t_press_id', (INT)$_POST["t_press_id"], PDO::PARAM_INT);
      $prepare->execute();
      $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

      echo json_encode($result);
  } catch (PDOException $e) {
      $error = $e->getMessage();
      echo json_encode($error);
  }
  $dbh = null;
