<?php
  /* 21/08/22作成 */
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
      select 
            m_dies.id,
            m_dies.die_number
      from t_press
      left join m_dies on t_press.dies_id = m_dies.id
      order by m_dies.die_number
      ";

      $prepare = $dbh->prepare($sql);

      // $prepare->bindValue(':press_date', $_POST["press_date"], PDO::PARAM_STR);
      $prepare->execute();
      $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

      echo json_encode($result);
  } catch (PDOException $e) {
      $error = $e->getMessage();
      echo json_encode($error);
  }
  $dbh = null;
