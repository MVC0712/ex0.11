<?php
  $userid = "webuser";
  $passwd = "";
  $dies_id = "";
  $prs_date = "";
  $prs_qty ="";

  $dies_id = $_POST['dies_id'];
  $prs_date = $_POST['prs_date'];
  $prs_qty = $_POST['prs_qty'];

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

          $sql_paramater[] = "('$dies_id', '$prs_date', '$prs_qty')";
        //   print_r($sql_paramater);

      $sql = "INSERT INTO t_schedule ";
      $sql = $sql."(dies_id, prs_date, prs_qty) VALUES ";
      $sql = $sql.join(",", $sql_paramater);
      $prepare = $dbh->prepare($sql);
      
      $prepare->execute();
      echo json_encode("INSERTED");
  } catch (PDOException $e) {
      $error = $e->getMessage();
      print_r($error);
  }
  $dbh = null;
