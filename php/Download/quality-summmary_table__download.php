<?php
// 21/06/18
    $dbname = "vn_pd2";
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

      $file_path = "../../download/" . $_POST["file_name"] . ".csv";
      // print_r($file_path);
      $export_csv_title = [
        "quality_code", "description_vn", "note_vn", "description_jp", "note_jp"
      ];
      $export_csv_title_sub = [
        "press_date_at", "die_number", "pressing_type", "plan_billet_quantities", "actual_billet_quantities",
        "work_quantity", "total_ng", "total_ok", "dimension_check_date", "etching_check_date",
        "aging_check_date", "packing_check_date", "code_301", "code_302", "code_303", "code_304",
        "code_305", "code_306", "code_307", "code_308", "code_309", "code_310", "code_311", "code_312",
        "code_313", "code_314", "code_315", "code_316", "code_317", "code_318", "code_319", "code_320",
        "code_321", "code_322", "code_323", "code_324", "code_351"];
      $export_sql = "
SELECT 
	DATE_FORMAT(t_press.press_date_at, '%m-%d'),
	m_dies.die_number,
	m_pressing_type.pressing_type,
	t_press.plan_billet_quantities,
	t_press.actual_billet_quantities,
	t20.work_quantity,
	t10.total_ng,
	t20.work_quantity - t10.total_ng AS total_ok,
	DATE_FORMAT(t_press.dimension_check_date, '%m-%d'),
	DATE_FORMAT(t_press.etching_check_date, '%m-%d'),
	DATE_FORMAT(t_press.aging_check_date, '%m-%d'),
	DATE_FORMAT(t_press.packing_check_date, '%m-%d'),
	t10.code_301,
	t10.code_302,
	t10.code_303,
	t10.code_304,
	t10.code_305,
	t10.code_306,
	t10.code_307,
	t10.code_308,
	t10.code_309,
	t10.code_310,
	t10.code_311,
	t10.code_312,
	t10.code_313,
	t10.code_314,
	t10.code_315,
	t10.code_316,
	t10.code_317,
	t10.code_318,
	t10.code_319,
	t10.code_320,
	t10.code_321,
	t10.code_322,
	t10.code_323,
	t10.code_324,
	t10.code_351
