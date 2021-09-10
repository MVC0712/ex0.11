<?php
  /* 21/09/10 */

  $userid = "webuser";
  $passwd = "";

  // $vnPdId = $_POST["vnPdId"];
  // print_r($_POST);
  try{
    $dbh = new PDO(
      'mysql:host=localhost; dbname=extrusion; charset=utf8',
      $userid,
      $passwd,
      array(
          PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
          PDO::ATTR_EMULATE_PREPARES => false
      )
    );

    $stmt = $dbh->prepare("DELETE FROM t_using_aging_rack WHERE t_press_id = :t_press_id AND order_number = :order_number");
    $stmt->bindValue(':t_press_id', (INT)$_POST["t_press_id"], PDO::PARAM_INT);
    $stmt->bindValue(':order_number', (INT)$_POST["order_number"], PDO::PARAM_INT);
    $stmt->execute();

    echo(json_encode("Deleted"));
  } catch (PDOException $e){
    $error = $e->getMessage();
    // $pdh->rollback();
    print_r($error);
  }
  $dbh = null;
?>
