<?php
  /* 21/08/29作成 */
  $userid = "webuser";
  $passwd = "";
  
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
          t_packing_box.id AS t_packing_box_id,
          t_packing_box_number.box_number,
          t_packing_box.work_quantity
        FROM t_packing_box
        LEFT JOIN t_packing_box_number ON t_packing_box.box_number_id = t_packing_box_number.id
        WHERE t_packing_box.using_aging_rack_id = :using_aging_rack_id
      ";

      $prepare = $dbh->prepare($sql);
      $prepare->bindValue(':using_aging_rack_id', (INT)$_POST["using_aging_rack_id"], PDO::PARAM_INT);
      $prepare->execute();
      $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

      echo json_encode($result);
  } catch (PDOException $e) {
      $error = $e->getMessage();
      echo json_encode($error);
  }
  $dbh = null;