FROM t_press
LEFT JOIN m_pressing_type ON t_press.pressing_type_id = m_pressing_type.id
LEFT JOIN m_dies ON t_press.dies_id = m_dies.id
LEFT JOIN 
	(
		SELECT 
			t_using_aging_rack.t_press_id AS t_press_id,
			SUM(t_press_quality.ng_quantities) AS total_ng,
			SUM(CASE WHEN m_quality_code.quality_code = 301 THEN t_press_quality.ng_quantities ELSE 0 END) AS code_301,
		  SUM(CASE WHEN m_quality_code.quality_code = 302 THEN t_press_quality.ng_quantities ELSE 0 END) AS code_302,
		  SUM(CASE WHEN m_quality_code.quality_code = 303 THEN t_press_quality.ng_quantities ELSE 0 END) AS code_303,
		  SUM(CASE WHEN m_quality_code.quality_code = 304 THEN t_press_quality.ng_quantities ELSE 0 END) AS code_304,
		  SUM(CASE WHEN m_quality_code.quality_code = 305 THEN t_press_quality.ng_quantities ELSE 0 END) AS code_305,
		  SUM(CASE WHEN m_quality_code.quality_code = 306 THEN t_press_quality.ng_quantities ELSE 0 END) AS code_306,
		  SUM(CASE WHEN m_quality_code.quality_code = 307 THEN t_press_quality.ng_quantities ELSE 0 END) AS code_307,
		  SUM(CASE WHEN m_quality_code.quality_code = 308 THEN t_press_quality.ng_quantities ELSE 0 END) AS code_308,
		  SUM(CASE WHEN m_quality_code.quality_code = 309 THEN t_press_quality.ng_quantities ELSE 0 END) AS code_309,
		  SUM(CASE WHEN m_quality_code.quality_code = 310 THEN t_press_quality.ng_quantities ELSE 0 END) AS code_310,
		  SUM(CASE WHEN m_quality_code.quality_code = 311 THEN t_press_quality.ng_quantities ELSE 0 END) AS code_311,
		  SUM(CASE WHEN m_quality_code.quality_code = 312 THEN t_press_quality.ng_quantities ELSE 0 END) AS code_312,
		  SUM(CASE WHEN m_quality_code.quality_code = 313 THEN t_press_quality.ng_quantities ELSE 0 END) AS code_313,
		  SUM(CASE WHEN m_quality_code.quality_code = 314 THEN t_press_quality.ng_quantities ELSE 0 END) AS code_314,
		  SUM(CASE WHEN m_quality_code.quality_code = 315 THEN t_press_quality.ng_quantities ELSE 0 END) AS code_315,
		  SUM(CASE WHEN m_quality_code.quality_code = 316 THEN t_press_quality.ng_quantities ELSE 0 END) AS code_316,
		  SUM(CASE WHEN m_quality_code.quality_code = 317 THEN t_press_quality.ng_quantities ELSE 0 END) AS code_317,
		  SUM(CASE WHEN m_quality_code.quality_code = 318 THEN t_press_quality.ng_quantities ELSE 0 END) AS code_318,
		  SUM(CASE WHEN m_quality_code.quality_code = 319 THEN t_press_quality.ng_quantities ELSE 0 END) AS code_319,
		  SUM(CASE WHEN m_quality_code.quality_code = 320 THEN t_press_quality.ng_quantities ELSE 0 END) AS code_320,
		  SUM(CASE WHEN m_quality_code.quality_code = 321 THEN t_press_quality.ng_quantities ELSE 0 END) AS code_321,
		  SUM(CASE WHEN m_quality_code.quality_code = 322 THEN t_press_quality.ng_quantities ELSE 0 END) AS code_322,
		  SUM(CASE WHEN m_quality_code.quality_code = 323 THEN t_press_quality.ng_quantities ELSE 0 END) AS code_323,
		  SUM(CASE WHEN m_quality_code.quality_code = 324 THEN t_press_quality.ng_quantities ELSE 0 END) AS code_324,
		  SUM(CASE WHEN m_quality_code.quality_code = 351 THEN t_press_quality.ng_quantities ELSE 0 END) AS code_351
		FROM t_using_aging_rack
		LEFT JOIN t_press_quality ON t_press_quality.using_aging_rack_id = t_using_aging_rack.id
		LEFT JOIN m_quality_code ON t_press_quality.quality_code_id = m_quality_code.id
		GROUP BY t_using_aging_rack.t_press_id
	) t10 ON t10.t_press_id = t_press.id 
LEFT JOIN 
	(
		SELECT 
			t_using_aging_rack.t_press_id,
			SUM(t_using_aging_rack.work_quantity) AS work_quantity
		FROM t_using_aging_rack
		GROUP BY 	t_using_aging_rack.t_press_id
	) t20 ON t20.t_press_id = t_press.id
ORDER BY 	t_press.press_date_at DESC, t_press.press_start_at
        ";

      // Header out put
      // foreach ($export_csv_title as $key => $val) {
      //     $export_header[] = mb_convert_encoding($val, 'UTF-8', 'UTF-8');
      // }
      foreach ($export_csv_title_sub as $key => $val) {
          $export_header_sub[] = mb_convert_encoding($val, 'UTF-8', 'UTF-8'); //
      }
      /*
          Make CSV Part
       */
      if (touch($file_path)) {
          $file = new SplFileObject($file_path, "w");
          // write csv header
          // $file->fputcsv($export_header);
          $file->fputcsv($export_header_sub);
          // query database
          $stmt = $dbh->query($export_sql);
          // create csv sentences
          while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
              $file->fputcsv(mb_convert_encoding($row, 'UTF-8', 'UTF-8')); // SJISに変換する
          }
      }
      echo json_encode("Made a CSV file aa");
  } catch (PDOException $e) {
      print('Connection failed:'.$e->getMessage());
      die();
  }

    // close database connection
  $dbh = null;
