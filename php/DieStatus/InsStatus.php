<?php
  /* 21/06/24作成 */
  $userid = "webuser";
  $passwd = "";
  $die_status_id = "";
  $do_sth_at = "";
  $note = "";

  $die_status_id = $_POST['die_status_id'];
  $do_sth_at = $_POST['do_sth_at'];
  $do_sth_at_time = $_POST['do_sth_at_time'];
  $note = $_POST['note'];
  array_pop($_POST);
  array_pop($_POST);
  array_pop($_POST);
  array_pop($_POST);
  $today = date("Y-m-d");

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


      // INSERT するための配列の準備
      foreach ($_POST as $val) {
          // print_r($val);
          // echo "<br>";
        //   $sql_paramater[] = "({$val}, '$die_status_id', '$do_sth_at', '$note', '$today')";
          $sql_paramater[] = "({$val}, '$die_status_id', '$do_sth_at $do_sth_at_time', '$note', '$today')";
      }
        // print_r($sql_paramater);
        // echo "<br>";
      $sql = "INSERT INTO t_dies_status ";
      $sql = $sql."(dies_id, die_status_id, do_sth_at, note, created_at) VALUES ";
      $sql = $sql.join(",", $sql_paramater);
      // echo "<br>";
      // print_r($sql);
      // echo "<br>";

      $prepare = $dbh->prepare($sql);
      
      $prepare->execute();
      echo json_encode("INSERTED");
  } catch (PDOException $e) {
      $error = $e->getMessage();
      print_r($error);
  }
  $dbh = null;
